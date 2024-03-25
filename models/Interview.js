const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			unique: true,
		},
		students: [
			{
				student: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Student',
				},
				date: {
					type: Date,
					required: true,
				},
				result: {
					type: String,
					enum: ['On Hold', 'Pending', 'Selected', 'Not Selected', 'Did not Attempt'],
                    default : 'Pending'
				},
			},
		],
	},
	{ timestamps: true }
);

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;