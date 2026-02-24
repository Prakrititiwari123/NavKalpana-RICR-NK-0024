// src/layouts/PublicLayout.jsx
import Navbar from "../components/Common/Header";
import Footer from "../components/Common/Footer";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default PublicLayout;