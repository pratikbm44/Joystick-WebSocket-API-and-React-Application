Overview

The WebSocket API server is responsible for handling real-time communication with clients and receiving joystick data from the React application. This API is implemented using Socket.IO, allowing bidirectional communication between the server and clients.
Endpoints

The WebSocket API server has the following endpoint:

    joystickData: This endpoint receives joystick data from the React application. The server broadcasts the data to all connected clients.

WebSocket API Design : 

The server uses Socket.IO to create a WebSocket connection and enable real-time communication. It listens for connections from clients and handles incoming joystick data.
How the WebSocket API Works

   
    Server Initialization: When the server starts, it creates a WebSocket server using Socket.IO and listens on the specified port (e.g., port 3001).

    Connection: Clients can connect to the server's WebSocket endpoint using Socket.IO's client-side library.

    Authentication: The WebSocket server uses authentication middleware to verify the authenticity of clients. Clients must provide a valid JSON Web Token (JWT) as an authentication argument when connecting to the WebSocket API.

    joystickData Endpoint: The server listens for incoming events on the joystickData endpoint. When a client sends joystick data, the server receives the data and broadcasts it to all connected clients, including the sender.

    Disconnect: The server also handles disconnection events and logs when a client disconnects from the WebSocket API.


Endpoint Details

joystickData

    Purpose: Receive joystick data from the React application and broadcast it to all connected clients.
    Event Name: joystickData
    Event Payload: The event payload contains the joystick data in the following format:


    {
      x: <number>,
      y: <number>
    }

        x: The X-coordinate of the joystick movement.
        y: The Y-coordinate of the joystick movement.

Usage Example

Here's an example of how to use the WebSocket API in the React application:

    After the React application is loaded, the user clicks on the "Login" button to log in and get a valid JWT token.

    The React application establishes a WebSocket connection with the server using the obtained JWT token.

    The Joystick component in the React application listens for user input and sends joystick data to the server using the joystickData endpoint.

    The WebSocket API server receives the joystick data and broadcasts it to all connected clients, including the sender.

    All connected clients (including the sender) receive the joystick data and can update their UI accordingly.

Conclusion

The WebSocket API server enables real-time communication between the React application and clients. It efficiently handles joystick data and ensures seamless interaction with the application. The use of JWT authentication adds an extra layer of security to the WebSocket API.