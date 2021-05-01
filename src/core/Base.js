import React from 'react'
import Menu from './Menu';

const Base = ({
    title = "My title",
    description = "My description",
    className = "bg-dark text-white",
    children
}) => (
    <div>
        <Menu/>
        <div className="container-fluid">
            <div className="bg-dark text-white text-center">
                <h2 className="display-4">{title}</h2>
                <p className="lead">{description}</p>
            </div>
            <div className={className}>{children}</div>
        </div>
        <footer className="footer bg-dark mt-auto py-3">
            <div className="container-fluid bg-success text-white text-center py-3">
                <h4>Questions?</h4>
                <button className="btn btn-warning btn-lg">Contact Us</button>
            </div>
            <div className="container-fluid">
                <span className="text-muted">Amazing <span className="text-white">MERN</span> bootcamp</span>
            </div>
        </footer>
    </div>
)

export default Base;