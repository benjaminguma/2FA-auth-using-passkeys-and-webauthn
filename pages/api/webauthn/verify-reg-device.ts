import type { NextApiRequest, NextApiResponse } from "next";
import { verifyRegistrationResponse, VerifiedRegistrationResponse } from "@simplewebauthn/server";
import { AuthenticatorsService } from "@/services/authenticator.service";
import { rpID, rpName, origin } from "./get-reg-device-options";
import { UserService } from "@/services/users.service";
import { verificationPayload } from "@/index";
import { RegistrationResponseJSON } from "@simplewebauthn/typescript-types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { data, email }: verificationPayload = req.body;
	if (!email) {
		return res.status(400).json({ message: "user not found" });
	}
	const user = UserService.findByEmail(email);
	console.log(user);

	if (!user) {
		return res.status(404).json({ message: "user not found" });
	}
	try {
		const verificationResult: VerifiedRegistrationResponse = await verifyRegistrationResponse({
			response: data as unknown as RegistrationResponseJSON,
			expectedChallenge: user.currentChallenge,
			expectedOrigin: origin,
			expectedRPID: rpID,
		});

		// console.log(verificationResult);
		if (!verificationResult.verified) {
			return res.status(403).end();
		}
		// console.log(JSON.stringify(verificationResult));
		if (verificationResult?.registrationInfo) {
			const { credentialPublicKey, credentialID, counter, userVerified } = verificationResult.registrationInfo;
			const newAuthenticator = {
				credentialPublicKey,
				credentialID,
				counter,
			};

			AuthenticatorsService.storeUserAuthenticator(user.id, newAuthenticator);
		}

		res.status(200).json({ message: "verified" });
	} catch (error) {
		console.log(error);
		res.status(500).end();
	}
}
