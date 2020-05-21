const {LecturerInfoService} = require('services');
const {ErrorHandler} = require('libs');
const {verifyToken,verifyRole} = require('middlewares');

class lecturerInfo {
    constructor() {
        if (!lecturerInfo.instance) {
            lecturerInfo.instance = this;
        }

        return lecturerInfo.instance;
    }
    //end constructor

    registerRoute(router) {
        return router
            .get('/lecturer/info', verifyToken, this.getLecturer)
    }
    getLecturer(req, res, next) {
        let {id, userRole} = req;
        LecturerInfoService.getLecturer(id, userRole, req.query)
            .then(result => {
                // console.log(result)
                res.status(200).json({result, httpCode:200})
            })
            .catch(error => {
                next(ErrorHandler.createErrorWithFailures(error.message, error.httpCode || 500, error.name || 'SERVER_ERROR', error.failures))
            })
    }
}

let instance = new lecturerInfo();
Object.freeze(instance);

module.exports = instance;