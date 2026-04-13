import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";

function RecentActivity() {
  const duration = 750;
  const easingMode = "easeInExpo";
  return (
    <Bar
      data={{
        labels: [
          "05/03",
          "06/03",
          "07/03",
          "08/03",
          "09/03",
          "Yesterday",
          "Today",
        ],
        datasets: [
          {
            label: "Recipes",
            data: [4, 9, 0, 5, 12, 6, 2],
            backgroundColor: "oklch(0.6739 0.0437 200.02)",
            animation: {
              delay: 0,
              duration: duration,
              easing: easingMode,
            },
          },
          {
            label: "Ingredients",
            data: [14, 3, 10, 15, 2, 0, 1],
            backgroundColor: "oklch(0.51 0.03 255.27)",
            animation: {
              delay: 250,
              duration: duration,
              easing: easingMode,
            },
          },
          {
            label: "Tags",
            data: [2, 1, 1, 0, 0, 1, 0],
            backgroundColor: "oklch(0.7442 0.1431 32.3)",
            animation: {
              delay: 500,
              duration: duration,
              easing: easingMode,
            },
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        borderWidth: 0,
        plugins: {
          tooltip: {
            titleColor: "oklch(0.3766 0.0159 255.61)",
            bodyColor: "oklch(0.3766 0.0159 255.61)",
            backgroundColor: "oklch(0.9085 0.0361 53.7)",
          },
          legend: {
            position: "bottom",
            labels: {
              color: "oklch(0.9085 0.0361 53.7)",
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "oklch(0.9085 0.0361 53.7/0.75)",
            },
            grid: {
              color: "oklch(0.9085 0.0361 53.7/0.15)",
            },
          },
          y: {
            ticks: {
              color: "oklch(0.9085 0.0361 53.7/0.75)",
            },
            grid: {
              color: "oklch(0.9085 0.0361 53.7/0.15)",
            },
          },
        },
      }}
    />
  );
}

export default RecentActivity;
