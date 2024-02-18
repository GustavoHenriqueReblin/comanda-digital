/* eslint-disable react-hooks/exhaustive-deps */
import './header.scss';
import { routes } from '../../types/types';

import React from "react";
import { useLocation } from 'react-router-dom';

function Header() {
    const location = useLocation();
    const currentPage = routes.find(page => page.route === location.pathname);
    const pageName = currentPage ? currentPage.name : 'Comanda digital';

    return (
        <>
            <div className='header'>
                <div className='page-info'>
                    <h2 className='title'>{ pageName }</h2>
                    <span className='name'>Carlota’s Kuchen Haus</span>
                </div>
            </div>
        </>
    )
}

export default Header;