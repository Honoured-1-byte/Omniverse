const express = require('express');
const app = express();
const path = require('path');
const port =8080;

app.set('view engine', 'ejs');

app.set("views",path.join(__dirname, "/views"));
app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.get('/hello', (req, res) => {
    res.render('home');
});

app.get('/rolldice', (req, res) => {
    let diceval=Math.floor(Math.random() * 6) + 1;
    res.render('rolldice.ejs',{num: diceval});
});

app.get('/ig/:username', (req, res) => {
    const followers = ["ram", "shyam", "hari", "sita", "gita"];
    let {username} = req.params;
    // console.log(username);
    res.render('instagram.ejs', {username, followers});
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});