import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { cartEmpty, loadCart } from '../admin/helper/CartHelper'
import { isAuthenticated } from '../auth/helper'
import Stripecheckout from 'react-stripe-checkout'
import { API } from '../backend'

export default function StripeCheckout({ products, setReload, reload = undefined }) {
    const [data, setData] = useState({
        loading: false,
        success: false,
        error: "",
        address: ""
    })

    const token = isAuthenticated() && isAuthenticated().token
    const userId = isAuthenticated() && isAuthenticated().user._id

    const getFinalPrice = () => {
        // return products.reduce((currentValue, nextValue) => {
        //     return currentValue + nextValue.count * nextValue;
        // }, 0)
        let amount = 0;
        products.map((p) => {
            amount = amount + p.price
        })
        return amount;
    }

    const makePayment = token => {
        console.log(token);
        const body = {
            token,
            products
        }
        const headers = {
            "Content-Type": "application/json"
        }
        return fetch(`${API}/stripepayment`, {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        }).then(response => {
            // console.log("aala");
            // console.log(response);
            const { status } = response
            console.log("STATUS", status);
            // cartEmpty();
        })
            .catch(error => console.log(error))
    }

    const showStripeButton = () => {
        return isAuthenticated() ? (
            <Stripecheckout
                stripeKey={process.env.REACT_APP_STRIPE_KEY}
                token={makePayment}
                amount={getFinalPrice() * 100}
                name="Buy Tees"
                shippingAddress
                billingAddress
            >
                <button className="btn btn-success">Pay with stripe</button>
            </Stripecheckout>
        ) : (
            <Link to="/signin">
                <button className="btn btn-warning">Sign in</button>
            </Link>
        )
    }
    return (
        <div>
            <h3>Total amount - ${getFinalPrice()}</h3>
            {showStripeButton()}
            <pre></pre>
            <h5>OR</h5>
        </div>
    )
}
