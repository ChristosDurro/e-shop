import React, { useState } from "react";
import "./Signup.css";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEye,
	faEyeSlash,
	faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import PopupModal from "../../Modals/PopupModal/PopupModal";

const Signup = ({ account, setAccount }) => {
	const [userDetails, setUserDetails] = useState({
		fName: "",
		lName: "",
		username: "",
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [message, setMessage] = useState(null);
	const [messageType, setMessageType] = useState(null);
	const history = useNavigate();

	const handleSignUpChange = (e) => {
		const { name, value } = e.target;
		setUserDetails((prevDetails) => ({
			...prevDetails,
			[name]: value,
		}));
	};

	const handleSignupSubmit = (e) => {
		e.preventDefault();
		
		const localhost = "localhost"
		axios
			.post(`http://${localhost}:8000/users/create`, userDetails)
			.then((res) => {
				setUserDetails({
					fName: "",
					lName: "",
					username: "",
					email: "",
					password: "",
				});
				setMessage(res.data);
				setMessageType("success");
				setTimeout(() => {
					setMessage(null);
					setMessageType(null);
					history("/login");
				}, 1500);
			})
			.catch((error) => {
				if (error.response.status === 409) {
					setMessage(error.response.data);
					setMessageType("failure");

					const modal = document.getElementById("modal");
					modal.classList.remove("show-modal");
					modal.classList.add("shake-modal");
					setTimeout(() => {
						modal.classList.remove("shake-modal");
					}, 500);
				}
			});
	};
	return (
		<div className="signup-page">
			{message != null && (
				<PopupModal
					type={messageType}
					setType={setMessageType}
					message={message}
					setMessage={setMessage}
				/>
			)}
			<form onSubmit={handleSignupSubmit} className="signup-container">
				<h2 className="signup-header">Sign Up</h2>
				<div className="name-container">
					<input
						type="text"
						placeholder="Enter First Name"
						name="fName"
						id="first-name"
						autoFocus
						autoComplete="true"
						onChange={handleSignUpChange}
					/>
					<input
						type="text"
						placeholder="Enter Last Name"
						name="lName"
						id="last-name"
						required
						autoComplete="true"
						onChange={handleSignUpChange}
					/>
				</div>
				<div className="username-container">
					<input
						type="text"
						placeholder="Enter Username"
						name="username"
						id="username"
						required
						autoComplete="true"
						onChange={handleSignUpChange}
					/>
				</div>
				<div className="email-signup-container">
					<input
						type="email"
						placeholder="Enter Email"
						name="email"
						id="email"
						required
						autoComplete="true"
						onChange={handleSignUpChange}
					/>
				</div>
				<div className="password-signup-container">
					<input
						type={showPassword ? "text" : "password"}
						placeholder="Enter Password"
						name="password"
						id="password"
						required
						autoComplete="true"
						onChange={handleSignUpChange}
					/>
					{showPassword ? (
						<FontAwesomeIcon
							icon={faEye}
							className="eye-icon"
							onClick={() => setShowPassword(!showPassword)}
						/>
					) : (
						<FontAwesomeIcon
							icon={faEyeSlash}
							className="eye-icon"
							onClick={() => setShowPassword(!showPassword)}
						/>
					)}
				</div>
				<button type="submit" className="signup-btn">
					Sign Up
					<FontAwesomeIcon
						icon={faRightToBracket}
						color="white"
						size="xl"
						className="login-icon"
					/>
				</button>
				<Link to="/login" className="login-link">
					Already have an account? Login!
				</Link>
			</form>
		</div>
	);
};

export default Signup;
