const PREF = "PREF";
const AND = "&";
const CONCAT = "f6=42088";
const KEY = "f6";
const youtubeURL = "https://www.youtube.com/*";

// context
const context = "browser" in window ? window.browser : window.chrome;

context.webRequest.onBeforeSendHeaders.addListener(ijctCookie,{ urls: [youtubeURL], types: ["main_frame"] },["blocking", "requestHeaders"]);

function Cookies(cookie_rcv) {
  this.cookie = cookie_rcv
    .split(";")
    .map(item => item.trim())
    .filter(item => item.length > 0)
    .map(item => {
      var idx_kv = item.indexOf("=");
      return {
        name: item.substr(0, idx_kv),
        value: item.substr(idx_kv + 1)
      };
    });
}

Cookies.prototype.set = function(name, value) {
  var item = this.item(name);
  if (item) {
    item.value = value;
  } else {
    this.cookie.push({
      name: name,
      value: value
    });
  }
};

Cookies.prototype.item = function(name) {
  return this.cookie.find(item => item.name === name);
};

Cookies.prototype.stringify = function() {
  return this.cookie.map(item => item.name + "=" + item.value).join("; ");
};

function ijctCookie(event) {
var headerCookie = event.requestHeaders.find(function(header) {
    return header.name.toLowerCase() === "cookie";
});

//
if (!headerCookie) {
    headerCookie = { name: "Cookies", value: "" };
    event.requestHeaders.push(headerCookie);
}

var storeCookie = new Cookies(headerCookie.value);
var changePref = storeCookie
    .get(PREF, "")
    .split(AND)
    .filter(pref => pref.length > 0)
    .filter(pref => pref.substr(0, 2) !== KEY)
    .concat(CONCAT)
    .join(AND);

storeCookie.set(PREF, changePref);
headerCookie.value = storeCookie.stringify();

return { requestHeaders: event.requestHeaders };
}

Cookies.prototype.get = function(name, default_value) {
    var item = this.item(name);
    return item ? item.value : default_value;
};