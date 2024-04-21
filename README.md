# MERN Authentication and Email Verification Project

This project provides a comprehensive authentication system with email verification functionality for web applications using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It offers a seamless experience for user registration, email verification, login, logout, and password reset, ensuring secure user management.

## Features

- **User Registration**: Users can sign up for an account by providing necessary details such as username, email address, and password.

- **Email Verification**: Upon registration, users receive a verification email containing a unique link to verify their email address. This step ensures that only valid email addresses are associated with user accounts.

- **Login and Logout**: Registered users can securely log in to their accounts using their credentials. Additionally, they can log out to end their session securely.

- **Password Reset**: Users can request a password reset if they forget their password. A reset link is sent to their registered email address to initiate the password reset process.

- **Secure Authentication**: Passwords are securely hashed and stored to prevent unauthorized access to user accounts. Sessions are managed securely to prevent session hijacking and other attacks.

## Technologies Used

- **Frontend**:
  - **React.js**: Frontend framework for building user interfaces.
  - **React Router**: For handling routing within the React application.
  - **Redux**: For state management, especially for authentication-related state.
  - **Axios**: For making HTTP requests to the backend API.

- **Backend**:
  - **Node.js**: JavaScript runtime for server-side logic.
  - **Express.js**: Web application framework for Node.js, used for building the RESTful API.
  - **MongoDB**: NoSQL database for storing user data.
  - **Mongoose**: MongoDB object modeling tool for Node.js, used for interacting with the database.
  - **JWT (JSON Web Tokens)**: For secure authentication by generating and validating tokens.
  - **Nodemailer**: For sending verification and password reset emails.

## Installation

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory: `cd mern-authentication`
3. Install dependencies:
   - Backend: `cd backend && npm install`
   - Frontend: `cd frontend && npm install`
4. Set up environment variables:
   - Create a `.env` file in the `backend` directory.
   - Define the following variables:
     ```
     PORT=5000
     MONGODB_URI=<your-mongodb-uri>
     JWT_SECRET=<your-jwt-secret>
     EMAIL_USERNAME=<your-email-username>
     EMAIL_PASSWORD=<your-email-password>
     EMAIL_HOST=<your-email-host>
     EMAIL_PORT=<your-email-port>
     EMAIL_FROM=<your-email-address>
     ```
5. Start the backend server: `cd backend && npm start`
6. Start the frontend development server: `cd frontend && npm start`



## Authors

iqabbal 