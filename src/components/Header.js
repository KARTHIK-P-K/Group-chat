import React from "react";
import { useAuth } from "../utils/AuthContext";
import { LogOut } from "react-feather";

const Header = () => {
  const { user, handleUserLogOut } = useAuth();
  return (
    <div id="header--wrapper">
      {user ? (
        <>
          Welcome {user.name}
          <LogOut onClick={handleUserLogOut} className="header--link" />
        </>
      ) : (
        <button>LogIn</button>
      )}
    </div>
  );
};

export default Header;
