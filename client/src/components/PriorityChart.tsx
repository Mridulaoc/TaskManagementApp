import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { getPriorityChart } from "../features/taskSlice";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type BarChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderRadius: number;
  }[];
};

export default function PriorityChart() {
  const [chartData, setChartData] = useState<BarChartData>({
    labels: [],
    datasets: [
      {
        label: "Task Count",
        data: [],
        backgroundColor: ["#FFA500", "#36A2EB", "#FF6384"],
        borderRadius: 8,
      },
    ],
  });
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchChartData = async () => {
      const result = await dispatch(getPriorityChart()).unwrap();
      const { labels, data } = result;

      const priorityOrder = ["low", "medium", "high"];
      const orderedData = priorityOrder.map((priority) => {
        const index = labels.indexOf(priority);
        return index !== -1 ? data[index] : 0;
      });

      setChartData({
        labels: priorityOrder,
        datasets: [
          {
            label: "Task Count",
            data: orderedData,
            backgroundColor: ["#FFA500", "#36A2EB", "#FF6384"],
            borderRadius: 8,
          },
        ],
      });
    };

    fetchChartData();
  }, []);

  return (
    <div style={{ width: "600px", margin: "0 auto" }}>
      <h3 className="text-center text-xl font-bold mb-4">
        Task Priority Chart
      </h3>
      <Bar data={chartData} />
    </div>
  );
}
