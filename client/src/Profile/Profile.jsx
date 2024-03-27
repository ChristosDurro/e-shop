import React, { useEffect, useState } from "react";
import "./Profile.css";
import { Link, useNavigate } from "react-router-dom";
import ConfirmModal from "../Modals/ConfirmModal/ConfirmModal";
import ScrollToTop from "../ScrollToTop/ScrollToTop";

const Profile = ({ account, setAccount, setLogged }) => {
	const history = useNavigate();
	const [accountView, setAccountView] = useState(true);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [showToTop, setShowToTop] = useState(false);

	
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

	const handleLogoutClick = () => {
		setLogged(false);
		setAccount({
			firstName: "",
			lastName: "",
			username: "",
			email: "",
			password: "",
			cart: [],
			orders: [],
		});
		localStorage.clear();
		history("/");
	};

	const handleDeleteClick = () => {
		document.body.style.overflow = "hidden";
		setShowConfirmModal(true);
	};

	const handleViewClick = (e) => {
		const elementId = e.target.id;
		const accountClicked = document.getElementById("account-view");
		const ordersClicked = document.getElementById("orders-view");

		if (
			(elementId == "account-view" && accountView) ||
			(elementId == "orders-view" && !accountView)
		)
			return;

		if (elementId == "account-view") {
			accountClicked.classList.add("sidebar-selected");
			ordersClicked.classList.remove("sidebar-selected");
		} else {
			ordersClicked.classList.add("sidebar-selected");
			accountClicked.classList.remove("sidebar-selected");
		}
		setAccountView(!accountView);
	};

	return (
		<div className="profile-page">
			{showToTop && <ScrollToTop />}
			{showConfirmModal && (
				<ConfirmModal
					account={account}
					setAccount={setAccount}
					setLogged={setLogged}
					message="Are you sure you want to delete your account?"
					option1="Cancel"
					option2="Delete"
					option2Color="#da0000"
					option2HoverColor="#c20000"
					setShowConfirmModal={setShowConfirmModal}
				/>
			)}
			<p className="profile-path">
				<Link to="/" className="sub-path">
					Home
				</Link>{" "}
				<span className="route-symbol">&gt;</span>{" "}
				<Link to="/profile" className="sub-path">
					Profile
				</Link>
			</p>
			<div className="profile-container">
				<div className="profile-sidebar">
					<ul>
						<li
							id="account-view"
							className="sidebar-selected"
							onClick={handleViewClick}
						>
							Account
						</li>
						<li id="orders-view" onClick={handleViewClick}>
							Order History
						</li>
					</ul>
				</div>
				<div className="profile-display">
					{accountView && (
						<div className="profile-view-container">
							<h1 className="profile-header">Account Details</h1>
							<div className="profile-details">
								<p className="profile-fname">
									First Name: {account.firstName}
								</p>
								<p className="profile-lname">
									Last Name: {account.lastName}
								</p>
								<p className="profile-username">
									Username: {account.username}
								</p>
								<p className="profile-email">
									Email: {account.email}
								</p>
							</div>
							<div className="actions">
								<button
									className="logout"
									onClick={handleLogoutClick}
								>
									Logout
								</button>
								<button
									className="delete"
									onClick={handleDeleteClick}
								>
									Delete Account
								</button>
							</div>
						</div>
					)}
					{!accountView && (
						<div className="orders-container">
							<h1 className="profile-header">Order History</h1>
							<div className="order-headers">
								<p>Product</p>
								<p>Price</p>
								<p>Quantity</p>
							</div>
							<div className="orders-display">
								{account.orders.map((product) => {
									return (
										<div
											key={product._id}
											className="order-product-card"
										>
											<div className="order-details">
												<Link
													className="order-product-card-img-link"
													to={`/products/${product._id}/${product.title}`}
												>
													<img
														src={product.image}
														alt={product.title}
														title={product.title}
													/>
												</Link>
												<Link
													className="order-product-detail-link"
													to={`/products/${product._id}`}
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
											<p className="order-product-price">
												{product.price.toFixed(2)}€
											</p>
											<div className="order-quantity">
												<p>{product.quantity}</p>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Profile;
