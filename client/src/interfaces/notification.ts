export interface INotification {
  id: string;
  type:
    | "task_created"
    | "task_updated"
    | "task_deleted"
    | "subtask_updated"
    | "task_status_updated";
  message: string;
  timestamp: Date;
  isRead: boolean;
  taskId?: string;
  taskTitle?: string;
}

export interface INotificationState {
  notifications: INotification[];
  unreadCount: number;
}
