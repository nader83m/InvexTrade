/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useState, useEffect, useRef } from "react";
import { X } from "react-feather";
import { Modal, ModalBody, ModalFooter, Button, Input } from "@doar/components";
import {
    StyledTitle,
    StyledClose,
    StyledGroup,
    StyledListGroup,
    StyledSpinner,
} from "./style";
import { ListGroup, ListGroupItem, Spinner } from "@doar/components";
import { getExchanceCoinsList } from "../../../utils";

const ModalSelectCoin = ({
    show,
    onClose = () => {},
    selected = "",
    onSelectedChange = () => {},
}) => {
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [coins, setCoins] = useState([]);
    const [selectedSymbol, setSelectedSymbol] = useState(selected);
    const symbolList = useRef(null);

    const savePressed = () => {
        onSelectedChange(selectedSymbol);
        onClose();
        setSearchText("");
    };

    useEffect(() => {
        async function getData() {
            setLoading(true);
            const response = await getExchanceCoinsList();
            if(response?.data){
                symbolList.current = response.data;
                setCoins(response.data);
                setLoading(false);
            }
        }
        getData();
    }, []);

    useEffect(() => {
        if (searchText === "") setCoins(symbolList.current);
    }, [searchText]);

    function renderItem(element) {
        let isActive = false;
        if (element.symbol === selectedSymbol) isActive = true;
        return (
            <ListGroupItem
                active={isActive}
                key={element.symbol}
                onClick={() => setSelectedSymbol(element.symbol)}
            >
                {element.symbol}
            </ListGroupItem>
        );
    }

    function renderListGroup() {
        return (
            <ListGroup>{coins?.map((element) => renderItem(element))}</ListGroup>
        );
    }

    function modalClose() {
        setSelectedSymbol(selected);
        onClose();
        setSearchText("");
    }

    function handleSearch(val) {
        if (val !== "") {
            const filteredArr = symbolList.current.filter((item) =>
                item.symbol.toUpperCase().includes(val.toUpperCase())
            );
            setCoins(filteredArr);
        }
    }

    return (
        <Modal show={show} onClose={modalClose}>
            <ModalBody p={["20px", "30px"]}>
                <StyledTitle>{selectedSymbol || "Select"}</StyledTitle>
                <StyledClose onClose={modalClose}>
                    <X />
                </StyledClose>

                <StyledGroup>
                    <Input
                        id="selectSymbol"
                        name="selectSymbol"
                        placeholder="Search"
                        value={searchText}
                        onChange={(e) => {
                            handleSearch(e.target.value);
                            setSearchText(e.target.value);
                        }}
                    />
                </StyledGroup>

                <StyledListGroup>
                    {loading ? (
                        <StyledSpinner>
                            <Spinner color="info" />
                        </StyledSpinner>
                    ) : (
                        renderListGroup()
                    )}
                </StyledListGroup>
            </ModalBody>
            <ModalFooter>
                <Button color="success" onClick={savePressed} mr="5px">
                    Save
                </Button>
                <Button color="danger" onClick={modalClose}>
                    Close
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default ModalSelectCoin;
