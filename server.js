require('dotenv').config();
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// API endpoint to receive reviews
app.post('/submit-review', async (req, res) => {
    const { name, rating, comment } = req.body;

    // Basic validation
    if (!name || !rating || !comment) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // Prepare email content
    const mailOptions = {
        from: `"Reviews Website" <${process.env.EMAIL_USER}>`,
        to: process.env.RECEIVER_EMAIL,
        subject: `New Review from ${name}`,
        text: `
You have received a new review:

Name: ${name}
Rating: ${rating}/5
Comment:
${comment}
        `,
        html: `
<h2>New Review</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Rating:</strong> ${rating}/5</p>
<p><strong>Comment:</strong><br>${comment.replace(/\n/g, '<br>')}</p>
        `
    };

    try {
        // Send email
        await transporter.sendMail(mailOptions);

        // Optionally store the review (e.g., in a file or database)
        // For simplicity, we just log it
        console.log(`Review from ${name} saved and email sent.`);

        res.json({ message: 'Review submitted and email sent!' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ error: 'Failed to send email notification.' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});