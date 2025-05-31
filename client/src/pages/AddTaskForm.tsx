import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchAllUsers } from "../features/adminSlice";
import { addTask } from "../features/taskSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  status: z.enum(["pending", "in-progress", "completed"]),
  assignedTo: z.array(z.string()).min(1, "Assign at least one user"),
  dueDate: z.string().transform((val) => (val ? new Date(val) : undefined)),
  priority: z.enum(["low", "medium", "high"]),
  subtasks: z.array(
    z.object({
      title: z.string().min(1, "Subtask title is required"),
      isCompleted: z.boolean(),
    })
  ),
});

type taskFormData = z.infer<typeof taskSchema>;
export default function AddTaskForm() {
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "pending",
      assignedTo: [],
      dueDate: "",
      priority: "medium",
      subtasks: [{ title: "", isCompleted: false }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks",
  });

  const { users } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchAllUsers());
    setLoading(false);
  }, []);

  const onSubmit = async (data: taskFormData) => {
    const taskData: taskFormData = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    };
    const result = await dispatch(addTask(taskData));

    if (addTask.fulfilled.match(result)) {
      toast.success("New Task Added Successfully");
      navigate("/admin/dashboard/tasks");
    }
  };
  const assignedTo = watch("assignedTo") || [];
  const handleUserToggle = (userId: string) => {
    const newAssignedTo = assignedTo.includes(userId)
      ? assignedTo.filter((id) => id !== userId)
      : [...assignedTo, userId];
    setValue("assignedTo", newAssignedTo);
  };
  return (
    <div className="max-w-3xl mx-auto mt-6 md:mt-10 p-4 md:p-8 border rounded-lg shadow-sm bg-white font-['Poppins']">
      <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center text-primary">
        Add New Task
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            {...register("title")}
            className={`w-full px-4 py-2 border ${
              errors.title ? "border-red-300" : "border-gray-300"
            } rounded-md focus:ring-secondary focus:border-secondary`}
            placeholder="Enter task title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description<span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("description")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary"
            rows={4}
            placeholder="Enter task description"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status<span className="text-red-500">*</span>
            </label>
            <select
              {...register("status")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority<span className="text-red-500">*</span>
            </label>
            <select
              {...register("priority")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date<span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register("dueDate")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary"
          />
        </div>

        {/* Assigned Users */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assigned Users <span className="text-red-500">*</span>
          </label>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`w-full px-4 py-2 border ${
              errors.assignedTo ? "border-red-300" : "border-gray-300"
            } rounded-md focus:ring-secondary focus:border-secondary cursor-pointer flex justify-between items-center`}
          >
            <span className="text-gray-700">
              {assignedTo.length > 0
                ? `${assignedTo.length} user(s) selected`
                : "Select users"}
            </span>
            <svg
              className={`h-5 w-5 text-gray-400 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {dropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {loading ? (
                <div className="p-3 text-center text-gray-500">
                  Loading users...
                </div>
              ) : users.length === 0 ? (
                <div className="p-3 text-center text-gray-500">
                  No users available
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleUserToggle(user._id!)}
                  >
                    <input
                      type="checkbox"
                      checked={assignedTo.includes(user._id!)}
                      onChange={() => handleUserToggle(user._id!)}
                      className="h-4 w-4 text-secondary rounded border-gray-300 focus:ring-secondary cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="ml-3 text-gray-700">{user.name}</span>
                  </div>
                ))
              )}
            </div>
          )}
          {errors.assignedTo && (
            <p className="mt-1 text-sm text-red-600">
              {errors.assignedTo.message}
            </p>
          )}
        </div>

        {/* Subtasks */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subtasks<span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-3">
                <div className="flex-1">
                  <input
                    {...register(`subtasks.${index}.title`)}
                    placeholder="Enter subtask title"
                    className={`w-full px-4 py-2 border ${
                      errors.subtasks?.[index]?.title
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-md focus:ring-secondary focus:border-secondary`}
                  />
                  {errors.subtasks?.[index]?.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.subtasks?.[index]?.title?.message}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors"
                  title="Remove subtask"
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
            ))}
          </div>
          <button
            type="button"
            onClick={() => append({ title: "", isCompleted: false })}
            className="mt-3 flex items-center text-secondary hover:text-[#2a9bd8] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Subtask
          </button>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white font-medium rounded-md hover:bg-[#0a0d3a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
}
