const {ThesesRepository, StudentsRepository, LecturersRepository} = require('repositories');
const {Constant} = require('libs');

class ThesisInfoService {
    static async getThesis(userId, userRole, query) {
        let section = query.section;
        let properties = [
            {field: 'id', type: 'integer'},
            {field: 'thesisCode', type: 'string'},
            {field: 'thesisSubject', type: 'string'},
            {field: 'studentId', type: 'integer'}, 
            {field: 'lecturerId', type: 'integer'},
            {field: 'studentName', type: 'string'}, 
            {field: 'lecturerName', type: 'string'},
            {field: 'state', type: 'string'},
            {field: 'branch', type: 'string'},
        ]
        let data = {};
        properties.map((ele) => {
            if(query[ele.field]){
                if(ele.type === 'integer') data[ele.field] = parseInt(query[ele.field])
                else data[ele.field] = query[ele.field]
            }
        });
        if(section === 'self' && userRole !== Constant.USER_ROLE.MANAGER) {
            if (userRole === Constant.USER_ROLE.STUDENT) {
                let student = await StudentsRepository.findOne({where: {userId: userId}})
                let listThesis = await ThesesRepository.findAll({
                    where: {
                        studentId: student.id,
                        ...data
                    }
                })
                return listThesis
            }
            else if (userRole === Constant.USER_ROLE.LECTURER) {
                let lecturer = await LecturersRepository.findOne({where: {userId: userId}})
                let listThesis = await ThesesRepository.findAll({
                    where: {
                        lecturerId: lecturer.id,
                        ...data
                    }
                })
                return listThesis
            }
        } else if ((section === 'all' || !section) && userRole !== Constant.USER_ROLE.MANAGER) {
            let listThesis = await ThesesRepository.findAll({
                where: {
                    ...data
                },
                attributes: ['id', 'thesisCode', 'thesisSubject', 'lecturerId', 'studentId', 'state', 'describle', 'university', 'branch', 'created_at', 'updated_at']
            })
            //console.log(listThesis)
            for(let i=0; i < listThesis.length; i++){
                let lecturer = await LecturersRepository.findOne({
                    where: {
                        id: listThesis[i].lecturerId
                    }
                })
                listThesis[i]._previousDataValues.lecturerName = lecturer.dataValues.fullName
                let student = await StudentsRepository.findOne({
                    where: {
                        id: listThesis[i].studentId
                    }
                })
                listThesis[i]._previousDataValues.studentName = student ? student.dataValues.fullName : ""
                listThesis[i] = JSON.parse(JSON.stringify(listThesis[i]._previousDataValues))
                //console.log(listThesis[i])
            }
            return listThesis
        } else {
            let listThesis = await ThesesRepository.findAll({
                where: {
                    ...data
                }
            })
            return listThesis
        }
    }
}

module.exports = ThesisInfoService