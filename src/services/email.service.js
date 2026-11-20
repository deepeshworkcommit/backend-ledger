const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port:587,
  secure:false,
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail,name){
    const subject = `Welcome to Backend Ledger`;
    const text = `Hi ${name}, Welcome onboard on Backend Ledger.\n\nWe are exited to have you onboard.\n\nThanks,\nBackend Ledger Team`;
    const html=`<p>Hi ${name}</p><p>Welcome onboard on Backend Ledger.</p><p>We are exited to have you onboard.</p><p>Thanks,<br>Backend LedgerTeam</p>`

    await sendEmail(userEmail,subject,text,html)
}
module.exports = {sendEmail,sendRegistrationEmail};