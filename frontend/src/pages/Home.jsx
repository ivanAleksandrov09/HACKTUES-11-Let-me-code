import { useState, useEffect } from "react";
import api from "../api";
import "../styles/Home.css"

function Home() {
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    return (
        <body>
            {/*navbar*/}
            <div class="navbar">
                <a class="name" href="#">Logo</a>
                <ul class="ul_navbar">
                    <li><div class="item item-1"><a href="#">Home</a></div></li>
                    <li><div class="item item-2"><a href="#">Transatctions</a></div></li>
                    <li><div class="item item-3"><a href="#">Info</a></div></li>
                </ul>
                <div class="something_container">
                <a class="something Login" href="Login.jsx">Log in</a>
                <a class="something Signup" href="Register.jsx">Sign Up</a>
                </div>
            </div>
            {/*End of navbar*/}
            {/*footer*/}
            <div class="footer">
                <p class="text text1">&#169;2025 Let me code.<br></br>All rigths reserved </p>

                <p class="something something2">Something</p>
            </div> 
        
        </body>
    );
}

export default Home;
