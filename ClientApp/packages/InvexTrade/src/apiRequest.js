// Status Code'a göre error mesajını ayarlayan genel request modülüdür.

import history from "./history";
import { getValueFromLocalStorage, setValueToLocalStorage, removeValueFromLocalStorage } from "./utils";
import { setUser } from "./redux/slices/user";
import { dispatchDirectly } from "./redux/store";

// Dont forget configure proxy in package.json
const useRemoteBackend = true;
const guestUser = { username: "guest", password: "7ti17G8!I5o8" };
const remoteURL = "https://api.invextrade.com"

async function getToken() {
    let token = getValueFromLocalStorage("token");
    if (!token) {
        // Redirect olmadan guest hesabı ile login oluyoruz.
        //redirectToSingInPage()
        //return response
        const res = await signInRequest(guestUser.username, guestUser.password);
        token = getValueFromLocalStorage("token");
        guestUser["token"] = token;
        res["username"] = "";
        setUserAllApp(res);
    }
    return token;
}

// token kontrolü yapılır.
async function sendPostRequest(url, options) {
    try {
        // console.log("sendPostRequest:", url)
        // console.log("options:", options)
        const url2 = useRemoteBackend ? remoteURL + url : url;
        const response = {};
        let token = await getToken();
        const sendReq = await fetch(url2, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(options),
        });
        response["ok"] = sendReq["ok"];
        response["status"] = sendReq["status"];
        // console.log("sendReq", sendReq)

        if (sendReq["ok"] !== true) {
            response["errorMsg"] = setStatusWarning(
                sendReq["status"],
                sendReq["statusText"]
            );
        } else {
            const data = await sendReq.json();
            response["data"] = data;
        }

        // // token expired ise tokeni sil süreci baştan başlat
        // if(sendReq["status"] === 401 || sendReq["status"] === 422){
        //     removeValueFromLocalStorage("token")
        //     return await sendPostRequest(url, options)
        // }else{
        //     return response;
        // }
        return response;
    } catch (e) {
        console.log("Request exception:", e);
        return {
            ok: false,
            data: null,
            errorMsg: "An Error Occurred !",
        };
    }
}

async function signInRequest(username, password) {
    try {
        const url = useRemoteBackend
            ? remoteURL + "/v1/login"
            : "v1/login";
        const rawResponse = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });
        const res = await rawResponse.json();
        if (res?.access_token) {
            setValueToLocalStorage("token", res.access_token);
            setValueToLocalStorage("isGuest", res.guest);
            res["username"] = username;
        }
        return res;
    } catch (e) {
        console.log("SignIn error:", e);
        return { msg: "An error occured !" };
    }
}

async function getRequest(endpoint) {
    const url = useRemoteBackend
        ? remoteURL + '/' + endpoint
        : endpoint;
    const token = await getToken();
    const rawResponse = await fetch(url, {
        method: "Get",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Access-Control-Allow-Origin": "*",
        },
    });
    return await rawResponse.json();
}

async function signUpRequest(username, email, password) {
    try {
        let token = guestUser.token;
        const res = await signInRequest(
            guestUser.username,
            guestUser.password
        );
        token = getValueFromLocalStorage("token");
        guestUser["token"] = token;

        const url = useRemoteBackend
            ? remoteURL + "/v1/register"
            : "v1/register";
        const rawResponse = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                username,
                email,
                password,
            }),
        });
        const response = await rawResponse.json();
        if (rawResponse.ok === true) {
            delete response.msg;
        }
        return response;
    } catch (e) {
        console.log("signUp error:", e);
        return { msg: "An error occured !" };
    }
}


function setStatusWarning(statusCode, noMatchText = null) {
    switch (statusCode) {
        case 500:
            return "Server Error";
        default:
            if (noMatchText) return noMatchText;
            else return "";
    }
}

function redirectToSingInPage() {
    history.replace("/signin");
    window.location.reload();
}

function setUserAllApp(res) {
    dispatchDirectly(
        setUser({
            userName: res?.username || "",
        })
    );
}

async function refreshToken(token){
    try {
        const url = useRemoteBackend
            ? remoteURL + "v1/refreshtoken"
            : "/v1/refreshtoken";
        const rawResponse = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${token}`,
            }
        });
        const res = await rawResponse.json();
        if (res?.access_token) {
            setValueToLocalStorage("token", res.access_token);
        }
        console.log("res:", res)
        return res;
    } catch (e) {
        console.log("SignIn error:", e);
        return { msg: "An error occured !" };
    }
}

export {
    sendPostRequest,
    signInRequest,
    signUpRequest,
    setUserAllApp,
    guestUser,
    getRequest
};
