import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Home from './pages/Home.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Toaster />
        <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    
    </>
  )
}

export default App