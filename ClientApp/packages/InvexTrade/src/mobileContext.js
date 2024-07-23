import React from "react";
export const isMobileCheck = window.innerWidth < 500
export const windowHeight = window.innerHeight;
export default React.createContext(isMobileCheck);
