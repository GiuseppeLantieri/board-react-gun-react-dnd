import React from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";
import Home from "./Components/Home";
import KovanBoard from "./Components/KovanBoard";

import './App.css';

export default function App() {
	return (
		<Router>
			<div>
				<Switch>
					<Route path="/kovan/:id">
						<nav>
							<ul>
								<li>
									<Link to="/" style={{ color: "white", textDecoration: "none" }}>Home</Link>
								</li>
							</ul>
						</nav>
						<KovanBoard />
					</Route>
					<Route path="/">
						<Home />
					</Route>
				</Switch>
			</div>
		</Router>
	);
}
