//@ts-nocheck
import { FC } from "react";
import { StyledLogo } from "./style";
import logoWite2 from "../../Images/logo_white_2.jpeg";
import { Link } from "react-router-dom";

const Logo: FC = () => {
    return (
        <StyledLogo>
            <Link to='/'>
                <img src={logoWite2} width = "100" alt="Logo" />
            </Link>
        </StyledLogo>
    );
};

export default Logo;
