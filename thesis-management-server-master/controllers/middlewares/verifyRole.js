"use strict";
const {ErrorHandler, Constant} = require('libs');

module.exports = (userRole, studentRole, lecturerRole, managerRole) => {
    if(typeof userRole !== 'string') throw ErrorHandler.generateError('permission denied', 401, 'PERMISSION DENIED')
    if(!studentRole && userRole === Constant.USER_ROLE.STUDENT) throw ErrorHandler.generateError('permission denied', 401, 'PERMISSION DENIED')
    if(!lecturerRole && userRole === Constant.USER_ROLE.LECTURER) throw ErrorHandler.generateError('permission denied', 401, 'PERMISSION DENIED')
    if(!managerRole && userRole === Constant.USER_ROLE.MANAGER) throw ErrorHandler.generateError('permission denied', 401, 'PERMISSION DENIED')
}