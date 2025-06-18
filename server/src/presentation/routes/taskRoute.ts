import express from "express";
import { TaskRepository } from "../../infrastructure/database/repositories/TaskRepository";
import { SocketNotificationService } from "../../infrastructure/services/SocketNotificationService";
import { GetUserTasksUseCase } from "../../application/use-cases/Task/getUserTasksUseCase";
import { UpdateSubtaskStatusUseCase } from "../../application/use-cases/Task/updateSubTaskUseCase";
import { UpdateTaskStatusUseCase } from "../../application/use-cases/Task/updateTaskStatusUseCase";
import { TaskController } from "../controller/taskController";
import { GetAllTasksUseCase } from "../../application/use-cases/Task/getAllTaskUseCase";
import { GetTaskUseCase } from "../../application/use-cases/Task/getTaskUseCase";
import { UpdateTaskUseCase } from "../../application/use-cases/Task/updateTaskUseCase";
import { DeleteTaskUseCase } from "../../application/use-cases/Task/deleteTaskUseCase";
import { CreateTaskUseCase } from "../../application/use-cases/Task/createTaskUseCase";
import { GetStatusDataUseCase } from "../../application/use-cases/Task/getStatusDataUseCase";
import { GetPriorityDataUseCase } from "../../application/use-cases/Task/getPriorityDataUseCase";
import { authMiddleware } from "../../infrastructure/middlewares/userMiddleware";
import { adminMiddleware } from "../../infrastructure/middlewares/adminMiddleware";

const taskRouter = express.Router();
const adminTaskRouter = express.Router();
const taskRepo = new TaskRepository();
const notificationService = new SocketNotificationService();

const getAllUserTasksUseCase = new GetUserTasksUseCase(taskRepo);
const updateSubTaskStatusUseCase = new UpdateSubtaskStatusUseCase(
  taskRepo,
  notificationService
);
const updateTaskStatusUseCase = new UpdateTaskStatusUseCase(
  taskRepo,
  notificationService
);
const getAllTasksUseCase = new GetAllTasksUseCase(taskRepo);
const getTaskUseCase = new GetTaskUseCase(taskRepo);
const updateTaskUseCase = new UpdateTaskUseCase(taskRepo, notificationService);
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepo, notificationService);
const createTaskUseCase = new CreateTaskUseCase(taskRepo, notificationService);
const getStatusDataUseCase = new GetStatusDataUseCase(taskRepo);
const getPriorityDataUseCase = new GetPriorityDataUseCase(taskRepo);

const taskController = new TaskController(
  createTaskUseCase,
  getAllTasksUseCase,
  getTaskUseCase,
  updateTaskUseCase,
  deleteTaskUseCase,
  getAllUserTasksUseCase,
  updateSubTaskStatusUseCase,
  updateTaskStatusUseCase,
  getStatusDataUseCase,
  getPriorityDataUseCase
);

taskRouter.get(
  "/:userId/tasks",
  authMiddleware,
  taskController.getAllUserTasks
);

taskRouter.patch(
  "/subtasks/:taskId/:subtaskId",
  authMiddleware,
  taskController.updateSubtaskStatus
);

taskRouter.patch(
  "/:taskId/status",
  authMiddleware,
  taskController.updateTaskStatus
);

adminTaskRouter.get("/get-tasks", adminMiddleware, taskController.getAllTasks);

adminTaskRouter
  .route("/:taskId")
  .get(adminMiddleware, taskController.getTask)
  .put(adminMiddleware, taskController.updateTask)
  .delete(adminMiddleware, taskController.deleteTask);
adminTaskRouter.post("/", adminMiddleware, taskController.createTask);

adminTaskRouter.get(
  "/chart-data/status",
  adminMiddleware,
  taskController.getStatusChartData
);
adminTaskRouter.get(
  "/chart-data/priority",
  adminMiddleware,
  taskController.getPriorityChartData
);

export { taskRouter, adminTaskRouter };
