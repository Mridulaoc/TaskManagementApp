import { ITask } from "../interfaces/task";

const TaskCard = ({
  task,
  isAuthenticated,
}: {
  task: ITask;
  isAuthenticated: boolean;
}) => {
  return (
    isAuthenticated && (
      <div className="border p-4 rounded-xl shadow-md bg-white">
        <h2 className="text-xl font-semibold">{task.title}</h2>
        <p className="text-gray-600">{task.description}</p>
        <div className="flex justify-between mt-2">
          <span className="text-sm text-blue-500">Status: {task.status}</span>
          <span className="text-sm text-red-500">
            Priority: {task.priority}
          </span>
        </div>
      </div>
    )
  );
};

export default TaskCard;
