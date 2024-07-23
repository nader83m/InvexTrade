//@ts-nocheck
import styled, { device, themeGet } from "@doar/shared/styled";
import { Media, MediaBody } from "@doar/components";

export const StyledMedia = styled(({ ...rest }) => <Media {...rest} />)`
    height: 100%;
    align-items: stretch;
    justify-content: center;
`;

export const StyledMediaBody = styled(({ ...rest }) => <MediaBody {...rest} />)`
    display: none;
    ${device.large} {
        display: flex;
        position: relative;
        padding-left: 50px;
        padding-right: 50px;
    }
    ${device.xlarge} {
        padding-left: 60px;
        padding-right: 60px;
    }
`;

export const StyledImage = styled.div``;

export const StyledImgText = styled.div`
    font-size: 12px;
    text-align: center;
    right: 0px;
    bottom: -10px;
    position: absolute;
`;

export const StyledSignin = styled.div`
    flex-direction: column;
    ${device.large} {
        margin-right: 50px;
    }
    ${device.xlarge} {
        margin-right: 60px;
    }
`;


export const StyledMapContainer = styled.div`
    background-color : #F6FBF4;
    flex-direction: column;
    padding-right: 70px;
    padding-left: 70px;
    padding-top: 20px;
    margin: 10px;
    ${device.large} {
        margin-right: 50px;
    }
    ${device.xlarge} {
        margin-right: 60px;
    }
`;

export const StyledTitle = styled.h3`
    color: ${themeGet("colors.text")};
    margin-bottom: 5px;
`;

export const StyledTitleMin = styled.h4`
    color: ${themeGet("colors.text")};
    margin-bottom: 5px;
`;

export const StyledDesc = styled.p`
    font-size: 16px;
    color: ${themeGet("colors.text3")};
    margin-bottom: 40px;
`;

export const StyledDescItalic = styled.p`
    font-size: 14px;
    color: ${themeGet("colors.text3")};
    font-style: italic;
    margin: 0 0 0 0;
`;
