const {StudentInfoService} = require('services');
const {ErrorHandler} = require('libs');
const {verifyToken,verifyRole} = require('middlewares');

class studentInfo {
    constructor() {
        if (!studentInfo.instance) {
            studentInfo.instance = this;
        }

        return studentInfo.instance;
    }
    //end constructor

    registerRoute(router) {
        return router
            .get('/student/info', verifyToken, this.getStudent)
    }

    getStudent(req, res, next) {
        let {id, userRole} = req;
        StudentInfoService.getStudent(id, userRole, req.query)
            .then(result => {
                res.status(200).json({result, httpCode:200})
            })
            .catch(error => {
                next(ErrorHandler.createErrorWithFailures(error.message, error.httpCode || 500, error.name || 'SERVER_ERROR', error.failures))
            })
    }
}

let instance = new studentInfo();
Object.freeze(instance);

module.exports = instance;