//@ts-nocheck
import { FC } from "react";
import loginImage from "../../../src/Images/Invexlogo.jpeg";
import SigninForm from "../../components/signin-form";
import {
    StyledMedia,
    StyledMediaBody,
    StyledImage,
    StyledImgText,
    StyledSignin,
} from "./style";

const AuthContainer: FC = () => {
    return (
        <StyledMedia>
            <StyledMediaBody>
                <StyledImage>
                    <img src={loginImage} alt="Login" />
                </StyledImage>
                <StyledImgText>
                </StyledImgText>
            </StyledMediaBody>
            <StyledSignin>
                <SigninForm />
            </StyledSignin>
        </StyledMedia>
    );
};

export default AuthContainer;
