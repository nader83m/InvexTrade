/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useState, useEffect, useRef } from "react";
import { X } from "react-feather";
import { Modal, ModalBody, ModalFooter, Button, Input } from "@doar/components";
import { StyledImage, Styledh2 } from "./style";
import { Row, Col, Label } from "@doar/components";
import Content from "../../../layouts/content";
import errorImg from "../../../../src/Images/error.png";

const errorOccuredPage = () => {
    return (
        <Content>
            <StyledImage>
                <Row>
                    <Col col>
                        <img src={errorImg} alt="Error" />
                    </Col>
                    <Styledh2>
                    <Col col>
                        <Styledh2>
                            <h2>An Error Occurred !</h2>
                        </Styledh2>
                    </Col>
                    </Styledh2>
                </Row>
            </StyledImage>
        </Content>
    );
};
export default errorOccuredPage;
