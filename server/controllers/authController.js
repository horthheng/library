const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createCanvas } = require('canvas');
const JsBarcode = require('jsbarcode');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const db = require('../models/index');
const authConfig = require('../config/auth.config');
const nodemailer = require('nodemailer');
const { transporter } = require('../utils/mailer');

// Store active user IDs and their last activity timestamp
const activeUsers = new Map();

// Initialize Socket.IO
let io;
const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
  });

  io.on('connection', (socket) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      socket.disconnect();
      return;
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) {
        socket.disconnect();
        return;
      }

      const userId = decoded.id;
      activeUsers.set(userId, Date.now());
      broadcastActiveUsers();

      socket.on('user-interaction', async () => {
        activeUsers.set(userId, Date.now());
        try {
          const user = await db.User.findByPk(userId);
          if (user) {
            await user.update({ lastActive: new Date() });
          }
        } catch (error) {
          console.error('Error updating lastActive:', error);
        }
        broadcastActiveUsers();
      });

      socket.on('disconnect', () => {
        activeUsers.delete(userId);
        broadcastActiveUsers();
      });
    });
  });
};

// Broadcast active user count and list
const broadcastActiveUsers = () => {
  if (!io) return;
  const now = Date.now();
  const activeThreshold = 5 * 60 * 1000;
  for (const [userId, lastActive] of activeUsers) {
    if (now - lastActive > activeThreshold) activeUsers.delete(userId);
  }
  io.emit('active-users', {
    count: activeUsers.size,
    userIds: Array.from(activeUsers.keys()),
  });
};

// Send welcome email with QR code
const sendWelcomeEmail = async (userId) => {
  try {
    console.log(`Starting sendWelcomeEmail for user ID: ${userId}`);
    const user = await db.User.findByPk(userId);
    if (!user || !user.email) {
      console.warn(`⚠️ No email found for user ID ${userId}`);
      throw new Error(`No email found for user ID ${userId}`);
    }
    const qrData = `${user.barcode}`;

    const qrPngBuffer = await QRCode.toBuffer(qrData, {
      width: 150,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' }
    });

    const subject = "🎉 Welcome to the Library System!";
    const message = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 8px;">
          <h1 style="color: #1a3c6d; font-size: 24px;">Welcome, ${user.username || "Library User"}!</h1>
          <p style="font-size: 16px; color: #333333;">We’re excited to have you join the <strong>Library System</strong>.</p>
          <p style="font-size: 16px; color: #333333;">From now on, you can borrow books, track your due dates, and receive reminders via email.</p>

          <div style="margin: 20px 0; text-align: center;">
            <p style="font-size: 16px; margin-bottom: 10px;">Here’s your membership QR Code:</p>
            <img src="cid:qr-${user.id}" alt="QR Code" width="150" height="150" style="display:block;margin:0 auto;"/>
          </div>

          <p style="margin-top: 20px; font-size: 16px;">📚 Happy Reading!</p>
          <p style="margin: 5px 0 0;">– The Library Team</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Library System" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject,
      html: message,
      attachments: [
        {
          filename: `user-${user.id}-qr.png`,
          content: qrPngBuffer,
          cid: `qr-${user.id}`
        }
      ]
    };

    console.log('Sending email to:', user.email);
    await transporter.sendMail(mailOptions);
    console.log(`📧 Welcome email with QR sent to ${user.email}`);
  } catch (err) {
    console.error(`❌ Failed to send welcome email for user ID ${userId}:`, err.stack);
    throw err;
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required!" });
    }

    const { User, Role } = db;

    const user = await User.findOne({
      where: { email },
      include: {
        model: Role,
        as: "Role",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({ accessToken: null, message: "Invalid password!" });
    }

    const inactiveThreshold = 30 * 24 * 60 * 60 * 1000;
    const currentTime = new Date();
    if (user.lastActive && (currentTime - new Date(user.lastActive) > inactiveThreshold)) {
      await user.update({ isActive: false });
      return res.status(403).json({ message: "Account is inactive. Please contact support to reactivate." });
    }

    await user.update({ lastActive: currentTime, isActive: true });

    const token = jwt.sign({ id: user.id }, authConfig.secret, { expiresIn: 86400 });

    res.status(200).json({
      message: "Login successful!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.Role?.name || "user",
        isActive: user.isActive,
        barcode: user.barcode,
        barcode_image: user.barcode_image
          ? `${req.protocol}://${req.get('host')}${user.barcode_image}`
          : null,
        qr_code_image: user.qr_code_image
          ? `${req.protocol}://${req.get('host')}${user.qr_code_image}`
          : null,
        profile_image: user.profile_image
          ? `${req.protocol}://${req.get('host')}/uploads/profile/${user.profile_image}`
          : null,
        accessToken: token,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: error.message });
  }
};

const signup = async (req, res) => {
  try {
    const { username, email, password, phone, date_of_birth } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required!" });
    }

    const { User, Role } = db;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use!" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔢 Generate unique numeric barcode (12 digits)
    let barcode, isUnique = false;
    while (!isUnique) {
      barcode = Math.floor(100000000000 + Math.random() * 900000000000).toString();
      const exist = await User.findOne({ where: { barcode } });
      if (!exist) isUnique = true;
    }

    // ---------- Handle Profile Image Upload ----------
    let profileImageUrl = null;
    const profileDir = path.join(process.cwd(), "Uploads", "profiles");
    if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });

    if (req.file) {
      // uploaded file
      profileImageUrl = `${req.protocol}://${req.get("host")}/Uploads/profiles/${req.file.filename}`;
    } else {
      // generate from first letter of email
      const letter = email.charAt(0).toUpperCase();
      const canvas = createCanvas(200, 200);
      const ctx = canvas.getContext("2d");

      // background color (random soft color)
      const colors = ["#FFB6C1", "#FFD700", "#87CEEB", "#90EE90", "#FFA07A", "#9370DB"];
      const bgColor = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // text
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 100px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(letter, canvas.width / 2, canvas.height / 2);

      // save file
      const profileFilename = `profile_${Date.now()}.png`;
      const profilePath = path.join(profileDir, profileFilename);
      profileImageUrl = `${req.protocol}://${req.get("host")}/Uploads/profiles/${profileFilename}`;

      const out = fs.createWriteStream(profilePath);
      const stream = canvas.createPNGStream();
      stream.pipe(out);
      await new Promise((resolve, reject) => {
        out.on("finish", resolve);
        out.on("error", reject);
      });
    }

    // Step 1: Create user (with profile image)
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
      date_of_birth,
      isActive: true,
      lastActive: new Date(),
      barcode,
      profile_image: profileImageUrl,
    });

    // ---------- Generate Barcode Image ----------
    const barcodeDir = path.join(process.cwd(), "Uploads", "barcodes");
    if (!fs.existsSync(barcodeDir)) fs.mkdirSync(barcodeDir, { recursive: true });

    const barcodeCanvas = createCanvas(400, 150);
    JsBarcode(barcodeCanvas, barcode, {
      format: "CODE128",
      displayValue: true,
      fontSize: 20,
      margin: 10,
      lineColor: "#000000",
      background: "#ffffff",
    });

    const barcodeFilename = `barcode_${user.id}.png`;
    const barcodePath = path.join(barcodeDir, barcodeFilename);
    const barcodeImageUrl = `${req.protocol}://${req.get("host")}/Uploads/barcodes/${barcodeFilename}`;

    const barcodeOut = fs.createWriteStream(barcodePath);
    barcodeCanvas.createPNGStream().pipe(barcodeOut);
    await new Promise((resolve, reject) => {
      barcodeOut.on("finish", resolve);
      barcodeOut.on("error", reject);
    });

    // ---------- Generate QR Code ----------
    const qrDir = path.join(process.cwd(), "Uploads", "qrcodes");
    if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir, { recursive: true });

    const qrFilename = `qrcode_${user.id}.png`;
    const qrPath = path.join(qrDir, qrFilename);
    const qrImageUrl = `${req.protocol}://${req.get("host")}/Uploads/qrcodes/${qrFilename}`;
    const userDetailsUrl = `${req.protocol}://${req.get("host")}/user/${user.id}`;

    await QRCode.toFile(qrPath, userDetailsUrl, {
      type: "png",
      width: 300,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    });

    // Step 2: Update user with generated images
    await user.update({
      barcode_image: barcodeImageUrl,
      qr_code_image: qrImageUrl,
    });

    // Assign default role
    const defaultRole = await Role.findOne({ where: { name: "user" } });
    if (!defaultRole) {
      throw new Error("Default user role not found");
    }
    await user.setRole(defaultRole);

    // Send welcome email
    try {
      console.log('Triggering welcome email for user ID:', user.id);
      await sendWelcomeEmail(user.id);
    } catch (err) {
      console.error(`Failed to send welcome email to ${user.email}:`, err.stack);
    }

    // Track active users
    activeUsers.set(user.id, Date.now());
    broadcastActiveUsers();

    // Generate JWT
    const token = jwt.sign({ id: user.id }, authConfig.secret, { expiresIn: 86400 });

    res.status(201).json({
      message: "Signup successful!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        date_of_birth: user.date_of_birth,
        role: defaultRole?.name || "user",
        isActive: user.isActive,
        barcode: user.barcode,
        profile_image: profileImageUrl,
        barcode_image: barcodeImageUrl,
        qr_code_image: qrImageUrl,
        accessToken: token,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup", error: error.message });
  }
};

const getActiveUsers = async (req, res) => {
  try {
    const now = Date.now();
    const activeThreshold = 5 * 60 * 1000;
    for (const [userId, lastActive] of activeUsers) {
      if (now - lastActive > activeThreshold) {
        activeUsers.delete(userId);
      }
    }
    res.status(200).json({ count: activeUsers.size, userIds: Array.from(activeUsers.keys()) });
  } catch (error) {
    console.error('Error fetching active users:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signin, signup, initSocket, getActiveUsers, sendWelcomeEmail };