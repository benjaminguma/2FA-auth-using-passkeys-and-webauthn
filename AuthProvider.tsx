import { createContext, PropsWithChildren, useState, useContext, useEffect } from "react";
import { AuthContextType, authStatus, User } from ".";

const AuthCtx = createContext<AuthContextType>({
	status: "loading",
	user: null,
	async handleDeviceRegistration(username: string) {},
	async handleDeviceAuthentication(username: string, useBrowserAutofill = false) {
		return false;
	},
	async signup(username: string, password: string) {},
	async login(username: string, password: string) {},
	signOut() {},
});
export const useAuth = () => useContext(AuthCtx);

const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
	const [status, setStatus] = useState<authStatus>("loading");
	const [user, setUser] = useState<User | null>(null);

	const signup = async (username: string, password: string) => {};
	const login = async (username: string, password: string) => {};

	const handleDeviceRegistration = async (username: string) => {};

	const handleDeviceAuthentication = async (username: string) => {
		return false;
	};
	const signOut = async () => {};

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
