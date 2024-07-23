//@ts-nocheck
/* eslint-disable @typescript-eslint/restrict-template-expressions */
// @ts-nocheck
import { FC, useState } from "react";
import { X } from "react-feather";
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

interface IProps {
    show: boolean;
    onClose: () => void;
    datesChanged: () => {}
}

const ModalSelectDate: FC<IProps> = ({ show, onClose, dates, datesChanged }) => {
    const { dfromDate, dfromDateTime, dtoDate, dtoDateTime } = getInitialDates(dates)

    const [fromDate, setFromDate] = useState(dfromDate)
    const [fromDateTime, setFromDateTime] = useState(dfromDateTime)

    const [toDate, setToDate] = useState(dtoDate)
    const [toDateTime, setToDateTime] = useState(dtoDateTime)

    function getInitialDates(dates) {
        let dfromDate, dfromDateTime, dtoDate, dtoDateTime
        dfromDate = dates.fromDate
        dfromDateTime = dfromDate.getHours() + ':' + dfromDate.getMinutes()
        dtoDate = dates.toDate
        dtoDateTime = dtoDate.getHours() + ':' + dtoDate.getMinutes()
        return { dfromDate, dfromDateTime, dtoDate, dtoDateTime }
    }

    function fromDateChanged(val) {
        setFromDate(new Date(val))
    }

    function toDateChanged(val) {
        setToDate(new Date(val))
    }

    function fromDateTimeChanged(val) {
        setFromDateTime(val)
    }

    function toDateTimeChanged(val) {
        setToDateTime(val)
    }

    function saveCliked() {
        const offset1 = fromDate.getTimezoneOffset()
        const offset2 = toDate.getTimezoneOffset()
        const tempDate1 = new Date(fromDate.getTime() - (offset1 * 60 * 1000))
        const tempDate2 = new Date(toDate.getTime() - (offset2 * 60 * 1000))

        const date1 = tempDate1.toISOString().split('T')[0]
        const time1 = fromDateTime + ":00"
        const date2 = tempDate2.toISOString().split('T')[0]
        const time2 = toDateTime + ":00"

        datesChanged({
            fromDate: new Date(date1 + ' ' + time1),
            toDate: new Date(date2 + ' ' + time2)
        })
        onClose()
    }

    function closeCliked() {
        onClose()
        const { dfromDate, dfromDateTime, dtoDate, dtoDateTime } = getInitialDates(dates)
        setFromDate(dfromDate)
        setFromDateTime(dfromDateTime)
        setToDate(dtoDate)
        setToDateTime(dtoDateTime)
    }

    return (
        <Modal show={show} onClose={closeCliked}>
            <ModalBody p={["20px", "30px"]}>
                <StyledTitle>Select Date</StyledTitle>
                <StyledClose onClose={closeCliked}>
                    <X />
                </StyledClose>
                <form className="create-event-form">
                    <StyledGroup>
                        <StyledLabel htmlFor="createStartDate">
                            From Date
                        </StyledLabel>
                        <Row gutters={10}>
                            <Col col={7}>
                                <DatePicker
                                    id="createStartDate"
                                    name="createStartDate"
                                    placeholder="Select Date"
                                    getDate={(name, date) => fromDateChanged(date)}
                                    currentDate={fromDate}
                                />
                            </Col>
                            <Col col={5}>
                                <TimePicker
                                    id="createStartTime"
                                    name="createStartTime"
                                    value={fromDateTime}
                                    onChange={(e) => fromDateTimeChanged(e.target.value)}
                                />
                            </Col>
                        </Row>
                    </StyledGroup>
                    <StyledGroup>
                        <StyledLabel htmlFor="createStartDate">
                            To Date
                        </StyledLabel>
                        <Row gutters={10}>
                            <Col col={7}>
                                <DatePicker
                                    id="createStartDate"
                                    name="createStartDate"
                                    placeholder="Select Date"
                                    getDate={(name, date) => toDateChanged(date)}
                                    currentDate={toDate}
                                />
                            </Col>
                            <Col col={5}>
                                <TimePicker
                                    id="createStartTime"
                                    name="createStartTime"
                                    value={toDateTime}
                                    onChange={(e) => toDateTimeChanged(e.target.value)}
                                />
                            </Col>
                        </Row>
                    </StyledGroup>
                </form>
            </ModalBody>
            <ModalFooter>
                <Button color="success" onClick={saveCliked} mr="5px">
                    Save
                </Button>
                <Button color="danger" onClick={closeCliked}>
                    Close
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default ModalSelectDate;
