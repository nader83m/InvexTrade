//@ts-nocheck
// Debug modda hızlı çalışmak amacıyla rota tanımları yorum satırına alındı
// @ts-nocheck
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Preloader from "./components/preloader";
import history from './history';

// Classic Pages

const DashboardInvextrade = lazy(() => import("./pages/dashboard-invextrade"));
const SignIn = lazy(() => import("./pages/signin"));
const SignUp = lazy(() => import("./pages/signup"));
//const VerifyAccount = lazy(() => import("./pages/verify-account"));
//const ForgotPassword = lazy(() => import("./pages/forgot-password"));
const ErrorNotFound = lazy(() => import("./pages/error-404"));
const Error500 = lazy(() => import("./pages/error-500"));
const Error503 = lazy(() => import("./pages/error-503"));
const Error505 = lazy(() => import("./pages/error-505"));
const AboutUs =  lazy(() => import("./pages/about-us"));
const ContactUs =  lazy(() => import("./pages/contact-us"));
const ProfileEdit = lazy(() => import("./pages/profile-edit"));

//const ProfileView = lazy(() => import("./pages/profile-view"));
//const Connections = lazy(() => import("./pages/connections"));

//const Groups = lazy(() => import("./pages/groups"));
//const Events = lazy(() => import("./pages/events"));
//const Timeline = lazy(() => import("./pages/timeline"));
//const Pricing = lazy(() => import("./pages/pricing"));
//const HelpCenter = lazy(() => import("./pages/help-center"));
//const Invoice = lazy(() => import("./pages/invoice"));
//const Calendar = lazy(() => import("./pages/apps/calendar"));
//const Chat = lazy(() => import("./pages/apps/chat"));
//const Contacts = lazy(() => import("./pages/apps/contacts"));
//const FileManager = lazy(() => import("./pages/apps/file-manager"));
//const Mail = lazy(() => import("./pages/apps/mail"));

// Classic Plus Pages

//const ClassicPlusSignIn = lazy(() => import("./pages/classic-plus/signin"));
//const ClassicPlusSignUp = lazy(() => import("./pages/classic-plus/signup"));
// const ClassicPlusVerifyAccount = lazy(
//     () => import("./pages/classic-plus/verify-account")
// );
// const ClassicPlusForgotPassword = lazy(
//     () => import("./pages/classic-plus/forgot-password")
// );
const ClassicPlusErrorNotFound = lazy(
    () => import("./pages/classic-plus/error-404")
);
const ClassicPlusError500 = lazy(
    () => import("./pages/classic-plus/error-500")
);
const ClassicPlusError503 = lazy(
    () => import("./pages/classic-plus/error-503")
);
const ClassicPlusError505 = lazy(
    () => import("./pages/classic-plus/error-505")
);

// const ClassicPlusProfileView = lazy(
//     () => import("./pages/classic-plus/profile-view")
// );
// const ClassicPlusConnections = lazy(
//     () => import("./pages/classic-plus/connections")
// );
// const ClassicPlusGroups = lazy(() => import("./pages/classic-plus/groups"));
// const ClassicPlusEvents = lazy(() => import("./pages/classic-plus/events"));
// const ClassicPlusTimeline = lazy(() => import("./pages/classic-plus/timeline"));
// const ClassicPlusPricing = lazy(() => import("./pages/classic-plus/pricing"));
// const ClassicPlusHelpCenter = lazy(
//     () => import("./pages/classic-plus/help-center")
// );
// const ClassicPlusInvoice = lazy(() => import("./pages/classic-plus/invoice"));
// const ClassicPlusCalendar = lazy(
//     () => import("./pages/classic-plus/apps/calendar")
// );
// const ClassicPlusChat = lazy(() => import("./pages/classic-plus/apps/chat"));
// const ClassicPlusContacts = lazy(
//     () => import("./pages/classic-plus/apps/contacts")
// );
// const ClassicPlusFileManager = lazy(
//     () => import("./pages/classic-plus/apps/file-manager")
// );
// const ClassicPlusMail = lazy(() => import("./pages/classic-plus/apps/mail"));

const App: React.FC = () => {
    return (
        <>
            <Router history={history}>
                <Suspense fallback={<Preloader />}>
                    <Routes>
                        {/* Classic Routes */}

                        {/* Dashboard Routes */}
                        <Route path="/" element={<DashboardInvextrade />} />

                        <Route
                            path="/dashboard-invextrade"
                            element={<DashboardInvextrade />}
                        />

                        <Route 
                            path="/about-us"
                            element={<AboutUs />}
                        />

                        <Route 
                            path="/contact-us"
                            element={<ContactUs />}
                        />
                        <Route 
                            path="/profile-edit"
                            element={<ProfileEdit />}
                        />

                        {/* Authentication Routes */}
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} />
                        {/* <Route
                            path="/verify-account"
                            element={<VerifyAccount />}
                        /> */}
                        {/* <Route
                            path="/forgot-password"
                            element={<ForgotPassword />}
                        /> */}

                        {/* Error Routes */}
                        <Route path="/error-500" element={<Error500 />} />
                        <Route path="/error-503" element={<Error503 />} />
                        <Route path="/error-505" element={<Error505 />} />

                        {/* User Routes */}
                        {/* <Route path="/profile-view" element={<ProfileView />} /> */}
                        {/* <Route path="/connections" element={<Connections />} /> */}
                        {/* <Route path="/groups" element={<Groups />} />
                        <Route path="/events" element={<Events />} /> */}

                        {/* Other Routes */}
                        {/* <Route path="/timeline" element={<Timeline />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/help-center" element={<HelpCenter />} />
                        <Route path="/invoice" element={<Invoice />} /> */}

                        {/* Apps Routes */}
                        {/* <Route path="/apps/calendar" element={<Calendar />} />
                        <Route path="/apps/chat" element={<Chat />} />
                        <Route path="/apps/contacts" element={<Contacts />} />
                        <Route
                            path="/apps/file-manager"
                            element={<FileManager />}
                        />
                        <Route path="/apps/mail" element={<Mail />} /> */}

                        {/* Authentication Routes */}
                        {/* <Route
                            path="/classic-plus/signin"
                            element={<ClassicPlusSignIn />}
                        /> */}
                        {/* <Route
                            path="/classic-plus/signup"
                            element={<ClassicPlusSignUp />}
                        /> */}
                        {/* <Route
                            path="/classic-plus/verify-account"
                            element={<ClassicPlusVerifyAccount />}
                        /> */}
                        {/* <Route
                            path="/classic-plus/forgot-password"
                            element={<ClassicPlusForgotPassword />}
                        /> */}

                        {/* Error Routes */}
                        <Route
                            path="/classic-plus/error-500"
                            element={<ClassicPlusError500 />}
                        />
                        <Route
                            path="/classic-plus/error-503"
                            element={<ClassicPlusError503 />}
                        />
                        <Route
                            path="/classic-plus/error-505"
                            element={<ClassicPlusError505 />}
                        />

                        {/* User Routes */}
                        {/* <Route
                            path="/classic-plus/profile-view"
                            element={<ClassicPlusProfileView />}
                        /> */}
                        {/* <Route
                            path="/classic-plus/connections"
                            element={<ClassicPlusConnections />}
                        /> */}
                        {/* <Route
                            path="/classic-plus/groups"
                            element={<ClassicPlusGroups />}
                        />
                        <Route
                            path="/classic-plus/events"
                            element={<ClassicPlusEvents />}
                        /> */}

                        {/* Other Routes */}
                        {/* <Route
                            path="/classic-plus/timeline"
                            element={<ClassicPlusTimeline />}
                        />
                        <Route
                            path="/classic-plus/pricing"
                            element={<ClassicPlusPricing />}
                        />
                        <Route
                            path="/classic-plus/help-center"
                            element={<ClassicPlusHelpCenter />}
                        />
                        <Route
                            path="/classic-plus/invoice"
                            element={<ClassicPlusInvoice />}
                        /> */}

                        {/* Apps Routes */}

                        {/* <Route
                            path="/classic-plus/apps/calendar"
                            element={<ClassicPlusCalendar />}
                        />
                        <Route
                            path="/classic-plus/apps/chat"
                            element={<ClassicPlusChat />}
                        />
                        <Route
                            path="/classic-plus/apps/contacts"
                            element={<ClassicPlusContacts />}
                        />
                        <Route
                            path="/classic-plus/apps/file-manager"
                            element={<ClassicPlusFileManager />}
                        />
                        <Route
                            path="/classic-plus/apps/mail"
                            element={<ClassicPlusMail />}
                        /> */}

                        {/* 404 Page Route */}
                        <Route path="*" element={<ErrorNotFound />} />
                        <Route
                            path="*"
                            element={<ClassicPlusErrorNotFound />}
                        />
                    </Routes>
                </Suspense>
            </Router>
        </>
    );
};

export default App;
