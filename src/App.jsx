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
import TakeNote from "./Components/TakeNote/TakeNote";
import Navbar from "./Components/Navbar/Navbar";

export default function App() {
	return (
		<Router>
			<div>
				<Switch>
					<Route path="/kovan/:id">
						<Navbar />
						<KovanBoard />
					</Route>
					<Route path="/note/:id">
						<Navbar />
						<TakeNote />
					</Route>
					<Route path="/">
						<Home />
					</Route>
				</Switch>
			</div>
		</Router>
	);
}
