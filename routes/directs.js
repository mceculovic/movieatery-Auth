const express = require('express');
const { Director, Movie } = require("../models");
const Joi = require("joi");
const authToken = require("../middlewares/restAuth.js");
const moderatorAuth = require("../middlewares/moderatorAuth.js");

const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({extended: true}));


route.post('/directs',[authToken,moderatorAuth], async (req, res) => {
    try{
        let {error, value} = validateId(req.body);
       if(error){
           res.status(400).send({msg: error.details[0].message});
           return;
       }
        let movie = await Movie.findOne({where: {id: value.movieId}, include: Director});
        let director = await Director.findOne({where: {id: value.directorId}});

        if(!movie){
            res.status(404).send({msg: "Movie with given id doesn't exist."});
            return;
        }
        if(!director){
            res.status(404).send({msg: "Director with given id doesn't exist."});
            return;
        }
     
        let hasDirector = await movie.hasDirector(director);
    
        if(hasDirector){
            res.status(400).send({msg: "Director already directs the given movie."})
            return;
        }

        await movie.addDirector(director);

        
        res.json(director);
    }catch(error){
        res.status(500).json({msg: error});
    }
});

route.delete('/directs/:movieId/:directorId', [authToken,moderatorAuth],async (req, res) => {
    try{

        let movie = await Movie.findOne({where: {id: req.params.movieId}, include: Director});
        let director = await Director.findOne({where: {id: req.params.directorId}});

        if(!movie){
            res.status(404).send({msg: "Movie with given id doesn't exist."});
            return;
        }
        if(!director){
            res.status(404).send({msg: "Director with given id doesn't exist."});
            return;
        }
        
        let hasDirector = await movie.hasDirector(director);
      
        if(!hasDirector){
            res.status(400).send({msg: "Director does not direct the given movie."})
            return;
        }


        await movie.removeDirector(director);

        res.send(director);

    }catch(error){
        res.status(500).json(error);
    }
});

function validateId(data){
    const schema = Joi.object({
        movieId: Joi.number(),
        directorId: Joi.number(),

    });
    return schema.validate(data);
}

module.exports = route;