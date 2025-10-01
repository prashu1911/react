import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "customHooks";
import participantRouteMap from "routes/Participant/participantRouteMap";
import adminRouteMap from "../../routes/Admin/adminRouteMap";

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    fontFamily: "Arial, sans-serif",
  },
  errorMessage: {
    textAlign: "center",
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  header: {
    fontSize: "100px",
    color: "#ff6347",
    margin: 0,
  },
  subHeader: {
    fontSize: "24px",
    color: "#333",
    margin: "10px 0",
  },
  description: {
    fontSize: "16px",
    color: "#777",
    marginBottom: "20px",
  },
  homeLink: {
    fontSize: "18px",
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "bold",
  },
};
const Unauthorized = () => {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const navigate = useNavigate();
  const handleNavigate = () => {
    if (userData?.roleName === "Participant") {
      setTimeout(() => {
        navigate(participantRouteMap.STARTSURVEY.path);
      }, [100]);
    } else {
      setTimeout(() => {
        navigate(adminRouteMap.DASHBOARD.path);
      }, [100]);
    }
  };
  return (
    <div style={styles.container}>
      <div style={styles.errorMessage}>
        <h1 style={styles.header}>401</h1>
        <p style={styles.subHeader}>Unauthorized</p>
        <p style={styles.description}>
          You do not have permission to access this page. Please contact the
          administrator.
        </p>
        <Link onClick={handleNavigate} style={styles.homeLink}>
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
