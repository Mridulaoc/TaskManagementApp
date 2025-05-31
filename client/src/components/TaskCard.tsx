import { useState } from "react";
import { useDispatch } from "react-redux";
import { ITask, ISubTask } from "../interfaces/task";
import { AppDispatch } from "../store/store";
import { updateSubtaskStatus, updateTaskStatus } from "../features/taskSlice";
import { IoClose, IoCheckmarkCircle } from "react-icons/io5";

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
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const completedSubtasks =
    task.subtasks?.filter((st) => st.isCompleted).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Task Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {task.title}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                task.priority || "medium"
              )}`}
            >
              {task.priority || "medium"}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {task.description || "No description provided"}
          </p>

          {totalSubtasks > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>
                  {completedSubtasks}/{totalSubtasks} completed
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-secondary h-2 rounded-full transition-all duration-300"
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

          <div className="flex justify-between items-center">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                task.status
              )}`}
            >
              {task.status.replace("-", " ")}
            </span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-sm font-medium text-primary hover:text-secondary transition-colors"
            >
              View details →
            </button>
          </div>
        </div>
      </div>

      {/* Task Details Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal container */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-6 py-4">
                {/* Modal header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-primary">
                      {task.title}
                    </h3>
                    <div className="flex items-center space-x-3 mt-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status.replace("-", " ")}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                          task.priority || "medium"
                        )}`}
                      >
                        {task.priority || "medium"} priority
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
                  >
                    <IoClose className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Modal content */}
              <div className="px-6 py-4 space-y-6">
                {/* Description */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Description
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">
                      {task.description || "No description provided"}
                    </p>
                  </div>
                </div>

                {/* Due Date */}
                {task.dueDate && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Due Date
                    </h4>
                    <p className="text-gray-700">
                      {new Date(task.dueDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}

                {/* Subtasks */}
                {task.subtasks && task.subtasks.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-medium text-gray-700">
                        Subtasks ({completedSubtasks}/{totalSubtasks} completed)
                      </h4>
                      <div className="text-sm text-gray-500">
                        {Math.round((completedSubtasks / totalSubtasks) * 100)}%
                        complete
                      </div>
                    </div>

                    <div className="space-y-2">
                      {task.subtasks.map((subtask: ISubTask) => (
                        <div
                          key={subtask._id}
                          className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
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
                            className="h-4 w-4 text-secondary rounded border-gray-300 focus:ring-secondary cursor-pointer"
                          />
                          <div className="ml-3 flex-1">
                            <p
                              className={`text-sm ${
                                subtask.isCompleted
                                  ? "line-through text-gray-500"
                                  : "text-gray-700"
                              }`}
                            >
                              {subtask.title}
                            </p>
                          </div>
                          {subtask.isCompleted && (
                            <IoCheckmarkCircle className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-[#0a0d3a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard;
