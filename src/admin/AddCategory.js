import React, { useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import { createCategory } from "./helper/adminapicall";

export default function AddCategory() {
    const [name, setName] = useState("")
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const { user, token } = isAuthenticated()

    const goBack = () => (
        <div className="mt-3 mb-3">
            <Link className="btn btn-sm btn-dark" to="/admin/dashboard">Home</Link>
        </div>
    )

    const handleChange = e => {
        setError("");
        setName(e.target.value)
    }

    const onSubmit = (e) => {
        e.preventDefault();
        setError("")
        setSuccess(false)
        // bankend request
        // console.log(user._id, token, { name });
        createCategory(user._id, token, { name })  
            .then(data => {
                // console.log(data);
                if (data?.error) {
                    setError(true)
                } else {
                    setError("")
                    setSuccess(true)
                    setName("")
                }
            })
    }

    const myCategoryForm = () => {
        return (
            <form>
                <div className="form-group">
                    <p className="lead">Enter the Category</p>
                    <input className="form-control my-3" type="text" onChange={handleChange} value={name} autoFocus required placeholder="E.g Summer" />
                </div>
                <button onClick={onSubmit} className="btn btn-outline-info">Create Category</button>
            </form>
        )
    }

    const successMessage = () => {
        return (
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <div className="alert alert-success" style={{ display: success ? "" : "none" }}>
                        Category created successfully.
                    </div>
                </div>
            </div>
        )
    }

    const warningMessage = () => {
        if(error){
            return <h4 className="text-danger">Failed to create category</h4>
        }
    }
    return (
        <Base
            title="Create Category here"
            description="Add a new category for Tshirts"
            className="container bg-info p-4"
        >
            <div className="row bg-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {warningMessage()}
                    {myCategoryForm()}
                    {goBack()}
                </div>
            </div>
        </Base>
    );
}
