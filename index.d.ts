export type AuthContextType = {
	handleDeviceRegistration(username: string): Promise<void>;
	handleDeviceAuthentication(username: string): Promise<boolean>;
	signOut(): void;
	status: authStatus;
	user: User | null;
	signup(username: string, password: string): Promise<void>;
	login(username: string, password: string): Promise<void>;
};

export type authStatus = "authenticated" | "unauthenticated" | "loading";

export type User = {
	id: string;
	username: string;
	password: string;
};

import { VerifyAuthenticationResponseOpts } from "@simplewebauthn/server/./dist";

export type UserOnDb = {
	id: string;
	username: string;
	currentChallenge: string;
	password: string;
};

export type AuthenticatorType = {
	credentialID: Uint8Array;
	credentialPublicKey: Uint8Array;
	counter: striing;
};

export type verificationPayload = {
	data: VerifyAuthenticationResponseOpts;
	user_id: string;
	user_name?: string;
};

export type singleUserAuthenticator = { userId: string; authenticators: AuthenticatorType[] };

export type AuthVerifyPayload = {
	data: {
		id: string;
		rawId: string;
		response: {
			authenticatorData: string;
			clientDataJSON: string;
			signature: string;
			userHandle: string;
		};
		type: string;
		clientExtensionResults: {};
		authenticatorAttachment: "platform";
	};
	user_name: string;
};
