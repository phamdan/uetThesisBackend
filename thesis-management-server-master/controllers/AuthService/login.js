const {LoginService} = require('services');
const {ErrorHandler, CryptoHelper} = require('libs');
const {verifyToken} = require('middlewares');

class Login {
    constructor() {
      if (!Login.instance) {
        Login.instance = this;
      }
  
      return Login.instance;
    }
    //end constructor
  
    registerRoute(router) {
      return router
        .get('/auth/verify', verifyToken, this.verifyToken)
        .post('/auth/login', this.login)
        .post('/auth/async/login', this.loginFromVNU)

        .get('/crypto/password', this.cryptPass)
    }

    login(req, res, next) {
        let {username, password, userRole} = req.body;
        let clientIp = res.connection.remoteAddress;
        LoginService.login(username, password, userRole, clientIp)
          .then(result => {
            res.status(200).json({result, httpCode:200})
          })
          .catch(error => {
            next(ErrorHandler.createErrorWithFailures(error.message, error.httpCode || 500, error.name || 'SERVER_ERROR', error.failures))
          })
    }

    loginFromVNU(req, res, next) {
        let {username, password} = req.body;
        LoginService.loginFromVNU(username, password, res)
          .catch(error => {
            next(ErrorHandler.createErrorWithFailures(error.message, error.httpCode || 500, error.name || 'SERVER_ERROR', error.failures))
          })
    }

    verifyToken(req, res, next) {
        res.status(200).json({result:{userId: req.userId, userRole: req.userRole, fullName:req.fullName}, httpCode:200})
    }

    cryptPass(req, res, next) {
      let crypt = CryptoHelper.hashPassword(req.query.password)
      res.status(200).json({result:{cryptPass: crypt}, httpCode: 200})
    }
}

let instance = new Login();
Object.freeze(instance);

module.exports = instance;
