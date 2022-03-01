const express = require('express');
const { sequelize, User } = require('./models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
require('dotenv').config();

const app = express();

const corsMidl = require('./middlewares/cors');



app.use(express.json());

app.post('/register', corsMidl,  async (req, res) => {

    let {error, value} = validate(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }

    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
    };

    

    let userExist = await User.findOne({where: {email: value.email}});
    if(userExist){
        res.status(400).json({msg: "User with given email is already registered!"});
        return;
    }

    try{
        let newUser = await User.create(user);
        const userToken = {
            userId: newUser.id,
            email: newUser.email,
            isModerator: newUser.isModerator,
            isAdmin: newUser.isAdmin,
        }
        const token = jwt.sign(userToken, process.env.ACCESS_TOKEN_SECRET);
        res.json({ token: token });
    }catch(err){
        res.status(500).json(err);
    }
});

app.post('/login', corsMidl,  async (req, res) => {

    let {error, value} = validateLogin(req.body);

    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }


    let user = await User.findOne({ where: { email: req.body.email}});

    if(!user){
        res.status(404).send({msg: "User with given email doesn't exist!"});
        return;
    }
    
    if(bcrypt.compareSync(req.body.password, user.password)){

        const object = {
            userId: user.id,
            email: user.email,
            isModerator: user.isModerator,
            isAdmin: user.isAdmin,
        };

        const token = jwt.sign(object, process.env.ACCESS_TOKEN_SECRET);

        res.json({ token: token});
    }else{
        res.status(400).send({msg: "Invalid credentials!"});
    }
});

function validate(user){
    const schema = Joi.object({
        firstName: Joi.string().min(3).max(30).required(),
        lastName: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().min(5).max(50).required(),
        password: Joi.string().min(3).max(30).required(),
    });
    return schema.validate(user);
}

function validateLogin(user){
    const schema = Joi.object({
        email: Joi.string().email().min(5).max(50).required(),
        password: Joi.string().min(3).max(30).required()
    });
    return schema.validate(user);
}

const port = process.env.PORT || 9000;

app.listen(port, async () => {
    console.log("Auth service listening on port " + port + "...");
    await sequelize.authenticate();
});
