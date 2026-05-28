const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// ─── Email Transporter ────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,   // your Gmail address
    pass: process.env.EMAIL_PASS,   // your Gmail App Password
  },
});

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'RJ Portfolio Backend is running 🚀' });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Name, email, and message are required.',
    });
  }

  if (!email.includes('@')) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email address.',
    });
  }

   try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `📬 New Portfolio Message from ${name}`,
      html: `
        <div style="font-family: monospace; background: #050A0F; color: #fff; padding: 32px; border-radius: 12px;">
          <h2 style="color: #00FFD1;">New message from your portfolio!</h2>
          <p><strong style="color:#00FFD1;">Name:</strong> ${name}</p>
          <p><strong style="color:#00FFD1;">Email:</strong> ${email}</p>
          <p><strong style="color:#00FFD1;">Message:</strong></p>
          <p style="color:#ccc; padding: 16px; background: #0D1117; border-radius: 8px;">${message}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message. Please try again.',
    });
  }
});
// Get projects (for dynamic loading if needed)
app.get('/api/projects', (req, res) => {
  const projects = [
    {
      id: 1,
      title: 'AXIOMA',
      description: 'AI-powered research mapping and cloud knowledge synthesis system.',
      technologies: ['Flutter', 'Firebase', 'AI/ML', 'Cloud'],
      category: 'AI / Research',
      emoji: '🧠',
      featured: true,
    },
    {
      id: 2,
      title: 'CalmLeaf',
      description: 'Online wellness web app for mental health and mindfulness.',
      technologies: ['React.js', 'JavaScript', 'CSS', 'Firebase'],
      category: 'Web App',
      emoji: '🌿',
      featured: false,
    },
    {
      id: 3,
      title: 'Hospital Queue Management',
      description: 'Digital ticketing system for hospital patient flow management.',
      technologies: ['Flutter', 'Firebase', 'Dart'],
      category: 'Healthcare',
      emoji: '🏥',
      featured: false,
    },
    {
      id: 4,
      title: 'Fast Food Management System',
      description: 'POS and order management system for fast food chains.',
      technologies: ['Flutter', 'MySQL', 'Dart'],
      category: 'Management System',
      emoji: '🍔',
      featured: false,
    },
    {
      id: 5,
      title: 'Mini Games Collection',
      description: 'Classic browser games: Tic-Tac-Toe and Matching Card Game.',
      technologies: ['JavaScript', 'HTML', 'CSS'],
      category: 'Games',
      emoji: '🎮',
      featured: false,
    },
  ];

  res.json({ success: true, projects });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 RJ Portfolio Backend running on http://localhost:${PORT}`);
});
