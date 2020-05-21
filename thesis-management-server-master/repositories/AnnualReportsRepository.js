const BaseRepository = require('./BaseRepository');

class AnnualReportsRepository extends BaseRepository {
    constructor() {
        super('AnnualReports')
    }
}

module.exports = AnnualReportsRepository.getInstance()