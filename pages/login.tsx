import Head from "next/head";
import Script from "next/script";
import React, { useEffect } from "react";
import * as SimpleWebAuthnBrowser from "@simplewebauthn/browser";
import axios from "axios";
const BASE_URI = "http://localhost:5500";
function Login() {
	async function getAuthenticationOptions(user_name: string) {
		const { data } = await axios.post(`${BASE_URI}/auth/login`, {
			user_name,
		});
		console.log({ plokoto: data.data });
		const regData = await SimpleWebAuthnBrowser.startAuthentication(data.data, true);
		const verificationRes = await axios.post(`${BASE_URI}/auth/verify-login`, {
			user_name,
			data: regData,
		});
		console.log({ verificationRes });
	}
	useEffect(() => {
		getAuthenticationOptions("benzofx");
	}, []);
	return (
		<>
			<div className='grid_txt_1'>
				<div className='grid_txt'>
					<label htmlFor=''>email</label>
					<input placeholder='enter username' autoComplete='webauthn' autoFocus={true} />
				</div>
				<div className='grid_txt'>
					<label htmlFor=''>enter password</label>
					<input type={"password"} autoComplete='webauthn' />
				</div>
			</div>
		</>
	);
}

export default Login;
