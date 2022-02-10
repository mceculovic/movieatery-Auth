const express = require('express');
const { Reservation, User, Showtimes, Movie, Theatre, Seat, SeatReserved } = require("../models");
const Joi = require("joi");
const authToken = require("../middlewares/restAuth.js");
const moderatorAuth = require("../middlewares/moderatorAuth.js");

const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({extended: true}));


route.get('/reservations', async (req, res) => {
    let reservations = null;
    try{
        reservations = await Reservation.findAll({
            include: ['user', {model: Showtimes, as:'showtime', include: [Movie,Theatre]}, {model: Seat, as: 'seats'}]
        });
        res.json(reservations);
    }catch(error){
        res.status(500).json({msg: error});
    }
   
});

route.get('/reservations/:id', async (req, res) => {
    try{
        let reservation = await Reservation.findOne({where: {id: req.params.id}, include:{model: Seat, as: 'seats'}});
        if(!reservation){
            res.status(404).json({msg: "Reservation with given id doesn't exist."});
            return;
        }
        res.json(reservation);
    }catch(error){
        res.status(500).json(error);
    }
   
});


route.post('/reservations', authToken ,async (req, res) => {
    try{
        let {error, value} = validate(req.body);
       if(error){
           res.status(400).json({msg: error.details[0].message});
           return;
       }
        let showtime = await Showtimes.findOne({where: {id: value.showtimesId}});
        let user = await User.findOne({where: {id: value.userId}});
        let reservation = await Reservation.findOne({where: {userId: value.userId, showtimesId: value.showtimesId}});

        if(!showtime){
            res.status(404).send({msg: "Showtime with given id doesn't exist."});
            return;
        }

        if(!user){
            res.status(404).send({msg: "User with given id doesn't exist."});
            return;
        }

        let seats = [];
        let reservedSeats = [];

        for(let i = 0; i < value.seats.length; i++){
            let seat = await Seat.findOne({where: {id: value.seats[i]}});
            if(!seat){
                res.status(404).json({msg: "Seat with id " + s[i] + " does not exist."});
                return;
            }

            seats.push(seat);
        }

        reservation = await Reservation.create(value);

        seats.forEach(async (s) =>{
            await SeatReserved.create({reservationId: reservation.id, seatId: s.id});
        });

        req.app.io.emit('reservation', JSON.stringify(value.seats));
        res.json(reservation);
    }catch(error){
        res.status(500).json(error);
    }
});

route.delete('/reservations/:id', [authToken,moderatorAuth],async (req, res) => {
    try{
        let reservation = await Reservation.findOne({where: {id: req.params.id}});
        if(!reservation){
            res.status(404).json({msg: "Reservation with given id doesn't exist."});
            return;
        }
        reservation = await reservation.destroy();
        res.send(reservation);

    }catch(error){
        res.status(500).json(error);
    }
});

route.put('/reservations/:id', [authToken,moderatorAuth],async (req, res) => {
    try{
        let {error, value} = validate(req.body);
        if(error){
            res.status(400).json({msg: error.details[0].message});
            return;
        }
        let showtime = await Showtimes.findOne({where: {id: value.showtimesId}});
        let user = await User.findOne({where: {id: value.userId}});
        let reservation = await Reservation.findOne({where: {id: req.params.id}});
        
        if(!reservation){
            res.status(404).json({msg: "Reservation with given id doesn't exist"});
            return;
        }
        if(!showtime){
            res.status(404).send({msg: "Showtime with given id doesn't exist."});
            return;
        }

        if(!user){
            res.status(404).send({msg: "User with given id doesn't exist."});
            return;
        }


        reservation = await reservation.update(value);

        res.json(reservation);

    }catch(error){
        res.status(500).json(error);
    }
});


function validate(reservation){
    const schema = Joi.object({
        userId: Joi.number().min(1).max(1000000).required(),
        paid: Joi.boolean(),
        showtimesId: Joi.number().min(1).max(1000000).required(),
        seats: Joi.array().items(Joi.number()).min(1).max(10).required(),

    });
    return schema.validate(reservation);
}

module.exports = route;