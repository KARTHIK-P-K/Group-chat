import "./App.css";
import Room from "./Pages/Room";
import PrivateRoutes from "./components/PrivateRoutes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";
import { AuthProvider } from "./utils/AuthContext";
import Home from "./components/Home";
import Room1 from "./Pages/Room1";
import Room2 from "./Pages/Room2";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<Home />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/room1" element={<Room1 />} />
            <Route path="/room2" element={<Room2 />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
