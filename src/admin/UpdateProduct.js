import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../auth/helper'
import Base from '../core/Base'
import { getProduct, getCategories, updateProduct } from './helper/adminapicall'


export default function UpdateProduct({match}) {

    const [values, setvalues] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        photo: "",
        categories: [],
        category: "",
        loading: false,
        error: "",
        createdProduct: "",
        getaRedirect: false,
        formData: ""
    })

    const { user, token } = isAuthenticated()

    const { name, description, price, stock, categories, category, loading, error, createdProduct, getaRedirect, formData } = values

    const preload = (productId) => {
        getProduct(productId).then(data => {
            //console.log(data);
            if (data.error) {
                setvalues({ ...values, error: data.error })
            } else {
                setvalues({
                    ...values,
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    category: data.category._id,
                    stock: data.stock,
                    formData: new FormData(),
                })
                preloadCategories()
            }
        })
    }

    const preloadCategories = () => {
        getCategories()
        .then(data => {
            if (data.error) {
                setvalues({ ...values, error: data.error })
            } 
            else {
                setvalues({
                    categories:data, formData: new FormData()
                })
            }
        })
        .catch()
    }

    useEffect(() => {
        preload(match.params.productId)
    }, [])


    const onSubmit = (e) => {
        e.preventDefault();
        setvalues({ ...values, error: "", loading: true, createdProduct: false })
        updateProduct(match.params.productId ,user._id, token, formData).then(data => {
            if (data.error) {
                setvalues({ ...values, error: data.error })
            } else {
                setvalues({
                    ...values,
                    name: "",
                    description: "",
                    price: "",
                    photo: "",
                    stock: "",
                    loading: false,
                    createdProduct: data.name
                })
            }
        })
    }

    const handleChange = name => event => {
        const value = name === "photo" ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setvalues({ ...values, [name]: value })
    }

    const successMessage = () => {
        return (
            <div className="alert alert-success mt-3"
                style={{ display: createdProduct ? "" : "none" }}
            >
                <h4>{createdProduct} updated successfully!</h4>
            </div>
        )
    }

    const errorMessage = () => {
        return (
            <div className="alert alert-danger mt-3"
                style={{ display: error ? "" : "none" }}
            >
                <h4>{error}</h4>
            </div>
        )
    }

    const createProductForm = () => (
        <form >
            <span>Post photo</span>
            <div className="form-group">
                <label className="btn btn-block btn-success">
                    <input
                        onChange={handleChange("photo")}
                        type="file"
                        name="photo"
                        accept="image"
                        placeholder="choose a file"
                    />
                </label>
            </div>
            <div className="form-group">
                <input
                    onChange={handleChange("name")}
                    name="photo"
                    className="form-control"
                    placeholder="Name"
                    value={name}
                />
            </div>
            <div className="form-group">
                <textarea
                    onChange={handleChange("description")}
                    name="photo"
                    className="form-control"
                    placeholder="Description"
                    value={description}
                />
            </div>
            <div className="form-group">
                <input
                    onChange={handleChange("price")}
                    type="number"
                    className="form-control"
                    placeholder="Price"
                    value={price}
                />
            </div>
            <div className="form-group">
                <select
                    onChange={handleChange("category")}
                    className="form-control"
                    placeholder="Category"
                >
                    <option>Select</option>
                    {categories
                        &&
                        categories.map((cate, index) => (
                            <option key={index} value={cate._id}>{cate.name}</option>
                        ))}
                </select>
            </div>
            <div className="form-group">
                <input
                    onChange={handleChange("stock")}
                    type="number"
                    className="form-control"
                    placeholder="Quantity"
                    value={stock}
                />
            </div>

            <button type="submit" onClick={onSubmit} className="btn btn-outline-success mb-3">
                Update Product
          </button>
        </form>
    );

    return (
        <Base
            title="Add product"
            description="Welcome to product creating section"
            className="container bg-info p-4"
        >
            <h1 className="text-white">Product</h1>
            <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">Admin Home</Link>
            <div className="row bg-white text-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {errorMessage()}
                    {createProductForm()}
                </div>
            </div>
        </Base>
    )
}
