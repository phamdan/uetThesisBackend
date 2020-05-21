const {LecturersRepository, ThesesRepository} = require('repositories');
const {Constant} = require('libs');

class lecturerInfoService {
    static async getLecturer(id, userRole, query) {
        let properties = [
            {field: 'id', type: 'integer'},
            {field: 'fullName', type: 'string'},
            {field: 'birthday', type: 'string'}, 
            {field: 'phone', type: 'string'},
            {field: 'email', type: 'string'},
            {field: 'branch', type: 'string'},
        ]
        let data = {};
        properties.map((ele) => {
            if(query[ele.field]){
                if(ele.type === 'integer') data[ele.field] = parseInt(query[ele.field])
                else data[ele.field] = query[ele.field]
            }
        });
        let listLecturer = await LecturersRepository.findOne({
            where: {
                ...data
            },
            raw: true
        })
        return listLecturer
    }
}

module.exports = lecturerInfoService