//@ts-nocheck
/* eslint-disable @typescript-eslint/restrict-template-expressions */
// @ts-nocheck
import { FC, useState } from "react";
import { X, Trash } from "react-feather";
import {
    Modal,
    ModalBody,
    ModalFooter,
    Button,
    Row,
    Col,
} from "@doar/components";
import { StyledTitle, StyledClose, StyledGroup, StyledLabel } from "./style";
import DatePicker from "../../date-picker";
import TimePicker from "../../time-picker";
import { setEnfSettings, reset } from "../../../redux/slices/enf_settings";
import { dispatchDirectly } from "../../../redux/store";
import { useAppSelector } from "../../../redux/hooks";
import { indicatorDefaults } from "../../../constants";

interface IProps {
    show: boolean;
    title: string;
    onClose: () => void;
}

const ModalIndicatorSettings: FC<IProps> = ({ show, onClose, title, indicator }) => {

    const strokeButtons = [1, 2, 3, 4, 5]
    const colorButtons = [1, 2]

    const enfStates = useAppSelector((state) => state.enfSettings);

    const [color, setColor] = useState({ color1: enfStates?.[indicator]?.color1 || "#000000", color2: enfStates?.[indicator]?.color2 || "#000000" })
    const [stroke, setStroke] = useState(enfStates?.[indicator]?.stroke || 5)

    function handleColorChange(e, item) {
        setColor((prevState => ({ ...prevState, [`color${item}`]: e.target.value })))
    }

    function handleStrokeChange(number) {
        setStroke(number)
    }

    function saveCliked() {
        const _state = {
            'stroke': stroke,
            'color1': color.color1,
            'color2': color.color2,
        }
        dispatchDirectly(setEnfSettings({ indicator: indicator, value: _state }))
        onClose()
    }

    function defaultBtnCliked() {
        setColor({ 
            color1: indicatorDefaults[indicator]?.color1 || "#000000", 
            color2: indicatorDefaults[indicator]?.color2 || "#000000"
        })
        setStroke(indicatorDefaults[indicator]?.stroke || 5)
        //dispatchDirectly(reset())
    }

    const renderColor = (item) => (
        <div
            style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                margin: 15,
            }}
        >
            <div style={{ justifyContent: "center", width: 70 }}><p>{`Color ${item}`}</p></div>
            <div style={{ width: 10 }}></div>
            <input style={{ width: 200, height: 30 }} type="color" value={color[`color${item}`]} onChange={(e) => { handleColorChange(e, item) }}></input>
        </div>
    )

    const renderButton = (key, number) => {
        return (
            <Button
                color="dark"
                active={stroke === number}
                key={key}
                style={{ height: 35, marginRight: 5 }}
                variant="outlined"
                onClick={() => { handleStrokeChange(number) }}>{number}
            </Button>
        )
    }

    const renderStroke = () => (
        <div
            style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                margin: 15,
            }}
        >
            <div style={{ justifyContent: "center", width: 70 }}><p>Stroke</p></div>
            <div style={{ width: 10 }}></div>
            {strokeButtons.map((el, index) => renderButton(index, el))}
        </div>
    )

    return (
        <Modal show={show} >
            <ModalBody p={["20px", "30px"]}>
                <StyledTitle>{`${title} Settings`}</StyledTitle>
                {colorButtons.map(item => renderColor(item))}
                {renderStroke()}
                <ModalFooter>
                    <Button onClick={defaultBtnCliked} color="dark" mr="5px">
                        <Trash size={20} />
                    </Button>
                    <Button color="success" onClick={saveCliked} mr="5px">
                        Save
                    </Button>
                    <Button color="danger" onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
                <StyledClose >
                    <X onClick={onClose} />
                </StyledClose>
            </ModalBody>
        </Modal>
    );
};

export default ModalIndicatorSettings;
