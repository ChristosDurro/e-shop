import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar from "./Navbar/NavBar";
import Home from "./Home/Home";
import Footer from "./Footer/Footer";
import Products from "./Products/Products";
import Product from "./Products/Product/Product";
import Login from "./Profile/Login/Login";
import Signup from "./Profile/Signup/Signup";
import Profile from "./Profile/Profile";
import Cart from "./Cart/Cart";
import Success from "./Cart/PaymentRoutes/Success";
import NotFound from "./NotFound/NotFound";

function App() {
	const [products, setProducts] = useState([]);
	const [loaded, setLoaded] = useState(false);
	const [account, setAccount] = useState({
		firstName: "",
		lastName: "",
		username: "",
		email: "",
		cart: [],
		orders: [],
	});
	const [logged, setLogged] = useState(false);

	useEffect(() => {
		const localhost = "localhost"
		const getProducts = () => {
			axios
				.get(`http://${localhost}:8000/parts`)
				.then((res) => {
					setProducts(res.data);
					setLoaded(true);
				})
				.catch((error) => {
					console.log("Error:" + error);
				});
		};
		const userLogged = () => {
			const loggedInUser = localStorage.getItem("user");
			if (loggedInUser) {
				const foundUser = JSON.parse(loggedInUser);
				setAccount(foundUser);
				setLogged(true);
			}
		};
		getProducts();
		userLogged();
	}, []);

	return (
		<>
			<BrowserRouter>
				<NavBar logged={logged} account={account} />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route
						path="/products"
						element={
							<Products
								products={products}
								loaded={loaded}
								account={account}
								setAccount={setAccount}
								logged={logged}
							/>
						}
					/>
					<Route
						path="/products/:id/:title"
						element={
							<Product
								account={account}
								setAccount={setAccount}
							/>
						}
					/>
					<Route
						path="/profile"
						element={
							<Profile
								account={account}
								setAccount={setAccount}
								setLogged={setLogged}
							/>
						}
					/>
					<Route
						path="/login"
						element={
							<Login
								setAccount={setAccount}
								setLogged={setLogged}
							/>
						}
					/>
					<Route path="/signup" element={<Signup />} />
					<Route
						path="/cart"
						element={
							<Cart
								account={account}
								setAccount={setAccount}
								logged={logged}
							/>
						}
					/>
					<Route
						path="/success"
						element={
							<Success
								account={account}
								setAccount={setAccount}
							/>
						}
					/>
					<Route path="*" element={<NotFound />} />
				</Routes>
				<Footer />
			</BrowserRouter>
		</>
	);
}

export default App;
