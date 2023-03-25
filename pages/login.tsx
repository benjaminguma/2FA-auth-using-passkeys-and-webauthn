import React, { FormEvent, FormEventHandler, useEffect, useRef, useState } from "react";
import * as SimpleWebAuthnBrowser from "@simplewebauthn/browser";
import { useAuth } from "@/AuthProvider";
import { useRouter } from "next/router";
function Login() {
	const { handleDeviceAuthentication, login, user } = useAuth();
	const [email, setEmail] = useState("");
	const router = useRouter();
	const passwordRef = useRef<HTMLInputElement>(null);
	const [browserSupportsWebAuthn, setBrowserSupportsWebAuthn] = useState(false);

	const e = email;
	useEffect(() => {
		if (SimpleWebAuthnBrowser.browserSupportsWebAuthn()) {
			setBrowserSupportsWebAuthn(true);
			handleDeviceAuthentication(email as string, true).then(
				(isSuccessful) => isSuccessful && router.replace("profile"),
			);
		}
	}, [e]);

	const goToProfilePage = (isSuccessful: boolean) => isSuccessful && router.replace("profile");
	const handleLoginPasskey: FormEventHandler<HTMLFormElement> = (e: FormEvent) => {
		e.preventDefault();
		return handleDeviceAuthentication(email).then(goToProfilePage);
	};

	const handleLoginBasic: FormEventHandler<HTMLFormElement> = (e: FormEvent) => {
		e.preventDefault();
		if (passwordRef?.current && email) {
			const password = passwordRef.current?.value || "";
			return login(email, password).then(goToProfilePage);
		}
	};

	return (
		<form onSubmit={browserSupportsWebAuthn ? handleLoginPasskey : handleLoginBasic}>
			<div className='grid_txt_1'>
				<h1 className='u-center'>&lt;Login&gt;</h1>
				<div className='grid_txt'>
					<label htmlFor=''>email</label>
					<input
						value={email}
						// name='email'
						placeholder='enter your email'
						autoComplete='username webauthn'
						onChange={({ target: { value } }) => setEmail(value)}
					/>
				</div>
				{browserSupportsWebAuthn ? (
					<></>
				) : (
					<>
						<div className='grid_txt'>
							<label htmlFor=''>password</label>
							<input
								ref={passwordRef}
								type='password'
								placeholder='enter your password'
								autoComplete='password webauthn'
							/>
						</div>
					</>
				)}
				<button className='btn'>login</button>
			</div>
		</form>
	);
}

export default Login;
