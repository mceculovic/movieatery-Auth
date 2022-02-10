const express = require('express');
const { Seat, Theatre, SeatLayout } = require("../models");
const Joi = require("joi");
const authToken = require("../middlewares/restAuth.js");
const moderatorAuth = require("../middlewares/moderatorAuth.js");
const seatlayout = require('../models/seatlayout');

const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({extended: true}));

route.get('/seatslayout', async (req, res) => {
    let seatLayouts = null;
    try{
        console.log("Usao");
        seatLayouts = await SeatLayout.findAll({
            include: 'theatre'
        });
        res.json(seatLayouts);
    }catch(error){
        res.status(500).json({msg: error});
        console.log(error);
    }
   
});

route.get('/seatslayout/:id', async (req, res) => {
    try{
        let seatLayout = await SeatLayout.findOne({where: {id: req.params.id}});
        if(!seatLayout){
            res.status(404).json({msg: "Seat layout with given id doesn't exist."});
            return;
        }
        res.json(seatLayout);
    }catch(error){
        res.status(500).json(error);
    }
   
});


route.post('/seatslayout', [authToken,moderatorAuth],async (req, res) => {
    try{
        let {error, value} = validate(req.body);
       if(error){
           res.status(400).json({msg: error.details[0].message});
           return;
       }

        let theatre = await Theatre.findOne({where: {id: value.theatreId}});
        if(!theatre){
            res.status(404).send({msg: "Theatre with the given id does not exist."});
            return;
        }

        let seatLayout = await SeatLayout.findOne({where: {theatreId: value.theatreId}})
        if(seatLayout){
            res.status(400).send({msg: "Seat layout for given theatre already exists."});
            return;
        }
        if((value.rows * value.numbers) > theatre.capacity){
            res.status(400).send({msg: "Given number of seats are exceeding capacity."});
            return;
        }

        let seats = new Array();

        for(let i = 1; i <= value.rows; i++){
            for(let j = 1; j <= value.numbers; j++){
                seats.push(await Seat.create({row: i, number: j, theatreId: theatre.id}));
            }
        }
        seatLayout = await SeatLayout.create({rows: value.rows, numbers: value.numbers, theatreId: theatre.id});
        res.json(seatLayout);
    }catch(error){
        res.status(500).json(error);
    }
});

route.delete('/seatslayout/:id', [authToken,moderatorAuth], async (req, res) => {
    try{
        let seatlayout = await SeatLayout.findOne({where: {id: req.params.id}});
        if(!seatlayout){
            res.status(404).json({msg: "Seat layout with given id doesn't exist."});
            return;
        }
        console.log("PROSAO");
     

        await Seat.destroy({where: { theatreId: seatlayout.theatreId}});

        console.log("prosao");

        seatlayout = await seatlayout.destroy();
        res.send(seatlayout);

    }catch(error){
        res.status(500).json(error);
    }
});

route.put('/seatslayout/:id',  [authToken,moderatorAuth],async (req, res) => {
    try{
        let {error, value} = validate(req.body);
        if(error){
            res.status(400).json({msg: error.details[0].message});
            return;
        }

        let seatLayout = await SeatLayout.findOne({where: {id: req.params.id}});

        if(!seatLayout){
            res.status(404).json({msg: "Seat layout with given id doesn't exist"});
            return;
        }

        let theatre = await Theatre.findOne({where: {id: value.theatreId}});

        if(!theatre){
            res.status(404).json({msg: "Theatre with given id doesn't exist"});
            return;
        }


        await Seat.destroy({where: { theatreId: seatLayout.theatreId}});


        for(let i = 1; i <= value.rows; i++){
            for(let j = 1; j <= value.numbers; j++){
                await Seat.create({row: i, number: j, theatreId: theatre.id});
            }
        }

        seatLayout = await seatLayout.update(value);

        res.json(seatLayout);

    }catch(error){
        res.status(500).json(error);
    }
});


function validate(seatLayout){
    const schema = Joi.object({
        rows: Joi.number().min(1).max(30).required(),
        numbers: Joi.number().min(1).max(30).required(),
        theatreId: Joi.number().required(),

    });
    return schema.validate(seatLayout);
}

module.exports = route;