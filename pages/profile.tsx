import { useAuth } from "@/AuthProvider";
import React from "react";

function Profile() {
	const { user, signOut } = useAuth();
	return (
		<div className='App grid_txt_1'>
			<h1>
				congrats!! logged in as <span className='col-gold'> &lt; {user.email}&gt; </span>{" "}
			</h1>
			<div className='u-center'>
				<video autoPlay loop src='/x.mp4' />
			</div>
			<div className='u-center'>
				<button className='btn br ' onClick={signOut}>
					sign out
				</button>
			</div>
		</div>
	);
}

Profile.protected = true;

export default Profile;
