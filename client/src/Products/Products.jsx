import "./Products.css";
import { Link, useLocation } from "react-router-dom";
import Filters from "./Filters/Filters";
import Loading from "../Loading/Loading";
import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCartShopping,
	faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import PopupModal from "../Modals/PopupModal/PopupModal";
import ScrollToTop from "../ScrollToTop/ScrollToTop";

const Products = ({ products, loaded, account, setAccount, logged }) => {
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("Select");
	const [selectedSubCategory, setSelectedSubCategory] = useState("Select");
	const [subCategories, setSubCategories] = useState([]);
	const [minPrice, setMinPrice] = useState("");
	const [maxPrice, setMaxPrice] = useState("");
	const [apply, setApply] = useState(false);
	const [message, setMessage] = useState(null);
	const [messageType, setMessageType] = useState(null);
	const [showToTop, setShowToTop] = useState(false);
	const categories = Array.from(
		new Set(products.map((product) => product.category))
	);
	const { pathname } = useLocation();

	const updateProductList = useCallback(() => {
		let newList = products.filter((product) => {
			if (selectedCategory !== "Select") {
				if (
					product.category.toLocaleLowerCase() ===
					selectedCategory.toLocaleLowerCase()
				) {
					if (selectedSubCategory !== "Select")
						return (
							product.subcategory.toLocaleLowerCase() ===
							selectedSubCategory.toLocaleLowerCase()
						);
					else return true;
				} else return false;
			} else return true;
		});
		newList = newList.filter((product) => {
			if (minPrice !== "" && maxPrice === "") {
				return product.price >= minPrice;
			} else if (minPrice === "" && maxPrice !== "") {
				return product.price <= maxPrice;
			} else if (minPrice !== "" && maxPrice !== "") {
				return product.price >= minPrice && product.price <= maxPrice;
			} else return true;
		});
		setFilteredProducts(newList);
	}, [selectedCategory, selectedSubCategory, apply, products]);

	useEffect(() => {
		const toTop = () => {
			window.scrollTo(0, 0);
		};
        const handleScroll = () => {
            if (window.scrollY > 500) {
                setShowToTop(true);
            } else {
                setShowToTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

		updateProductList();
		toTop();
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
	}, [updateProductList, pathname]);

	const handleCartIconClick = (account, product) => {
		let errorType;

		if (!account.firstName || account.firstName === "") {
			errorType = 1;
			setMessage("No account logged in!");
		} else if (
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

		const backendAPI = import.meta.env.VITE_BACKEND_URL;
		const localhost = "localhost";

		axios
			.post(`http://${localhost}:8000/user/add/cart`, {
				account,
				product,
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
		<div id="prods-container" className="products-container">
			{showToTop && <ScrollToTop />}
			{message != null && (
				<PopupModal
					type={messageType}
					setType={setMessageType}
					message={message}
					setMessage={setMessage}
				/>
			)}
			<Filters
				products={products}
				filteredProducts={filteredProducts}
				setFilteredProducts={setFilteredProducts}
				selectedCategory={selectedCategory}
				setSelectedCategory={setSelectedCategory}
				selectedSubCategory={selectedSubCategory}
				setSelectedSubCategory={setSelectedSubCategory}
				subCategories={subCategories}
				setSubCategories={setSubCategories}
				categories={categories}
				minPrice={minPrice}
				maxPrice={maxPrice}
				setMinPrice={setMinPrice}
				setMaxPrice={setMaxPrice}
				apply={apply}
				setApply={setApply}
			/>
			<div id="products-view" className="products-view">
				{loaded ? (
					filteredProducts.map((product) => {
						return (
							<div key={product._id} className="product-card">
								<div className="cart-actions">
									<FontAwesomeIcon
										className="cart"
										icon={faCartShopping}
										size="xl"
										onClick={() =>
											handleCartIconClick(
												account,
												product
											)
										}
									/>
									{logged &&
									account.cart.find(
										(cartProduct) =>
											cartProduct._id === product._id
									) ? (
										<FontAwesomeIcon
											icon={faCircleCheck}
											color="green"
											className="check-cart"
										/>
									) : null}
								</div>
								<Link
									className="product-card-img-link"
									to={`/products/${product._id}/${product.title}`}
								>
									<img
										src={product.image}
										alt={product.title}
									/>
								</Link>
								<div className="details">
									<Link
										className="product-detail-link"
										to={`/products/${product._id}/${product.title}`}
									>
										<p className="product-title">
											{product.title}
										</p>
									</Link>
									<p className="product-price">
										{product.price.toFixed(2)} €
									</p>
								</div>
							</div>
						);
					})
				) : (
					<Loading />
				)}
			</div>
		</div>
	);
};

export default Products;
