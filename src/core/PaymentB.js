import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { cartEmpty, loadCart } from '../admin/helper/CartHelper'
import { getmeToken, processPayment } from './helper/paymentbhelper'
import { createOrder } from '../core/helper/OrderHelper'
import DropIn from 'braintree-web-drop-in-react'
import { isAuthenticated } from '../auth/helper'

function PaymentB({ products, setReload = f => f, reload = undefined }) {
    const [info, setInfo] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: '',
        instance: {}
    })

    const userId = isAuthenticated() && isAuthenticated().user._id
    const token = isAuthenticated() && isAuthenticated().token

    const getToken = (userId, token) => {
        getmeToken(userId, token).then(info => {
            console.log(info);
            if (info.error) {
                setInfo({ ...info, error: info.error })
            } else {
                const clientToken = info.clientToken
                setInfo({ clientToken })
            }
        })
    }

    const showbtDropIn = () => {
        return (
            <div>
                {info.clientToken != null && products.length > 0 ? (
                    <div>
                        <DropIn
                            options={{ authorization: info.clientToken }}
                            onInstance={(instance) => (info.instance = instance)}
                        />
                        <button className="btn col-12 btn-success" onClick={onPurchase}>Buy</button>
                    </div>
                ) : (<h3>
                    please login in or add something to cart
                </h3>)}
            </div>
        )
    }

    useEffect(() => {
        console.log(userId);
        console.log(token);
        getToken(userId, token);
    }, [])


    const onPurchase = () => {
        setInfo({ ...info, loading: true })
        let nonce;
        let getNonce = info.instance
            .requestPaymentMethod()
            .then(data => {
                nonce = data.nonce
                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getAmount()
                }
                processPayment(userId, token, paymentData)
                    .then(response => {
                        console.log(response);
                        setInfo({ ...info, success: response.success, loading: false })
                        const orderData = {
                            products: products,
                            transaction_id: response.transaction.id,
                            amount: response.transaction.amount
                        }
                        createOrder(userId, token, orderData)
                        cartEmpty(() => {
                            console.log("error?");
                        })
                    })
                    .catch(err => {
                        setInfo({ ...info, loading: false, success: false, error: err })
                    })
            })
            .catch()
    }

    const getAmount = () => {
        let amount = 0;
        products.map(p => amount = amount + p.price)
        return amount
    }

    return (
        <div>
            {/* {getAmount() > 0 ? getAmount() : ""} */}
            {showbtDropIn()}
        </div>
    )
}

export default PaymentB
