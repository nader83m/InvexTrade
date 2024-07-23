//@ts-nocheck
import { FC } from "react";
import ProfileEditForm from "../../components/profile-edit-form";
import {
    StyledMedia,
    StyledEditPage,
} from "./style";

const ContactUsContainer: FC = () => {
    return (
        <StyledMedia>
            <StyledEditPage>
                <ProfileEditForm />
            </StyledEditPage>
        </StyledMedia>
    );
};

export default ContactUsContainer;
