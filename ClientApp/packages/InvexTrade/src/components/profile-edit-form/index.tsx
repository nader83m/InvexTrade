//@ts-nocheck

import { FC, useEffect, useState } from "react";
import {
    Label,
    FormGroup,
    Input,
    Anchor,
    Button,
    Text,
    Alert,
    Textarea,
    Image,
    Row,
    Col
} from "@doar/components";
import { useForm } from "react-hook-form";
import {
    StyledWrap,
    StyledCenter,
    StyledAlert
} from "./style";

import avatar from "../../../src/Images/avatar.png"
import { getRequest } from "../../apiRequest";
import { updateUserProfile } from "../../utils";

interface IFormValues {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    password2: string;
    phone: string;
    username: string;
}

const ProfileEditForm: FC = () => {
    const {
        handleSubmit,
        formState: { errors },
        register,
    } = useForm();

    const [alertStates, setAlertStates] = useState({ visible: false, msg: "", color: "danger" });
    const [formVals, setFormVals] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        password2: "",
        phone: "",
        username: ""
    });

    function handleFromChange(e) {
        setFormVals(prevState => ({ ...prevState, [e.target.name]: e.target.value }))
    }

    const onSubmit = async (data: IFormValues) => {
        if (formVals.password && formVals.password !== formVals.password2) {
            setAlertStates({ color: "danger", msg: "Passwords do not match.", visible: true })
            closeAlert()
            return
        }
        const response = await updateUserProfile(formVals)
        if (response.ok) setAlertStates({ color: "success", msg: response.data.msg, visible: true })
        else setAlertStates({ color: "danger", msg: response.errorMsg, visible: true })
        closeAlert()
    };

    function closeAlert() {
        setTimeout(() => {
            setAlertStates(prevState => ({ ...prevState, visible: false }))
        }, 7000)
    }

    useEffect(() => {
        const getFormData = async () => {
            const formData = await getRequest("v1/profile");
            if (formData.profile) {
                setFormVals(formData.profile)
            }
        }
        getFormData();
    }, [])

    return (
        <StyledWrap>
            <Row>
                <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <StyledCenter>
                        <Row>
                            <FormGroup mb="20px">
                                <Image src={avatar} alt="group" shape="circle" width={70} height={70} />
                            </FormGroup>
                        </Row>
                    </StyledCenter>
                    <Row>
                        <Col col xl="6" lg="6" md="6" sm="6">
                            <div>
                                <FormGroup mb="20px">
                                    <Label display="block" mb="5px" htmlFor="username">
                                        User Name
                                    </Label>
                                    <Input
                                        {...register("username")}
                                        id="username"
                                        type="text"
                                        disabled
                                        value={formVals.username}
                                        onChange={handleFromChange}
                                    />
                                </FormGroup>
                                <FormGroup mb="20px">
                                    <Label display="block" mb="5px" htmlFor="firstname">
                                        First Name
                                    </Label>
                                    <Input
                                        {...register("firstname")}
                                        id="firstname"
                                        type="text"
                                        value={formVals.firstname}
                                        onChange={handleFromChange}
                                    />
                                </FormGroup>
                                <FormGroup mb="20px">
                                    <Label display="block" mb="5px" htmlFor="phone">
                                        Phone
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+1 (___) ___-____"
                                        data-slots="_"
                                        {...register("phone")}
                                        value={formVals.phone}
                                        onChange={handleFromChange}
                                    />
                                </FormGroup>
                                <FormGroup mb="20px">
                                    <Label display="block" mb="5px" htmlFor="password">
                                        Password
                                    </Label>
                                    <Input
                                        width={"40vh"}
                                        id="password"
                                        type="password"
                                        {...register("password")}
                                        value={formVals.password}
                                        onChange={handleFromChange}
                                    />
                                </FormGroup>
                            </div>
                        </Col>
                        <Col col xl="6" lg="6" md="6" sm="6">
                            <FormGroup mb="20px">
                                <Label display="block" mb="5px" htmlFor="email">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    value={formVals.email}
                                    onChange={handleFromChange}
                                />
                            </FormGroup>
                            <FormGroup mb="20px">
                                <Label display="block" mb="5px" htmlFor="lastname">
                                    Last Name
                                </Label>
                                <Input
                                    {...register("lastname")}
                                    id="lastname"
                                    type="text"
                                    value={formVals.lastname}
                                    onChange={handleFromChange}
                                />
                            </FormGroup>
                            <FormGroup mb="20px">
                                <Label display="block" mb="5px" htmlFor="age">
                                    Age
                                </Label>
                                <Input
                                    id="age"
                                    type="number"
                                    {...register("age")}
                                    value={formVals.age}
                                    onChange={handleFromChange}
                                />
                            </FormGroup>
                            <FormGroup mb="20px">
                                <Label display="block" mb="5px" htmlFor="password2">
                                    Password Again
                                </Label>
                                <Input
                                    width={"40vh"}
                                    id="password2"
                                    type="password"
                                    {...register("password2")}
                                    value={formVals.password2}
                                    onChange={handleFromChange}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Button mt="3" ml="2" mr="2" type="submit" color="brand2" fullwidth>
                            Update
                        </Button>
                    </Row>
                    <StyledAlert>
                        {
                            alertStates.visible ? <Alert color={alertStates.color} variant={"contained"} solid={false} hasLink={false} isDismissible={false} hasIcon={false}>
                                <Label htmlFor={""} >
                                    {alertStates.msg}
                                </Label>
                            </Alert> : null}
                    </StyledAlert>
                </form>
            </Row>
        </StyledWrap>
    );
};

export default ProfileEditForm;
