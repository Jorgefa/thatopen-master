import * as React from "react";
import * as Router from "react-router-dom"
import { color } from "three/examples/jsm/nodes/Nodes.js";

export function Sidebar() {
  return (
    <aside id="sidebar">
    <img id="company-logo" src="../../assets/LogoNonome01.png" alt="Nonome"/>
    <ul id="nav-buttons">
        <Router.Link to="/">
          <li>
            <bim-label style={{color: "#000"}} icon="material-symbols:apartment">Projects</bim-label>
          </li>
        </Router.Link>
        <Router.Link to="/users">
          <li>
            <bim-label style={{color: "#000"}} icon="mdi:user">Users</bim-label>
          </li>
        </Router.Link>
      </ul>
    </aside>
  )
}