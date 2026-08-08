require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// Custom object: Books
const CUSTOM_OBJECT_TYPE = '2-67172877';

// ROUTE 1 - app.get route for the homepage. Fetches all Book records (with custom properties) and renders them in a table.
app.get('/', async (req, res) => {
    const booksUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?properties=name,author,genre`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(booksUrl, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Homepage | Integrating With HubSpot I Practicum', data });
    } catch (error) {
        console.error(error.response ? error.response.data : error);
        res.status(500).send('Error fetching custom object records');
    }
});

// ROUTE 2 - app.get route that renders the form for creating a new custom object record.
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// ROUTE 3 - app.post route that takes the form data and creates a new custom object record, then redirects to the homepage.
app.post('/update-cobj', async (req, res) => {
    const newBook = {
        properties: {
            name: req.body.name,
            author: req.body.author,
            genre: req.body.genre
        }
    };

    const createUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(createUrl, newBook, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error.response ? error.response.data : error);
        res.status(500).send('Error creating the custom object record');
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
