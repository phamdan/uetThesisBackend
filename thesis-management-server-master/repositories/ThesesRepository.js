const BaseRepository = require('./BaseRepository');

class ThesesRepository extends BaseRepository {
    constructor() {
        super('Theses')
    }
}

module.exports = ThesesRepository.getInstance()