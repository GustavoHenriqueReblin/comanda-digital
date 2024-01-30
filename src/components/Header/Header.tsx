import './header.scss';
import { Redirect } from "../../types/types";

import React from "react";
import { useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();

    const redirectTo = (typeRedirect: Redirect) => {
        if (typeRedirect === Redirect.ROOT) {
            navigate('/')
        }
    };
    return (
        <>
            <div className="header">
                <div className="logo">
                    <span onClick={() => redirectTo(Redirect.ROOT)} className="logo-title">Carlota’s Kuchen Haus
                        <div className="line"></div>
                    </span>
                </div>
                <div className="menu">
                    <div className="menu-box">
                        <h2>ME</h2>
                        <h2>NU</h2>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header;