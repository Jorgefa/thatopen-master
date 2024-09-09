import * as React from "react";
import { Project } from "../classes/Project";

interface Props {
  project: Project;
}

export function ProjectCard(props: Props) {
  return (
    <div className="project-card">
      <div className="card-header">
        <p
          style={{
            backgroundColor: "#ca8134",
            padding: 10,
            borderRadius: 8,
            aspectRatio: 1
          }}
        >
          HC
        </p>
        <div>
          <bim-label 
            style={{ 
              fontSize: "16px", 
              color: "#fff", 
              fontWeight: "bold" 
            }}
          >{ props.project.name }</bim-label>
          <bim-label style={{ color: "#fff" }}>{ props.project.description }</bim-label>
        </div>
      </div>
      <div className="card-content">
        <div className="card-property">
          <bim-label>Status</bim-label>
          <bim-label style={{ color: "#fff"}}>{ props.project.status }</bim-label>
        </div>
        <div className="card-property">
          <bim-label>Role</bim-label>
          <bim-label style={{ color: "#fff"}}>{ props.project.userRole }</bim-label>
        </div>
        <div className="card-property">
          <bim-label>Cost</bim-label>
          <bim-label style={{ color: "#fff"}}>$ { props.project.cost }</bim-label>
        </div>
        <div className="card-property">
          <bim-label>Estimated Progress</bim-label>
          <bim-label style={{ color: "#fff"}}>{ props.project.progress } %</bim-label>
        </div>
      </div>
    </div>
  )
}