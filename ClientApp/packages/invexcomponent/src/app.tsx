//@ts-nocheck
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Preloader from "./components/preloader";

const InvexComponent = lazy(() => import("./components/invexcomponent/invexchart"));

import InvexComponentImmediate from "./components/invexcomponent/invexchart";

const App: React.FC = () => {
    return (
        <>
            <Router>
                <Suspense fallback={<Preloader />}>
                    <Routes>
                        <Route
                            path="/"
                            element={<InvexComponent />}
                        />
                    </Routes>
                </Suspense>
            </Router>
        </>
    );
};

export default App;
export {InvexComponentImmediate};
