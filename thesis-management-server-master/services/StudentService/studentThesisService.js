const {StudentsRepository, ThesesRepository, ActivitiesRepository, LecturersRepository, AnnualReportsRepository} = require('repositories');
const {ErrorHandler, Constant} = require('libs');

class StudentThesisService {
    static async joinThesis(userId, thesisId) {
        let student = StudentsRepository.findOne({
            where: {userId}
        });
        let thesis = ThesesRepository.findOne({
            where: {
                id: thesisId,
                studentId: null,
                state: Constant.THESIS_STATE.NEW
            }
        });
        let result = await Promise.all([student, thesis]);
        student = result[0]; thesis = result[1];
        if(!student) throw ErrorHandler.generateError('student not found', 404, 'NOT FOUND');
        if(student.numberCompletedThesis > 0) throw ErrorHandler.generateError('student invalid', 500, 'INVALID');
        if(!thesis) throw ErrorHandler.generateError('thesis not found or not new', 400, 'NOT FOUND');

        let numberJoinedThesis = ThesesRepository.count({
            where: {
                studentId: student.id,
                $or: [
                    {state: Constant.THESIS_STATE.WAITTING},
                    {state: Constant.THESIS_STATE.ACTIVE},
                    {state: Constant.THESIS_STATE.COMPLETED}
                ]
            }
        }); 
        let numberJoinedThesisOfLecturer = ThesesRepository.count({
            where: {lecturerId: thesis.lecturerId, state: Constant.THESIS_STATE.ACTIVE}
        }); 
        result = await Promise.all([numberJoinedThesis, numberJoinedThesisOfLecturer])
        numberJoinedThesis = result[0]; numberJoinedThesisOfLecturer = result[1]
        if(numberJoinedThesis > 0) throw ErrorHandler.generateError('number of joined thesis limited', 500, 'LIMITED');
        if(numberJoinedThesisOfLecturer >= 5) throw ErrorHandler.generateError('number of joined thesis limited', 500, 'LIMITED');

        let thesisUpdate = await ThesesRepository.updateAttributes(thesis, {
            studentId: student.id,
            state: Constant.THESIS_STATE.WAITTING,
        })
        if(!thesisUpdate) throw ErrorHandler.generateError('unknown error', 500, 'UNKNOWN');
        else {
            let lecturer = await LecturersRepository.findOne({where: {id: thesisUpdate.lecturerId}})
            let createActivity = ActivitiesRepository.create({
                userId: lecturer.userId,
                content: 'đăng ký khóa luận',
                state: Constant.ACTIVITY_STATE.LOGGING,
                creatorId: userId
            })
            // student.numberNewActivity = student.numberNewActivity + 1;
            // lecturer.numberNewActivity = lecturer.numberNewActivity + 1;
            // await Promise.all([createActivity, student.save(), lecturer.save()])
            let numberNewActivity = student.numberNewActivity + 1
            let updateActivityStudent =  StudentsRepository.updateAttributes(student, {numberNewActivity})
            let numberNewActivityLecturer = lecturer.numberNewActivity + 1
            let updateActivityLecturer = LecturersRepository.updateAttributes(lecturer, {numberNewActivity: numberNewActivityLecturer})
            await Promise.all([createActivity, updateActivityStudent, updateActivityLecturer])
            return thesisUpdate
        }
    }






    static async exitThesis(userId, thesisId) {
        let student = await StudentsRepository.findOne({
            where: {userId}
        });
        if(!student) throw ErrorHandler.generateError('student not found', 404, 'NOT FOUND');
        console.log(student.id)
        let thesis = await ThesesRepository.findOne({
            where: {
                id: thesisId,
                studentId: student.id,
                state: Constant.THESIS_STATE.WAITTING
            }
        });
        if(!thesis) throw ErrorHandler.generateError('thesis invalid', 400, 'INVALID');
        let thesisUpdate = await ThesesRepository.updateAttributes(thesis, {state: Constant.THESIS_STATE.NEW, studentId: null})
        if(!thesisUpdate) throw ErrorHandler.generateError('unknown error', 500, 'UNKNOWN')
        else {
            let lecturer = await LecturersRepository.findOne({where: {id: thesisUpdate.lecturerId}})
            let createActivity = ActivitiesRepository.create({
                userId: lecturer.userId,
                content: 'hủy đăng ký khóa luận',
                state: Constant.ACTIVITY_STATE.LOGGING,
                creatorId: userId
            })
            let numberNewActivity = student.numberNewActivity + 1
            let updateActivityStudent =  StudentsRepository.updateAttributes(student, {numberNewActivity})
            let numberNewActivityLecturer = lecturer.numberNewActivity + 1
            let updateActivityLecturer = LecturersRepository.updateAttributes(lecturer, {numberNewActivity: numberNewActivityLecturer})
            await Promise.all([createActivity, updateActivityStudent, updateActivityLecturer])
            return thesisUpdate
        }
    }

    static async planningThesis(userId, thesisId, planningData) {
        let student = await StudentsRepository.findOne({
            where: {userId}
        });
        if(!student) throw ErrorHandler.generateError('student not found', 404, 'NOT FOUND');
        let thesis = await ThesesRepository.findOne({
            where: {
                id: thesisId,
                studentId: student.id,
                state: Constant.THESIS_STATE.ACTIVE
            }
        });
        if(!thesis) throw ErrorHandler.generateError('thesis not found or not active', 400, 'NOT FOUND');
        if(!planningData) throw ErrorHandler.generateError('planning is undefined', 400, 'UNDEFINED');
        let thesisUpdate = await ThesesRepository.updateAttributes(thesis, {planning: planningData})
        if(!thesisUpdate) throw ErrorHandler.generateError('unknown error', 500, 'UNKNOWN');
        else {
            let lecturer = await LecturersRepository.findOne({where: {id: thesisUpdate.lecturerId}})
            let createActivity = ActivitiesRepository.create({
                userId: lecturer.userId,
                content: 'thêm kế hoạch cho khóa luận',
                state: Constant.ACTIVITY_STATE.LOGGING,
                creatorId: userId
            })
            let numberNewActivity = student.numberNewActivity + 1
            let updateActivityStudent =  StudentsRepository.updateAttributes(student, {numberNewActivity})
            let numberNewActivityLecturer = lecturer.numberNewActivity + 1
            let updateActivityLecturer = LecturersRepository.updateAttributes(lecturer, {numberNewActivity: numberNewActivityLecturer})
            await Promise.all([createActivity, updateActivityStudent, updateActivityLecturer])
            return thesisUpdate
        }
    }

    static async reportThesis(userId, thesisId, reportData) {
        let student = await StudentsRepository.findOne({
            where: {userId}
        });
        if(!student) throw ErrorHandler.generateError('student not found', 404, 'NOT FOUND');
        let thesis = await ThesesRepository.findOne({
            where: {
                id: thesisId,
                studentId: student.id,
                state: Constant.THESIS_STATE.ACTIVE
            }
        });
        if(!thesis) throw ErrorHandler.generateError('thesis not found or not active', 400, 'NOT FOUND');
        
        let report = {}
        let requiredFieldName = {completed:'1',incompleted:'2',difficulty:'3'}
        if(!reportData) throw ErrorHandler.generateError('report is undefined', 400, 'UNDEFINED')
        for(let fieldName in requiredFieldName){
            if(!reportData[fieldName]) throw ErrorHandler.generateError(`${fieldName} is undefined`, 400, 'UNDEFINED')
            else report[fieldName] = reportData[fieldName]
        }

        let resultReport = await AnnualReportsRepository.create({
            thesisId: thesis.id,
            ...report,
            creatorId: userId
        })
        if(!resultReport) throw ErrorHandler.generateError('unknown error', 500, 'UNKNOWN');
        else {
            let lecturer = await LecturersRepository.findOne({where: {id: thesis.lecturerId}})
            let createActivity = ActivitiesRepository.create({
                userId: lecturer.userId,
                content: 'thêm báo cáo cho khóa luận',
                state: Constant.ACTIVITY_STATE.LOGGING,
                creatorId: userId
            })
            let numberNewActivity = student.numberNewActivity + 1
            let updateActivityStudent =  StudentsRepository.updateAttributes(student, {numberNewActivity})
            let numberNewActivityLecturer = lecturer.numberNewActivity + 1
            let updateActivityLecturer = LecturersRepository.updateAttributes(lecturer, {numberNewActivity: numberNewActivityLecturer})
            await Promise.all([createActivity, updateActivityStudent, updateActivityLecturer])
            return resultReport
        }
    }
}

module.exports = StudentThesisService