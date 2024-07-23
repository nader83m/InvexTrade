//@ts-nocheck
// @ts-nocheck
import { FC, useState } from "react";
import { FormGroup, Label, Input, Anchor, Button, Alert } from "@doar/components";
import { useForm } from "react-hook-form";
import { hasKey } from "@doar/shared/methods";
import {
    StyledWrap,
    StyledTitle,
    StyledDesc,
    StyledLabelWrap,
    StyledDivider,
    StyledBottomText,
    StyledAlert
} from "./style";
import { signIn } from "../../utils";
import { setUserAllApp } from "../../apiRequest";
import { useNavigate } from "react-router-dom"
import {useAppDispatch, useAppSelector} from "../../redux/hooks"

interface IFormValues {
    email: string;
    password: string;
}

const SigninForm: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [alertStates, setAlertStates] = useState({ visible: false, msg: "" })
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const onSubmit = async (data: IFormValues) => {
        const signInResponse = await signIn(data.username, data.password)
        if (!signInResponse.msg){
            navigate('/dashboard-invextrade')
            setUserAllApp(data)
        }
        else setAlertStates(prevState => ({ ...prevState, msg: signInResponse.msg, visible: true }))
        setTimeout(() => {
            setAlertStates(prevState => ({ ...prevState, visible: false }))
        }, 7000)
    };

    return (
        <StyledWrap>
            <StyledTitle>Sign In</StyledTitle>
            <StyledDesc>Welcome back! Please signin to continue.</StyledDesc>
            <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
                <FormGroup mb="20px">
                    <Label display="block" mb="5px" htmlFor="">
                        Username
                    </Label>
                    <Input
                        id="username"
                        placeholder="Enter your username"
                        feedbackText={errors?.email?.message}
                        state={hasKey(errors, "username") ? "error" : "success"}
                        showState={!!hasKey(errors, "email")}
                        {...register("username", {
                            required: "Username is required",
                            // pattern: {
                            //     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                            //     message: "invalid email address",
                            // },
                        })}
                    />
                </FormGroup>
                <FormGroup mb="20px">
                    <StyledLabelWrap>
                        <Label display="block" mb="5px" htmlFor="password">
                            Password
                        </Label>
                        {/* <Anchor path="/forgot-password" fontSize="13px">
                            Forgot password?
                        </Anchor> */}
                        <Anchor path="#" fontSize="13px">
                            Forgot password?
                        </Anchor>
                    </StyledLabelWrap>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        feedbackText={errors?.password?.message}
                        state={hasKey(errors, "password") ? "error" : "success"}
                        showState={!!hasKey(errors, "password")}
                        {...register("password", {
                            required: "Password is required",
                            // minLength: {
                            //     value: 6,
                            //     message: "Minimum length is 6",
                            // },
                            // maxLength: {
                            //     value: 10,
                            //     message: "Minimum length is 10",
                            // },
                        })}
                    />
                </FormGroup>
                <Button type="submit" color="brand2" fullwidth>
                    Sign In
                </Button>

                {/* <StyledDivider>or</StyledDivider>
                <Button variant="outlined" color="facebook" fullwidth>
                    Sign In With Facebook
                </Button>
                <Button
                    variant="outlined"
                    color="twitter"
                    mt="0.5rem"
                    fullwidth
                >
                    Sign In With Twitter
                </Button> */}
                <StyledBottomText>
                    Don&apos;t have an account?{" "}
                    <Anchor path="/signup">Create an Account</Anchor>
                </StyledBottomText>
                <StyledAlert>
                    {
                        alertStates.visible ? <Alert color="danger">
                            <Label >
                                {alertStates.msg}
                            </Label>
                        </Alert> : null}
                </StyledAlert>
            </form>
        </StyledWrap>
    );
};

export default SigninForm;
