/* eslint-disable no-unused-expressions */

import {
    sendPostRequest,
    signInRequest,
    signUpRequest,
} from "./apiRequest";

function setValueToLocalStorage(key, val) {
    localStorage?.setItem(key, val);
}

function getValueFromLocalStorage(key) {
    return localStorage?.getItem(key) || null;
}

function removeValueFromLocalStorage(key) {
    localStorage?.removeItem(key);
}

async function signIn(username, password) {
    return await signInRequest(username, password);
}

async function signUp(username, email, password) {
    return await signUpRequest(username, email, password);
}

async function updateUserProfile(profile) {
    const newProfile = Object.keys(profile).reduce((prev, current) => {
        const newValue = { ...prev };
        const currentVal = profile[current];
        if (currentVal) newValue[current] = profile[current];
        return newValue;
    }, {});

    const res = await sendPostRequest("/v1/update", newProfile);
    return res;
}

// TO DO logout

export {
    setValueToLocalStorage,
    getValueFromLocalStorage,
    signIn,
    signUp,
    removeValueFromLocalStorage,
    updateUserProfile,
};
