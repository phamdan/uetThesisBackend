const {StudentsRepository, ThesesRepository} = require('repositories');
const {Constant} = require('libs');

class StudentInfoService {
    static async getStudent(id, userRole, query) {
        let properties = [
            {field: 'id', type: 'integer'},
            {field: 'fullName', type: 'string'},
            {field: 'birthday', type: 'string'}, 
            {field: 'phone', type: 'string'},
            {field: 'email', type: 'string'},
            {field: 'class', type: 'string'},
        ]
        let data = {};

        if(userRole === Constant.USER_ROLE.STUDENT) {
            let student = await StudentsRepository.findOne({
                where: {
                    id: id
                }
            })
            return student
        } else {
            properties.map((ele) => {
                if(query[ele.field]){
                    if(ele.type === 'integer') data[ele.field] = parseInt(query[ele.field])
                    else data[ele.field] = query[ele.field]
                }
            });
            let listStudent = await StudentsRepository.findAll({
                where: {
                    ...data
                },
                raw: true
            })
            for(let i = 0; i < listStudent.length; i++) {
                let thesis = await ThesesRepository.findOne({
                    where: {
                        studentId: listStudent[i].id
                    }
                })
                listStudent[i].thesis = thesis
            }
            return listStudent
        }
    }
}

module.exports = StudentInfoService