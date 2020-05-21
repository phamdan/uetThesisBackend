const {StudentThesisService} = require('services');
const {ErrorHandler} = require('libs');
const {verifyToken, verifyRole} = require('middlewares');

class studentThesis {
    constructor() {
      if (!studentThesis.instance) {
        studentThesis.instance = this;
      }
  
      return studentThesis.instance;
    }
    //end constructor
  
    registerRoute(router) {
      return router
        .post('/student/thesis/join/:thesisId', verifyToken, this.joinThesis)       //đăng ký khóa luận
        .post('/student/thesis/exit/:thesisId', verifyToken, this.exitThesis)       //hủy đăng ký khóa luận
        .patch('/student/thesis/plan/:thesisId', verifyToken, this.planningThesis)  //lên kế hoạch cho khóa luận đăng ký
        .post('/student/thesis/report/:thesisId', verifyToken, this.reportThesis)   //báo cáo thường xuyên cho khóa luận
    }

    joinThesis(req, res, next) {
        let {userId, userRole} = req;
        let thesisId = req.params.thesisId;
        verifyRole(userRole, true, false, false);
        StudentThesisService.joinThesis(userId, thesisId)
          .then(result => {
            res.status(200).json({result, httpCode:200})
          })
          .catch(error => {
            next(ErrorHandler.createErrorWithFailures(error.message, error.httpCode || 500, error.name || 'SERVER_ERROR', error.failures))
          })
    }

    exitThesis(req, res, next) {
      let {userId, userRole} = req;
      let thesisId = req.params.thesisId;
      verifyRole(userRole, true, false, false);
      StudentThesisService.exitThesis(userId, thesisId)
        .then(result => {
          res.status(200).json({result, httpCode:200})
        })
        .catch(error => {
          next(ErrorHandler.createErrorWithFailures(error.message, error.httpCode || 500, error.name || 'SERVER_ERROR', error.failures))
        })
    }

    planningThesis(req, res, next) {
      let {userId, userRole} = req;
      let thesisId = req.params.thesisId;
      verifyRole(userRole, true, false, false);
      StudentThesisService.planningThesis(userId, thesisId, req.body)
        .then(result => {
          res.status(200).json({result, httpCode:200})
        })
        .catch(error => {
          next(ErrorHandler.createErrorWithFailures(error.message, error.httpCode || 500, error.name || 'SERVER_ERROR', error.failures))
        })
    }

    reportThesis(req, res, next) {
      let {userId, userRole} = req;
      let thesisId = req.params.thesisId;
      verifyRole(userRole, true, false, false);
      StudentThesisService.reportThesis(userId, thesisId, req.body)
        .then(result => {
          res.status(200).json({result, httpCode:200})
        })
        .catch(error => {
          next(ErrorHandler.createErrorWithFailures(error.message, error.httpCode || 500, error.name || 'SERVER_ERROR', error.failures))
        })
    }
}

let instance = new studentThesis();
Object.freeze(instance);

module.exports = instance;
