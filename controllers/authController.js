const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);

// Render the signup form
exports.getSignup = (req, res) => {
    if (req.isAuthenticated()) {
		return res.redirect('back');
	}
    let successMessage = req.flash('success', null);
    let errorMessage = req.flash('error', null);
    res.render('signup', { success: successMessage, error: errorMessage }); 
};

// Render the signin form
exports.getSignin = (req, res) => {
    if (req.isAuthenticated()) {
		return res.redirect('back');
	}
    let successMessage = req.flash('success', null);
    let errorMessage = req.flash('error', null);
    res.render('signin', { success: successMessage, error: errorMessage }); 
};


// Sign up employee
exports.postSignup = async (req, res, next) => {
    try {
        const { userName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({userName, email, password: hashedPassword });
        await newUser.save();
        req.flash('success', 'Employee registration successful. Please log in.');
        res.redirect('/users/signin');
    } catch (err) {
        console.error(err);
        req.flash('error', 'An error occurred during employee registration');
        res.redirect('/users/signup');
    }
};

// Sign in employee
exports.postSignin = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/signin',
    failureFlash: true,
});

// Logout employee
exports.logout = (req, res, next) => {
    req.logout(function (err) {
		if (err) {
			req.flash('error', 'An error occurred during signout');
            return res.redirect('back');
		}
	});
    req.flash('success', 'You have been logged out');
    return res.redirect('signin');
};


//download csv
module.exports.downloadCsv = async function (req, res) {
    try {
        const students = await Student.find({});
        let csvData = 'S.No, Name, Email, Contact Number, College, Batch, Placement, DSA Score, WebDev Score, React Score, Interview, Date, Result\n';

        // Initialize serial number
        let serialNo = 1;

        // Loop through each student to generate CSV data
        for (const student of students) {
            // Construct the CSV row for the current student
            let rowData = `${student.name},${student.email},${student.contactNumber},${student.college},${student.batch},${student.placement},${student.dsa},${student.webd},${student.react}`;

            // Add interview details if available for the student
            if (student.interviews.length > 0) {
                for (const interview of student.interviews) {
                    // Append the current row to the CSV data with incremented serial number
                    csvData += `${serialNo},${rowData},${interview.company},${interview.date ? interview.date.toString() : ''},${interview.result}\n`;
                    serialNo++;
                }
            } else {
                // If no interview, just add student details with serial number
                csvData += `${serialNo},${rowData},,,,,\n`;
                serialNo++;
            }
        }

        // Define the file path for the CSV file
        const csvFilePath = path.join(__dirname, '..', 'report', 'Report.csv');

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
