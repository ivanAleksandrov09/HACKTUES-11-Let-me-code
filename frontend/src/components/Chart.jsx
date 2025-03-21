import { Pie } from 'react-chartjs-2';

export default function Chart({ chartData, options }) {
    return (
        <div className="chart-container">
            <h2 className="chart-title">Expense Overview</h2>
            <div className="chart-wrapper">
                <Pie data={chartData} options={options} />
            </div>
        </div>
    );
}