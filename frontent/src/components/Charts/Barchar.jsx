import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


function BarChar({ data }) {
  console.log(data)
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
  return <Bar data={data} options={ options } />;
}

export default BarChar;





