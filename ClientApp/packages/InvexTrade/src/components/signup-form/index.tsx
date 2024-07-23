//@ts-nocheck
import { FC, useState } from "react";
import {
    Label,
    FormGroup,
    Input,
    Anchor,
    Button,
    Text,
    Alert
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
import {signUp, signIn} from "../../utils"
import {setUserAllApp} from "../../apiRequest"
import { useNavigate } from "react-router-dom"

interface IFormValues {
    email: string;
    password: string;
    username: string;
}

const SignupForm: FC = () => {
    const navigate = useNavigate();
    const [alertStates, setAlertStates] = useState({ visible: false, msg: "" })

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data: IFormValues) => {
        const signUpResponse = await signUp(data.username, data.email, data.password)
        if (!signUpResponse.msg){
            const signInResponse = await signIn(data.username, data.password)
            if (!signInResponse.msg){
                navigate('/dashboard-invextrade')
                setUserAllApp(signInResponse)
            }
            else setAlertStates(prevState => ({ ...prevState, msg: signInResponse.msg, visible: true }))
        }
        else setAlertStates(prevState => ({ ...prevState, msg: signUpResponse.msg, visible: true }))
        setTimeout(() => {
            setAlertStates(prevState => ({ ...prevState, visible: false }))
        }, 7000)
    };

    return (
        <StyledWrap>
            <StyledTitle>Create New Account</StyledTitle>
            <StyledDesc>
                It&apos;s free to signup and only takes a minute.
            </StyledDesc>
            <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
                <FormGroup mb="20px">
                    <Label display="block" mb="5px" htmlFor="username">
                        Username
                    </Label>
                    <Input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        feedbackText={errors?.username?.message}
                        state={
                            hasKey(errors, "username") ? "error" : "success"
                        }
                        showState={!!hasKey(errors, "username")}
                        {...register("username", {
                            required: "User Name is required",
                            minLength: {
                                value: 2,
                                message: "Minimum length is 2",
                            },
                        })}
                    />
                </FormGroup>
                <FormGroup mb="20px">
                    <Label display="block" mb="5px" htmlFor="email">
                        Email address
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        feedbackText={errors?.email?.message}
                        state={hasKey(errors, "email") ? "error" : "success"}
                        showState={!!hasKey(errors, "email")}
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: "invalid email address",
                            },
                        })}
                    />
                </FormGroup>
                <FormGroup mb="20px">
                    <Label display="block" mb="5px" htmlFor="password">
                        Password
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        feedbackText={errors?.password?.message}
                        state={hasKey(errors, "password") ? "error" : "success"}
                        showState={!!hasKey(errors, "password")}
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Minimum length is 6",
                            },
                            // maxLength: {
                            //     value: 10,
                            //     message: "Minimum length is 10",
                            // },
                        })}
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
                <FormGroup mb="20px">
                    <Text fontSize="12px">
                        By clicking <strong>Create an account</strong> below,
                        you agree to our terms of service and privacy statement.
                    </Text>
                </FormGroup>
                <Button type="submit" color="brand2" fullwidth>
                    Sign Up
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
                    <Anchor path="/signin">Sign In</Anchor>
                </StyledBottomText>
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

export default SignupForm;
