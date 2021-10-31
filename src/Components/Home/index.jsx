import React, { useState } from 'react'
import { useHistory } from 'react-router';

export default function Home() {
	const [id, setId] = useState("");
	const history = useHistory();

	return (
		<div style={{ display: "flex", justifyContent: "center", height: "80vh", alignItems: "center", flexDirection: "column" }}>
			<h1>Select the Id:</h1>
			<form onSubmit={(e) => { e.preventDefault(); history.push("/kovan/" + id) }}>
				<input type="text" value={id} onChange={(e) => { setId(e.currentTarget.value) }} />
				<input type="submit" />
			</form>
		</div>
	)
}
