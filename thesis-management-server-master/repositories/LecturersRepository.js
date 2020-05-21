const BaseRepository = require('./BaseRepository');

class LecturersRepository extends BaseRepository {
    constructor() {
        super('Lecturers')
    }
}

module.exports = LecturersRepository.getInstance()