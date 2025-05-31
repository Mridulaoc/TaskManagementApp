import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../store/store";
import moment from "moment";
import { deleteTask, fetchAllTasks } from "../features/taskSlice";
import { toast } from "react-toastify";
import { ISubTask, ITask } from "../interfaces/task";
import { useSocket } from "../context/socketContext";
import StatusChart from "../components/StatusChart";
import PriorityChart from "../components/PriorityChart";

export function TaskManagement() {
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToView, setTaskToView] = useState<ITask | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 5;

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { tasks, loading, error, total } = useSelector(
    (state: RootState) => state.task
  );
  const { socket, isAdminSocket } = useSocket();

  useEffect(() => {
    if (!socket || !isAdminSocket) return;

    const handleTaskCompleted = (data: {
      taskId: string;
      title: string;
      completedBy: string[];
    }) => {
      console.log("Task completed:", data);
    };

    socket.on("admin:task:completed", handleTaskCompleted);

    return () => {
      socket.off("admin:task:completed", handleTaskCompleted);
    };
  }, [socket, isAdminSocket]);

  useEffect(() => {
    dispatch(fetchAllTasks({ page, limit }));
  }, [dispatch, page, total]);

  const handleAddTask = () => {
    navigate("/admin/dashboard/tasks/add");
  };

  const handleEditTask = (taskId: string) => {
    navigate(`/admin/dashboard/tasks/edit/${taskId}`);
  };

  const handleViewTask = (task: ITask) => {
    setTaskToView(task);
    setShowViewModal(true);
  };

  const handleDeleteClick = (taskId: string) => {
    setTaskToDelete(taskId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await dispatch(deleteTask(taskToDelete));
      toast.success("Task deleted successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setShowDeleteModal(false);
      setTaskToDelete(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCompletedSubtasks = (subtasks?: ISubTask[]) => {
    if (!subtasks || subtasks.length === 0) return { completed: 0, total: 0 };
    const completed = subtasks.filter((subtask) => subtask.isCompleted).length;
    return { completed, total: subtasks.length };
  };

  return (
    <div className="p-4 md:p-8 font-['Poppins']">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-primary mb-4 md:mb-0">
          Task Management
        </h1>
        <button
          onClick={handleAddTask}
          className="bg-primary hover:bg-[#0a0d3a] text-white px-6 py-2 rounded-lg transition-colors duration-200 shadow-md"
        >
          Add Task
        </button>
      </div>
      <div className=" flex justify-between p-4">
        <StatusChart />
        <PriorityChart />
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-primary">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks && tasks.length > 0 ? (
                    tasks.map((task) => (
                      <tr key={task._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {task.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              task.status
                            )}`}
                          >
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {task.dueDate
                            ? moment(task.dueDate).format("MMM D, YYYY")
                            : "--"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {task.createdAt
                            ? moment(task.createdAt).format("MMM D, YYYY")
                            : "--"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <div className="flex justify-center space-x-3">
                            <button
                              onClick={() => handleViewTask(task)}
                              className="text-secondary hover:text-[#2a9bd8] transition-colors"
                              title="View"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleEditTask(task._id!)}
                              className="text-primary hover:text-[#0a0d3a] transition-colors"
                              title="Edit"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(task._id!)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Delete"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-gray-400 mb-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                          <p className="text-lg">No tasks found</p>
                          <p className="text-sm mt-1">
                            Create a new task to get started
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {total > limit && (
            <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white rounded-lg shadow-sm">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{(page - 1) * limit + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(page * limit, total)}
                  </span>{" "}
                  of <span className="font-medium">{total}</span> tasks
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className={`px-4 py-2 border rounded-md text-sm font-medium ${
                    page === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-primary hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                <div className="flex space-x-1">
                  {Array.from(
                    { length: Math.ceil(total / limit) },
                    (_, i) => i + 1
                  )
                    .slice(
                      Math.max(0, page - 3),
                      Math.min(Math.ceil(total / limit), page + 2)
                    )
                    .map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-4 py-2 border rounded-md text-sm font-medium ${
                          page === pageNum
                            ? "bg-primary text-white"
                            : "bg-white text-primary hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                </div>
                <button
                  onClick={() =>
                    setPage((prev) =>
                      Math.min(prev + 1, Math.ceil(total / limit))
                    )
                  }
                  disabled={page === Math.ceil(total / limit)}
                  className={`px-4 py-2 border rounded-md text-sm font-medium ${
                    page === Math.ceil(total / limit)
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-primary hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* View Task Modal */}
      {showViewModal && taskToView && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-6 py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-primary">
                      {taskToView.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      ID: {taskToView._id}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="px-6 py-4 space-y-6">
                {taskToView.description && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Description
                    </h4>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {taskToView.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Status
                    </h4>
                    <span
                      className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(
                        taskToView.status
                      )}`}
                    >
                      {taskToView.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Priority
                    </h4>
                    <span
                      className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getPriorityColor(
                        taskToView.priority
                      )}`}
                    >
                      {taskToView.priority}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Due Date
                    </h4>
                    <p className="text-gray-700">
                      {taskToView.dueDate
                        ? moment(taskToView.dueDate).format("MMMM Do, YYYY")
                        : "No due date set"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Created At
                    </h4>
                    <p className="text-gray-700">
                      {moment(taskToView.createdAt).format(
                        "MMMM Do, YYYY [at] h:mm A"
                      )}
                    </p>
                  </div>
                </div>

                {taskToView.assignedTo && taskToView.assignedTo.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Assigned To
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {taskToView.assignedTo.map((assignee, index) => {
                        if (typeof assignee === "string") {
                          return (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                            >
                              User ID: {assignee}
                            </span>
                          );
                        }
                        return (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {assignee.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {taskToView.subtasks && taskToView.subtasks.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-500">
                        Subtasks
                      </h4>
                      <span className="text-xs text-gray-500">
                        {getCompletedSubtasks(taskToView.subtasks).completed}/
                        {getCompletedSubtasks(taskToView.subtasks).total}{" "}
                        completed
                      </span>
                    </div>
                    <div className="space-y-2">
                      {taskToView.subtasks.map((subtask, index) => (
                        <div
                          key={subtask._id || index}
                          className="flex items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <input
                            type="checkbox"
                            checked={subtask.isCompleted}
                            readOnly
                            className="h-4 w-4 text-secondary rounded border-gray-300 focus:ring-secondary"
                          />
                          <span
                            className={`ml-3 text-sm ${
                              subtask.isCompleted
                                ? "line-through text-gray-400"
                                : "text-gray-700"
                            }`}
                          >
                            {subtask.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditTask(taskToView._id!);
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-[#0a0d3a]"
                >
                  Edit Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Task
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this task? This action
                        cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={confirmDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
