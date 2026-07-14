const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, phone, message } = req.body;

    if (!name || !phone || !message) {
        return res.status(400).json({ error: 'Missing required fields (name, phone, message)' });
    }

    // SMTP Configuration using environment variables
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465');
    const smtpSecure = process.env.SMTP_SECURE === 'false' ? false : true; // default true for port 465
    const smtpUser = process.env.EMAIL_USER || process.env.SMTP_USER;
    const smtpPass = process.env.USER_PASS || process.env.SMTP_PASS;
    const receiverEmail = process.env.RECEIVER_EMAIL || 'arpit.sohane09@gmail.com';

    if (!smtpUser || !smtpPass) {
        return res.status(500).json({
            error: 'SMTP credentials are not configured. Please set EMAIL_USER and USER_PASS environment variables.'
        });
    }

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
            user: smtpUser,
            pass: smtpPass
        }
    });

    const clientEmail = email || 'no-reply@dr-arpit-portfolio.com';

    const mailOptions = {
        from: `"${name}" <${smtpUser}>`, // Sent via SMTP user but showing patient's name
        to: receiverEmail,
        replyTo: clientEmail,
        subject: `New Patient Inquiry from ${name}`,
        text: `Name: ${name}\nPhone: ${phone}\nEmail: ${clientEmail}\n\nMessage:\n${message}`,
        html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${clientEmail}</p>
            <br/>
            <p><strong>Inquiry Details:</strong></p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; border-left: 4px solid #0d9488; font-family: sans-serif; line-height: 1.5; color: #333;">
                ${message.replace(/\n/g, '<br/>')}
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Nodemailer Error:', error);
        return res.status(500).json({ error: 'Failed to send email. ' + error.message });
    }
};
