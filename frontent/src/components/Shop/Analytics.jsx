import React, { useEffect, useState } from 'react';
import PieChart from '../Charts/PieChart';
import BarChar from '../Charts/Barchar';
import axios from 'axios';
import { server } from '../../server';
import { useSelector } from 'react-redux';
import LineChart from '../Charts/LineChart';
import { BiDollarCircle } from "react-icons/bi";
import { HiOutlineClipboardCheck } from "react-icons/hi";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { RiMoneyDollarCircleLine } from "react-icons/ri"

const Analytics = () => {
    const { seller } = useSelector((state) => state.seller);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [netProfit, setNetProfit] = useState(0);
    const [chartData, setChartData] = useState({});
    const [chart, setChart] = useState(" ");
    const [topSelling, setTopSelling] = useState([])

    useEffect(() => {
        try {
            axios.get(`${server}/shop/get-analytics-data/${seller._id}`, { withCredentials: true }).then((res) => {
                console.log(res)
                settingSaleData(res.data.orders);
                setTotalOrders(res.data.orders.length);
                setTotalProducts(res.data.products.length);
                const total = res.data.orders.reduce((accumulator, order) => accumulator + order.totalPrice, 0);
                const profit = 0.3 * (total)
                setTotalSales("₹" + total);
                setNetProfit("₹" + profit);
                setTopSelling(res.data.topeSellingproducts)
                setChart("barChart")
            });
        } catch (error) {
            console.log(error.response.data.message)
        }

    }, [])

    function settingSaleData(orders) {
        const salesByMonth = {};

        // Initialize salesByMonth with all twelve months
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        months.forEach((month) => {
            salesByMonth[month] = 0;
        });

        orders.forEach((order) => {
            const paidAt = new Date(order.paidAt);
            const month = paidAt.toLocaleString('default', { month: 'long' });
            const sales = order.totalPrice;

            salesByMonth[month] += sales;
        });

        settingChartData(salesByMonth);
    }

    const handleChart = (e) => {

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
                    label: "Total Sales",
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div className="card rounded-lg">
                        <div className="p-4 rounded-lg shadow" style={{backgroundColor:"#F5DEB3"}}>
                            <div className="flex items-center">
                                <BiDollarCircle className="text-3xl text-grey" />
                                <h3 className="text-grey ml-2">Total Sales</h3>
                            </div>
                            <div className="mt-4">
                                <h1 className="text-3xl font-bold text-left ml-2">{totalSales}</h1>
                            </div>
                        </div>
                    </div>
                    <div className="card rounded-lg">
                        <div className="p-4 rounded-lg shadow" style={{backgroundColor:"#D8BFD8"}}>
                            <div className="flex items-center">
                                <HiOutlineClipboardCheck className="text-3xl text-grey" />
                                <h3 className="text-grey ml-2">Total Products</h3>
                            </div>
                            <div className="mt-4">
                                <h1 className="text-3xl font-bold text-left ml-2">{totalProducts}</h1>
                            </div>
                        </div>
                    </div>
                    <div className="card rounded-lg">
                        <div className="p-4  rounded-lg shadow" style={{backgroundColor:"#FA8072"}}>
                            <div className="flex items-center">
                                <AiOutlineShoppingCart className="text-3xl text-grey" />
                                <h3 className="text-grey ml-2">Total Orders</h3>
                            </div>
                            <div className="mt-4">
                                <h1 className="text-3xl font-bold text-left ml-2">{totalOrders}</h1>
                            </div>
                        </div>
                    </div>
                    <div className="card rounded-lg">
                        <div className="p-4  rounded-lg shadow" style={{backgroundColor:"#ADD8E6"}}>
                            <div className="flex items-center">
                                <RiMoneyDollarCircleLine className="text-3xl text-grey" />
                                <h3 className="text-grey ml-2">Net Profit</h3>
                            </div>
                            <div className="mt-4">
                                <h1 className="text-3xl font-bold text-left ml-2">{netProfit}</h1>
                            </div>
                        </div>
                    </div>
                </div>




                <div className="border border-gray-300 mt-12" style={{minHeight:"480px"}}>

                    <select name="selectChart" id="selectChart" onChange={handleChart} >
                        <option value="barChart">Bar Char</option>
                        <option value="pieChart">Pie Chart</option>
                        <option value="lineChart">Line Chart</option>
                    </select>

                    {chart && chart === "pieChart" && (<PieChart data={chartData} />)}
                    {chart && chart === "barChart" && (<BarChar data={chartData} />)}
                    {chart && chart === "lineChart" && (<LineChart data={chartData} />)}

                </div>

                <div class="bg-white shadow-md rounded-lg p-4 mt-12">
                    <h3 class="text-black-600 font-bold">Top Selling Products</h3>
                    <table class="table-auto w-full mt-4">
                        <thead>
                            <tr>
                                {/* <th class="px-4 py-2 text-left text-gray-700 font-normal">Product Image</th> */}
                                <th class="px-4 py-2 text-left text-gray-700 font-normal">Product Name</th>
                                <th class="px-4 py-2 text-left text-gray-700 font-normal">Quantity Sold</th>
                                <th class="px-4 py-2 text-left text-gray-700 font-normal">Revenue</th>
                                <th class="px-4 py-2 text-left text-gray-700 font-normal">Stock status</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                topSelling && topSelling.map((prod, i) => (
                                    <tr key={prod._id}>
                                        {/* <td className="border px-4 py-2">{ prod.images&& (<img src={prod.images[0]} alt='' />) }</td> */}
                                        <td className="border px-4 py-2">{prod.name}</td>
                                        <td className="border px-4 py-2">{prod.sold_out}</td>
                                        <td className="border px-4 py-2">{"₹" + prod.discountPrice * prod.sold_out}</td>
                                        <td className="border px-4 py-2" style={{ color: prod.stock > 0 ? "black" : "red" }}>{prod.stock > 0 ? "In stock" : "Out of stock"}</td>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>
                </div>


            </div>
        </div>
    );
};

export default Analytics;
