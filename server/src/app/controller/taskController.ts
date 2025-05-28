import { Request, Response } from "express";
import { TaskRepository } from "../../domain/repositories.ts/taskRepo";
import { CreateTaskUseCase } from "../../domain/useCases/task/createTaskUseCase";
import { DeleteTaskUseCase } from "../../domain/useCases/task/deleteTaskUseCase";
import { GetAllTasksUseCase } from "../../domain/useCases/task/getAllTasksUseCase";
import { GetTaskUseCase } from "../../domain/useCases/task/getTaskUseCase";
import { UpdateTaskUseCase } from "../../domain/useCases/task/updateTaskUseCase";
import { SocketNotificationService } from "../../infrastructure/services/SocketNotificationService";
import { GetUserTasksUseCase } from "../../domain/useCases/task/getUserTasksUseCase";
import { UpdateSubtaskStatusUseCase } from "../../domain/useCases/task/updateSubTaskStatusUseCase";
import { UpdateTaskStatusUseCase } from "../../domain/useCases/task/updateTaskStatusUseCase";
import { GetStatusDataUseCase } from "../../domain/useCases/task/getStatusDataUseCase";
import { GetPriorityDataUseCase } from "../../domain/useCases/task/getPriorityDataUseCase";

const taskRepository = new TaskRepository();
const notificationService = new SocketNotificationService();
const createTaskUseCase = new CreateTaskUseCase(
  taskRepository,
  notificationService
);
const getAllTasksUseCase = new GetAllTasksUseCase(taskRepository);
const getTaskUseCase = new GetTaskUseCase(taskRepository);
const updateTaskUceCase = new UpdateTaskUseCase(
  taskRepository,
  notificationService
);
const deleteTaskUseCase = new DeleteTaskUseCase(
  taskRepository,
  notificationService
);
const getUserTasksUseCase = new GetUserTasksUseCase(taskRepository);
const updateSubTaskStatusUseCase = new UpdateSubtaskStatusUseCase(
  taskRepository,
  notificationService
);
const updateTaskStatusUseCase = new UpdateTaskStatusUseCase(
  taskRepository,
  notificationService
);
const getStatusDataUseCase = new GetStatusDataUseCase(taskRepository);
const getPriorityDataUseCase = new GetPriorityDataUseCase(taskRepository);

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const taskData = req.body;
    const task = await createTaskUseCase.execute(taskData);
    res.status(200).json({ message: "Task created successfully", task });
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

export const updateSubtaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { taskId, subtaskId } = req.params;
    const { isCompleted } = req.body;

    if (typeof isCompleted !== "boolean") {
      res.status(400).json({
        success: false,
        message: "isCompleted must be a boolean value",
      });
      return;
    }

    const updatedTask = await updateSubTaskStatusUseCase.execute({
      taskId,
      subtaskId,
      isCompleted,
    });

    res.status(200).json({
      success: true,
      message: "Subtask status updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      if (error.message.includes("Invalid")) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
        return;
      }
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({
        success: false,
        message: "Status is required",
      });
      return;
    }

    const updatedTask = await updateTaskStatusUseCase.execute({
      taskId,
      status,
    });

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task status:", error);

    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      if (error.message.includes("Invalid")) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
        return;
      }
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getStatusChartData = async (req: Request, res: Response) => {
  try {
    const chartData = await getStatusDataUseCase.execute();
    res.json(chartData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching status chart data" });
  }
};

export const getPriorityChartData = async (req: Request, res: Response) => {
  try {
    const chartData = await getPriorityDataUseCase.execute();
    res.json(chartData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching priority chart data" });
  }
};
