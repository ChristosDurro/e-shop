import React from "react";
import "./PopupModal.css";

const PopupModal = ({ type, setType, message, setMessage }) => {

	const handleModalClose = () => {
		setMessage(null);
		setType(null);
	};

	const bgColor = (type) => {
		if (type === "success") return "green";
		else if (type === "failure") return "red";
		else return "yellow";
	};

	return (
		<div id="modal" className="modal-container  show-modal">
			<div
				className="type-color"
				style={{ backgroundColor: bgColor(type) }}
			></div>
			<div className="modal-message">
				<p className="message">{message}</p>
			</div>
			<span className="modal-close" onClick={handleModalClose}>
				X
			</span>
		</div>
	);
};

export default PopupModal;
