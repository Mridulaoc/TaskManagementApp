import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewTaskRealTime,
  clearError,
  fetchUserTasks,
  removeTaskRealTime,
  updateSubtaskRealtime,
  updateTaskRealTime,
  updateTaskStatusRealtime,
} from "../features/taskSlice";
import TaskCard from "../components/TaskCard";
import { AppDispatch, RootState } from "../store/store";
import { useSocket } from "../context/socketContext";
import { ITask } from "../interfaces/task";
import { addNotification } from "../features/notificationSlice";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { socket } = useSocket();

  const { userTasks, loading, error } = useSelector(
    (state: RootState) => state.task
  );
  const { userId, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserTasks(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (socket && isAuthenticated) {
      socket.on("task:created", (newTask: ITask) => {
        dispatch(addNewTaskRealTime(newTask));
        dispatch(
          addNotification({
            type: "task_created",
            message: `New task "${newTask.title}" has been assigned to you`,
            taskId: newTask._id,
            taskTitle: newTask.title,
          })
        );
      });
      socket.on("task:updated", (updatedTask: ITask) => {
        dispatch(updateTaskRealTime(updatedTask));
        dispatch(
          addNotification({
            type: "task_updated",
            message: `Task "${updatedTask.title}" has been updated`,
            taskId: updatedTask._id,
            taskTitle: updatedTask.title,
          })
        );
      });

      socket.on("task:deleted", (data: { taskId: string }) => {
        dispatch(removeTaskRealTime(data));
        dispatch(
          addNotification({
            type: "task_deleted",
            message: `A task has been deleted`,
            taskId: data.taskId,
          })
        );
      });
      socket.on(
        "subtask:updated",
        (data: { taskId: string; subtaskId: string; isCompleted: boolean }) => {
          dispatch(updateSubtaskRealtime(data));
          dispatch(
            addNotification({
              type: "subtask_updated",
              message: `A subtask has been ${
                data.isCompleted ? "completed" : "reopened"
              }`,
              taskId: data.taskId,
            })
          );
        }
      );
      socket.on(
        "task:status:updated",
        (data: {
          taskId: string;
          status: "pending" | "in-progress" | "completed";
        }) => {
          dispatch(updateTaskStatusRealtime(data));
          dispatch(
            addNotification({
              type: "task_status_updated",
              message: `Task status changed to ${data.status}`,
              taskId: data.taskId,
            })
          );
        }
      );
      socket.on("connected", (data) => {
        console.log(" Socket connected:", data.message);
      });
      return () => {
        socket.off("task:created");
        socket.off("task:updated");
        socket.off("task:deleted");
        socket.off("subtask:updated");
        socket.off("task:status:updated");
        socket.off("connected");
      };
    }
  }, [socket, isAuthenticated, dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3BB7F4]"></div>
        <span className="mt-4 text-gray-600 font-['Poppins']">
          Loading your tasks...
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 font-['Poppins']">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-[#11154F]">
            My Tasks
          </h1>
        </div>

        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="bg-[#11154F]/10 text-[#11154F] px-3 py-1 rounded-full text-sm">
            {userTasks.length} task{userTasks.length !== 1 ? "s" : ""}
          </div>

          {/* Connection status */}
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                socket?.connected ? "bg-green-500 animate-pulse" : "bg-red-500"
              }`}
            ></div>
            <span className="text-xs text-gray-500">
              {socket?.connected ? "Live updates" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={() => dispatch(clearError())}
              className="text-red-500 hover:text-red-700"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Tasks Grid */}
      {userTasks.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No tasks assigned
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            You'll see tasks here when they're assigned to you.
          </p>
          {socket?.connected && (
            <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <svg
                className="-ml-1 mr-1.5 h-2 w-2 text-green-500"
                fill="currentColor"
                viewBox="0 0 8 8"
              >
                <circle cx="4" cy="4" r="3" />
              </svg>
              Receiving live updates
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {userTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
