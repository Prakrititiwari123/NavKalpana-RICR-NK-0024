import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Header from "./components/Common/Header";
import Footer from "./components/Common/Footer";
import AppRoutes from "./Routes/approutes";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster />
      <Header />

      <AppRoutes />

      <Footer />
    </BrowserRouter>
  );
};

export default App;