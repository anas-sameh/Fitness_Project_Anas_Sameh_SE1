const path = require("node:path");
const fs = require("node:fs");
const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

const userData = path.resolve("./userData.json");
app.use(express.json());

// Add middleware to set proper headers for API responses only (not static files)
app.use((req, res, next) => {
  // Only set JSON headers for API routes, not static files
  if (req.path.startsWith('/login') || req.path.startsWith('/signup') || req.path.startsWith('/user')) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }
  next();
});

let port = 3000;

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "arc.project.otp@gmail.com",
    pass: "kgepkzmkqdsoafiu",
  },
});

function sendOTP(email, code) {
  return transporter.sendMail({
    from: "arc.project.otp@gmail.com",
    to: email,
    subject: "Password Reset Code",
    text: `Your OTP code is: ${code}`,
  });
}

function readUserData() {
  try {
    return JSON.parse(fs.readFileSync(userData, "utf-8"));
  } catch {
    return [];
  }
}
function writeUserData(newUser) {
  let data = [];

  try {
    data = JSON.parse(fs.readFileSync(userData, "utf-8"));
  } catch {
    data = [];
  }

  if (!Array.isArray(data)) data = [data];

  data.push(newUser);

  fs.writeFileSync(userData, JSON.stringify(data, null, 2));
}

function saveAllUsers(users) {
  fs.writeFileSync(userData, JSON.stringify(users, null, 2));
}

let emailExist = (req, res, next) => {
  let users = readUserData();
  const { email } = req.body;
  const isExist = users.find((u) => u.email === email);
  req.userExist = isExist;
  next();
};
let usersData = (req, res, next) => {
  let users = readUserData();
  req.users = users;
  next();
};

app.use(usersData);

app.post("/signup", emailExist, (req, res, next) => {
  if (req.userExist) {
    return res.status(409).json("user is already exists ");
  } else {
    req.body.id = Date.now();
    writeUserData(req.body);
    return res.status(200).json("user added successfully ✅ ");
  }
});

app.post("/login", (req, res, next) => {
  const { pass, email } = req.body;
  const user = req.users.find((el) => el.pass == pass && el.email == email);

  if (user) res.status(200).json("login successfuly ");
  else {
    res.status(401).json("username or password is incorrect  ");
  }
});

app.post("/login/forgetPassword/request", (req, res, next) => {
  const { email } = req.body;

  const user = req.users.find((u) => u.email === email);
  if (!user) {
    return res.status(404).json("email not found ");
  }

  const code = Math.floor(1000 + Math.random() * 9000);
  user.code = code;

  saveAllUsers(req.users);

  sendOTP(email, code)
    .then(() => {
      res.status(200).json("OTP sent to your email 📧");
    })
    .catch(() => {
      res.status(500).json("failed to send email ");
    });
});

app.post("/login/forgetPassword/verify", (req, res) => {
  const { email, otp } = req.body;

  const user = req.users.find((u) => u.email === email);
  if (!user) return res.status(404).json("email not found ");

  if (user.code !== Number(otp)) {
    return res.status(400).json("wrong OTP ");
  }

  res.json("OTP verified ✅");
});

app.post("/login/forgetPassword/reset", (req, res) => {
  const { email, otp, newPass } = req.body;

  const user = req.users.find((u) => u.email === email);
  if (!user) return res.status(404).json("email not found ");

  if (user.code !== Number(otp)) {
    return res.status(400).json("wrong OTP ");
  }

  user.pass = newPass;
  delete user.code;
  delete user.codeExpire;

  saveAllUsers(req.users);

  res.json("password updated successfully ✅");
});

// Get user data by email (for profile page)
app.get("/user/profile", (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json("email is required");
  }

  const user = req.users.find((u) => u.email === email);

  if (!user) {
    return res.status(404).json("user not found");
  }

  // Don't send password in response
  const userData = { ...user };
  delete userData.pass;
  delete userData.code;
  delete userData.codeExpire;

  res.json(userData);
});

// ========== FAVOURITES ENDPOINTS ==========

// Get user favourites
app.get("/user/favourites", (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json("email is required");
  }

  const user = req.users.find((u) => u.email === email);

  if (!user) {
    return res.status(404).json("user not found");
  }

  // Return favourites array (empty if not exists)
  res.json(user.favourites || []);
});

// Add/Remove favourite
app.post("/user/favourites", (req, res) => {
  const { email, course } = req.body;

  if (!email || !course) {
    return res.status(400).json("email and course are required");
  }

  const user = req.users.find((u) => u.email === email);

  if (!user) {
    return res.status(404).json("user not found");
  }

  // Initialize favourites array if not exists
  if (!user.favourites) {
    user.favourites = [];
  }

  // Check if course already exists
  const courseIndex = user.favourites.findIndex(
    (fav) => fav.title === course.title
  );

  if (courseIndex > -1) {
    // Remove from favourites
    user.favourites.splice(courseIndex, 1);
    saveAllUsers(req.users);
    res.json({ message: "Course removed from favourites", action: "removed" });
  } else {
    // Add to favourites
    user.favourites.push(course);
    saveAllUsers(req.users);
    res.json({ message: "Course added to favourites", action: "added" });
  }
});

// ========== ENROLLED COURSES ENDPOINTS ==========

// Get user enrolled courses
app.get("/user/enrolled", (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json("email is required");
  }

  const user = req.users.find((u) => u.email === email);

  if (!user) {
    return res.status(404).json("user not found");
  }

  // Return enrolled courses array (empty if not exists)
  res.json(user.enrolledCourses || []);
});

// Enroll in course
app.post("/user/enrolled", (req, res) => {
  const { email, course } = req.body;

  if (!email || !course) {
    return res.status(400).json("email and course are required");
  }

  const user = req.users.find((u) => u.email === email);

  if (!user) {
    return res.status(404).json("user not found");
  }

  // Initialize enrolledCourses array if not exists
  if (!user.enrolledCourses) {
    user.enrolledCourses = [];
  }

  // Check if course already enrolled
  const isAlreadyEnrolled = user.enrolledCourses.some(
    (c) => c.title === course.title
  );

  if (isAlreadyEnrolled) {
    return res.status(400).json("Course already enrolled");
  }

  // Add enrollment date
  course.enrolledDate = new Date().toISOString();

  // Add to enrolled courses
  user.enrolledCourses.push(course);
  saveAllUsers(req.users);

  res.json({ message: "Successfully enrolled in course", course });
});

// Unenroll from course (remove enrolled course)
app.delete("/user/enrolled", (req, res) => {
  const { email, title } = req.body;

  if (!email || !title) {
    return res.status(400).json({ message: "email and title are required" });
  }

  const user = req.users.find((u) => u.email === email);
  if (!user) return res.status(404).json({ message: "user not found" });

  if (
    !Array.isArray(user.enrolledCourses) ||
    user.enrolledCourses.length === 0
  ) {
    return res
      .status(404)
      .json({ message: "no enrolled courses found for user" });
  }

  const beforeCount = user.enrolledCourses.length;
  user.enrolledCourses = user.enrolledCourses.filter((c) => c.title !== title);

  if (user.enrolledCourses.length === beforeCount) {
    return res.status(404).json({ message: "enrollment not found" });
  }

  saveAllUsers(req.users);
  res.json({ message: "Unenrolled successfully" });
});

// ========== STATIC FILE SERVING (MUST BE AFTER ALL API ROUTES) ==========
// Serve static files from public directory
// IMPORTANT: This MUST be after all API routes to prevent conflicts
app.use(express.static(path.join(__dirname, "public"), {
  etag: false,
  lastModified: false,
  index: false, // Don't serve index.html automatically
  setHeaders: (res, path) => {
    // Only set cache headers for HTML files
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

app.listen(port, () => console.log("server is running ✅"));
