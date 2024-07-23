//@ts-nocheck
//@ts-nocheck
import { FC, useState } from "react";
import {
    Label,
    FormGroup,
    Input,
    Anchor,
    Button,
    Text,
    Alert,
    Textarea
} from "@doar/components";
import { useForm } from "react-hook-form";
import { hasKey } from "@doar/shared/methods";
import {
    StyledWrap,
    StyledTitle,
    StyledDesc,
    StyledBottomText,
    StyledAlert
} from "./style";
import { signUp, signIn } from "../../utils"
import { useNavigate } from "react-router-dom"

interface IFormValues {
    email: string;
    password: string;
    username: string;
}

const SigninForm: FC = () => {
    const onSubmit = async (data: IFormValues) => {

    };

    const [alertStates, setAlertStates] = useState({ visible: false, msg: "" })

    return (
        <StyledWrap>
            <StyledTitle>Contact Us</StyledTitle>
            <StyledDesc>
                Have any questions? We'd love to hear from you.
            </StyledDesc>
            <form action="#" onSubmit={onSubmit} noValidate>
                <FormGroup mb="20px">
                    <Label display="block" mb="5px" htmlFor="username">
                        First Name
                    </Label>
                    <Input
                        id="firstname"
                        type="text"
                    />
                </FormGroup>
                <FormGroup mb="20px">
                    <Label display="block" mb="5px" htmlFor="lastname">
                        Last Name
                    </Label>
                    <Input
                        id="lastname"
                        type="text"
                    />
                </FormGroup>
                <FormGroup mb="20px">
                    <Label display="block" mb="5px" htmlFor="email">
                        Email address
                    </Label>
                    <Input
                        id="email"
                        type="email"
                    />
                </FormGroup>
                <FormGroup mb="20px">
                    <Label display="block" mb="5px" htmlFor="email">
                        What can we help you with?
                    </Label>
                    <Textarea
                        id="question"
                    />
                </FormGroup>
                {/* 
                <FormGroup mb="20px">
                    <Label display="block" mb="5px" htmlFor="last_name">
                        Lastname
                    </Label>
                    <Input
                        id="last_name"
                        type="text"
                        placeholder="Enter your Lastname"
                        feedbackText={errors?.last_name?.message}
                        state={
                            hasKey(errors, "last_name") ? "error" : "success"
                        }
                        showState={!!hasKey(errors, "last_name")}
                        {...register("last_name", {
                            required: "Last Name is required",
                            minLength: {
                                value: 2,
                                message: "Minimum length is 2",
                            },
                        })}
                    />
                </FormGroup> */}

                <Button type="submit" color="brand2" fullwidth>
                    Submit
                </Button>
                <StyledAlert>
                    {
                        alertStates.visible ? <Alert color="danger" variant={"contained"} solid={false} hasLink={false} isDismissible={false} hasIcon={false}>
                            <Label htmlFor={""} >
                                {alertStates.msg}
                            </Label>
                        </Alert> : null}
                </StyledAlert>
            </form>
        </StyledWrap>
    );
};

export default SigninForm;
