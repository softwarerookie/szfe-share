import md5 from "md5";
import type { AxiosRequestConfig } from "axios";

function getRandStr(len: any) {
  let res = "";
  const str = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < len; i++) {
    const index = Math.floor(Math.random() * str.length);
    res += str[index];
  }
  return res;
}

function genSign(obj: any, key: any) {
  const keys = Object.keys(obj).sort();
  let str = keys.reduce((acc, item) => {
    if (obj[item] !== "") {
      acc += item + "=" + obj[item] + "&";
    }
    return acc;
  }, "");
  str += `req_encrypt_key=${key}`;
  // console.log(str);
  return md5(str);
}

function paramEnCode(config: any, key: any) {
  if (!key) return config;
  const params = config.params ?? {};
  const data = { req_body: "" };
  // if (config.headers["Content-Type"] === "application/json") {
  const dataStr = config.data ? JSON.stringify(config.data) : "";
  data.req_body = dataStr;
  // }

  const req_timestamp = Date.now();
  const req_random = getRandStr(8);
  const reqParams = Object.assign(params, data, {
    req_timestamp,
    req_random,
  });
  Object.keys(reqParams).forEach((item) => {
    if (reqParams[item] === "") {
      delete reqParams[item];
    }
  });
  const req_sign = genSign(reqParams, key);
  config.params = {
    ...config.params,
    req_timestamp,
    req_random,
    req_sign,
  };
  return config;
}

export const encryptParams = (
  config: AxiosRequestConfig<any>,
  key: any,
  enabled: any
) => {
  if (enabled && key) {
    return paramEnCode(config, key);
  } else {
    return config;
  }
};

export default encryptParams;
