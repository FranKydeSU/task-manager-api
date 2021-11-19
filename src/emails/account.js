const sendgridMail = require('@sendgrid/mail')

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY)

// sendgridMail.send({
//     to: 'frankykub555@gmail.com',
//     from: 'frankykub555@gmail.com',
//     subject: 'This is my frist creaton!',
//     text: 'I hope this is geting.'
// })

const sendWelcomeEmail = (email, name) => {
    sendgridMail.send({
        to: email,
        from: 'frankykub555@gmail.com',
        subject: 'Welcome, thanks for joining!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendCancelEmail = (email, name) => {
    sendgridMail.send({
        to: email,
        from: 'frankykub555@gmail.com',
        subject: `Goodbye, ${name}`,
        text: `Thanks for joining us! ${name}, I hope to see you back sometime soon.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}