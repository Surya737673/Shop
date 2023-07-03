import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend , BarElement} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement);

function PieChart({data}) {
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
  return <Pie data={data}  options={ options } />;
}

export default PieChart