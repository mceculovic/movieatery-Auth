const express = require('express');
const { sequelize } = require('./models');
const users = require("./routes/users");
const genres = require("./routes/genres");
const movies = require("./routes/movies");
const actors = require("./routes/actors");
const directors = require("./routes/directors");
const theatres = require("./routes/theatres");
const cast = require("./routes/cast");
const directs = require("./routes/directs");
const showtimes = require('./routes/showtimes');
const seats = require('./routes/seats');
const reservations = require('./routes/reservations');
const seatReservations = require('./routes/seatreserved');
const seatlayouts = require("./routes/seatlayouts");
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();



const app = express();


const cors = require('cors');


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    },
    allowEIO3: true
});

app.io = io;

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
    credentials: true
}
app.use(cors(corsOptions));



app.use("/api", users);
app.use("/api", genres);
app.use("/api", movies);
app.use("/api", actors);
app.use("/api", directors);
app.use("/api", theatres);
app.use("/api", cast);
app.use("/api", directs);
app.use("/api", showtimes);
app.use("/api", seats);
app.use("/api", reservations);
app.use("/api", seatReservations);
app.use("/api", seatlayouts);




const port = process.env.PORT || 8000;

server.listen(port, async () =>{
    console.log("Listening on port " + port + "...");
    await sequelize.authenticate();
});