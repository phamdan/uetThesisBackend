const {LecturerThesisService} = require('services');
const {ErrorHandler} = require('libs');
const {verifyToken, verifyRole} = require('middlewares');

class lecturerThesis {
    constructor() {
      if (!lecturerThesis.instance) {
        lecturerThesis.instance = this;
      }
  
      return lecturerThesis.instance;
    }
    //end constructor
  
    registerRoute(router) {
      return router
        .post('/lecturer/thesis/create', verifyToken, this.createThesis)                  // tạo mới khóa luận
        .delete('/lecturer/thesis/delete/:thesisId', verifyToken, this.deleteThesis)      // xóa khóa luận vừa tạo
        .patch('/lecturer/thesis/describle/:thesisId', verifyToken, this.describleThesis) // sửa mô tả cho khóa luận
        .post('/lecturer/thesis/accept/:thesisId', verifyToken, this.acceptThesis)        // chấp nhận đăng ký khóa luận
        .post('/lecturer/thesis/reject/:thesisId', verifyToken, this.rejectThesis)        // từ chối đăng ký khóa luận
        .patch('/lecturer/thesis/mark/:thesisId', verifyToken, this.markThesis)           // chấm điểm khóa luận
        .post('/lecturer/thesis/cancel/:thesisId', verifyToken, this.cancelThesis)        // hoãn khóa luận đang hoạt động
    }

    createThesis(req, res, next) {
        let {userId, userRole} = req;
        
        verifyRole(userRole, false, true, false);
        LecturerThesisService.createThesis(userId, req.body)
          .then(result => {
            res.status(200).json({result, httpCode:200})
          })
          .catch(error => {
            next(ErrorHandler.createErrorWithFailures(error.message, error.httpCode || 500, error.name || 'SERVER_ERROR', error.failures))
          })
    }

    deleteThesis(req, res, next) {
      let {userId, userRole} = req;
      let thesisId = req.params.thesisId;
      verifyRole(userRole, false, true, false);
      LecturerThesisService.deleteThesis(userId, thesisId)
        .then(result => {
          res.status(200).json({result, httpCode:200})
        })
        .catch(error => {
          next(ErrorHandler.createErrorWithFailures(error.message, error.httpCode || 500, error.name || 'SERVER_ERROR', error.failures))
        })
    }

    describleThesis(req, res, next) {
      let {userId, userRole} = req;
      let thesisId = req.params.thesisId;
      verifyRole(userRole, false, true, false);
      LecturerThesisService.describleThesis(userId, thesisId, req.body.describle)
        .then(result => {
          res.status(200).json({result, httpCode:200})
        })
        .catch(error => {
          next(ErrorHandler.createErrorWithFailures(error.message, error.httpCode || 500, error.name || 'SERVER_ERROR', error.failures))
        })
    }

    acceptThesis(req, res, next) {
        let {userId, userRole} = req;
        let thesisId = req.params.thesisId;
        verifyRole(userRole, false, true, false);
        LecturerThesisService.acceptThesis(userId, thesisId)
          .then(result => {
            res.status(200).json({result, httpCode:200})
          })
          .catch(error => {
            next(ErrorHandler.createErrorWithFailures(error.message, error.httpCode || 500, error.name || 'SERVER_ERROR', error.failures))
          })
    }

    rejectThesis(req, res, next) {
      let {userId, userRole} = req;
      let thesisId = req.params.thesisId;
      verifyRole(userRole, false, true, false);
      LecturerThesisService.rejectThesis(userId, thesisId)
        .then(result => {
          res.status(200).json({result, httpCode:200})
        })
        .catch(error => {
          next(ErrorHandler.createErrorWithFailures(error.message, error.httpCode || 500, error.name || 'SERVER_ERROR', error.failures))
        })
    }

    markThesis(req, res, next) {
      let {userId, userRole} = req;
      let thesisId = req.params.thesisId;
      verifyRole(userRole, false, true, false);
      LecturerThesisService.markThesis(userId, thesisId, req.body.mark)
        .then(result => {
          res.status(200).json({result, httpCode:200})
        })
        .catch(error => {
          next(ErrorHandler.createErrorWithFailures(error.message, error.httpCode || 500, error.name || 'SERVER_ERROR', error.failures))
        })
    }

    cancelThesis(req, res, next) {
      let {userId, userRole} = req;
      let thesisId = req.params.thesisId;
      verifyRole(userRole, false, true, false);
      LecturerThesisService.cancelThesis(userId, thesisId)
        .then(result => {
          res.status(200).json({result, httpCode:200})
        })
        .catch(error => {
          next(ErrorHandler.createErrorWithFailures(error.message, error.httpCode || 500, error.name || 'SERVER_ERROR', error.failures))
        })
    }
}

let instance = new lecturerThesis();
Object.freeze(instance);

module.exports = instance;
