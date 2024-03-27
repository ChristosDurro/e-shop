# E-Shop Website
Welcome to the E-Shop website! This project is a simple e-commerce website built with React, Node.js, MongoDB, and Stripe integration. It allows users to browse products, add items to their cart, securely checkout using Stripe payment processing, and create accounts to manage their shopping experience.

## Features
- View a list of available products
- Add products to the shopping cart
- Remove products from the shopping cart
- Checkout securely using Stripe payment processing
- User authentication and registration (signup and login)
- Each user has a unique ID associated with their account

## Technologies Used
- Frontend:

    - React
    - Vite (for project scaffolding)
    - Font Awesome icons
- Backend:

    - Node.js
    - Express.js
    - MongoDB
    - Stripe API for payment processing
# Setup
## Prerequisites
- Node.js installed on your machine
- MongoDB database set up (local or cloud-based)
- Stripe account for payment processing
## Installation
### Clone the repository:
```bash
Copy code
git clone <repository-url>
```
### Navigate to the project directory:

```bash
# Copy code
cd e-shop
```
### Install dependencies for both frontend and backend:

```bash
# Copy code
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```
### Configure environment variables:

- Create a .env file in the server and client directory.
- Add your MongoDB connection string, Stripe API keys, and any other necessary environment variables.
- Start the development servers:

```bash
# Copy code
# Start frontend development server
cd ../client
npm run dev

# Start backend development server
cd ../server
npm start
```

## License
This project is licensed under the MIT License.
