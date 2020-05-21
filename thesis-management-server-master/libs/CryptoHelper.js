"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let SALT_WORK_FACTOR = 10;
let bcrypt;
try {
  // Try the native module first
  bcrypt = require('bcrypt');
  // Browserify returns an empty object
  if (bcrypt && typeof bcrypt.compare !== 'function') {
    bcrypt = require('bcryptjs');
  }
}
catch (err) {
  // Fall back to pure JS impl
  bcrypt = require('bcryptjs');
}
class CryptoHelper {
  static hashPassword(plainPassword) {
    let salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
    return bcrypt.hashSync(plainPassword, salt);
  }
  static comparePassword(plainPassword, encryptPassword) {
    return bcrypt.compareSync(plainPassword, encryptPassword);
  }
}
module.exports = CryptoHelper;
//# sourceMappingURL=CryptoHelper.js.map