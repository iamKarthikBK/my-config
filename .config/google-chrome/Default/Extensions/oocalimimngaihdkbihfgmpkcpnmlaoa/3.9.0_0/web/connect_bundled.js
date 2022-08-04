/*******************************************************
* Copyright (C) 2018-2022 WP Interactive Media, Inc. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
*******************************************************/
(() => {
    "use strict";
    const ChromeStorageReadError = "Failed to read chrome storage. Please refresh the page and try again";
    var __awaiter = function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))((function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                var value;
                result.done ? resolve(result.value) : (value = result.value, value instanceof P ? value : new P((function(resolve) {
                    resolve(value);
                }))).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        }));
    };
    const ChromeStorageReader = new class {
        getItemsAsync(items) {
            return __awaiter(this, void 0, void 0, (function*() {
                return new Promise(((resolve, reject) => {
                    chrome.storage.local.get(items, (result => {
                        chrome.runtime.lastError ? reject(new Error(ChromeStorageReadError)) : resolve(result);
                    }));
                }));
            }));
        }
        getAllItemsAsync() {
            return __awaiter(this, void 0, void 0, (function*() {
                return new Promise(((resolve, reject) => {
                    chrome.storage.local.get(null, (result => {
                        chrome.runtime.lastError ? reject(new Error(ChromeStorageReadError)) : resolve(result);
                    }));
                }));
            }));
        }
    };
    Object.freeze(ChromeStorageReader);
    const ChromeStorage_ChromeStorageReader = ChromeStorageReader;
    var ChromeStorageWriter_awaiter = function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))((function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                var value;
                result.done ? resolve(result.value) : (value = result.value, value instanceof P ? value : new P((function(resolve) {
                    resolve(value);
                }))).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        }));
    };
    const ChromeStorageWriter = new class {
        setItemsAsync(items) {
            return ChromeStorageWriter_awaiter(this, void 0, void 0, (function*() {
                return new Promise(((resolve, reject) => {
                    chrome.storage.local.set(items, (() => {
                        chrome.runtime.lastError ? reject(new Error("Failed to write to chrome storage. Please refresh the page and try again")) : resolve();
                    }));
                }));
            }));
        }
    };
    Object.freeze(ChromeStorageWriter);
    const ChromeStorage_ChromeStorageWriter = ChromeStorageWriter;
    const EXTENSION_ID = chrome.runtime.id, EXTENSION_IDS = [ "bpgopfmgmnojmhnhmgpfmpnookgbmkko", "oocalimimngaihdkbihfgmpkcpnmlaoa", "igbncjcgfkfnfgbaieiimpfkobabmkce" ];
    var SessionMap_awaiter = function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))((function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                var value;
                result.done ? resolve(result.value) : (value = result.value, value instanceof P ? value : new P((function(resolve) {
                    resolve(value);
                }))).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        }));
    };
    const SessionMap = new class {
        getRedirectDataForTabAsync(tabId) {
            return SessionMap_awaiter(this, void 0, void 0, (function*() {
                const redirectDataMap = (yield ChromeStorage_ChromeStorageReader.getItemsAsync([ "redirectDataMap" ])).redirectDataMap, sessionDataKey = this._getKeyForSessionData(tabId);
                if (redirectDataMap && redirectDataMap[sessionDataKey]) {
                    const redirectData = redirectDataMap[sessionDataKey];
                    if (this._isRedirectDataValid(redirectData)) return redirectData;
                }
            }));
        }
        deleteRedirectDataForTabAsync(tabId) {
            return SessionMap_awaiter(this, void 0, void 0, (function*() {
                const redirectDataMap = (yield ChromeStorage_ChromeStorageReader.getItemsAsync([ "redirectDataMap" ])).redirectDataMap, redirectDataKey = this._getKeyForSessionData(tabId);
                redirectDataMap && redirectDataMap[redirectDataKey] && delete redirectDataMap[redirectDataKey], 
                yield ChromeStorage_ChromeStorageWriter.setItemsAsync({
                    redirectDataMap
                });
            }));
        }
        _getKeyForSessionData(tabId) {
            return tabId;
        }
        storeRedirectDataForTabAsync(redirectData, tabId) {
            return SessionMap_awaiter(this, void 0, void 0, (function*() {
                const dataKey = this._getKeyForSessionData(tabId);
                let redirectDataMap = yield ChromeStorage_ChromeStorageReader.getItemsAsync([ "redirectDataMap" ]);
                redirectDataMap[dataKey] = redirectData, redirectDataMap = this._removeInvalidSessionDataInMap(redirectDataMap), 
                yield ChromeStorage_ChromeStorageWriter.setItemsAsync({
                    redirectDataMap
                });
            }));
        }
        _removeInvalidSessionDataInMap(sessionMap) {
            return function(obj, predicate) {
                const result = {};
                let key;
                for (key in obj) obj.hasOwnProperty(key) && predicate(obj[key]) && (result[key] = obj[key]);
                return result;
            }(sessionMap, this._isRedirectDataValid);
        }
        _isRedirectDataValid(redirectData) {
            const storedDate = redirectData.date;
            return void 0 !== storedDate && "number" == typeof storedDate && storedDate <= Date.now() && Date.now() - storedDate < 108e5;
        }
    };
    Object.freeze(SessionMap);
    const ChromeStorage_SessionMap = SessionMap, Permissions_namespaceObject = JSON.parse('{"dE":["tabs"],"$6":["*://*/*"]}');
    class BackgroundMessage extends class {
        constructor(sender, target, type) {
            this.sender = sender, this.target = target, this.type = type;
        }
    } {
        constructor(sender, target, type) {
            super(sender, target, type), this.type = type;
        }
    }
    var BackgroundMessageType;
    !function(BackgroundMessageType) {
        BackgroundMessageType.JOIN_SESSION = "joinSession", BackgroundMessageType.GET_VIDEO_DATA = "getVideoData", 
        BackgroundMessageType.LOAD_SESSION = "loadSession", BackgroundMessageType.NO_SESSION_DATA = "noSessionData", 
        BackgroundMessageType.TEARDOWN = "teardown", BackgroundMessageType.ON_VIDEO_UPDATE = "onVideoUpdate", 
        BackgroundMessageType.SOCKET_LOST_CONNECTION = "socketLostConnection", BackgroundMessageType.REBOOT = "socketReconnect", 
        BackgroundMessageType.LOG_EVENT = "logEvent", BackgroundMessageType.LOG_EXPERIMENT = "logExpirement", 
        BackgroundMessageType.STAY_ALIVE = "stayAlive", BackgroundMessageType.LOAD_CHAT_WINDOW = "loadChatWindow", 
        BackgroundMessageType.RESET_CHAT_WINDOW = "resetChatWindow", BackgroundMessageType.HIDE_CHAT_WINDOW = "hideChatWindow";
    }(BackgroundMessageType || (BackgroundMessageType = {}));
    class LogEventMessage extends BackgroundMessage {
        constructor(sender, target, data) {
            super(sender, target, BackgroundMessageType.LOG_EVENT), this.data = data, this.sender = sender, 
            this.target = target;
        }
    }
    var debug = console.log.bind(window.console);
    const MessagePasser = new class {
        addListener(listener) {
            chrome.runtime.onMessage.addListener(listener);
        }
        removeListener(listener) {
            chrome.runtime.onMessage.removeListener(listener);
        }
        sendMessageToTabAsync(message, tabId, timeout = 2e4) {
            return new Promise(((resolve, reject) => {
                const sendTimeout = setTimeout((() => {
                    reject();
                }), timeout);
                try {
                    chrome.tabs.sendMessage(tabId, message, (response => {
                        chrome.runtime.lastError && debug(chrome.runtime.lastError.message + JSON.stringify(message)), 
                        clearTimeout(sendTimeout), resolve(response);
                    }));
                } catch (error) {
                    clearTimeout(sendTimeout), reject(error);
                }
            }));
        }
        sendMessageToExtension(message, timeout) {
            return new Promise(((resolve, reject) => {
                let sendTimeout = null;
                timeout && (sendTimeout = setTimeout((() => {
                    reject({
                        error: "Send Message Timeout"
                    });
                }), timeout));
                try {
                    chrome.runtime.sendMessage(EXTENSION_ID, message, (response => {
                        chrome.runtime.lastError && console.log(chrome.runtime.lastError.message + JSON.stringify(message)), 
                        sendTimeout && clearTimeout(sendTimeout), resolve(response);
                    }));
                } catch (error) {
                    sendTimeout && clearTimeout(sendTimeout), reject(error);
                }
            }));
        }
    }, Messaging_MessagePasser = MessagePasser;
    class LogExperimentMessage extends BackgroundMessage {
        constructor(sender, target, data) {
            super(sender, target, BackgroundMessageType.LOG_EXPERIMENT), this.data = data;
        }
    }
    var connect_awaiter = function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))((function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                var value;
                result.done ? resolve(result.value) : (value = result.value, value instanceof P ? value : new P((function(resolve) {
                    resolve(value);
                }))).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        }));
    };
    console.log("Loaded");
    let siteVersion = "new";
    let sidebarHandlerOrigin, tabId;
    function isValidOrigin(event) {
        return "https://www.tele.pe" === event.origin && (siteVersion = "old"), function(event) {
            if (null != EXTENSION_IDS.find((id => event.origin === `chrome-extension://${id}`))) return !0;
            return null != event.origin.match(/^https:\/\/[^.]*\.(?:(?:tele\.pe)|(?:teleparty\.com)|(?:netflixparty\.com))$/);
        }(event);
    }
    function checkHasDefaultPermissions() {
        return connect_awaiter(this, void 0, void 0, (function*() {
            return new Promise((resolve => {
                chrome.permissions.contains({
                    origins: Permissions_namespaceObject.$6,
                    permissions: Permissions_namespaceObject.dE
                }, (hasPermissions => {
                    resolve(hasPermissions);
                }));
            }));
        }));
    }
    function storeSessionDataAsync(sessionData, callback) {
        return connect_awaiter(this, void 0, void 0, (function*() {
            const tabId = yield getCurrentTabIdAsync();
            tabId && (yield ChromeStorage_SessionMap.storeRedirectDataForTabAsync(sessionData, tabId));
            const {sessionId, service} = sessionData, oldLogEventMessage = new LogEventMessage("Iframe", "Service_Background", {
                sessionId,
                eventType: `redirect-${siteVersion}-${service}-chrome`
            }), logMessage = new LogEventMessage("Iframe", "Service_Background", {
                name: "user_click",
                action: {
                    description: `redirect-${siteVersion}-${service}-chrome`
                }
            });
            try {
                yield Messaging_MessagePasser.sendMessageToExtension(logMessage, 2500), yield Messaging_MessagePasser.sendMessageToExtension(oldLogEventMessage, 2500);
            } finally {
                callback("resolveRedirect");
            }
        }));
    }
    function getCurrentTabIdAsync() {
        return connect_awaiter(this, void 0, void 0, (function*() {
            return new Promise((resolve => {
                chrome.tabs.query({
                    active: !0,
                    currentWindow: !0
                }, (function(tabs) {
                    const tabId = tabs[0].id;
                    resolve(tabId);
                }));
            }));
        }));
    }
    window.addEventListener("message", (function(event) {
        if (isValidOrigin(event)) {
            const message = event.data;
            if (message) {
                const callback = function(event) {
                    return message => {
                        var _a, _b;
                        if (event.data.callbackId) {
                            const returnMessage = {
                                callbackId: event.data.callbackId,
                                data: message
                            };
                            null === (_a = window.top) || void 0 === _a || _a.postMessage(returnMessage, event.origin);
                        } else null === (_b = window.top) || void 0 === _b || _b.postMessage(message, event.origin);
                    };
                }(event);
                "Content_Script" === message.target || "Service_Background" === message.target ? function(message, callback) {
                    connect_awaiter(this, void 0, void 0, (function*() {
                        const response = yield Messaging_MessagePasser.sendMessageToExtension(message);
                        callback(response);
                    }));
                }(message, callback) : "SetRedirectData" == message.type ? storeSessionDataAsync(message.data, callback) : message.sessionId ? storeSessionDataAsync(message, callback) : "GetPermissions" === message.type ? function(callback, data) {
                    connect_awaiter(this, void 0, void 0, (function*() {
                        const alreadyHasPermissions = yield checkHasDefaultPermissions(), permissionsGranted = alreadyHasPermissions || (yield function(siteName) {
                            return connect_awaiter(this, void 0, void 0, (function*() {
                                return new Promise((resolve => {
                                    var _a;
                                    const clickListener = () => connect_awaiter(this, void 0, void 0, (function*() {
                                        const loggedVersion = `${"all_sites"}-${siteName}-chrome`, logExperimentMessage = new LogExperimentMessage("Iframe", "Service_Background", {
                                            experimentName: "permissions_request",
                                            experimentVersion: loggedVersion,
                                            eventType: "permissions-prompted"
                                        });
                                        Messaging_MessagePasser.sendMessageToExtension(logExperimentMessage), chrome.permissions.request({
                                            origins: Permissions_namespaceObject.$6,
                                            permissions: Permissions_namespaceObject.dE
                                        }, (granted => {
                                            var _a;
                                            null == granted && console.log(null === (_a = chrome.runtime.lastError) || void 0 === _a ? void 0 : _a.message);
                                            const logExperimentMessage = new LogExperimentMessage("Iframe", "Service_Background", {
                                                experimentName: "permissions_request",
                                                experimentVersion: loggedVersion,
                                                eventType: granted ? "permissions-granted" : "permissions-denied"
                                            });
                                            Messaging_MessagePasser.sendMessageToExtension(logExperimentMessage, 2500).catch((() => {})).then((() => {
                                                var _a;
                                                resolve(granted), null === (_a = document.querySelector("html")) || void 0 === _a || _a.removeEventListener("click", clickListener);
                                            }));
                                        }));
                                    }));
                                    null === (_a = document.querySelector("html")) || void 0 === _a || _a.addEventListener("click", clickListener);
                                }));
                            }));
                        }(data.site));
                        callback(permissionsGranted);
                    }));
                }(callback, message.data) : "CheckHasPermissions" === message.type ? checkHasDefaultPermissions().then(callback) : "logExperiment" === message.type ? function(experimentData, callback) {
                    connect_awaiter(this, void 0, void 0, (function*() {
                        const {experimentName, experimentVersion, event} = experimentData, logExperimentMessage = new LogExperimentMessage("Iframe", "Service_Background", {
                            experimentName,
                            experimentVersion,
                            eventType: event
                        });
                        try {
                            yield Messaging_MessagePasser.sendMessageToExtension(logExperimentMessage, 2500);
                        } finally {
                            callback();
                        }
                    }));
                }(message.data, callback) : "logEvent" === message.type ? function(data, callback) {
                    connect_awaiter(this, void 0, void 0, (function*() {
                        const logEventMessage = new LogEventMessage("Iframe", "Service_Background", data.event);
                        try {
                            Messaging_MessagePasser.sendMessageToExtension(logEventMessage, 2500);
                        } finally {
                            callback();
                        }
                    }));
                }(message.data, callback) : "storeExperimentVersion" === message.type ? function(data, callback) {
                    var _a;
                    connect_awaiter(this, void 0, void 0, (function*() {
                        const {experimentName, experimentVersion} = data, results = yield ChromeStorage_ChromeStorageReader.getItemsAsync([ "experiments" ]), experimentData = null !== (_a = results.experiments) && void 0 !== _a ? _a : {};
                        experimentData[experimentName] = experimentVersion;
                        try {
                            yield ChromeStorage_ChromeStorageWriter.setItemsAsync({
                                experiments: experimentData
                            });
                        } finally {
                            callback();
                        }
                    }));
                }(message.data, callback) : "GetPermId" === message.type ? function(callback) {
                    connect_awaiter(this, void 0, void 0, (function*() {
                        const permId = (yield ChromeStorage_ChromeStorageReader.getAllItemsAsync()).userId;
                        callback(permId);
                    }));
                }(callback) : "GetActiveNetflixTabs" === message.type ? function(callback) {
                    chrome.tabs.query({
                        url: "https://www.netflix.com/watch/*"
                    }, (tabs => {
                        callback(tabs);
                    }));
                }(callback) : "CloseNetflixTabs" === message.type ? function(callback) {
                    chrome.tabs.query({
                        url: "https://www.netflix.com/watch/*"
                    }, (tabs => {
                        const tabIds = tabs.map((tab => tab.id)).filter((id => !!id));
                        chrome.tabs.remove(tabIds), callback();
                    }));
                }(callback) : "AddSidebarHandler" === message.type ? function(origin, callback) {
                    connect_awaiter(this, void 0, void 0, (function*() {
                        sidebarHandlerOrigin = origin, tabId = yield getCurrentTabIdAsync(), callback(tabId);
                    }));
                }(event.origin, callback) : callback({
                    error: "Unsupported Operation"
                });
            }
        }
    }), !1), Messaging_MessagePasser.addListener((function(message, sender, sendResponse) {
        if ("TP_Sidebar" === message.target && message.tabId === tabId) {
            if (null != sidebarHandlerOrigin) return window.parent.postMessage(message, sidebarHandlerOrigin), 
            sendResponse(), !0;
            console.warn("Not ready yet");
        }
        return !1;
    }));
})();