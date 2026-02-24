import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import Home from './pages/Home.jsx';

import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Workout from './pages/Dashboard/Workout.jsx';
import Diet from './pages/Dashboard/Diet.jsx';
import Progress from "./pages/Dashboard/Progress.jsx";
import Analytics from "./pages/Dashboard/Analytics.jsx";
import Chat from "./pages/Dashboard/Chat.jsx";
import Settings from "./pages/Dashboard/Settings.jsx";
import ScrollToTop from './context/ScrollToTop.jsx';
import PublicLayout from "./Layout.jsx/PublicLayout.jsx";
import PrivateLayout from "./Layout.jsx/PrivateLayout.jsx";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Toaster />
        <ScrollToTop />
        <Routes>


          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>


          <Route element={<PrivateLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/diet" element={<Diet />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

        </Routes>
      </BrowserRouter>

    </>
  )
}
export default App;