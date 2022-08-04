/*******************************************************
* Copyright (C) 2018-2022 WP Interactive Media, Inc. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
*******************************************************/
(() => {
    var __webpack_modules__ = {
        63: (__unused_webpack_module, exports) => {
            function Emitter(obj) {
                if (obj) return function(obj) {
                    for (var key in Emitter.prototype) obj[key] = Emitter.prototype[key];
                    return obj;
                }(obj);
            }
            exports.Q = Emitter, Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) {
                return this._callbacks = this._callbacks || {}, (this._callbacks["$" + event] = this._callbacks["$" + event] || []).push(fn), 
                this;
            }, Emitter.prototype.once = function(event, fn) {
                function on() {
                    this.off(event, on), fn.apply(this, arguments);
                }
                return on.fn = fn, this.on(event, on), this;
            }, Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) {
                if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, 
                this;
                var cb, callbacks = this._callbacks["$" + event];
                if (!callbacks) return this;
                if (1 == arguments.length) return delete this._callbacks["$" + event], this;
                for (var i = 0; i < callbacks.length; i++) if ((cb = callbacks[i]) === fn || cb.fn === fn) {
                    callbacks.splice(i, 1);
                    break;
                }
                return 0 === callbacks.length && delete this._callbacks["$" + event], this;
            }, Emitter.prototype.emit = function(event) {
                this._callbacks = this._callbacks || {};
                for (var args = new Array(arguments.length - 1), callbacks = this._callbacks["$" + event], i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
                if (callbacks) {
                    i = 0;
                    for (var len = (callbacks = callbacks.slice(0)).length; i < len; ++i) callbacks[i].apply(this, args);
                }
                return this;
            }, Emitter.prototype.emitReserved = Emitter.prototype.emit, Emitter.prototype.listeners = function(event) {
                return this._callbacks = this._callbacks || {}, this._callbacks["$" + event] || [];
            }, Emitter.prototype.hasListeners = function(event) {
                return !!this.listeners(event).length;
            };
        },
        10: module => {
            function Backoff(opts) {
                opts = opts || {}, this.ms = opts.min || 100, this.max = opts.max || 1e4, this.factor = opts.factor || 2, 
                this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0, this.attempts = 0;
            }
            module.exports = Backoff, Backoff.prototype.duration = function() {
                var ms = this.ms * Math.pow(this.factor, this.attempts++);
                if (this.jitter) {
                    var rand = Math.random(), deviation = Math.floor(rand * this.jitter * ms);
                    ms = 0 == (1 & Math.floor(10 * rand)) ? ms - deviation : ms + deviation;
                }
                return 0 | Math.min(ms, this.max);
            }, Backoff.prototype.reset = function() {
                this.attempts = 0;
            }, Backoff.prototype.setMin = function(min) {
                this.ms = min;
            }, Backoff.prototype.setMax = function(max) {
                this.max = max;
            }, Backoff.prototype.setJitter = function(jitter) {
                this.jitter = jitter;
            };
        },
        58: module => {
            try {
                module.exports = "undefined" != typeof XMLHttpRequest && "withCredentials" in new XMLHttpRequest;
            } catch (err) {
                module.exports = !1;
            }
        },
        830: (__unused_webpack_module, exports) => {
            exports.encode = function(obj) {
                var str = "";
                for (var i in obj) obj.hasOwnProperty(i) && (str.length && (str += "&"), str += encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
                return str;
            }, exports.decode = function(qs) {
                for (var qry = {}, pairs = qs.split("&"), i = 0, l = pairs.length; i < l; i++) {
                    var pair = pairs[i].split("=");
                    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
                }
                return qry;
            };
        },
        187: module => {
            var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, parts = [ "source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor" ];
            module.exports = function(str) {
                var src = str, b = str.indexOf("["), e = str.indexOf("]");
                -1 != b && -1 != e && (str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ";") + str.substring(e, str.length));
                for (var query, data, m = re.exec(str || ""), uri = {}, i = 14; i--; ) uri[parts[i]] = m[i] || "";
                return -1 != b && -1 != e && (uri.source = src, uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ":"), 
                uri.authority = uri.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), 
                uri.ipv6uri = !0), uri.pathNames = function(obj, path) {
                    var regx = /\/{2,9}/g, names = path.replace(regx, "/").split("/");
                    "/" != path.substr(0, 1) && 0 !== path.length || names.splice(0, 1);
                    "/" == path.substr(path.length - 1, 1) && names.splice(names.length - 1, 1);
                    return names;
                }(0, uri.path), uri.queryKey = (query = uri.query, data = {}, query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, (function($0, $1, $2) {
                    $1 && (data[$1] = $2);
                })), data), uri;
            };
        },
        281: module => {
            "use strict";
            var prev, alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""), map = {}, seed = 0, i = 0;
            function encode(num) {
                var encoded = "";
                do {
                    encoded = alphabet[num % 64] + encoded, num = Math.floor(num / 64);
                } while (num > 0);
                return encoded;
            }
            function yeast() {
                var now = encode(+new Date);
                return now !== prev ? (seed = 0, prev = now) : now + "." + encode(seed++);
            }
            for (;i < 64; i++) map[alphabet[i]] = i;
            yeast.encode = encode, yeast.decode = function(str) {
                var decoded = 0;
                for (i = 0; i < str.length; i++) decoded = 64 * decoded + map[str.charAt(i)];
                return decoded;
            }, module.exports = yeast;
        }
    }, __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (void 0 !== cachedModule) return cachedModule.exports;
        var module = __webpack_module_cache__[moduleId] = {
            exports: {}
        };
        return __webpack_modules__[moduleId](module, module.exports, __webpack_require__), 
        module.exports;
    }
    __webpack_require__.d = (exports, definition) => {
        for (var key in definition) __webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key) && Object.defineProperty(exports, key, {
            enumerable: !0,
            get: definition[key]
        });
    }, __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop), 
    __webpack_require__.r = exports => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(exports, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(exports, "__esModule", {
            value: !0
        });
    };
    var __webpack_exports__ = {};
    (() => {
        "use strict";
        __webpack_require__.d(__webpack_exports__, {
            Z: () => Background_BackgroundService
        });
        var socket_io_parser_build_esm_namespaceObject = {};
        __webpack_require__.r(socket_io_parser_build_esm_namespaceObject), __webpack_require__.d(socket_io_parser_build_esm_namespaceObject, {
            Decoder: () => Decoder,
            Encoder: () => Encoder,
            PacketType: () => PacketType,
            protocol: () => build_esm_protocol
        });
        var debug = console.log.bind(window.console);
        const SocketPool = new class {
            constructor() {
                this._socketMap = new Map;
            }
            setSocketForTabId(tabId, socket) {
                this._socketMap.set(tabId, socket);
            }
            getSocketForTabId(tabId) {
                return this._socketMap.get(tabId);
            }
            containsSocketForTabId(tabId) {
                return this._socketMap.has(tabId);
            }
            removeSocketForTabId(tabId) {
                this._socketMap.delete(tabId);
            }
            teardown() {
                this._socketMap.forEach((wrapper => {
                    wrapper.teardown();
                })), this._socketMap.clear();
            }
        };
        Object.freeze(SocketPool);
        const Socket_SocketPool = SocketPool;
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
        const ChromeStorage_ChromeStorageReader = ChromeStorageReader, oldIcons = (chrome.extension.getURL("img/x-circle.svg"), 
        [ "Batman.svg", "DeadPool.svg", "CptAmerica.svg", "Wolverine.svg", "IronMan.svg", "Goofy.svg", "Alien.svg", "Mulan.svg", "Snow-White.svg", "Poohbear.svg", "Sailormoon.svg", "Sailor Cat.svg", "Pizza.svg", "Cookie.svg", "Chocobar.svg", "hotdog.svg", "Hamburger.svg", "Popcorn.svg", "IceCream.svg", "ChickenLeg.svg" ]), defaultIcons = [ "General/Alien.svg", "General/Batman.svg", "General/ChickenLeg.svg", "General/Chocobar.svg", "General/Cookie.svg", "General/CptAmerica.svg", "General/DeadPool.svg", "General/Goofy.svg", "General/Hamburger.svg", "General/hotdog.svg", "General/IceCream.svg", "General/IronMan.svg", "General/Mulan.svg", "General/Pizza.svg", "General/Poohbear.svg", "General/Popcorn.svg", "General/Sailor Cat.svg", "General/Sailormoon.svg", "General/Snow-White.svg", "General/Wolverine.svg" ], newIcons = [ "General/Alien.svg", "General/Batman.svg", "General/ChickenLeg.svg", "General/Chocobar.svg", "General/Cookie.svg", "General/CptAmerica.svg", "General/DeadPool.svg", "General/Goofy.svg", "General/Hamburger.svg", "General/hotdog.svg", "General/IceCream.svg", "General/IronMan.svg", "General/Mulan.svg", "General/Pizza.svg", "General/Poohbear.svg", "General/Popcorn.svg", "General/Sailor Cat.svg", "General/Sailormoon.svg", "General/Snow-White.svg", "General/Wolverine.svg", "Christmas/angel.svg", "Christmas/bell.svg", "Christmas/box.svg", "Christmas/cane.svg", "Christmas/flake.svg", "Christmas/gingerbread.svg", "Christmas/gingerbread_F.svg", "Christmas/gingerbread_M.svg", "Christmas/gloves_blue.svg", "Christmas/gloves_red.svg", "Christmas/hat.svg", "Christmas/ornament.svg", "Christmas/raindeer.svg", "Christmas/reef.svg", "Christmas/santa_F.svg", "Christmas/santa_M.svg", "Christmas/snowglobe.svg", "Christmas/snowman.svg", "Christmas/sock.svg", "Christmas/tree.svg", "Halloween/bats.svg", "Halloween/candy_corn.svg", "Halloween/cat_black.svg", "Halloween/cat_white.svg", "Halloween/coffin.svg", "Halloween/eye_ball.svg", "Halloween/face_angry.svg", "Halloween/face_evil.svg", "Halloween/face_silly.svg", "Halloween/face_smile.svg", "Halloween/frankenstein.svg", "Halloween/ghost_F.svg", "Halloween/ghost_M.svg", "Halloween/gravestone.svg", "Halloween/lollipop.svg", "Halloween/moon.svg", "Halloween/mummy.svg", "Halloween/potion.svg", "Halloween/pumpkin.svg", "Halloween/pumpkin_witch.svg", "Halloween/skull_brain.svg", "Halloween/skull_candy.svg", "Halloween/skull_girl.svg", "Halloween/witch_hat.svg", "Thanksgiving/acorn.svg", "Thanksgiving/bread.svg", "Thanksgiving/candles.svg", "Thanksgiving/corn.svg", "Thanksgiving/drinks.svg", "Thanksgiving/maple_leaf.svg", "Thanksgiving/plate_chicken.svg", "Thanksgiving/pumpkin.svg", "Thanksgiving/pumpkin_pie.svg", "Thanksgiving/slice_pie.svg", "Thanksgiving/sun_flower.svg", "Thanksgiving/turkey_face.svg" ];
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
        var ChromeStorageValidator_awaiter = function(thisArg, _arguments, P, generator) {
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
        const ChromeStorageValidator = new class {
            isUserIconValid(userIcon) {
                return !!userIcon && (userIcon.includes("?newIconUrl=") ? newIcons.includes(userIcon.split("?newIconUrl=")[1]) && oldIcons.includes(userIcon.split("?newIconUrl=")[0]) : newIcons.includes(userIcon));
            }
            isUserIdValid(userId) {
                return "string" == typeof userId && 16 === userId.length;
            }
            isUserNickNameValid(userNickname) {
                return userNickname && "string" == typeof userNickname && userNickname.length < 20;
            }
            getDefaultUserIcon() {
                return defaultIcons[Math.floor(Math.random() * defaultIcons.length)];
            }
            getDefaultUserNickName() {
                return "";
            }
            updateStorageData(storageData) {
                return ChromeStorageValidator_awaiter(this, void 0, void 0, (function*() {
                    try {
                        yield ChromeStorage_ChromeStorageWriter.setItemsAsync(storageData);
                    } catch (error) {}
                }));
            }
            getValidatedChromeStorageDataAsync() {
                return ChromeStorageValidator_awaiter(this, void 0, void 0, (function*() {
                    const storageData = yield ChromeStorage_ChromeStorageReader.getAllItemsAsync(), validatedStorageData = ChromeStorageValidator.validateStorageData(storageData);
                    return storageData !== validatedStorageData && (yield this.updateStorageData(validatedStorageData)), 
                    validatedStorageData;
                }));
            }
            validateStorageData(storageData) {
                const validatedStorageData = "object" == typeof storageData ? Object.assign({}, storageData) : {};
                return validatedStorageData.userIcon && validatedStorageData.userIcon.includes("?newIconUrl=") && (validatedStorageData.userIcon = validatedStorageData.userIcon.split("?newIconUrl=")[1]), 
                this.isUserIconValid(validatedStorageData.userIcon) || (validatedStorageData.userIcon = this.getDefaultUserIcon()), 
                this.isUserNickNameValid(validatedStorageData.userNickname) || (validatedStorageData.userNickname = this.getDefaultUserNickName()), 
                validatedStorageData;
            }
        };
        Object.freeze(ChromeStorageValidator);
        const ChromeStorage_ChromeStorageValidator = ChromeStorageValidator;
        const EXTENSION_ID = chrome.runtime.id, SIDEBAR_URL = "https://redirect.teleparty.com/sidebar";
        const Messaging_MessagePasser = new class {
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
        };
        class Message {
            constructor(sender, target, type) {
                this.sender = sender, this.target = target, this.type = type;
            }
        }
        class BackgroundMessage extends Message {
            constructor(sender, target, type) {
                super(sender, target, type), this.type = type;
            }
        }
        class LoadSessionMessage extends BackgroundMessage {
            constructor(sender, target, data) {
                super(sender, target, BackgroundMessageType.LOAD_SESSION), this.data = data;
            }
        }
        var SocketMessageTypes, StreamingServiceName, HboVideoType;
        !function(SocketMessageTypes) {
            SocketMessageTypes.CREATE_SESSION = "createSession", SocketMessageTypes.JOIN_SESSION = "joinSession", 
            SocketMessageTypes.UPDATE_SESSION = "updateSession", SocketMessageTypes.NEXT_EPISODE_MESSAGE = "nextEpisode", 
            SocketMessageTypes.REBOOT_MESSAGE = "reboot", SocketMessageTypes.SEND_MESSAGE = "sendMessage", 
            SocketMessageTypes.JUMP_TO_NEXT_EPISODE = "jumpToNextEpisode", SocketMessageTypes.BUFFERING_MESSAGE = "buffering", 
            SocketMessageTypes.TYPING_MESSAGE = "typing", SocketMessageTypes.SET_BUFFERING_PRESENCE = "setBufferingPresence", 
            SocketMessageTypes.SET_TYPING_PRESENCE = "setTypingPresence", SocketMessageTypes.BROADCAST_USER_SETTINGS = "broadcastUserSettings", 
            SocketMessageTypes.UPDATE_SETTINGS_MESSAGE = "updateSettings", SocketMessageTypes.SET_ADS_PRESENCE = "setAdsPresence", 
            SocketMessageTypes.GET_SERVER_TIME = "getServerTime", SocketMessageTypes.LEAVE_SESSION = "leaveSession", 
            SocketMessageTypes.SEND_REACTION = "sendReaction", SocketMessageTypes.SEND_GIF = "sendGIF";
        }(SocketMessageTypes || (SocketMessageTypes = {}));
        class StreamingSerivce {
            constructor(requiredPermissions, contentScripts, serverName, name, syncFromEnd) {
                this.requiredPermissions = requiredPermissions, this.serverName = serverName, this.name = name, 
                this.contentScripts = contentScripts, this.syncFromEnd = syncFromEnd;
            }
            urlWithSessionId(sessionId) {
                return `https://redirect.teleparty.com/join/${sessionId}`;
            }
        }
        function isNetflixParty(url) {
            return url.hostname.includes(".netflix.") && url.pathname.includes("/watch");
        }
        function getHBOVideoType(url) {
            return url.includes("urn:hbo:feature") ? HboVideoType.HBO_FEATURE : url.includes("urn:hbo:episode") || url.includes("urn:hbo:page:") && url.includes(":type:episode") ? HboVideoType.HBO_EPISODE : url.includes("urn:hbo:extra") ? HboVideoType.HBO_EXTRA : HboVideoType.NONE;
        }
        function delay(milliseconds) {
            return function() {
                return new Promise((resolve => {
                    setTimeout((() => {
                        resolve();
                    }), milliseconds);
                }));
            };
        }
        !function(StreamingServiceName) {
            StreamingServiceName.NETFLIX = "NETFLIX", StreamingServiceName.HULU = "HULU", StreamingServiceName.DISNEY_PLUS = "DISNEY_PLUS", 
            StreamingServiceName.HBO_MAX = "HBO_MAX", StreamingServiceName.YOUTUBE = "YOUTUBE", 
            StreamingServiceName.AMAZON = "AMAZON";
        }(StreamingServiceName || (StreamingServiceName = {})), function(HboVideoType) {
            HboVideoType.HBO_EPISODE = "episode", HboVideoType.HBO_FEATURE = "feature", HboVideoType.HBO_EXTRA = "extra", 
            HboVideoType.NONE = "none";
        }(HboVideoType || (HboVideoType = {}));
        const Netflix = new class extends StreamingSerivce {
            isValidUrl(url) {
                return isNetflixParty(url);
            }
            getVideoId(url) {
                const match = url.pathname.match(/^.*\/([0-9]+)\??.*/);
                return match && match.length > 0 ? match[1] : void 0;
            }
            getFullscreenScript() {
                return '\n            (function() {\n                var sizingWrapper = document.getElementsByClassName("sizing-wrapper")[0];\n                    if (sizingWrapper) {\n                        sizingWrapper.requestFullscreen = function() {}\n                        document.getElementsByClassName(\'button-nfplayerFullscreen\')[0].onclick = function() {\n                            var fullScreenWrapper = document.getElementsByClassName("nf-kb-nav-wrapper")[0];\n                            fullScreenWrapper.webkitRequestFullScreen(fullScreenWrapper.ALLOW_KEYBOARD_INPUT);\n                        }\n                    }\n            })();\n        ';
            }
        }([], [ "content_scripts/netflix/netflix_content_bundled.js" ], "netflix", StreamingServiceName.NETFLIX, !1);
        Object.freeze(Netflix);
        const Services_Netflix = Netflix;
        const Hulu = new class extends StreamingSerivce {
            isValidUrl(url) {
                return function(url) {
                    return url.hostname.includes(".hulu.") && url.pathname.includes("/watch");
                }(url);
            }
            getVideoId(url) {
                const match = url.pathname.match(/^.*\/([a-z\-0-9]+)\??.*/);
                return match && match.length > 0 ? match[1] : void 0;
            }
        }([], [ "content_scripts/hulu/hulu_content_bundled.js" ], "hulu", StreamingServiceName.HULU, !1);
        Object.freeze(Hulu);
        const Services_Hulu = Hulu;
        const DisneyPlus = new class extends StreamingSerivce {
            isValidUrl(url) {
                return function(url) {
                    return url.hostname.includes(".disneyplus.") && url.pathname.includes("/video");
                }(url);
            }
            getVideoId(url) {
                const match = url.pathname.match(/^.*\/([a-z\-0-9]+)\??.*/);
                return match && match.length > 0 ? match[1] : void 0;
            }
        }([], [ "content_scripts/disney/disney_content_bundled.js" ], "disney", StreamingServiceName.DISNEY_PLUS, !1);
        Object.freeze(DisneyPlus);
        const Disney = DisneyPlus;
        const HboMax = new class extends StreamingSerivce {
            isValidUrl(url) {
                return function(url) {
                    return url.hostname.includes(".hbomax.") && "none" !== getHBOVideoType(url.pathname) || url.pathname.includes("urn:hbo:page");
                }(url);
            }
            getVideoId(url) {
                const videoUrnType = "urn:hbo:" + getHBOVideoType(url.pathname) + ":", hboQueryString = url.pathname.split(videoUrnType);
                let hboParseIds = null != hboQueryString && hboQueryString.length > 1 && null != hboQueryString[1] ? hboQueryString[1].match(/^([a-zA-Z\-_0-9]+)\??.*/) : null;
                const hboMatch = null != hboParseIds && 0 !== hboParseIds.length ? hboQueryString[1].match(/^([a-zA-Z\-_0-9]+)\??.*/) : void 0;
                let hboVideoId = hboMatch && hboMatch.length > 0 ? hboMatch[1] : void 0;
                return hboVideoId || (hboParseIds = url.pathname.match(/(page:)([a-zA-Z\-_0-9]+)\??.*/), 
                hboVideoId = null != hboParseIds && 3 == hboParseIds.length ? hboParseIds[2] : void 0), 
                hboVideoId;
            }
            getVideoType(url) {
                return getHBOVideoType(url.pathname);
            }
        }([], [ "content_scripts/hbo_max/hbo_max_content_bundled.js" ], "hbomax", StreamingServiceName.HBO_MAX, !1);
        Object.freeze(HboMax);
        const Services_HboMax = HboMax;
        const Amazon = new class extends StreamingSerivce {
            isValidUrl(url) {
                return function(url) {
                    return url.hostname.includes(".amazon.") || url.hostname.includes(".primevideo.");
                }(url);
            }
            getVideoId(url) {
                const match = url.pathname.split("ref")[0].match(/^.*\/([a-z\-0-9.A-Z]+)(\?|\/ref)?.*/);
                return null != match && match.length > 0 ? match[1] : void 0;
            }
        }([], [ "content_scripts/amazon/amazon_content_bundled.js" ], "amazon", StreamingServiceName.AMAZON, !1);
        Object.freeze(Amazon);
        const Services_Amazon = Amazon;
        const Youtube = new class extends StreamingSerivce {
            isValidUrl(url) {
                return function(url) {
                    return url.hostname.includes(".youtube.");
                }(url);
            }
            getVideoId(url) {
                if (url.href.includes("watch?") || url.href.includes("/shorts/")) {
                    const match = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm.exec(url.href);
                    return null != match && match.length > 3 && match[3] ? match[3] : void 0;
                }
                return "browsing";
            }
        }([], [ "content_scripts/youtube/youtube_content_bundled.js" ], "youtube", StreamingServiceName.YOUTUBE, !1);
        Object.freeze(Youtube);
        const Services_Youtube = Youtube;
        class ExtensionTab {
            constructor(url, id) {
                var _a;
                this.id = id, this.videoId, this.url = url;
                const validServices = [ Services_Netflix, Services_Hulu, Disney, Services_HboMax, Services_Amazon, Services_Youtube ];
                for (const service of validServices) if (service.isValidUrl(this.url)) {
                    this.streamingService = service, this.serviceName = service.name, this.videoId = service.getVideoId(url);
                    break;
                }
                this.sessionIdFromUrl = null !== (_a = function(url, key, queryIndex) {
                    const searchString = "?" + url.split("?")[queryIndex];
                    if (void 0 === searchString) return;
                    const escapedKey = key.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), match = new RegExp("[?|&]" + escapedKey + "=([^&]*)(&|$)").exec(searchString);
                    return null === match || match.length < 2 ? void 0 : decodeURIComponent(match[1]);
                }(this.url.href, "npSessionId", 1)) && void 0 !== _a ? _a : void 0;
            }
            urlWithSessionId(sessionId) {
                return this.streamingService ? this.streamingService.urlWithSessionId(sessionId) : void 0;
            }
        }
        class SocketCallbackManager {
            constructor() {
                this._callbackMap = new Map;
            }
            makeId() {
                let result = "";
                for (let i = 0; i < 16; i += 1) result += "0123456789abcdef"[Math.floor(16 * Math.random())];
                return result;
            }
            executeCallback(callbackId, data) {
                const callback = this._callbackMap.get(callbackId);
                callback && (callback(data), this._callbackMap.delete(callbackId));
            }
            addCallback(callback) {
                let newId = this.makeId();
                for (;this._callbackMap.has(newId); ) newId = this.makeId();
                return this._callbackMap.set(newId, callback), newId;
            }
        }
        var parseuri = __webpack_require__(187);
        var has_cors = __webpack_require__(58);
        const globalThis_browser = "undefined" != typeof self ? self : "undefined" != typeof window ? window : Function("return this")();
        function xmlhttprequest_browser(opts) {
            const xdomain = opts.xdomain;
            try {
                if ("undefined" != typeof XMLHttpRequest && (!xdomain || has_cors)) return new XMLHttpRequest;
            } catch (e) {}
            if (!xdomain) try {
                return new (globalThis_browser[[ "Active" ].concat("Object").join("X")])("Microsoft.XMLHTTP");
            } catch (e) {}
        }
        function pick(obj, ...attr) {
            return attr.reduce(((acc, k) => (obj.hasOwnProperty(k) && (acc[k] = obj[k]), acc)), {});
        }
        const NATIVE_SET_TIMEOUT = setTimeout, NATIVE_CLEAR_TIMEOUT = clearTimeout;
        function installTimerFunctions(obj, opts) {
            opts.useNativeTimers ? (obj.setTimeoutFn = NATIVE_SET_TIMEOUT.bind(globalThis_browser), 
            obj.clearTimeoutFn = NATIVE_CLEAR_TIMEOUT.bind(globalThis_browser)) : (obj.setTimeoutFn = setTimeout.bind(globalThis_browser), 
            obj.clearTimeoutFn = clearTimeout.bind(globalThis_browser));
        }
        var component_emitter = __webpack_require__(63);
        const PACKET_TYPES = Object.create(null);
        PACKET_TYPES.open = "0", PACKET_TYPES.close = "1", PACKET_TYPES.ping = "2", PACKET_TYPES.pong = "3", 
        PACKET_TYPES.message = "4", PACKET_TYPES.upgrade = "5", PACKET_TYPES.noop = "6";
        const PACKET_TYPES_REVERSE = Object.create(null);
        Object.keys(PACKET_TYPES).forEach((key => {
            PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
        }));
        const ERROR_PACKET = {
            type: "error",
            data: "parser error"
        }, withNativeBlob = "function" == typeof Blob || "undefined" != typeof Blob && "[object BlobConstructor]" === Object.prototype.toString.call(Blob), withNativeArrayBuffer = "function" == typeof ArrayBuffer, encodeBlobAsBase64 = (data, callback) => {
            const fileReader = new FileReader;
            return fileReader.onload = function() {
                const content = fileReader.result.split(",")[1];
                callback("b" + content);
            }, fileReader.readAsDataURL(data);
        }, encodePacket_browser = ({type, data}, supportsBinary, callback) => {
            return withNativeBlob && data instanceof Blob ? supportsBinary ? callback(data) : encodeBlobAsBase64(data, callback) : withNativeArrayBuffer && (data instanceof ArrayBuffer || (obj = data, 
            "function" == typeof ArrayBuffer.isView ? ArrayBuffer.isView(obj) : obj && obj.buffer instanceof ArrayBuffer)) ? supportsBinary ? callback(data) : encodeBlobAsBase64(new Blob([ data ]), callback) : callback(PACKET_TYPES[type] + (data || ""));
            var obj;
        };
        for (var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", lookup = "undefined" == typeof Uint8Array ? [] : new Uint8Array(256), i = 0; i < chars.length; i++) lookup[chars.charCodeAt(i)] = i;
        const decodePacket_browser_withNativeArrayBuffer = "function" == typeof ArrayBuffer, decodeBase64Packet = (data, binaryType) => {
            if (decodePacket_browser_withNativeArrayBuffer) {
                const decoded = function(base64) {
                    var i, encoded1, encoded2, encoded3, encoded4, bufferLength = .75 * base64.length, len = base64.length, p = 0;
                    "=" === base64[base64.length - 1] && (bufferLength--, "=" === base64[base64.length - 2] && bufferLength--);
                    var arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
                    for (i = 0; i < len; i += 4) encoded1 = lookup[base64.charCodeAt(i)], encoded2 = lookup[base64.charCodeAt(i + 1)], 
                    encoded3 = lookup[base64.charCodeAt(i + 2)], encoded4 = lookup[base64.charCodeAt(i + 3)], 
                    bytes[p++] = encoded1 << 2 | encoded2 >> 4, bytes[p++] = (15 & encoded2) << 4 | encoded3 >> 2, 
                    bytes[p++] = (3 & encoded3) << 6 | 63 & encoded4;
                    return arraybuffer;
                }(data);
                return mapBinary(decoded, binaryType);
            }
            return {
                base64: !0,
                data
            };
        }, mapBinary = (data, binaryType) => "blob" === binaryType && data instanceof ArrayBuffer ? new Blob([ data ]) : data, decodePacket_browser = (encodedPacket, binaryType) => {
            if ("string" != typeof encodedPacket) return {
                type: "message",
                data: mapBinary(encodedPacket, binaryType)
            };
            const type = encodedPacket.charAt(0);
            if ("b" === type) return {
                type: "message",
                data: decodeBase64Packet(encodedPacket.substring(1), binaryType)
            };
            return PACKET_TYPES_REVERSE[type] ? encodedPacket.length > 1 ? {
                type: PACKET_TYPES_REVERSE[type],
                data: encodedPacket.substring(1)
            } : {
                type: PACKET_TYPES_REVERSE[type]
            } : ERROR_PACKET;
        }, SEPARATOR = String.fromCharCode(30);
        class Transport extends component_emitter.Q {
            constructor(opts) {
                super(), this.writable = !1, installTimerFunctions(this, opts), this.opts = opts, 
                this.query = opts.query, this.readyState = "", this.socket = opts.socket;
            }
            onError(msg, desc) {
                const err = new Error(msg);
                return err.type = "TransportError", err.description = desc, super.emit("error", err), 
                this;
            }
            open() {
                return "closed" !== this.readyState && "" !== this.readyState || (this.readyState = "opening", 
                this.doOpen()), this;
            }
            close() {
                return "opening" !== this.readyState && "open" !== this.readyState || (this.doClose(), 
                this.onClose()), this;
            }
            send(packets) {
                "open" === this.readyState && this.write(packets);
            }
            onOpen() {
                this.readyState = "open", this.writable = !0, super.emit("open");
            }
            onData(data) {
                const packet = decodePacket_browser(data, this.socket.binaryType);
                this.onPacket(packet);
            }
            onPacket(packet) {
                super.emit("packet", packet);
            }
            onClose() {
                this.readyState = "closed", super.emit("close");
            }
        }
        var yeast = __webpack_require__(281), parseqs = __webpack_require__(830);
        class Polling extends Transport {
            constructor() {
                super(...arguments), this.polling = !1;
            }
            get name() {
                return "polling";
            }
            doOpen() {
                this.poll();
            }
            pause(onPause) {
                this.readyState = "pausing";
                const pause = () => {
                    this.readyState = "paused", onPause();
                };
                if (this.polling || !this.writable) {
                    let total = 0;
                    this.polling && (total++, this.once("pollComplete", (function() {
                        --total || pause();
                    }))), this.writable || (total++, this.once("drain", (function() {
                        --total || pause();
                    })));
                } else pause();
            }
            poll() {
                this.polling = !0, this.doPoll(), this.emit("poll");
            }
            onData(data) {
                ((encodedPayload, binaryType) => {
                    const encodedPackets = encodedPayload.split(SEPARATOR), packets = [];
                    for (let i = 0; i < encodedPackets.length; i++) {
                        const decodedPacket = decodePacket_browser(encodedPackets[i], binaryType);
                        if (packets.push(decodedPacket), "error" === decodedPacket.type) break;
                    }
                    return packets;
                })(data, this.socket.binaryType).forEach((packet => {
                    if ("opening" === this.readyState && "open" === packet.type && this.onOpen(), "close" === packet.type) return this.onClose(), 
                    !1;
                    this.onPacket(packet);
                })), "closed" !== this.readyState && (this.polling = !1, this.emit("pollComplete"), 
                "open" === this.readyState && this.poll());
            }
            doClose() {
                const close = () => {
                    this.write([ {
                        type: "close"
                    } ]);
                };
                "open" === this.readyState ? close() : this.once("open", close);
            }
            write(packets) {
                this.writable = !1, ((packets, callback) => {
                    const length = packets.length, encodedPackets = new Array(length);
                    let count = 0;
                    packets.forEach(((packet, i) => {
                        encodePacket_browser(packet, !1, (encodedPacket => {
                            encodedPackets[i] = encodedPacket, ++count === length && callback(encodedPackets.join(SEPARATOR));
                        }));
                    }));
                })(packets, (data => {
                    this.doWrite(data, (() => {
                        this.writable = !0, this.emit("drain");
                    }));
                }));
            }
            uri() {
                let query = this.query || {};
                const schema = this.opts.secure ? "https" : "http";
                let port = "";
                !1 !== this.opts.timestampRequests && (query[this.opts.timestampParam] = yeast()), 
                this.supportsBinary || query.sid || (query.b64 = 1), this.opts.port && ("https" === schema && 443 !== Number(this.opts.port) || "http" === schema && 80 !== Number(this.opts.port)) && (port = ":" + this.opts.port);
                const encodedQuery = parseqs.encode(query);
                return schema + "://" + (-1 !== this.opts.hostname.indexOf(":") ? "[" + this.opts.hostname + "]" : this.opts.hostname) + port + this.opts.path + (encodedQuery.length ? "?" + encodedQuery : "");
            }
        }
        function empty() {}
        const hasXHR2 = null != new xmlhttprequest_browser({
            xdomain: !1
        }).responseType;
        class Request extends component_emitter.Q {
            constructor(uri, opts) {
                super(), installTimerFunctions(this, opts), this.opts = opts, this.method = opts.method || "GET", 
                this.uri = uri, this.async = !1 !== opts.async, this.data = void 0 !== opts.data ? opts.data : null, 
                this.create();
            }
            create() {
                const opts = pick(this.opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
                opts.xdomain = !!this.opts.xd, opts.xscheme = !!this.opts.xs;
                const xhr = this.xhr = new xmlhttprequest_browser(opts);
                try {
                    xhr.open(this.method, this.uri, this.async);
                    try {
                        if (this.opts.extraHeaders) {
                            xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(!0);
                            for (let i in this.opts.extraHeaders) this.opts.extraHeaders.hasOwnProperty(i) && xhr.setRequestHeader(i, this.opts.extraHeaders[i]);
                        }
                    } catch (e) {}
                    if ("POST" === this.method) try {
                        xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
                    } catch (e) {}
                    try {
                        xhr.setRequestHeader("Accept", "*/*");
                    } catch (e) {}
                    "withCredentials" in xhr && (xhr.withCredentials = this.opts.withCredentials), this.opts.requestTimeout && (xhr.timeout = this.opts.requestTimeout), 
                    xhr.onreadystatechange = () => {
                        4 === xhr.readyState && (200 === xhr.status || 1223 === xhr.status ? this.onLoad() : this.setTimeoutFn((() => {
                            this.onError("number" == typeof xhr.status ? xhr.status : 0);
                        }), 0));
                    }, xhr.send(this.data);
                } catch (e) {
                    return void this.setTimeoutFn((() => {
                        this.onError(e);
                    }), 0);
                }
                "undefined" != typeof document && (this.index = Request.requestsCount++, Request.requests[this.index] = this);
            }
            onSuccess() {
                this.emit("success"), this.cleanup();
            }
            onData(data) {
                this.emit("data", data), this.onSuccess();
            }
            onError(err) {
                this.emit("error", err), this.cleanup(!0);
            }
            cleanup(fromError) {
                if (void 0 !== this.xhr && null !== this.xhr) {
                    if (this.xhr.onreadystatechange = empty, fromError) try {
                        this.xhr.abort();
                    } catch (e) {}
                    "undefined" != typeof document && delete Request.requests[this.index], this.xhr = null;
                }
            }
            onLoad() {
                const data = this.xhr.responseText;
                null !== data && this.onData(data);
            }
            abort() {
                this.cleanup();
            }
        }
        if (Request.requestsCount = 0, Request.requests = {}, "undefined" != typeof document) if ("function" == typeof attachEvent) attachEvent("onunload", unloadHandler); else if ("function" == typeof addEventListener) {
            addEventListener("onpagehide" in globalThis_browser ? "pagehide" : "unload", unloadHandler, !1);
        }
        function unloadHandler() {
            for (let i in Request.requests) Request.requests.hasOwnProperty(i) && Request.requests[i].abort();
        }
        const nextTick = "function" == typeof Promise && "function" == typeof Promise.resolve ? cb => Promise.resolve().then(cb) : (cb, setTimeoutFn) => setTimeoutFn(cb, 0), websocket_constructor_browser_WebSocket = globalThis_browser.WebSocket || globalThis_browser.MozWebSocket, isReactNative = "undefined" != typeof navigator && "string" == typeof navigator.product && "reactnative" === navigator.product.toLowerCase();
        class WS extends Transport {
            constructor(opts) {
                super(opts), this.supportsBinary = !opts.forceBase64;
            }
            get name() {
                return "websocket";
            }
            doOpen() {
                if (!this.check()) return;
                const uri = this.uri(), protocols = this.opts.protocols, opts = isReactNative ? {} : pick(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
                this.opts.extraHeaders && (opts.headers = this.opts.extraHeaders);
                try {
                    this.ws = isReactNative ? new websocket_constructor_browser_WebSocket(uri, protocols, opts) : protocols ? new websocket_constructor_browser_WebSocket(uri, protocols) : new websocket_constructor_browser_WebSocket(uri);
                } catch (err) {
                    return this.emit("error", err);
                }
                this.ws.binaryType = this.socket.binaryType || "arraybuffer", this.addEventListeners();
            }
            addEventListeners() {
                this.ws.onopen = () => {
                    this.opts.autoUnref && this.ws._socket.unref(), this.onOpen();
                }, this.ws.onclose = this.onClose.bind(this), this.ws.onmessage = ev => this.onData(ev.data), 
                this.ws.onerror = e => this.onError("websocket error", e);
            }
            write(packets) {
                this.writable = !1;
                for (let i = 0; i < packets.length; i++) {
                    const packet = packets[i], lastPacket = i === packets.length - 1;
                    encodePacket_browser(packet, this.supportsBinary, (data => {
                        try {
                            this.ws.send(data);
                        } catch (e) {}
                        lastPacket && nextTick((() => {
                            this.writable = !0, this.emit("drain");
                        }), this.setTimeoutFn);
                    }));
                }
            }
            doClose() {
                void 0 !== this.ws && (this.ws.close(), this.ws = null);
            }
            uri() {
                let query = this.query || {};
                const schema = this.opts.secure ? "wss" : "ws";
                let port = "";
                this.opts.port && ("wss" === schema && 443 !== Number(this.opts.port) || "ws" === schema && 80 !== Number(this.opts.port)) && (port = ":" + this.opts.port), 
                this.opts.timestampRequests && (query[this.opts.timestampParam] = yeast()), this.supportsBinary || (query.b64 = 1);
                const encodedQuery = parseqs.encode(query);
                return schema + "://" + (-1 !== this.opts.hostname.indexOf(":") ? "[" + this.opts.hostname + "]" : this.opts.hostname) + port + this.opts.path + (encodedQuery.length ? "?" + encodedQuery : "");
            }
            check() {
                return !(!websocket_constructor_browser_WebSocket || "__initialize" in websocket_constructor_browser_WebSocket && this.name === WS.prototype.name);
            }
        }
        const transports = {
            websocket: WS,
            polling: class extends Polling {
                constructor(opts) {
                    if (super(opts), "undefined" != typeof location) {
                        const isSSL = "https:" === location.protocol;
                        let port = location.port;
                        port || (port = isSSL ? "443" : "80"), this.xd = "undefined" != typeof location && opts.hostname !== location.hostname || port !== opts.port, 
                        this.xs = opts.secure !== isSSL;
                    }
                    const forceBase64 = opts && opts.forceBase64;
                    this.supportsBinary = hasXHR2 && !forceBase64;
                }
                request(opts = {}) {
                    return Object.assign(opts, {
                        xd: this.xd,
                        xs: this.xs
                    }, this.opts), new Request(this.uri(), opts);
                }
                doWrite(data, fn) {
                    const req = this.request({
                        method: "POST",
                        data
                    });
                    req.on("success", fn), req.on("error", (err => {
                        this.onError("xhr post error", err);
                    }));
                }
                doPoll() {
                    const req = this.request();
                    req.on("data", this.onData.bind(this)), req.on("error", (err => {
                        this.onError("xhr poll error", err);
                    })), this.pollXhr = req;
                }
            }
        };
        class Socket extends component_emitter.Q {
            constructor(uri, opts = {}) {
                super(), uri && "object" == typeof uri && (opts = uri, uri = null), uri ? (uri = parseuri(uri), 
                opts.hostname = uri.host, opts.secure = "https" === uri.protocol || "wss" === uri.protocol, 
                opts.port = uri.port, uri.query && (opts.query = uri.query)) : opts.host && (opts.hostname = parseuri(opts.host).host), 
                installTimerFunctions(this, opts), this.secure = null != opts.secure ? opts.secure : "undefined" != typeof location && "https:" === location.protocol, 
                opts.hostname && !opts.port && (opts.port = this.secure ? "443" : "80"), this.hostname = opts.hostname || ("undefined" != typeof location ? location.hostname : "localhost"), 
                this.port = opts.port || ("undefined" != typeof location && location.port ? location.port : this.secure ? "443" : "80"), 
                this.transports = opts.transports || [ "polling", "websocket" ], this.readyState = "", 
                this.writeBuffer = [], this.prevBufferLen = 0, this.opts = Object.assign({
                    path: "/engine.io",
                    agent: !1,
                    withCredentials: !1,
                    upgrade: !0,
                    timestampParam: "t",
                    rememberUpgrade: !1,
                    rejectUnauthorized: !0,
                    perMessageDeflate: {
                        threshold: 1024
                    },
                    transportOptions: {},
                    closeOnBeforeunload: !0
                }, opts), this.opts.path = this.opts.path.replace(/\/$/, "") + "/", "string" == typeof this.opts.query && (this.opts.query = parseqs.decode(this.opts.query)), 
                this.id = null, this.upgrades = null, this.pingInterval = null, this.pingTimeout = null, 
                this.pingTimeoutTimer = null, "function" == typeof addEventListener && (this.opts.closeOnBeforeunload && addEventListener("beforeunload", (() => {
                    this.transport && (this.transport.removeAllListeners(), this.transport.close());
                }), !1), "localhost" !== this.hostname && (this.offlineEventListener = () => {
                    this.onClose("transport close");
                }, addEventListener("offline", this.offlineEventListener, !1))), this.open();
            }
            createTransport(name) {
                const query = function(obj) {
                    const o = {};
                    for (let i in obj) obj.hasOwnProperty(i) && (o[i] = obj[i]);
                    return o;
                }(this.opts.query);
                query.EIO = 4, query.transport = name, this.id && (query.sid = this.id);
                const opts = Object.assign({}, this.opts.transportOptions[name], this.opts, {
                    query,
                    socket: this,
                    hostname: this.hostname,
                    secure: this.secure,
                    port: this.port
                });
                return new transports[name](opts);
            }
            open() {
                let transport;
                if (this.opts.rememberUpgrade && Socket.priorWebsocketSuccess && -1 !== this.transports.indexOf("websocket")) transport = "websocket"; else {
                    if (0 === this.transports.length) return void this.setTimeoutFn((() => {
                        this.emitReserved("error", "No transports available");
                    }), 0);
                    transport = this.transports[0];
                }
                this.readyState = "opening";
                try {
                    transport = this.createTransport(transport);
                } catch (e) {
                    return this.transports.shift(), void this.open();
                }
                transport.open(), this.setTransport(transport);
            }
            setTransport(transport) {
                this.transport && this.transport.removeAllListeners(), this.transport = transport, 
                transport.on("drain", this.onDrain.bind(this)).on("packet", this.onPacket.bind(this)).on("error", this.onError.bind(this)).on("close", (() => {
                    this.onClose("transport close");
                }));
            }
            probe(name) {
                let transport = this.createTransport(name), failed = !1;
                Socket.priorWebsocketSuccess = !1;
                const onTransportOpen = () => {
                    failed || (transport.send([ {
                        type: "ping",
                        data: "probe"
                    } ]), transport.once("packet", (msg => {
                        if (!failed) if ("pong" === msg.type && "probe" === msg.data) {
                            if (this.upgrading = !0, this.emitReserved("upgrading", transport), !transport) return;
                            Socket.priorWebsocketSuccess = "websocket" === transport.name, this.transport.pause((() => {
                                failed || "closed" !== this.readyState && (cleanup(), this.setTransport(transport), 
                                transport.send([ {
                                    type: "upgrade"
                                } ]), this.emitReserved("upgrade", transport), transport = null, this.upgrading = !1, 
                                this.flush());
                            }));
                        } else {
                            const err = new Error("probe error");
                            err.transport = transport.name, this.emitReserved("upgradeError", err);
                        }
                    })));
                };
                function freezeTransport() {
                    failed || (failed = !0, cleanup(), transport.close(), transport = null);
                }
                const onerror = err => {
                    const error = new Error("probe error: " + err);
                    error.transport = transport.name, freezeTransport(), this.emitReserved("upgradeError", error);
                };
                function onTransportClose() {
                    onerror("transport closed");
                }
                function onclose() {
                    onerror("socket closed");
                }
                function onupgrade(to) {
                    transport && to.name !== transport.name && freezeTransport();
                }
                const cleanup = () => {
                    transport.removeListener("open", onTransportOpen), transport.removeListener("error", onerror), 
                    transport.removeListener("close", onTransportClose), this.off("close", onclose), 
                    this.off("upgrading", onupgrade);
                };
                transport.once("open", onTransportOpen), transport.once("error", onerror), transport.once("close", onTransportClose), 
                this.once("close", onclose), this.once("upgrading", onupgrade), transport.open();
            }
            onOpen() {
                if (this.readyState = "open", Socket.priorWebsocketSuccess = "websocket" === this.transport.name, 
                this.emitReserved("open"), this.flush(), "open" === this.readyState && this.opts.upgrade && this.transport.pause) {
                    let i = 0;
                    const l = this.upgrades.length;
                    for (;i < l; i++) this.probe(this.upgrades[i]);
                }
            }
            onPacket(packet) {
                if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) switch (this.emitReserved("packet", packet), 
                this.emitReserved("heartbeat"), packet.type) {
                  case "open":
                    this.onHandshake(JSON.parse(packet.data));
                    break;

                  case "ping":
                    this.resetPingTimeout(), this.sendPacket("pong"), this.emitReserved("ping"), this.emitReserved("pong");
                    break;

                  case "error":
                    const err = new Error("server error");
                    err.code = packet.data, this.onError(err);
                    break;

                  case "message":
                    this.emitReserved("data", packet.data), this.emitReserved("message", packet.data);
                }
            }
            onHandshake(data) {
                this.emitReserved("handshake", data), this.id = data.sid, this.transport.query.sid = data.sid, 
                this.upgrades = this.filterUpgrades(data.upgrades), this.pingInterval = data.pingInterval, 
                this.pingTimeout = data.pingTimeout, this.onOpen(), "closed" !== this.readyState && this.resetPingTimeout();
            }
            resetPingTimeout() {
                this.clearTimeoutFn(this.pingTimeoutTimer), this.pingTimeoutTimer = this.setTimeoutFn((() => {
                    this.onClose("ping timeout");
                }), this.pingInterval + this.pingTimeout), this.opts.autoUnref && this.pingTimeoutTimer.unref();
            }
            onDrain() {
                this.writeBuffer.splice(0, this.prevBufferLen), this.prevBufferLen = 0, 0 === this.writeBuffer.length ? this.emitReserved("drain") : this.flush();
            }
            flush() {
                "closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length && (this.transport.send(this.writeBuffer), 
                this.prevBufferLen = this.writeBuffer.length, this.emitReserved("flush"));
            }
            write(msg, options, fn) {
                return this.sendPacket("message", msg, options, fn), this;
            }
            send(msg, options, fn) {
                return this.sendPacket("message", msg, options, fn), this;
            }
            sendPacket(type, data, options, fn) {
                if ("function" == typeof data && (fn = data, data = void 0), "function" == typeof options && (fn = options, 
                options = null), "closing" === this.readyState || "closed" === this.readyState) return;
                (options = options || {}).compress = !1 !== options.compress;
                const packet = {
                    type,
                    data,
                    options
                };
                this.emitReserved("packetCreate", packet), this.writeBuffer.push(packet), fn && this.once("flush", fn), 
                this.flush();
            }
            close() {
                const close = () => {
                    this.onClose("forced close"), this.transport.close();
                }, cleanupAndClose = () => {
                    this.off("upgrade", cleanupAndClose), this.off("upgradeError", cleanupAndClose), 
                    close();
                }, waitForUpgrade = () => {
                    this.once("upgrade", cleanupAndClose), this.once("upgradeError", cleanupAndClose);
                };
                return "opening" !== this.readyState && "open" !== this.readyState || (this.readyState = "closing", 
                this.writeBuffer.length ? this.once("drain", (() => {
                    this.upgrading ? waitForUpgrade() : close();
                })) : this.upgrading ? waitForUpgrade() : close()), this;
            }
            onError(err) {
                Socket.priorWebsocketSuccess = !1, this.emitReserved("error", err), this.onClose("transport error", err);
            }
            onClose(reason, desc) {
                "opening" !== this.readyState && "open" !== this.readyState && "closing" !== this.readyState || (this.clearTimeoutFn(this.pingTimeoutTimer), 
                this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), 
                "function" == typeof removeEventListener && removeEventListener("offline", this.offlineEventListener, !1), 
                this.readyState = "closed", this.id = null, this.emitReserved("close", reason, desc), 
                this.writeBuffer = [], this.prevBufferLen = 0);
            }
            filterUpgrades(upgrades) {
                const filteredUpgrades = [];
                let i = 0;
                const j = upgrades.length;
                for (;i < j; i++) ~this.transports.indexOf(upgrades[i]) && filteredUpgrades.push(upgrades[i]);
                return filteredUpgrades;
            }
        }
        Socket.protocol = 4;
        Socket.protocol;
        const is_binary_withNativeArrayBuffer = "function" == typeof ArrayBuffer, is_binary_toString = Object.prototype.toString, is_binary_withNativeBlob = "function" == typeof Blob || "undefined" != typeof Blob && "[object BlobConstructor]" === is_binary_toString.call(Blob), withNativeFile = "function" == typeof File || "undefined" != typeof File && "[object FileConstructor]" === is_binary_toString.call(File);
        function isBinary(obj) {
            return is_binary_withNativeArrayBuffer && (obj instanceof ArrayBuffer || (obj => "function" == typeof ArrayBuffer.isView ? ArrayBuffer.isView(obj) : obj.buffer instanceof ArrayBuffer)(obj)) || is_binary_withNativeBlob && obj instanceof Blob || withNativeFile && obj instanceof File;
        }
        function hasBinary(obj, toJSON) {
            if (!obj || "object" != typeof obj) return !1;
            if (Array.isArray(obj)) {
                for (let i = 0, l = obj.length; i < l; i++) if (hasBinary(obj[i])) return !0;
                return !1;
            }
            if (isBinary(obj)) return !0;
            if (obj.toJSON && "function" == typeof obj.toJSON && 1 === arguments.length) return hasBinary(obj.toJSON(), !0);
            for (const key in obj) if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) return !0;
            return !1;
        }
        function deconstructPacket(packet) {
            const buffers = [], packetData = packet.data, pack = packet;
            return pack.data = _deconstructPacket(packetData, buffers), pack.attachments = buffers.length, 
            {
                packet: pack,
                buffers
            };
        }
        function _deconstructPacket(data, buffers) {
            if (!data) return data;
            if (isBinary(data)) {
                const placeholder = {
                    _placeholder: !0,
                    num: buffers.length
                };
                return buffers.push(data), placeholder;
            }
            if (Array.isArray(data)) {
                const newData = new Array(data.length);
                for (let i = 0; i < data.length; i++) newData[i] = _deconstructPacket(data[i], buffers);
                return newData;
            }
            if ("object" == typeof data && !(data instanceof Date)) {
                const newData = {};
                for (const key in data) Object.prototype.hasOwnProperty.call(data, key) && (newData[key] = _deconstructPacket(data[key], buffers));
                return newData;
            }
            return data;
        }
        function reconstructPacket(packet, buffers) {
            return packet.data = _reconstructPacket(packet.data, buffers), packet.attachments = void 0, 
            packet;
        }
        function _reconstructPacket(data, buffers) {
            if (!data) return data;
            if (data && data._placeholder) return buffers[data.num];
            if (Array.isArray(data)) for (let i = 0; i < data.length; i++) data[i] = _reconstructPacket(data[i], buffers); else if ("object" == typeof data) for (const key in data) Object.prototype.hasOwnProperty.call(data, key) && (data[key] = _reconstructPacket(data[key], buffers));
            return data;
        }
        const build_esm_protocol = 5;
        var PacketType;
        !function(PacketType) {
            PacketType[PacketType.CONNECT = 0] = "CONNECT", PacketType[PacketType.DISCONNECT = 1] = "DISCONNECT", 
            PacketType[PacketType.EVENT = 2] = "EVENT", PacketType[PacketType.ACK = 3] = "ACK", 
            PacketType[PacketType.CONNECT_ERROR = 4] = "CONNECT_ERROR", PacketType[PacketType.BINARY_EVENT = 5] = "BINARY_EVENT", 
            PacketType[PacketType.BINARY_ACK = 6] = "BINARY_ACK";
        }(PacketType || (PacketType = {}));
        class Encoder {
            encode(obj) {
                return obj.type !== PacketType.EVENT && obj.type !== PacketType.ACK || !hasBinary(obj) ? [ this.encodeAsString(obj) ] : (obj.type = obj.type === PacketType.EVENT ? PacketType.BINARY_EVENT : PacketType.BINARY_ACK, 
                this.encodeAsBinary(obj));
            }
            encodeAsString(obj) {
                let str = "" + obj.type;
                return obj.type !== PacketType.BINARY_EVENT && obj.type !== PacketType.BINARY_ACK || (str += obj.attachments + "-"), 
                obj.nsp && "/" !== obj.nsp && (str += obj.nsp + ","), null != obj.id && (str += obj.id), 
                null != obj.data && (str += JSON.stringify(obj.data)), str;
            }
            encodeAsBinary(obj) {
                const deconstruction = deconstructPacket(obj), pack = this.encodeAsString(deconstruction.packet), buffers = deconstruction.buffers;
                return buffers.unshift(pack), buffers;
            }
        }
        class Decoder extends component_emitter.Q {
            constructor() {
                super();
            }
            add(obj) {
                let packet;
                if ("string" == typeof obj) packet = this.decodeString(obj), packet.type === PacketType.BINARY_EVENT || packet.type === PacketType.BINARY_ACK ? (this.reconstructor = new BinaryReconstructor(packet), 
                0 === packet.attachments && super.emitReserved("decoded", packet)) : super.emitReserved("decoded", packet); else {
                    if (!isBinary(obj) && !obj.base64) throw new Error("Unknown type: " + obj);
                    if (!this.reconstructor) throw new Error("got binary data when not reconstructing a packet");
                    packet = this.reconstructor.takeBinaryData(obj), packet && (this.reconstructor = null, 
                    super.emitReserved("decoded", packet));
                }
            }
            decodeString(str) {
                let i = 0;
                const p = {
                    type: Number(str.charAt(0))
                };
                if (void 0 === PacketType[p.type]) throw new Error("unknown packet type " + p.type);
                if (p.type === PacketType.BINARY_EVENT || p.type === PacketType.BINARY_ACK) {
                    const start = i + 1;
                    for (;"-" !== str.charAt(++i) && i != str.length; ) ;
                    const buf = str.substring(start, i);
                    if (buf != Number(buf) || "-" !== str.charAt(i)) throw new Error("Illegal attachments");
                    p.attachments = Number(buf);
                }
                if ("/" === str.charAt(i + 1)) {
                    const start = i + 1;
                    for (;++i; ) {
                        if ("," === str.charAt(i)) break;
                        if (i === str.length) break;
                    }
                    p.nsp = str.substring(start, i);
                } else p.nsp = "/";
                const next = str.charAt(i + 1);
                if ("" !== next && Number(next) == next) {
                    const start = i + 1;
                    for (;++i; ) {
                        const c = str.charAt(i);
                        if (null == c || Number(c) != c) {
                            --i;
                            break;
                        }
                        if (i === str.length) break;
                    }
                    p.id = Number(str.substring(start, i + 1));
                }
                if (str.charAt(++i)) {
                    const payload = function(str) {
                        try {
                            return JSON.parse(str);
                        } catch (e) {
                            return !1;
                        }
                    }(str.substr(i));
                    if (!Decoder.isPayloadValid(p.type, payload)) throw new Error("invalid payload");
                    p.data = payload;
                }
                return p;
            }
            static isPayloadValid(type, payload) {
                switch (type) {
                  case PacketType.CONNECT:
                    return "object" == typeof payload;

                  case PacketType.DISCONNECT:
                    return void 0 === payload;

                  case PacketType.CONNECT_ERROR:
                    return "string" == typeof payload || "object" == typeof payload;

                  case PacketType.EVENT:
                  case PacketType.BINARY_EVENT:
                    return Array.isArray(payload) && payload.length > 0;

                  case PacketType.ACK:
                  case PacketType.BINARY_ACK:
                    return Array.isArray(payload);
                }
            }
            destroy() {
                this.reconstructor && this.reconstructor.finishedReconstruction();
            }
        }
        class BinaryReconstructor {
            constructor(packet) {
                this.packet = packet, this.buffers = [], this.reconPack = packet;
            }
            takeBinaryData(binData) {
                if (this.buffers.push(binData), this.buffers.length === this.reconPack.attachments) {
                    const packet = reconstructPacket(this.reconPack, this.buffers);
                    return this.finishedReconstruction(), packet;
                }
                return null;
            }
            finishedReconstruction() {
                this.reconPack = null, this.buffers = [];
            }
        }
        function on(obj, ev, fn) {
            return obj.on(ev, fn), function() {
                obj.off(ev, fn);
            };
        }
        const RESERVED_EVENTS = Object.freeze({
            connect: 1,
            connect_error: 1,
            disconnect: 1,
            disconnecting: 1,
            newListener: 1,
            removeListener: 1
        });
        class socket_Socket extends component_emitter.Q {
            constructor(io, nsp, opts) {
                super(), this.connected = !1, this.disconnected = !0, this.receiveBuffer = [], this.sendBuffer = [], 
                this.ids = 0, this.acks = {}, this.flags = {}, this.io = io, this.nsp = nsp, opts && opts.auth && (this.auth = opts.auth), 
                this.io._autoConnect && this.open();
            }
            subEvents() {
                if (this.subs) return;
                const io = this.io;
                this.subs = [ on(io, "open", this.onopen.bind(this)), on(io, "packet", this.onpacket.bind(this)), on(io, "error", this.onerror.bind(this)), on(io, "close", this.onclose.bind(this)) ];
            }
            get active() {
                return !!this.subs;
            }
            connect() {
                return this.connected || (this.subEvents(), this.io._reconnecting || this.io.open(), 
                "open" === this.io._readyState && this.onopen()), this;
            }
            open() {
                return this.connect();
            }
            send(...args) {
                return args.unshift("message"), this.emit.apply(this, args), this;
            }
            emit(ev, ...args) {
                if (RESERVED_EVENTS.hasOwnProperty(ev)) throw new Error('"' + ev + '" is a reserved event name');
                args.unshift(ev);
                const packet = {
                    type: PacketType.EVENT,
                    data: args,
                    options: {}
                };
                if (packet.options.compress = !1 !== this.flags.compress, "function" == typeof args[args.length - 1]) {
                    const id = this.ids++, ack = args.pop();
                    this._registerAckCallback(id, ack), packet.id = id;
                }
                const isTransportWritable = this.io.engine && this.io.engine.transport && this.io.engine.transport.writable;
                return this.flags.volatile && (!isTransportWritable || !this.connected) || (this.connected ? this.packet(packet) : this.sendBuffer.push(packet)), 
                this.flags = {}, this;
            }
            _registerAckCallback(id, ack) {
                const timeout = this.flags.timeout;
                if (void 0 === timeout) return void (this.acks[id] = ack);
                const timer = this.io.setTimeoutFn((() => {
                    delete this.acks[id];
                    for (let i = 0; i < this.sendBuffer.length; i++) this.sendBuffer[i].id === id && this.sendBuffer.splice(i, 1);
                    ack.call(this, new Error("operation has timed out"));
                }), timeout);
                this.acks[id] = (...args) => {
                    this.io.clearTimeoutFn(timer), ack.apply(this, [ null, ...args ]);
                };
            }
            packet(packet) {
                packet.nsp = this.nsp, this.io._packet(packet);
            }
            onopen() {
                "function" == typeof this.auth ? this.auth((data => {
                    this.packet({
                        type: PacketType.CONNECT,
                        data
                    });
                })) : this.packet({
                    type: PacketType.CONNECT,
                    data: this.auth
                });
            }
            onerror(err) {
                this.connected || this.emitReserved("connect_error", err);
            }
            onclose(reason) {
                this.connected = !1, this.disconnected = !0, delete this.id, this.emitReserved("disconnect", reason);
            }
            onpacket(packet) {
                if (packet.nsp === this.nsp) switch (packet.type) {
                  case PacketType.CONNECT:
                    if (packet.data && packet.data.sid) {
                        const id = packet.data.sid;
                        this.onconnect(id);
                    } else this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
                    break;

                  case PacketType.EVENT:
                  case PacketType.BINARY_EVENT:
                    this.onevent(packet);
                    break;

                  case PacketType.ACK:
                  case PacketType.BINARY_ACK:
                    this.onack(packet);
                    break;

                  case PacketType.DISCONNECT:
                    this.ondisconnect();
                    break;

                  case PacketType.CONNECT_ERROR:
                    this.destroy();
                    const err = new Error(packet.data.message);
                    err.data = packet.data.data, this.emitReserved("connect_error", err);
                }
            }
            onevent(packet) {
                const args = packet.data || [];
                null != packet.id && args.push(this.ack(packet.id)), this.connected ? this.emitEvent(args) : this.receiveBuffer.push(Object.freeze(args));
            }
            emitEvent(args) {
                if (this._anyListeners && this._anyListeners.length) {
                    const listeners = this._anyListeners.slice();
                    for (const listener of listeners) listener.apply(this, args);
                }
                super.emit.apply(this, args);
            }
            ack(id) {
                const self = this;
                let sent = !1;
                return function(...args) {
                    sent || (sent = !0, self.packet({
                        type: PacketType.ACK,
                        id,
                        data: args
                    }));
                };
            }
            onack(packet) {
                const ack = this.acks[packet.id];
                "function" == typeof ack && (ack.apply(this, packet.data), delete this.acks[packet.id]);
            }
            onconnect(id) {
                this.id = id, this.connected = !0, this.disconnected = !1, this.emitBuffered(), 
                this.emitReserved("connect");
            }
            emitBuffered() {
                this.receiveBuffer.forEach((args => this.emitEvent(args))), this.receiveBuffer = [], 
                this.sendBuffer.forEach((packet => this.packet(packet))), this.sendBuffer = [];
            }
            ondisconnect() {
                this.destroy(), this.onclose("io server disconnect");
            }
            destroy() {
                this.subs && (this.subs.forEach((subDestroy => subDestroy())), this.subs = void 0), 
                this.io._destroy(this);
            }
            disconnect() {
                return this.connected && this.packet({
                    type: PacketType.DISCONNECT
                }), this.destroy(), this.connected && this.onclose("io client disconnect"), this;
            }
            close() {
                return this.disconnect();
            }
            compress(compress) {
                return this.flags.compress = compress, this;
            }
            get volatile() {
                return this.flags.volatile = !0, this;
            }
            timeout(timeout) {
                return this.flags.timeout = timeout, this;
            }
            onAny(listener) {
                return this._anyListeners = this._anyListeners || [], this._anyListeners.push(listener), 
                this;
            }
            prependAny(listener) {
                return this._anyListeners = this._anyListeners || [], this._anyListeners.unshift(listener), 
                this;
            }
            offAny(listener) {
                if (!this._anyListeners) return this;
                if (listener) {
                    const listeners = this._anyListeners;
                    for (let i = 0; i < listeners.length; i++) if (listener === listeners[i]) return listeners.splice(i, 1), 
                    this;
                } else this._anyListeners = [];
                return this;
            }
            listenersAny() {
                return this._anyListeners || [];
            }
        }
        var backo2 = __webpack_require__(10);
        class Manager extends component_emitter.Q {
            constructor(uri, opts) {
                var _a;
                super(), this.nsps = {}, this.subs = [], uri && "object" == typeof uri && (opts = uri, 
                uri = void 0), (opts = opts || {}).path = opts.path || "/socket.io", this.opts = opts, 
                installTimerFunctions(this, opts), this.reconnection(!1 !== opts.reconnection), 
                this.reconnectionAttempts(opts.reconnectionAttempts || 1 / 0), this.reconnectionDelay(opts.reconnectionDelay || 1e3), 
                this.reconnectionDelayMax(opts.reconnectionDelayMax || 5e3), this.randomizationFactor(null !== (_a = opts.randomizationFactor) && void 0 !== _a ? _a : .5), 
                this.backoff = new backo2({
                    min: this.reconnectionDelay(),
                    max: this.reconnectionDelayMax(),
                    jitter: this.randomizationFactor()
                }), this.timeout(null == opts.timeout ? 2e4 : opts.timeout), this._readyState = "closed", 
                this.uri = uri;
                const _parser = opts.parser || socket_io_parser_build_esm_namespaceObject;
                this.encoder = new _parser.Encoder, this.decoder = new _parser.Decoder, this._autoConnect = !1 !== opts.autoConnect, 
                this._autoConnect && this.open();
            }
            reconnection(v) {
                return arguments.length ? (this._reconnection = !!v, this) : this._reconnection;
            }
            reconnectionAttempts(v) {
                return void 0 === v ? this._reconnectionAttempts : (this._reconnectionAttempts = v, 
                this);
            }
            reconnectionDelay(v) {
                var _a;
                return void 0 === v ? this._reconnectionDelay : (this._reconnectionDelay = v, null === (_a = this.backoff) || void 0 === _a || _a.setMin(v), 
                this);
            }
            randomizationFactor(v) {
                var _a;
                return void 0 === v ? this._randomizationFactor : (this._randomizationFactor = v, 
                null === (_a = this.backoff) || void 0 === _a || _a.setJitter(v), this);
            }
            reconnectionDelayMax(v) {
                var _a;
                return void 0 === v ? this._reconnectionDelayMax : (this._reconnectionDelayMax = v, 
                null === (_a = this.backoff) || void 0 === _a || _a.setMax(v), this);
            }
            timeout(v) {
                return arguments.length ? (this._timeout = v, this) : this._timeout;
            }
            maybeReconnectOnOpen() {
                !this._reconnecting && this._reconnection && 0 === this.backoff.attempts && this.reconnect();
            }
            open(fn) {
                if (~this._readyState.indexOf("open")) return this;
                this.engine = new Socket(this.uri, this.opts);
                const socket = this.engine, self = this;
                this._readyState = "opening", this.skipReconnect = !1;
                const openSubDestroy = on(socket, "open", (function() {
                    self.onopen(), fn && fn();
                })), errorSub = on(socket, "error", (err => {
                    self.cleanup(), self._readyState = "closed", this.emitReserved("error", err), fn ? fn(err) : self.maybeReconnectOnOpen();
                }));
                if (!1 !== this._timeout) {
                    const timeout = this._timeout;
                    0 === timeout && openSubDestroy();
                    const timer = this.setTimeoutFn((() => {
                        openSubDestroy(), socket.close(), socket.emit("error", new Error("timeout"));
                    }), timeout);
                    this.opts.autoUnref && timer.unref(), this.subs.push((function() {
                        clearTimeout(timer);
                    }));
                }
                return this.subs.push(openSubDestroy), this.subs.push(errorSub), this;
            }
            connect(fn) {
                return this.open(fn);
            }
            onopen() {
                this.cleanup(), this._readyState = "open", this.emitReserved("open");
                const socket = this.engine;
                this.subs.push(on(socket, "ping", this.onping.bind(this)), on(socket, "data", this.ondata.bind(this)), on(socket, "error", this.onerror.bind(this)), on(socket, "close", this.onclose.bind(this)), on(this.decoder, "decoded", this.ondecoded.bind(this)));
            }
            onping() {
                this.emitReserved("ping");
            }
            ondata(data) {
                this.decoder.add(data);
            }
            ondecoded(packet) {
                this.emitReserved("packet", packet);
            }
            onerror(err) {
                this.emitReserved("error", err);
            }
            socket(nsp, opts) {
                let socket = this.nsps[nsp];
                return socket || (socket = new socket_Socket(this, nsp, opts), this.nsps[nsp] = socket), 
                socket;
            }
            _destroy(socket) {
                const nsps = Object.keys(this.nsps);
                for (const nsp of nsps) {
                    if (this.nsps[nsp].active) return;
                }
                this._close();
            }
            _packet(packet) {
                const encodedPackets = this.encoder.encode(packet);
                for (let i = 0; i < encodedPackets.length; i++) this.engine.write(encodedPackets[i], packet.options);
            }
            cleanup() {
                this.subs.forEach((subDestroy => subDestroy())), this.subs.length = 0, this.decoder.destroy();
            }
            _close() {
                this.skipReconnect = !0, this._reconnecting = !1, this.onclose("forced close"), 
                this.engine && this.engine.close();
            }
            disconnect() {
                return this._close();
            }
            onclose(reason) {
                this.cleanup(), this.backoff.reset(), this._readyState = "closed", this.emitReserved("close", reason), 
                this._reconnection && !this.skipReconnect && this.reconnect();
            }
            reconnect() {
                if (this._reconnecting || this.skipReconnect) return this;
                const self = this;
                if (this.backoff.attempts >= this._reconnectionAttempts) this.backoff.reset(), this.emitReserved("reconnect_failed"), 
                this._reconnecting = !1; else {
                    const delay = this.backoff.duration();
                    this._reconnecting = !0;
                    const timer = this.setTimeoutFn((() => {
                        self.skipReconnect || (this.emitReserved("reconnect_attempt", self.backoff.attempts), 
                        self.skipReconnect || self.open((err => {
                            err ? (self._reconnecting = !1, self.reconnect(), this.emitReserved("reconnect_error", err)) : self.onreconnect();
                        })));
                    }), delay);
                    this.opts.autoUnref && timer.unref(), this.subs.push((function() {
                        clearTimeout(timer);
                    }));
                }
            }
            onreconnect() {
                const attempt = this.backoff.attempts;
                this._reconnecting = !1, this.backoff.reset(), this.emitReserved("reconnect", attempt);
            }
        }
        const cache = {};
        function esm_lookup(uri, opts) {
            "object" == typeof uri && (opts = uri, uri = void 0);
            const parsed = function(uri, path = "", loc) {
                let obj = uri;
                loc = loc || "undefined" != typeof location && location, null == uri && (uri = loc.protocol + "//" + loc.host), 
                "string" == typeof uri && ("/" === uri.charAt(0) && (uri = "/" === uri.charAt(1) ? loc.protocol + uri : loc.host + uri), 
                /^(https?|wss?):\/\//.test(uri) || (uri = void 0 !== loc ? loc.protocol + "//" + uri : "https://" + uri), 
                obj = parseuri(uri)), obj.port || (/^(http|ws)$/.test(obj.protocol) ? obj.port = "80" : /^(http|ws)s$/.test(obj.protocol) && (obj.port = "443")), 
                obj.path = obj.path || "/";
                const host = -1 !== obj.host.indexOf(":") ? "[" + obj.host + "]" : obj.host;
                return obj.id = obj.protocol + "://" + host + ":" + obj.port + path, obj.href = obj.protocol + "://" + host + (loc && loc.port === obj.port ? "" : ":" + obj.port), 
                obj;
            }(uri, (opts = opts || {}).path || "/socket.io"), source = parsed.source, id = parsed.id, path = parsed.path, sameNamespace = cache[id] && path in cache[id].nsps;
            let io;
            return opts.forceNew || opts["force new connection"] || !1 === opts.multiplex || sameNamespace ? io = new Manager(source, opts) : (cache[id] || (cache[id] = new Manager(source, opts)), 
            io = cache[id]), parsed.query && !opts.query && (opts.query = parsed.queryKey), 
            io.socket(parsed.path, opts);
        }
        Object.assign(esm_lookup, {
            Manager,
            Socket: socket_Socket,
            io: esm_lookup,
            connect: esm_lookup
        });
        var ChatApiMessageType, VideoApiMessageType, PopupMessageType, ClientMessageType, SocketWrapper_awaiter = function(thisArg, _arguments, P, generator) {
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
        class SocketWrapper {
            constructor(socketUrl, socketEventHandler, tabId) {
                this._socketErrorCount = 0, this._useSocketIOSocket = !1, this._active = !0, this._socketEventHandler = socketEventHandler, 
                this._socketUrl = socketUrl, this._reconnectAttempts = 0, this._callbackManager = new SocketCallbackManager, 
                this._uwsSocket = new WebSocket(this._socketUrl), this._handleSocketEvents(), this._connectTimeOut = setTimeout(this._onConnectTimeout.bind(this), 5e3), 
                this._tabId = tabId;
            }
            getId() {
                return this._userId;
            }
            getType() {
                return void 0 !== this._uwsSocket ? "uws" : "socket.io";
            }
            getTransport() {
                var _a;
                return void 0 !== this._uwsSocket ? "websocket" : null === (_a = this._socketIOSocket) || void 0 === _a ? void 0 : _a.io.engine.transport.name;
            }
            getSocketStartTime() {
                return this._socketStartTimeMs;
            }
            _getSocketSession() {
                return {
                    id: this.getId(),
                    type: this.getType(),
                    transport: this.getTransport(),
                    start_time_ms: this.getSocketStartTime()
                };
            }
            _onConnectTimeout() {
                var _a, _b;
                null === (_a = this._socketIOSocket) || void 0 === _a || _a.disconnect(), null === (_b = this._uwsSocket) || void 0 === _b || _b.close(4500), 
                console.log("Connect timed out, switching servers");
                const logEventData = {
                    name: "socket_error",
                    action: {
                        description: this._useSocketIOSocket ? "socket.io" : "uws failed to connect in time",
                        reason: "connect timed out"
                    },
                    socket_session: this._getSocketSession()
                };
                Background_BackgroundService.logEventForTabId(logEventData, this._tabId), this._doReconnect();
            }
            loadSessionData(data, userSetting) {
                this._sessionId = data.sessionId, this._socketEventHandler.loadSessionData(data, userSetting);
            }
            clearSessionData() {
                this._sessionId = void 0, this._socketEventHandler.clearSessionData();
            }
            getCurrentSessionData() {
                return this._socketEventHandler.getSessionData();
            }
            _handleSocketEvents() {
                this._uwsSocket && (this._uwsSocket.onmessage = this._onWebSocketMessage.bind(this), 
                this._uwsSocket.onclose = this._onClose.bind(this), this._uwsSocket.onerror = this._onError.bind(this), 
                this._uwsSocket.onopen = this._onOpen.bind(this), this._keepAliveInterval = setInterval(this._ping.bind(this), 45e3));
            }
            _handleSocketIOEvents() {
                this._socketIOSocket && (this._socketIOSocket.on("connect", (() => {
                    this._onOpen();
                })), this._socketIOSocket.on("connect_error", (event => {
                    console.log(`connect_error due to ${event.message}`), debug(event);
                    const logData = {
                        name: "socket_error",
                        action: {
                            description: event.message,
                            reason: "socket reported error."
                        },
                        socket_session: this._getSocketSession()
                    };
                    Background_BackgroundService.logEventForTabId(logData, this._tabId);
                })), this._socketIOSocket.on("disconnect", (reason => {
                    this._clearConnectTimeout(), debug("Socket io disconnect"), this._keepAliveInterval && clearInterval(this._keepAliveInterval), 
                    debug("Websocket lost connection: " + reason);
                    const logData = {
                        name: "socket_close",
                        action: {
                            description: "socket.io socket closed",
                            reason
                        },
                        socket_session: this._getSocketSession()
                    };
                    if (Background_BackgroundService.logEventForTabId(logData, this._tabId), "io client disconnect" !== reason) this._doReconnect(); else if (this._sessionId) {
                        const logData = {
                            name: "party_disconnect",
                            action: {
                                reason: "party disconnected manually."
                            },
                            socket_session: this._getSocketSession()
                        };
                        Background_BackgroundService.logEventForTabId(logData, this._tabId);
                    }
                })), this._socketIOSocket.on("message", (data => {
                    var _a;
                    if ("ping" === data) null === (_a = this._socketIOSocket) || void 0 === _a || _a.emit("pong"); else {
                        const message = JSON.parse(data);
                        this._onMessage(message);
                    }
                })));
            }
            _ping() {
                var _a;
                1 == (null === (_a = this._uwsSocket) || void 0 === _a ? void 0 : _a.readyState) && this._uwsSocket.send(JSON.stringify({
                    type: "ping"
                }));
            }
            _onOpen() {
                this._socketStartTimeMs = Date.now(), this._clearConnectTimeout();
                const logData = {
                    name: "socket_open",
                    socket_session: this._getSocketSession()
                };
                if (Background_BackgroundService.logEventForTabId(logData, this._tabId), this._reconnectTimeOut) {
                    clearTimeout(this._reconnectTimeOut), this._socketEventHandler.onReconnect();
                    const logData = {
                        name: "party_reconnect",
                        action: {
                            description: "party reconnected using " + (this._useSocketIOSocket ? "socket.io" : "uws") + " after " + this._reconnectAttempts + " attempts.",
                            reason: "party reconnected."
                        },
                        socket_session: this._getSocketSession()
                    };
                    Background_BackgroundService.logEventForTabId(logData, this._tabId);
                }
                this._resetReconnectTimeout();
            }
            _resetReconnectTimeout() {
                this._reconnectTimeOut && clearTimeout(this._reconnectTimeOut), this._reconnectTimeOut = void 0, 
                this._reconnectAttempts = 0;
            }
            _clearConnectTimeout() {
                console.log("Clearing connect timeout"), this._connectTimeOut && clearTimeout(this._connectTimeOut);
            }
            _onClose(event) {
                this._clearConnectTimeout();
                const logData = {
                    name: "socket_close",
                    action: {
                        description: "uws socket closed",
                        reason: String(event.code)
                    },
                    socket_session: this._getSocketSession()
                };
                if (Background_BackgroundService.logEventForTabId(logData, this._tabId), 4500 !== event.code) {
                    if (debug("Websocket lost connection"), 1007 === event.code) {
                        const oldLogData = {
                            sessionId: this._sessionId,
                            eventType: "socket-close-" + event.code
                        };
                        Background_BackgroundService.logOldEventAsync(oldLogData);
                    }
                    this._doReconnect();
                } else {
                    if (this._sessionId) {
                        const logData = {
                            name: "party_disconnect",
                            action: {
                                reason: "party disconnected manually."
                            },
                            socket_session: this._getSocketSession()
                        };
                        Background_BackgroundService.logEventForTabId(logData, this._tabId);
                    }
                    debug("Websocket connection closed manually");
                }
            }
            _getReconnectTimeoutInterval() {
                return 1e3 * Math.pow(2, this._reconnectAttempts);
            }
            _doReconnect() {
                if (this._active) if (this._increaseErrorCount(), this._reconnectAttempts++, this._reconnectAttempts > 10) this._socketEventHandler.onReconnectFailed(); else {
                    let timeoutDelay = this._getReconnectTimeoutInterval();
                    debug("Recreating socket with delay: " + timeoutDelay), void 0 === this._userId && this._reconnectAttempts <= 2 && (timeoutDelay = 500), 
                    this._reconnectTimeOut = setTimeout(this._recreateSocket.bind(this), timeoutDelay);
                }
            }
            _recreateSocket() {
                try {
                    this._socketErrorCount >= 3 || this._reconnectAttempts > 1 ? this._useSocketIOSocket = !this._useSocketIOSocket : this._useSocketIOSocket = !1, 
                    this._useSocketIOSocket ? this._uwsSocket = void 0 : this._socketIOSocket = void 0;
                    const logData = {
                        name: "socket_reconnect_attempt",
                        action: {
                            description: "attempting to reconnect using " + (this._useSocketIOSocket ? "socket.io" : "uws"),
                            reason: "reconnecting after socket disconnect"
                        },
                        socket_session: this._getSocketSession()
                    };
                    Background_BackgroundService.logEventForTabId(logData, this._tabId), this._useSocketIOSocket ? (this._socketIOSocket = esm_lookup("https://socketio.teleparty.com", {
                        reconnection: !1,
                        withCredentials: !0
                    }), this._handleSocketIOEvents()) : (this._uwsSocket = new WebSocket(this._socketUrl), 
                    this._handleSocketEvents()), this._clearConnectTimeout(), this._connectTimeOut = setTimeout(this._onConnectTimeout.bind(this), 5e3);
                } catch (error) {
                    console.warn("Failed to recreate socket: " + (10 - this._reconnectAttempts) + " attempts remaining");
                }
            }
            _increaseErrorCount() {
                this._socketErrorCount += 1;
            }
            _onError(event) {
                debug("WebSocket error observed:", event);
                const logData = {
                    name: "socket_error",
                    action: {
                        description: "uws socket error",
                        reason: "socket reported error."
                    },
                    socket_session: this._getSocketSession()
                };
                Background_BackgroundService.logEventForTabId(logData, this._tabId);
            }
            _onWebSocketMessage(event) {
                try {
                    const message = JSON.parse(event.data);
                    this._onMessage(message);
                } catch (error) {
                    debug("An error occured while parsing a message from the server");
                }
            }
            _onMessage(message) {
                "userId" === message.type ? this._onUserId(message.data.userId) : message.callbackId ? this._callbackManager.executeCallback(message.callbackId, message.data) : this._socketEventHandler.onMessage(message);
            }
            _onUserId(userId) {
                debug("User id:  " + userId), null == this._userId && (this._userId = userId, this._socketEventHandler.setUserId(userId));
            }
            teardown() {
                var _a, _b;
                this._active = !1;
                try {
                    null === (_a = this._uwsSocket) || void 0 === _a || _a.close(4500), null === (_b = this._socketIOSocket) || void 0 === _b || _b.disconnect();
                } catch (e) {}
                this._reconnectTimeOut && clearTimeout(this._reconnectTimeOut), this._keepAliveInterval && clearInterval(this._keepAliveInterval);
            }
            sendMessage(type, data, callback) {
                var _a, _b;
                let callbackId = "null";
                callback && (callbackId = this._callbackManager.addCallback(callback));
                const socketMessage = this._formatMessage(type, data, callbackId), messageString = JSON.stringify(socketMessage);
                this._useSocketIOSocket ? null === (_a = this._socketIOSocket) || void 0 === _a || _a.send(messageString) : null === (_b = this._uwsSocket) || void 0 === _b || _b.send(messageString);
            }
            _formatMessage(type, data, callbackId) {
                return {
                    type,
                    data,
                    callbackId
                };
            }
            getUserIdAsync() {
                var _a;
                return SocketWrapper_awaiter(this, void 0, void 0, (function*() {
                    debug("user Id promise called: "), this._reconnectTimeOut && (this._resetReconnectTimeout(), 
                    this._recreateSocket());
                    try {
                        return yield function(condition, maxDelay, delayStep = 250) {
                            return function() {
                                const startTime = (new Date).getTime(), checkForCondition = function() {
                                    return condition() ? Promise.resolve() : null !== maxDelay && (new Date).getTime() - startTime > maxDelay ? Promise.reject(new Error("delayUntil timed out: " + condition)) : delay(delayStep)().then(checkForCondition);
                                };
                                return checkForCondition();
                            };
                        }((() => null != this._userId), 2e4)(), null !== (_a = this._userId) && void 0 !== _a ? _a : "";
                    } catch (error) {
                        const logEventData = {
                            name: "connection_error",
                            action: {
                                description: error,
                                reason: "failed to get user id"
                            },
                            socket_session: this._getSocketSession()
                        };
                        Background_BackgroundService.logEventForTabId(logEventData, this._tabId);
                        const oldLogData = {
                            sessionId: this._sessionId,
                            eventType: "connection-fail"
                        };
                        throw Background_BackgroundService.logOldEventAsync(oldLogData), new Error("Could not get a response from the socket in time. Please refresh the page and try again.");
                    }
                }));
            }
        }
        class ChatApiMessage extends Message {
            constructor(sender, target, type) {
                super(sender, target, type), this.type = type;
            }
        }
        !function(ChatApiMessageType) {
            ChatApiMessageType.INIT_CHAT = "initChat", ChatApiMessageType.ON_MESSAGE = "onMessage", 
            ChatApiMessageType.ON_BUFFER = "onBuffer", ChatApiMessageType.ON_TYPING = "onTyping", 
            ChatApiMessageType.ON_WATCHING_ADS = "onWatchingAds", ChatApiMessageType.UPDATE_SETTINGS = "updateSettings", 
            ChatApiMessageType.ON_REACTION = "onReaction", ChatApiMessageType.ON_GIF = "onGif", 
            ChatApiMessageType.ON_LOG_EVENT = "onLogEvent";
        }(ChatApiMessageType || (ChatApiMessageType = {}));
        class OnSendMessage extends ChatApiMessage {
            constructor(sender, target, data) {
                super(sender, target, ChatApiMessageType.ON_MESSAGE), this.data = data;
            }
        }
        class OnSendReaction extends ChatApiMessage {
            constructor(sender, target, data) {
                super(sender, target, ChatApiMessageType.ON_REACTION), this.data = data;
            }
        }
        class UpdateSettingsMessage extends ChatApiMessage {
            constructor(sender, target, data) {
                super(sender, target, ChatApiMessageType.UPDATE_SETTINGS), this.data = data;
            }
        }
        class BufferingMessage extends ChatApiMessage {
            constructor(sender, target, data) {
                super(sender, target, ChatApiMessageType.ON_BUFFER), this.data = data;
            }
        }
        class TypingMessage extends ChatApiMessage {
            constructor(sender, target, data) {
                super(sender, target, ChatApiMessageType.ON_TYPING), this.data = data;
            }
        }
        class WatchingAdsMessage extends ChatApiMessage {
            constructor(sender, target, data) {
                super(sender, target, ChatApiMessageType.ON_WATCHING_ADS), this.data = data;
            }
        }
        class VideoApiMessage extends Message {
            constructor(sender, target, type) {
                super(sender, target, type), this.type = type;
            }
        }
        !function(VideoApiMessageType) {
            VideoApiMessageType.UPDATE_SESSION = "updateSession", VideoApiMessageType.NEXT_EPISODE = "nextEpisode", 
            VideoApiMessageType.REBOOT_SESSION = "rebootSession", VideoApiMessageType.GET_SERVER_TIME = "getServerTime", 
            VideoApiMessageType.RELOAD_PARTY = "reloadParty";
        }(VideoApiMessageType || (VideoApiMessageType = {}));
        class UpdateSessionMessage extends VideoApiMessage {
            constructor(sender, target, data) {
                super(sender, target, VideoApiMessageType.UPDATE_SESSION), this.data = data;
            }
        }
        class SessionDataManager {
            loadSessionData(sessionData, userSettings) {
                this._redirectData = sessionData, this._redirectData && (this._redirectData.userSettings = userSettings, 
                this._redirectData.messages || (this._redirectData.messages = []));
            }
            get sessionData() {
                return this._redirectData;
            }
            set sessionData(redirectData) {
                this._redirectData = redirectData;
            }
        }
        class NextEpisodeMessage extends VideoApiMessage {
            constructor(sender, target, data) {
                super(sender, target, VideoApiMessageType.NEXT_EPISODE), this.data = data;
            }
        }
        class RebootSessionMessage extends VideoApiMessage {
            constructor(sender, target, data) {
                super(sender, target, VideoApiMessageType.REBOOT_SESSION), this.data = data;
            }
        }
        class OnSendGif extends ChatApiMessage {
            constructor(sender, target, data) {
                super(sender, target, ChatApiMessageType.ON_GIF), this.data = data;
            }
        }
        class BackgroundSocketEventHandler {
            constructor(tabId) {
                this._tabId = tabId, this._dataManager = new SessionDataManager;
            }
            setUserId(userId) {
                this._userId = userId;
            }
            onMessage(message) {
                switch (message.type) {
                  case SocketMessageTypes.SEND_MESSAGE:
                    this._onSendMessage(message);
                    break;

                  case SocketMessageTypes.SET_BUFFERING_PRESENCE:
                    this._onBufferPresence(message);
                    break;

                  case SocketMessageTypes.SET_TYPING_PRESENCE:
                    this._onTypingPresence(message);
                    break;

                  case SocketMessageTypes.SET_ADS_PRESENCE:
                    this._onAdsPresence(message);
                    break;

                  case SocketMessageTypes.UPDATE_SETTINGS_MESSAGE:
                    this._updateSettings(message);
                    break;

                  case SocketMessageTypes.UPDATE_SESSION:
                    this._updateSession(message);
                    break;

                  case SocketMessageTypes.JUMP_TO_NEXT_EPISODE:
                    this._onNextEpisode(message);
                    break;

                  case SocketMessageTypes.SEND_REACTION:
                    this._onSendReaction(message);
                    break;

                  case SocketMessageTypes.SEND_GIF:
                    this._onSendGIF(message);
                }
            }
            clearSessionData() {
                this._dataManager.sessionData = void 0;
            }
            getSessionData() {
                return this._dataManager.sessionData;
            }
            loadSessionData(data, userSettings) {
                this._dataManager.loadSessionData(data, userSettings);
            }
            setDataManager(dataManager) {
                this._dataManager = dataManager;
            }
            onConnect() {
                debug("Connected to server");
            }
            onReconnectFailed() {
                const reloadPartyMessage = new VideoApiMessage("Service_Background", "Content_Script", VideoApiMessageType.RELOAD_PARTY);
                Socket_SocketPool.removeSocketForTabId(this._tabId), Messaging_MessagePasser.sendMessageToTabAsync(reloadPartyMessage, this._tabId);
            }
            onReconnect() {
                if (this._dataManager.sessionData) {
                    const socketWrapper = Socket_SocketPool.getSocketForTabId(this._tabId);
                    null == socketWrapper || socketWrapper.sendMessage(SocketMessageTypes.REBOOT_MESSAGE, this._dataManager.sessionData, (rebootResponse => {
                        if (!rebootResponse || rebootResponse.errorMessage) rebootResponse && console.log(rebootResponse.errorMessage), 
                        this.onReconnectFailed(); else {
                            const rebootCompleteMessage = new RebootSessionMessage("Service_Background", "Content_Script", rebootResponse);
                            Messaging_MessagePasser.sendMessageToTabAsync(rebootCompleteMessage, this._tabId).then((success => {
                                success || this.onReconnectFailed();
                            }));
                        }
                    }));
                }
            }
            _onSendMessage(message) {
                var _a;
                const sessionChatMessage = new OnSendMessage("Service_Background", "Content_Script", message.data);
                Messaging_MessagePasser.sendMessageToTabAsync(sessionChatMessage, this._tabId), 
                null === (_a = this._dataManager.sessionData) || void 0 === _a || _a.messages.push(sessionChatMessage.data);
            }
            _onBufferPresence(message) {
                const bufferMessage = new BufferingMessage("Service_Background", "Content_Script", message.data);
                bufferMessage.data.usersBuffering = bufferMessage.data.usersBuffering.filter((user => user != this._userId)), 
                Messaging_MessagePasser.sendMessageToTabAsync(bufferMessage, this._tabId);
            }
            _onTypingPresence(message) {
                const typingMessage = new TypingMessage("Service_Background", "Content_Script", message.data);
                typingMessage.data.usersTyping = typingMessage.data.usersTyping.filter((user => user != this._userId)), 
                Messaging_MessagePasser.sendMessageToTabAsync(typingMessage, this._tabId);
            }
            _onSendReaction(message) {
                const reactionMessage = new OnSendReaction("Service_Background", "Content_Script", message.data);
                Messaging_MessagePasser.sendMessageToTabAsync(reactionMessage, this._tabId);
            }
            _onSendGIF(message) {
                var _a;
                const gifMessage = new OnSendGif("Service_Background", "Content_Script", message.data);
                Messaging_MessagePasser.sendMessageToTabAsync(gifMessage, this._tabId), null === (_a = this._dataManager.sessionData) || void 0 === _a || _a.messages.push(gifMessage.data);
            }
            _onAdsPresence(message) {
                const adsMessage = new WatchingAdsMessage("Service_Background", "Content_Script", message.data);
                adsMessage.data.usersWatchingAds = adsMessage.data.usersWatchingAds.filter((user => user != this._userId)), 
                Messaging_MessagePasser.sendMessageToTabAsync(adsMessage, this._tabId);
            }
            _updateSettings(message) {
                const updateMessage = new UpdateSettingsMessage("Service_Background", "Content_Script", message.data);
                Messaging_MessagePasser.sendMessageToTabAsync(updateMessage, this._tabId), this._dataManager.sessionData && this._dataManager.sessionData.permId == updateMessage.data.permId && (this._dataManager.sessionData.userSettings, 
                updateMessage.data.userSettings);
            }
            _updateSession(message) {
                const updateMessage = new UpdateSessionMessage("Service_Background", "Content_Script", message.data);
                Messaging_MessagePasser.sendMessageToTabAsync(updateMessage, this._tabId), this._dataManager.sessionData && (this._dataManager.sessionData.state = updateMessage.data.state, 
                this._dataManager.sessionData.lastKnownTime = updateMessage.data.lastKnownTime, 
                this._dataManager.sessionData.lastKnownTimeUpdatedAt = updateMessage.data.lastKnownTimeUpdatedAt);
            }
            _onNextEpisode(message) {
                const nextEpisodeMessage = new NextEpisodeMessage("Service_Background", "Content_Script", message.data);
                Messaging_MessagePasser.sendMessageToTabAsync(nextEpisodeMessage, this._tabId), 
                this._dataManager.sessionData && (this._dataManager.sessionData.videoId = nextEpisodeMessage.data.videoId);
            }
        }
        class SocketCreator {
            constructor(tabId) {
                this._tabId = tabId;
            }
            createSocketForTab() {
                const socketEventHandler = new BackgroundSocketEventHandler(this._tabId), socketWrapper = new SocketWrapper("wss://ws.teleparty.com", socketEventHandler, this._tabId);
                return debug("Created Socket with url: wss://ws.teleparty.com"), socketWrapper;
            }
        }
        !function(PopupMessageType) {
            PopupMessageType.CREATE_SESSION = "createSession", PopupMessageType.RE_INJECT = "reInject", 
            PopupMessageType.GET_INIT_DATA = "getInitData", PopupMessageType.IS_CONTENT_SCRIPT_READY = "isContentScriptReady", 
            PopupMessageType.SET_CHAT_VISIBLE = "setChatVisible", PopupMessageType.DISCONNECT = "teardown", 
            PopupMessageType.CLOSE_POPUP = "closePopup";
        }(PopupMessageType || (PopupMessageType = {})), function(ClientMessageType) {
            ClientMessageType.BROADCAST = "brodadcast", ClientMessageType.BROADCAST_NEXT_EPISODE = "broadcastNextEpisode", 
            ClientMessageType.SEND_MESSAGE = "sendMessage", ClientMessageType.CONTENT_SCRIPT_READY = "contentScriptReady", 
            ClientMessageType.CONTENT_SCRIPT_ERROR = "contentScriptError", ClientMessageType.TEARDOWN = "teardown", 
            ClientMessageType.GET_SESSION_DATA = "getSessionData", ClientMessageType.SET_TYPING = "setTyping", 
            ClientMessageType.SET_BUFFERING = "setBuffering", ClientMessageType.SET_WATCHING_ADS = "setWatchingAds", 
            ClientMessageType.BROADCAST_USER_SETTINGS = "brodadcastUserSettings", ClientMessageType.SEND_REACTION = "sendReaction", 
            ClientMessageType.SEND_GIF = "sendGIF";
        }(ClientMessageType || (ClientMessageType = {}));
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
        const ChromeStorage_SessionMap = SessionMap;
        class BackgroundSocketMessageForwarder {
            constructor() {
                debug("Message forwarder"), this._registerChromeListeners();
            }
            _receiveMessage(message, sender, sendResponse) {
                if ("Service_Background" === message.target) {
                    if (message.type == ClientMessageType.BROADCAST) {
                        const castMessage = message;
                        return this._sendToSocket(SocketMessageTypes.UPDATE_SESSION, castMessage.data, sender, sendResponse), 
                        !0;
                    }
                    if (message.type == ClientMessageType.SEND_MESSAGE) {
                        const castMessage = message;
                        return this._sendToSocket(SocketMessageTypes.SEND_MESSAGE, castMessage.data, sender, sendResponse), 
                        !0;
                    }
                    if (message.type == ClientMessageType.SET_TYPING) {
                        const castMessage = message;
                        return this._sendToSocket(SocketMessageTypes.SET_TYPING_PRESENCE, castMessage.data, sender, sendResponse), 
                        !0;
                    }
                    if (message.type == ClientMessageType.SET_BUFFERING) {
                        const castMessage = message;
                        return this._sendToSocket(SocketMessageTypes.SET_BUFFERING_PRESENCE, castMessage.data, sender, sendResponse), 
                        !0;
                    }
                    if (message.type == ClientMessageType.SET_WATCHING_ADS) {
                        const castMessage = message;
                        return this._sendToSocket(SocketMessageTypes.SET_ADS_PRESENCE, castMessage.data, sender, sendResponse), 
                        !0;
                    }
                    if (message.type === ClientMessageType.BROADCAST_USER_SETTINGS) {
                        const castMessage = message;
                        return this._sendToSocket(SocketMessageTypes.BROADCAST_USER_SETTINGS, castMessage.data, sender, sendResponse), 
                        !0;
                    }
                    if (message.type === ClientMessageType.BROADCAST_NEXT_EPISODE) {
                        const castMessage = message;
                        return this._sendToSocket(SocketMessageTypes.NEXT_EPISODE_MESSAGE, castMessage.data, sender, sendResponse), 
                        !0;
                    }
                    if (message.type === VideoApiMessageType.GET_SERVER_TIME) return this._sendToSocket(SocketMessageTypes.GET_SERVER_TIME, {}, sender, sendResponse), 
                    !0;
                    if (message.type == ClientMessageType.SEND_REACTION) {
                        const castMessage = message;
                        return this._sendToSocket(SocketMessageTypes.SEND_REACTION, castMessage.data, sender, sendResponse), 
                        !0;
                    }
                    if (message.type == ClientMessageType.SEND_GIF) {
                        const castMessage = message;
                        return this._sendToSocket(SocketMessageTypes.SEND_GIF, castMessage.data, sender, sendResponse), 
                        !0;
                    }
                    if (message.type == BackgroundMessageType.REBOOT) {
                        const castMessage = message, socketWrapper = Socket_SocketPool.getSocketForTabId(castMessage.data.tabId);
                        return null == socketWrapper || socketWrapper.sendMessage(SocketMessageTypes.REBOOT_MESSAGE, castMessage.data.sessionData, sendResponse), 
                        debug("Attempted to reboot session"), !0;
                    }
                }
                return !1;
            }
            _sendToSocket(type, data, sender, callback) {
                const socketWrapper = this._getSocketForSender(sender);
                null == socketWrapper || socketWrapper.sendMessage(type, data, callback);
            }
            _getSocketForSender(sender) {
                var _a;
                const tabId = null === (_a = sender.tab) || void 0 === _a ? void 0 : _a.id;
                return tabId ? Socket_SocketPool.getSocketForTabId(tabId) : void 0;
            }
            _registerChromeListeners() {
                Messaging_MessagePasser.addListener(this._receiveMessage.bind(this));
            }
        }
        class PopupMessage extends Message {
            constructor(sender, target, type) {
                super(sender, target, type), this.type = type;
            }
        }
        class ClosePopup extends PopupMessage {
            constructor(sender, target) {
                super(sender, target, PopupMessageType.CLOSE_POPUP);
            }
        }
        class IsContentScriptReadyMessage extends PopupMessage {
            constructor(sender, target) {
                super(sender, target, PopupMessageType.IS_CONTENT_SCRIPT_READY);
            }
        }
        var getRandomValues, rnds8 = new Uint8Array(16);
        function rng() {
            if (!getRandomValues && !(getRandomValues = "undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || "undefined" != typeof msCrypto && "function" == typeof msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto))) throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
            return getRandomValues(rnds8);
        }
        const regex = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
        const esm_browser_validate = function(uuid) {
            return "string" == typeof uuid && regex.test(uuid);
        };
        for (var byteToHex = [], stringify_i = 0; stringify_i < 256; ++stringify_i) byteToHex.push((stringify_i + 256).toString(16).substr(1));
        const esm_browser_stringify = function(arr) {
            var offset = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
            if (!esm_browser_validate(uuid)) throw TypeError("Stringified UUID is invalid");
            return uuid;
        };
        const esm_browser_v4 = function(options, buf, offset) {
            var rnds = (options = options || {}).random || (options.rng || rng)();
            if (rnds[6] = 15 & rnds[6] | 64, rnds[8] = 63 & rnds[8] | 128, buf) {
                offset = offset || 0;
                for (var i = 0; i < 16; ++i) buf[offset + i] = rnds[i];
                return buf;
            }
            return esm_browser_stringify(rnds);
        };
        function generateUUID() {
            try {
                return esm_browser_v4();
            } catch (e) {
                return "";
            }
        }
        var BackgroundDataManager_awaiter = function(thisArg, _arguments, P, generator) {
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
        class BackgroundDataManager {
            constructor() {
                this._logWindow = null, this.setupListeners(), this.loadUserId(), this._videoSessionStartTime = 0, 
                this._lastHeartBeat = 0, this._totalHeartBeat = 0, this._heartBeatDuration = 0, 
                this._appId = generateUUID(), this._videoSessionID = generateUUID(), this._startTime = Date.now(), 
                this._eventNumber = 0, this._videoInterval = 0, this._stayAliveTabs = new Map;
            }
            setEventWindow(window) {
                this._logWindow = window;
            }
            closeEventWindow() {
                this._logWindow && (this._logWindow.close(), this._logWindow = null);
            }
            eventPostMessage(logEvent, origin) {
                var _a;
                null === (_a = this._logWindow) || void 0 === _a || _a.postMessage(logEvent, origin);
            }
            addAliveTab(tabId, timeout) {
                this._stayAliveTabs.set(tabId, timeout);
            }
            removeAliveTab(tabId) {
                const timeout = this._stayAliveTabs.get(tabId);
                timeout && clearTimeout(timeout), this._stayAliveTabs.delete(tabId);
            }
            checkAliveTab(tabId) {
                return this._stayAliveTabs.has(tabId);
            }
            clearTimeout(tabId) {
                const timeout = this._stayAliveTabs.get(tabId);
                timeout && clearTimeout(timeout);
            }
            getVideoSessionData() {
                return {
                    id: this._videoSessionID,
                    start_time_ms: this._videoSessionStartTime,
                    heartbeat_duration_ms: this._heartBeatDuration,
                    total_duration_ms: this._totalHeartBeat
                };
            }
            resetVideoSession() {
                this._videoSessionID = generateUUID(), this._videoSessionStartTime = Date.now(), 
                this._lastHeartBeat = Date.now(), this._totalHeartBeat = 0, this._videoInterval = 0;
            }
            pauseHeartBeat() {
                this._heartBeatDuration = 0 === this._lastHeartBeat ? Date.now() - this._videoSessionStartTime : Date.now() - this._lastHeartBeat, 
                this._totalHeartBeat += this._heartBeatDuration;
            }
            resumeHeartBeat() {
                this._lastHeartBeat = Date.now(), this._heartBeatDuration = 0, this._videoInterval = 0;
            }
            heartBeatProc() {
                this._heartBeatDuration = 0 === this._lastHeartBeat ? Date.now() - this._videoSessionStartTime : Date.now() - this._lastHeartBeat, 
                this._totalHeartBeat += this._heartBeatDuration, this._lastHeartBeat = Date.now(), 
                this._videoInterval = 0;
            }
            incrementAppSessionEventNumber() {
                this._eventNumber++;
            }
            getAppSession() {
                return {
                    id: this._appId,
                    start_time_ms: this._startTime,
                    event_number: this._eventNumber
                };
            }
            onUpdateAvailable() {
                chrome.runtime.reload();
            }
            setupListeners() {
                chrome.tabs.onUpdated.addListener(this.tabListener.bind(this)), chrome.runtime.onInstalled.addListener(this.onInstall.bind(this)), 
                chrome.storage.onChanged.addListener(((changes, areaName) => {
                    console.log("storage change: " + JSON.stringify(changes) + " for " + JSON.stringify(areaName));
                })), chrome.runtime.onUpdateAvailable.addListener(this.onUpdateAvailable.bind(this));
            }
            onInstall(details) {
                if ("install" == details.reason) {
                    console.log("This is a first install!");
                    const thisVersion = chrome.runtime.getManifest().version;
                    Background_BackgroundService.logNewEvent({
                        name: "install",
                        action: {
                            description: "install extension for the first time version " + thisVersion
                        }
                    }), Background_BackgroundService.logOldEventAsync({
                        eventType: "install"
                    }), chrome.tabs.create({
                        url: "https://redirect.teleparty.com/get-started"
                    });
                } else if ("update" == details.reason) {
                    chrome.runtime.sendMessage("test");
                    const thisVersion = chrome.runtime.getManifest().version;
                    console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!"), 
                    Background_BackgroundService.logOldEventAsync({
                        eventType: "update-" + thisVersion
                    });
                }
            }
            validateId(id) {
                return 16 === id.length;
            }
            setUserId() {
                const browser = navigator.userAgent.toLowerCase().indexOf("edg") > -1 ? "edge" : "chrome";
                console.log("browser: " + browser);
                const queryParams = "?browser=" + browser, xhr = new XMLHttpRequest;
                xhr.onreadystatechange = () => {
                    if (xhr.readyState == XMLHttpRequest.DONE) {
                        const userId = xhr.responseText, date = new Date;
                        this.validateId(userId) && (chrome.storage.local.set({
                            userId,
                            recentlyUpdated: !0,
                            recentlyUpdated3: !0,
                            date: date.toString()
                        }, (function() {
                            console.log("Settings saved");
                        })), chrome.runtime.setUninstallURL("https://www.teleparty.com/uninstall?userId=" + userId + "&browser=chrome&version=" + encodeURIComponent(chrome.runtime.getManifest().version)));
                    }
                }, xhr.open("GET", "https://data3.netflixparty.com/create-userId" + queryParams, !0), 
                xhr.send(null);
            }
            loadUserId() {
                try {
                    chrome.storage.local.get(null, (data => {
                        data.userId && ChromeStorage_ChromeStorageValidator.isUserIdValid(data.userId) ? chrome.runtime.setUninstallURL("https://www.teleparty.com/uninstall?userId=" + data.userId + "&browser=chrome&version=" + encodeURIComponent(chrome.runtime.getManifest().version)) : (console.log("userId undefined/invalid in local storage -> now setting"), 
                        this.setUserId());
                    }));
                } catch (error) {
                    console.log("user auth error");
                    const logEventData = {
                        name: "error",
                        action: {
                            description: "user auth error",
                            reason: error
                        }
                    };
                    Background_BackgroundService.logNewEvent(logEventData);
                }
            }
            tabListener(tabId, changeInfo, tab) {
                if ("loading" === changeInfo.status && Background_BackgroundService.onTabStartLoading(tab), 
                "complete" == changeInfo.status) {
                    const url = tab.url;
                    if (url && tab.id) {
                        const extensionTab = new ExtensionTab(new URL(url), tab.id);
                        extensionTab.streamingService && this.initContentScriptsAsync(extensionTab);
                    } else if (chrome.runtime.lastError) return;
                }
            }
            initContentScriptsAsync(extensionTab) {
                return BackgroundDataManager_awaiter(this, void 0, void 0, (function*() {
                    if (extensionTab.streamingService) {
                        const streamingService = extensionTab.streamingService;
                        yield new Promise((resolve => {
                            chrome.tabs.executeScript(extensionTab.id, {
                                file: "lib/tp_libraries_min.js"
                            }, resolve);
                        })), yield new Promise((resolve => {
                            chrome.tabs.executeScript(extensionTab.id, {
                                code: `\n                        if (!window.teleparty) {\n                            window.teleparty = { tabId: ${extensionTab.id} }\n                        }\n                    `
                            }, resolve);
                        })), yield Promise.all(streamingService.contentScripts.map((script => new Promise((resolve => {
                            chrome.tabs.executeScript(extensionTab.id, {
                                file: script
                            }, (() => {
                                resolve();
                            }));
                        })))));
                        const readyMessage = new IsContentScriptReadyMessage("Service_Background", "Content_Script");
                        yield Messaging_MessagePasser.sendMessageToTabAsync(readyMessage, extensionTab.id);
                    }
                }));
            }
        }
        var BackgroundService_awaiter = function(thisArg, _arguments, P, generator) {
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
        const BackgroundService = new class {
            constructor() {
                this.partyWindowsMap = new Map, this.dataManager = new BackgroundDataManager, this.registerChromeListeners(), 
                debug("Service Background");
            }
            checkToDestroy() {
                this.dataManager.closeEventWindow();
            }
            _setupLogPage() {
                this.checkToDestroy();
                const eventWindow = window.open("https://redirect.teleparty.com/event-logger", "Teleparty Logger", "width=600,height=530,status=0,scrollbars=0,menubar=0");
                eventWindow && this.dataManager.setEventWindow(eventWindow);
            }
            receiveMessage(message, sender, sendResponse) {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                if ("Service_Background" === message.target) {
                    if (message.type == PopupMessageType.CREATE_SESSION) {
                        const createMessage = message;
                        debug("Got create Session Message");
                        const data = createMessage.data;
                        return 0 === data.extensionTabData.id && (data.extensionTabData.id = null !== (_b = null === (_a = sender.tab) || void 0 === _a ? void 0 : _a.id) && void 0 !== _b ? _b : 0), 
                        this.createSessionAsync(data).then(sendResponse).catch(this.receiveMessageOnError(sendResponse, sender.tab)), 
                        !0;
                    }
                    if (message.type == ClientMessageType.GET_SESSION_DATA) {
                        const getSessionMessage = message;
                        return this.getSessionAsync(getSessionMessage.data, sender).then(sendResponse).catch(this.receiveMessageOnError(sendResponse, sender.tab)), 
                        !0;
                    }
                    if (message.type == BackgroundMessageType.TEARDOWN) {
                        const teardownMessage = message;
                        return this.teardownSessionAsync(teardownMessage, sender).then(sendResponse), !0;
                    }
                    if (message.type == BackgroundMessageType.LOG_EVENT) {
                        const sendData = message.data;
                        if ("eventType" in sendData) this.logOldEventAsync(sendData); else {
                            let videoTabId;
                            this.partyWindowsMap.forEach((windows => {
                                var _a;
                                windows.chatTabId === (null === (_a = sender.tab) || void 0 === _a ? void 0 : _a.id) && (videoTabId = windows.videoTabId);
                            })), videoTabId ? this.getTabForId(videoTabId).then((tab => {
                                this.logNewEvent(sendData, tab);
                            })) : this.logNewEvent(sendData, sender.tab);
                        }
                        return sendResponse(), !0;
                    }
                    if (message.type == BackgroundMessageType.LOG_EXPERIMENT) {
                        const logExpMessage = message;
                        return this.logExperimentAsync(logExpMessage.data), sendResponse(), !0;
                    }
                    if (message.type == PopupMessageType.RE_INJECT) {
                        const reInjectMessage = message;
                        debug("Got Re Inject Message");
                        const data = reInjectMessage.data;
                        return 0 === data.extensionTabData.id && (data.extensionTabData.id = null !== (_d = null === (_c = sender.tab) || void 0 === _c ? void 0 : _c.id) && void 0 !== _d ? _d : 0), 
                        this.reInjectCS(data).then(sendResponse).catch(this.receiveMessageOnError(sendResponse, sender.tab)), 
                        !0;
                    }
                    if (message.type == BackgroundMessageType.STAY_ALIVE) {
                        const tabId = message.data.tabId;
                        return this.addAliveTab(tabId), sendResponse(), !0;
                    }
                    if (message.type == BackgroundMessageType.LOAD_CHAT_WINDOW) {
                        const tabId = null !== (_f = null === (_e = sender.tab) || void 0 === _e ? void 0 : _e.id) && void 0 !== _f ? _f : 0, windowId = null !== (_h = null === (_g = sender.tab) || void 0 === _g ? void 0 : _g.windowId) && void 0 !== _h ? _h : 0;
                        return this.loadPartyView(tabId, windowId).then(sendResponse), !0;
                    }
                    if (message.type == BackgroundMessageType.RESET_CHAT_WINDOW) {
                        const tabId = null !== (_k = null === (_j = sender.tab) || void 0 === _j ? void 0 : _j.id) && void 0 !== _k ? _k : 0;
                        let partyWindows;
                        return this.partyWindowsMap.forEach((windows => {
                            windows.chatTabId != tabId && windows.videoTabId != tabId || (partyWindows = windows);
                        })), partyWindows && this.resetPartyView(partyWindows).then(sendResponse), !0;
                    }
                    if (message.type == BackgroundMessageType.HIDE_CHAT_WINDOW) {
                        const tabId = null !== (_m = null === (_l = sender.tab) || void 0 === _l ? void 0 : _l.id) && void 0 !== _m ? _m : 0;
                        let partyWindows;
                        return this.partyWindowsMap.forEach((windows => {
                            windows.chatTabId != tabId && windows.videoTabId != tabId || (partyWindows = windows);
                        })), partyWindows && this.hideChatWindow(partyWindows).then(sendResponse), !0;
                    }
                } else if ("Content_Script" == message.target) {
                    const tabId = null !== (_p = null === (_o = sender.tab) || void 0 === _o ? void 0 : _o.id) && void 0 !== _p ? _p : 0;
                    let videoTabId;
                    return this.partyWindowsMap.forEach((windows => {
                        windows.chatTabId == tabId && (videoTabId = windows.videoTabId);
                    })), videoTabId && (message.tabId = tabId, Messaging_MessagePasser.sendMessageToTabAsync(message, videoTabId).then(sendResponse)), 
                    !0;
                }
            }
            addAliveTab(tabId) {
                const timeout = setTimeout((() => BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    this.dataManager.removeAliveTab(tabId), yield this.deleteSocketForTabAsync(tabId);
                }))), 6e4);
                this.dataManager.addAliveTab(tabId, timeout);
            }
            reInjectCS(data) {
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    const extensionTab = data.extensionTabData;
                    yield this.dataManager.initContentScriptsAsync(extensionTab);
                }));
            }
            increaseUsesAsync() {
                var _a;
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    const res = yield ChromeStorage_ChromeStorageReader.getItemsAsync([ "extensionUses" ]), uses = null !== (_a = res.extensionUses) && void 0 !== _a ? _a : 0;
                    yield ChromeStorage_ChromeStorageWriter.setItemsAsync({
                        extensionUses: uses + 1
                    });
                }));
            }
            logExperimentAsync(data) {
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    try {
                        const logData = {
                            permId: yield this.waitForPermId(),
                            event: data.eventType,
                            name: data.experimentName,
                            version: data.experimentVersion
                        };
                        console.log("event: " + JSON.stringify(logData));
                        const xmlhttp = new XMLHttpRequest;
                        xmlhttp.open("POST", "https://data3.netflixparty.com/log-experiment"), xmlhttp.setRequestHeader("Content-Type", "application/json"), 
                        xmlhttp.send(JSON.stringify(logData));
                    } catch (e) {
                        console.log("log event error : " + e);
                    }
                }));
            }
            browserVersion() {
                let browserVersion = "";
                return navigator.userAgent.includes("Firefox/") ? browserVersion = `Firefox v${navigator.userAgent.split("Firefox/")[1]}` : navigator.userAgent.includes("Edg/") ? browserVersion = `Edg v${navigator.userAgent.split("Edg/")[1]}` : navigator.userAgent.includes("Chrome/") && (browserVersion = `Chrome v${navigator.userAgent.split("Chrome/")[1]}`), 
                browserVersion;
            }
            getOSVersion() {
                let OSName = "";
                return -1 != navigator.userAgent.indexOf("Windows NT 10.0") && (OSName = "Windows 10"), 
                -1 != navigator.userAgent.indexOf("Windows NT 6.3") && (OSName = "Windows 8.1"), 
                -1 != navigator.userAgent.indexOf("Windows NT 6.2") && (OSName = "Windows 8"), -1 != navigator.userAgent.indexOf("Windows NT 6.1") && (OSName = "Windows 7"), 
                -1 != navigator.userAgent.indexOf("Windows NT 6.0") && (OSName = "Windows Vista"), 
                -1 != navigator.userAgent.indexOf("Windows NT 5.1") && (OSName = "Windows XP"), 
                -1 != navigator.userAgent.indexOf("Windows NT 5.0") && (OSName = "Windows 2000"), 
                -1 != navigator.userAgent.indexOf("Mac") && (OSName = "Mac/iOS"), -1 != navigator.userAgent.indexOf("X11") && (OSName = "UNIX"), 
                -1 != navigator.userAgent.indexOf("Linux") && (OSName = "Linux"), OSName;
            }
            getSocketSessionForTab(tabId) {
                const socket = Socket_SocketPool.getSocketForTabId(tabId);
                return {
                    id: null == socket ? void 0 : socket.getId(),
                    transport: null == socket ? void 0 : socket.getTransport(),
                    type: null == socket ? void 0 : socket.getType(),
                    start_time_ms: null == socket ? void 0 : socket.getSocketStartTime()
                };
            }
            setActivePartyEventLog(oldEvent, currentTab) {
                var _a, _b, _c, _d, _e, _f;
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    const newEvent = Object.assign({}, oldEvent), socket = Socket_SocketPool.getSocketForTabId(null !== (_a = currentTab.id) && void 0 !== _a ? _a : 0);
                    if (socket) {
                        const sessionData = socket.getCurrentSessionData();
                        if (sessionData && sessionData.sessionId) {
                            const sessionInfo = {
                                id: null == sessionData ? void 0 : sessionData.sessionId,
                                start_time_ms: null == sessionData ? void 0 : sessionData.created_at
                            };
                            newEvent.party_session = sessionInfo;
                        }
                        const socket_session = this.getSocketSessionForTab(null !== (_b = currentTab.id) && void 0 !== _b ? _b : 0);
                        socket_session.id && (newEvent.socket_session = socket_session);
                        const video_session = this.dataManager.getVideoSessionData();
                        try {
                            const videoData = yield this.getVideoDataForTabIdAsync(null !== (_c = currentTab.id) && void 0 !== _c ? _c : 0), videoState = videoData.videoState;
                            newEvent.page && (newEvent.page.is_adblock_enabled = videoData.is_adblock_enabled, 
                            newEvent.page.is_chat_visible = videoData.is_chat_visible, newEvent.page.is_player_fullscreen = videoData.is_player_fullscreen), 
                            video_session.status = videoState, video_session.video_ts_ms = videoData.video_ts_ms, 
                            video_session.party_ts_ms = videoData.party_ts_ms, videoData.content.service = null === (_d = videoData.content.service) || void 0 === _d ? void 0 : _d.toLowerCase(), 
                            videoData.content.episode_name = null === (_e = videoData.content.episode_name) || void 0 === _e ? void 0 : _e.toLowerCase(), 
                            videoData.content.name = null === (_f = videoData.content.name) || void 0 === _f ? void 0 : _f.toLowerCase(), 
                            newEvent.screen = videoData.screen, newEvent.content = videoData.content;
                        } catch (err) {
                            console.log(err);
                        }
                        (newEvent.party_session && newEvent.party_session.id || newEvent.name.startsWith("video_")) && (newEvent.video_session = video_session);
                    }
                    return newEvent;
                }));
            }
            deviceEvent() {
                var _a;
                const manufacturer = null === (_a = window.navigator.userAgentData) || void 0 === _a ? void 0 : _a.platform;
                return {
                    name: "chrome",
                    version: this.browserVersion(),
                    type: "browser",
                    manufacturer,
                    model: "",
                    os_name: this.getOSVersion(),
                    os_version: ""
                };
            }
            generateBaseTP(pageInfo, data, userInfo) {
                const deviceInfo = this.deviceEvent(), app_session = this.dataManager.getAppSession(), clientTimeStamp = Date.now(), appInfo = {
                    name: "chrome_ext",
                    version: chrome.runtime.getManifest().version
                }, TpEvent = Object.assign({}, data);
                return TpEvent.app = appInfo, TpEvent.device = deviceInfo, TpEvent.app_session = app_session, 
                TpEvent.client_timestamp_ms = clientTimeStamp, null == TpEvent.page && (TpEvent.page = pageInfo), 
                TpEvent.user = userInfo, TpEvent;
            }
            getTabForId(tabId) {
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    return new Promise(((resolve, reject) => {
                        try {
                            chrome.tabs.get(tabId, resolve);
                        } catch (error) {
                            reject(error);
                        }
                    }));
                }));
            }
            updateTabUrl(tabId, url) {
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    return new Promise(((resolve, reject) => {
                        try {
                            chrome.tabs.update(tabId, {
                                url
                            }, (() => {
                                resolve();
                            }));
                        } catch (error) {
                            reject(error);
                        }
                    }));
                }));
            }
            loadAdView(partyWindows) {
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    const chatTabId = partyWindows.chatTabId;
                    chrome.tabs.move(chatTabId, {
                        index: -1,
                        windowId: partyWindows.videoWindow.id
                    }, (tab => BackgroundService_awaiter(this, void 0, void 0, (function*() {
                        var _a;
                        yield this.resetPartyView(partyWindows), chrome.tabs.update(null !== (_a = tab.id) && void 0 !== _a ? _a : 0, {
                            active: !0
                        });
                    }))));
                }));
            }
            onTabStartLoading(tab) {
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    let targetWindows;
                    this.partyWindowsMap.forEach((windows => {
                        windows.chatTabId === (null == tab ? void 0 : tab.id) && (targetWindows = windows);
                    })), targetWindows && tab.url !== SIDEBAR_URL && this.loadAdView(targetWindows);
                }));
            }
            logEventForTabId(data, tabId) {
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    const tab = yield this.getTabForId(tabId);
                    return this.logNewEvent(data, tab);
                }));
            }
            logNewEvent(eventData, currentTab) {
                var _a, _b, _c;
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    let TpEvent = Object.assign({}, eventData);
                    try {
                        const storageData = yield ChromeStorage_ChromeStorageValidator.getValidatedChromeStorageDataAsync(), permId = yield this.waitForPermId(), heartBeatActivators = [ "video_heartbeat", "video_seek", "video_error" ];
                        this.dataManager.incrementAppSessionEventNumber();
                        const pageInfo = {
                            name: null !== (_a = null == currentTab ? void 0 : currentTab.title) && void 0 !== _a ? _a : "",
                            url: null !== (_b = null == currentTab ? void 0 : currentTab.url) && void 0 !== _b ? _b : ""
                        }, userInfo = {
                            id: permId,
                            name: storageData.userNickname,
                            is_logged_in: !1
                        };
                        TpEvent = this.generateBaseTP(pageInfo, TpEvent, userInfo), TpEvent.component && (TpEvent.component.type = null === (_c = TpEvent.component.type) || void 0 === _c ? void 0 : _c.toLowerCase()), 
                        "video_start" === TpEvent.name && this.dataManager.resetVideoSession(), "video_pause" === TpEvent.name && this.dataManager.pauseHeartBeat(), 
                        "video_resume" === TpEvent.name && this.dataManager.resumeHeartBeat(), currentTab && currentTab.id && (TpEvent = yield this.setActivePartyEventLog(TpEvent, currentTab)), 
                        heartBeatActivators.includes(TpEvent.name) && this.dataManager.heartBeatProc();
                    } catch (e) {
                        console.log("log event error : " + e);
                    }
                    this.sendEvent(TpEvent);
                }));
            }
            isTestEvent(TpEvent) {
                return [ "socket_open", "socket_close", "socket_error", "party_reconnect", "party_disconnect" ].includes(TpEvent.name);
            }
            sendEvent(TpEvent) {
                try {
                    const prodLink = this.isTestEvent(TpEvent) ? "https://metis.teleparty.com/v1/record" : "https://events.teleparty.com/record", logEndPoints = (this.isTestEvent(TpEvent), 
                    prodLink), xmlhttp = new XMLHttpRequest;
                    xmlhttp.open("PUT", logEndPoints), xmlhttp.setRequestHeader("Content-Type", "application/json"), 
                    xmlhttp.send(JSON.stringify(TpEvent));
                } catch (error) {
                    console.error(error);
                }
            }
            openLogPage() {
                this._setupLogPage();
            }
            logOldEventAsync(data) {
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    try {
                        const logData = {
                            userId: yield this.waitForPermId(),
                            eventType: data.eventType,
                            sessionId: data.sessionId
                        };
                        console.log("event: " + JSON.stringify(logData));
                        const xmlhttp = new XMLHttpRequest;
                        xmlhttp.open("POST", "https://data3.netflixparty.com/log-event"), xmlhttp.setRequestHeader("Content-Type", "application/json"), 
                        xmlhttp.send(JSON.stringify(logData));
                    } catch (e) {
                        console.log("log event error : " + e);
                    }
                }));
            }
            teardownSessionAsync(teardownMessage, sender) {
                var _a;
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    if (sender.tab && sender.tab.id) {
                        const tabId = sender.tab.id;
                        teardownMessage.sender = "Service_Background", teardownMessage.target = "Content_Script", 
                        yield Messaging_MessagePasser.sendMessageToTabAsync(teardownMessage, tabId), yield this.deleteSocketForTabAsync(tabId);
                        const closePopupMessage = new ClosePopup("Service_Background", "Popup");
                        Messaging_MessagePasser.sendMessageToExtension(closePopupMessage);
                        const windows = this.partyWindowsMap.get(tabId);
                        windows && ((null === (_a = null == windows ? void 0 : windows.chatWindow) || void 0 === _a ? void 0 : _a.id) && chrome.windows.remove(windows.chatWindow.id), 
                        this.partyWindowsMap.delete(tabId));
                    }
                }));
            }
            fixSessionAsync(tabId) {
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    const storageData = yield ChromeStorage_ChromeStorageValidator.getValidatedChromeStorageDataAsync(), sessionData = (yield this.getSocketForTabAsync(tabId)).getCurrentSessionData();
                    if (sessionData) {
                        const loadSessionData = {
                            sessionCallbackData: sessionData,
                            storageData,
                            isCreate: !1,
                            showReviewMessage: this.shouldShowReview(storageData)
                        }, loadSessionMessage = new LoadSessionMessage("Service_Background", "Content_Script", loadSessionData);
                        yield this.sendMessageToTabAsync(tabId, loadSessionMessage);
                        const logData = {
                            name: "video_fix",
                            action: {
                                description: "video session was restored after next video error"
                            }
                        };
                        this.logEventForTabId(logData, tabId);
                    }
                }));
            }
            getSessionAsync(requestData, sender) {
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    if (!(sender.tab && sender.tab.id && sender.url)) throw new Error("Invalid Request");
                    {
                        const url = sender.url, tabId = sender.tab.id;
                        if (this.dataManager.checkAliveTab(tabId)) return this.dataManager.removeAliveTab(tabId), 
                        void this.fixSessionAsync(tabId);
                        const extensionTabData = new ExtensionTab(new URL(url), tabId);
                        yield this.deleteSocketForTabAsync(tabId);
                        const redirectData = yield this.loadRedirectDataAsync(tabId);
                        let sessionId, videoType, serviceDomain;
                        if (redirectData ? (sessionId = redirectData.sessionId, videoType = redirectData.videoType, 
                        serviceDomain = redirectData.serviceDomain, yield this.deleteRedirectDataAsync(tabId)) : sessionId = extensionTabData.sessionIdFromUrl, 
                        sessionId) {
                            isNetflixParty(new URL(url)) && (extensionTabData.videoId = requestData.videoId);
                            const joinData = {
                                extensionTab: extensionTabData,
                                sessionId,
                                videoType,
                                serviceDomain
                            };
                            return yield this.joinSessionAsync(joinData);
                        }
                    }
                }));
            }
            getUserSettingsForStorageData(storageData) {
                var _a, _b;
                return {
                    userIcon: null !== (_a = storageData.userIcon) && void 0 !== _a ? _a : "",
                    userNickname: null !== (_b = storageData.userNickname) && void 0 !== _b ? _b : ""
                };
            }
            joinSessionAsync(joinSessionData) {
                var _a;
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    const extensionTabData = joinSessionData.extensionTab, streamingService = extensionTabData.streamingService, socket = yield this.getSocketForTabAsync(extensionTabData.id);
                    socket.clearSessionData();
                    const storageData = yield ChromeStorage_ChromeStorageValidator.getValidatedChromeStorageDataAsync(), socketUserId = yield socket.getUserIdAsync(), permId = storageData.userId ? storageData.userId : socketUserId;
                    storageData.userId || (yield this.setPermIdAsync(socketUserId), storageData.userId = socketUserId);
                    const userSettings = this.getUserSettingsForStorageData(storageData), videoService = null !== (_a = null == streamingService ? void 0 : streamingService.serverName) && void 0 !== _a ? _a : "", joinData = {
                        videoId: extensionTabData.videoId,
                        sessionId: joinSessionData.sessionId,
                        videoService,
                        permId,
                        userSettings
                    }, sessionData = yield new Promise((resolve => {
                        socket.sendMessage(SocketMessageTypes.JOIN_SESSION, joinData, (res => {
                            resolve(res);
                        }));
                    })), storedSessionData = Object.assign(Object.assign({}, sessionData), {
                        userId: socketUserId,
                        permId,
                        videoService,
                        videoType: joinSessionData.videoType,
                        serviceDomain: joinSessionData.serviceDomain,
                        userSettings
                    }), res = yield this.onJoinSessionDataReceivedAsync(sessionData, joinSessionData.extensionTab.id, storageData, videoService);
                    return socket.loadSessionData(storedSessionData, userSettings), res;
                }));
            }
            createSessionAsync(createSessionData) {
                var _a;
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    const extensionTabData = createSessionData.extensionTabData, streamingService = extensionTabData.streamingService, videoData = yield this.getVideoDataForTabIdAsync(extensionTabData.id), socket = yield this.getSocketForTabAsync(extensionTabData.id);
                    socket.clearSessionData();
                    const storageData = yield ChromeStorage_ChromeStorageValidator.getValidatedChromeStorageDataAsync(), socketUserId = yield socket.getUserIdAsync(), permId = storageData.userId ? storageData.userId : socketUserId;
                    storageData.userId || (yield this.setPermIdAsync(socketUserId), storageData.userId = socketUserId);
                    const userSettings = this.getUserSettingsForStorageData(storageData), videoService = null !== (_a = null == streamingService ? void 0 : streamingService.serverName) && void 0 !== _a ? _a : "", createData = {
                        controlLock: createSessionData.createSettings.controlLock,
                        videoId: videoData.videoId,
                        videoDuration: videoData.videoDuration,
                        videoType: videoData.videoType,
                        serviceDomain: videoData.serviceDomain,
                        videoService,
                        syncFromEnd: null == streamingService ? void 0 : streamingService.syncFromEnd,
                        permId,
                        userSettings
                    }, sessionData = yield new Promise((resolve => {
                        socket.sendMessage(SocketMessageTypes.CREATE_SESSION, createData, (res => {
                            resolve(res);
                        }));
                    })), storedSessionData = Object.assign(Object.assign({}, sessionData), {
                        userId: socketUserId,
                        permId,
                        videoService,
                        messages: [],
                        created_at: Date.now(),
                        videoType: videoData.videoType,
                        serviceDomain: videoData.serviceDomain,
                        userSettings
                    }), response = yield this.onCreateSessionDataReceivedAsync(sessionData, extensionTabData.id, storageData, videoService, createSessionData.pageControls);
                    return socket.loadSessionData(storedSessionData, userSettings), response;
                }));
            }
            getSocketForTabAsync(tabId) {
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    const socket = Socket_SocketPool.getSocketForTabId(tabId);
                    if (socket) return socket;
                    {
                        const socketWrapper = yield this.createSocketForTabAsync(tabId);
                        return Socket_SocketPool.setSocketForTabId(tabId, socketWrapper), socketWrapper;
                    }
                }));
            }
            deleteSocketForTabAsync(tabId) {
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    const socket = Socket_SocketPool.getSocketForTabId(tabId);
                    socket && (socket.teardown(), Socket_SocketPool.removeSocketForTabId(tabId));
                }));
            }
            createSocketForTabAsync(tabId) {
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    const socketCreator = new SocketCreator(tabId);
                    return yield socketCreator.createSocketForTab();
                }));
            }
            getVideoDataForTabIdAsync(tabId) {
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    const getVideoDataMessage = new BackgroundMessage("Service_Background", "Content_Script", BackgroundMessageType.GET_VIDEO_DATA), response = yield Messaging_MessagePasser.sendMessageToTabAsync(getVideoDataMessage, tabId);
                    if (response) {
                        if (response.error) throw new Error(response.error);
                        return response;
                    }
                    throw new Error("Failed to connect to Script. Please refresh the page and try again");
                }));
            }
            loadRedirectDataAsync(tabId) {
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    const data = ChromeStorage_SessionMap.getRedirectDataForTabAsync(tabId);
                    return ChromeStorage_SessionMap.deleteRedirectDataForTabAsync(tabId), data;
                }));
            }
            deleteRedirectDataAsync(tabId) {
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    return ChromeStorage_SessionMap.deleteRedirectDataForTabAsync(tabId);
                }));
            }
            waitForPermId() {
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    return new Promise(((resolve, reject) => {
                        let attempts = 0;
                        const checkForPermId = () => BackgroundService_awaiter(this, void 0, void 0, (function*() {
                            attempts++;
                            const storageData = yield ChromeStorage_ChromeStorageValidator.getValidatedChromeStorageDataAsync();
                            storageData.userId ? resolve(storageData.userId) : attempts < 5 ? setTimeout(checkForPermId, 5e3) : reject("Could not get permId in time");
                        }));
                        checkForPermId();
                    }));
                }));
            }
            setPermIdAsync(userId) {
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    debug("No perm id found, using socket id"), yield ChromeStorage_ChromeStorageWriter.setItemsAsync({
                        userId
                    });
                }));
            }
            shouldShowReview(storageData) {
                return void 0 !== storageData.extensionUses && (1 === storageData.extensionUses || storageData.extensionUses % 5 == 0) && !storageData.reviewClicked;
            }
            onCreateSessionDataReceivedAsync(callbackData, tabId, storageData, serviceName, pageControls) {
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    if (!callbackData || callbackData.errorMessage) throw this.deleteRedirectDataAsync(tabId), 
                    new Error(callbackData ? callbackData.errorMessage : "An unexpected error occured. Please refresh the page and try again.");
                    {
                        const loadSessionData = {
                            sessionCallbackData: callbackData,
                            storageData,
                            isCreate: !0,
                            showReviewMessage: this.shouldShowReview(storageData)
                        }, loadSessionMessage = new LoadSessionMessage("Service_Background", "Content_Script", loadSessionData);
                        yield this.sendMessageToTabAsync(tabId, loadSessionMessage);
                        const oldLogData = {
                            eventType: "create-session-chrome" + (pageControls ? "-pc" : ""),
                            sessionId: callbackData.sessionId
                        };
                        this.logOldEventAsync(oldLogData);
                        const logData = {
                            name: "party_start",
                            action: {
                                description: serviceName,
                                reason: "session was created"
                            }
                        };
                        return this.logEventForTabId(logData, tabId), this.increaseUsesAsync(), {
                            sessionId: callbackData.sessionId,
                            showReviewMessage: this.shouldShowReview(storageData)
                        };
                    }
                }));
            }
            onJoinSessionDataReceivedAsync(callbackData, tabId, storageData, serviceName) {
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    if (!callbackData || callbackData.errorMessage) throw this.deleteRedirectDataAsync(tabId), 
                    new Error(callbackData ? callbackData.errorMessage : "An error occured while trying to join the session. Please navigate to the party url and try again.");
                    {
                        const loadSessionData = {
                            sessionCallbackData: callbackData,
                            storageData,
                            isCreate: !1,
                            showReviewMessage: this.shouldShowReview(storageData)
                        }, loadSessionMessage = new LoadSessionMessage("Service_Background", "Content_Script", loadSessionData);
                        yield this.sendMessageToTabAsync(tabId, loadSessionMessage);
                        const oldLogData = {
                            eventType: "join-session-chrome",
                            sessionId: callbackData.sessionId
                        };
                        this.logOldEventAsync(oldLogData);
                        const logData = {
                            name: "party_join",
                            action: {
                                description: serviceName
                            }
                        };
                        return this.logEventForTabId(logData, tabId), this.increaseUsesAsync(), {
                            sessionId: callbackData.sessionId,
                            showReviewMessage: this.shouldShowReview(storageData)
                        };
                    }
                }));
            }
            sendMessageToTabAsync(tabId, message, timeout) {
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    return new Promise(((resolve, reject) => {
                        let sendTimeout;
                        timeout && (sendTimeout = setTimeout((() => {
                            reject(new Error("Could not get a response from the page in time. Please refresh the page and try again."));
                        }), timeout)), chrome.tabs.sendMessage(tabId, message, (response => {
                            sendTimeout && clearTimeout(sendTimeout), resolve(response);
                        }));
                    }));
                }));
            }
            updateWindow(windowId, updateInfo) {
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    return new Promise(((resolve, reject) => {
                        chrome.windows.update(windowId, updateInfo, (window => BackgroundService_awaiter(this, void 0, void 0, (function*() {
                            chrome.runtime.lastError ? reject(chrome.runtime.lastError) : (yield delay(150)(), 
                            resolve(window));
                        }))));
                    }));
                }));
            }
            createWindow(createInfo) {
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    return new Promise(((resolve, reject) => {
                        chrome.windows.create(createInfo, (window => {
                            chrome.runtime.lastError || void 0 === window ? reject(chrome.runtime.lastError) : resolve(window);
                        }));
                    }));
                }));
            }
            doesWindowExist(windowId) {
                return new Promise((resolve => {
                    chrome.windows.get(windowId, (window => {
                        chrome.runtime.lastError || void 0 === window ? resolve(!1) : resolve(!0);
                    }));
                }));
            }
            getTabIdForWindow(windowId) {
                return new Promise(((resolve, reject) => {
                    chrome.tabs.query({
                        windowId
                    }, (tabs => {
                        var _a;
                        chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(null !== (_a = tabs[0].id) && void 0 !== _a ? _a : 0);
                    }));
                }));
            }
            doFocusTab(tabId) {
                return new Promise((resolve => {
                    chrome.tabs.update(tabId, {
                        active: !0
                    }, (() => {
                        resolve();
                    }));
                }));
            }
            hideChatWindow(partyWindows) {
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    const videoWindow = partyWindows.videoWindow;
                    yield this.doFocusTab(partyWindows.videoTabId);
                    let chatWindow = partyWindows.chatWindow;
                    (yield this.doesWindowExist(chatWindow.id)) && (chatWindow = yield this.updateWindow(chatWindow.id, {
                        state: "minimized",
                        focused: !1
                    })), yield this.updateWindow(videoWindow.id, {
                        state: "maximized"
                    }), yield this.updateWindow(videoWindow.id, {
                        focused: !0,
                        width: window.screen.width,
                        height: window.screen.height
                    });
                }));
            }
            resetPartyView(partyWindows, tries = 0) {
                var _a;
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    let videoWindow = partyWindows.videoWindow;
                    yield this.doFocusTab(partyWindows.videoTabId), videoWindow = yield this.updateWindow(videoWindow.id, {
                        state: "maximized"
                    }), videoWindow = yield this.updateWindow(videoWindow.id, {
                        state: "normal",
                        width: window.screen.width - 358,
                        height: window.screen.availHeight,
                        left: 0,
                        top: 0,
                        focused: !0
                    });
                    let chatWindow = partyWindows.chatWindow, justCreated = !1;
                    (yield this.doesWindowExist(chatWindow.id)) || (chatWindow = yield this.createWindow({
                        url: SIDEBAR_URL,
                        type: "popup"
                    }), justCreated = !0);
                    const chatTabId = yield this.getTabIdForWindow(chatWindow.id);
                    if (!justCreated) {
                        const chatTab = yield this.getTabForId(chatTabId);
                        void 0 !== chatTab.url && chatTab.url !== SIDEBAR_URL && (yield this.updateTabUrl(chatTabId, SIDEBAR_URL));
                    }
                    chatWindow = yield this.updateWindow(chatWindow.id, {
                        state: "normal",
                        width: 368,
                        height: window.screen.availHeight,
                        left: window.screen.width - 368,
                        top: 0,
                        focused: !0
                    });
                    const newPartyWindows = {
                        chatWindow,
                        videoWindow,
                        chatTabId,
                        videoTabId: partyWindows.videoTabId
                    };
                    this.partyWindowsMap.set(partyWindows.videoTabId, newPartyWindows);
                    const partySocket = Socket_SocketPool.getSocketForTabId(partyWindows.videoTabId);
                    if (partySocket && Socket_SocketPool.setSocketForTabId(chatTabId, partySocket), 
                    console.log(videoWindow.width), tries < 2 && window.screen.width - (null !== (_a = videoWindow.width) && void 0 !== _a ? _a : 0) < 50) return console.log("Retry Reset"), 
                    this.resetPartyView(partyWindows, tries + 1);
                }));
            }
            loadPartyView(tabId, windowId) {
                var _a;
                return BackgroundService_awaiter(this, void 0, void 0, (function*() {
                    const videoWindow = yield this.updateWindow(windowId, {
                        state: "maximized"
                    });
                    yield this.updateWindow(videoWindow.id, {
                        state: "normal",
                        width: window.screen.width - 358,
                        height: window.screen.availHeight
                    });
                    const chatWindow = yield this.createWindow({
                        url: SIDEBAR_URL,
                        type: "popup",
                        state: "maximized"
                    });
                    if (yield this.updateWindow(chatWindow.id, {
                        state: "normal",
                        width: 368,
                        height: window.screen.availHeight,
                        left: window.screen.width - 368,
                        top: 0
                    }), !chatWindow || !videoWindow) throw new Error("Failed to Create Party View");
                    {
                        const chatTabId = chatWindow.tabs && null !== (_a = chatWindow.tabs[0].id) && void 0 !== _a ? _a : 0, partyWindows = {
                            chatWindow,
                            videoWindow,
                            chatTabId,
                            videoTabId: tabId
                        };
                        this.partyWindowsMap.set(tabId, partyWindows);
                        const partySocket = Socket_SocketPool.getSocketForTabId(partyWindows.videoTabId);
                        partySocket && Socket_SocketPool.setSocketForTabId(chatTabId, partySocket);
                    }
                }));
            }
            receiveMessageOnError(sendResponse, tab) {
                return error => {
                    this.logError(error.message, tab), sendResponse({
                        error: error.message
                    });
                };
            }
            logError(error, tab, data) {
                const logEventData = {
                    name: "error",
                    action: {
                        reason: error,
                        description: data
                    }
                };
                this.logNewEvent(logEventData, tab), debug("An error occured: " + data);
            }
            registerChromeListeners() {
                chrome.runtime.onSuspend.addListener((() => {
                    Socket_SocketPool.teardown();
                })), chrome.tabs.onRemoved.addListener(this.onTabClosed.bind(this)), chrome.runtime.onMessage.addListener(this.receiveMessage.bind(this)), 
                this.setupHealthCheck(), new BackgroundSocketMessageForwarder;
            }
            onTabClosed(tabId) {
                const socketWrapper = Socket_SocketPool.getSocketForTabId(tabId);
                if (socketWrapper && !this.dataManager.checkAliveTab(tabId)) {
                    const logData = {
                        name: "tab_close",
                        action: {
                            description: "tab was closed with socket",
                            source: "tabID: " + tabId
                        }
                    };
                    this.logEventForTabId(logData, tabId);
                    let isChatTab = !1;
                    this.partyWindowsMap.forEach((windows => {
                        (windows.chatTabId === tabId || Socket_SocketPool.getSocketForTabId(windows.videoTabId) === socketWrapper) && (isChatTab = !0);
                    })), isChatTab || (debug("Detected Tab Close: Disconnecting socket for tab: " + tabId), 
                    socketWrapper.teardown(), Socket_SocketPool.removeSocketForTabId(tabId));
                }
                const partyWindows = this.partyWindowsMap.get(tabId);
                partyWindows && chrome.tabs.remove(partyWindows.chatTabId);
            }
            setupHealthCheck() {
                chrome.runtime.onConnect.addListener((port => {
                    var _a, _b;
                    const tabId = null === (_b = null === (_a = port.sender) || void 0 === _a ? void 0 : _a.tab) || void 0 === _b ? void 0 : _b.id;
                    if (tabId) {
                        debug("Connected to Content Script with Tab ID: " + tabId);
                        try {
                            port.postMessage("pong"), port.onDisconnect.addListener((() => {
                                this.onTabClosed(tabId);
                            }));
                        } catch (e) {}
                    }
                }));
            }
        };
        Object.freeze(BackgroundService);
        const Background_BackgroundService = BackgroundService;
        window.teleparty = BackgroundService;
    })();
})();