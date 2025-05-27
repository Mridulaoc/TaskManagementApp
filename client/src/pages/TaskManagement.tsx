import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../store/store";

// import { toast } from "react-toastify";
import moment from "moment";
import { deleteTask, fetchAllTasks } from "../features/taskSlice";
import { toast } from "react-toast";

export function TaskManagement() {
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <button
          onClick={handleAddTask}
          className="bg-blue-600 text-white px-4 py-2 rounded"
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
                  <tr key={task._id} className="border-t">
                    <td className="py-2 px-4">{task.title}</td>
                    <td className="py-2 px-4 capitalize">{task.status}</td>
                    <td className="py-2 px-4 capitalize">{task.priority}</td>
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
                        onClick={() => handleEditTask(task._id!)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(task._id!)}
                        className="text-red-600 hover:underline"
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
          {/* Previous Button */}
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

          {/* Page Numbers */}
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

          {/* Next Button */}
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

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this task?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
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
