//@ts-nocheck
import { FC } from "react";
import { Users, MessageSquare, Phone, AtSign, HelpCircle } from "react-feather";
import ReactTooltip from "react-tooltip";
import { useAppSelector } from "../../../../redux/hooks";
import { StyledNavLeft, StyledNav, StyledNavLink } from "./style";

interface IProps {
    layout?: 1 | 2;
}

const NavLeft: FC<IProps> = ({ layout }) => {
    const { sidebar } = useAppSelector((state) => state.ui);
    return (
        <StyledNavLeft className="nav-left" $layout={layout} $sidebar={sidebar}>
            <StyledNav>
                <StyledNavLink path="#!" data-tip="Contacts">
                    <Users />
                </StyledNavLink>
                <ReactTooltip place="right" effect="solid" />
                <StyledNavLink path="#!" $active data-tip="Messages">
                    <MessageSquare />
                </StyledNavLink>
                <ReactTooltip place="right" effect="solid" />
                <StyledNavLink path="#!" data-tip="Phone Calls">
                    <Phone />
                </StyledNavLink>
                <ReactTooltip place="right" effect="solid" />
                <StyledNavLink path="#!" data-tip="Mentions">
                    <AtSign />
                </StyledNavLink>
                <ReactTooltip place="right" effect="solid" />
                <StyledNavLink path="#!" data-tip="Help">
                    <HelpCircle />
                </StyledNavLink>
                <ReactTooltip place="right" effect="solid" />
            </StyledNav>
        </StyledNavLeft>
    );
};

NavLeft.defaultProps = {
    layout: 1,
};

export default NavLeft;
