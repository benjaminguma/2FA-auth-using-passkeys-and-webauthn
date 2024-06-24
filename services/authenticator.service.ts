import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { AuthenticatorType, singleUserAuthenticator } from "../index";

export const AuthenticatorsService = {
	getCollectionOfUserAuthenticators() {
		return JSON.parse(readFileSync("users-authenticators.json", "utf-8")) as singleUserAuthenticator[];
	},
	getUserAuthenticatorsIndex(userId: string) {
		return this.getCollectionOfUserAuthenticators().findIndex((e) => e.userId === userId);
	},

	getUserAuthenticators(userId: string) {
		const userAuthenticator = this.getCollectionOfUserAuthenticators().find((e) => e.userId === userId);
		if (!userAuthenticator) {
			return null;
		}
		userAuthenticator.authenticators = userAuthenticator.authenticators.map((a) => ({
			...a,
			credentialID: Uint8Array.from(a.credentialID),
		}));

		return userAuthenticator;
	},

	async storeUserAuthenticator(userId: string, newAuthenticator: AuthenticatorType) {
		const CollectionOfUserAuthenticators = this.getCollectionOfUserAuthenticators();
		let index = this.getUserAuthenticatorsIndex(userId);

		let userAuthenticators: singleUserAuthenticator;
		if (index === -1) {
			userAuthenticators = {
				userId: userId,
				authenticators: [],
			};
		} else userAuthenticators = CollectionOfUserAuthenticators[index];

		newAuthenticator.credentialID = Array.from(newAuthenticator.credentialID);
		newAuthenticator.credentialPublicKey = Array.from(newAuthenticator.credentialPublicKey);
		userAuthenticators.authenticators.push(newAuthenticator);

		if (index === -1) {
			CollectionOfUserAuthenticators.push(userAuthenticators);
		} else CollectionOfUserAuthenticators[index] = userAuthenticators;

		writeFileSync("users-authenticators.json", JSON.stringify(CollectionOfUserAuthenticators));
	},

	getAuthenticatorByCredentialId(userAuthenticators: AuthenticatorType[], autheticatorCredentialIdB64URL: string) {
		return userAuthenticators.find(
			(a) => Buffer.from(a.credentialID).toString("base64url") === autheticatorCredentialIdB64URL,
		);
	},
};
