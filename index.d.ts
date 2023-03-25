export type AuthContextType = {
	handleDeviceRegistration(): Promise<boolean>;
	handleDeviceAuthentication(email: strin, useBrowserAutofill?: boolean): Promise<boolean>;
	signOut(): void;
	status: authStatus;
	user: { email: string; id?: string };
	signup(email: string, password: string): Promise<void>;
	login(email: string, password: string): Promise<boolean>;
};

export type authStatus = "authenticated" | "unauthenticated" | "loading";

// export type User = {
// 	id: string;
// 	username: string;
// 	password: string;
// };

import { VerifyAuthenticationResponseOpts } from "@simplewebauthn/server/./dist";
import { AuthenticatorAssertionResponseJSON, AuthenticatorDevice } from "@simplewebauthn/typescript-types";

export type User = {
	id: string;
	email: string;
	currentChallenge: string;
	password: string;
};

export interface AuthenticatorType extends AuthenticatorDevice {
	credentialID: Uint8Array | Array;
	credentialPublicKey: Uint8Array | Array;
	counter: striing;
}

export type verificationPayload = {
	data: VerifyAuthenticationResponseOpts;
	user_id: string;
	email?: string;
};

export type singleUserAuthenticator = { userId: string; authenticators: AuthenticatorType[] };

export type AuthenticationAssertionPayload = {
	data: {
		id: string;
		rawId: string;
		response: AuthenticatorAssertionResponseJSON;
		type: string;
		clientExtensionResults: {};
		authenticatorAttachment: "platform";
	};
};
