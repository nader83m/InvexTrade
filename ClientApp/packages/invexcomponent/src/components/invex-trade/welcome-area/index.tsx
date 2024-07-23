//@ts-nocheck
// @ts-nocheck
import {FC, useContext, useEffect, useState} from "react";
import { Repeat, Clock, Calendar, Tool, BarChart, BarChart2, Settings } from "react-feather";
import Breadcrumb from "../../../components/breadcrumb";
import { Dropdown, DropdownMenu, Button, DropdownToggle, Container, Row, Col } from "@doar/components"
import {
    StyledWelcomeArea,
    StyledWelcomeLeft,
    StyledWelcomeRight,
    StyledButton,
    StyledDropDown
} from "./style";
import ModalSelectCoin from "../modal-select-coin"
import ModalSelectDate from "../modal-select-date"
import {getIntervalsList, indicatorDefaults, strategiesDefaults} from "../../../constants";
import ModalIndicatorSettings from "../modal-indicator-settings";
import MobileContext from "../../../mobileContext";

const WelcomeArea: FC = (props) => {
    const {
        selectedCoin,
        coinChanged: setSelectedCoin,
        selectedInterval,
        intervalChanged,
        dates,
        setDates,
        toolChanged,
        indicatorSelected,
        strategieSelected,
    } = props;

    const toolItems = [
        { 'LINE': 'Trend Line' },
        { 'XLINE': 'Extended Line' },
        { 'RAY': 'Ray' },
        { 'FIBO': 'Fibonacci Retracement' },
        { 'CLEAN': 'Clean Lines' }
    ]

    const indicatorItems = [
        ...Object.keys(indicatorDefaults).map(key => ({[indicatorDefaults[key].name] : [indicatorDefaults[key].text]})),
        { 'CLEAN': 'Clean Indicators' }
    ]

    const strategiesItems = [
        ...Object.entries(strategiesDefaults).map(([key, value])=>({[key] : value.text}))
    ]

    const [showModal, setShowModal] = useState(false);
    const [showDate, setShowDate] = useState(false);
    const [indicatorModal, setIndicatorModal] = useState({
        show: false,
        title: "",
        indicator: "",
    });
    const [intervals, setIntervals] = useState([])
    const [showDropDownSymbol, setShowDropdownSymbol] = useState(false)
    const [showDropDownTool, setShowDropdownTool] = useState(false)
    const [showDropDownIndicators, setShowDropdownIndicators] = useState(false)
    const [showDropDownStrategies, setShowDropdownStrategies] = useState(false)
    const isMobile = useContext(MobileContext);


    useEffect(() => {
        async function getIntervals() {
            const intervalArr = getIntervalsList()
            setIntervals(intervalArr)
        }
        getIntervals()
    }, [])

    const showHideModal = () => {
        setShowModal(prevState => !prevState)
    }

    const showHideDateModal = () => {
        setShowDate(prevState => !prevState)
    }

    function onSelectedChange(coin) {
        setSelectedCoin(coin)
    }

    function renderDropDownSymbol() {
        const intervalText = selectedInterval?.[Object.keys(selectedInterval)[0]] || ""
        return (
            <Dropdown>
                <DropdownToggle variant="texted"><StyledButton onClick={() => { setShowDropdownSymbol(true) }} hasIcon size="sm">
                    <Clock />
                    {`${!isMobile ? intervalText : intervalText.substring(0,4)}`}</StyledButton></DropdownToggle>
                {
                    showDropDownSymbol && <DropdownMenu show={showDropDownSymbol}>
                        {
                            intervals.map(el => {
                                const key = Object.keys(el)[0]
                                return (
                                    <Button key={key} variant="texted" color="light" fullwidth m="5px" onClick={() => {
                                        intervalChanged(el)
                                        setShowDropdownSymbol(false)
                                    }}>
                                        {el[key]}
                                    </Button>
                                )
                            })
                        }
                    </DropdownMenu>
                }
            </Dropdown>
        )
    }

    function renderDropDownTools() {
        return (<Dropdown>
            <DropdownToggle variant="texted"><StyledButton onClick={() => { setShowDropdownTool(true) }} hasIcon size="sm">
                <Tool />
                {`${!isMobile ? "Tools" : 'T'}`}</StyledButton></DropdownToggle>
            {
                showDropDownTool && <DropdownMenu show={showDropDownTool}>
                    {
                        toolItems.map(el => {
                            const key = Object.keys(el)[0]
                            return (
                                <Button key={key} variant="texted" color="light" fullwidth onClick={() => {
                                    toolChanged(key)
                                    setShowDropdownTool(false)
                                }}>
                                    {el[key]}
                                </Button>
                            )
                        })
                    }
                </DropdownMenu>
            }
        </Dropdown>)
    }

    function renderDropDownIndicators() {
        return (<Dropdown>
            <DropdownToggle variant="texted"><StyledButton onClick={() => { setShowDropdownIndicators(true) }} hasIcon size="sm">
                <BarChart />
                {`${!isMobile ? "Indicators" : 'I'}`}</StyledButton></DropdownToggle>
            {
                showDropDownIndicators && <DropdownMenu show={showDropDownIndicators}>
                    {
                        indicatorItems.map(el => {
                            const key = Object.keys(el)[0]
                            return (
                                <div key = {key}
                                    style={{
                                        flex: 1,
                                        display: "flex",
                                        alignItems: "center"
                                    }}>
                                    <Button key={key} variant="texted" color="light" fullwidth onClick={() => {
                                        indicatorSelected(key)
                                        setShowDropdownIndicators(false)
                                    }}>
                                        {el[key]}
                                    </Button>
                                    <div style={{ width: 10 }}></div>
                                    {key !== 'CLEAN' && <div style={{
                                        display: "flex",
                                        alignItems: "center"
                                    }}><Settings onClick={() => { setIndicatorModal({ show: true, title: el[key], indicator : key }) }} size={16} /></div>}
                                </div>)
                        })
                    }
                </DropdownMenu>
            }
        </Dropdown>)
    }

    function renderDropDownStrategies() {
        return (<Dropdown>
            <DropdownToggle variant="texted"><StyledButton onClick={() => { setShowDropdownStrategies(true) }} hasIcon size="sm">
                <BarChart2 />
                {`${!isMobile ? "Strategies" : 'S'}`}</StyledButton></DropdownToggle>
            {
                showDropDownStrategies && <DropdownMenu show={showDropDownStrategies}>
                    {
                        strategiesItems.map(el => {
                            const key = Object.keys(el)[0]
                            return (
                                <div key = {key}
                                     style={{
                                         flex: 1,
                                         display: "flex",
                                         alignItems: "center"
                                     }}>
                                    <Button key={key} variant="texted" color="light" fullwidth onClick={() => {
                                        strategieSelected(key)
                                        setShowDropdownStrategies(false)
                                    }}>
                                        {el[key]}
                                    </Button>
                                    {/*<div style={{ width: 10 }}></div>*/}
                                    {/*{key !== 'CLEAN' && <div style={{*/}
                                    {/*display: "flex",*/}
                                    {/*alignItems: "center"*/}
                                    {/*}}><Settings onClick={() => { setIndicatorModal({ show: true, title: el[key], indicator : key }) }} size={16} /></div>}*/}
                                </div>)
                        })
                    }
                </DropdownMenu>
            }
        </Dropdown>)
    }

    return (
        <StyledWelcomeArea>
            {!isMobile && <StyledWelcomeLeft>
                <Breadcrumb
                    prev={[{text: "Dashboard", link: "/"}]}
                    title="Chart"
                    wcText="Welcome"
                />
            </StyledWelcomeLeft>}
            <StyledWelcomeRight>

                <StyledDropDown variant="texted" size="sm" mt="10px" mr="5px">
                    {renderDropDownStrategies()}
                </StyledDropDown>

                <StyledDropDown variant="texted" size="sm" mt="10px" mr="5px">
                    {renderDropDownIndicators()}
                </StyledDropDown>

                <StyledDropDown variant="texted" size="sm" mt="10px" mr="5px">
                    {renderDropDownTools()}
                </StyledDropDown>

                <StyledButton
                    size="sm" hasIcon mt="10px" mr="5px"
                    onClick={showHideModal}
                >
                    <Repeat />
                    {`${!isMobile ? selectedCoin : selectedCoin.substring(0,4)}`}
                </StyledButton>

                <StyledDropDown variant="texted" size="sm" mt="10px" mr="5px">
                    {renderDropDownSymbol()}
                </StyledDropDown>

                <StyledButton
                    size="sm" hasIcon mt="10px" mr="5px" color="white" onClick={showHideDateModal}
                >
                    <Calendar />
                    {`${!isMobile ? "Select date" : 'D'}`}
                </StyledButton>

            </StyledWelcomeRight>
            <ModalSelectCoin
                show={showModal}
                onClose={showHideModal}
                selected={selectedCoin}
                onSelectedChange={onSelectedChange}
            />
            <ModalSelectDate
                show={showDate}
                onClose={showHideDateModal}
                dates={dates}
                datesChanged={(dates) => {
                    setDates(dates)
                }}
            />
            {indicatorModal?.show && <ModalIndicatorSettings
                {...indicatorModal}
                onClose = {() => {setIndicatorModal((prevState) => ({...prevState, show : false}))}}
            />}
        </StyledWelcomeArea>
    );
};

export default WelcomeArea;
