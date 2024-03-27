import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../../Loading/Loading";
import PopupModal from "../../Modals/PopupModal/PopupModal";

import "./Product.css";
import ScrollToTop from "../../ScrollToTop/ScrollToTop";

const Product = ({ account, setAccount }) => {
	const [product, setProduct] = useState({});
	const [details, setDetails] = useState([]);
	const [quantity, setQuantity] = useState(1);
	const [loaded, setLoaded] = useState(false);
	const [showNotFound, setShowNotFound] = useState(false);
	const [message, setMessage] = useState(null);
	const [messageType, setMessageType] = useState(null);
	const [showToTop, setShowToTop] = useState(false);
	const { id } = useParams();

	useEffect(() => {
		const localhost = "localhost"
		const externalBackendURL = "192.168.178.69";
		const getProduct = (id) => {
			axios
				.get(`http://${externalBackendURL}:8000/parts/${id}`)
				.then((res) => {
					setProduct(res.data);
					setDetails(Object.entries(res.data.details));
					setLoaded(true);
				})
				.catch((error) => {
					setLoaded(true);
					setShowNotFound(true);
					console.log("Error fetching product: ", error);
				});
		};
		const handleScroll = () => {
			if (window.scrollY > 100) {
				setShowToTop(true);
			} else {
				setShowToTop(false);
			}
		};
		getProduct(id);
		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const handleReduceQuantity = () => {
		if (quantity === 1) return;
		setQuantity(quantity - 1);
	};

	const handleAddQuantity = () => {
		if (quantity >= 100) return;
		setQuantity(quantity + 1);
	};

	const handleAddToCart = () => {
		let errorType;

		if (!account.firstName || account.firstName === "") {
			errorType = 1;
			setMessage("No account logged in!");
		} else if (
			account.cart.length !== 0 &&
			account.cart.find((cartProduct) => cartProduct._id === product._id)
		) {
			errorType = 2;
			setMessage("Item already in cart!");
		}

		if (errorType) {
			setMessageType("inform");
			const modal = document.getElementById("modal");

			modal.classList.remove("show-modal");
			modal.classList.add("shake-modal");

			setTimeout(() => {
				modal.classList.remove("shake-modal");
			}, 500);

			setTimeout(() => {
				setMessage(null);
				setMessageType(null);
			}, 3000);
			return;
		}

		const newProduct = {
			...product,
			quantity: quantity,
		};

		const localhost = "localhost"
		const externalBackendURL = "192.168.178.69";

		axios
			.post(`http://${externalBackendURL}:8000/user/add/cart`, {
				account,
				product: newProduct,
			})
			.then((res) => {
				setAccount(res.data);
				localStorage.setItem("user", JSON.stringify(res.data));
				setMessage("Item added in cart!");
				setMessageType("success");

				setTimeout(() => {
					setMessage(null);
					setMessageType(null);
				}, 3000);
			})
			.catch((err) => {
				console.log(err);
				setMessage("An error occured. Please try again!");
				setMessageType("failure");

				setTimeout(() => {
					setMessage(null);
					setMessageType(null);
				}, 3000);
			});
	};

	return (
		<div className="product-page">
			{showToTop && <ScrollToTop />}
			{message != null && (
				<PopupModal
					type={messageType}
					setType={setMessageType}
					message={message}
					setMessage={setMessage}
				/>
			)}
			{showNotFound ? (
				<p>Product Not Found!</p>
			) : loaded ? (
				<>
					<p className="path">
						<Link to="/" className="sub-path">
							Home
						</Link>{" "}
						<span className="route-symbol">&gt;</span>{" "}
						<Link to="/products" className="sub-path">
							Products
						</Link>
						<span className="route-symbol">&gt;</span>{" "}
						<Link className="sub-path" >{product.title.substring(0, 20)}.</Link>
					</p>
					<div className="product">
						<img
							className="product-img"
							src={product.image}
							alt={product.title}
						/>
						<div className="product-info">
							<p className="product-info-title">
								{product.title}
							</p>
							<ul className="description">
								{product &&
									details.map(([key, value]) => {
										return (
											<li
												key={key}
												className="desc-details"
											>
												<span className="key">
													- {key}:
												</span>
												<span className="value">
													{value}
												</span>
											</li>
										);
									})}
							</ul>
							<div className="add-to-cart">
								<div className="bottom-part-info">
									<p className="price">
										{product.price.toFixed(2)}€
									</p>
								</div>
								<div className="product-actions">
									<div className="product-quantity">
										<button
											className="order-reduce-quantity"
											onClick={handleReduceQuantity}
										>
											-
										</button>
										<input
											type="text"
											className="order-quantity-input"
											value={quantity}
											readOnly
										/>
										<button
											className="order-add-quantity"
											onClick={handleAddQuantity}
										>
											+
										</button>
									</div>
									<button
										className="add-cart-btn"
										onClick={handleAddToCart}
									>
										Add to Cart
									</button>
								</div>
							</div>
						</div>
					</div>
				</>
			) : (
				<Loading />
			)}
		</div>
	);
};

export default Product;
