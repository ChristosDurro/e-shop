import React, { useState } from "react";
import "./ConfirmModal.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ConfirmModal = ({
	account,
	setAccount,
	setLogged,
	message,
	option1,
	option2,
	option2Color,
	option2HoverColor,
	setShowConfirmModal,
}) => {
	const history = useNavigate();

	const handleCancel = () => {
		document.body.style.overflow = "";
		setShowConfirmModal(false);
	};

	const handleDelete = () => {
		document.body.style.overflow = "";
		setShowConfirmModal(false);
		console.log(account);
		const localhost = "localhost";
		const externalBackendURL = "192.168.178.69";
		axios
			.delete(`http://${externalBackendURL}:8000/users/delete`, {
				data: account,
			})
			.then((res) => {
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
			})
			.catch((error) => console.log(error));
	};

	return (
		<div className="confirm-modal-container">
			<div className="confirm-modal">
				<p className="confirm-msg">{message}</p>
				<div className="confirm-option-btns">
					<button className="confirm-options" onClick={handleCancel}>
						{option1}
					</button>
					<button
						className="confirm-options"
						style={{
							backgroundColor: option2Color,
							color: "#fefefe",
						}}
						onMouseOver={(e) =>
							(e.target.style.backgroundColor = option2HoverColor)
						}
						onMouseOut={(e) =>
							(e.target.style.backgroundColor = option2Color)
						}
						onClick={handleDelete}
					>
						{option2}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmModal;
