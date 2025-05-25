import { Request, Response } from "express";
import { TaskRepository } from "../../domain/repositories.ts/taskRepo";
import { CreateTaskUseCase } from "../../domain/useCases/task/createTaskUseCase";
import { DeleteTaskUseCase } from "../../domain/useCases/task/deleteTaskUseCase";
import { GetAllTasksUseCase } from "../../domain/useCases/task/getAllTasksUseCase";
import { GetTaskUseCase } from "../../domain/useCases/task/getTaskUseCase";
import { UpdateTaskUseCase } from "../../domain/useCases/task/updateTaskUseCase";

const taskRepository = new TaskRepository();
const createTaskUseCase = new CreateTaskUseCase(taskRepository);
const getAllTasksUseCase = new GetAllTasksUseCase(taskRepository);
const getTaskUseCase = new GetTaskUseCase(taskRepository);
const updateTaskUceCase = new UpdateTaskUseCase(taskRepository);
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);

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
    const tasks = await getAllTasksUseCase.execute();
    res.status(200).json(tasks);
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
