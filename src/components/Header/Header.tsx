import React from "react";
import './header.scss';

function Header() {
    return (
        <>
            <div className="header">
                <div className="logo">
                    <span>Carlota’s Kuchen Haus
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