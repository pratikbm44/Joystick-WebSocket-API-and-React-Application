const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: ['http://localhost:3000', 'http://your-client-domain.com'], // Replace with your actual client domain(s)
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Library for hashing passwords
const cors = require('cors');

const PORT = process.env.PORT || 3001;

// Serve static files from the 'public' directory (you can create this directory and put your React application files in it).
app.use(express.static('public'));
app.use(express.json());

// Sample database object for storing user data
const usersDatabase = {};

// Authentication middleware
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization; // Assuming the client sends the token in the Authorization header

  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token.' });
    }

    req.user = decoded;
    next();
  });
};

// WebSocket authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token; // Assuming the client sends the token as an authentication argument

  if (!token) {
    return next(new Error('Authentication failed.'));
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return next(new Error('Authentication failed.'));
    }

    socket.user = decoded;
    next();
  });
});

// User registration route handler
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  // Check if the username is already taken
  if (usersDatabase[username]) {
    return res.status(400).json({ message: 'Username already exists.' });
  }

  // Hash the password before storing it (You should use a salt and higher rounds in production)
  const hashedPassword = bcrypt.hashSync(password, 10); // 10 rounds of hashing

  // Save the new user data (store the hashed password)
  usersDatabase[username] = {
    username,
    password: hashedPassword,
     };

  res.json({ message: 'User registered successfully.' });
});

// CORS configuration (Allow specific origins)
const allowedOrigins = ['http://localhost:3000', 'http://your-client-domain.com'];

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the origin is in the allowed list or if it's undefined (means same origin)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

// User login route handler
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists in the database
  const user = usersDatabase[username];
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  // Verify the password against the stored hash
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Incorrect password.' });
  }

  // Generate a JWT token with user information
  const token = jwt.sign({ username }, 'your_secret_key', { expiresIn: '1h' });

  // Send the token as a response to the client
  res.json({ token });
});

// Data Retrieval Endpoint (for authenticated users)
app.get('/api/data', authenticateUser, (req, res) => {
  // Sample data for demonstration purposes (you can retrieve data from the database based on req.user)
  const sampleData = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
  ];

  res.json(sampleData);
});

// WebSocket endpoint
io.on('connection', (socket) => {
  console.log('A new client connected');

  // You can now access the authenticated user's information using socket.user
  console.log('Authenticated user:', socket.user);

  // Handle incoming joystick data from the React application
  socket.on('joystickData', (data) => {
    // Here, you can store the joystick data in the database along with the associated user ID (socket.user.username)
    // Sample implementation (not storing in the database in this example)
    console.log('Joystick data received:', data);

    if (!usersDatabase[socket.user.username].joystickData) {
      usersDatabase[socket.user.username].joystickData = [];
    }
    usersDatabase[socket.user.username].joystickData.push(data);

    // Broadcast the received data to all connected clients (if necessary)
    io.emit('joystickData', data);
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

// Start the server
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});






// const express = require('express');
// const app = express();
// const http = require('http').createServer(app);
// const io = require('socket.io')(http);
// const cors = require('cors');

// const PORT = process.env.PORT || 3001;

// // Serve static files from the 'public' directory (you can create this directory and put your React application files in it).
// app.use(express.static('public'));
// app.use(express.json());
// app.use(cors());

// // WebSocket endpoint
// io.on('connection', (socket) => {
//   console.log('A new client connected');

//   // Handle incoming joystick data from the React application
//   socket.on('joystickData', (data) => {
//     console.log('Joystick data received:', data);

//     // Broadcast the received data to all connected clients (if necessary)
//     io.emit('joystickData', data);
//   });

//   // Handle disconnections
//   socket.on('disconnect', () => {
//     console.log('A client disconnected');
//   });
// });

// // Start the server
// http.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
