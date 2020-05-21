const BaseRepository = require('./BaseRepository');

class StudentsRepository extends BaseRepository {
    constructor() {
        super('Students')
    }
}

module.exports = StudentsRepository.getInstance()