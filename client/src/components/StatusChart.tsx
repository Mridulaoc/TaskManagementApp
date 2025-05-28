import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { getStatusChart } from "../features/taskSlice";

Chart.register(ArcElement, Tooltip, Legend);

type DoughnutChartData = {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderWidth: number;
  }[];
};

export default function StatusChart() {
  const [chartData, setChartData] = useState<DoughnutChartData>({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ["#FF6384", "#36A2EB", "#4BC0C0"],
        borderWidth: 1,
      },
    ],
  });

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const result = await dispatch(getStatusChart()).unwrap();
        const { labels, data } = result;

        setChartData({
          labels,
          datasets: [
            {
              data,
              backgroundColor: ["#FF6384", "#36A2EB", "#4BC0C0"],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Failed to load chart data:", error);
      }
    };

    fetchChartData();
  }, [dispatch]);

  return (
    <div style={{ width: "400px", margin: "0 auto" }}>
      <h3 className="text-center text-xl font-bold mb-4">Task Status Chart</h3>
      <Doughnut data={chartData} />
    </div>
  );
}
