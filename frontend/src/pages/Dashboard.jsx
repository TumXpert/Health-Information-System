import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaUsers, FaBookOpen, FaClipboardList, FaChartPie } from "react-icons/fa";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPrograms: 0,
    totalClients: 0,
    totalEnrollments: 0,
    enrollmentData: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/dashboard");

      if (res.data) {
        setStats({
          totalPrograms: res.data.totalPrograms || 0,
          totalClients: res.data.totalClients || 0,
          totalEnrollments: res.data.totalEnrollments || 0,
          enrollmentData: res.data.enrollmentData || [],
        });
      } else {
        toast.error("Invalid dashboard data received.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const pieChartData = {
    labels: stats.enrollmentData.map((item) => item.programName),
    datasets: [
      {
        data: stats.enrollmentData.map((item) => item.enrollmentCount),
        backgroundColor: [
          "#4e73df",
          "#1cc88a",
          "#36b9cc",
          "#f6c23e",
          "#e74a3b",
          "#858796",
          "#5a5c69",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const pieChartOptions = {
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="container my-4" active>
      <ToastContainer />
      <h1 className="h2 mb-4">Dashboard</h1>

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <div className="card shadow-sm border-0">
                <div className="card-body d-flex align-items-center gap-3">
                  <FaBookOpen size={36} className="text-primary" />
                  <div>
                    <h5 className="card-title mb-0">Programs</h5>
                    <h3 className="fw-bold">{stats.totalPrograms}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card shadow-sm border-0">
                <div className="card-body d-flex align-items-center gap-3">
                  <FaUsers size={36} className="text-success" />
                  <div>
                    <h5 className="card-title mb-0">Clients</h5>
                    <h3 className="fw-bold">{stats.totalClients}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card shadow-sm border-0">
                <div className="card-body d-flex align-items-center gap-3">
                  <FaClipboardList size={36} className="text-warning" />
                  <div>
                    <h5 className="card-title mb-0">Enrollments</h5>
                    <h3 className="fw-bold">{stats.totalEnrollments}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enrollment Pie Chart */}
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title mb-4 d-flex align-items-center gap-2">
                <FaChartPie /> Enrollment Distribution
              </h5>

              {stats.enrollmentData.length > 0 ? (
                <div style={{ height: "400px" }}>
                  <Pie data={pieChartData} options={pieChartOptions} />
                </div>
              ) : (
                <div className="text-center text-muted py-5">
                  No enrollment data available.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
