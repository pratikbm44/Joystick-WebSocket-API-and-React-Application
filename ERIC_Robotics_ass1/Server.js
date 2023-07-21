const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: ['http://localhost:3000', 'http://your-client-domain.com'], 
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Library for hashing passwords
const cors = require('cors');

const PORT = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.json());

// Sample database object for storing user data
const usersDatabase = {};

// Authentication middleware
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization; 

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
  const token = socket.handshake.auth.token; 

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

  const hashedPassword = bcrypt.hashSync(password, 10); // 10 rounds of hashing

  usersDatabase[username] = {
    username,
    password: hashedPassword,
     };

  res.json({ message: 'User registered successfully.' });
});

// CORS configuration 
const allowedOrigins = ['http://localhost:3000', 'http://your-client-domain.com'];

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {

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


  if (!usersDatabase[socket.user.username]) {
    usersDatabase[socket.user.username] = {
      joystickData: []
    };
  }
  
  // Handle incoming joystick data from the React application
  socket.on('joystickData', (data) => {
    console.log('Joystick data received:', data);

    
    usersDatabase[socket.user.username].joystickData.push(data);

    io.emit('joystickData', data);
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



