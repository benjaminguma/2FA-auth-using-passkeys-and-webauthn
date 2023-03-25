import { createContext, PropsWithChildren, useState, useContext, useEffect } from "react";
import { AuthContextType, authStatus, User } from ".";
import * as SimpleWebAuthnBrowser from "@simplewebauthn/browser";
import axios from "axios";
import { useRouter } from "next/router";

const initialState: AuthContextType = {
	status: "loading",
	user: {
		email: "",
	},
	async handleDeviceRegistration() {
		return false;
	},
	async handleDeviceAuthentication(email: string, useBrowserAutofill = false) {
		return false;
	},
	async signup(email: string, password: string) {},
	async login(email: string, password: string) {
		return false;
	},
	signOut() {},
};

const AuthCtx = createContext<AuthContextType>(initialState);
export const useAuth = () => useContext(AuthCtx);

const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
	const [status, setStatus] = useState<authStatus>("loading");
	const [user, setUser] = useState<{ email: string }>({ email: "" });
	const router = useRouter();

	const signup = async (email: string, password: string) => {
		try {
			const { data } = await axios.post(`/api/signup`, {
				email,
				password,
			});
			setUser({ email });
			localStorage.setItem("email", email);
			router.push("/register-device");
		} catch (error) {
			console.log(error);
		}
	};

	const login = async (email: string, password: string) => {
		try {
			const { data } = await axios.post(`/api/basic-login`, {
				email,
				password,
			});
			return true;
		} catch (error) {
			alert("error loggin in");
		}
		return false;
	};

	const handleDeviceRegistration = async () => {
		const email = localStorage.getItem("email") || "";
		try {
			const { data: credentialCreationOptions } = await axios.post(`/api/webauthn/get-reg-device-options`, {
				email,
			});
			console.log(credentialCreationOptions);
			const attestationResponse = await SimpleWebAuthnBrowser.startRegistration(credentialCreationOptions);
			console.log(attestationResponse);
			await axios.post(`/api/webauthn/verify-reg-device`, {
				email,
				data: attestationResponse,
			});
			return true;
		} catch (error) {
			console.log(error);
			alert("oopsie!! an error occured during registration");
		}

		return false;
	};

	const handleDeviceAuthentication = async (email: string, useBrowserAutofill = false) => {
		if (!email) {
			email = localStorage.getItem("email") || "";
		}
		try {
			const { data } = await axios.post(`/api/webauthn/get-authentication-options`, {
				email,
			});
			console.log({ data });
			const assertionResponse = await SimpleWebAuthnBrowser.startAuthentication(data.data, useBrowserAutofill);
			console.log({ assertionResponse });
			const verificationRes = await axios.post(`/api/webauthn/verify-login-auth`, {
				data: assertionResponse,
			});
			setStatus("authenticated");
			setUser(verificationRes.data.user as AuthContextType["user"]);
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	};
	const signOut = async () => {
		setStatus("unauthenticated");
		setUser(initialState.user);
	};

	return (
		<AuthCtx.Provider
			value={{
				status,
				user,
				handleDeviceRegistration,
				handleDeviceAuthentication,
				signOut,
				signup,
				login,
			}}
		>
			{children}
		</AuthCtx.Provider>
	);
};
export default AuthProvider;
