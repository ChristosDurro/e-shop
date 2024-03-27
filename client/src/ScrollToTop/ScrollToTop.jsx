import React from "react";
import "./ScrollToTop.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronUp } from "@fortawesome/free-solid-svg-icons";

const ScrollToTop = () => {
	const toTop = () => {
		const targetElement = document.getElementById("nav");
		if (targetElement)
			targetElement.scrollIntoView({behavior: "smooth"});
	};
	return (
		<div className="to-top">
			<FontAwesomeIcon
				icon={faCircleChevronUp}
				size="3x"
				onClick={toTop}
			/>
		</div>
	);
};

export default ScrollToTop;
