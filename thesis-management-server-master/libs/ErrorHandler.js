"use strict";

class ErrorHandler {
    static createErrorWithFailures(message, httpCode, name, failures) {
        let err = new Error();
        err.httpCode = httpCode;
        err.failures = failures;
        err.name = name;
        err.message = message;
        return err;
    }

    static generateError(message, httpCode, name) {
        let err = {};
        err.httpCode = httpCode;
        err.name = name;
        err.message = message;
        return err;
    }
}

module.exports = ErrorHandler;
