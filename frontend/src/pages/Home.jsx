import { useState, useEffect } from "react";
import api from "../api";
import "../styles/Home.css"

function Home() {
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    return (
        <div>
            <h1>Welcome to the Home Page</h1>
        </div>
    );
}

export default Home;
