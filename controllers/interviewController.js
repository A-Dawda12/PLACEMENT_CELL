const Student = require('../models/Student');
const Interview = require('../models/Interview');

//Get studnts list with interview 
module.exports.interviewList = async function (req, res){
    try {
        //Get all the students list who have their interview scheduled
        const students = await Student.find({ 'interviews.0': { $exists: true } });
        return res.render('interviews', { students });
    } catch (error) {
        req.flash('error', "Something went wrong!!");
        return res.redirect('back');
    }
}

//list of students for dropdown
module.exports.renderStudentList = async function (req, res){
    try {
        const students = await Student.find({});
        return res.render("scheduleInterview", {students});
    } catch (error) {
        req.flash('error', "Something went wrong!!");
        return res.redirect('back');
    }
}

//schedule interview 
module.exports.scheduleInterview = async function (req, res) {
    const { id, company, date } = req.body;
  
    try {
        let companyDoc = await Interview.findOne({ name: company });
    
        if (!companyDoc) {
            // Create a new company if it doesn't exist
            companyDoc = await Interview.create({ name: company });
        } else {
            // Check if the interview with the student is already scheduled
            const isInterviewScheduled = companyDoc.students.some(
            (stu) => stu.student.toString() === id
            );
    
            if (isInterviewScheduled) {
            req.flash('error','Interview with this student already scheduled');
            return res.redirect('back');
            }
        }
    
        // Add the interview details to the company document
        companyDoc.students.push({
            student: id,
            date: date
        });
        
        // Save the updated company document
        await companyDoc.save();

        const student = await Student.findById(id);

        if (student) {
            const interview = {
                comapny : company,
                date : date
            };
        student.interviews.push(interview);
        student.save();
        }
        req.flash('success','Interview Scheduled Successfully');      
        return res.redirect('company/home');

    } catch (error) {
      req.flash('Something went wrong!!');
      return res.redirect('back');
    }
};


module.exports.updateStatus = async function (req, res) {
  const { id } = req.params;
  const { companyName, companyResult } = req.body;

    try {
        // Find the student by ID
        const student = await Student.findById(id);
        if (!student || student.interviews.length === 0) {
            req.flash('error','Student or interview not found');
            res.redirect('back');
        }

        // Update the interview status for the student
        const interview = student.interviews.find((interview) => interview.company === companyName);
        if (interview) {
            interview.result = companyResult;
            await student.save();
        } else {
            req.flash('error','Interview not found for the given company name');
            return res.redirect('back');
        }

        // Find the company by name
        const company = await Interview.findOne({ name: companyName });
        if (!company) {
            req.flash('error','Company not found');
            res.redirect('back');
        }

        // Update the interview status for the company
        const studentIndex = company.students.findIndex((std) => std.student.toString() === id);
        if (studentIndex !== -1) {
            company.students[studentIndex].result = companyResult;
            await company.save();
        } else {
            req.flash('error','Student not found in the company');
            res.redirect('back');
        }

        req.flash('success','Interview Status Changed Successfully');
        return res.redirect('company/home');

    } 
    catch (error) {
        req.flash('error',`Error in updating status`);
        res.redirect('back');
    }
};
