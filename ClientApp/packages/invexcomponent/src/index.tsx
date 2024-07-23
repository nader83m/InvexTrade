//@ts-nocheck
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import ThemeProvider from "./redux/providers/theme-provider";
import PersistProvider from "./redux/providers/persist-provider";
import { store } from "./redux/store";
import App, {InvexComponentImmediate as Component} from './app';
import MobileContext, {isMobileCheck} from "./mobileContext";

const wrapper = () => (
    <Provider store={store}>
        <PersistProvider>
            <ThemeProvider>
                <MobileContext.Provider value={isMobileCheck}>
                    <App />
                </MobileContext.Provider>
            </ThemeProvider>
        </PersistProvider>
    </Provider>
);

const InvexComponentImmediate = () => (
    <Provider store={store}>
    <PersistProvider>
        <MobileContext.Provider value={isMobileCheck}>
            <Component />
        </MobileContext.Provider>
    </PersistProvider>
</Provider>
)

export default wrapper
export {
    InvexComponentImmediate
}
