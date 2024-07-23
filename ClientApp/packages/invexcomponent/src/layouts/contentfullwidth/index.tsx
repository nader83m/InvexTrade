//@ts-nocheck
import React from "react";
import { SpaceProps, BorderProps } from "@doar/shared/styled";
import { Container } from "@doar/components";
import { StyledContent } from "./style";

interface IProps extends SpaceProps, BorderProps {
    className?: string;
    fullHeight?: boolean;
    align?: "top" | "center" | "bottom";
}

const ContentFullWidth: React.FC<IProps> = ({
    children,
    className,
    fullHeight,
    align,
    ...restProps
}) => {
    return (
        <StyledContent
            $fullHeight={fullHeight}
            $align={align}
            className={className}
            {...restProps}
        >
            <Container className="container" fluid pl="0" pr="0" ml="10" mr="10">
                {children}
            </Container>
        </StyledContent>
    );
};

export default ContentFullWidth;
