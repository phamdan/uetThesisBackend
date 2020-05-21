const {ThesisInfoService} = require('services');
const {ErrorHandler} = require('libs');
const {verifyToken,verifyRole} = require('middlewares');

class thesisInfo {
    constructor() {
        if (!thesisInfo.instance) {
            thesisInfo.instance = this;
        }

        return thesisInfo.instance;
    }
    //end constructor

    registerRoute(router) {
        return router
            .get('/thesis/info', verifyToken, this.getThesis)
    }

    getThesis(req, res, next) {
        let {userId, userRole} = req;
        ThesisInfoService.getThesis(userId, userRole, req.query)
            .then(result => {
                res.status(200).json({result, httpCode:200})
            })
            .catch(error => {
                next(ErrorHandler.createErrorWithFailures(error.message, error.httpCode || 500, error.name || 'SERVER_ERROR', error.failures))
            })
    }
}

let instance = new thesisInfo();
Object.freeze(instance);

module.exports = instance;