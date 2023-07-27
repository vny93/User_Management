import { React, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logoApp from "../assets/images/logo192.png";
import { useLocation, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useDispatch, useSelector } from "react-redux";
import { handleLogoutRedux } from "../redux/actions/userAction";

const Header = (props) => {

  const location = useLocation();
  const navigate = useNavigate();

  // const { logout, user } = useContext(UserContext);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.account);

  const handleLogout = () => {
    dispatch(handleLogoutRedux());
    // logout();
    // navigate("/");
    // toast.success("Logout successfully!");
  };

  useEffect(() => {//no' se co TH login sai user ma` van chay doan code nay nen phai them DK url != '/login'
    if (user && user.auth === false && window.location.pathname !== "/login") {
      navigate("/");
      toast.success("Logout successfully!");
    }
  }, [user]);

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">
            <img
              src={logoApp}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
            <span> User Manager App</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {((user && user.auth) || window.location.pathname === "/") && (
              <>
                <Nav className="me-auto">
                  <NavLink className="nav-link" to="/">
                    Home
                  </NavLink>

                  <NavLink className="nav-link" to="/users">
                    Manage Users
                  </NavLink>
                </Nav>
                <Nav>
                  {user && user.email && (
                    <span className="nav-link">Welcome {user.email}</span>
                  )}
                  <NavDropdown title="Setting">
                    {user && user.auth === true ? (
                      <NavDropdown.Item onClick={() => handleLogout()}>
                        Logout
                      </NavDropdown.Item>
                    ) : (
                      <NavLink className="dropdown-item" to="/login">
                        Login
                      </NavLink>
                    )}
                  </NavDropdown>
                </Nav>
              </>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
