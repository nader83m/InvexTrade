//@ts-nocheck
import styled, { device, SpaceProps } from "@doar/shared/styled";
import { Button } from "@doar/components";

export const StyledSpinner = styled(({ ...rest }) => (
    <div {...rest} />
))<SpaceProps>`
    height: 70vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;