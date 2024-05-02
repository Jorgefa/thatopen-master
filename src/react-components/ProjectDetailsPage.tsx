import * as React from 'react';
import * as Router from 'react-router-dom';
import { ProjectsManager } from '../classes/ProjectsManager';

interface Props {
  projectsManager: ProjectsManager
}

export function ProjectDetailsPage(props: Props) {
  const routeParams = Router.useParams<{id: string}>()
  console.log(`Project ID: ${routeParams.id}`);
  const project = props.projectsManager.getProject()
  return (
    <div className="page" id="project-details">
      <header>
        <div>
          <h2 data-project-info="name">Hospital Center</h2>
          <p style={{ color: "#969696" }}>Community hospital located at downtown</p>
        </div>
      </header>
      <div className="main-page-content">
        <div style={{ display: "flex", flexDirection: "column", rowGap: 30 }}>
          <div className="dashboard-card" style={{ padding: "30px 0" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0px 30px",
                marginBottom: 30
              }}
            >
              <p
                style={{
                  fontSize: 20,
                  backgroundColor: "#ca8134",
                  aspectRatio: 1,
                  borderRadius: "100%",
                  padding: 12
                }}
              >
                HC
              </p>
              <button className="btn-secondary">
                <p style={{ width: "100%" }}>Edit</p>
              </button>
            </div>
            <div style={{ padding: "0 30px" }}>
              <div>
                <h5>Hospital Center</h5>
                <p>Community hospital located at downtown</p>
              </div>
              <div
                style={{
                  display: "flex",
                  columnGap: 30,
                  padding: "30px 0px",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                    Status
                  </p>
                  <p>Active</p>
                </div>
                <div>
                  <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                    Cost
                  </p>
                  <p>$ 2'542.000</p>
                </div>
                <div>
                  <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                    Role
                  </p>
                  <p>Engineer</p>
                </div>
                <div>
                  <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                    Finish Date
                  </p>
                  <p>2023-05-01</p>
                </div>
              </div>
              <div
                style={{
                  backgroundColor: "#404040",
                  borderRadius: 9999,
                  overflow: "auto"
                }}
              >
                <div
                  style={{
                    width: "80%",
                    backgroundColor: "green",
                    padding: "4px 0",
                    textAlign: "center"
                  }}
                >
                  80%
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard-card" style={{ flexGrow: 1 }}>
            <div
              style={{
                padding: "20px 30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <h4>To-Do</h4>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                  columnGap: 20
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", columnGap: 10 }}
                >
                  <span className="material-icons-round">search</span>
                  <input
                    type="text"
                    placeholder="Search To-Do's by name"
                    style={{ width: "100%" }}
                  />
                </div>
                <span className="material-icons-round">add</span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "10px 30px",
                rowGap: 20
              }}
            >
              <div className="todo-item">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div
                    style={{ display: "flex", columnGap: 15, alignItems: "center" }}
                  >
                    <span
                      className="material-icons-round"
                      style={{
                        padding: 10,
                        backgroundColor: "#686868",
                        borderRadius: 10
                      }}
                    >
                      construction
                    </span>
                    <p>Make anything here as you want, even something longer.</p>
                  </div>
                  <p style={{ marginLeft: 10 }}>Fri, 20 sep</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          id="viewer-container"
          className="dashboard-card"
          style={{ minWidth: 0 }}
        />
      </div>
    </div>
  );
}