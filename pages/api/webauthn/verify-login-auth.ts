import { AuthenticationAssertionPayload } from "@/index";
import { AuthenticatorsService } from "@/services/authenticator.service";
import { UserService } from "@/services/users.service";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { AuthenticationResponseJSON } from "@simplewebauthn/typescript-types";
import type { NextApiRequest, NextApiResponse } from "next";
import { rpID, origin } from "./get-reg-device-options";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { data }: AuthenticationAssertionPayload = req.body;

	const user = UserService.findById(data.response.userHandle || "");

	if (!user) {
		return res.status(403).end();
	}

	const userAuthenticators = AuthenticatorsService.getUserAuthenticators(user.id);
	if (!userAuthenticators) {
		return res.status(403).end();
	}

	const authenticator = AuthenticatorsService.getAuthenticatorByCredentialId(
		userAuthenticators.authenticators,
		data.rawId,
	);
	if (!authenticator) {
		return res.status(400).end();
	}

	try {
		authenticator.credentialPublicKey = Uint8Array.from(authenticator.credentialPublicKey);
		const verificationRes = await verifyAuthenticationResponse({
			response: data as unknown as AuthenticationResponseJSON,
			expectedChallenge: /* "EzJj_WZDFDj9TlIDVv39_f39" || */ user.currentChallenge,
			expectedOrigin: origin,
			expectedRPID: rpID,
			authenticator,
		});
		console.log({ verificationRes });
		// use verification response to do something

		// send seession id or token or send otp
		res.send({
			verified: verificationRes.verified,
			user: {
				email: user.email,
				id: user.id,
			},
		});
	} catch (error) {
		console.log(error);
		res.status(500).end();
	}
}
