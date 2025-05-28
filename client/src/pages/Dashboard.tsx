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
      });
      socket.on("task:updated", (updatedTask: ITask) => {
        dispatch(updateTaskRealTime(updatedTask));
      });

      socket.on("task:deleted", (data: { taskId: string }) => {
        dispatch(removeTaskRealTime(data));
      });
      socket.on(
        "subtask:updated",
        (data: { taskId: string; subtaskId: string; isCompleted: boolean }) => {
          dispatch(updateSubtaskRealtime(data));
        }
      );
      socket.on(
        "task:status:updated",
        (data: {
          taskId: string;
          status: "pending" | "in-progress" | "completed";
        }) => {
          dispatch(updateTaskStatusRealtime(data));
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
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading tasks...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            {userTasks.length} task{userTasks.length !== 1 ? "s" : ""}
          </div>
          {/* Socket connection status indicator */}
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                socket?.connected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-xs text-gray-500">
              {socket?.connected ? "Live" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <div className="flex justify-between items-center">
            <span>Error: {error}</span>
            <button
              onClick={() => dispatch(clearError())}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Tasks Grid */}
      {userTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No tasks assigned yet</div>
          <div className="text-gray-400 text-sm mt-2">
            New tasks will appear here automatically when assigned
          </div>
          {socket?.connected && (
            <div className="text-green-500 text-sm mt-2 flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Connected to real-time updates
            </div>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
