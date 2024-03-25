const passport = require('passport');
const Employee = require('../models/Employee');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);

// Render the signup form
exports.getSignup = (req, res) => {
    res.render('signup'); 
};

// Render the signin form
exports.getSignin = (req, res) => {
    res.render('signin'); 
};


// Sign up employee
exports.postSignup = async (req, res, next) => {
    try {
        const { userName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const newEmployee = new Employee({userName, email, password: hashedPassword });
        await newEmployee.save();
        req.flash('success_msg', 'Employee registration successful. Please log in.');
        res.redirect('/users/signin');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'An error occurred during employee registration');
        res.redirect('/users/signup');
    }
};

// Sign in employee
exports.postSignin = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/signin',
    failureFlash: true
});

// Logout employee
exports.logout = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You have been logged out');
    res.redirect('users/signin');
};


//download csv
module.exports.downloadCsv = async function (req, res) {
    try {
        const students = await Student.find({});
        let csvData = 'S.No, Name, Email, Contact Number, College, Batch, Placement, DSA Score, WebDev Score, React Score, Interview, Date, Result\n';
        let no = 1;

        // Loop through each student to generate CSV data
        for (const student of students) {
            // Construct the CSV row for the current student
            let rowData = `${no},${student.name},${student.email},${student.contactNumber},${student.batch},${student.college},${student.placement},${student.dsa},${student.webd},${student.react}`;

            // Add interview details if available for the student
            if (student.interviews.length > 0) {
                for (const interview of student.interviews) {
                    rowData += `,${interview.company},${interview.date.toString()},${interview.result}`;
                }
            }

            // Append the current row to the CSV data
            csvData += `${rowData}\n`;
            no++;
        }

        // Define the file path for the CSV file
        const csvFilePath = path.join(__dirname, '..', 'report', 'data.csv');

        // Write the CSV data to the file
        await writeFileAsync(csvFilePath, csvData);

        // Download the generated CSV file
        res.download(csvFilePath, 'data.csv', (error) => {
            if (error) {
                // Handle download error
                console.log(`Error in downloading file: ${error}`);
                return res.redirect('back');
            } else {
                // Log success message and delete the generated CSV file after download
                console.log('File downloaded successfully');
                fs.unlinkSync(csvFilePath);
            }
        });

    } catch (error) {
        req.flash('error',`Error in generating CSV`);
        return res.redirect('back');
    }
};
