const express = require('express');
const { Seat, Theatre } = require("../models");
const authToken = require("../middlewares/restAuth.js");

const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({extended: true}));

route.get('/seats', async (req, res) => {
    let seats = null;
    try{
        seats = await Seat.findAll({
            include: "theatre"
        });
        res.json(seats);
    }catch(error){
        res.status(500).json({msg: error});
    }
   
});

route.get('/seats/:theatreId', async (req, res) => {
    try{
        let seats = await Seat.findAll({where: {theatreId: req.params.theatreId}});
        if(seats.length <= 0){
            res.status(404).json({msg: "Seats with given theatre don't exist."});
            return;
        }

        res.json(seats);
    }catch(error){
        res.status(500).json(error);
    }
   
});





module.exports = route;