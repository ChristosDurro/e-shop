import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBars,
	faCartShopping,
	faStore,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/site_images/logo.png";
import "./NavBar.css";
import { useRef, useState } from "react";

const NavBar = ({ logged, account }) => {
	const navRef = useRef();
	const [navActive, setNavActive] = useState(false);

	const showNav = (action) => {

		document.body.style.overflow = navActive ? "hidden" : "";
		navRef.current.classList.toggle("responsive-nav");
	};

	return (
		<nav id="nav" className="nav">
			<div className="nav-logo">
				<Link to="/" className="logo-container">
					<img src={logo} alt="logo" />
				</Link>
			</div>
			<ul className="nav-list" ref={navRef}>
				<Link to="/products" onClick={() => showNav(false)}>
					<li className="store-li">
						<FontAwesomeIcon
							icon={faStore}
							size="xl"
							color="black"
							className="shop-icon"
						/>
						<p className="store-icon-text">shop</p>
					</li>
					<p className="nav-text">Store</p>
				</Link>
				<Link to={logged ? "/profile" : "/login"} onClick={() => showNav(false)}>
					<li>
						<FontAwesomeIcon
							icon={faUser}
							size="xl"
							color="black"
							className="user-icon"
						/>
					</li>
					<p className="nav-text">Profile</p>
				</Link>
				<Link to="/cart" onClick={() => showNav(false)}>
					<li className="cart-link">
						<FontAwesomeIcon
							icon={faCartShopping}
							size="xl"
							color="black"
							className="cart-icon"
						/>
						<p className="items-count">
							{logged ? account.cart.length : 0}
						</p>
					</li>
					<p className="nav-text">Cart</p>
				</Link>
				<button className="nav-btn nav-close" onClick={showNav}>
					<FontAwesomeIcon size="2xl" icon={faXmark} />
				</button>
			</ul>
			<button className="nav-btn" onClick={showNav}>
				<FontAwesomeIcon size="2xl" icon={faBars} />
			</button>
		</nav>
	);
};

export default NavBar;
