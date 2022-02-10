const express = require('express');
const { Actor, Movie } = require("../models");
const Joi = require("joi");
const authToken = require("../middlewares/restAuth.js");
const moderatorAuth = require("../middlewares/moderatorAuth.js");

const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({extended: true}));


route.post('/cast', [authToken,moderatorAuth],async (req, res) => {
    try{
        let {error, value} = validateId(req.body);
       if(error){
           res.status(400).send({msg: error.details[0].message});
           return;
       }
        let movie = await Movie.findOne({where: {id: value.movieId}, include: Actor});
        let actor = await Actor.findOne({where: {id: value.actorId}});

        if(!movie){
            res.status(404).send({msg: "Movie with given id doesn't exist."});
            return;
        }
        if(!actor){
            res.status(404).send({msg: "Actor with given id doesn't exist."});
            return;
        }
     
        let hasActor = await movie.hasActor(actor);
    
        if(hasActor){
            res.status(400).send({msg: "Actor already acts in given movie."})
            return;
        }

        await movie.addActor(actor);

        
        res.json(actor);
    }catch(error){
        res.status(500).json({msg: error});
    }
});

route.delete('/cast/:movieId/:actorId', [authToken,moderatorAuth],async (req, res) => {
    try{

        let movie = await Movie.findOne({where: {id: req.params.movieId}, include: Actor});
        let actor = await Actor.findOne({where: {id: req.params.actorId}});

        if(!movie){
            res.status(404).send({msg: "Movie with given id doesn't exist."});
            return;
        }
        if(!actor){
            res.status(404).send({msg: "Actor with given id doesn't exist."});
            return;
        }
        
        let hasActor = await movie.hasActor(actor);
      
        if(!hasActor){
            res.status(400).send({msg: "Actor does not act in given movie."})
            return;
        }


        await movie.removeActor(actor);

        res.send(actor);

    }catch(error){
        res.status(500).json(error);
    }
});

function validateId(data){
    const schema = Joi.object({
        movieId: Joi.number(),
        actorId: Joi.number(),

    });
    return schema.validate(data);
}

module.exports = route;