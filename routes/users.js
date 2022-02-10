const express = require('express');
const { User } = require("../models");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const authToken = require("../middlewares/restAuth.js");
const adminAuth = require("../middlewares/adminAuth.js");
const jwt = require('jsonwebtoken');
require('dotenv').config();


const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({extended: true}));

route.get('/users',authToken, async (req, res) => {
    let users = null;
    try{
        users = await User.findAll();
        res.json(users);
    }catch(error){
        res.status(500).json(error);
    }
   
});

route.get('/users/:id', authToken,async (req, res) => {
    try{
        let user = await User.findOne({where: {id: req.params.id}});
        if(!user){
            res.status(404).json({msg: "User with given id doesn't exist." });
            return;
        }
        res.json(user);
    }catch(error){
        res.status(500).json(error);
    }
   
});



route.post('/users', [authToken,adminAuth], async (req, res) => {
    try{
        let {error, value} = validate(req.body);
        if(error){
            res.status(400).msg({msg: error.details[0].message});
            return;
        }
        let user = await User.findOne({where: {email: value.email}});
        if(user){
            res.status(400).json({msg: "User with the given email already exists!"});
            return;
        }
        value.password = bcrypt.hashSync(value.password, 10);
        user = await User.create(value);

        res.json(user);
    }catch(error){
        res.status(500).json(error);
    }
});

route.delete('/users/:id', [authToken,adminAuth],async (req, res) => {
    try{
        let user = await User.findOne({where: {id: req.params.id}});
        if(!user){
            res.status(404).json({msg: "User with given id doesn't exist."});
            return;
        }
        user = await user.destroy();
        res.send(user);

    }catch(error){
        res.status(500).json(error);
    }
});

route.put('/users/:id', [authToken,adminAuth],async (req, res) => {
    try{
        let newUser = req.body;
        let {error, value} = validateUpdate(newUser);
        if(error){
            res.status(400).json({msg: error.details[0].message});
            return;
        }
        
        let user = await User.findOne({where: {id: req.params.id}});
        if(!user){
            res.status(404).json({msg: "User with given id doesn't exist"});
            return;
        }

        user = await user.update(value);

        res.json(user);

    }catch(error){
        res.status(500).json(error);
    }
});

route.put('/profile', [authToken], async(req, res) => {
    try{
        let {error, value} = validateChange(req.body);
        if(error){
            res.status(400).json({msg: error.details[0].message});
            return;
        }

        let user = await User.findOne({where: {id: req.user.userId}});
        if(!user){
            res.status(404).json({msg: "User with given id doesn't exist"});
            return;
        }

        if(value.password){
            value.password =  bcrypt.hashSync(value.password, 10);
        }

        user = await user.update(value);

        const userToken = {
            userId: user.id,
            email: user.email,
            isModerator: user.isModerator,
            isAdmin: user.isAdmin,
        }
        const token = jwt.sign(userToken, process.env.ACCESS_TOKEN_SECRET);

        user.dataValues.token = token;
        res.json(user);

    }catch(error){
        res.status(500).json(error);
    }
});


function validate(user){
    const schema = Joi.object({
        firstName: Joi.string().min(3).max(30).required(),
        lastName: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().min(5).max(50).required(),
        password: Joi.string().min(3).max(30).required(),
        isModerator: Joi.boolean(),
    });
    return schema.validate(user);
}

function validateUpdate(user){
    const schema = Joi.object({
        firstName: Joi.string().min(3).max(30).required(),
        lastName: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().min(5).max(50).required(),
        isModerator: Joi.boolean(),
    });
    return schema.validate(user);
}

function validateChange(user){
    const schema = Joi.object({
        firstName: Joi.string().min(3).max(30),
        lastName: Joi.string().min(3).max(30),
        email: Joi.string().email().min(5).max(50),
        password: Joi.string().min(3).max(30),
    });
    return schema.validate(user);

}

module.exports = route;