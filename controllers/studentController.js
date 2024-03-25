const Interview = require('../models/Interview');
const Student = require('../models/Student');


//render add student page
module.exports.addStudent = async function (req, res, next) {
    return res.render('addStudent');
}

//add Student

module.exports.addStudent = async function(req, res, next) {
    const {name, email, contactNumber, college, batch, placement, dsa, webd, react} = req.body;
    try {
        const student = await Student.findOne({email});
        if(student){
            req.flash('error', "Student already exist");
            return res.redirect('back');
        }

        const newStudent = await Student.create({
            name, email, contactNumber, college, batch, batch, 
            placement, dsa, webd, react
        })
        await newStudent.save();

        return res.redirect('/')
    } catch (error) {
        req.flash('error', "Something went wrong!!");
        return res.redirect('back');
    }
}


//delete student

module.exports.deletStudent  = async function (req, res) {
    const {id} = req.params;
    try {
        const student = await Student.findById(id);

        //Now check if same student has be marked for interview
        //if yes than delete the record from Interview
        if (student && student.interviews.length > 0) {
            for (let item of student.interviews) {
                await Interview.findOneAndUpdate(
                    { name: item.company },
                    { $pull: { students: { student: id } } }
                );
            }
        }

        await Student.findByIdAndDelete(id);  
        req.flash('sucess', "Student record removed")
        return res.redirect('back');

    } catch (error) {
        
    }
}