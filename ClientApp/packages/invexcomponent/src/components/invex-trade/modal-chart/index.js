import React from "react";
import {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalClose,
    ModalBody,
    ModalFooter,
    Button,
    Spinner,
} from "@doar/components";

export default function ChartModal(props) {
    return (
        <Modal show={props.show} size="sm">
            {props.isLoadingIco !== true ? (
                <>
                    <ModalHeader>
                        <ModalTitle>Warning !</ModalTitle>
                        <ModalClose onClick={props.clickHandler}>x</ModalClose>
                    </ModalHeader>
                    <ModalBody>
                        <p>{props.msg}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={props.clickHandler} color="secondary">
                            Close
                        </Button>
                    </ModalFooter>
                </>
            ) : (
                <div
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        display: "flex",
                        margin: "20px",
                    }}
                >
                    <Spinner variant="grow" color="info" />
                    <p>Loading...</p>
                </div>
            )}
        </Modal>
    );
}
