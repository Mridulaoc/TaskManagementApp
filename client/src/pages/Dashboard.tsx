import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserTasks } from "../features/taskSlice";
import TaskCard from "../components/TaskCard";
import { AppDispatch, RootState } from "../store/store";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userTasks } = useSelector((state: RootState) => state.task);
  const { userId, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserTasks(userId));
    }
  }, [dispatch, userId]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">My Tasks</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userTasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
