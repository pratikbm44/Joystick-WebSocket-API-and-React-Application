Joystick WebSocket API and React Application

This project implements a WebSocket API server that allows real-time communication between a React application and the server using WebSocket. The React application includes a joystick component that sends data to the server, and the server broadcasts the received data to all connected clients.


Requirements

    Node.js (https://nodejs.org)
    npm (Node Package Manager, included with Node.js)

Installation

    Clone the repository to your local machine:

git clone https://github.com/pratikbm44/Joystick-WebSocket-API-and-React-Application

    Navigate to the project folder:

cd ERIC_ROBOTICS

    Install the necessary dependencies for the WebSocket API server and React application:

npm install


Running the WebSocket API Server

    Navigate to the server directory :

cd server

    Start the server:

npm start


The WebSocket API server should now be running on http://localhost:3001.

Running the React Application

    Start the React application:

npm start

The React application should now be running on http://localhost:3000. It will automatically open in your default web browser.
Usage


    Open the React application in your web browser at http://localhost:3000.


    Click on the "Login" button to authenticate with the WebSocket API server. If the login is successful, the application will establish a WebSocket connection with the server.

    Interact with the joystick component by clicking and dragging on it. The application will send the joystick data to the WebSocket server, which will be displayed in real-time in the "Received Joystick Data" section below the joystick.

Troubleshooting

    If you encounter any issues during installation or running the server/application, please check if you have met all the requirements and installed the necessary dependencies.

    If you face any other issues or have any questions, feel free to contact [your contact information] for support.

Credits

    The WebSocket API server was built using Node.js, Express, and Socket.IO.
    The React application was developed using React and Socket.IO client library.