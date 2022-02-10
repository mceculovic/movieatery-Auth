const express = require('express');
const { Genre } = require("../models");
const Joi = require("joi");
const authToken = require("../middlewares/restAuth.js");
const moderatorAuth = require("../middlewares/moderatorAuth.js");

const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({extended: true}));


route.get('/genres', async (req, res) => {
    let genres = null;
    try{
        genres = await Genre.findAll();
        res.json(genres);
    }catch(error){
        res.status(500).json({msg: error});
    }
   
});

route.get('/genres/:id', async (req, res) => {
    try{
        let genre = await Genre.findOne({where: {id: req.params.id}});
        if(!genre){
            res.status(404).json({msg: "Genre with given id doesn't exist."});
            return;
        }
        res.json(genre);
    }catch(error){
        res.status(500).json(error);
    }
   
});


route.post('/genres', [authToken,moderatorAuth] ,async (req, res) => {
    try{
        
        let {error, value} = validate(req.body);
       if(error){
           res.status(400).json({msg: error.details[0].message});
           return;
       }
       let genre = await Genre.findOne({where: {name: value.name}});
       if(genre){
        res.status(400).send({msg: "Genre with the given name already exists!"});
        return;
       }
         genre = await Genre.create(value);
        res.json(genre);
    }catch(error){
        res.status(500).json(error);
    }
});


route.delete('/genres/:id', [authToken,moderatorAuth], async (req, res) => {
    try{
        let genre = await Genre.findOne({where: {id: req.params.id}});
        if(!genre){
            res.status(404).json({msg: "Genre with given id doesn't exist."});
            return;
        }
        genre = await genre.destroy();
        res.send(genre);

    }catch(error){
        res.status(500).json(error);
    }
});

route.put('/genres/:id', [authToken,moderatorAuth],async (req, res) => {
    try{
        let {error, value} = validate(req.body);
        if(error){
            res.status(400).json({msg: error.details[0].message});
            return;
        }
        
        let genre = await Genre.findOne({where: {id: req.params.id}});
        if(!genre){
            res.status(404).json({msg: "Genre with given id doesn't exist"});
            return;
        }

        genre = await genre.update(value);

        res.json(genre);

    }catch(error){
        res.status(500).json(error);
    }
});


function validate(genre){
    const schema = Joi.object({
        name: Joi.string().min(3).max(20).required()

    });
    return schema.validate(genre);
}

module.exports = route;