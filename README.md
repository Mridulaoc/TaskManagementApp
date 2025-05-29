# TaskTribe : A Task Management Application

## Project Overview
The Task Management Application is a full-stack web app built using clean architecture principles. It enables users to efficiently manage their tasks with features like task creation, editing, and deletion. The application also includes user authentication, real-time updates, data visualization, and a responsive design for a seamless experience across devices.

---

## Features

### 1. **Task Management**
- CRUD operations for tasks.
- Real-time task updates.
- Task categorization: Pending, In-Progress, Completed.

### 2. **User Authentication**
- Secure user registration and login using JSON Web Tokens (JWT).
- Authenticated API access for task-related operations.

### 3. **Real-Time Updates**
- WebSocket integration using `Socket.io`.
- Real-time updates for task modifications.

### 4. **Data Visualization**
- Pie chart and Bar chart to visualize task statistics.
- Insights like completed tasks and overdue tasks.

### 5. **Responsive Design**
- Mobile-first responsive design using Tailwind css
- Compatibility across various devices and screen sizes.

---

## Tech Stack

### **Backend**
- Node.js
- TypeScript (for type safety)
- Express.js
- MongoDB
- Socket.io
- JSON Web Tokens (JWT)
- Bcrypt (for hashing passwords)

### **Frontend**
- React.js
- Redux ToolKit(for state management)
- useForm(for 
- TypeScript (for type safety)
- Axios (for API communication)
- Recharts (for data visualization)
- Tailwind css (for responsive design)
- Toastify (for user friendly toasts)

---

## Installation Instructions

### Prerequisites
- Node.js (v20.0x)
- MongoDB (local or cloud instance)
- Git

1. **Clone the Repository**

   ```bash
   git clone https://github.com/adarshstillalive/Tasked.git
   cd Tasked.


2.  **Install Dependencies:**
   - **For the backend**

     ```bash
     cd server
     npm install
     
   - **For the frontend**

     ```bash
     cd client
     npm install

3. **Set up Environment Variables: Server**
  - Create a .env file in the server directory with the following variables:
    
    ```bash
    PORT = 8080
    CLIENT_URL = <client_url>
    MONGO_USERNAME = <mongo_username>
    MONGO_PASSWORD = <mongo_password>
    JWT_SECRET_KEY = <jwt_secretkey>
    
4. **Set up Environment Variables: Client**
  - Create a .env file in the client directory with the following variables:
    
    ```bash
    VITE_SERVER_URL = <server_url>

5. **Run the application:**
   - **Start the backend server**

     ```bash
     cd server
     npm start
     
   - **Start the frontend development server**

     ```bash
     cd client
     npm run dev

6. **Access the Application**

   - Open your browser and visit: http://localhost:<frontend_port>

## API Documentation
**Endpoints**

### Authentication
- **POST /api/signup**: Register a new user.
- **POST /api/login**: Login and receive a JWT token.
- **POST /lead/api/signup**: Register a new lead.
- **POST /lead/api/login**: Login and receive a JWT token.

### User Routes
- **GET /api/tasks**: Fetch tasks (requires token).
- **PATCH /api/task/:taskId**: Update task status (requires token).

### Lead Routes
- **GET /lead/api/users**: Fetch all users (requires token).
- **GET /lead/api/tasks**: Fetch all users (requires token).
- **POST /lead/api/task**: Create a new task (requires token).
- **PUT /lead/api/task/:taskId**: Update an existing task (requires token).
- **DELETE /lead/api/task/:taskId**: Delete a task (requires token).

## Deployment
The application is hosted live at: https://tasked-rho.vercel.app

## Contact

For any queries or suggestions, feel free to reach out:
- Author: Adarsh K S
- Email: adarshstillalive@gmail.com
- LinkedIn: www.linkedin.com/in/adarshks17
