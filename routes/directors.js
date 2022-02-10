const express = require('express');
const { Director } = require("../models");
const Joi = require("joi");
const authToken = require("../middlewares/restAuth.js");
const moderatorAuth = require("../middlewares/moderatorAuth.js");

const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({extended: true}));


route.get('/directors', async (req, res) => {
    let directors = null;
    try{
        directors = await Director.findAll();
        res.json(directors);
    }catch(error){
        res.status(500).json(error);
    }
   
});

route.get('/directors/:id', async (req, res) => {
    try{
        let director = await Director.findOne({where: {id: req.params.id}});
        if(!director){
            res.status(404).json({msg: "Director with given id doesn't exist."});
            return;
        }
        res.json(director);
    }catch(error){
        res.status(500).json(error);
    }
   
});


route.post('/directors',[authToken,moderatorAuth], async (req, res) => {
    try{
        let {error, value} = validate(req.body);
       if(error){
           res.status(400).json({msg: error.details[0].message});
           return;
       }
        let director = await Director.findOne({where: {firstName: value.firstName, lastName: value.lastName}});
        if(director){
            res.status(400).json({msg: "Director already exists!"});
            return;
        }
        director = await Director.create(value);
        res.json(director);
    }catch(error){
        res.status(500).json(error);
    }
});

route.delete('/directors/:id', [authToken,moderatorAuth],async (req, res) => {
    try{
        let director = await Director.findOne({where: {id: req.params.id}});
        if(!director){
            res.status(404).json({msg: "Director with given id doesn't exist."});
            return;
        }
        director = await director.destroy();
        res.send(director);

    }catch(error){
        res.status(500).json(error);
    }
});

route.put('/directors/:id', [authToken,moderatorAuth],async (req, res) => {
    try{
        let {error, value} = validate(req.body);
        if(error){
            res.status(400).json({msg: error.details[0].message});
            return;
        }
        
        let director = await Director.findOne({where: {id: req.params.id}});
        if(!director){
            res.status(404).json({msg: "Director with given id doesn't exist"});
            return;
        }

        director = await director.update(value);

        res.json(director);

    }catch(error){
        res.status(500).json(error);
    }
});


function validate(director){
    const schema = Joi.object({
        firstName: Joi.string().min(3).max(30).required(),
        lastName: Joi.string().min(3).max(30).required(),
        birth: Joi.date().min('1-1-1900').max('now').required(),
        birthPlace: Joi.string().min(5).max(30).required(),
        gender: Joi.string().min(1).max(1).required(),


    });
    return schema.validate(director);
}

module.exports = route;