//@ts-nocheck
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import ThemeProvider from "./redux/providers/theme-provider";
import PersistProvider from "./redux/providers/persist-provider";
import { store } from "./redux/store";
import App from "./AppDebug";
import MobileContext,{isMobileCheck} from "./mobileContext";

ReactDOM.render(
    <Provider store={store}>
        <PersistProvider>
            <ThemeProvider>
                <MobileContext.Provider value={isMobileCheck}>
                    <App />
                </MobileContext.Provider>
            </ThemeProvider>
        </PersistProvider>
    </Provider>,
    document.getElementById("root")
);
