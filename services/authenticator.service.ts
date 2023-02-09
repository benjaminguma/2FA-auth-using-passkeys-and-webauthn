import { AuthenticatorType, singleUserAuthenticator } from "../index";

export const CollectionOfUserAuthenticators: Array<singleUserAuthenticator> = [];

export const AuthenticatorsService = {
	getUserAuthenticatorsIndex(userId: string) {
		return CollectionOfUserAuthenticators.findIndex((e) => e.userId === userId);
	},

	getUserAuthenticators(userId: string) {
		return CollectionOfUserAuthenticators.find((e) => e.userId === userId) || null;
	},

	storeUserAuthenticator(userId: string, newAuthenticator: AuthenticatorType) {
		let index = this.getUserAuthenticatorsIndex(userId);
		let userAuthenticators: singleUserAuthenticator;
		if (index === -1) {
			userAuthenticators = {
				userId: userId,
				authenticators: [],
			};
		} else userAuthenticators = CollectionOfUserAuthenticators[index];

		userAuthenticators.authenticators.push(newAuthenticator);
		if (index === -1) {
			CollectionOfUserAuthenticators.push(userAuthenticators);
		} else CollectionOfUserAuthenticators[index] = userAuthenticators;

		console.log(CollectionOfUserAuthenticators);
	},

	getAuthenticatorByCredentialId(userAuthenticators: AuthenticatorType[], autheticatorCredentialIdB64URL: string) {
		return userAuthenticators.find(
			(a) => Buffer.from(a.credentialID).toString("base64url") === autheticatorCredentialIdB64URL,
		);
	},
};
