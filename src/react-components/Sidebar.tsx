import * as React from "react";
import * as Router from "react-router-dom";

export function Sidebar() {
  return (
    <aside id="sidebar">
      <img id="company-logo" src="./assets/company-logo.svg" alt="Construction Company" />
      <ul id="nav-buttons">
        <Router.Link to="/">
          <li>
            <bim-label style={{ color: "#fff" }} icon="material-symbols:apartment">Projects</bim-label>
          </li>
        </Router.Link>
        <Router.Link to="/users">
          <li>
            <bim-label style={{ color: "#fff" }} icon="mdi:users">Users</bim-label>
          </li>
        </Router.Link>
      </ul>
    </aside>
  )
}