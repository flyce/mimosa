import { getItem } from "./storage";
import config from "../Config/env";
import { message } from "antd";

export const loginVerify = () => {
    if(getItem("token")) {
        if(Math.floor(Date.now()/1000) - getItem("loginTime") > config.loginEffect) {
            message.error("登录过期，请重新登录");
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
};