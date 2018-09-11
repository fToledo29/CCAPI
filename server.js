 // --Express.
const express = require('express');
const app = express();
// --Util libraries
const Joi =  require('joi');
require('dotenv').config();
const config = require('config');
const morgan = require('morgan');
// const helmet = require('helmet');
// --Middlewares
const logger = require('./custom-middlewares/logger');
const auth = require('./custom-middlewares/authentication');
// --Data.
const products = require('./data/products.json');
const messages = require('./messages');
const port = process.env.PORT || 3000;

// Configuration
console.log('Current environment: ', process.env.NODE_ENV);
console.log('Mail server: ', config.get('mail.host'));
console.log('Application name: ', config.get('name'));
// console.log('Mail Password: ', config.get('mail.password'));

// ***** Custom middlewares *****
// *(logger)*
app.use(auth);
// *(Authentication)*
app.use(logger);
// ***** Third-party middlewares *****
app.use(express.json());
// app.use(helmet());
console.log('Getting env: ', app.get('env'));
if(app.get('env.NODE_ENV') === 'development') {
    app.use(morgan('tiny'));
    console.log('Morgan enabled...');    
}

/**
 * Gets all the stored products.
 */
app.get('/api/products', (req, res) => {
    res.send(products);
});

/**
 * Gets a product based on the given id
 */
app.get('/api/products/:id', (req, res) => {
    let item = products.find((item) => item.id === req.params.id);
    if(!item) {
        return res.status(404).send(messages.item_not_fund);
    }
    res.send(item);
});

/**
 * Posts a new product based on the given data.
 */
app.post('/api/products/', (req, res) => {
    const { error } = validateItem(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    let itemId = parseInt(products.slice(-1).pop().id) + 1
    const newItem = {
        name: req.body.name,
        description: req.body.description,
        id: itemId.toString()
    }
    products.push(newItem);
    res.send(newItem)
});

/**
 * Updates an item based on the given Id
 */
app.put('/api/products/:id', (req, res) => {
    const item = products.find((item) => item.id === req.params.id);
    if(!item) {
        return res.status(404).send(messages.name_no_exist);
    }
    const { error } = validateItem(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    item.name = req.body.name;
    res.send(item);
});

/**
 * Deletes an Item based on the given Id. 
 */
app.delete('/api/products/:id', (req, res) => {
    const item = products.find((item) => item.id === req.params.id);
    if(!item) {
        return res.status(404).send(messages.name_no_exist);
    }
    const index = products.indexOf(item);
    products.splice(index, 1);
    res.send(item);

});

function validateItem(item) {
    const schema = {
        name: Joi.string().min(4).required()
    }
    return Joi.validate(item,schema);
}




app.listen(port, () => console.log(`App listening on port ${port}... `));
