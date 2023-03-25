import { UserService } from "@/services/users.service";

import type { NextApiRequest, NextApiResponse } from "next";

type createUserPayload = {
	email: string;
	password: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { email, password }: createUserPayload = req.body;
	const existingUser = UserService.findByEmail(email);

	if (existingUser) {
		return res.status(400).end();
	}

	UserService.createUser({
		email,
		password,
	});

	res.status(201).json({
		message: "user successfully created!!",
	});
}
