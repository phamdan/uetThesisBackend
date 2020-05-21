'use strict';
const {UsersRepository} = require('repositories');
const {ErrorHandler} = require('libs');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== undefined){
        try{
            const bearer = bearerHeader.split(" ");
            const bearerToken = bearer[1];
            const decoded = jwt.decode(bearerToken);
            let user = await UsersRepository.findOne({
                where:{id:decoded.data.id},
                attributes:['password','username']
            });
            if(user) {
                let result = await jwt.verify(bearerToken, `@${user.username}@${user.password}@uetthesis`);
                if(result) {
                    req.userId = result.data.id;
                    req.userRole = result.data.role;
                    req.fullName=result.data.fullName;
                    next();
                } else {
                    return next(ErrorHandler.generateError('permission denied', 401, 'PERMISSION DENIED'))
                }
            } else {
                return next(ErrorHandler.generateError('permission denied', 401, 'PERMISSION DENIED'))
            }
        } catch (error) {
            return next(ErrorHandler.generateError('permission denied', 401, 'PERMISSION DENIED'))
        }
    } else {
        res.sendStatus(403)
    }
}