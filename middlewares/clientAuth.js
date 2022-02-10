const jwt = require('jsonwebtoken');
require('dotenv').config();


function getCookies(req) {
    if (req.headers.cookie == null) return {};

    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookies = {};

    rawCookies.forEach( rawCookie => {
        const parsedCookie = rawCookie.split('=');
        parsedCookies[parsedCookie[0]] = parsedCookie[1];
    });

    return parsedCookies;
};

module.exports = function authToken(req, res, next) {
    const cookies = getCookies(req);
    const token = cookies['token'];

    if(token == null)
    return res.redirect(301,"/admin/login");
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    
        if (err) return res.redirect(301, '/admin/login');
    
        req.user = user;
    
        next();
    });
};
