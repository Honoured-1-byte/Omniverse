const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
    res.send('hello i am ROOT PATH');
});

app.get('/:username/:id', (req, res) => {
    let { username, id } = req.params;
    res.send(`YOU CONTACTED 
        ${username} with ID ${id}`);
});

// 🔻 This line is required to start the server
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
app.get("/search", (req, res) => {
    let { q } = req.query;
    console.log(q);
    res.send(`YOU SEARCHED FOR ${q}`);
});
