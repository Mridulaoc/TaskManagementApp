import { Request, Response } from "express";
import { CreateTaskUseCase } from "../../application/use-cases/Task/createTaskUseCase";
import { GetAllTasksUseCase } from "../../application/use-cases/Task/getAllTaskUseCase";
import { GetTaskUseCase } from "../../application/use-cases/Task/getTaskUseCase";
import { UpdateTaskUseCase } from "../../application/use-cases/Task/updateTaskUseCase";
import { DeleteTaskUseCase } from "../../application/use-cases/Task/deleteTaskUseCase";
import { GetUserTasksUseCase } from "../../application/use-cases/Task/getUserTasksUseCase";
import {
  UpdateSubtaskStatusRequest,
  UpdateSubtaskStatusUseCase,
} from "../../application/use-cases/Task/updateSubTaskUseCase";
import { UpdateTaskStatusUseCase } from "../../application/use-cases/Task/updateTaskStatusUseCase";
import { GetStatusDataUseCase } from "../../application/use-cases/Task/getStatusDataUseCase";
import { GetPriorityDataUseCase } from "../../application/use-cases/Task/getPriorityDataUseCase";
import { HttpStatus } from "../constants/httpStatuscode";
import { ResponseMessages } from "../constants/responseMessages";

export class TaskController {
  constructor(
    private createTaskUseCase: CreateTaskUseCase,
    private getAllTasksUseCase: GetAllTasksUseCase,
    private getTaskUseCase: GetTaskUseCase,
    private updateTaskUceCase: UpdateTaskUseCase,
    private deleteTaskUseCase: DeleteTaskUseCase,
    private getUserTasksUseCase: GetUserTasksUseCase,
    private updateSubTaskStatusUseCase: UpdateSubtaskStatusUseCase,
    private updateTaskStatusUseCase: UpdateTaskStatusUseCase,
    private getStatusDataUseCase: GetStatusDataUseCase,
    private getPriorityDataUseCase: GetPriorityDataUseCase
  ) {}

  createTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const taskData = req.body;
      const task = await this.createTaskUseCase.execute(taskData);
      res
        .status(HttpStatus.CREATED)
        .json({ message: ResponseMessages.TASK_CREATE_SUCCESS, task });
    } catch (error) {
      if (error instanceof Error)
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
    }
  };

  getAllTasks = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const result = await this.getAllTasksUseCase.execute(page, limit);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      if (error instanceof Error)
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
    }
  };

  getTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { taskId } = req.params;
      const task = await this.getTaskUseCase.execute(taskId);
      res.status(HttpStatus.OK).json(task);
    } catch (error) {
      if (error instanceof Error)
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
    }
  };
  updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { taskId } = req.params;
      const taskData = req.body;
      const updatedTask = await this.updateTaskUceCase.execute(
        taskId,
        taskData
      );
      res.status(HttpStatus.OK).json({
        message: ResponseMessages.TASK_UPDATE_SUCCESS,
        task: updatedTask,
      });
    } catch (error) {
      if (error instanceof Error)
        res.status(500).json({ error: error.message });
    }
  };
  deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { taskId } = req.params;
      const result = await this.deleteTaskUseCase.execute(taskId);
      res
        .status(HttpStatus.OK)
        .json({ message: ResponseMessages.TASK_DELETE_SUCCESS });
    } catch (error) {
      if (error instanceof Error)
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
    }
  };

  getAllUserTasks = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user;
      const userId = user?._id.toString();
      if (!userId) throw new Error("Unauthorized user");
      const userTasks = await this.getUserTasksUseCase.execute(userId);
      res.status(HttpStatus.OK).json(userTasks);
    } catch (error) {
      if (error instanceof Error)
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
    }
  };

  updateSubtaskStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { taskId, subtaskId } = req.params;
      const { isCompleted } = req.body;

      if (typeof isCompleted !== "boolean") {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "isCompleted must be a boolean value",
        });
        return;
      }

      const updatedTask = await this.updateSubTaskStatusUseCase.execute({
        taskId,
        subtaskId,
        isCompleted,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: ResponseMessages.SUBTASK_STATUS_UPDATE_SUCCESS,
        data: updatedTask,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("not found")) {
          res.status(HttpStatus.NOT_FOUND).json({
            success: false,
            message: error.message,
          });
          return;
        }

        if (error.message.includes("Invalid")) {
          res.status(HttpStatus.NOT_FOUND).json({
            success: false,
            message: error.message,
          });
          return;
        }
      }

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  updateTaskStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { taskId } = req.params;
      const { status } = req.body;

      if (!status) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Status is required",
        });
        return;
      }

      const updatedTask = await this.updateTaskStatusUseCase.execute({
        taskId,
        status,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: ResponseMessages.TASK_STATUS_UPDATE_SUCCESS,
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

  getStatusChartData = async (req: Request, res: Response) => {
    try {
      const chartData = await this.getStatusDataUseCase.execute();
      res.status(HttpStatus.OK).json(chartData);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Error fetching status chart data" });
    }
  };
  getPriorityChartData = async (req: Request, res: Response) => {
    try {
      const chartData = await this.getPriorityDataUseCase.execute();
      res.status(HttpStatus.OK).json(chartData);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Error fetching priority chart data" });
    }
  };
}
