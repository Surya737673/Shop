import React from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";



const LineChart = ({data}) => {
    const options={
        responsive:true,
        title: { text: "Sales Report", display: true },
        scales:{
            yAxes:{
                ticks:{
                    beginAtZero: true
                }
            }
        }
    }
  return (
    <div>
      <Line data={data} options={ options } />
    </div>
  );
};

export default LineChart;