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
- useForm(custom hook for managing forms)
- zod(for validation) 
- TypeScript (for type safety)
- Axios (for API communication)
- Chart.js (for data visualization)
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
   git clone https://github.com/Mridulaoc/TaskManagementApp.git
   cd TaskManagementApp


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
    PORT = 3001
    CLIENT_URL = <client_url>
    MONGO_URI=<mongo_uri>
    JWT_SECRET_KEY = <jwt_secretkey>
    
4. **Set up Environment Variables: Client**
  - Create a .env file in the client directory with the following variables:
    
    ```bash
    VITE_API_BASE_URL = <server_url>

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
- **POST /**: Register a new user.
- **POST /login**: Login and receive a JWT token.
- **POST /admin/signup**: Register admin.
- **POST /admin/login**: Login and receive a JWT token.

### User Routes
- **GET /verify-token**: Verifying jwt token (requires token).
- **GET /:userId/tasks**: Getting tasks assignedto a specific user (requires token).
- **PATCH /subtasks/:taskId/:subtaskId**: Updating subtask (requires token)
- **PATCH /:taskId/task**: Update task status (requires token).

### Admin Routes
- **GET /admin/users**: Fetch all users (requires token).
- **GET /admin/get-tasks**: Fetch all tasks (requires token).
- **POST /admin/task**: Create a new task (requires token).
- **GET /admin/task/:taskId**: Getting a specific task (requires token)
- **PUT /admin/task/:taskId**: Update an existing task (requires token).
- **DELETE /admin/task/:taskId**: Delete a task (requires token).
- **GET /admin/chart-data/status** : Getting data of task status (requires token).
- **GET /admin/chart-data/priority** : Getting data of priority of tasks(requires token).

## Deployment
The application is hosted live at: https://tasked-rho.vercel.app

## Contact

For any queries or suggestions, feel free to reach out:
- Author: Adarsh K S
- Email: adarshstillalive@gmail.com
- LinkedIn: www.linkedin.com/in/adarshks17
