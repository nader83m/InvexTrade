//@ts-nocheck
import styled, { device, themeGet } from "@doar/shared/styled";

export const StyledWrap = styled.div`
    height: 100%;
    flex-direction: column;
    display: flex;
    margin-left: auto;
    margin-right: auto;
    text-align: justify;
`;

export const StyledImg = styled.div`
    margin-bottom: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const StyledTitle = styled.h1`
    font-size: 24px;
    ${device.small} {
        font-size: 32px;
    }
    ${device.large} {
        font-size: 36px;
    }
    ${device.xlarge} {
        margin-bottom: 5px;
    }
`;

export const Styledh3 = styled.h3`
`;

export const StyledSubTitle = styled.h5`
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 20px;
    ${device.small} {
        font-size: 18px;
    }
    ${device.large} {
        font-size: 20px;
    }
`;

export const StyledDesc = styled.p`
    color: ${themeGet("colors.text1")};
    margin-bottom: 15px;
`;

export const StyledResetForm = styled.div`
    margin-bottom: 40px;
    display: flex;
`;

export const StyledNote = styled.span`
    color: ${themeGet("colors.text3")};
    font-size: 12px;
`;
