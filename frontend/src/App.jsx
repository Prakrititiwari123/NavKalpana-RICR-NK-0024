import { BrowserRouter,Routes,Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import Home from './pages/Home.jsx';
import Footer from './components/Common/Footer.jsx';
import Header from './components/Common/Header.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Workout from './pages/Dashboard/Workout.jsx';
import Diet from './pages/Dashboard/Diet.jsx';
import ScrollToTop from './context/ScrollToTop.jsx';

const App = () => {
  return (  
    <>
      <BrowserRouter>
        <Toaster />
        <ScrollToTop/>
        <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/diet" element={<Diet />} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    
    </>
  )
}
export default App;