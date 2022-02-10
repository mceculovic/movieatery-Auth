const express = require('express');
const path = require('path');
const authToken = require('./middlewares/clientAuth.js');
const adminAuth = require('./middlewares/adminAuth.js');
const moderatorAuth = require("./middlewares/moderatorAuth.js");
const cors = require('cors');



const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use(cors());


app.get('/movies/images/:image', (req,res) => {
    res.sendFile(`${req.params.image}`, { root: './images/movies'});
});

app.get('/theatres/images/:image', (req,res) => {
    res.sendFile(`${req.params.image}`, { root: './images/theatres'});
});

app.get('/admin', [authToken,moderatorAuth],(req, res) => {
    res.sendFile('index.html', { root: './static/admin' });
});

app.get('/admin/users', [authToken,adminAuth],(req, res) => {
    res.sendFile('users.html', { root: './static/admin/users' });
});

app.get('/admin/movies', [authToken, moderatorAuth], (req, res) => {
    res.sendFile('movies.html', { root: './static/admin/movies'});
});

app.get('/admin/actors', [authToken, moderatorAuth], (req, res) => {
    res.sendFile('actors.html', { root: './static/admin/actors'});
});

app.get('/admin/directors', [authToken, moderatorAuth], (req, res) => {
    res.sendFile('directors.html', { root: './static/admin/directors'});
});

app.get('/admin/theatres', [authToken, moderatorAuth], (req, res) => {
    res.sendFile('theatres.html', { root: './static/admin/theatres'});
});

app.get('/admin/showtimes', [authToken, moderatorAuth], (req, res) => {
    res.sendFile('showtimes.html', { root: './static/admin/showtimes'});
});

app.get('/admin/reservations', [authToken, moderatorAuth], (req, res) => {
    res.sendFile('reservations.html', { root: './static/admin/reservations'});
});

app.get('/admin/login', (req, res) => {
    res.sendFile('login.html', { root: './static/admin/login' });
});



app.use(express.static(path.join(__dirname, 'static')));


const port = 10000;

app.listen(port, async () =>{
    console.log("Listening on port " + port + "...");
});