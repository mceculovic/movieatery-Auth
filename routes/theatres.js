const express = require('express');
const { Theatre, Seat } = require("../models");
const Joi = require("joi");
const authToken = require("../middlewares/restAuth.js");
const moderatorAuth = require("../middlewares/moderatorAuth.js");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, path.dirname(__dirname) + "/images/theatres");
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

route.get('/theatres', async (req, res) => {
    let theatres = null;
    try{
        theatres = await Theatre.findAll({include: 'seats'});
        res.json(theatres);
    }catch(error){
        res.status(500).json(error);
    }
   
});

route.get('/theatres/:id', async (req, res) => {
    try{
        let theatre = await Theatre.findOne({where: {id: req.params.id}, include: 'seats'});
        if(!theatre){
            res.status(404).json({msg: "Theatre with given id doesn't exist."});
            return;
        }
        res.json(theatre);
    }catch(error){
        res.status(500).json(error);
    }
   
});


route.post('/theatres', [authToken,moderatorAuth, upload.single('files')],async (req, res) => {
    try{
        let {error, value} = validate(req.body);
       if(error){
           res.status(400).json({msg: error.details[0].message});
           return;
       }
        let theatre = await Theatre.findOne({where: {name: value.name}});
        if(theatre){
            res.status(400).json({msg: "Theatre with the given title already exists!"});
            return;
        }
        value.imageFileName = req.file.originalname;
        theatre = await Theatre.create(value);
        res.json(theatre);
    }catch(error){
        res.status(500).json(error);
    }
});

route.delete('/theatres/:id', [authToken,moderatorAuth], async (req, res) => {
    try{
        let theatre = await Theatre.findOne({where: {id: req.params.id}});
        if(!theatre){
            res.status(404).json({msg: "Theatre with given id doesn't exist."});
            return;
        }
        theatre = await theatre.destroy();
        res.send(theatre);

    }catch(error){
        res.status(500).json(error);
    }
});

route.put('/theatres/:id', [authToken,moderatorAuth], async (req, res) => {
    try{
        let {error, value} = validate(req.body);
        if(error){
            res.status(400).json({msg: error.details[0].message});
            return;
        }
        
        let theatre = await Theatre.findOne({where: {id: req.params.id}});
        if(!theatre){
            res.status(404).json({msg: "Theatre with given id doesn't exist"});
            return;
        }

        theatre = await theatre.update(value);

        res.json(theatre);

    }catch(error){
        res.status(500).json(error);
    }
});


function validate(theatre){
    const schema = Joi.object({
        name: Joi.string().min(2).max(30).required(),
        street: Joi.string().min(3).max(50).required(),
        city: Joi.string().min(2).max(20).required(),
        phone: Joi.string().min(5).max(30).required(),
        capacity: Joi.number().min(10).max(230).required(),
    });
    return schema.validate(theatre);
}

module.exports = route;