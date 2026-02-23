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
import Progress from "./pages/Dashboard/Progress.jsx";
import Analytics from "./pages/Dashboard/Analytics.jsx";
import Chat from "./pages/Dashboard/Chat.jsx";
import Settings from "./pages/Dashboard/Settings.jsx";
import About from "./pages/About.jsx";  
import Benefits from "./pages/Benefits.jsx";
import Features from "./pages/Features.jsx";
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
          <Route path="/progress" element={<Progress />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          <Route path="/benefits" element={<Benefits />} />
          <Route path="/features" element={<Features />} /> 
        </Routes>
        <Footer/>
      </BrowserRouter>
    
    </>
  )
}
export default App;