import React, {useContext, useState} from "react";
import { Row, Button, Col } from "@doar/components";
import Layout from "../../layouts";
import ContentFullWidth from "../../layouts/contentfullwidth";
import WelcomeArea from "../invex-trade/welcome-area";
import FinancialChart from "../invex-trade/financial-chart/canvas";
import { X, Delete } from "react-feather";

import {
    getValueFromLocalStorage,
    setValueToLocalStorage,
    calculateDates,
} from "../../utils";

import trendImg from "../../Images/trend_2.png";
import rayImg from "../../Images/ray_2.png";
import fiboImg from "../../Images/fib_2.png";
import extendedLineImg from "../../Images/ext_2.png";
import mobileContext from "../../mobileContext";

function DashboardInvextrade() {
    const [selectedCoin, setSelectedCoin] = useState(getDefaultCoin);
    const [selectedInterval, setSelectedInterval] = useState(
        getSelectedInterval
    );
    const [dates, setDates] = useState(getInitialDates);
    const [selectedTools, setSelectedTools] = useState(null);
    const [indicator, setIndicator] = useState(null);
    const [strategie, setStrategie] = useState(null);
    const isMobile = useContext(mobileContext);

    function getInitialDates() {
        const interval = getSelectedInterval();
        const { fromDate, toDate } = calculateDates(Object.keys(interval)[0]);
        return {
            fromDate,
            toDate,
        };
    }

    function getDefaultCoin() {
        return getValueFromLocalStorage("selectedCoin") || "BTCUSDT";
    }

    function getSelectedInterval() {
        const val = getValueFromLocalStorage("selectedInterval");
        if (val) return JSON.parse(val);
        else return { KLINE_INTERVAL_15MINUTE: "15 minutes" };
    }

    function coinChanged(coin) {
        setSelectedCoin(coin);
        setValueToLocalStorage("selectedCoin", coin);
    }

    function intervalChanged(interval) {
        setSelectedInterval(interval);
        setValueToLocalStorage("selectedInterval", JSON.stringify(interval));
    }

    function toolChanged(selection) {
        setSelectedTools(null)
        setTimeout(()=>{setSelectedTools(selection)}, 1)
    }

    function indicatorSelected(selection) {
        setIndicator(null)
        setTimeout(()=>{setIndicator(selection)}, 1)
    }

    function strategieSelected(selection) {
        setStrategie(null)
        setTimeout(()=>{setStrategie(selection)}, 1)
    }

    function handleButtonCliked(key){
        toolChanged(key)
    }

    function renderFinancialChart(){
        const Wrapper = isMobile ? Col : Row;
        const Cell = isMobile ? Row : Col;

        const renderToolBarItems = () => {
            const desktopProps = {
                mb : 10
            }
            const cellProps = {
                textAlign : "center",
                xl: 0.6,
                lg: 1,
                md: 1,
                sm: 1,
                xs: 2
            }
            const mobileStyle = isMobile ? {
                maxWidth: 40,
                maxHeight: 40,
                marginRight: 10,
                marginTop: 15
            } : {}
            return(<Cell {...cellProps}>
                <br></br>
                <Button style={mobileStyle} {...desktopProps} onClick={()=>{handleButtonCliked('LINE')}}  color = "white" size="s" iconButton  >
                    <img src = {trendImg}></img>
                </Button>

                <Button style={mobileStyle} {...desktopProps} onClick={()=>{handleButtonCliked('XLINE')}} color = "white" size="s" iconButton  >
                    <img src = {extendedLineImg}></img>
                </Button>

                <Button style={mobileStyle} {...desktopProps} onClick={()=>{handleButtonCliked('RAY')}} color = "white" size="s" iconButton  >
                    <img src = {rayImg}></img>
                </Button>

                <Button style={mobileStyle} {...desktopProps} onClick={()=>{handleButtonCliked('FIBO')}} color = "white" size="s" iconButton  >
                    <img src = {fiboImg}></img>
                </Button>

                <Button style={mobileStyle} {...desktopProps} onClick={()=>{handleButtonCliked('REMOVELAST')}} color = "white" size="s" iconButton  >
                    <Delete color={"black"} strokeWidth={1}/>
                </Button>

                <Button style={mobileStyle} {...desktopProps} onClick={()=>{handleButtonCliked('CLEAN')}} color = "white" size="s" iconButton  >
                    <X color={"red"} strokeWidth={1}/>
                </Button>
            </Cell>)
        }

        const renderChart = () => {
            return(<Cell xl={11.4} lg = {11} md = {11} sm = {11} xs = {10}>
                <FinancialChart
                    selectedCoin={selectedCoin}
                    selectedInterval={selectedInterval}
                    dates={dates}
                    selectedTools={selectedTools}
                    indicator={indicator}
                    strategie={strategie}
                />
            </Cell>)
        }

        return(<Wrapper>
            {
                isMobile ? (
                    <>
                        {renderChart()}
                        {renderToolBarItems()}
                    </>
                ) :  <>
                    {renderToolBarItems()}
                    {renderChart()}
                </>
            }
        </Wrapper>)
    }

    return (
        <Layout hideFooter>
            <ContentFullWidth fullHeight fluid>
                <WelcomeArea
                    coinChanged={coinChanged}
                    selectedCoin={selectedCoin}
                    selectedInterval={selectedInterval}
                    intervalChanged={intervalChanged}
                    dates={dates}
                    setDates={setDates}
                    toolChanged={toolChanged}
                    indicatorSelected={indicatorSelected}
                    strategieSelected={strategieSelected}
                />
                {renderFinancialChart()}
            </ContentFullWidth>
        </Layout>
    );
}

export default DashboardInvextrade;
