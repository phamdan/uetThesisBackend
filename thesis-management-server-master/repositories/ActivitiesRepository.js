const BaseRepository = require('./BaseRepository');

class ActivitiesRepository extends BaseRepository {
    constructor() {
        super('Activities')
    }
}

module.exports = ActivitiesRepository.getInstance()