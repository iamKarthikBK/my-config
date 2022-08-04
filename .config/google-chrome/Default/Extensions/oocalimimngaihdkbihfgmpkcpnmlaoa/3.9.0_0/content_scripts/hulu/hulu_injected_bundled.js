/*******************************************************
* Copyright (C) 2018-2022 WP Interactive Media, Inc. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
*******************************************************/
(() => {
    var __webpack_modules__ = {
        227: (module, exports, __webpack_require__) => {
            exports.formatArgs = function(args) {
                if (args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff), 
                !this.useColors) return;
                const c = "color: " + this.color;
                args.splice(1, 0, c, "color: inherit");
                let index = 0, lastC = 0;
                args[0].replace(/%[a-zA-Z%]/g, (match => {
                    "%%" !== match && (index++, "%c" === match && (lastC = index));
                })), args.splice(lastC, 0, c);
            }, exports.save = function(namespaces) {
                try {
                    namespaces ? exports.storage.setItem("debug", namespaces) : exports.storage.removeItem("debug");
                } catch (error) {}
            }, exports.load = function() {
                let r;
                try {
                    r = exports.storage.getItem("debug");
                } catch (error) {}
                !r && "undefined" != typeof process && "env" in process && (r = process.env.DEBUG);
                return r;
            }, exports.useColors = function() {
                if ("undefined" != typeof window && window.process && ("renderer" === window.process.type || window.process.__nwjs)) return !0;
                if ("undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) return !1;
                return "undefined" != typeof document && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || "undefined" != typeof window && window.console && (window.console.firebug || window.console.exception && window.console.table) || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
            }, exports.storage = function() {
                try {
                    return localStorage;
                } catch (error) {}
            }(), exports.destroy = (() => {
                let warned = !1;
                return () => {
                    warned || (warned = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
                };
            })(), exports.colors = [ "#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33" ], 
            exports.log = console.debug || console.log || (() => {}), module.exports = __webpack_require__(447)(exports);
            const {formatters} = module.exports;
            formatters.j = function(v) {
                try {
                    return JSON.stringify(v);
                } catch (error) {
                    return "[UnexpectedJSONParseError]: " + error.message;
                }
            };
        },
        447: (module, __unused_webpack_exports, __webpack_require__) => {
            module.exports = function(env) {
                function createDebug(namespace) {
                    let prevTime, namespacesCache, enabledCache, enableOverride = null;
                    function debug(...args) {
                        if (!debug.enabled) return;
                        const self = debug, curr = Number(new Date), ms = curr - (prevTime || curr);
                        self.diff = ms, self.prev = prevTime, self.curr = curr, prevTime = curr, args[0] = createDebug.coerce(args[0]), 
                        "string" != typeof args[0] && args.unshift("%O");
                        let index = 0;
                        args[0] = args[0].replace(/%([a-zA-Z%])/g, ((match, format) => {
                            if ("%%" === match) return "%";
                            index++;
                            const formatter = createDebug.formatters[format];
                            if ("function" == typeof formatter) {
                                const val = args[index];
                                match = formatter.call(self, val), args.splice(index, 1), index--;
                            }
                            return match;
                        })), createDebug.formatArgs.call(self, args);
                        (self.log || createDebug.log).apply(self, args);
                    }
                    return debug.namespace = namespace, debug.useColors = createDebug.useColors(), debug.color = createDebug.selectColor(namespace), 
                    debug.extend = extend, debug.destroy = createDebug.destroy, Object.defineProperty(debug, "enabled", {
                        enumerable: !0,
                        configurable: !1,
                        get: () => null !== enableOverride ? enableOverride : (namespacesCache !== createDebug.namespaces && (namespacesCache = createDebug.namespaces, 
                        enabledCache = createDebug.enabled(namespace)), enabledCache),
                        set: v => {
                            enableOverride = v;
                        }
                    }), "function" == typeof createDebug.init && createDebug.init(debug), debug;
                }
                function extend(namespace, delimiter) {
                    const newDebug = createDebug(this.namespace + (void 0 === delimiter ? ":" : delimiter) + namespace);
                    return newDebug.log = this.log, newDebug;
                }
                function toNamespace(regexp) {
                    return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
                }
                return createDebug.debug = createDebug, createDebug.default = createDebug, createDebug.coerce = function(val) {
                    if (val instanceof Error) return val.stack || val.message;
                    return val;
                }, createDebug.disable = function() {
                    const namespaces = [ ...createDebug.names.map(toNamespace), ...createDebug.skips.map(toNamespace).map((namespace => "-" + namespace)) ].join(",");
                    return createDebug.enable(""), namespaces;
                }, createDebug.enable = function(namespaces) {
                    let i;
                    createDebug.save(namespaces), createDebug.namespaces = namespaces, createDebug.names = [], 
                    createDebug.skips = [];
                    const split = ("string" == typeof namespaces ? namespaces : "").split(/[\s,]+/), len = split.length;
                    for (i = 0; i < len; i++) split[i] && ("-" === (namespaces = split[i].replace(/\*/g, ".*?"))[0] ? createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$")) : createDebug.names.push(new RegExp("^" + namespaces + "$")));
                }, createDebug.enabled = function(name) {
                    if ("*" === name[name.length - 1]) return !0;
                    let i, len;
                    for (i = 0, len = createDebug.skips.length; i < len; i++) if (createDebug.skips[i].test(name)) return !1;
                    for (i = 0, len = createDebug.names.length; i < len; i++) if (createDebug.names[i].test(name)) return !0;
                    return !1;
                }, createDebug.humanize = __webpack_require__(824), createDebug.destroy = function() {
                    console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
                }, Object.keys(env).forEach((key => {
                    createDebug[key] = env[key];
                })), createDebug.names = [], createDebug.skips = [], createDebug.formatters = {}, 
                createDebug.selectColor = function(namespace) {
                    let hash = 0;
                    for (let i = 0; i < namespace.length; i++) hash = (hash << 5) - hash + namespace.charCodeAt(i), 
                    hash |= 0;
                    return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
                }, createDebug.enable(createDebug.load()), createDebug;
            };
        },
        824: module => {
            var s = 1e3, m = 60 * s, h = 60 * m, d = 24 * h, w = 7 * d, y = 365.25 * d;
            function plural(ms, msAbs, n, name) {
                var isPlural = msAbs >= 1.5 * n;
                return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
            }
            module.exports = function(val, options) {
                options = options || {};
                var type = typeof val;
                if ("string" === type && val.length > 0) return function(str) {
                    if ((str = String(str)).length > 100) return;
                    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
                    if (!match) return;
                    var n = parseFloat(match[1]);
                    switch ((match[2] || "ms").toLowerCase()) {
                      case "years":
                      case "year":
                      case "yrs":
                      case "yr":
                      case "y":
                        return n * y;

                      case "weeks":
                      case "week":
                      case "w":
                        return n * w;

                      case "days":
                      case "day":
                      case "d":
                        return n * d;

                      case "hours":
                      case "hour":
                      case "hrs":
                      case "hr":
                      case "h":
                        return n * h;

                      case "minutes":
                      case "minute":
                      case "mins":
                      case "min":
                      case "m":
                        return n * m;

                      case "seconds":
                      case "second":
                      case "secs":
                      case "sec":
                      case "s":
                        return n * s;

                      case "milliseconds":
                      case "millisecond":
                      case "msecs":
                      case "msec":
                      case "ms":
                        return n;

                      default:
                        return;
                    }
                }(val);
                if ("number" === type && isFinite(val)) return options.long ? function(ms) {
                    var msAbs = Math.abs(ms);
                    if (msAbs >= d) return plural(ms, msAbs, d, "day");
                    if (msAbs >= h) return plural(ms, msAbs, h, "hour");
                    if (msAbs >= m) return plural(ms, msAbs, m, "minute");
                    if (msAbs >= s) return plural(ms, msAbs, s, "second");
                    return ms + " ms";
                }(val) : function(ms) {
                    var msAbs = Math.abs(ms);
                    if (msAbs >= d) return Math.round(ms / d) + "d";
                    if (msAbs >= h) return Math.round(ms / h) + "h";
                    if (msAbs >= m) return Math.round(ms / m) + "m";
                    if (msAbs >= s) return Math.round(ms / s) + "s";
                    return ms + "ms";
                }(val);
                throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
            };
        },
        687: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            "use strict";
            __webpack_require__.d(__webpack_exports__, {
                Y: () => Logger
            });
            var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(227), debug__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);
            class Logger {
                constructor(namespace) {
                    this.namespace = namespace;
                }
                debug(debugMessage) {
                    const namespace = debugMessage.methodName ? `${this.namespace}:${debugMessage.methodName}` : this.namespace;
                    debugMessage.message && debug__WEBPACK_IMPORTED_MODULE_0___default()(namespace)(debugMessage.message), 
                    debugMessage.object && debug__WEBPACK_IMPORTED_MODULE_0___default()(namespace)(debugMessage.object);
                }
            }
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
    __webpack_require__.n = module => {
        var getter = module && module.__esModule ? () => module.default : () => module;
        return __webpack_require__.d(getter, {
            a: getter
        }), getter;
    }, __webpack_require__.d = (exports, definition) => {
        for (var key in definition) __webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key) && Object.defineProperty(exports, key, {
            enumerable: !0,
            get: definition[key]
        });
    }, __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop), 
    (() => {
        "use strict";
        const logger = new (0, __webpack_require__(687).Y)("ext:ContentScripts:Hulu:hulu_injected");
        window.seekScriptLoaded = !0;
        var seekInteraction = function(event) {
            if (event.source !== window) return void logger.debug({
                methodName: "seekInteraction",
                message: "event.source !== window"
            });
            const event_type = event.data.type;
            if (event_type) switch (logger.debug({
                methodName: "seekInteraction",
                message: `event_type[${event_type}]`
            }), event_type) {
              case "SEEK":
                document.querySelector("#content-video-player").__HuluDashPlayer__.currentTime = event.data.time / 1e3;
                break;

              case "UpdateState":
                {
                    const video = document.querySelector("#content-video-player"), paused = video.__HuluDashPlayer__._paused, currentTime = 1e3 * video.__HuluDashPlayer__._position.offset;
                    var evt = new CustomEvent("FromNode", {
                        detail: {
                            type: "UpdateState",
                            paused,
                            currentTime,
                            updatedAt: Date.now()
                        }
                    });
                    window.dispatchEvent(evt);
                    break;
                }

              case "teardown":
                window.removeEventListener("message", seekInteraction, !1), window.seekScriptLoaded = !1;
                break;

              case "nextEpisode":
                window.next.router.push({
                    pathname: "/",
                    query: {
                        entity: "watch",
                        id: event.data.nextEpisodeId
                    },
                    shallow: !0
                });
            }
        };
        window.addEventListener("message", seekInteraction, !1);
    })();
})();