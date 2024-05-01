import * as React from 'react';

export function ProjectsPage() {
  // const tipStyle: React.CSSProperties = {
  //   color: "gray",
  //   fontSize: "var(--font-sm)",
  //   marginTop: "5px",
  //   fontStyle: "italic"
  // }
  return (
    <div className="page" id="projects-page" style={{ display: "flex" }}>
      <dialog id="new-project-modal">
        <form id="new-project-form">
          <h2>New Project</h2>
          <div className="input-list">
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">apartment</span>Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="What's the name of your project?"
              />
              <p
                style={{
                  color: "gray",
                  fontSize: "var(--font-sm)",
                  marginTop: 5,
                  fontStyle: "italic"
                }}
              >
                TIP: Give it a short name
              </p>
            </div>
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">subject</span>Description
              </label>
              <textarea
                name="description"
                cols={30}
                rows={5}
                placeholder="Give your project a nice description! So people is jealous about it."
                defaultValue={""}
              />
            </div>
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">person</span>Role
              </label>
              <select name="userRole">
                <option>Architect</option>
                <option>Engineer</option>
                <option>Developer</option>
              </select>
            </div>
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">not_listed_location</span>
                Status
              </label>
              <select name="status">
                <option>Pending</option>
                <option>Active</option>
                <option>Finished</option>
              </select>
            </div>
            <div className="form-field-container">
              <label htmlFor="finishDate">
                <span className="material-icons-round">calendar_month</span>
                Finish Date
              </label>
              <input name="finishDate" type="date" />
            </div>
            <div
              style={{
                display: "flex",
                margin: "10px 0px 10px auto",
                columnGap: 10
              }}
            >
              <button type="button" style={{ backgroundColor: "transparent" }}>
                Cancel
              </button>
              <button type="submit" style={{ backgroundColor: "rgb(18, 145, 18)" }}>
                Accept
              </button>
            </div>
          </div>
        </form>
      </dialog>
      <header>
        <h2>Projects</h2>
        <div style={{ display: "flex", alignItems: "center", columnGap: 15 }}>
          <span
            id="import-projects-btn"
            className="material-icons-round action-icon"
          >
            file_upload
          </span>
          <span
            id="export-projects-btn"
            className="material-icons-round action-icon"
          >
            file_download
          </span>
          <button id="new-project-btn">
            <span className="material-icons-round">add</span>New Project
          </button>
        </div>
      </header>
      <div id="projects-list" />
    </div>
  )
}