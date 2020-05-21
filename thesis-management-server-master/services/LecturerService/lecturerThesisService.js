const {LecturersRepository, ThesesRepository, ActivitiesRepository, StudentsRepository} = require('repositories');
const {ErrorHandler, Constant} = require('libs');

class LecturerThesisService {
    static async createThesis(userId, thesisData) {
        let lecturer = await LecturersRepository.findOne({
            where: {userId}
        })
        if(!lecturer) throw ErrorHandler.generateError('lecturer not found', 404, 'NOT FOUND');

        let thesis = {}
        let requiredFieldName = {thesisCode:'1',thesisSubject:'2',describle:'3',university:'4',branch:'5'}
        if(!thesisData) throw ErrorHandler.generateError('thesis is undefined', 400, 'UNDEFINED')
        for(let fieldName in requiredFieldName){
            if(!thesisData[fieldName]) throw ErrorHandler.generateError(`${fieldName} is undefined`, 400, 'UNDEFINED')
            else thesis[fieldName] = thesisData[fieldName]
        }

        let numberThesisCode = await ThesesRepository.count({where: {thesisCode: thesis.thesisCode}})
        if(numberThesisCode > 0) throw ErrorHandler.generateError('thesis code is duplicated', 400, 'DUPLICATED')
        let numberLecturerThesis = await ThesesRepository.count({where: {lecturerId: lecturer.id, state: Constant.THESIS_STATE.NEW}})
        if(numberLecturerThesis > 15) throw ErrorHandler.generateError('number of thesis limited', 500, 'LIMITED')

        let resultThesis = await ThesesRepository.create({
            lecturerId: lecturer.id,
            ...thesis,
            state: Constant.THESIS_STATE.NEW,
            isCompleted: false,
            isCancel: false
        })
        if(!resultThesis) throw ErrorHandler.generateError('unknown error', 500, 'UNKNOWN')
        else {
            let createActivity = ActivitiesRepository.create({
                userId,
                content: 'tạo khóa luận mới',
                state: Constant.ACTIVITY_STATE.LOGGING,
                creatorId: userId
            })
            let numberNewActivity = lecturer.numberNewActivity + 1
            let updateLecturer =  LecturersRepository.updateAttributes(lecturer, {numberNewActivity})
            await Promise.all([createActivity, updateLecturer])
            return resultThesis
        }
    }

    static async acceptThesis(userId, thesisId) {
        let lecturer = await LecturersRepository.findOne({
            where: {userId}
        })
        if(!lecturer) throw ErrorHandler.generateError('lecturer not found', 404, 'NOT FOUND');

        let thesis = await ThesesRepository.findOne({
            where: {
                id: thesisId, 
                lecturerId: lecturer.id, 
                state: Constant.THESIS_STATE.WAITTING,
            }
        })
        if(!thesis) throw ErrorHandler.generateError('invalid thesis', 400, 'INVALID');

        let numberAcceptedThesis = await ThesesRepository.count({
            where: {lecturerId: lecturer.id, state: Constant.THESIS_STATE.ACTIVE}
        })
        if(numberAcceptedThesis >= 5) throw ErrorHandler.generateError('limited accept thesis', 500, 'LIMITED');

        let updateThesis = await ThesesRepository.updateAttributes(thesis, {state: Constant.THESIS_STATE.ACTIVE})
        if(!updateThesis) throw ErrorHandler.generateError('unknown error', 500, 'UNKNOWN')
        else {
            if(numberAcceptedThesis === 4){
                let waitingThesis = await ThesesRepository.findAll({where: {lecturerId: lecturer.id, state: Constant.THESIS_STATE.WAITTING}})
                for(ii = 0; ii < waitingThesis.length; ii++){
                    await ThesesRepository.updateAttributes(waitingThesis, {state: Constant.THESIS_STATE.CANCELED})
                    let studentWaiting = await StudentsRepository.findOne({where:{id: waitingThesis[ii].studentId}});
                    waitingThesis[ii] = ActivitiesRepository.create({
                        userId: studentWaiting.userId,
                        content: 'hoãn khóa luận',
                        state: Constant.ACTIVITY_STATE.LOGGING,
                        creatorId: userId
                    })
                }
                await Promise.all(waitingThesis)
                await ThesesRepository.update({
                    state:Constant.THESIS_STATE.CANCELED
                },{
                    where: {lecturerId: lecturer.id, state: Constant.THESIS_STATE.WAITTING}
                })
            }
            let student = await StudentsRepository.findOne({where:{id: updateThesis.studentId}});
            let createActivity = ActivitiesRepository.create({
                userId: student.userId,
                content: 'chấp nhận đăng ký khóa luận',
                state: Constant.ACTIVITY_STATE.LOGGING,
                creatorId: userId
            })
            let numberNewActivity = lecturer.numberNewActivity + 1
            let updateLecturer =  LecturersRepository.updateAttributes(lecturer, {numberNewActivity})
            let numberNewActivityStudent = student.numberNewActivity + 1
            let updateStudent = StudentsRepository.updateAttributes(student, {numberNewActivity: numberNewActivityStudent})
            await Promise.all([createActivity, updateLecturer, updateStudent])
            return updateThesis
        }
    }

    static async rejectThesis(userId, thesisId) {
        let lecturer = await LecturersRepository.findOne({
            where: {userId}
        })
        if(!lecturer) throw ErrorHandler.generateError('lecturer not found', 404, 'NOT FOUND');

        let thesis = await ThesesRepository.findOne({
            where: {
                id: thesisId, 
                lecturerId: lecturer.id, 
                state: Constant.THESIS_STATE.WAITTING,
            }
        })
        if(!thesis) throw ErrorHandler.generateError('invalid thesis', 400, 'INVALID');

        let studentId = thesis.studentId
        let updateThesis = ThesesRepository.updateAttributes(thesis, {state: Constant.THESIS_STATE.NEW, studentId: null})
        if(!updateThesis) throw ErrorHandler.generateError('unknown error', 500, 'UNKNOWN')
        else {
            let student = await StudentsRepository.findOne({where:{id:studentId}});
            let createActivity = ActivitiesRepository.create({
                userId: student.userId,
                content: 'hủy đăng ký khóa luận',
                state: Constant.ACTIVITY_STATE.LOGGING,
                creatorId: userId
            })
            let numberNewActivity = lecturer.numberNewActivity + 1
            let updateLecturer =  LecturersRepository.updateAttributes(lecturer, {numberNewActivity})
            let numberNewActivityStudent = student.numberNewActivity + 1
            let updateStudent = StudentsRepository.updateAttributes(student, {numberNewActivity: numberNewActivityStudent})
            await Promise.all([createActivity, updateLecturer, updateStudent])
            return updateThesis
        }
    }

    static async markThesis(userId, thesisId, mark) {
        let lecturer = await LecturersRepository.findOne({
            where: {userId}
        })
        if(!lecturer) throw ErrorHandler.generateError('lecturer not found', 404, 'NOT FOUND');

        let thesis = await ThesesRepository.findOne({
            where: {
                id: thesisId, 
                lecturerId: lecturer.id, 
                state: Constant.THESIS_STATE.ACTIVE,
            }
        })
        if(!thesis) throw ErrorHandler.generateError('invalid thesis', 400, 'INVALID');

        let state = Constant.THESIS_STATE.COMPLETED
        if(!mark || mark < 0 || mark > 10) throw ErrorHandler.generateError('invalid mark', 400, 'INVALID');
        else if(mark < 4) state = Constant.THESIS_STATE.CANCELED

        let studentId = thesis.studentId
        let updateThesis = ThesesRepository.updateAttributes(thesis, {state, thesisMark: mark})
        if(!updateThesis) throw ErrorHandler.generateError('unknown error', 500, 'UNKNOWN')
        else if (mark >= 4) {
            let student = await StudentsRepository.findOne({where:{id:studentId}});
            let createActivity = ActivitiesRepository.create({
                userId: student.userId,
                content: 'chấm điểm hoàn thành khóa luận',
                state: Constant.ACTIVITY_STATE.LOGGING,
                creatorId: userId
            })
            let numberNewActivity = lecturer.numberNewActivity + 1
            let numberCompletedThesis = lecturer.numberCompletedThesis + 1
            let updateLecturer =  LecturersRepository.updateAttributes(lecturer, {numberNewActivity, numberCompletedThesis})
            let numberNewActivityStudent = student.numberNewActivity + 1
            let numberCompletedThesisStudent = 1
            let updateStudent = StudentsRepository.updateAttributes(student, {numberNewActivity: numberNewActivityStudent, numberCompletedThesis: numberCompletedThesisStudent})
            await Promise.all([createActivity, updateLecturer, updateStudent])
            return updateThesis
        } else if (mark < 4) {
            let student = await StudentsRepository.findOne({where:{id:studentId}});
            let createActivity = ActivitiesRepository.create({
                userId: student.userId,
                content: 'hoãn khóa luận',
                state: Constant.ACTIVITY_STATE.LOGGING,
                creatorId: userId
            })
            let numberNewActivity = lecturer.numberNewActivity + 1
            let updateLecturer =  LecturersRepository.updateAttributes(lecturer, {numberNewActivity})
            let numberNewActivityStudent = student.numberNewActivity + 1
            let updateStudent = StudentsRepository.updateAttributes(student, {numberNewActivity: numberNewActivityStudent})
            await Promise.all([createActivity, updateLecturer, updateStudent])
            return updateThesis
        }
    }

    static async cancelThesis(userId, thesisId) {
        let lecturer = await LecturersRepository.findOne({
            where: {userId}
        })
        if(!lecturer) throw ErrorHandler.generateError('lecturer not found', 404, 'NOT FOUND');

        let thesis = await ThesesRepository.findOne({
            where: {
                id: thesisId, 
                lecturerId: lecturer.id, 
                state: Constant.THESIS_STATE.ACTIVE,
            }
        })
        if(!thesis) throw ErrorHandler.generateError('invalid thesis', 400, 'INVALID');

        let studentId = thesis.studentId
        let updateThesis = ThesesRepository.updateAttributes(thesis, {state: Constant.THESIS_STATE.CANCELED})
        if(!updateThesis) throw ErrorHandler.generateError('unknown error', 500, 'UNKNOWN')
        else {
            let student = await StudentsRepository.findOne({where:{id:studentId}});
            let createActivity = ActivitiesRepository.create({
                userId: student.userId,
                content: 'hoãn khóa luận',
                state: Constant.ACTIVITY_STATE.LOGGING,
                creatorId: userId
            })
            let numberNewActivity = lecturer.numberNewActivity + 1
            let updateLecturer =  LecturersRepository.updateAttributes(lecturer, {numberNewActivity})
            let numberNewActivityStudent = student.numberNewActivity + 1
            let updateStudent = StudentsRepository.updateAttributes(student, {numberNewActivity: numberNewActivityStudent})
            await Promise.all([createActivity, updateLecturer, updateStudent])
            return updateThesis
        }
    }

    static async deleteThesis(userId, thesisId) {
        let lecturer = await LecturersRepository.findOne({
            where: {userId}
        })
        if(!lecturer) throw ErrorHandler.generateError('lecturer not found', 404, 'NOT FOUND');

        let thesis = await ThesesRepository.findOne({
            where: {
                id: thesisId, 
                lecturerId: lecturer.id, 
                state: Constant.THESIS_STATE.NEW
            }
        })
        if(!thesis) throw ErrorHandler.generateError('invalid thesis', 400, 'INVALID');

        let deleteThesis = ThesesRepository.destroy({where:{id: thesis.id}})
        if(!deleteThesis) throw ErrorHandler.generateError('unknown error', 500, 'UNKNOWN')
        else {
            let createActivity = ActivitiesRepository.create({
                userId: userId,
                content: 'xóa khóa luận',
                state: Constant.ACTIVITY_STATE.LOGGING,
                creatorId: userId
            })
            let numberNewActivity = lecturer.numberNewActivity + 1
            let updateLecturer =  LecturersRepository.updateAttributes(lecturer, {numberNewActivity})
            await Promise.all([createActivity, updateLecturer])
            return deleteThesis
        }
    }

    static async describleThesis(userId, thesisId, describle) {
        let lecturer = await LecturersRepository.findOne({
            where: {userId}
        })
        if(!lecturer) throw ErrorHandler.generateError('lecturer not found', 404, 'NOT FOUND');

        let thesis = await ThesesRepository.findOne({
            where: {
                id: thesisId, 
                lecturerId: lecturer.id, 
                state: Constant.THESIS_STATE.NEW
            }
        })
        if(!thesis) throw ErrorHandler.generateError('invalid thesis', 400, 'INVALID');

        if(!describle || typeof describle !== 'string')  throw ErrorHandler.generateError('describle undefined', 404, 'UNDEFINED');

        let updateThesis = ThesesRepository.updateAttributes(thesis, {describle})
        if(!updateThesis) throw ErrorHandler.generateError('unknown error', 500, 'UNKNOWN')
        else {
            let createActivity = ActivitiesRepository.create({
                userId: userId,
                content: 'thêm mô tả cho khóa luận',
                state: Constant.ACTIVITY_STATE.LOGGING,
                creatorId: userId
            })
            let numberNewActivity = lecturer.numberNewActivity + 1
            let updateLecturer =  LecturersRepository.updateAttributes(lecturer, {numberNewActivity})
            await Promise.all([createActivity, updateLecturer])
            return updateThesis
        }
    }
}

module.exports = LecturerThesisService