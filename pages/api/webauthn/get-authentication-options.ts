import { AuthenticatorsService } from "@/services/authenticator.service";
import { UserService } from "@/services/users.service";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (!req.body.email) {
		return res.send(
			generateAuthenticationOptions({
				allowCredentials: [],
				userVerification: "preferred",
				timeout: 60 * 1000 * 5, // ensures that even if attacker has
			}),
		);
	}

	const user = UserService.findByEmail(req.body.email);
	if (!user) {
		return res.status(404).end();
	}
	const userAuthenticators = AuthenticatorsService.getUserAuthenticators(user.id);
	if (!userAuthenticators) {
		return res.status(404).end();
	}
	const options = generateAuthenticationOptions({
		allowCredentials:
			[] ||
			userAuthenticators.authenticators.map((a) => ({
				id: a.credentialID,
				type: "public-key",
			})),
		userVerification: "preferred",
		timeout: 60 * 1000 * 5, // ensures that even if attacker has
	});
	// user.currentChallenge = options.challenge;
	options.challenge = user.currentChallenge;
	UserService.updateUser(user);
	res.send({ data: options });
}
