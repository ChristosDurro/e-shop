import React, { useState } from "react";
import "./Filters.css";

const Filters = ({
	products,
	filteredProducts,
	setFilteredProducts,
	selectedCategory,
	setSelectedCategory,
	selectedSubCategory,
	setSelectedSubCategory,
	subCategories,
	setSubCategories,
	categories,
	minPrice,
	maxPrice,
	setMinPrice,
	setMaxPrice,
	apply,
	setApply,
}) => {
	const handleCategoryChange = (e) => {
		const selection = e.target.value;
		setSelectedCategory(selection);
		setSelectedSubCategory("Select");
		const subs = Array.from(
			new Set(
				products
					.filter(
						(product) =>
							product.category === selection.toLowerCase()
					)
					.map((product) => product.subcategory)
			)
		);
		setSubCategories(subs);
	};

	const handleSubCategoryChange = (e) => {
		const selection = e.target.value;
		setSelectedSubCategory(selection);
	};

	const isNumeric = (price) => {
		let dots = 0;

		for (let i = 0; i < price.length; i++) {
			if ((price[i] < "0" || price[i] > "9") && price[i] != '.') return false;
			if (price[i] === '.')
				dots++;
		}
		if (dots > 1)
			return false;
		return true;
	};

	const handlePriceChange = (e) => {
		e.preventDefault();
		if (!isNumeric(minPrice) || !isNumeric(maxPrice) || (minPrice && maxPrice && (minPrice > maxPrice || maxPrice < minPrice))) return;
		setApply(!apply);
	};

	return (
		<div className="filter-container">
			<div className="categories-filter">
				<div className="categories">

				<label htmlFor="categories">Category: </label>
				<select
					value={selectedCategory}
					onChange={handleCategoryChange}
					name=""
					id="categories"
				>
					<option key={0}>Select</option>
					{categories.map((category, index) => {
						return (
							<option key={index + 1}>
								{category.toUpperCase()}
							</option>
						);
					})}
				</select>
				</div>
				<div className="sub-categories">
					<label htmlFor="sub-categories">Sub Category: </label>
					<select
						value={selectedSubCategory}
						onChange={handleSubCategoryChange}
						name=""
						id="sub-categories"
					>
						<option key={0}>Select</option>
						{subCategories.map((subCategory, index) => {
							return (
								<option key={index + 1}>
									{subCategory.toUpperCase()}
								</option>
							);
						})}
					</select>
				</div>
			</div>
			<form onSubmit={handlePriceChange} className="price-range">
				<div className="price-min">
					<label htmlFor="priceMin">Min: </label>
					<input
						type="text"
						id="priceMin"
						className="min"
						value={minPrice}
						onChange={(e) => setMinPrice(e.target.value)}
					/>
				</div>
				<div className="price-max">
					<label htmlFor="priceMax">Max: </label>
					<input
						type="text"
						id="priceMax"
						className="max"
						value={maxPrice}
						onChange={(e) => setMaxPrice(e.target.value)}
					/>
				</div>
				<button type="submit" className="filter-btn">
					Apply
				</button>
			</form>
		</div>
	);
};

export default Filters;
