import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Joystick } from "./assets/svg";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <Navbar className="top-nav-bar" bg="primary" variant="dark">
      <span>
        <Link to="/">
          <Joystick />
          <Navbar.Brand href="#" id="riddle-game-title">
            Categories Lite
          </Navbar.Brand>
        </Link>
      </span>
      <Nav className="profile-pic">
        <Nav.Item>
          <Nav.Link href="#">
            <i className="bi bi-person-circle icon-size" />
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </Navbar>
  );
};

export default Navigation; 