import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import { FaUsers, FaShoppingCart, FaRupeeSign } from "react-icons/fa";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: { type: "line" },
      tooltip: { theme: "dark" },
      colors: ["#00E396"],
      dataLabels: { enabled: true },
      stroke: { curve: "smooth" },
      title: {
        text: "Sales Trend",
        align: "left",
        style: { color: "#FFD700" },
      },
      grid: { borderColor: "#444" },
      markers: { size: 3 },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
          style: { color: "#FFD700" },
        },
      },
      yaxis: {
        title: {
          text: "Sales",
          style: { color: "#FFD700" },
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formattedSalesDate.map((item) => item.x),
          },
        },
        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <>
      <AdminMenu />

      <section className="xl:ml-[4rem] md:ml-0 p-6">
        {/* Dashboard Summary Cards */}
        <div className="flex flex-wrap gap-8 justify-center">
          {[
            {
              label: "Sales",
              value: sales?.totalSales.toFixed(2),
              icon: <FaRupeeSign />,
            },
            {
              label: "Customers",
              value: customers?.length,
              icon: <FaUsers />,
            },
            {
              label: "All Orders",
              value: orders?.totalOrders,
              icon: <FaShoppingCart />,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="backdrop-blur-md bg-white/10 border border-white/10 text-white rounded-xl shadow-lg p-6 w-72 transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 text-white text-xl mx-auto shadow-sm">
                {item.icon}
              </div>
              <p className="mt-4 text-center text-sm text-gray-200">
                {item.label}
              </p>
              <h2 className="text-center text-2xl font-bold mt-2">
                {isLoading && item.label === "Sales" ? (
                  <Loader />
                ) : (
                  <>
                    {item.label === "Sales" && <FaRupeeSign className="inline mr-1" />}
                    {item.value}
                  </>
                )}
              </h2>
            </div>
          ))}
        </div>

        {/* Sales Chart */}
        <div className="flex justify-center mt-20">
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-xl p-6 w-full max-w-4xl">
            <Chart
              options={state.options}
              series={state.series}
              type="bar"
              width="100%"
            />
          </div>
        </div>

        {/* Order List */}
        <div className="mt-16">
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
