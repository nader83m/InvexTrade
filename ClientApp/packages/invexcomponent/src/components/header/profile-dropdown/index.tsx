//@ts-nocheck
// @ts-nocheck
import React from "react";
import {
    Edit3,
    User,
    HelpCircle,
    LifeBuoy,
    Settings,
    LogOut,
} from "react-feather";
import {
    DropdownToggle,
    Dropdown,
    Avatar,
    AvatarInitial,
} from "@doar/components";
import {
    StyledDropMenu,
    StyledAuthorName,
    StyledAuthorRole,
    StyledDropItem,
    StyledDivider,
    StyledAvatar,
} from "./style";
import {removeValueFromLocalStorage} from "../../../utils";
import {setUserAllApp} from "../../../apiRequest";
import { useAppSelector } from "../../../redux/hooks";
import avatar from "../../../../src/Images/avatar.png";
import { Link } from "react-router-dom";

const ProfileDropdown: React.FC = () => {
    const { user } = useAppSelector((state) => state.user);

    function logOut(){
        removeValueFromLocalStorage("token", null )
        setUserAllApp()
    }

    if(!user?.userName){
        return ( <Link to="/signin">Sign In</Link>)
    }

    return (
        <Dropdown direction="down" className="dropdown-profile">
            <DropdownToggle variant="texted">
                <StyledAvatar size="sm" shape="circle">
                    <img src = {avatar} />
                </StyledAvatar>
            </DropdownToggle>
            <StyledDropMenu>
                <Avatar size="lg" shape="circle">
                    <img src = {avatar} />
                </Avatar>
                <StyledAuthorName>{user?.userName}</StyledAuthorName>
                <StyledDropItem path="/profile-edit">
                    <Edit3 size="24" />
                    Edit Profile
                </StyledDropItem>
                <StyledDivider />
                <StyledDropItem path="/signin" mt="10px">
                    <LogOut size="24" />
                    <p onClick={logOut}>Sign Out</p> 
                </StyledDropItem>
            </StyledDropMenu>
        </Dropdown>
    );
};

export default ProfileDropdown;
