const express = require('express');
const { Movie, Actor, Director, Genre } = require("../models");
const Joi = require("joi");
const authToken = require("../middlewares/restAuth.js");
const moderatorAuth = require("../middlewares/moderatorAuth.js");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, path.dirname(__dirname) + "/images/movies");
    },
    filename: (req, file, cb) =>{
        console.log(file);
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({extended: true}));

route.get('/movies', async (req, res) => {
    let movies = null;
    try{
        movies = await Movie.findAll({
            include: [Actor,Director,'genre']
        });
        res.json(movies);
    }catch(error){
        res.status(500).json({msg: error});
    }
   
});

route.get('/movies/:id', async (req, res) => {
    try{
        let movie = await Movie.findOne({where: {id: req.params.id}, include: [Actor,Director,'genre']});
        if(!movie){
            res.status(404).json({msg: "Movie with given id doesn't exist."});
            return;
        }
        res.json(movie);
    }catch(error){
        res.status(500).json(error);
    }
   
});


route.post('/movies', [authToken,moderatorAuth, upload.single('files')] ,async (req, res) => {
    try{
        
        let {error, value} = validate(req.body);
       if(error){
           res.status(400).json({msg: error.details[0].message});
           return;
       }
       let genre = await Genre.findOne({where: {id: value.genreId}});
       if(!genre){
           res.status(404).json({msg: "Genre with given id doesn't exist."});
           return;
       }

        let movie = await Movie.findOne({where: {title: value.title}});
        if(movie){
            res.status(400).send({msg: "Movie with the given title already exists!"});
            return;
        }
        value.imageFileName = req.file.originalname;
         movie = await Movie.create(value);
        res.json(movie);
    }catch(error){
        res.status(500).json(error);
    }
});


route.delete('/movies/:id', [authToken,moderatorAuth], async (req, res) => {
    try{
        let movie = await Movie.findOne({where: {id: req.params.id}});
        if(!movie){
            res.status(404).json({msg: "Movie with given id doesn't exist."});
            return;
        }
        movie = await movie.destroy();
        res.send(movie);

    }catch(error){
        res.status(500).json(error);
    }
});

route.put('/movies/:id', [authToken,moderatorAuth],async (req, res) => {
    try{
        let {error, value} = validate(req.body);
        if(error){
            res.status(400).json({msg: error.details[0].message});
            return;
        }
        
        let movie = await Movie.findOne({where: {id: req.params.id}});
        if(!movie){
            res.status(404).json({msg: "Movie with given id doesn't exist"});
            return;
        }

        let genre = await Genre.findOne({where: {id: value.genreId}});
        if(!genre){
            res.status(404).json({msg: "Genre with given id doesn't exist."});
            return;
        }

        movie = await movie.update(value);

        res.json(movie);

    }catch(error){
        res.status(500).json(error);
    }
});


function validate(movie){
    const schema = Joi.object({
        title: Joi.string().min(2).max(30).required(),
        releaseYear: Joi.number().min(1900).max(2050).required(),
        rating: Joi.number().precision(2).min(0).max(10).required(),
        description: Joi.string().min(5).max(255).required(),
        movieLength: Joi.number().min(30).max(300).required(),
        genreId: Joi.number().min(1).max(1000000).required()

    });
    return schema.validate(movie);
}

module.exports = route;