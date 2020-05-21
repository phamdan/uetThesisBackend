const BaseRepository = require('./BaseRepository');

class UsersRepository extends BaseRepository {
    constructor() {
        super('Users')
    }
}

module.exports = UsersRepository.getInstance()