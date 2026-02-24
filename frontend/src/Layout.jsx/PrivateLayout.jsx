// src/layouts/PrivateLayout.jsx
import Navbar from "../components/Common/Header";
import { Outlet } from "react-router-dom";

const PrivateLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default PrivateLayout;