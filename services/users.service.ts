import { UserOnDb } from "../index";

export const users: UserOnDb[] = [
	{
		id: "1",
		username: "benzofx",
		password: "1234",
		currentChallenge: "",
	},
];
export const UserService = {
	findById(userId: string) {
		return users.find((e) => e.id === userId);
	},
	findByUserName(username: string) {
		return users.find((e) => e.username === username);
	},
	createUser(user: UserOnDb) {
		if (this.findById(user.id)) return false;
		users.push(user);
		return user;
	},
};
