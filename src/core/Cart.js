import React, { useState, useEffect } from 'react'
import { loadCart } from '../admin/helper/CartHelper';
import '../styles.css'
import Base from './Base';
import Card from './Card';
import { getProducts } from './helper/coreapicalls';
import PaymentB from './PaymentB';
import StripeCheckout from './StripeCheckout';

export default function Cart() {

    const [products, setProducts] = useState([])
    const [error, seterror] = useState(false)
    const [reload, setReload] = useState(false)

    useEffect(() => {
        setProducts(loadCart());
    }, [reload])

    const loadAllProducts = (products) => {
        return (
            <div>
                <h2>Products</h2>
                {products && products.map((product, index) => (
                    <Card
                        key={index}
                        product={product}
                        addtoCart={false}
                        removeFromCart={true}
                        setReload={setReload}
                        reload={reload}
                    />
                )
                )}
            </div>
        )
    }
    const loadCheckout = () => {
        return (
            <div>
                <StripeCheckout
                    products={products}
                    setReload={setReload}
                    reload={reload}
                />
            </div>
        )
    }

    return (
        <Base title="Cart Page" description="Ready to checkout">
            <div className="row text-center">
                <div className="col-6">{products.length > 0 ? loadAllProducts(products) : (<h3>No products in cart</h3>)}</div>
                <div className="col-6">
                    <div>{products.length > 0 ? loadCheckout() : ("")}</div>
                    <div>
                        <PaymentB
                            products={products}
                            setReload={setReload}
                        />
                    </div>
                </div>
            </div>
        </Base>
    )
}
