module.exports = function authModerator(req, res, next) {
    if(!req.user.isModerator){
        return res.redirect(301, '/admin/login');
    }

    next();
};