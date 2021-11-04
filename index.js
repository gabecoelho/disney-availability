const axios = require('axios')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
	service: '', //outlook, gmail, etc
	auth: {
	  user: '',
	  pass: ''
	}
});

let mailOptions = {
	from: '',
	to: '',
	subject: 'DISNEY AVAILABILITY',
	text: ''
};

exports.handler = async (event) => {

	const response = await axios.get(`https://disneyland.disney.go.com/availability-calendar/api/calendar?segment=ticket&startDate=2021-06-17&endDate=2021-06-23`)

	if (response) {
		const {data} = response;

		for (const entry of data) {
			// remove Sunday
			if (entry.date !== '2021-06-20') {
				if (entry.availability === 'full' || entry.availability === 'drl_dp') {
					// TODO: SEND EMAIL
					const park = entry.availability === 'full' ? 'both parks' : entry.availability
					mailOptions.text = `${park} on ${entry.date} Disneyland Park available`;
					await transporter.sendMail(mailOptions);
					console.log('email sent')
				}
				else {
					console.log('None available')	
				}
			}
		}
	}
};
