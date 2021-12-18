import React from 'react'
import { Link, useParams } from 'react-router-dom';

export default function Navbar() {
    const { id } = useParams();

    return (
        <nav>
            <ul style={{ display: "flex", justifyContent: "space-between" }}>
                <li>
                    <Link to="/" style={{ color: "white", textDecoration: "none" }}>Home</Link>
                </li>
                <li>
                    <Link to={"/kovan/" + id} style={{ color: "white", textDecoration: "none" }}>Kovan</Link>
                </li>
                <li>
                    <Link to={"/note/" + id} style={{ color: "white", textDecoration: "none" }}>Note</Link>
                </li>
            </ul>
        </nav>
    )
}
