const express = require('express');
const { SeatReserved, Reservation, Seat } = require("../models");
const Joi = require("joi");
const authToken = require("../middlewares/restAuth.js");
const moderatorAuth = require("../middlewares/moderatorAuth.js");

const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({extended: true}));

route.get('/seatreservations', async (req, res) => {
    let seatReservations = null;
    try{
        seatReservations = await SeatReserved.findAll();
        res.json(seatReservations);
    }catch(error){
        res.status(500).json({msg: error});
    }
   
});

route.get('/seatreservations/:id', async (req, res) => {
    try{
        let seatReservation = await SeatReserved.findOne({where: {id: req.params.id}});
        if(!seatReservation){
            res.status(404).json({msg: "Seat reservation with given id doesn't exist."});
            return;
        }
        res.json(seatReservation);
    }catch(error){
        res.status(500).json(error);
    }
   
});

route.get('/seatshowtime/:id', async (req, res) => {
    try{
        let seatReservations = await SeatReserved.findAll();
        let seatReserved = [];
        for(let s of seatReservations){
            let reservation = await Reservation.findOne({where: {id: s.reservationId}});
            if(reservation.showtimesId == req.params.id){
                seatReserved.push(s.seatId);
            }
        }
        res.json(seatReserved);
    }catch(error){
        res.status(500).json(error);
    }
});


route.post('/seatreservations',authToken, async (req, res) => {
    try{
        let {error, value} = validate(req.body);
       if(error){
           res.status(400).json({msg: error.details[0].message});
           return;
       }
        let seat = await Seat.findOne({where: {id: value.seatId}});
        let reservation = await Reservation.findOne({where: {id: value.reservationId}});
        let seatReservation = await SeatReserved.findOne({where: {seatId: value.seatId, reservationId: value.reservationId}});

        if(!seat){
            res.status(404).send({msg: "Seat with given id does not exist."});
            return;
        }

        if(!reservation){
            res.status(404).send({msg: "Reservation with given id does not exist."});
            return;
        }

        if(seatReservation){
            res.status(400).send({msg: "Seat already reserved!"});
            return;
        }
        seatReservation = await SeatReserved.create(value);
        res.json(seatReservation);
    }catch(error){
        res.status(500).json(error);
    }
});

route.delete('/seatreservations/:id',authToken, async (req, res) => {
    try{
        let seatReservation = await SeatReserved.findOne({where: {id: req.params.id}});
        if(!seatReservation){
            res.status(404).json({msg: "Seat reservation with given id doesn't exist."});
            return;
        }
        seatReservation = await seatReservation.destroy();
        res.send(seatReservation);

    }catch(error){
        res.status(500).json(error);
    }
});

route.put('/seatreservations/:id',authToken, async (req, res) => {
    try{
        let {error, value} = validate(req.body);
        if(error){
            res.status(400).json({msg: error.details[0].message});
            return;
        }
        
        let seat = await Seat.findOne({where: {id: value.seatId}});
        let reservation = await Reservation.findOne({where: {id: value.reservationId}});
        let seatReservation = await SeatReserved.findOne({where: {id: req.params.id}});

        if(!seat){
            res.status(404).send({msg: "Seat with given id does not exist."});
            return;
        }

        if(!reservation){
            res.status(404).send({msg: "Reservation with given id does not exist."});
            return;
        }
        if(!seatReservation){
            res.status(404).json({msg: "Seat reservation with given id doesn't exist"});
            return;
        }

        seatReservation = await seatReservation.update(value);

        res.json(seatReservation);

    }catch(error){
        res.status(500).json(error);
    }
});


function validate(seatReservation){
    const schema = Joi.object({
        reservationId: Joi.number().min(1).max(1000000).required(),
        seatId: Joi.number().min(1).max(1000000).required(),
     

    });
    return schema.validate(seatReservation);
}

module.exports = route;