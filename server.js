const express = require('express');
const app = express();
const data = require('./data/products.json');
const messages = require('./messages');
const port = process.env.PORT || 3000;

app.get('/api/products', (req, res) => {
    res.send(data);
});

app.get('/api/products/:id', (req, res) => {
    let item = data.find((item) => item.id === req.params.id);
    if(!item) {
        res.status(404).send(messages.item_not_fund);
    }
    res.send(item);
});


app.listen(port, () => console.log(`App listening on port ${port}... `));
