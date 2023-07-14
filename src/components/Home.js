import React, { useEffect } from "react";
import Header from "./Header";
import { Link } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { user, createCollection } = useAuth();
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  });
  return (
    <div>
      <Header />

      <div className="flex justify-center items-center border  p-4  w-60 h-screen w-full">
        <div className="border border-gray-300 p-40 m-10">
          <div className="flex justify-center items-center">
            <Link to="/room1">Frontend Freaks</Link>
          </div>
        </div>

        <div className="border border-gray-300 p-40 m-10">
          <div className="flex justify-center items-center">
            <Link to="/room2">Backend Freaks</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
