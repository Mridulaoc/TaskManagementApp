// import { ITask } from "../interfaces/task";

// const TaskCard = ({
//   task,
//   isAuthenticated,
// }: {
//   task: ITask;
//   isAuthenticated: boolean;
// }) => {
//   return (
//     isAuthenticated && (
//       <div className="border p-4 rounded-xl shadow-md bg-white">
//         <h2 className="text-xl font-semibold">{task.title}</h2>
//         <p className="text-gray-600">{task.description}</p>
//         <div className="flex justify-between mt-2">
//           <span className="text-sm text-blue-500">Status: {task.status}</span>
//           <span className="text-sm text-red-500">
//             Priority: {task.priority}
//           </span>
//         </div>
//       </div>
//     )
//   );
// };

// export default TaskCard;

import { useState } from "react";
import { useDispatch } from "react-redux";
import { ITask, ISubTask } from "../interfaces/task";
import { AppDispatch } from "../store/store";
import { updateSubtaskStatus, updateTaskStatus } from "../features/taskSlice";

const TaskCard = ({
  task,
  isAuthenticated,
}: {
  task: ITask;
  isAuthenticated: boolean;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubtaskToggle = async (
    subtaskId: string,
    isCompleted: boolean
  ) => {
    try {
      if (!task._id) return;

      await dispatch(
        updateSubtaskStatus({
          taskId: task._id,
          subtaskId,
          isCompleted,
        })
      ).unwrap();

      const updatedSubtasks =
        task.subtasks?.map((subtask) =>
          subtask._id === subtaskId ? { ...subtask, isCompleted } : subtask
        ) || [];

      const completedSubtasks = updatedSubtasks.filter(
        (st) => st.isCompleted
      ).length;
      const totalSubtasks = updatedSubtasks.length;

      let newStatus = task.status;
      if (completedSubtasks === 0) {
        newStatus = "pending";
      } else if (completedSubtasks === totalSubtasks) {
        newStatus = "completed";
      } else {
        newStatus = "in-progress";
      }

      if (newStatus !== task.status) {
        await dispatch(
          updateTaskStatus({
            taskId: task._id,
            status: newStatus,
          })
        ).unwrap();
      }
    } catch (error) {
      console.error("Failed to update subtask:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500";
      case "in-progress":
        return "text-blue-500";
      case "pending":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-orange-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const completedSubtasks =
    task.subtasks?.filter((st) => st.isCompleted).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    isAuthenticated && (
      <>
        <div className="border p-4 rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
          <p className="text-gray-600 mb-3 line-clamp-2">
            {task.description || "No description"}
          </p>

          {totalSubtasks > 0 && (
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-500">Progress</span>
                <span className="text-sm text-gray-500">
                  {completedSubtasks}/{totalSubtasks}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${
                      totalSubtasks > 0
                        ? (completedSubtasks / totalSubtasks) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mb-3">
            <span
              className={`text-sm font-medium ${getStatusColor(task.status)}`}
            >
              Status: {task.status}
            </span>
            <span
              className={`text-sm font-medium ${getPriorityColor(
                task.priority || "medium"
              )}`}
            >
              Priority: {task.priority || "medium"}
            </span>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
          >
            View Details
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {task.title}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-600 mb-4">
                    {task.description || "No description provided"}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Status:
                      </span>
                      <span
                        className={`ml-2 font-semibold ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Priority:
                      </span>
                      <span
                        className={`ml-2 font-semibold ${getPriorityColor(
                          task.priority || "medium"
                        )}`}
                      >
                        {task.priority || "medium"}
                      </span>
                    </div>
                  </div>

                  {task.dueDate && (
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-500">
                        Due Date:
                      </span>
                      <span className="ml-2 text-gray-700">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {task.subtasks && task.subtasks.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        Subtasks ({completedSubtasks}/{totalSubtasks})
                      </h3>
                      <div className="text-sm text-gray-500">
                        {totalSubtasks > 0
                          ? `${Math.round(
                              (completedSubtasks / totalSubtasks) * 100
                            )}% Complete`
                          : "0% Complete"}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {task.subtasks.map((subtask: ISubTask) => (
                        <div
                          key={subtask._id}
                          className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={subtask.isCompleted}
                            onChange={(e) =>
                              handleSubtaskToggle(
                                subtask._id!,
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                          />
                          <div className="flex-1">
                            <span
                              className={`${
                                subtask.isCompleted
                                  ? "line-through text-gray-500"
                                  : "text-gray-800"
                              }`}
                            >
                              {subtask.title}
                            </span>
                          </div>
                          {subtask.isCompleted && (
                            <span className="text-green-500 text-sm font-medium">
                              ✓ Complete
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Close Button */}
                <div className="mt-6 pt-4 border-t">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )
  );
};

export default TaskCard;
