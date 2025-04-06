import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Chart from "./Chart";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="chart-container">
        <h2 className="chart-title">Expense Overview</h2>
        <div className="chart-wrapper">
          <p className="text-center">
            No expense data available yet. Add some transactions to see your
            spending breakdown.
          </p>
        </div>
      </div>
    );
  }

  const possibleColors = [
    "rgba(28, 28, 72, 1)", // Muted Midnight Blue
    "rgba(41, 51, 61, 1)", // Deep Slate Gray
    "rgba(66, 99, 146, 1)", // Soft Steel Blue
    "rgba(87, 135, 125, 1)", // Gentle Pine Green
    "rgba(124, 165, 115, 1)", // Mossy Green
    "rgba(189, 204, 99, 1)", // Muted Lemon Yellow
    "rgba(224, 206, 149, 1)", // Soft Sand Beige
    "rgba(197, 145, 91, 1)", // Matte Copper
    "rgba(199, 111, 107, 1)", // Earthy Coral
    "rgba(180, 142, 157, 1)", // Dusty Rose
    "rgba(160, 112, 186, 1)", // Subtle Mauve
    "rgba(117, 76, 148, 1)", // Matte Amethyst
    "rgba(77, 62, 102, 1)", // Smoky Violet
    "rgba(64, 61, 85, 1)", // Charcoal Purple
    "rgba(41, 41, 56, 1)", // Ashy Deep Gray
  ];

  function makeBackgroundColors(transactionsSet) {
    const transactionCategories = Array.from(transactionsSet);
    let dictionary = {};

    transactionCategories.forEach((category, index) => {
      dictionary[category] = possibleColors[index];
    });

    return dictionary;
  }

  const transactionsSet = new Set(
    transactions.map((transaction) => transaction.category)
  );
  const backgroundColors = makeBackgroundColors(transactionsSet);
  const x = transactions.map(
    (transaction) => backgroundColors[transaction.category]
  );

  const chartData = {
    labels: [...transactions.map((transaction) => transaction.category)],
    datasets: [
      {
        data: [...transactions.map((transaction) => transaction.amount)],
        backgroundColor: x,
        borderColor: "rgb(255, 255, 255)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: {
            size: 14,
            family: "Arial",
          },
          color: "#333",
          padding: 20,
          usePointStyle: true,
          generateLabels: function (chart) {
            const data = chart.data;
            let uniqueLabels = new Set();
            let result = [];

            if (data.labels.length && data.datasets.length) {
              data.labels.forEach((label, i) => {
                if (!uniqueLabels.has(label)) {
                  uniqueLabels.add(label);
                  result.push({
                    text: `${label}: $${data.datasets[0].data[i]}`,
                    fillStyle: data.datasets[0].backgroundColor[i],
                    hidden: false,
                    lineCap: "round",
                    lineDash: [],
                    lineDashOffset: 0,
                    lineJoin: "round",
                    lineWidth: 3,
                    strokeStyle: data.datasets[0].backgroundColor[i],
                    pointStyle: "circle",
                    index: i,
                  });
                }
              });
              return result;
            }
            return [];
          },
        },
      },
      title: {
        display: true,
        text: "Expense Distribution",
        font: {
          size: 16,
        },
      },
    },
  };

  return <Chart chartData={chartData} options={options} />;
};

export default PieChart;
