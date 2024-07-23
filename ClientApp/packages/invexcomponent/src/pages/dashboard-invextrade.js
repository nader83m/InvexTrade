import React, { useEffect, useRef, useState } from "react";
import { Row, Button, Col } from "@doar/components";
import { CryptoFontCSS } from "@doar/shared/css";
import Layout from "../layouts";
import ContentFullWidth from "../layouts/contentfullwidth";
import WelcomeArea from "../components/invex-trade/welcome-area";
import SEO from "../components/seo";
import FinancialChart from "../components/invex-trade/financial-chart/canvas";
import Chart from "../components/invex-trade/Chart";
import {
    getValueFromLocalStorage,
    setValueToLocalStorage,
    calculateDates,
} from "../utils";

import trendImg from "../../src/Images/trend_2.png";
import rayImg from "../../src/Images/ray_2.png";
import fiboImg from "../../src/Images/fib_2.png";
import extendedLineImg from "../../src/Images/ext_2.png";

function DashboardInvextrade() {
    const [selectedCoin, setSelectedCoin] = useState(getDefaultCoin);
    const [selectedInterval, setSelectedInterval] = useState(
        getSelectedInterval
    );
    const [dates, setDates] = useState(getInitialDates);
    const [selectedTools, setSelectedTools] = useState(null);
    const [indicator, setIndicator] = useState(null);

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

    function handleButtonCliked(key){
        toolChanged(key)
    }

    return (
        <Layout hideFooter>
            <SEO />
            <CryptoFontCSS />
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
                />
                <Row>
                    <Col textAlign = "center" xl={0.6} lg = {1} md = {1} sm = {1} xs = {2}>

                        <br></br>

                        <Button onClick={()=>{handleButtonCliked('LINE')}} mb = {10} color = "white" size="s" iconButton  >
                            
                            <img width = {"100%"} src = {trendImg}></img>
                        </Button>

                        <Button onClick={()=>{handleButtonCliked('XLINE')}} mb = {10} color = "white" size="s" iconButton  >
                            
                            <img src = {extendedLineImg}></img>
                        </Button>

                        <Button onClick={()=>{handleButtonCliked('RAY')}} mb = {10} color = "white" size="s" iconButton  >
                            
                            <img src = {rayImg}></img>
                        </Button>

                        <Button onClick={()=>{handleButtonCliked('FIBO')}} mb = {10} color = "white" size="s" iconButton  >
                            
                            <img src = {fiboImg}></img>
                        </Button>

                        {/* <Button mb = {10} color = "white" size="s" iconButton  >
                            
                            <img src = "https://picsum.photos/200/300"></img>
                        </Button> */}
                    </Col>
                    <Col xl={11.4} lg = {11} md = {11} sm = {11} xs = {10}>
                        {/* <Chart
                            selectedCoin={selectedCoin}
                            selectedInterval={selectedInterval}
                            dates={dates}
                            selectedTools={selectedTools}
                            indicator={indicator}
                        /> */}
                        <FinancialChart 
                            selectedCoin={selectedCoin}
                            selectedInterval={selectedInterval}
                            dates={dates}
                            selectedTools={selectedTools}
                            indicator={indicator}
                        />
                    </Col>
                </Row>
            </ContentFullWidth>
        </Layout>
    );
}

export default DashboardInvextrade;
