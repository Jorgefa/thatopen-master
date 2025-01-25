import React from 'react';
import PropTypes from 'prop-types';
import './ProjectTodoCard.css';

const ProjectTodoCard = ({ title, description, dueDate, status }) => {
    return (
        <div className="project-todo-card">
            <h3>{title}</h3>
            <p>{description}</p>
            <p>Due Date: {dueDate}</p>
            <p>Status: {status}</p>
        </div>
    );
};

ProjectTodoCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    dueDate: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
};

export default ProjectTodoCard;