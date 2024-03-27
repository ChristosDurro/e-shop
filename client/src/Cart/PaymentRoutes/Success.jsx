import React, { useEffect, useState } from "react";
import "./Success.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Success = ({ account, setAccount }) => {
	const date = new Date();
	const [total, setTotal] = useState(0);
	const [loaded, setLoaded] = useState(false);

	const formattedDate = date.toLocaleDateString("de-DE", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});

	// console.log(account);
	useEffect(() => {
		const emptyCart = () => {
			const localhost = "localhost"
			const externalBackendURL = "192.168.178.69";
			const updatedAccount = { ...account };

			updatedAccount.orders.unshift(...updatedAccount.cart);
			updatedAccount.cart = [];

			axios
				.post(`http://${externalBackendURL}:8000/update-user`, updatedAccount)
				.then(() => {
					const amount = account.cart
						.reduce((acc, product) => {
							return acc + product.quantity * product.price;
						}, 0)
						.toFixed(2);

					setTotal(amount);
					setAccount(updatedAccount);
					localStorage.setItem(
						"user",
						JSON.stringify(updatedAccount)
					);
				})
				.catch((err) => console.log(err));
		};
		emptyCart();
		setLoaded(true);
	}, [loaded]);

	return (
		<div className="success-container">
			<div className="success-msg">
				<FontAwesomeIcon icon={faCircleCheck} size="4x" color="green" />
				<p className="payment-success-text">Payment Successful!</p>
			</div>
			<div className="payment-details">
				<p className="pay-total">
					<span className="pay-text">Payment Total: </span>
					{total}
				</p>
				<p className="pay-date">
					<span className="pay-text">Payment Date:</span>{" "}
					{formattedDate}
				</p>
			</div>
			<Link to="/products" className="to-shop-btn">
				Back to shopping
			</Link>
		</div>
	);
};

export default Success;
