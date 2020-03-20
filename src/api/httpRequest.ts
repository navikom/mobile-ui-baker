import Cookies from "js-cookie";
import { Headers, Body } from "interfaces/Request";
import { ErrorHandler } from "utils/ErrorHandler";

export async function request(method: string, url: string, allHeaders: Headers = {}, body?: Body, excludeHeaders?: string[], debug = true) {
  const headers = Object.assign({
    "Accept": "application/json",
    "Content-Type": "application/json"
  }, allHeaders);
  if(excludeHeaders) {
    excludeHeaders.forEach((key) => {
      headers[key] && delete headers[key];
    })
  }
  const object: RequestInit = { method, headers, credentials: "include" };
  body && (object.body = body instanceof FormData ? body : JSON.stringify(body));
  if (debug) {
    console.log("REQUEST", url, method, body, headers);
  }
  const response = await fetch(url, object);
  if (debug) {
    console.log("RESPONSE", url, response, response.headers.get("Content-Type"), Cookies.get());
  }

  try {
    const json = response.headers.get("Content-Type")!.includes("text") ? {error:await response.text()} : await response.json();

    if (debug) {
      console.log("RESPONSE BODY", url, json);
    }
    if (!response.ok) {
      throw new ErrorHandler(json.error ? json.error : "HTTP Error");
    }
    return json.data;
  } catch (err) {
    console.log('Fetch Error: ', err.message);
    throw new ErrorHandler(err.message);
  }

}
