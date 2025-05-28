// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import type { AppDispatch, RootState } from "../store/store";
// import moment from "moment";
// import { deleteTask, fetchAllTasks } from "../features/taskSlice";
// import { toast } from "react-toast";

// export function TaskManagement() {
//   const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [page, setPage] = useState(1);
//   const limit = 5;

//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const { tasks, loading, error, total } = useSelector(
//     (state: RootState) => state.task
//   );

//   useEffect(() => {
//     dispatch(fetchAllTasks({ page, limit }));
//   }, [dispatch, page, total]);

//   const handleAddTask = () => {
//     navigate("/admin/dashboard/tasks/add");
//   };

//   const handleEditTask = (taskId: string) => {
//     navigate(`/admin/dashboard/tasks/edit/${taskId}`);
//   };

//   const handleDeleteClick = (taskId: string) => {
//     setTaskToDelete(taskId);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     if (!taskToDelete) return;
//     try {
//       await dispatch(deleteTask(taskToDelete));
//       toast.success("Task deleted successfully");
//     } catch (error) {
//       if (error instanceof Error) {
//         toast.error(error.message);
//       }
//     } finally {
//       setShowDeleteModal(false);
//       setTaskToDelete(null);
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Task Management</h1>
//         <button
//           onClick={handleAddTask}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Add Task
//         </button>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-40">
//           <span className="loading loading-spinner"></span>
//         </div>
//       ) : error ? (
//         <div className="text-red-600 text-center">{error}</div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="text-left py-2 px-4">Title</th>
//                 <th className="text-left py-2 px-4">Status</th>
//                 <th className="text-left py-2 px-4">Priority</th>
//                 <th className="text-left py-2 px-4">Due Date</th>
//                 <th className="text-left py-2 px-4">Created At</th>
//                 <th className="text-center py-2 px-4">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {tasks && tasks.length > 0 ? (
//                 tasks.map((task) => (
//                   <tr key={task._id} className="border-t">
//                     <td className="py-2 px-4">{task.title}</td>
//                     <td className="py-2 px-4 capitalize">{task.status}</td>
//                     <td className="py-2 px-4 capitalize">{task.priority}</td>
//                     <td className="py-2 px-4">
//                       {task.dueDate ? moment(task.dueDate).format("LL") : "--"}
//                     </td>
//                     <td className="py-2 px-4">
//                       {task.createdAt
//                         ? moment(task.createdAt).format("LL")
//                         : "--"}
//                     </td>
//                     <td className="py-2 px-4 flex justify-center gap-2">
//                       <button
//                         onClick={() => handleEditTask(task._id!)}
//                         className="text-blue-600 hover:underline"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDeleteClick(task._id!)}
//                         className="text-red-600 hover:underline"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={6} className="text-center py-8 text-gray-500">
//                     No tasks found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {total > limit && (
//         <div className="flex justify-center items-center flex-wrap gap-2 mt-4">
//           {/* Previous Button */}
//           <button
//             onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//             disabled={page === 1}
//             className={`px-3 py-1 border rounded ${
//               page === 1
//                 ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                 : "bg-white hover:bg-gray-100"
//             }`}
//           >
//             ← Prev
//           </button>

//           {/* Page Numbers */}
//           {Array.from({ length: Math.ceil(total / limit) }, (_, i) => (
//             <button
//               key={i + 1}
//               onClick={() => setPage(i + 1)}
//               className={`px-3 py-1 border rounded ${
//                 page === i + 1
//                   ? "bg-blue-500 text-white"
//                   : "bg-white hover:bg-gray-100"
//               }`}
//             >
//               {i + 1}
//             </button>
//           ))}

//           {/* Next Button */}
//           <button
//             onClick={() =>
//               setPage((prev) => Math.min(prev + 1, Math.ceil(total / limit)))
//             }
//             disabled={page === Math.ceil(total / limit)}
//             className={`px-3 py-1 border rounded ${
//               page === Math.ceil(total / limit)
//                 ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                 : "bg-white hover:bg-gray-100"
//             }`}
//           >
//             Next →
//           </button>
//         </div>
//       )}

//       {showDeleteModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
//           <div className="bg-white p-6 rounded shadow-lg w-96">
//             <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
//             <p className="mb-4">Are you sure you want to delete this task?</p>
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 className="px-4 py-2 border rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDelete}
//                 className="px-4 py-2 bg-red-600 text-white rounded"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../store/store";
import moment from "moment";
import { deleteTask, fetchAllTasks } from "../features/taskSlice";
import { toast } from "react-toast";
import { ITask } from "../interfaces/task";

// // Define Task interface (adjust based on your actual task structure)
// interface Task {
//   _id: string;
//   title: string;
//   description?: string;
//   status: string;
//   priority: string;
//   dueDate?: string;
//   createdAt?: string;
//   updatedAt?: string;
//   assignedTo?: string;
//   tags?: string[];
//   category?: string;
// }

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
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "in-progress":
      case "in progress":
        return "text-blue-600 bg-blue-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <button
          onClick={handleAddTask}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Add Task
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="loading loading-spinner"></span>
        </div>
      ) : error ? (
        <div className="text-red-600 text-center">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left py-2 px-4">Title</th>
                <th className="text-left py-2 px-4">Status</th>
                <th className="text-left py-2 px-4">Priority</th>
                <th className="text-left py-2 px-4">Due Date</th>
                <th className="text-left py-2 px-4">Created At</th>
                <th className="text-center py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks && tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr key={task._id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-4 font-medium">{task.title}</td>
                    <td className="py-2 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      {task.dueDate ? moment(task.dueDate).format("LL") : "--"}
                    </td>
                    <td className="py-2 px-4">
                      {task.createdAt
                        ? moment(task.createdAt).format("LL")
                        : "--"}
                    </td>
                    <td className="py-2 px-4 flex justify-center gap-2">
                      <button
                        onClick={() => handleViewTask(task)}
                        className="text-green-600 hover:underline hover:text-green-800 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditTask(task._id!)}
                        className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(task._id!)}
                        className="text-red-600 hover:underline hover:text-red-800 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {total > limit && (
        <div className="flex justify-center items-center flex-wrap gap-2 mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`px-3 py-1 border rounded ${
              page === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            ← Prev
          </button>

          {Array.from({ length: Math.ceil(total / limit) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                page === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setPage((prev) => Math.min(prev + 1, Math.ceil(total / limit)))
            }
            disabled={page === Math.ceil(total / limit)}
            className={`px-3 py-1 border rounded ${
              page === Math.ceil(total / limit)
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Next →
          </button>
        </div>
      )}

      {/* View Task Modal */}
      {showViewModal && taskToView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Task Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {taskToView.title}
                </p>
              </div>

              {/* Description */}
              {taskToView.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded border">
                    {taskToView.description}
                  </p>
                </div>
              )}

              {/* Status and Priority Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                      taskToView.status
                    )}`}
                  >
                    {taskToView.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getPriorityColor(
                      taskToView.priority
                    )}`}
                  >
                    {taskToView.priority}
                  </span>
                </div>
              </div>

              {/* Dates Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <p className="text-gray-800">
                    {taskToView.dueDate
                      ? moment(taskToView.dueDate).format("MMMM Do, YYYY")
                      : "No due date set"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created At
                  </label>
                  <p className="text-gray-800">
                    {taskToView.createdAt
                      ? moment(taskToView.createdAt).format(
                          "MMMM Do, YYYY [at] h:mm A"
                        )
                      : "Unknown"}
                  </p>
                </div>
              </div>

              {/* Updated At */}
              {taskToView.updatedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Updated
                  </label>
                  <p className="text-gray-800">
                    {moment(taskToView.updatedAt).format(
                      "MMMM Do, YYYY [at] h:mm A"
                    )}
                  </p>
                </div>
              )}

              {/* Assigned To */}
              {taskToView.assignedTo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned To
                  </label>
                  <p className="text-gray-800">{taskToView.assignedTo}</p>
                </div>
              )}

              {/* Task ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task ID
                </label>
                <p className="text-gray-600 text-sm font-mono">
                  {taskToView._id}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditTask(taskToView._id!);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Edit Task
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this task?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
