//@ts-nocheck
import React from "react";
import { Heart } from "react-feather";
import {
    StyledFooter,
    StyledCopyright
} from "./style";

const Footer: React.FC = () => {
    return (
        <StyledFooter>
            <StyledCopyright>
               Copyright by invextrade All Rights Reserved
            </StyledCopyright>
        </StyledFooter>
    );
};

export default Footer;
