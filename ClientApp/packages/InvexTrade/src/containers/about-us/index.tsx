//@ts-nocheck
import { FC } from "react";
import {
    StyledWrap,
    StyledTitle,
    StyledDesc,
    Styledh3,
    StyledImg
} from "./style";
import InvexLogo from "../../Images/Invexlogo.jpeg";
import Btc from "../../Images/btc.jpg";
import Graph from "../../Images/graph.jpg";

const AboutUsContainer: FC = () => {
    return (
        <StyledWrap>
            <StyledTitle>About Us</StyledTitle>
            <br></br>
            <StyledDesc>
                A good technical analyst of a stock or a commodity can make a lot of money for himself, but a good technical analyst of a cryptocurrency can shoot to fame and fortune in a very short time.
            </StyledDesc>
            <StyledDesc>
                Bitcoin is one such well-known cryptocurrency. To invest in it, you need to understand the technical analysis behind Bitcoin. After all, without technical analysis, trading cryptocurrencies becomes a dangerous guessing game!
            </StyledDesc>
            <StyledDesc>
                This blog is a bit technical, but it is meant to help beginners understand the basics of Bitcoin and how technical analysis can help them make informed investment decisions. If you want to be a successful investor in cryptocurrencies, then this blog is a great starting point.
            </StyledDesc>
            <br></br>
            <StyledImg>
                <img width = "40%" src={Btc} />
            </StyledImg>
            <Styledh3>
                Why Should Beginners Begin with Bitcoin?
            </Styledh3>
            <br></br>
            <StyledDesc>
                If you are new to the world of blockchain and cryptocurrency, it can get overwhelming to filter out reliable cryptocurrencies from unreliable ones.
            </StyledDesc>
            <StyledDesc>
                Several cryptocurrencies, popularly dubbed “meme coins”, like Dogecoin, Shiba Inu and Poocoin, have popped up in recent times and have cost rookie investors a large chunk of their investments.
            </StyledDesc>
            <StyledDesc>
                On the other hand, Bitcoin is a much safer (if not the safest) cryptocurrency to invest in. It is the first deflationary crypto token to come into existence and has recently reached an all-time high (ATH) of over USD 65,000 per Bitcoin! Here are some more reasons to trust Bitcoin:
            </StyledDesc>
            <ul>
                <p>1. Most decentralised cryptocurrency</p>
            </ul>
            <ul>
                <p>2. Deflationary token</p>
            </ul>
            <ul>
                <p>3. Publically available whitepaper</p>
            </ul>
            <ul>
                <p>4. Proof of Work (PoW) mechanism</p>
            </ul>
            <ul>
                <p>5. Crystal clear tokenomics</p>
            </ul>
            <br></br>
            <br></br>

            <StyledImg>
                <img width = "40%" src={Graph} />
            </StyledImg>
            <br></br>
            <Styledh3>
                Technical Analysis: An Overview
            </Styledh3>
            <br></br>
            <StyledDesc>
                On the broader spectrum of things, there are two kinds of Bitcoin investors:
            </StyledDesc>
            <ul>
                <p>1. HODLers – People who buy Bitcoin with no intention to sell for several years.</p>
            </ul>
            <ul>
                <p>2. Traders – People who buy Bitcoin intending to sell it quickly at a profit. If you want to grow your money faster than traditional methods by investing in Bitcoin, honing your technical analysis skills is critical. </p>
            </ul>
            <br></br>
            <StyledDesc>
                Technical analysis uses the concept of price patterns from the past and technical indicators to analyse the charts and predict the future movements in price. This can be applied to any market, including cryptocurrencies such as Bitcoin (BTC).
            </StyledDesc>
            <StyledDesc>
                When done right, technical analysis helps you accurately predict the lows and highs of Bitcoin prices over different time periods. Such predictions will help you make educated and data-driven decisions on buying Bitcoin at a good price and selling at a profit.
            </StyledDesc>
            <br></br>
            <br></br>
            <StyledImg>
                <img width = "40%" src={InvexLogo} />
            </StyledImg>
        </StyledWrap>
    );
};

export default AboutUsContainer;
