import React, { useState } from 'react'
import Base from '../core/Base'
import { Route, Link, Switch, BrowserRouter, withRouter, Redirect } from 'react-router-dom'
import { authenticate, isAuthenticated, signin } from '../auth/helper'

const Signin = () => {

    const [values, setValues] = useState({
        email: "a@sahil.com",
        password: "admin123",
        error: "",
        loading: false,
        didRedirect: false
    })
    const { email, password, error, loading, didRedirect } = values
    const { user } = isAuthenticated();

    const handleChange = e => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault();
        setValues({
            ...values,
            error: false,
            loading: true
        })
        signin({ email, password })
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: data?.error, loading: false })
                } else {
                    authenticate(data, () => {
                        setValues({
                            ...values,
                            didRedirect: true
                        })
                    })
                }
            })
            .catch(console.log("Error in signin"))
    }

    const signInForm = () => {
        return (
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <form>
                        <div className="form-group">
                            <label className="text-light">Email</label>
                            <input type="email" name="email" value={email} onChange={handleChange} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label className="text-light">Password</label>
                            <input type="password" name="password" value={password} onChange={handleChange} className="form-control" />
                        </div>
                        <button onClick={onSubmit} className="btn btn-success col-12">Submit</button>
                    </form>
                </div>
            </div>
        );
    }

    const performRedirect = () => {
        if (didRedirect) {
            if (user && user.role === 1) {
                return <Redirect to="/admin/dashboard" />
            } else {
                return <Redirect to="/user/dashboard" />
            }
        }
        if (isAuthenticated()) {
            return <Redirect to="/" />
        }
    }

    const loadingMessage = () => {
        return (
            loading && (
                <div className="alert alert-info">
                    <h2>Loading...</h2>
                </div>
            )
        )
    }

    const errorMessage = () => {
        return (
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                        {error}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Base title="Sign in page" description="A page for user to sign in!">
            {loadingMessage()}
            {errorMessage()}
            {signInForm()}
            {performRedirect()}
            <p className="text-white text-center">{JSON.stringify(values)}</p>
        </Base>
    )
}

export default Signin
