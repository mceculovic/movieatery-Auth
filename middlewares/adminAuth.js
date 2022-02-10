

module.exports = function authAdmin(req, res, next) {
    if(!req.user.isAdmin){
        return res.redirect(301, '/admin');
    }

    next();
};