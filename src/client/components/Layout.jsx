import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';

const StyledMenu = styled.ul`
    list-style: none;
    width: 990px;
    margin: 50px auto;
    padding: 0;
    
    & > li {
        display: inline-block;
    
        & > a {
            text-decoration: none;
            margin-right: 20px;
            color: #000;
            
            &.active {
                color: #607D8B;
            }
        }
    }
`;

export default ({ children }) => (
    <div>
        <StyledMenu>
            <li>
                <Link
                    to="/login"
                    activeClassName="active"
                >
                    User page
                </Link>
            </li>
            <li>
                <Link
                    to="/peers"
                    activeClassName="active"
                >
                    Peers page
                </Link>
            </li>
        </StyledMenu>
        <div>
            {children}
        </div>
    </div>
);