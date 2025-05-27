import { Request, Response } from "express";
import { TaskRepository } from "../../domain/repositories.ts/taskRepo";
import { CreateTaskUseCase } from "../../domain/useCases/task/createTaskUseCase";
import { DeleteTaskUseCase } from "../../domain/useCases/task/deleteTaskUseCase";
import { GetAllTasksUseCase } from "../../domain/useCases/task/getAllTasksUseCase";
import { GetTaskUseCase } from "../../domain/useCases/task/getTaskUseCase";
import { UpdateTaskUseCase } from "../../domain/useCases/task/updateTaskUseCase";
import { SocketNotificationService } from "../../infrastructure/services/SocketNotificationService";
import { GetUserTasksUseCase } from "../../domain/useCases/task/getUserTasksUseCase";

const taskRepository = new TaskRepository();
const notificationService = new SocketNotificationService();
const createTaskUseCase = new CreateTaskUseCase(
  taskRepository,
  notificationService
);
const getAllTasksUseCase = new GetAllTasksUseCase(taskRepository);
const getTaskUseCase = new GetTaskUseCase(taskRepository);
const updateTaskUceCase = new UpdateTaskUseCase(taskRepository);
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
const getUserTasksUseCase = new GetUserTasksUseCase(taskRepository);

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const taskData = req.body;
    const task = await createTaskUseCase.execute(taskData);
    res.status(200).json({ message: "Task created successfully" });
  } catch (error) {
    if (error instanceof Error) res.status(500).json({ error: error.message });
  }
};

export const getAllTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const result = await getAllTasksUseCase.execute(page, limit);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) res.status(500).json({ error: error.message });
  }
};

export const getTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { taskId } = req.params;
    const task = await getTaskUseCase.execute(taskId);
    res.status(200).json(task);
  } catch (error) {
    if (error instanceof Error) res.status(500).json({ error: error.message });
  }
};

export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { taskId } = req.params;
    const taskData = req.body;
    const updatedTask = await updateTaskUceCase.execute(taskId, taskData);
    res
      .status(200)
      .json({ message: "Task updated successfully", task: updateTask });
  } catch (error) {
    if (error instanceof Error) res.status(500).json({ error: error.message });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { taskId } = req.params;
    const result = await deleteTaskUseCase.execute(taskId);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    if (error instanceof Error) res.status(500).json({ error: error.message });
  }
};

export const getAllUserTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user;
    const userId = user?._id.toString();
    if (!userId) throw new Error("Unauthorized user");
    const userTasks = await getUserTasksUseCase.execute(userId);
    res.status(200).json(userTasks);
  } catch (error) {
    if (error instanceof Error) res.status(500).json({ error: error.message });
  }
};
