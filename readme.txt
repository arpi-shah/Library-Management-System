Library Management System

Overview:
This application manages libraries using React for the frontend and Node.js for the server. It uses XAMPP for PHPMyAdmin MySQL as the database.

Installation Steps:

1. Backend Setup (Node.js):
   - Ensure Node.js 12.x or later is installed.
   - Go to the root directory in the terminal.
   - Run 'npm install' to install backend dependencies.

2. Database Setup (XAMPP and PHPMyAdmin):
   - Install XAMPP if not already installed.
   - Start Apache and MySQL services.
   - Access PHPMyAdmin at 'http://localhost/phpmyadmin'.
   - Create a new database named 'library_node'.
   - Import the 'library_node.sql' file.

3. Frontend Setup (React):
   - Navigate to the root directory in the terminal.
   - Run 'npm install' to install frontend dependencies.

4. Start Application:
   - Run 'node server.js' in the root directory to start the server.
   - Run 'npm start' in the root directory to start the frontend.

Usage:
- Access the application at 'http://localhost:3000'.
- Use the search function to find books by ISBN, title, or author.
- Click 'Checkout' to borrow a book, entering the borrower ID when prompted.

Dependencies:
- Node.js (12.x or later)
- React
- XAMPP with PHPMyAdmin (MySQL)

Important Notes:
- Ensure XAMPP services are running.
- Update database connection details in 'server.js' (username, password, etc.).
- Ensure ports 3000 (React) and the Node.js port are available.


