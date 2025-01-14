# ChatApp

ChatApp is a collaborative project management and messaging application built with Node.js, Express, MongoDB, React, and Socket.IO.

## Features

- User authentication and authorization
- Create and manage projects
- Add collaborators to projects
- Real-time messaging within projects
- Dark mode support

## Technologies Used

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Socket.IO
- Frontend: React, TailwindCSS
- Authentication: JWT
- State Management: React Context API

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB instance running

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/chatapp.git
   cd chatapp
   ```

2. Install dependencies for both backend and frontend:

   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. Create a `.env` file in the `backend` directory and add the following environment variables:

   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

### Running the Application

1. Start the backend server:

   ```bash
   cd backend
   npm start
   ```

2. Start the frontend development server:

   ```bash
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`.

## Usage

1. Register a new user or log in with an existing account.
2. Create a new project and add collaborators.
3. Start messaging within the project in real-time.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.