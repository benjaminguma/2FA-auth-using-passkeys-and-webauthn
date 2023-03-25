import { AuthenticatorsService } from "@/services/authenticator.service";
import type { NextApiRequest, NextApiResponse } from "next";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { User } from "@/index";
import { UserService } from "@/services/users.service";
import crypto from "node:crypto";
// Human-readable title for your website
export const rpName = "my-special-site";
// A unique identifier for your website
export const rpID = "localhost";
// The URL at which registrations and authentications should occur
export const origin = `http://${rpID}:3000`;

const getPublicKeyCredentialCreationOptions = (user: User) => {
	const userAuthenticators = AuthenticatorsService.getUserAuthenticators(user.id);
	const challenge = crypto.randomBytes(20).toString("base64url");

	const options = generateRegistrationOptions({
		rpName,
		rpID,
		userID: user.id,
		userName: user.email,
		challenge,
		excludeCredentials: !userAuthenticators
			? []
			: (userAuthenticators.authenticators.map((a) => ({
					id: a.credentialID,
					type: "public-key",
			  })) as PublicKeyCredentialDescriptor[]),
		timeout: 1000 * 60 * 5,
		attestationType: "none",
		authenticatorSelection: {
			requireResidentKey: true,
			userVerification: "required",
		},
	});
	user.currentChallenge = challenge;
	options.challenge = challenge;
	UserService.updateUser(user);

	return options;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const user: User | undefined = UserService.findByEmail(req.body.email);
	if (!user) {
		return res.status(400).send({ message: "internal server error" });
	}

	const opt = getPublicKeyCredentialCreationOptions(user);

	return res.send(opt);
}
