// import "./styles.css";
import * as SimpleWebAuthnBrowser from "@simplewebauthn/browser";
import axios from "axios";
import { useRef, useState } from "react";

const BASE_URI = "http://localhost:5500";
export default function App() {
	const ref = useRef<HTMLInputElement>(null);
	const [userId, setUserId] = useState("");
	const handleRegistration = async () => {
		try {
			const { data } = await axios.post(`${BASE_URI}/auth/get-device-reg-options`, {
				user_name: ref.current?.value,
			});
			console.log(data);
			setUserId(data.user.id);
			const regData = await SimpleWebAuthnBrowser.startRegistration(data);
			console.log(data.user.id);
			const verificationRes = await axios.post(`${BASE_URI}/auth/verify-signup-reg`, {
				user_name: ref.current?.value,
				data: regData,
			});
			console.log(verificationRes);
			alert("authenticate now");
		} catch (error) {
			console.log(error);
		}
	};

	const handleAuthentication = async () => {
		try {
			const { data } = await axios.post(`${BASE_URI}/auth/login`, {
				user_name: ref.current?.value,
			});
			console.log({ plokoto: data.data });
			const regData = await SimpleWebAuthnBrowser.startAuthentication(data.data);
			console.log(regData);
			const verificationRes = await axios.post(`${BASE_URI}/auth/verify-login`, {
				user_name: ref.current?.value,
				data: regData,
			});
			console.log(verificationRes);
			alert("authenticated");
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div className='App'>
			<input ref={ref} type='text' placeholder='enter your username' value='benzofx' />
			<br />
			<button onClick={handleRegistration}>register</button>
			<button onClick={handleAuthentication}>authenticate</button>
		</div>
	);
}
