import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { User } from "../index";

export const UserService = {
	getUsers() {
		return JSON.parse(readFileSync("users.json", "utf-8")) as User[];
	},
	findById(userId: string) {
		return this.getUsers().find((e) => e.id === userId);
	},
	findByEmail(email: string) {
		console.log(this.getUsers().length, "at find");
		return this.getUsers().find((e) => e.email === email);
	},
	updateUser(user: User) {
		const users = this.getUsers();
		const res = users.splice(Number(user.id) - 1, 1, user);
		this.saveUsers(users);
	},

	createUser(user: Pick<User, "email" | "password">) {
		const { email, password } = user;
		const users = this.getUsers();
		users.push({
			email,
			password,
			id: String(users.length + 1),
			currentChallenge: "",
		});
		this.saveUsers(users);
		return user;
	},
	saveUsers(users: User[]) {
		writeFileSync("users.json", JSON.stringify(users));
	},
	loginUserBasic(user: Pick<User, "email" | "password">) {
		const { email, password } = user;
		const existingUser = this.findByEmail(email);

		if (!existingUser) {
			return null;
		}

		if (existingUser.password !== password) {
			return null;
		}

		return existingUser;
	},
};
