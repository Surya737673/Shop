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
    <div  style={{minHeight:"480px", maxHeight: "480px" }}>
      <Line data={data} options={ options } />
    </div>
  );
};

export default LineChart;