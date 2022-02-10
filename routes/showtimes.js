const express = require('express');
const { Showtimes, Theatre, Movie, Seat, Reservation, Actor, Director } = require("../models");
const Joi = require("joi");
const authToken = require("../middlewares/restAuth.js");
const moderatorAuth = require("../middlewares/moderatorAuth.js");

const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({extended: true}));

route.get('/showtimes', async (req, res) => {
    let showtimes = null;
    try{
        showtimes = await Showtimes.findAll({
            include: [{model: Movie, include: ['genre', Actor, Director]},{model: Theatre, include: {model: Seat, as: 'seats'}}]
        });
        res.json(showtimes);
    }catch(error){
        res.status(500).json({msg: error});
    }
   
});

route.get('/showtimes/:id', async (req, res) => {
    try{
        let showtimes = await Showtimes.findOne({where: {id: req.params.id}, include: ['reservations',{model: Movie, include: ['genre',Actor,Director]}, {model: Theatre, include: {model: Seat, as:'seats'}}]});
        if(!showtimes){
            res.status(404).json({msg: "Showtime with given id doesn't exist."});
            return;
        }
        res.json(showtimes);
    }catch(error){
        res.status(500).json(error);
    }
   
});

route.put('/showtimes/:id', [authToken,moderatorAuth], async (req, res) => {
    try{
        let {error, value} = validateShowtime(req.body);
        if(error){
            res.status(400).json({msg: error.details[0].message});
            return;
        }
        
        let showtimes = await Showtimes.findOne({where: {id: req.params.id}});
        if(!showtimes){
            res.status(404).json({msg: "Showtime with given id doesn't exist"});
            return;
        }

        showtimes = await showtimes.update(value);

        res.json(showtimes);

    }catch(error){
        res.status(500).json(error);
    }
});

route.post('/showtimes', [authToken,moderatorAuth], async (req, res) => {
    try{
        let {error, value} = validateShowtime(req.body);
       if(error){
           res.status(400).send({msg: error.details[0].message});
           return;
       }
    
        let showtimes = await Showtimes.findOne({where: {movieId: value.movieId, theatreId: value.theatreId, startDate: value.startDate,
                                                time: value.time}});
     
     
        if(showtimes){
            res.status(400).send({msg: "Showtime already exists for given movie and theatre at given time!"});
            return;
        }

        showtimes = await Showtimes.create(value);

        res.json(showtimes);
    }catch(error){
        res.status(500).json({msg: error});
    }
});

route.delete('/showtimes/:id', [authToken,moderatorAuth], async (req, res) => {
    try{


        let showtimes = await Showtimes.findOne({where: {id: req.params.id}});
     
        if(!showtimes){
            res.status(404).send({msg: "Showtime with given id doesn't exist."});
            return;
        }
        
        await showtimes.destroy();

        res.send(showtimes);

    }catch(error){
        res.status(500).json(error);
    }
});

function validateShowtime(data){
    const schema = Joi.object({
        movieId: Joi.number().required(),
        theatreId: Joi.number().required(),
        startDate: Joi.string().regex(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)
        .length(10).required(),
        time: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/).required(),
        ticketPrice: Joi.number().min(0).max(1000000).required()

    });
    return schema.validate(data);
}

module.exports = route;