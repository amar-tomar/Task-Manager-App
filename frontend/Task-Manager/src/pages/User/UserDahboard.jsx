import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { IoMdCard } from "react-icons/io";
import { LuArrowRight } from "react-icons/lu";

import useUserAuth from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import apiPaths from "../../utils/apiPaths";
import InfoCard from "../../components/Cards/InfoCard";
import TaskListTable from "../../components/layout/TaskListTable";
import { addThousandsSeparator } from "../../utils/helper";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomBarChart from "../../components/Charts/CustomBarChart";

const COLORS = ["#d851ff", "#00b8db", "#7bce00"]; // Pie chart colors

const Dashboard = () => {
  useUserAuth();
  const { User } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const prepareChartData = (charts) => {
    const statusDist = charts?.statusDistribution || {};
    const priorityDist = charts?.priorityDistribution || {};

    // Prepare Pie chart data (status distribution)
    const pieData = [
      { status: "Pending", count: statusDist["pending"] || 0 },
      { status: "In Progress", count: statusDist["in progress"] || 0 },
      { status: "Completed", count: statusDist["completed"] || 0 },
    ];
    setPieChartData(pieData);

    // Prepare Bar chart data (priority distribution)
    const barData = Object.keys(priorityDist).map(priority => ({
      priority,
      count: priorityDist[priority] || 0,
    }));
    setBarChartData(barData);
  };

  const getDashboardData = async () => {
    try {
      const res = await axiosInstance.get(apiPaths.tasks.dashboardData);
      if (res.data) {
        setDashboardData(res.data);
        prepareChartData(res.data?.charts);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  const onSeeMore = () => navigate("/admin/tasks");

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div className="col-span-3">
          <h2 className="text-xl md:text-2xl">Good Morning! {User?.name}</h2>
          <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
            {moment().format("dddd, Do MMM YYYY")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Tasks"
            value={addThousandsSeparator(dashboardData?.statistics?.totalTasks || 0)}
            color="bg-lime-500"
          />
          <InfoCard
            icon={<IoMdCard />}
            label="Pending Tasks"
            value={addThousandsSeparator(dashboardData?.statistics?.pendingTasks || 0)}
            color="bg-red-500"
          />
          <InfoCard
            icon={<IoMdCard />}
            label="In Progress Tasks"
            value={addThousandsSeparator(dashboardData?.statistics?.inProgressTasks || 0)}
            color="bg-yellow-500"
          />
          <InfoCard
            icon={<IoMdCard />}
            label="Completed Tasks"
            value={addThousandsSeparator(dashboardData?.statistics?.completedTasks || 0)}
            color="bg-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <h5 className="font-medium">Task Distribution</h5>
          </div>
          <CustomPieChart data={pieChartData} colors={COLORS} />
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <h5 className="font-medium">Task Priority Levels</h5>
          </div>
          <CustomBarChart data={barChartData} />
        </div>

        <div className="md:col-span-2 card">
          <div className="flex items-center justify-between">
            <h5 className="text-lg">Recent Tasks</h5>
            <button className="class-btn flex items-center gap-1" onClick={onSeeMore}>
              See All <LuArrowRight className="text-base" />
            </button>
          </div>
          <TaskListTable tableData={dashboardData?.recentTasks || []} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
