import Link from "next/link";
import { useRef, useState } from "react";

export default function App() {
	const ref = useRef<HTMLInputElement>(null);
	const [userId, setUserId] = useState("");
	return (
		<div className='App grid_txt_1'>
			<Link className='btn br' href={"/signup"}>
				signup
			</Link>
			<Link className='btn br' href={"/login"}>
				login
			</Link>
		</div>
	);
}

// import axios from "axios";
// import { useRef, useState } from "react";

// export default function App() {
// 	const ref = useRef<HTMLInputElement>(null);
// 	const [userId, setUserId] = useState("");
// 	const handleRegistration = async () => {};

// 	const handleAuthentication = async () => {};
// 	return (
// 		<div className='App'>
// 			<input ref={ref} type='text' placeholder='enter your username' value='benzofx' />
// 			<br />
// 			<button onClick={handleRegistration}>register</button>
// 			<button onClick={handleAuthentication}>authenticate</button>
// 		</div>
// 	);
// }
