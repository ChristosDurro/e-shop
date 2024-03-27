import React, { useEffect, useState } from "react";
import "./Cart.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowLeft,
	faArrowRight,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import ScrollToTop from "../ScrollToTop/ScrollToTop";

const Cart = ({ account, setAccount, logged }) => {
	const [showToTop, setShowToTop] = useState(false);

	const total = account.cart.reduce((acc, product) => {
		return acc + product.quantity * product.price;
	}, 0);

	useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setShowToTop(true);
            } else {
                setShowToTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

	const handleReduceQuantity = (product) => {
		if (product.quantity === 1) return;
		const updatedAccount = { ...account };
		updatedAccount.cart = updatedAccount.cart.map((prod) => {
			if (prod._id == product._id)
				return { ...prod, quantity: prod.quantity - 1 };
			return prod;
		});
		localStorage.setItem("user", JSON.stringify(updatedAccount));
		setAccount(updatedAccount);
	};

	const handleAddQuantity = (product) => {
		if (product.quantity >= 100) return;
		const updatedAccount = { ...account };
		updatedAccount.cart = updatedAccount.cart.map((prod) => {
			if (prod._id == product._id)
				return { ...prod, quantity: prod.quantity + 1 };
			return prod;
		});
		localStorage.setItem("user", JSON.stringify(updatedAccount));
		setAccount(updatedAccount);
	};

	const handleCartDeleteClick = (account, product) => {
		const localhost = "localhost"
		const externalBackendURL = "192.168.178.69";

		axios
			.post(`http://${externalBackendURL}:8000/user/delete/cart`, { account, product })
			.then((res) => {
				setAccount(res.data);
				localStorage.setItem("user", JSON.stringify(res.data));
			})
			.catch((err) => console.log(err));
	};

	const handlePayment = async (cart) => {
		const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

		const stripe = await loadStripe(stripePublicKey);

		const cartItems = cart.map((product) => {
			const { _id, image, quantity } = product;
			return { _id, image, quantity };
		});
		
		const localhost = "localhost"
		const externalBackendURL = "192.168.178.69";

		axios
			.post(`http://${externalBackendURL}:8000/create-checkout-session`, cartItems)
			.then((res) => {
				stripe.redirectToCheckout({ sessionId: res.data.id });
			})
			.catch((err) => console.log(err));
	};

	return (
		<div className="cart-container">
			{showToTop && <ScrollToTop />}
			<div className="path">
				<Link to="/" className="sub-path">
					Home
				</Link>{" "}
				<span className="route-symbol">&gt;</span>{" "}
				<Link to="/cart" className="sub-path">
					Cart
				</Link>
			</div>
			<div className="cart-headers">
				<div className="product-header">Product</div>
				<div className="pricer-header">Price</div>
				<div className="quantity-header">Quantity</div>
				<div className="sub-total-header">Sub Total</div>
			</div>
			<div className="cart-view">
				{logged ? (
					account.cart.length !== 0 ? (
						account.cart.map((product) => {
							return (
								<div
									key={product._id}
									className="cart-product-card"
								>
									<div className="cart-details">
										<Link
											className="cart-product-card-img-link"
											to={`/products/${product._id}/${product.title}`}
										>
											<img
												src={product.image}
												alt={product.title}
											/>
										</Link>
										<Link
											className="cart-product-detail-link cart-product-title"
											to={`/products/${product._id}/${product.title}`}
											title={product.title}
										>
											{product.title.length > 20
												? product.title.substring(
														0,
														20
												  ) + "."
												: product.title}
										</Link>
									</div>
									<p className="cart-product-price">
										{product.price.toFixed(2)}€
									</p>
									<div className="cart-quantity">
										<button
											className="reduce-quantity"
											onClick={() =>
												handleReduceQuantity(product)
											}
										>
											-
										</button>
										<input
											type="text"
											className="quantity-input"
											value={product.quantity}
											readOnly
										/>
										<button
											className="add-quantity"
											onClick={() =>
												handleAddQuantity(product)
											}
										>
											+
										</button>
									</div>
									<div className="subtotal">
										<p className="sub-total">
											{(
												product.quantity * product.price
											).toFixed(2)}
											€
										</p>
									</div>
									<div
										className="cart-delete"
										onClick={() =>
											handleCartDeleteClick(
												account,
												product
											)
										}
									>
										<FontAwesomeIcon
											className="cart"
											icon={faTrash}
											size="xl"
										/>
									</div>
								</div>
							);
						})
					) : (
						<p className="cart-empty">Your cart is empty!</p>
					)
				) : (
					<p className="cart-not-logged">You're not logged in!</p>
				)}
			</div>
			<div className="total-price">
				<p className="total">Total: {total.toFixed(2)}€</p>
			</div>
			<div className="cart-page-actions">
				<Link to="/products" className="products-btn-link">
					<FontAwesomeIcon icon={faArrowLeft} />
					Back to Products
				</Link>
				{total === 0 ? (
					<button className="disabled-checkout" disabled>
						Procced to Checkout
						<FontAwesomeIcon icon={faArrowRight} />
					</button>
				) : (
					<button
						className="checkout-btn"
						disabled={total === 0 ? true : false}
						onClick={() => handlePayment(account.cart)}
					>
						Procced to Checkout
						<FontAwesomeIcon icon={faArrowRight} />
					</button>
				)}
			</div>
		</div>
	);
};

export default Cart;
