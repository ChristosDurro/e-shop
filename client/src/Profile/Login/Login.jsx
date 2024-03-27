import React, { useState } from "react";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEye,
	faEyeSlash,
	faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import PopupModal from "../../Modals/PopupModal/PopupModal";
import axios from "axios";

const Login = ({ setAccount, setLogged }) => {
	const [userDetails, setUserDetails] = useState({
		email: "",
		password: "",
	});
	const [message, setMessage] = useState(null);
	const [messageType, setMessageType] = useState(null);
	const [showPassword, setShowPassword] = useState(false);
	const history = useNavigate();

	const handleLoginChange = (e) => {
		const { name, value } = e.target;

		setUserDetails((prevDetails) => ({
			...prevDetails,
			[name]: value,
		}));
	};

	const handleLoginSubmit = (e) => {
		e.preventDefault();
		const backendAPI = import.meta.env.VITE_BACKEND_URL;
		
		const localhost = "localhost"
		axios
			.post(`http://${localhost}:8000/users/login`, userDetails)
			.then((res) => {
				if (res.status == 200) {
					setAccount(res.data);
					setLogged(true);
					localStorage.setItem("user", JSON.stringify(res.data));
					setMessage("User successfully logged in!");
					setMessageType("success");
					setTimeout(() => {
						setMessage(null);
						setMessageType(null);
						history("/");
					}, 1500);
				}
			})
			.catch((err) => {
				if (message) {
					const modal = document.getElementById("modal");

					if (messageType === "success") {
						setMessage(err.response.data);
						setMessageType("failure");
					}
					modal.classList.remove("show-modal");
					modal.classList.add("shake-modal");
					setTimeout(() => {
						modal.classList.remove("shake-modal");
					}, 500);
				} else {
					setMessage(err.response.data);
					setMessageType("failure");
				}
			});
	};

	return (
		<div className="login-page">
			{message != null && (
				<PopupModal
					type={messageType}
					setType={setMessageType}
					message={message}
					setMessage={setMessage}
				/>
			)}
			<form onSubmit={handleLoginSubmit} className="login-container">
				<h2 className="login-header">Login</h2>
				<div className="email-container">
					<label htmlFor="email">Email: </label>
					<input
						type="text"
						placeholder="Enter Email"
						name="email"
						id="email"
						autoFocus
						onChange={handleLoginChange}
					/>
				</div>
				<div className="password-container">
					<label htmlFor="password">Password: </label>
					<div className="password-signup-container">
						<input
							type={showPassword ? "text" : "password"}
							placeholder="Enter Password"
							name="password"
							id="password"
							onChange={handleLoginChange}
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
				</div>
				<button type="submit" className="login-btn">
					Login
					<FontAwesomeIcon
						className="login-icon"
						icon={faRightToBracket}
						size="xl"
						color="white"
					/>
				</button>
				<Link to="/signup" className="signup-link">
					Don't have an account? Sign up!
				</Link>
			</form>
		</div>
	);
};

export default Login;
