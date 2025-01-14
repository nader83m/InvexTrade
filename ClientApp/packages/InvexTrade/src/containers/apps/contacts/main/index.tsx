//@ts-nocheck
import { FC, useState, useEffect } from "react";
import { MoreHorizontal } from "react-feather";
import {
    TabWrap,
    TabList,
    Tab,
    TabContent,
    TabPanel,
    Text,
} from "@doar/components";
import { useWindowSize } from "@doar/shared/hooks";
import { useAppSelector, useAppDispatch } from "../../../../redux/hooks";
import { toggleSidebar } from "../../../../redux/slices/ui";
import PersonalDetails from "../../../../components/apps/contacts/personal-details";
import CallLogs from "../../../../components/apps/contacts/call-logs";
import Scrollbar from "../../../../components/scrollbar";
import RightSidebar from "../../../../components/apps/contacts/right-sidebar";
import {
    StyledMain,
    StyledBody,
    StyledSidebar,
    StyledOptionsBtn,
} from "./style";

interface IProps {
    layout?: 1 | 2;
}

const Wrapper: FC<IProps> = ({ layout }) => {
    const { sidebar } = useAppSelector((state) => state.ui);
    const dispatch = useAppDispatch();
    const { width } = useWindowSize();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarHandler = () => {
        setSidebarOpen((prev) => !prev);
        if (width && width > 992 && width < 1199.98) {
            dispatch(toggleSidebar({ isOpen: undefined }));
        }
    };
    useEffect(() => {
        if (!sidebar) {
            setSidebarOpen(false);
        }
    }, [sidebar]);

    return (
        <StyledMain
            className="main-content"
            $showSidebar={!sidebar}
            $rightSidebar={sidebarOpen}
        >
            <StyledBody $layout={layout}>
                <TabWrap variation="line">
                    <TabList>
                        <Tab>
                            Contact Info
                            <Text as="span" display={["none", "inline"]}>
                                rmation
                            </Text>
                        </Tab>
                        <Tab>
                            <Text
                                as="span"
                                display={["none", "inline"]}
                                pr="3px"
                            >
                                Call &amp; Message
                            </Text>
                            Logs
                        </Tab>
                        <StyledOptionsBtn
                            onClick={sidebarHandler}
                            $layout={layout}
                        >
                            <MoreHorizontal />
                        </StyledOptionsBtn>
                    </TabList>
                    <TabContent>
                        <Scrollbar top="0">
                            <TabPanel>
                                <PersonalDetails />
                            </TabPanel>
                            <TabPanel>
                                <CallLogs />
                            </TabPanel>
                        </Scrollbar>
                    </TabContent>
                </TabWrap>
            </StyledBody>
            <StyledSidebar $layout={layout} $show={sidebarOpen}>
                <Scrollbar top="0">
                    <RightSidebar onClose={sidebarHandler} />
                </Scrollbar>
            </StyledSidebar>
        </StyledMain>
    );
};

Wrapper.defaultProps = {
    layout: 1,
};

export default Wrapper;
