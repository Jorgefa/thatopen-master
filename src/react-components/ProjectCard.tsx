import * as React from "react";
import { Project } from "../classes/Project";

interface Props {
    project: Project
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
                    fontWeight: "bold",
                    color: "#000"
                }}
                >{props.project.name}</bim-label>
                <bim-label style={{color: "#969696"}}>{props.project.description}</bim-label>
            </div>
        </div>
        <div className="card-content">
            <div className="card-property">
                <bim-label style={{color: "#969696"}}>Status</bim-label>
                <bim-label style={{color: "#000"}}>{props.project.status}</bim-label>
            </div>
            <div className="card-property">
                <bim-label style={{color: "#969696"}}>Role</bim-label>
                <bim-label style={{color: "#000"}}>{props.project.userRole}</bim-label>
            </div>
            <div className="card-property">
                <bim-label style={{color: "#969696"}}>Cost</bim-label>
                <bim-label style={{color: "#000"}}>{props.project.cost}</bim-label>
            </div>
            <div className="card-property">
                <bim-label style={{color: "#969696"}}>Estimated Progress</bim-label>
                <bim-label style={{color: "#000"}}>{props.project.progress * 100}</bim-label>
            </div>
            <div className="card-property">
                <bim-label style={{color: "#969696"}}>Tasks</bim-label>
                <bim-label style={{color: "#000"}}>{props.project.taskList.length}</bim-label>
            </div>
        </div>
    </div>
  )
}