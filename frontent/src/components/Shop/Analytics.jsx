import React, { useEffect, useState } from 'react';
import PieChart from '../Charts/PieChart';
import BarChar from '../Charts/Barchar';
import axios from 'axios';
import { server } from '../../server';
import { useSelector } from 'react-redux';
import LineChart from '../Charts/LineChart';

const Analytics = () => {
    const { seller } = useSelector((state) => state.seller);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [netProfit, setNetProfit] = useState(0);
    const [chartData, setChartData] = useState({});
    const [chart, setChart] = useState(" ");

    useEffect(() => {
        try {
            axios.get(`${server}/shop/get-analytics-data/${seller._id}`, { withCredentials: true }).then((res) => {
                settingSaleData(res.data.orders)
                setTotalOrders(res.data.orders.length);
                setTotalProducts(res.data.products.length);
                const total = res.data.orders.reduce((accumulator, order) => accumulator + order.totalPrice, 0);
                const profit = 0.3 * (total)
                setTotalSales("$" + total);
                setNetProfit(profit);
            });

        } catch (error) {
            console.log(error.response.data.message)
        }

        // if (chartData) {
        //     setChart("lineChart")
        // }
        
    }, [])

    function settingSaleData(orders) {
        const salesByMonth = {};
        orders.forEach((order) => {
            const paidAt = new Date(order.paidAt);
            const month = paidAt.toLocaleString('default', { month: 'long' });
            const sales = order.totalPrice;

            if (salesByMonth[month]) {
                salesByMonth[month] += sales;
            } else {
                salesByMonth[month] = sales;
            }
        });

        settingChartData(salesByMonth);
    }

    const handleChart = (e) => {
        setChart("")
        const selectedChart = e.target.value;

        if (selectedChart === "barChart") {
            setChart("barChart");
        } else if (selectedChart === "pieChart") {
            setChart("pieChart");
        } else if (selectedChart === "lineChart") {
            setChart("lineChart");
        } else {
            setChart("lineChart");
        }

    }

    function settingChartData(salesByMonth) {
        const labels = Object.keys(salesByMonth);
        const data = Object.values(salesByMonth);

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: "My First dataset",
                    backgroundColor: "rgb(255, 99, 132)",
                    borderColor: "rgb(255, 99, 132)",
                    data: data,
                },
            ],
        });
    }



    return (
        <div id="container" className="flex w-full flex-col min-h-screen">
            <div id="header" className="bg-white-800 py-4 px-6">
                <h1 className="text-2xl font-bold">Overview</h1>
            </div>
            <div id="content" className="flex-grow p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="card">
                        <div className="p-4 bg-white rounded shadow">
                            <h3 className="text-gray-500">Total Sales</h3>
                            <h1 className="text-3xl font-bold">{totalSales}</h1>
                        </div>
                    </div>
                    <div className="card">
                        <div className="p-4 bg-white rounded shadow">
                            <h3 className="text-gray-500">Total Products</h3>
                            <h1 className="text-3xl font-bold">{totalProducts}</h1>
                        </div>
                    </div>
                    <div className="card">
                        <div className="p-4 bg-white rounded shadow">
                            <h3 className="text-gray-500">Total Orders</h3>
                            <h1 className="text-3xl font-bold">{totalOrders}</h1>
                        </div>
                    </div>
                    <div className="card">
                        <div className="p-4 bg-white rounded shadow">
                            <h3 className="text-gray-500">Net Profit</h3>
                            <h1 className="text-3xl font-bold">{netProfit}</h1>
                        </div>
                    </div>
                </div>

                <div className="border border-gray-300 h-96 mt-6">

                    <select name="selectChart" id="selectChart" onChange={handleChart} >
                        <option value="select">select Chart</option>
                        <option value="barChart">Bar Char</option>
                        <option value="pieChart">Pie Chart</option>
                        <option value="lineChart">Line Chart</option>
                    </select>
                    {chart === "" || chart === undefined ? (<LineChart data={chartData} />) : null}
                    {chart && chart === "pieChart" ? (<PieChart data={chartData} />) : null}
                    {chart && chart === "barChart" ? (<BarChar data={chartData} />) : null}
                    {chart && chart === "lineChart" ? (<LineChart data={chartData} />) : null}

                </div>

                <div className="mt-6">
                    <h3 className="text-gray-500">Top Selling Products</h3>
                    <table className="table-auto w-full">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Product</th>
                                <th className="px-4 py-2">Quantity Sold</th>
                                <th className="px-4 py-2">Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border px-4 py-2">Product 1</td>
                                <td className="border px-4 py-2">10</td>
                                <td className="border px-4 py-2">$100</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">Product 2</td>
                                <td className="border px-4 py-2">8</td>
                                <td className="border px-4 py-2">$80</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
