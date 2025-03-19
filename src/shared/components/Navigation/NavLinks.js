import React, { useContext } from "react";
import { NavLink, useHistory } from "react-router-dom"; // Use useHistory instead of useNavigate
import { AuthContext } from "../../context/auth-context";
import Cookie from "js-cookie";
import "./NavLinks.css";

const NavLinks = () => {
  const auth = useContext(AuthContext);
  const history = useHistory(); // Use useHistory for React Router v5

  const logoutHandler = () => {
    auth.logout();

    // Ensure all auth-related cookies are removed
    Cookie.remove("userId");
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    history.push("/auth"); // Redirect to login page after logout
  };

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          Home
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">ADD PLACE</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button type="button" onClick={logoutHandler}>
            LOGOUT
          </button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
