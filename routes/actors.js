const express = require('express');
const { Actor } = require("../models");
const Joi = require("joi");
const authToken = require("../middlewares/restAuth.js");
const moderatorAuth = require("../middlewares/moderatorAuth.js");

const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({extended: true}));


route.get('/actors', async (req, res) => {
    let actors = null;
    try{
        actors = await Actor.findAll();
        res.json(actors);
    }catch(error){
        res.status(500).json(error);
    }
   
});

route.get('/actors/:id', async (req, res) => {
    try{
        let actor = await Actor.findOne({where: {id: req.params.id}});
        if(!actor){
            res.status(404).json({msg: "Actor with given id doesn't exist."});
            return;
        }
        res.json(actor);
    }catch(error){
        res.status(500).json(error);
    }
   
});


route.post('/actors', [authToken,moderatorAuth],async (req, res) => {
    try{
        let {error, value} = validate(req.body);
       if(error){
           res.status(400).send({msg: error.details[0].message});
           return;
       }
        let actor = await Actor.findOne({where: {firstName: value.firstName, lastName: value.lastName}});
        if(actor){
            res.status(400).send({msg: "Actor already exists!"});
            return;
        }
        actor = await Actor.create(value);
        res.json(actor);
    }catch(error){
        res.status(500).json(error);
    }
});

route.delete('/actors/:id', [authToken,moderatorAuth],async (req, res) => {
    try{
        let actor = await Actor.findOne({where: {id: req.params.id}});
        if(!actor){
            res.status(404).send({msg: "Actor with given id doesn't exist."});
            return;
        }
        actor = await actor.destroy();
        res.send(actor);

    }catch(error){
        res.status(500).json(error);
    }
});

route.put('/actors/:id', [authToken,moderatorAuth], async (req, res) => {
    try{
        let {error, value} = validate(req.body);
        if(error){
            res.status(400).send({msg: error.details[0].message});
            return;
        }
        
        let actor = await Actor.findOne({where: {id: req.params.id}});
        if(!actor){
            res.status(404).send({msg: "Actor with given id doesn't exist."});
            return;
        }

        actor = await actor.update(value);

        res.json(actor);

    }catch(error){
        res.status(500).json(error);
    }
});


function validate(actor){
    const schema = Joi.object({
        firstName: Joi.string().min(3).max(30).required(),
        lastName: Joi.string().min(3).max(30).required(),
        birth: Joi.date().min('1-1-1900').max('now').required(),
        birthPlace: Joi.string().min(5).max(30).required(),
        gender: Joi.string().min(1).max(1).required(),

    });
    return schema.validate(actor);
}



module.exports = route;