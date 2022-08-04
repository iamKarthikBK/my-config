/*! For license information please see hbo_max_content_bundled.js.LICENSE.txt */
(() => {
    var __webpack_modules__ = {
        640: () => {
            !function(window, $, undefined) {
                "use strict";
                if (window.MutationObserver && "undefined" != typeof HTMLElement) {
                    var matches, arriveUniqueId = 0, utils = (matches = HTMLElement.prototype.matches || HTMLElement.prototype.webkitMatchesSelector || HTMLElement.prototype.mozMatchesSelector || HTMLElement.prototype.msMatchesSelector, 
                    {
                        matchesSelector: function(elem, selector) {
                            return elem instanceof HTMLElement && matches.call(elem, selector);
                        },
                        addMethod: function(object, name, fn) {
                            var old = object[name];
                            object[name] = function() {
                                return fn.length == arguments.length ? fn.apply(this, arguments) : "function" == typeof old ? old.apply(this, arguments) : void 0;
                            };
                        },
                        callCallbacks: function(callbacksToBeCalled, registrationData) {
                            registrationData && registrationData.options.onceOnly && 1 == registrationData.firedElems.length && (callbacksToBeCalled = [ callbacksToBeCalled[0] ]);
                            for (var cb, i = 0; cb = callbacksToBeCalled[i]; i++) cb && cb.callback && cb.callback.call(cb.elem, cb.elem);
                            registrationData && registrationData.options.onceOnly && 1 == registrationData.firedElems.length && registrationData.me.unbindEventWithSelectorAndCallback.call(registrationData.target, registrationData.selector, registrationData.callback);
                        },
                        checkChildNodesRecursively: function(nodes, registrationData, matchFunc, callbacksToBeCalled) {
                            for (var node, i = 0; node = nodes[i]; i++) matchFunc(node, registrationData, callbacksToBeCalled) && callbacksToBeCalled.push({
                                callback: registrationData.callback,
                                elem: node
                            }), node.childNodes.length > 0 && utils.checkChildNodesRecursively(node.childNodes, registrationData, matchFunc, callbacksToBeCalled);
                        },
                        mergeArrays: function(firstArr, secondArr) {
                            var attrName, options = {};
                            for (attrName in firstArr) firstArr.hasOwnProperty(attrName) && (options[attrName] = firstArr[attrName]);
                            for (attrName in secondArr) secondArr.hasOwnProperty(attrName) && (options[attrName] = secondArr[attrName]);
                            return options;
                        },
                        toElementsArray: function(elements) {
                            return void 0 === elements || "number" == typeof elements.length && elements !== window || (elements = [ elements ]), 
                            elements;
                        }
                    }), EventsBucket = function() {
                        var EventsBucket = function() {
                            this._eventsBucket = [], this._beforeAdding = null, this._beforeRemoving = null;
                        };
                        return EventsBucket.prototype.addEvent = function(target, selector, options, callback) {
                            var newEvent = {
                                target,
                                selector,
                                options,
                                callback,
                                firedElems: []
                            };
                            return this._beforeAdding && this._beforeAdding(newEvent), this._eventsBucket.push(newEvent), 
                            newEvent;
                        }, EventsBucket.prototype.removeEvent = function(compareFunction) {
                            for (var registeredEvent, i = this._eventsBucket.length - 1; registeredEvent = this._eventsBucket[i]; i--) if (compareFunction(registeredEvent)) {
                                this._beforeRemoving && this._beforeRemoving(registeredEvent);
                                var removedEvents = this._eventsBucket.splice(i, 1);
                                removedEvents && removedEvents.length && (removedEvents[0].callback = null);
                            }
                        }, EventsBucket.prototype.beforeAdding = function(beforeAdding) {
                            this._beforeAdding = beforeAdding;
                        }, EventsBucket.prototype.beforeRemoving = function(beforeRemoving) {
                            this._beforeRemoving = beforeRemoving;
                        }, EventsBucket;
                    }(), MutationEvents = function(getObserverConfig, onMutation) {
                        var eventsBucket = new EventsBucket, me = this, defaultOptions = {
                            fireOnAttributesModification: !1
                        };
                        return eventsBucket.beforeAdding((function(registrationData) {
                            var observer, target = registrationData.target;
                            target !== window.document && target !== window || (target = document.getElementsByTagName("html")[0]), 
                            observer = new MutationObserver((function(e) {
                                onMutation.call(this, e, registrationData);
                            }));
                            var config = getObserverConfig(registrationData.options);
                            observer.observe(target, config), registrationData.observer = observer, registrationData.me = me;
                        })), eventsBucket.beforeRemoving((function(eventData) {
                            eventData.observer.disconnect();
                        })), this.bindEvent = function(selector, options, callback) {
                            options = utils.mergeArrays(defaultOptions, options);
                            for (var elements = utils.toElementsArray(this), i = 0; i < elements.length; i++) eventsBucket.addEvent(elements[i], selector, options, callback);
                        }, this.unbindEvent = function() {
                            var elements = utils.toElementsArray(this);
                            eventsBucket.removeEvent((function(eventObj) {
                                for (var i = 0; i < elements.length; i++) if (this === undefined || eventObj.target === elements[i]) return !0;
                                return !1;
                            }));
                        }, this.unbindEventWithSelectorOrCallback = function(selector) {
                            var compareFunction, elements = utils.toElementsArray(this), callback = selector;
                            compareFunction = "function" == typeof selector ? function(eventObj) {
                                for (var i = 0; i < elements.length; i++) if ((this === undefined || eventObj.target === elements[i]) && eventObj.callback === callback) return !0;
                                return !1;
                            } : function(eventObj) {
                                for (var i = 0; i < elements.length; i++) if ((this === undefined || eventObj.target === elements[i]) && eventObj.selector === selector) return !0;
                                return !1;
                            }, eventsBucket.removeEvent(compareFunction);
                        }, this.unbindEventWithSelectorAndCallback = function(selector, callback) {
                            var elements = utils.toElementsArray(this);
                            eventsBucket.removeEvent((function(eventObj) {
                                for (var i = 0; i < elements.length; i++) if ((this === undefined || eventObj.target === elements[i]) && eventObj.selector === selector && eventObj.callback === callback) return !0;
                                return !1;
                            }));
                        }, this;
                    }, arriveEvents = new function() {
                        var arriveDefaultOptions = {
                            fireOnAttributesModification: !1,
                            onceOnly: !1,
                            existing: !1
                        };
                        function nodeMatchFunc(node, registrationData, callbacksToBeCalled) {
                            return !(!utils.matchesSelector(node, registrationData.selector) || (node._id === undefined && (node._id = arriveUniqueId++), 
                            -1 != registrationData.firedElems.indexOf(node._id))) && (registrationData.firedElems.push(node._id), 
                            !0);
                        }
                        var mutationBindEvent = (arriveEvents = new MutationEvents((function(options) {
                            var config = {
                                attributes: !1,
                                childList: !0,
                                subtree: !0
                            };
                            return options.fireOnAttributesModification && (config.attributes = !0), config;
                        }), (function(mutations, registrationData) {
                            mutations.forEach((function(mutation) {
                                var newNodes = mutation.addedNodes, targetNode = mutation.target, callbacksToBeCalled = [];
                                null !== newNodes && newNodes.length > 0 ? utils.checkChildNodesRecursively(newNodes, registrationData, nodeMatchFunc, callbacksToBeCalled) : "attributes" === mutation.type && nodeMatchFunc(targetNode, registrationData, callbacksToBeCalled) && callbacksToBeCalled.push({
                                    callback: registrationData.callback,
                                    elem: targetNode
                                }), utils.callCallbacks(callbacksToBeCalled, registrationData);
                            }));
                        }))).bindEvent;
                        return arriveEvents.bindEvent = function(selector, options, callback) {
                            void 0 === callback ? (callback = options, options = arriveDefaultOptions) : options = utils.mergeArrays(arriveDefaultOptions, options);
                            var elements = utils.toElementsArray(this);
                            if (options.existing) {
                                for (var existing = [], i = 0; i < elements.length; i++) for (var nodes = elements[i].querySelectorAll(selector), j = 0; j < nodes.length; j++) existing.push({
                                    callback,
                                    elem: nodes[j]
                                });
                                if (options.onceOnly && existing.length) return callback.call(existing[0].elem, existing[0].elem);
                                setTimeout(utils.callCallbacks, 1, existing);
                            }
                            mutationBindEvent.call(this, selector, options, callback);
                        }, arriveEvents;
                    }, leaveEvents = new function() {
                        var leaveDefaultOptions = {};
                        function nodeMatchFunc(node, registrationData) {
                            return utils.matchesSelector(node, registrationData.selector);
                        }
                        var mutationBindEvent = (leaveEvents = new MutationEvents((function() {
                            return {
                                childList: !0,
                                subtree: !0
                            };
                        }), (function(mutations, registrationData) {
                            mutations.forEach((function(mutation) {
                                var removedNodes = mutation.removedNodes, callbacksToBeCalled = [];
                                null !== removedNodes && removedNodes.length > 0 && utils.checkChildNodesRecursively(removedNodes, registrationData, nodeMatchFunc, callbacksToBeCalled), 
                                utils.callCallbacks(callbacksToBeCalled, registrationData);
                            }));
                        }))).bindEvent;
                        return leaveEvents.bindEvent = function(selector, options, callback) {
                            void 0 === callback ? (callback = options, options = leaveDefaultOptions) : options = utils.mergeArrays(leaveDefaultOptions, options), 
                            mutationBindEvent.call(this, selector, options, callback);
                        }, leaveEvents;
                    };
                    $ && exposeApi($.fn), exposeApi(HTMLElement.prototype), exposeApi(NodeList.prototype), 
                    exposeApi(HTMLCollection.prototype), exposeApi(HTMLDocument.prototype), exposeApi(Window.prototype);
                    var Arrive = {};
                    return exposeUnbindApi(arriveEvents, Arrive, "unbindAllArrive"), exposeUnbindApi(leaveEvents, Arrive, "unbindAllLeave"), 
                    Arrive;
                }
                function exposeUnbindApi(eventObj, exposeTo, funcName) {
                    utils.addMethod(exposeTo, funcName, eventObj.unbindEvent), utils.addMethod(exposeTo, funcName, eventObj.unbindEventWithSelectorOrCallback), 
                    utils.addMethod(exposeTo, funcName, eventObj.unbindEventWithSelectorAndCallback);
                }
                function exposeApi(exposeTo) {
                    exposeTo.arrive = arriveEvents.bindEvent, exposeUnbindApi(arriveEvents, exposeTo, "unbindArrive"), 
                    exposeTo.leave = leaveEvents.bindEvent, exposeUnbindApi(leaveEvents, exposeTo, "unbindLeave");
                }
            }(window, "undefined" == typeof jQuery ? null : jQuery, void 0);
        },
        726: module => {
            module.exports = '<div id="tpIconContainer">\r\n    <div class="" id="tp-buttons-container">\r\n        <button id="tp-icon-container">\r\n            <img id="tp-icon-white" src=\'{EXTENSION_LOGO_GRADIENT}\' />\r\n            <span class="tooltiptext extension-txt" style="width: 120px;">Start a party</span>\r\n        </button>\r\n        <div class="tp-seperator"></div>\r\n        <div class="hidden" id="tp-party-active">\r\n            <button class="tp-control-button" id="tp-link-button">\r\n                <img class="tp-button-image tp-center-image" data-tp-id="overlay-copy_link" src=\'{LINK_IMAGE}\' />\r\n                <img class="tp-hover-image tp-center-image" data-tp-id="overlay-copy_link" src=\'{LINK_ACTIVE_IMAGE}\' />\r\n                <span class="tooltiptext extension-txt" style="width: 120px;">Copy link</span>\r\n            </button>\r\n            <button class="tp-control-button" id="tp-chat-button">\r\n                <img id="tp-chat-reset" class="tp-center-image hidden" data-tp-id="overlay-reset_chat" src=\'{RESET_CHAT_IMAGE}\' />\r\n                <img id="tp-chat-hidden" class="tp-button-image tp-center-image" src=\'{CHAT_HIDDEN_IMAGE}\' />\r\n                <img id="tp-chat-gray" class="hidden tp-button-image tp-center-image" src=\'{CHAT_GRAY_IMAGE}\' />\r\n                <img class="tp-hover-image tp-center-image" data-tp-id="overlay-show_chat" src=\'{CHAT_ACTIVE_IMAGE}\' />\r\n                <div class="hidden" id="tp-message-indicator"></div>\r\n                <span class="tooltiptext extension-txt" style="width: 120px;">Show chat</span>\r\n            </button>\r\n            <button class="tp-control-button" id="tp-disconnect-button">\r\n                <img class="tp-button-image tp-center-image" data-tp-id="overlay-leave_party"\r\n                    src=\'{DISCONNECT_IMAGE}\' />\r\n                <img class="tp-hover-image tp-center-image" data-tp-id="overlay-leave_party" src=\'{DISCONNECT_IMAGE}\' />\r\n                <span class="tooltiptext extension-txt" style="width: 120px;">Leave Party</span>\r\n            </button>\r\n        </div>\r\n        <div id="tp-party-inactive">\r\n            <button class="tp-control-button" id="tp-control-lock-button">\r\n                <img id="tp-unlocked-image" src=\'{UNLOCKED_IMAGE}\' />\r\n                <img class="hidden" id="tp-locked-image" src=\'{LOCKED_IMAGE}\' />\r\n                <span class="tooltiptext extension-txt" style="width: 160px;">Only I have control</span>\r\n            </button>\r\n        </div>\r\n    </div>\r\n    <button class="hidden tp-control-button" id="tp-chat-close-button">\r\n        <img id="tp-start-image" data-tp-id="overlay-hide_chat" src=\'{ARROW_RIGHT}\' />\r\n        <span class="tooltiptext extension-txt" style="width: 100px;">Hide chat</span>\r\n    </button>\r\n    <div id="tp-error-box" class="hidden">\r\n        <p class="extension-txt-indicator" id="tp-controls-error-text">\r\n            Failed to connect to background script. Please Try again later\r\n        </p>\r\n    </div>\r\n</div>';
        },
        301: module => {
            module.exports = '<div id="notification-link" class="notification-links" tpInjected>\r\n</div>\r\n<div id="chat-wrapper" tpInjected>\r\n  <div id="chat-container">\r\n    <div id="chat-header-container">\r\n      <ul id="chat-menu-container" data-tp-id="chat_menu_container">\r\n        <li id="function-title">\r\n          <div id="title">\r\n            <p class="extension-title" data-tp-id="chat_menu_container-extension_title">Teleparty</p>\r\n          </div>\r\n        </li>\r\n        <li id="function-user">\r\n\r\n          <div id="reset-icon" class="tp-toolcontainer" style="display: none">\r\n            <img class="reset-link" src="{RESET_SGV}" data-tp-id="chat_menu_container-reset_video" />\r\n            <span class="tooltiptext extension-txt" style="width: 120px;">Return to video</span>\r\n          </div>\r\n\r\n          <div id="link-icon" class="tp-toolcontainer">\r\n            <img class="chat-link" src="{LINK_SVG}" data-tp-id="chat_menu_container-copy_link">\r\n            <span class="tooltiptext extension-txt" style="width: 120px;">Copy link</span>\r\n            <input id="share-url" type="text" readonly="true" autocomplete="off" autofocus style="display:none;" />\r\n          </div>\r\n          \r\n          <a id="user-icon" style="padding: 2px 2px 0px 0px;">\r\n            <img src="{USER_ICON}" data-tp-id="chat_menu_container-edit_user_settings_icon" />\r\n          </a>\r\n        </li>\r\n      </ul>\r\n      \r\n      <div id="chat-link-container" style=\'display:none;\'>\r\n        <div id="chat-link">\r\n          <div id="chat-link-url">\r\n            <p>The url link goes here.</p>\r\n          </div>\r\n          <div id="chat-link-icon">\r\n            <img src="{LINK_SVG}">\r\n          </div>\r\n        </div>\r\n      </div>\r\n\r\n      <div id="chat-icon-container" style="display:none">\r\n        <div id="icon-title-container">\r\n          <div id="icon-title">\r\n            <p class="extension-description" data-tp-id="chat_container-switch_icon_label">Click to switch icon</p>\r\n          </div>\r\n        </div>\r\n        <div id="icon-holder-container">\r\n          <div id="icon-holder-template">\r\n            <div class="icon-holder-wrap">\r\n              <p class="extension-txt-indicator"></p>\r\n              <ul id="icon-holder"></ul>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n\r\n    </div>\r\n\r\n    <div id="setting-edit" class="chat-settings-container setting-container" style="display:none">\r\n\r\n      <div class="setting-usericon">\r\n        <div class="section-b-inner section-inner">\r\n          <a class="user-icon">\r\n            <img src="{USER_ICON}" data-tp-id="setting_edit-edit_user_icon" />\r\n          </a>\r\n        </div>\r\n      </div>\r\n\r\n      <div class="section-c setting-nickname">\r\n        <div class="section-c-inner section-inner">\r\n          <div class="nickname-section row-wrap">\r\n            <div class="nickname-wrap row-one">\r\n              <p class="extension-description" data-tp-id="setting_edit-nickname_label">Nickname</p>\r\n            </div>\r\n            <div class="nickname-input row-two">\r\n              <input id="nickname-edit" class="extension-txt" autocomplete="off" type="text"\r\n                placeholder="{USER_NICKNAME}" data-tp-id="setting_edit-edit_nickname_input" />\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n\r\n    </div>\r\n\r\n    <div id="settings-save" class="chat-settings-container setting-container" style="display:none">\r\n      <div class="section-d">\r\n        <div class="section-d-inner section-inner">\r\n\r\n          <div class="btns">\r\n            <button id="saveChanges" class=\'extension-btn\' data-tp-id="setting_edit-save_changes_button">Save\r\n              Changes</button>\r\n            <button id="cancelNickname" class=\'extension-btn cancel-btn\'\r\n              data-tp-id="setting_edit-cancel_changes_button">Cancel</button>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div id="chat-history-container" data-tp-id="chat_history_container">\r\n      <div id="chat-history">\r\n\r\n      </div>\r\n    </div>\r\n\r\n\r\n    <div id="chat-input-container" class="extension-border-top">\r\n      <div id="reaction-holder" data-tp-id="chat_input_container-reaction_holder">\r\n        <button class="tp-reaction-btn" id="tp-heart-button">\r\n          <img class="tp-reaction-static" src={HEART_STATIC} data-tp-id="chat_input_container-reaction_holder-heart" />\r\n          <img class="tp-reaction-gif" src={HEART_GIF} data-tp-id="chat_input_container-reaction_holder-heart" />\r\n        </button>\r\n        <button class="tp-reaction-btn" id="tp-angry-button">\r\n          <img class="tp-reaction-static" src={ANGRY_STATIC} data-tp-id="chat_input_container-reaction_holder-angry" />\r\n          <img class="tp-reaction-gif" src={ANGRY_GIF} data-tp-id="chat_input_container-reaction_holder-angry" />\r\n        </button>\r\n        <button class="tp-reaction-btn" id="tp-cry-button">\r\n          <img class="tp-reaction-static" src={CRY_STATIC} data-tp-id="chat_input_container-reaction_holder-cry" />\r\n          <img class="tp-reaction-gif" src={CRY_GIF} data-tp-id="chat_input_container-reaction_holder-cry" />\r\n        </button>\r\n        <button class="tp-reaction-btn" id="tp-laugh-button">\r\n          <img class="tp-reaction-static" src={LAUGH_STATIC} data-tp-id="chat_input_container-reaction_holder-laugh" />\r\n          <img class="tp-reaction-gif" src={LAUGH_GIF} data-tp-id="chat_input_container-reaction_holder-laugh" />\r\n        </button>\r\n        <button class="tp-reaction-btn" id="tp-surprise-button">\r\n          <img class="tp-reaction-static" src={SURPRISE_STATIC}\r\n            data-tp-id="chat_input_container-reaction_holder-surprise" />\r\n          <img class="tp-reaction-gif" src={SURPRISE_GIF} data-tp-id="chat_input_container-reaction_holder-surprise" />\r\n        </button>\r\n        <button class="tp-reaction-btn" id="tp-fire-button">\r\n          <img class="tp-reaction-static" src={FIRE_STATIC} data-tp-id="chat_input_container-reaction_holder-fire" />\r\n          <img class="tp-reaction-gif" src={FIRE_GIF} data-tp-id="chat_input_container-reaction_holder-fire" />\r\n        </button>\r\n      </div>\r\n      <div id="gif-emoji-switcher">\r\n          <iframe id="emoji-picker-container" style="padding: 0px" data-tp-id="chat_input_container-emoji_picker" src="{EMOJI_FRAME}"></iframe>\r\n        <div id="gif-picker-container">\r\n          <div id="gif-input-wrapper">\r\n            <button id="gif-input-back">\r\n              <img id="gif-back-btn" src="{GIF_BACK_BUTTON}" />\r\n            </button>\r\n            <input id="gif-search" class="search" placeholder="Search Tenor GIFs" autocomplete="off">\r\n          </div>\r\n\r\n          <div id="gif-results-wrapper" data-tp-id="chat_input_container-gif_popup">\r\n            <div id="category-container"></div>\r\n            <div id="gif-columns-wrapper">\r\n              <div class="gif-results" id="gif-results-left"></div>\r\n              <div class="gif-results" id="gif-results-right"></div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div id="chat-input" class="extension-txt" contenteditable="true" spellcheck="false"\r\n        placeholder="Type a message" data-placeholder="Type a message..." data-tp-id="chat_input_container-chat_input"></div>\r\n      \x3c!-- <input  class="" type="text" placeholder="Type a message..." autocomplete="off"> --\x3e\r\n      <div id="bottom-chat-controls">\r\n        <button id="reaction-btn">\r\n          <img id="reaction-btn-icon" src="{REACTION_PICKER_ICON}" />\r\n        </button>\r\n        <button id="gif-btn">\r\n          <img id="gif-btn-icon" src="{GIF_PICKER_ICON}" />\r\n        </button>\r\n        <button id="emoji-picker-btn">\r\n          <img id="emoji-picker-btn-icon" src="{EMOJI_PICKER_ICON}" />\r\n        </button>\r\n\r\n      </div>\r\n      \x3c!-- </input> --\x3e\r\n    </div>\r\n    <div id="presence-indicator" class="extension-txt-indicator" data-tp-id="chat_input_container-presence_indicator">\r\n      <p class="extension-txt-indicator">People are currently typing...</p>\r\n    </div>\r\n\r\n\r\n\r\n  </div>\r\n</div>';
        },
        755: function(module, exports) {
            var __WEBPACK_AMD_DEFINE_RESULT__;
            !function(global, factory) {
                "use strict";
                "object" == typeof module.exports ? module.exports = global.document ? factory(global, !0) : function(w) {
                    if (!w.document) throw new Error("jQuery requires a window with a document");
                    return factory(w);
                } : factory(global);
            }("undefined" != typeof window ? window : this, (function(window, noGlobal) {
                "use strict";
                var arr = [], getProto = Object.getPrototypeOf, slice = arr.slice, flat = arr.flat ? function(array) {
                    return arr.flat.call(array);
                } : function(array) {
                    return arr.concat.apply([], array);
                }, push = arr.push, indexOf = arr.indexOf, class2type = {}, toString = class2type.toString, hasOwn = class2type.hasOwnProperty, fnToString = hasOwn.toString, ObjectFunctionString = fnToString.call(Object), support = {}, isFunction = function(obj) {
                    return "function" == typeof obj && "number" != typeof obj.nodeType && "function" != typeof obj.item;
                }, isWindow = function(obj) {
                    return null != obj && obj === obj.window;
                }, document = window.document, preservedScriptAttributes = {
                    type: !0,
                    src: !0,
                    nonce: !0,
                    noModule: !0
                };
                function DOMEval(code, node, doc) {
                    var i, val, script = (doc = doc || document).createElement("script");
                    if (script.text = code, node) for (i in preservedScriptAttributes) (val = node[i] || node.getAttribute && node.getAttribute(i)) && script.setAttribute(i, val);
                    doc.head.appendChild(script).parentNode.removeChild(script);
                }
                function toType(obj) {
                    return null == obj ? obj + "" : "object" == typeof obj || "function" == typeof obj ? class2type[toString.call(obj)] || "object" : typeof obj;
                }
                var jQuery = function(selector, context) {
                    return new jQuery.fn.init(selector, context);
                };
                function isArrayLike(obj) {
                    var length = !!obj && "length" in obj && obj.length, type = toType(obj);
                    return !isFunction(obj) && !isWindow(obj) && ("array" === type || 0 === length || "number" == typeof length && length > 0 && length - 1 in obj);
                }
                jQuery.fn = jQuery.prototype = {
                    jquery: "3.6.0",
                    constructor: jQuery,
                    length: 0,
                    toArray: function() {
                        return slice.call(this);
                    },
                    get: function(num) {
                        return null == num ? slice.call(this) : num < 0 ? this[num + this.length] : this[num];
                    },
                    pushStack: function(elems) {
                        var ret = jQuery.merge(this.constructor(), elems);
                        return ret.prevObject = this, ret;
                    },
                    each: function(callback) {
                        return jQuery.each(this, callback);
                    },
                    map: function(callback) {
                        return this.pushStack(jQuery.map(this, (function(elem, i) {
                            return callback.call(elem, i, elem);
                        })));
                    },
                    slice: function() {
                        return this.pushStack(slice.apply(this, arguments));
                    },
                    first: function() {
                        return this.eq(0);
                    },
                    last: function() {
                        return this.eq(-1);
                    },
                    even: function() {
                        return this.pushStack(jQuery.grep(this, (function(_elem, i) {
                            return (i + 1) % 2;
                        })));
                    },
                    odd: function() {
                        return this.pushStack(jQuery.grep(this, (function(_elem, i) {
                            return i % 2;
                        })));
                    },
                    eq: function(i) {
                        var len = this.length, j = +i + (i < 0 ? len : 0);
                        return this.pushStack(j >= 0 && j < len ? [ this[j] ] : []);
                    },
                    end: function() {
                        return this.prevObject || this.constructor();
                    },
                    push,
                    sort: arr.sort,
                    splice: arr.splice
                }, jQuery.extend = jQuery.fn.extend = function() {
                    var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = !1;
                    for ("boolean" == typeof target && (deep = target, target = arguments[i] || {}, 
                    i++), "object" == typeof target || isFunction(target) || (target = {}), i === length && (target = this, 
                    i--); i < length; i++) if (null != (options = arguments[i])) for (name in options) copy = options[name], 
                    "__proto__" !== name && target !== copy && (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = Array.isArray(copy))) ? (src = target[name], 
                    clone = copyIsArray && !Array.isArray(src) ? [] : copyIsArray || jQuery.isPlainObject(src) ? src : {}, 
                    copyIsArray = !1, target[name] = jQuery.extend(deep, clone, copy)) : void 0 !== copy && (target[name] = copy));
                    return target;
                }, jQuery.extend({
                    expando: "jQuery" + ("3.6.0" + Math.random()).replace(/\D/g, ""),
                    isReady: !0,
                    error: function(msg) {
                        throw new Error(msg);
                    },
                    noop: function() {},
                    isPlainObject: function(obj) {
                        var proto, Ctor;
                        return !(!obj || "[object Object]" !== toString.call(obj)) && (!(proto = getProto(obj)) || "function" == typeof (Ctor = hasOwn.call(proto, "constructor") && proto.constructor) && fnToString.call(Ctor) === ObjectFunctionString);
                    },
                    isEmptyObject: function(obj) {
                        var name;
                        for (name in obj) return !1;
                        return !0;
                    },
                    globalEval: function(code, options, doc) {
                        DOMEval(code, {
                            nonce: options && options.nonce
                        }, doc);
                    },
                    each: function(obj, callback) {
                        var length, i = 0;
                        if (isArrayLike(obj)) for (length = obj.length; i < length && !1 !== callback.call(obj[i], i, obj[i]); i++) ; else for (i in obj) if (!1 === callback.call(obj[i], i, obj[i])) break;
                        return obj;
                    },
                    makeArray: function(arr, results) {
                        var ret = results || [];
                        return null != arr && (isArrayLike(Object(arr)) ? jQuery.merge(ret, "string" == typeof arr ? [ arr ] : arr) : push.call(ret, arr)), 
                        ret;
                    },
                    inArray: function(elem, arr, i) {
                        return null == arr ? -1 : indexOf.call(arr, elem, i);
                    },
                    merge: function(first, second) {
                        for (var len = +second.length, j = 0, i = first.length; j < len; j++) first[i++] = second[j];
                        return first.length = i, first;
                    },
                    grep: function(elems, callback, invert) {
                        for (var matches = [], i = 0, length = elems.length, callbackExpect = !invert; i < length; i++) !callback(elems[i], i) !== callbackExpect && matches.push(elems[i]);
                        return matches;
                    },
                    map: function(elems, callback, arg) {
                        var length, value, i = 0, ret = [];
                        if (isArrayLike(elems)) for (length = elems.length; i < length; i++) null != (value = callback(elems[i], i, arg)) && ret.push(value); else for (i in elems) null != (value = callback(elems[i], i, arg)) && ret.push(value);
                        return flat(ret);
                    },
                    guid: 1,
                    support
                }), "function" == typeof Symbol && (jQuery.fn[Symbol.iterator] = arr[Symbol.iterator]), 
                jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), (function(_i, name) {
                    class2type["[object " + name + "]"] = name.toLowerCase();
                }));
                var Sizzle = function(window) {
                    var i, support, Expr, getText, isXML, tokenize, compile, select, outermostContext, sortInput, hasDuplicate, setDocument, document, docElem, documentIsHTML, rbuggyQSA, rbuggyMatches, matches, contains, expando = "sizzle" + 1 * new Date, preferredDoc = window.document, dirruns = 0, done = 0, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(), nonnativeSelectorCache = createCache(), sortOrder = function(a, b) {
                        return a === b && (hasDuplicate = !0), 0;
                    }, hasOwn = {}.hasOwnProperty, arr = [], pop = arr.pop, pushNative = arr.push, push = arr.push, slice = arr.slice, indexOf = function(list, elem) {
                        for (var i = 0, len = list.length; i < len; i++) if (list[i] === elem) return i;
                        return -1;
                    }, booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", whitespace = "[\\x20\\t\\r\\n\\f]", identifier = "(?:\\\\[\\da-fA-F]{1,6}[\\x20\\t\\r\\n\\f]?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+", attributes = "\\[[\\x20\\t\\r\\n\\f]*(" + identifier + ")(?:" + whitespace + "*([*^$|!~]?=)" + whitespace + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace + "*\\]", pseudos = ":(" + identifier + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|.*)\\)|)", rwhitespace = new RegExp(whitespace + "+", "g"), rtrim = new RegExp("^[\\x20\\t\\r\\n\\f]+|((?:^|[^\\\\])(?:\\\\.)*)[\\x20\\t\\r\\n\\f]+$", "g"), rcomma = new RegExp("^[\\x20\\t\\r\\n\\f]*,[\\x20\\t\\r\\n\\f]*"), rcombinators = new RegExp("^[\\x20\\t\\r\\n\\f]*([>+~]|[\\x20\\t\\r\\n\\f])[\\x20\\t\\r\\n\\f]*"), rdescend = new RegExp(whitespace + "|>"), rpseudo = new RegExp(pseudos), ridentifier = new RegExp("^" + identifier + "$"), matchExpr = {
                        ID: new RegExp("^#(" + identifier + ")"),
                        CLASS: new RegExp("^\\.(" + identifier + ")"),
                        TAG: new RegExp("^(" + identifier + "|[*])"),
                        ATTR: new RegExp("^" + attributes),
                        PSEUDO: new RegExp("^" + pseudos),
                        CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\([\\x20\\t\\r\\n\\f]*(even|odd|(([+-]|)(\\d*)n|)[\\x20\\t\\r\\n\\f]*(?:([+-]|)[\\x20\\t\\r\\n\\f]*(\\d+)|))[\\x20\\t\\r\\n\\f]*\\)|)", "i"),
                        bool: new RegExp("^(?:" + booleans + ")$", "i"),
                        needsContext: new RegExp("^[\\x20\\t\\r\\n\\f]*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\([\\x20\\t\\r\\n\\f]*((?:-\\d)?\\d*)[\\x20\\t\\r\\n\\f]*\\)|)(?=[^-]|$)", "i")
                    }, rhtml = /HTML$/i, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rnative = /^[^{]+\{\s*\[native \w/, rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rsibling = /[+~]/, runescape = new RegExp("\\\\[\\da-fA-F]{1,6}[\\x20\\t\\r\\n\\f]?|\\\\([^\\r\\n\\f])", "g"), funescape = function(escape, nonHex) {
                        var high = "0x" + escape.slice(1) - 65536;
                        return nonHex || (high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, 1023 & high | 56320));
                    }, rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g, fcssescape = function(ch, asCodePoint) {
                        return asCodePoint ? "\0" === ch ? "�" : ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " " : "\\" + ch;
                    }, unloadHandler = function() {
                        setDocument();
                    }, inDisabledFieldset = addCombinator((function(elem) {
                        return !0 === elem.disabled && "fieldset" === elem.nodeName.toLowerCase();
                    }), {
                        dir: "parentNode",
                        next: "legend"
                    });
                    try {
                        push.apply(arr = slice.call(preferredDoc.childNodes), preferredDoc.childNodes), 
                        arr[preferredDoc.childNodes.length].nodeType;
                    } catch (e) {
                        push = {
                            apply: arr.length ? function(target, els) {
                                pushNative.apply(target, slice.call(els));
                            } : function(target, els) {
                                for (var j = target.length, i = 0; target[j++] = els[i++]; ) ;
                                target.length = j - 1;
                            }
                        };
                    }
                    function Sizzle(selector, context, results, seed) {
                        var m, i, elem, nid, match, groups, newSelector, newContext = context && context.ownerDocument, nodeType = context ? context.nodeType : 9;
                        if (results = results || [], "string" != typeof selector || !selector || 1 !== nodeType && 9 !== nodeType && 11 !== nodeType) return results;
                        if (!seed && (setDocument(context), context = context || document, documentIsHTML)) {
                            if (11 !== nodeType && (match = rquickExpr.exec(selector))) if (m = match[1]) {
                                if (9 === nodeType) {
                                    if (!(elem = context.getElementById(m))) return results;
                                    if (elem.id === m) return results.push(elem), results;
                                } else if (newContext && (elem = newContext.getElementById(m)) && contains(context, elem) && elem.id === m) return results.push(elem), 
                                results;
                            } else {
                                if (match[2]) return push.apply(results, context.getElementsByTagName(selector)), 
                                results;
                                if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) return push.apply(results, context.getElementsByClassName(m)), 
                                results;
                            }
                            if (support.qsa && !nonnativeSelectorCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector)) && (1 !== nodeType || "object" !== context.nodeName.toLowerCase())) {
                                if (newSelector = selector, newContext = context, 1 === nodeType && (rdescend.test(selector) || rcombinators.test(selector))) {
                                    for ((newContext = rsibling.test(selector) && testContext(context.parentNode) || context) === context && support.scope || ((nid = context.getAttribute("id")) ? nid = nid.replace(rcssescape, fcssescape) : context.setAttribute("id", nid = expando)), 
                                    i = (groups = tokenize(selector)).length; i--; ) groups[i] = (nid ? "#" + nid : ":scope") + " " + toSelector(groups[i]);
                                    newSelector = groups.join(",");
                                }
                                try {
                                    return push.apply(results, newContext.querySelectorAll(newSelector)), results;
                                } catch (qsaError) {
                                    nonnativeSelectorCache(selector, !0);
                                } finally {
                                    nid === expando && context.removeAttribute("id");
                                }
                            }
                        }
                        return select(selector.replace(rtrim, "$1"), context, results, seed);
                    }
                    function createCache() {
                        var keys = [];
                        return function cache(key, value) {
                            return keys.push(key + " ") > Expr.cacheLength && delete cache[keys.shift()], cache[key + " "] = value;
                        };
                    }
                    function markFunction(fn) {
                        return fn[expando] = !0, fn;
                    }
                    function assert(fn) {
                        var el = document.createElement("fieldset");
                        try {
                            return !!fn(el);
                        } catch (e) {
                            return !1;
                        } finally {
                            el.parentNode && el.parentNode.removeChild(el), el = null;
                        }
                    }
                    function addHandle(attrs, handler) {
                        for (var arr = attrs.split("|"), i = arr.length; i--; ) Expr.attrHandle[arr[i]] = handler;
                    }
                    function siblingCheck(a, b) {
                        var cur = b && a, diff = cur && 1 === a.nodeType && 1 === b.nodeType && a.sourceIndex - b.sourceIndex;
                        if (diff) return diff;
                        if (cur) for (;cur = cur.nextSibling; ) if (cur === b) return -1;
                        return a ? 1 : -1;
                    }
                    function createInputPseudo(type) {
                        return function(elem) {
                            return "input" === elem.nodeName.toLowerCase() && elem.type === type;
                        };
                    }
                    function createButtonPseudo(type) {
                        return function(elem) {
                            var name = elem.nodeName.toLowerCase();
                            return ("input" === name || "button" === name) && elem.type === type;
                        };
                    }
                    function createDisabledPseudo(disabled) {
                        return function(elem) {
                            return "form" in elem ? elem.parentNode && !1 === elem.disabled ? "label" in elem ? "label" in elem.parentNode ? elem.parentNode.disabled === disabled : elem.disabled === disabled : elem.isDisabled === disabled || elem.isDisabled !== !disabled && inDisabledFieldset(elem) === disabled : elem.disabled === disabled : "label" in elem && elem.disabled === disabled;
                        };
                    }
                    function createPositionalPseudo(fn) {
                        return markFunction((function(argument) {
                            return argument = +argument, markFunction((function(seed, matches) {
                                for (var j, matchIndexes = fn([], seed.length, argument), i = matchIndexes.length; i--; ) seed[j = matchIndexes[i]] && (seed[j] = !(matches[j] = seed[j]));
                            }));
                        }));
                    }
                    function testContext(context) {
                        return context && void 0 !== context.getElementsByTagName && context;
                    }
                    for (i in support = Sizzle.support = {}, isXML = Sizzle.isXML = function(elem) {
                        var namespace = elem && elem.namespaceURI, docElem = elem && (elem.ownerDocument || elem).documentElement;
                        return !rhtml.test(namespace || docElem && docElem.nodeName || "HTML");
                    }, setDocument = Sizzle.setDocument = function(node) {
                        var hasCompare, subWindow, doc = node ? node.ownerDocument || node : preferredDoc;
                        return doc != document && 9 === doc.nodeType && doc.documentElement ? (docElem = (document = doc).documentElement, 
                        documentIsHTML = !isXML(document), preferredDoc != document && (subWindow = document.defaultView) && subWindow.top !== subWindow && (subWindow.addEventListener ? subWindow.addEventListener("unload", unloadHandler, !1) : subWindow.attachEvent && subWindow.attachEvent("onunload", unloadHandler)), 
                        support.scope = assert((function(el) {
                            return docElem.appendChild(el).appendChild(document.createElement("div")), void 0 !== el.querySelectorAll && !el.querySelectorAll(":scope fieldset div").length;
                        })), support.attributes = assert((function(el) {
                            return el.className = "i", !el.getAttribute("className");
                        })), support.getElementsByTagName = assert((function(el) {
                            return el.appendChild(document.createComment("")), !el.getElementsByTagName("*").length;
                        })), support.getElementsByClassName = rnative.test(document.getElementsByClassName), 
                        support.getById = assert((function(el) {
                            return docElem.appendChild(el).id = expando, !document.getElementsByName || !document.getElementsByName(expando).length;
                        })), support.getById ? (Expr.filter.ID = function(id) {
                            var attrId = id.replace(runescape, funescape);
                            return function(elem) {
                                return elem.getAttribute("id") === attrId;
                            };
                        }, Expr.find.ID = function(id, context) {
                            if (void 0 !== context.getElementById && documentIsHTML) {
                                var elem = context.getElementById(id);
                                return elem ? [ elem ] : [];
                            }
                        }) : (Expr.filter.ID = function(id) {
                            var attrId = id.replace(runescape, funescape);
                            return function(elem) {
                                var node = void 0 !== elem.getAttributeNode && elem.getAttributeNode("id");
                                return node && node.value === attrId;
                            };
                        }, Expr.find.ID = function(id, context) {
                            if (void 0 !== context.getElementById && documentIsHTML) {
                                var node, i, elems, elem = context.getElementById(id);
                                if (elem) {
                                    if ((node = elem.getAttributeNode("id")) && node.value === id) return [ elem ];
                                    for (elems = context.getElementsByName(id), i = 0; elem = elems[i++]; ) if ((node = elem.getAttributeNode("id")) && node.value === id) return [ elem ];
                                }
                                return [];
                            }
                        }), Expr.find.TAG = support.getElementsByTagName ? function(tag, context) {
                            return void 0 !== context.getElementsByTagName ? context.getElementsByTagName(tag) : support.qsa ? context.querySelectorAll(tag) : void 0;
                        } : function(tag, context) {
                            var elem, tmp = [], i = 0, results = context.getElementsByTagName(tag);
                            if ("*" === tag) {
                                for (;elem = results[i++]; ) 1 === elem.nodeType && tmp.push(elem);
                                return tmp;
                            }
                            return results;
                        }, Expr.find.CLASS = support.getElementsByClassName && function(className, context) {
                            if (void 0 !== context.getElementsByClassName && documentIsHTML) return context.getElementsByClassName(className);
                        }, rbuggyMatches = [], rbuggyQSA = [], (support.qsa = rnative.test(document.querySelectorAll)) && (assert((function(el) {
                            var input;
                            docElem.appendChild(el).innerHTML = "<a id='" + expando + "'></a><select id='" + expando + "-\r\\' msallowcapture=''><option selected=''></option></select>", 
                            el.querySelectorAll("[msallowcapture^='']").length && rbuggyQSA.push("[*^$]=[\\x20\\t\\r\\n\\f]*(?:''|\"\")"), 
                            el.querySelectorAll("[selected]").length || rbuggyQSA.push("\\[[\\x20\\t\\r\\n\\f]*(?:value|" + booleans + ")"), 
                            el.querySelectorAll("[id~=" + expando + "-]").length || rbuggyQSA.push("~="), (input = document.createElement("input")).setAttribute("name", ""), 
                            el.appendChild(input), el.querySelectorAll("[name='']").length || rbuggyQSA.push("\\[[\\x20\\t\\r\\n\\f]*name[\\x20\\t\\r\\n\\f]*=[\\x20\\t\\r\\n\\f]*(?:''|\"\")"), 
                            el.querySelectorAll(":checked").length || rbuggyQSA.push(":checked"), el.querySelectorAll("a#" + expando + "+*").length || rbuggyQSA.push(".#.+[+~]"), 
                            el.querySelectorAll("\\\f"), rbuggyQSA.push("[\\r\\n\\f]");
                        })), assert((function(el) {
                            el.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                            var input = document.createElement("input");
                            input.setAttribute("type", "hidden"), el.appendChild(input).setAttribute("name", "D"), 
                            el.querySelectorAll("[name=d]").length && rbuggyQSA.push("name[\\x20\\t\\r\\n\\f]*[*^$|!~]?="), 
                            2 !== el.querySelectorAll(":enabled").length && rbuggyQSA.push(":enabled", ":disabled"), 
                            docElem.appendChild(el).disabled = !0, 2 !== el.querySelectorAll(":disabled").length && rbuggyQSA.push(":enabled", ":disabled"), 
                            el.querySelectorAll("*,:x"), rbuggyQSA.push(",.*:");
                        }))), (support.matchesSelector = rnative.test(matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) && assert((function(el) {
                            support.disconnectedMatch = matches.call(el, "*"), matches.call(el, "[s!='']:x"), 
                            rbuggyMatches.push("!=", pseudos);
                        })), rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|")), rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|")), 
                        hasCompare = rnative.test(docElem.compareDocumentPosition), contains = hasCompare || rnative.test(docElem.contains) ? function(a, b) {
                            var adown = 9 === a.nodeType ? a.documentElement : a, bup = b && b.parentNode;
                            return a === bup || !(!bup || 1 !== bup.nodeType || !(adown.contains ? adown.contains(bup) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(bup)));
                        } : function(a, b) {
                            if (b) for (;b = b.parentNode; ) if (b === a) return !0;
                            return !1;
                        }, sortOrder = hasCompare ? function(a, b) {
                            if (a === b) return hasDuplicate = !0, 0;
                            var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
                            return compare || (1 & (compare = (a.ownerDocument || a) == (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1) || !support.sortDetached && b.compareDocumentPosition(a) === compare ? a == document || a.ownerDocument == preferredDoc && contains(preferredDoc, a) ? -1 : b == document || b.ownerDocument == preferredDoc && contains(preferredDoc, b) ? 1 : sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0 : 4 & compare ? -1 : 1);
                        } : function(a, b) {
                            if (a === b) return hasDuplicate = !0, 0;
                            var cur, i = 0, aup = a.parentNode, bup = b.parentNode, ap = [ a ], bp = [ b ];
                            if (!aup || !bup) return a == document ? -1 : b == document ? 1 : aup ? -1 : bup ? 1 : sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0;
                            if (aup === bup) return siblingCheck(a, b);
                            for (cur = a; cur = cur.parentNode; ) ap.unshift(cur);
                            for (cur = b; cur = cur.parentNode; ) bp.unshift(cur);
                            for (;ap[i] === bp[i]; ) i++;
                            return i ? siblingCheck(ap[i], bp[i]) : ap[i] == preferredDoc ? -1 : bp[i] == preferredDoc ? 1 : 0;
                        }, document) : document;
                    }, Sizzle.matches = function(expr, elements) {
                        return Sizzle(expr, null, null, elements);
                    }, Sizzle.matchesSelector = function(elem, expr) {
                        if (setDocument(elem), support.matchesSelector && documentIsHTML && !nonnativeSelectorCache[expr + " "] && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) try {
                            var ret = matches.call(elem, expr);
                            if (ret || support.disconnectedMatch || elem.document && 11 !== elem.document.nodeType) return ret;
                        } catch (e) {
                            nonnativeSelectorCache(expr, !0);
                        }
                        return Sizzle(expr, document, null, [ elem ]).length > 0;
                    }, Sizzle.contains = function(context, elem) {
                        return (context.ownerDocument || context) != document && setDocument(context), contains(context, elem);
                    }, Sizzle.attr = function(elem, name) {
                        (elem.ownerDocument || elem) != document && setDocument(elem);
                        var fn = Expr.attrHandle[name.toLowerCase()], val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : void 0;
                        return void 0 !== val ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
                    }, Sizzle.escape = function(sel) {
                        return (sel + "").replace(rcssescape, fcssescape);
                    }, Sizzle.error = function(msg) {
                        throw new Error("Syntax error, unrecognized expression: " + msg);
                    }, Sizzle.uniqueSort = function(results) {
                        var elem, duplicates = [], j = 0, i = 0;
                        if (hasDuplicate = !support.detectDuplicates, sortInput = !support.sortStable && results.slice(0), 
                        results.sort(sortOrder), hasDuplicate) {
                            for (;elem = results[i++]; ) elem === results[i] && (j = duplicates.push(i));
                            for (;j--; ) results.splice(duplicates[j], 1);
                        }
                        return sortInput = null, results;
                    }, getText = Sizzle.getText = function(elem) {
                        var node, ret = "", i = 0, nodeType = elem.nodeType;
                        if (nodeType) {
                            if (1 === nodeType || 9 === nodeType || 11 === nodeType) {
                                if ("string" == typeof elem.textContent) return elem.textContent;
                                for (elem = elem.firstChild; elem; elem = elem.nextSibling) ret += getText(elem);
                            } else if (3 === nodeType || 4 === nodeType) return elem.nodeValue;
                        } else for (;node = elem[i++]; ) ret += getText(node);
                        return ret;
                    }, Expr = Sizzle.selectors = {
                        cacheLength: 50,
                        createPseudo: markFunction,
                        match: matchExpr,
                        attrHandle: {},
                        find: {},
                        relative: {
                            ">": {
                                dir: "parentNode",
                                first: !0
                            },
                            " ": {
                                dir: "parentNode"
                            },
                            "+": {
                                dir: "previousSibling",
                                first: !0
                            },
                            "~": {
                                dir: "previousSibling"
                            }
                        },
                        preFilter: {
                            ATTR: function(match) {
                                return match[1] = match[1].replace(runescape, funescape), match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape), 
                                "~=" === match[2] && (match[3] = " " + match[3] + " "), match.slice(0, 4);
                            },
                            CHILD: function(match) {
                                return match[1] = match[1].toLowerCase(), "nth" === match[1].slice(0, 3) ? (match[3] || Sizzle.error(match[0]), 
                                match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * ("even" === match[3] || "odd" === match[3])), 
                                match[5] = +(match[7] + match[8] || "odd" === match[3])) : match[3] && Sizzle.error(match[0]), 
                                match;
                            },
                            PSEUDO: function(match) {
                                var excess, unquoted = !match[6] && match[2];
                                return matchExpr.CHILD.test(match[0]) ? null : (match[3] ? match[2] = match[4] || match[5] || "" : unquoted && rpseudo.test(unquoted) && (excess = tokenize(unquoted, !0)) && (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length) && (match[0] = match[0].slice(0, excess), 
                                match[2] = unquoted.slice(0, excess)), match.slice(0, 3));
                            }
                        },
                        filter: {
                            TAG: function(nodeNameSelector) {
                                var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
                                return "*" === nodeNameSelector ? function() {
                                    return !0;
                                } : function(elem) {
                                    return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                                };
                            },
                            CLASS: function(className) {
                                var pattern = classCache[className + " "];
                                return pattern || (pattern = new RegExp("(^|[\\x20\\t\\r\\n\\f])" + className + "(" + whitespace + "|$)")) && classCache(className, (function(elem) {
                                    return pattern.test("string" == typeof elem.className && elem.className || void 0 !== elem.getAttribute && elem.getAttribute("class") || "");
                                }));
                            },
                            ATTR: function(name, operator, check) {
                                return function(elem) {
                                    var result = Sizzle.attr(elem, name);
                                    return null == result ? "!=" === operator : !operator || (result += "", "=" === operator ? result === check : "!=" === operator ? result !== check : "^=" === operator ? check && 0 === result.indexOf(check) : "*=" === operator ? check && result.indexOf(check) > -1 : "$=" === operator ? check && result.slice(-check.length) === check : "~=" === operator ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1 : "|=" === operator && (result === check || result.slice(0, check.length + 1) === check + "-"));
                                };
                            },
                            CHILD: function(type, what, _argument, first, last) {
                                var simple = "nth" !== type.slice(0, 3), forward = "last" !== type.slice(-4), ofType = "of-type" === what;
                                return 1 === first && 0 === last ? function(elem) {
                                    return !!elem.parentNode;
                                } : function(elem, _context, xml) {
                                    var cache, uniqueCache, outerCache, node, nodeIndex, start, dir = simple !== forward ? "nextSibling" : "previousSibling", parent = elem.parentNode, name = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType, diff = !1;
                                    if (parent) {
                                        if (simple) {
                                            for (;dir; ) {
                                                for (node = elem; node = node[dir]; ) if (ofType ? node.nodeName.toLowerCase() === name : 1 === node.nodeType) return !1;
                                                start = dir = "only" === type && !start && "nextSibling";
                                            }
                                            return !0;
                                        }
                                        if (start = [ forward ? parent.firstChild : parent.lastChild ], forward && useCache) {
                                            for (diff = (nodeIndex = (cache = (uniqueCache = (outerCache = (node = parent)[expando] || (node[expando] = {}))[node.uniqueID] || (outerCache[node.uniqueID] = {}))[type] || [])[0] === dirruns && cache[1]) && cache[2], 
                                            node = nodeIndex && parent.childNodes[nodeIndex]; node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop(); ) if (1 === node.nodeType && ++diff && node === elem) {
                                                uniqueCache[type] = [ dirruns, nodeIndex, diff ];
                                                break;
                                            }
                                        } else if (useCache && (diff = nodeIndex = (cache = (uniqueCache = (outerCache = (node = elem)[expando] || (node[expando] = {}))[node.uniqueID] || (outerCache[node.uniqueID] = {}))[type] || [])[0] === dirruns && cache[1]), 
                                        !1 === diff) for (;(node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) && ((ofType ? node.nodeName.toLowerCase() !== name : 1 !== node.nodeType) || !++diff || (useCache && ((uniqueCache = (outerCache = node[expando] || (node[expando] = {}))[node.uniqueID] || (outerCache[node.uniqueID] = {}))[type] = [ dirruns, diff ]), 
                                        node !== elem)); ) ;
                                        return (diff -= last) === first || diff % first == 0 && diff / first >= 0;
                                    }
                                };
                            },
                            PSEUDO: function(pseudo, argument) {
                                var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo);
                                return fn[expando] ? fn(argument) : fn.length > 1 ? (args = [ pseudo, pseudo, "", argument ], 
                                Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction((function(seed, matches) {
                                    for (var idx, matched = fn(seed, argument), i = matched.length; i--; ) seed[idx = indexOf(seed, matched[i])] = !(matches[idx] = matched[i]);
                                })) : function(elem) {
                                    return fn(elem, 0, args);
                                }) : fn;
                            }
                        },
                        pseudos: {
                            not: markFunction((function(selector) {
                                var input = [], results = [], matcher = compile(selector.replace(rtrim, "$1"));
                                return matcher[expando] ? markFunction((function(seed, matches, _context, xml) {
                                    for (var elem, unmatched = matcher(seed, null, xml, []), i = seed.length; i--; ) (elem = unmatched[i]) && (seed[i] = !(matches[i] = elem));
                                })) : function(elem, _context, xml) {
                                    return input[0] = elem, matcher(input, null, xml, results), input[0] = null, !results.pop();
                                };
                            })),
                            has: markFunction((function(selector) {
                                return function(elem) {
                                    return Sizzle(selector, elem).length > 0;
                                };
                            })),
                            contains: markFunction((function(text) {
                                return text = text.replace(runescape, funescape), function(elem) {
                                    return (elem.textContent || getText(elem)).indexOf(text) > -1;
                                };
                            })),
                            lang: markFunction((function(lang) {
                                return ridentifier.test(lang || "") || Sizzle.error("unsupported lang: " + lang), 
                                lang = lang.replace(runescape, funescape).toLowerCase(), function(elem) {
                                    var elemLang;
                                    do {
                                        if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) return (elemLang = elemLang.toLowerCase()) === lang || 0 === elemLang.indexOf(lang + "-");
                                    } while ((elem = elem.parentNode) && 1 === elem.nodeType);
                                    return !1;
                                };
                            })),
                            target: function(elem) {
                                var hash = window.location && window.location.hash;
                                return hash && hash.slice(1) === elem.id;
                            },
                            root: function(elem) {
                                return elem === docElem;
                            },
                            focus: function(elem) {
                                return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
                            },
                            enabled: createDisabledPseudo(!1),
                            disabled: createDisabledPseudo(!0),
                            checked: function(elem) {
                                var nodeName = elem.nodeName.toLowerCase();
                                return "input" === nodeName && !!elem.checked || "option" === nodeName && !!elem.selected;
                            },
                            selected: function(elem) {
                                return elem.parentNode && elem.parentNode.selectedIndex, !0 === elem.selected;
                            },
                            empty: function(elem) {
                                for (elem = elem.firstChild; elem; elem = elem.nextSibling) if (elem.nodeType < 6) return !1;
                                return !0;
                            },
                            parent: function(elem) {
                                return !Expr.pseudos.empty(elem);
                            },
                            header: function(elem) {
                                return rheader.test(elem.nodeName);
                            },
                            input: function(elem) {
                                return rinputs.test(elem.nodeName);
                            },
                            button: function(elem) {
                                var name = elem.nodeName.toLowerCase();
                                return "input" === name && "button" === elem.type || "button" === name;
                            },
                            text: function(elem) {
                                var attr;
                                return "input" === elem.nodeName.toLowerCase() && "text" === elem.type && (null == (attr = elem.getAttribute("type")) || "text" === attr.toLowerCase());
                            },
                            first: createPositionalPseudo((function() {
                                return [ 0 ];
                            })),
                            last: createPositionalPseudo((function(_matchIndexes, length) {
                                return [ length - 1 ];
                            })),
                            eq: createPositionalPseudo((function(_matchIndexes, length, argument) {
                                return [ argument < 0 ? argument + length : argument ];
                            })),
                            even: createPositionalPseudo((function(matchIndexes, length) {
                                for (var i = 0; i < length; i += 2) matchIndexes.push(i);
                                return matchIndexes;
                            })),
                            odd: createPositionalPseudo((function(matchIndexes, length) {
                                for (var i = 1; i < length; i += 2) matchIndexes.push(i);
                                return matchIndexes;
                            })),
                            lt: createPositionalPseudo((function(matchIndexes, length, argument) {
                                for (var i = argument < 0 ? argument + length : argument > length ? length : argument; --i >= 0; ) matchIndexes.push(i);
                                return matchIndexes;
                            })),
                            gt: createPositionalPseudo((function(matchIndexes, length, argument) {
                                for (var i = argument < 0 ? argument + length : argument; ++i < length; ) matchIndexes.push(i);
                                return matchIndexes;
                            }))
                        }
                    }, Expr.pseudos.nth = Expr.pseudos.eq, {
                        radio: !0,
                        checkbox: !0,
                        file: !0,
                        password: !0,
                        image: !0
                    }) Expr.pseudos[i] = createInputPseudo(i);
                    for (i in {
                        submit: !0,
                        reset: !0
                    }) Expr.pseudos[i] = createButtonPseudo(i);
                    function setFilters() {}
                    function toSelector(tokens) {
                        for (var i = 0, len = tokens.length, selector = ""; i < len; i++) selector += tokens[i].value;
                        return selector;
                    }
                    function addCombinator(matcher, combinator, base) {
                        var dir = combinator.dir, skip = combinator.next, key = skip || dir, checkNonElements = base && "parentNode" === key, doneName = done++;
                        return combinator.first ? function(elem, context, xml) {
                            for (;elem = elem[dir]; ) if (1 === elem.nodeType || checkNonElements) return matcher(elem, context, xml);
                            return !1;
                        } : function(elem, context, xml) {
                            var oldCache, uniqueCache, outerCache, newCache = [ dirruns, doneName ];
                            if (xml) {
                                for (;elem = elem[dir]; ) if ((1 === elem.nodeType || checkNonElements) && matcher(elem, context, xml)) return !0;
                            } else for (;elem = elem[dir]; ) if (1 === elem.nodeType || checkNonElements) if (uniqueCache = (outerCache = elem[expando] || (elem[expando] = {}))[elem.uniqueID] || (outerCache[elem.uniqueID] = {}), 
                            skip && skip === elem.nodeName.toLowerCase()) elem = elem[dir] || elem; else {
                                if ((oldCache = uniqueCache[key]) && oldCache[0] === dirruns && oldCache[1] === doneName) return newCache[2] = oldCache[2];
                                if (uniqueCache[key] = newCache, newCache[2] = matcher(elem, context, xml)) return !0;
                            }
                            return !1;
                        };
                    }
                    function elementMatcher(matchers) {
                        return matchers.length > 1 ? function(elem, context, xml) {
                            for (var i = matchers.length; i--; ) if (!matchers[i](elem, context, xml)) return !1;
                            return !0;
                        } : matchers[0];
                    }
                    function condense(unmatched, map, filter, context, xml) {
                        for (var elem, newUnmatched = [], i = 0, len = unmatched.length, mapped = null != map; i < len; i++) (elem = unmatched[i]) && (filter && !filter(elem, context, xml) || (newUnmatched.push(elem), 
                        mapped && map.push(i)));
                        return newUnmatched;
                    }
                    function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
                        return postFilter && !postFilter[expando] && (postFilter = setMatcher(postFilter)), 
                        postFinder && !postFinder[expando] && (postFinder = setMatcher(postFinder, postSelector)), 
                        markFunction((function(seed, results, context, xml) {
                            var temp, i, elem, preMap = [], postMap = [], preexisting = results.length, elems = seed || function(selector, contexts, results) {
                                for (var i = 0, len = contexts.length; i < len; i++) Sizzle(selector, contexts[i], results);
                                return results;
                            }(selector || "*", context.nodeType ? [ context ] : context, []), matcherIn = !preFilter || !seed && selector ? elems : condense(elems, preMap, preFilter, context, xml), matcherOut = matcher ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : results : matcherIn;
                            if (matcher && matcher(matcherIn, matcherOut, context, xml), postFilter) for (temp = condense(matcherOut, postMap), 
                            postFilter(temp, [], context, xml), i = temp.length; i--; ) (elem = temp[i]) && (matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem));
                            if (seed) {
                                if (postFinder || preFilter) {
                                    if (postFinder) {
                                        for (temp = [], i = matcherOut.length; i--; ) (elem = matcherOut[i]) && temp.push(matcherIn[i] = elem);
                                        postFinder(null, matcherOut = [], temp, xml);
                                    }
                                    for (i = matcherOut.length; i--; ) (elem = matcherOut[i]) && (temp = postFinder ? indexOf(seed, elem) : preMap[i]) > -1 && (seed[temp] = !(results[temp] = elem));
                                }
                            } else matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut), 
                            postFinder ? postFinder(null, results, matcherOut, xml) : push.apply(results, matcherOut);
                        }));
                    }
                    function matcherFromTokens(tokens) {
                        for (var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[" "], i = leadingRelative ? 1 : 0, matchContext = addCombinator((function(elem) {
                            return elem === checkContext;
                        }), implicitRelative, !0), matchAnyContext = addCombinator((function(elem) {
                            return indexOf(checkContext, elem) > -1;
                        }), implicitRelative, !0), matchers = [ function(elem, context, xml) {
                            var ret = !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
                            return checkContext = null, ret;
                        } ]; i < len; i++) if (matcher = Expr.relative[tokens[i].type]) matchers = [ addCombinator(elementMatcher(matchers), matcher) ]; else {
                            if ((matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches))[expando]) {
                                for (j = ++i; j < len && !Expr.relative[tokens[j].type]; j++) ;
                                return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(tokens.slice(0, i - 1).concat({
                                    value: " " === tokens[i - 2].type ? "*" : ""
                                })).replace(rtrim, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens));
                            }
                            matchers.push(matcher);
                        }
                        return elementMatcher(matchers);
                    }
                    return setFilters.prototype = Expr.filters = Expr.pseudos, Expr.setFilters = new setFilters, 
                    tokenize = Sizzle.tokenize = function(selector, parseOnly) {
                        var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + " "];
                        if (cached) return parseOnly ? 0 : cached.slice(0);
                        for (soFar = selector, groups = [], preFilters = Expr.preFilter; soFar; ) {
                            for (type in matched && !(match = rcomma.exec(soFar)) || (match && (soFar = soFar.slice(match[0].length) || soFar), 
                            groups.push(tokens = [])), matched = !1, (match = rcombinators.exec(soFar)) && (matched = match.shift(), 
                            tokens.push({
                                value: matched,
                                type: match[0].replace(rtrim, " ")
                            }), soFar = soFar.slice(matched.length)), Expr.filter) !(match = matchExpr[type].exec(soFar)) || preFilters[type] && !(match = preFilters[type](match)) || (matched = match.shift(), 
                            tokens.push({
                                value: matched,
                                type,
                                matches: match
                            }), soFar = soFar.slice(matched.length));
                            if (!matched) break;
                        }
                        return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) : tokenCache(selector, groups).slice(0);
                    }, compile = Sizzle.compile = function(selector, match) {
                        var i, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + " "];
                        if (!cached) {
                            for (match || (match = tokenize(selector)), i = match.length; i--; ) (cached = matcherFromTokens(match[i]))[expando] ? setMatchers.push(cached) : elementMatchers.push(cached);
                            cached = compilerCache(selector, function(elementMatchers, setMatchers) {
                                var bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function(seed, context, xml, results, outermost) {
                                    var elem, j, matcher, matchedCount = 0, i = "0", unmatched = seed && [], setMatched = [], contextBackup = outermostContext, elems = seed || byElement && Expr.find.TAG("*", outermost), dirrunsUnique = dirruns += null == contextBackup ? 1 : Math.random() || .1, len = elems.length;
                                    for (outermost && (outermostContext = context == document || context || outermost); i !== len && null != (elem = elems[i]); i++) {
                                        if (byElement && elem) {
                                            for (j = 0, context || elem.ownerDocument == document || (setDocument(elem), xml = !documentIsHTML); matcher = elementMatchers[j++]; ) if (matcher(elem, context || document, xml)) {
                                                results.push(elem);
                                                break;
                                            }
                                            outermost && (dirruns = dirrunsUnique);
                                        }
                                        bySet && ((elem = !matcher && elem) && matchedCount--, seed && unmatched.push(elem));
                                    }
                                    if (matchedCount += i, bySet && i !== matchedCount) {
                                        for (j = 0; matcher = setMatchers[j++]; ) matcher(unmatched, setMatched, context, xml);
                                        if (seed) {
                                            if (matchedCount > 0) for (;i--; ) unmatched[i] || setMatched[i] || (setMatched[i] = pop.call(results));
                                            setMatched = condense(setMatched);
                                        }
                                        push.apply(results, setMatched), outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1 && Sizzle.uniqueSort(results);
                                    }
                                    return outermost && (dirruns = dirrunsUnique, outermostContext = contextBackup), 
                                    unmatched;
                                };
                                return bySet ? markFunction(superMatcher) : superMatcher;
                            }(elementMatchers, setMatchers)), cached.selector = selector;
                        }
                        return cached;
                    }, select = Sizzle.select = function(selector, context, results, seed) {
                        var i, tokens, token, type, find, compiled = "function" == typeof selector && selector, match = !seed && tokenize(selector = compiled.selector || selector);
                        if (results = results || [], 1 === match.length) {
                            if ((tokens = match[0] = match[0].slice(0)).length > 2 && "ID" === (token = tokens[0]).type && 9 === context.nodeType && documentIsHTML && Expr.relative[tokens[1].type]) {
                                if (!(context = (Expr.find.ID(token.matches[0].replace(runescape, funescape), context) || [])[0])) return results;
                                compiled && (context = context.parentNode), selector = selector.slice(tokens.shift().value.length);
                            }
                            for (i = matchExpr.needsContext.test(selector) ? 0 : tokens.length; i-- && (token = tokens[i], 
                            !Expr.relative[type = token.type]); ) if ((find = Expr.find[type]) && (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context))) {
                                if (tokens.splice(i, 1), !(selector = seed.length && toSelector(tokens))) return push.apply(results, seed), 
                                results;
                                break;
                            }
                        }
                        return (compiled || compile(selector, match))(seed, context, !documentIsHTML, results, !context || rsibling.test(selector) && testContext(context.parentNode) || context), 
                        results;
                    }, support.sortStable = expando.split("").sort(sortOrder).join("") === expando, 
                    support.detectDuplicates = !!hasDuplicate, setDocument(), support.sortDetached = assert((function(el) {
                        return 1 & el.compareDocumentPosition(document.createElement("fieldset"));
                    })), assert((function(el) {
                        return el.innerHTML = "<a href='#'></a>", "#" === el.firstChild.getAttribute("href");
                    })) || addHandle("type|href|height|width", (function(elem, name, isXML) {
                        if (!isXML) return elem.getAttribute(name, "type" === name.toLowerCase() ? 1 : 2);
                    })), support.attributes && assert((function(el) {
                        return el.innerHTML = "<input/>", el.firstChild.setAttribute("value", ""), "" === el.firstChild.getAttribute("value");
                    })) || addHandle("value", (function(elem, _name, isXML) {
                        if (!isXML && "input" === elem.nodeName.toLowerCase()) return elem.defaultValue;
                    })), assert((function(el) {
                        return null == el.getAttribute("disabled");
                    })) || addHandle(booleans, (function(elem, name, isXML) {
                        var val;
                        if (!isXML) return !0 === elem[name] ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
                    })), Sizzle;
                }(window);
                jQuery.find = Sizzle, jQuery.expr = Sizzle.selectors, jQuery.expr[":"] = jQuery.expr.pseudos, 
                jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort, jQuery.text = Sizzle.getText, 
                jQuery.isXMLDoc = Sizzle.isXML, jQuery.contains = Sizzle.contains, jQuery.escapeSelector = Sizzle.escape;
                var dir = function(elem, dir, until) {
                    for (var matched = [], truncate = void 0 !== until; (elem = elem[dir]) && 9 !== elem.nodeType; ) if (1 === elem.nodeType) {
                        if (truncate && jQuery(elem).is(until)) break;
                        matched.push(elem);
                    }
                    return matched;
                }, siblings = function(n, elem) {
                    for (var matched = []; n; n = n.nextSibling) 1 === n.nodeType && n !== elem && matched.push(n);
                    return matched;
                }, rneedsContext = jQuery.expr.match.needsContext;
                function nodeName(elem, name) {
                    return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
                }
                var rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
                function winnow(elements, qualifier, not) {
                    return isFunction(qualifier) ? jQuery.grep(elements, (function(elem, i) {
                        return !!qualifier.call(elem, i, elem) !== not;
                    })) : qualifier.nodeType ? jQuery.grep(elements, (function(elem) {
                        return elem === qualifier !== not;
                    })) : "string" != typeof qualifier ? jQuery.grep(elements, (function(elem) {
                        return indexOf.call(qualifier, elem) > -1 !== not;
                    })) : jQuery.filter(qualifier, elements, not);
                }
                jQuery.filter = function(expr, elems, not) {
                    var elem = elems[0];
                    return not && (expr = ":not(" + expr + ")"), 1 === elems.length && 1 === elem.nodeType ? jQuery.find.matchesSelector(elem, expr) ? [ elem ] : [] : jQuery.find.matches(expr, jQuery.grep(elems, (function(elem) {
                        return 1 === elem.nodeType;
                    })));
                }, jQuery.fn.extend({
                    find: function(selector) {
                        var i, ret, len = this.length, self = this;
                        if ("string" != typeof selector) return this.pushStack(jQuery(selector).filter((function() {
                            for (i = 0; i < len; i++) if (jQuery.contains(self[i], this)) return !0;
                        })));
                        for (ret = this.pushStack([]), i = 0; i < len; i++) jQuery.find(selector, self[i], ret);
                        return len > 1 ? jQuery.uniqueSort(ret) : ret;
                    },
                    filter: function(selector) {
                        return this.pushStack(winnow(this, selector || [], !1));
                    },
                    not: function(selector) {
                        return this.pushStack(winnow(this, selector || [], !0));
                    },
                    is: function(selector) {
                        return !!winnow(this, "string" == typeof selector && rneedsContext.test(selector) ? jQuery(selector) : selector || [], !1).length;
                    }
                });
                var rootjQuery, rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
                (jQuery.fn.init = function(selector, context, root) {
                    var match, elem;
                    if (!selector) return this;
                    if (root = root || rootjQuery, "string" == typeof selector) {
                        if (!(match = "<" === selector[0] && ">" === selector[selector.length - 1] && selector.length >= 3 ? [ null, selector, null ] : rquickExpr.exec(selector)) || !match[1] && context) return !context || context.jquery ? (context || root).find(selector) : this.constructor(context).find(selector);
                        if (match[1]) {
                            if (context = context instanceof jQuery ? context[0] : context, jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document, !0)), 
                            rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) for (match in context) isFunction(this[match]) ? this[match](context[match]) : this.attr(match, context[match]);
                            return this;
                        }
                        return (elem = document.getElementById(match[2])) && (this[0] = elem, this.length = 1), 
                        this;
                    }
                    return selector.nodeType ? (this[0] = selector, this.length = 1, this) : isFunction(selector) ? void 0 !== root.ready ? root.ready(selector) : selector(jQuery) : jQuery.makeArray(selector, this);
                }).prototype = jQuery.fn, rootjQuery = jQuery(document);
                var rparentsprev = /^(?:parents|prev(?:Until|All))/, guaranteedUnique = {
                    children: !0,
                    contents: !0,
                    next: !0,
                    prev: !0
                };
                function sibling(cur, dir) {
                    for (;(cur = cur[dir]) && 1 !== cur.nodeType; ) ;
                    return cur;
                }
                jQuery.fn.extend({
                    has: function(target) {
                        var targets = jQuery(target, this), l = targets.length;
                        return this.filter((function() {
                            for (var i = 0; i < l; i++) if (jQuery.contains(this, targets[i])) return !0;
                        }));
                    },
                    closest: function(selectors, context) {
                        var cur, i = 0, l = this.length, matched = [], targets = "string" != typeof selectors && jQuery(selectors);
                        if (!rneedsContext.test(selectors)) for (;i < l; i++) for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) if (cur.nodeType < 11 && (targets ? targets.index(cur) > -1 : 1 === cur.nodeType && jQuery.find.matchesSelector(cur, selectors))) {
                            matched.push(cur);
                            break;
                        }
                        return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
                    },
                    index: function(elem) {
                        return elem ? "string" == typeof elem ? indexOf.call(jQuery(elem), this[0]) : indexOf.call(this, elem.jquery ? elem[0] : elem) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
                    },
                    add: function(selector, context) {
                        return this.pushStack(jQuery.uniqueSort(jQuery.merge(this.get(), jQuery(selector, context))));
                    },
                    addBack: function(selector) {
                        return this.add(null == selector ? this.prevObject : this.prevObject.filter(selector));
                    }
                }), jQuery.each({
                    parent: function(elem) {
                        var parent = elem.parentNode;
                        return parent && 11 !== parent.nodeType ? parent : null;
                    },
                    parents: function(elem) {
                        return dir(elem, "parentNode");
                    },
                    parentsUntil: function(elem, _i, until) {
                        return dir(elem, "parentNode", until);
                    },
                    next: function(elem) {
                        return sibling(elem, "nextSibling");
                    },
                    prev: function(elem) {
                        return sibling(elem, "previousSibling");
                    },
                    nextAll: function(elem) {
                        return dir(elem, "nextSibling");
                    },
                    prevAll: function(elem) {
                        return dir(elem, "previousSibling");
                    },
                    nextUntil: function(elem, _i, until) {
                        return dir(elem, "nextSibling", until);
                    },
                    prevUntil: function(elem, _i, until) {
                        return dir(elem, "previousSibling", until);
                    },
                    siblings: function(elem) {
                        return siblings((elem.parentNode || {}).firstChild, elem);
                    },
                    children: function(elem) {
                        return siblings(elem.firstChild);
                    },
                    contents: function(elem) {
                        return null != elem.contentDocument && getProto(elem.contentDocument) ? elem.contentDocument : (nodeName(elem, "template") && (elem = elem.content || elem), 
                        jQuery.merge([], elem.childNodes));
                    }
                }, (function(name, fn) {
                    jQuery.fn[name] = function(until, selector) {
                        var matched = jQuery.map(this, fn, until);
                        return "Until" !== name.slice(-5) && (selector = until), selector && "string" == typeof selector && (matched = jQuery.filter(selector, matched)), 
                        this.length > 1 && (guaranteedUnique[name] || jQuery.uniqueSort(matched), rparentsprev.test(name) && matched.reverse()), 
                        this.pushStack(matched);
                    };
                }));
                var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;
                function Identity(v) {
                    return v;
                }
                function Thrower(ex) {
                    throw ex;
                }
                function adoptValue(value, resolve, reject, noValue) {
                    var method;
                    try {
                        value && isFunction(method = value.promise) ? method.call(value).done(resolve).fail(reject) : value && isFunction(method = value.then) ? method.call(value, resolve, reject) : resolve.apply(void 0, [ value ].slice(noValue));
                    } catch (value) {
                        reject.apply(void 0, [ value ]);
                    }
                }
                jQuery.Callbacks = function(options) {
                    options = "string" == typeof options ? function(options) {
                        var object = {};
                        return jQuery.each(options.match(rnothtmlwhite) || [], (function(_, flag) {
                            object[flag] = !0;
                        })), object;
                    }(options) : jQuery.extend({}, options);
                    var firing, memory, fired, locked, list = [], queue = [], firingIndex = -1, fire = function() {
                        for (locked = locked || options.once, fired = firing = !0; queue.length; firingIndex = -1) for (memory = queue.shift(); ++firingIndex < list.length; ) !1 === list[firingIndex].apply(memory[0], memory[1]) && options.stopOnFalse && (firingIndex = list.length, 
                        memory = !1);
                        options.memory || (memory = !1), firing = !1, locked && (list = memory ? [] : "");
                    }, self = {
                        add: function() {
                            return list && (memory && !firing && (firingIndex = list.length - 1, queue.push(memory)), 
                            function add(args) {
                                jQuery.each(args, (function(_, arg) {
                                    isFunction(arg) ? options.unique && self.has(arg) || list.push(arg) : arg && arg.length && "string" !== toType(arg) && add(arg);
                                }));
                            }(arguments), memory && !firing && fire()), this;
                        },
                        remove: function() {
                            return jQuery.each(arguments, (function(_, arg) {
                                for (var index; (index = jQuery.inArray(arg, list, index)) > -1; ) list.splice(index, 1), 
                                index <= firingIndex && firingIndex--;
                            })), this;
                        },
                        has: function(fn) {
                            return fn ? jQuery.inArray(fn, list) > -1 : list.length > 0;
                        },
                        empty: function() {
                            return list && (list = []), this;
                        },
                        disable: function() {
                            return locked = queue = [], list = memory = "", this;
                        },
                        disabled: function() {
                            return !list;
                        },
                        lock: function() {
                            return locked = queue = [], memory || firing || (list = memory = ""), this;
                        },
                        locked: function() {
                            return !!locked;
                        },
                        fireWith: function(context, args) {
                            return locked || (args = [ context, (args = args || []).slice ? args.slice() : args ], 
                            queue.push(args), firing || fire()), this;
                        },
                        fire: function() {
                            return self.fireWith(this, arguments), this;
                        },
                        fired: function() {
                            return !!fired;
                        }
                    };
                    return self;
                }, jQuery.extend({
                    Deferred: function(func) {
                        var tuples = [ [ "notify", "progress", jQuery.Callbacks("memory"), jQuery.Callbacks("memory"), 2 ], [ "resolve", "done", jQuery.Callbacks("once memory"), jQuery.Callbacks("once memory"), 0, "resolved" ], [ "reject", "fail", jQuery.Callbacks("once memory"), jQuery.Callbacks("once memory"), 1, "rejected" ] ], state = "pending", promise = {
                            state: function() {
                                return state;
                            },
                            always: function() {
                                return deferred.done(arguments).fail(arguments), this;
                            },
                            catch: function(fn) {
                                return promise.then(null, fn);
                            },
                            pipe: function() {
                                var fns = arguments;
                                return jQuery.Deferred((function(newDefer) {
                                    jQuery.each(tuples, (function(_i, tuple) {
                                        var fn = isFunction(fns[tuple[4]]) && fns[tuple[4]];
                                        deferred[tuple[1]]((function() {
                                            var returned = fn && fn.apply(this, arguments);
                                            returned && isFunction(returned.promise) ? returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject) : newDefer[tuple[0] + "With"](this, fn ? [ returned ] : arguments);
                                        }));
                                    })), fns = null;
                                })).promise();
                            },
                            then: function(onFulfilled, onRejected, onProgress) {
                                var maxDepth = 0;
                                function resolve(depth, deferred, handler, special) {
                                    return function() {
                                        var that = this, args = arguments, mightThrow = function() {
                                            var returned, then;
                                            if (!(depth < maxDepth)) {
                                                if ((returned = handler.apply(that, args)) === deferred.promise()) throw new TypeError("Thenable self-resolution");
                                                then = returned && ("object" == typeof returned || "function" == typeof returned) && returned.then, 
                                                isFunction(then) ? special ? then.call(returned, resolve(maxDepth, deferred, Identity, special), resolve(maxDepth, deferred, Thrower, special)) : (maxDepth++, 
                                                then.call(returned, resolve(maxDepth, deferred, Identity, special), resolve(maxDepth, deferred, Thrower, special), resolve(maxDepth, deferred, Identity, deferred.notifyWith))) : (handler !== Identity && (that = void 0, 
                                                args = [ returned ]), (special || deferred.resolveWith)(that, args));
                                            }
                                        }, process = special ? mightThrow : function() {
                                            try {
                                                mightThrow();
                                            } catch (e) {
                                                jQuery.Deferred.exceptionHook && jQuery.Deferred.exceptionHook(e, process.stackTrace), 
                                                depth + 1 >= maxDepth && (handler !== Thrower && (that = void 0, args = [ e ]), 
                                                deferred.rejectWith(that, args));
                                            }
                                        };
                                        depth ? process() : (jQuery.Deferred.getStackHook && (process.stackTrace = jQuery.Deferred.getStackHook()), 
                                        window.setTimeout(process));
                                    };
                                }
                                return jQuery.Deferred((function(newDefer) {
                                    tuples[0][3].add(resolve(0, newDefer, isFunction(onProgress) ? onProgress : Identity, newDefer.notifyWith)), 
                                    tuples[1][3].add(resolve(0, newDefer, isFunction(onFulfilled) ? onFulfilled : Identity)), 
                                    tuples[2][3].add(resolve(0, newDefer, isFunction(onRejected) ? onRejected : Thrower));
                                })).promise();
                            },
                            promise: function(obj) {
                                return null != obj ? jQuery.extend(obj, promise) : promise;
                            }
                        }, deferred = {};
                        return jQuery.each(tuples, (function(i, tuple) {
                            var list = tuple[2], stateString = tuple[5];
                            promise[tuple[1]] = list.add, stateString && list.add((function() {
                                state = stateString;
                            }), tuples[3 - i][2].disable, tuples[3 - i][3].disable, tuples[0][2].lock, tuples[0][3].lock), 
                            list.add(tuple[3].fire), deferred[tuple[0]] = function() {
                                return deferred[tuple[0] + "With"](this === deferred ? void 0 : this, arguments), 
                                this;
                            }, deferred[tuple[0] + "With"] = list.fireWith;
                        })), promise.promise(deferred), func && func.call(deferred, deferred), deferred;
                    },
                    when: function(singleValue) {
                        var remaining = arguments.length, i = remaining, resolveContexts = Array(i), resolveValues = slice.call(arguments), primary = jQuery.Deferred(), updateFunc = function(i) {
                            return function(value) {
                                resolveContexts[i] = this, resolveValues[i] = arguments.length > 1 ? slice.call(arguments) : value, 
                                --remaining || primary.resolveWith(resolveContexts, resolveValues);
                            };
                        };
                        if (remaining <= 1 && (adoptValue(singleValue, primary.done(updateFunc(i)).resolve, primary.reject, !remaining), 
                        "pending" === primary.state() || isFunction(resolveValues[i] && resolveValues[i].then))) return primary.then();
                        for (;i--; ) adoptValue(resolveValues[i], updateFunc(i), primary.reject);
                        return primary.promise();
                    }
                });
                var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
                jQuery.Deferred.exceptionHook = function(error, stack) {
                    window.console && window.console.warn && error && rerrorNames.test(error.name) && window.console.warn("jQuery.Deferred exception: " + error.message, error.stack, stack);
                }, jQuery.readyException = function(error) {
                    window.setTimeout((function() {
                        throw error;
                    }));
                };
                var readyList = jQuery.Deferred();
                function completed() {
                    document.removeEventListener("DOMContentLoaded", completed), window.removeEventListener("load", completed), 
                    jQuery.ready();
                }
                jQuery.fn.ready = function(fn) {
                    return readyList.then(fn).catch((function(error) {
                        jQuery.readyException(error);
                    })), this;
                }, jQuery.extend({
                    isReady: !1,
                    readyWait: 1,
                    ready: function(wait) {
                        (!0 === wait ? --jQuery.readyWait : jQuery.isReady) || (jQuery.isReady = !0, !0 !== wait && --jQuery.readyWait > 0 || readyList.resolveWith(document, [ jQuery ]));
                    }
                }), jQuery.ready.then = readyList.then, "complete" === document.readyState || "loading" !== document.readyState && !document.documentElement.doScroll ? window.setTimeout(jQuery.ready) : (document.addEventListener("DOMContentLoaded", completed), 
                window.addEventListener("load", completed));
                var access = function(elems, fn, key, value, chainable, emptyGet, raw) {
                    var i = 0, len = elems.length, bulk = null == key;
                    if ("object" === toType(key)) for (i in chainable = !0, key) access(elems, fn, i, key[i], !0, emptyGet, raw); else if (void 0 !== value && (chainable = !0, 
                    isFunction(value) || (raw = !0), bulk && (raw ? (fn.call(elems, value), fn = null) : (bulk = fn, 
                    fn = function(elem, _key, value) {
                        return bulk.call(jQuery(elem), value);
                    })), fn)) for (;i < len; i++) fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
                    return chainable ? elems : bulk ? fn.call(elems) : len ? fn(elems[0], key) : emptyGet;
                }, rmsPrefix = /^-ms-/, rdashAlpha = /-([a-z])/g;
                function fcamelCase(_all, letter) {
                    return letter.toUpperCase();
                }
                function camelCase(string) {
                    return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
                }
                var acceptData = function(owner) {
                    return 1 === owner.nodeType || 9 === owner.nodeType || !+owner.nodeType;
                };
                function Data() {
                    this.expando = jQuery.expando + Data.uid++;
                }
                Data.uid = 1, Data.prototype = {
                    cache: function(owner) {
                        var value = owner[this.expando];
                        return value || (value = {}, acceptData(owner) && (owner.nodeType ? owner[this.expando] = value : Object.defineProperty(owner, this.expando, {
                            value,
                            configurable: !0
                        }))), value;
                    },
                    set: function(owner, data, value) {
                        var prop, cache = this.cache(owner);
                        if ("string" == typeof data) cache[camelCase(data)] = value; else for (prop in data) cache[camelCase(prop)] = data[prop];
                        return cache;
                    },
                    get: function(owner, key) {
                        return void 0 === key ? this.cache(owner) : owner[this.expando] && owner[this.expando][camelCase(key)];
                    },
                    access: function(owner, key, value) {
                        return void 0 === key || key && "string" == typeof key && void 0 === value ? this.get(owner, key) : (this.set(owner, key, value), 
                        void 0 !== value ? value : key);
                    },
                    remove: function(owner, key) {
                        var i, cache = owner[this.expando];
                        if (void 0 !== cache) {
                            if (void 0 !== key) {
                                i = (key = Array.isArray(key) ? key.map(camelCase) : (key = camelCase(key)) in cache ? [ key ] : key.match(rnothtmlwhite) || []).length;
                                for (;i--; ) delete cache[key[i]];
                            }
                            (void 0 === key || jQuery.isEmptyObject(cache)) && (owner.nodeType ? owner[this.expando] = void 0 : delete owner[this.expando]);
                        }
                    },
                    hasData: function(owner) {
                        var cache = owner[this.expando];
                        return void 0 !== cache && !jQuery.isEmptyObject(cache);
                    }
                };
                var dataPriv = new Data, dataUser = new Data, rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, rmultiDash = /[A-Z]/g;
                function dataAttr(elem, key, data) {
                    var name;
                    if (void 0 === data && 1 === elem.nodeType) if (name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase(), 
                    "string" == typeof (data = elem.getAttribute(name))) {
                        try {
                            data = function(data) {
                                return "true" === data || "false" !== data && ("null" === data ? null : data === +data + "" ? +data : rbrace.test(data) ? JSON.parse(data) : data);
                            }(data);
                        } catch (e) {}
                        dataUser.set(elem, key, data);
                    } else data = void 0;
                    return data;
                }
                jQuery.extend({
                    hasData: function(elem) {
                        return dataUser.hasData(elem) || dataPriv.hasData(elem);
                    },
                    data: function(elem, name, data) {
                        return dataUser.access(elem, name, data);
                    },
                    removeData: function(elem, name) {
                        dataUser.remove(elem, name);
                    },
                    _data: function(elem, name, data) {
                        return dataPriv.access(elem, name, data);
                    },
                    _removeData: function(elem, name) {
                        dataPriv.remove(elem, name);
                    }
                }), jQuery.fn.extend({
                    data: function(key, value) {
                        var i, name, data, elem = this[0], attrs = elem && elem.attributes;
                        if (void 0 === key) {
                            if (this.length && (data = dataUser.get(elem), 1 === elem.nodeType && !dataPriv.get(elem, "hasDataAttrs"))) {
                                for (i = attrs.length; i--; ) attrs[i] && 0 === (name = attrs[i].name).indexOf("data-") && (name = camelCase(name.slice(5)), 
                                dataAttr(elem, name, data[name]));
                                dataPriv.set(elem, "hasDataAttrs", !0);
                            }
                            return data;
                        }
                        return "object" == typeof key ? this.each((function() {
                            dataUser.set(this, key);
                        })) : access(this, (function(value) {
                            var data;
                            if (elem && void 0 === value) return void 0 !== (data = dataUser.get(elem, key)) || void 0 !== (data = dataAttr(elem, key)) ? data : void 0;
                            this.each((function() {
                                dataUser.set(this, key, value);
                            }));
                        }), null, value, arguments.length > 1, null, !0);
                    },
                    removeData: function(key) {
                        return this.each((function() {
                            dataUser.remove(this, key);
                        }));
                    }
                }), jQuery.extend({
                    queue: function(elem, type, data) {
                        var queue;
                        if (elem) return type = (type || "fx") + "queue", queue = dataPriv.get(elem, type), 
                        data && (!queue || Array.isArray(data) ? queue = dataPriv.access(elem, type, jQuery.makeArray(data)) : queue.push(data)), 
                        queue || [];
                    },
                    dequeue: function(elem, type) {
                        type = type || "fx";
                        var queue = jQuery.queue(elem, type), startLength = queue.length, fn = queue.shift(), hooks = jQuery._queueHooks(elem, type);
                        "inprogress" === fn && (fn = queue.shift(), startLength--), fn && ("fx" === type && queue.unshift("inprogress"), 
                        delete hooks.stop, fn.call(elem, (function() {
                            jQuery.dequeue(elem, type);
                        }), hooks)), !startLength && hooks && hooks.empty.fire();
                    },
                    _queueHooks: function(elem, type) {
                        var key = type + "queueHooks";
                        return dataPriv.get(elem, key) || dataPriv.access(elem, key, {
                            empty: jQuery.Callbacks("once memory").add((function() {
                                dataPriv.remove(elem, [ type + "queue", key ]);
                            }))
                        });
                    }
                }), jQuery.fn.extend({
                    queue: function(type, data) {
                        var setter = 2;
                        return "string" != typeof type && (data = type, type = "fx", setter--), arguments.length < setter ? jQuery.queue(this[0], type) : void 0 === data ? this : this.each((function() {
                            var queue = jQuery.queue(this, type, data);
                            jQuery._queueHooks(this, type), "fx" === type && "inprogress" !== queue[0] && jQuery.dequeue(this, type);
                        }));
                    },
                    dequeue: function(type) {
                        return this.each((function() {
                            jQuery.dequeue(this, type);
                        }));
                    },
                    clearQueue: function(type) {
                        return this.queue(type || "fx", []);
                    },
                    promise: function(type, obj) {
                        var tmp, count = 1, defer = jQuery.Deferred(), elements = this, i = this.length, resolve = function() {
                            --count || defer.resolveWith(elements, [ elements ]);
                        };
                        for ("string" != typeof type && (obj = type, type = void 0), type = type || "fx"; i--; ) (tmp = dataPriv.get(elements[i], type + "queueHooks")) && tmp.empty && (count++, 
                        tmp.empty.add(resolve));
                        return resolve(), defer.promise(obj);
                    }
                });
                var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i"), cssExpand = [ "Top", "Right", "Bottom", "Left" ], documentElement = document.documentElement, isAttached = function(elem) {
                    return jQuery.contains(elem.ownerDocument, elem);
                }, composed = {
                    composed: !0
                };
                documentElement.getRootNode && (isAttached = function(elem) {
                    return jQuery.contains(elem.ownerDocument, elem) || elem.getRootNode(composed) === elem.ownerDocument;
                });
                var isHiddenWithinTree = function(elem, el) {
                    return "none" === (elem = el || elem).style.display || "" === elem.style.display && isAttached(elem) && "none" === jQuery.css(elem, "display");
                };
                function adjustCSS(elem, prop, valueParts, tween) {
                    var adjusted, scale, maxIterations = 20, currentValue = tween ? function() {
                        return tween.cur();
                    } : function() {
                        return jQuery.css(elem, prop, "");
                    }, initial = currentValue(), unit = valueParts && valueParts[3] || (jQuery.cssNumber[prop] ? "" : "px"), initialInUnit = elem.nodeType && (jQuery.cssNumber[prop] || "px" !== unit && +initial) && rcssNum.exec(jQuery.css(elem, prop));
                    if (initialInUnit && initialInUnit[3] !== unit) {
                        for (initial /= 2, unit = unit || initialInUnit[3], initialInUnit = +initial || 1; maxIterations--; ) jQuery.style(elem, prop, initialInUnit + unit), 
                        (1 - scale) * (1 - (scale = currentValue() / initial || .5)) <= 0 && (maxIterations = 0), 
                        initialInUnit /= scale;
                        initialInUnit *= 2, jQuery.style(elem, prop, initialInUnit + unit), valueParts = valueParts || [];
                    }
                    return valueParts && (initialInUnit = +initialInUnit || +initial || 0, adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2], 
                    tween && (tween.unit = unit, tween.start = initialInUnit, tween.end = adjusted)), 
                    adjusted;
                }
                var defaultDisplayMap = {};
                function getDefaultDisplay(elem) {
                    var temp, doc = elem.ownerDocument, nodeName = elem.nodeName, display = defaultDisplayMap[nodeName];
                    return display || (temp = doc.body.appendChild(doc.createElement(nodeName)), display = jQuery.css(temp, "display"), 
                    temp.parentNode.removeChild(temp), "none" === display && (display = "block"), defaultDisplayMap[nodeName] = display, 
                    display);
                }
                function showHide(elements, show) {
                    for (var display, elem, values = [], index = 0, length = elements.length; index < length; index++) (elem = elements[index]).style && (display = elem.style.display, 
                    show ? ("none" === display && (values[index] = dataPriv.get(elem, "display") || null, 
                    values[index] || (elem.style.display = "")), "" === elem.style.display && isHiddenWithinTree(elem) && (values[index] = getDefaultDisplay(elem))) : "none" !== display && (values[index] = "none", 
                    dataPriv.set(elem, "display", display)));
                    for (index = 0; index < length; index++) null != values[index] && (elements[index].style.display = values[index]);
                    return elements;
                }
                jQuery.fn.extend({
                    show: function() {
                        return showHide(this, !0);
                    },
                    hide: function() {
                        return showHide(this);
                    },
                    toggle: function(state) {
                        return "boolean" == typeof state ? state ? this.show() : this.hide() : this.each((function() {
                            isHiddenWithinTree(this) ? jQuery(this).show() : jQuery(this).hide();
                        }));
                    }
                });
                var div, input, rcheckableType = /^(?:checkbox|radio)$/i, rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i, rscriptType = /^$|^module$|\/(?:java|ecma)script/i;
                div = document.createDocumentFragment().appendChild(document.createElement("div")), 
                (input = document.createElement("input")).setAttribute("type", "radio"), input.setAttribute("checked", "checked"), 
                input.setAttribute("name", "t"), div.appendChild(input), support.checkClone = div.cloneNode(!0).cloneNode(!0).lastChild.checked, 
                div.innerHTML = "<textarea>x</textarea>", support.noCloneChecked = !!div.cloneNode(!0).lastChild.defaultValue, 
                div.innerHTML = "<option></option>", support.option = !!div.lastChild;
                var wrapMap = {
                    thead: [ 1, "<table>", "</table>" ],
                    col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
                    tr: [ 2, "<table><tbody>", "</tbody></table>" ],
                    td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
                    _default: [ 0, "", "" ]
                };
                function getAll(context, tag) {
                    var ret;
                    return ret = void 0 !== context.getElementsByTagName ? context.getElementsByTagName(tag || "*") : void 0 !== context.querySelectorAll ? context.querySelectorAll(tag || "*") : [], 
                    void 0 === tag || tag && nodeName(context, tag) ? jQuery.merge([ context ], ret) : ret;
                }
                function setGlobalEval(elems, refElements) {
                    for (var i = 0, l = elems.length; i < l; i++) dataPriv.set(elems[i], "globalEval", !refElements || dataPriv.get(refElements[i], "globalEval"));
                }
                wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead, 
                wrapMap.th = wrapMap.td, support.option || (wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ]);
                var rhtml = /<|&#?\w+;/;
                function buildFragment(elems, context, scripts, selection, ignored) {
                    for (var elem, tmp, tag, wrap, attached, j, fragment = context.createDocumentFragment(), nodes = [], i = 0, l = elems.length; i < l; i++) if ((elem = elems[i]) || 0 === elem) if ("object" === toType(elem)) jQuery.merge(nodes, elem.nodeType ? [ elem ] : elem); else if (rhtml.test(elem)) {
                        for (tmp = tmp || fragment.appendChild(context.createElement("div")), tag = (rtagName.exec(elem) || [ "", "" ])[1].toLowerCase(), 
                        wrap = wrapMap[tag] || wrapMap._default, tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2], 
                        j = wrap[0]; j--; ) tmp = tmp.lastChild;
                        jQuery.merge(nodes, tmp.childNodes), (tmp = fragment.firstChild).textContent = "";
                    } else nodes.push(context.createTextNode(elem));
                    for (fragment.textContent = "", i = 0; elem = nodes[i++]; ) if (selection && jQuery.inArray(elem, selection) > -1) ignored && ignored.push(elem); else if (attached = isAttached(elem), 
                    tmp = getAll(fragment.appendChild(elem), "script"), attached && setGlobalEval(tmp), 
                    scripts) for (j = 0; elem = tmp[j++]; ) rscriptType.test(elem.type || "") && scripts.push(elem);
                    return fragment;
                }
                var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
                function returnTrue() {
                    return !0;
                }
                function returnFalse() {
                    return !1;
                }
                function expectSync(elem, type) {
                    return elem === function() {
                        try {
                            return document.activeElement;
                        } catch (err) {}
                    }() == ("focus" === type);
                }
                function on(elem, types, selector, data, fn, one) {
                    var origFn, type;
                    if ("object" == typeof types) {
                        for (type in "string" != typeof selector && (data = data || selector, selector = void 0), 
                        types) on(elem, type, selector, data, types[type], one);
                        return elem;
                    }
                    if (null == data && null == fn ? (fn = selector, data = selector = void 0) : null == fn && ("string" == typeof selector ? (fn = data, 
                    data = void 0) : (fn = data, data = selector, selector = void 0)), !1 === fn) fn = returnFalse; else if (!fn) return elem;
                    return 1 === one && (origFn = fn, fn = function(event) {
                        return jQuery().off(event), origFn.apply(this, arguments);
                    }, fn.guid = origFn.guid || (origFn.guid = jQuery.guid++)), elem.each((function() {
                        jQuery.event.add(this, types, fn, data, selector);
                    }));
                }
                function leverageNative(el, type, expectSync) {
                    expectSync ? (dataPriv.set(el, type, !1), jQuery.event.add(el, type, {
                        namespace: !1,
                        handler: function(event) {
                            var notAsync, result, saved = dataPriv.get(this, type);
                            if (1 & event.isTrigger && this[type]) {
                                if (saved.length) (jQuery.event.special[type] || {}).delegateType && event.stopPropagation(); else if (saved = slice.call(arguments), 
                                dataPriv.set(this, type, saved), notAsync = expectSync(this, type), this[type](), 
                                saved !== (result = dataPriv.get(this, type)) || notAsync ? dataPriv.set(this, type, !1) : result = {}, 
                                saved !== result) return event.stopImmediatePropagation(), event.preventDefault(), 
                                result && result.value;
                            } else saved.length && (dataPriv.set(this, type, {
                                value: jQuery.event.trigger(jQuery.extend(saved[0], jQuery.Event.prototype), saved.slice(1), this)
                            }), event.stopImmediatePropagation());
                        }
                    })) : void 0 === dataPriv.get(el, type) && jQuery.event.add(el, type, returnTrue);
                }
                jQuery.event = {
                    global: {},
                    add: function(elem, types, handler, data, selector) {
                        var handleObjIn, eventHandle, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.get(elem);
                        if (acceptData(elem)) for (handler.handler && (handler = (handleObjIn = handler).handler, 
                        selector = handleObjIn.selector), selector && jQuery.find.matchesSelector(documentElement, selector), 
                        handler.guid || (handler.guid = jQuery.guid++), (events = elemData.events) || (events = elemData.events = Object.create(null)), 
                        (eventHandle = elemData.handle) || (eventHandle = elemData.handle = function(e) {
                            return void 0 !== jQuery && jQuery.event.triggered !== e.type ? jQuery.event.dispatch.apply(elem, arguments) : void 0;
                        }), t = (types = (types || "").match(rnothtmlwhite) || [ "" ]).length; t--; ) type = origType = (tmp = rtypenamespace.exec(types[t]) || [])[1], 
                        namespaces = (tmp[2] || "").split(".").sort(), type && (special = jQuery.event.special[type] || {}, 
                        type = (selector ? special.delegateType : special.bindType) || type, special = jQuery.event.special[type] || {}, 
                        handleObj = jQuery.extend({
                            type,
                            origType,
                            data,
                            handler,
                            guid: handler.guid,
                            selector,
                            needsContext: selector && jQuery.expr.match.needsContext.test(selector),
                            namespace: namespaces.join(".")
                        }, handleObjIn), (handlers = events[type]) || ((handlers = events[type] = []).delegateCount = 0, 
                        special.setup && !1 !== special.setup.call(elem, data, namespaces, eventHandle) || elem.addEventListener && elem.addEventListener(type, eventHandle)), 
                        special.add && (special.add.call(elem, handleObj), handleObj.handler.guid || (handleObj.handler.guid = handler.guid)), 
                        selector ? handlers.splice(handlers.delegateCount++, 0, handleObj) : handlers.push(handleObj), 
                        jQuery.event.global[type] = !0);
                    },
                    remove: function(elem, types, handler, selector, mappedTypes) {
                        var j, origCount, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.hasData(elem) && dataPriv.get(elem);
                        if (elemData && (events = elemData.events)) {
                            for (t = (types = (types || "").match(rnothtmlwhite) || [ "" ]).length; t--; ) if (type = origType = (tmp = rtypenamespace.exec(types[t]) || [])[1], 
                            namespaces = (tmp[2] || "").split(".").sort(), type) {
                                for (special = jQuery.event.special[type] || {}, handlers = events[type = (selector ? special.delegateType : special.bindType) || type] || [], 
                                tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)"), 
                                origCount = j = handlers.length; j--; ) handleObj = handlers[j], !mappedTypes && origType !== handleObj.origType || handler && handler.guid !== handleObj.guid || tmp && !tmp.test(handleObj.namespace) || selector && selector !== handleObj.selector && ("**" !== selector || !handleObj.selector) || (handlers.splice(j, 1), 
                                handleObj.selector && handlers.delegateCount--, special.remove && special.remove.call(elem, handleObj));
                                origCount && !handlers.length && (special.teardown && !1 !== special.teardown.call(elem, namespaces, elemData.handle) || jQuery.removeEvent(elem, type, elemData.handle), 
                                delete events[type]);
                            } else for (type in events) jQuery.event.remove(elem, type + types[t], handler, selector, !0);
                            jQuery.isEmptyObject(events) && dataPriv.remove(elem, "handle events");
                        }
                    },
                    dispatch: function(nativeEvent) {
                        var i, j, ret, matched, handleObj, handlerQueue, args = new Array(arguments.length), event = jQuery.event.fix(nativeEvent), handlers = (dataPriv.get(this, "events") || Object.create(null))[event.type] || [], special = jQuery.event.special[event.type] || {};
                        for (args[0] = event, i = 1; i < arguments.length; i++) args[i] = arguments[i];
                        if (event.delegateTarget = this, !special.preDispatch || !1 !== special.preDispatch.call(this, event)) {
                            for (handlerQueue = jQuery.event.handlers.call(this, event, handlers), i = 0; (matched = handlerQueue[i++]) && !event.isPropagationStopped(); ) for (event.currentTarget = matched.elem, 
                            j = 0; (handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped(); ) event.rnamespace && !1 !== handleObj.namespace && !event.rnamespace.test(handleObj.namespace) || (event.handleObj = handleObj, 
                            event.data = handleObj.data, void 0 !== (ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args)) && !1 === (event.result = ret) && (event.preventDefault(), 
                            event.stopPropagation()));
                            return special.postDispatch && special.postDispatch.call(this, event), event.result;
                        }
                    },
                    handlers: function(event, handlers) {
                        var i, handleObj, sel, matchedHandlers, matchedSelectors, handlerQueue = [], delegateCount = handlers.delegateCount, cur = event.target;
                        if (delegateCount && cur.nodeType && !("click" === event.type && event.button >= 1)) for (;cur !== this; cur = cur.parentNode || this) if (1 === cur.nodeType && ("click" !== event.type || !0 !== cur.disabled)) {
                            for (matchedHandlers = [], matchedSelectors = {}, i = 0; i < delegateCount; i++) void 0 === matchedSelectors[sel = (handleObj = handlers[i]).selector + " "] && (matchedSelectors[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) > -1 : jQuery.find(sel, this, null, [ cur ]).length), 
                            matchedSelectors[sel] && matchedHandlers.push(handleObj);
                            matchedHandlers.length && handlerQueue.push({
                                elem: cur,
                                handlers: matchedHandlers
                            });
                        }
                        return cur = this, delegateCount < handlers.length && handlerQueue.push({
                            elem: cur,
                            handlers: handlers.slice(delegateCount)
                        }), handlerQueue;
                    },
                    addProp: function(name, hook) {
                        Object.defineProperty(jQuery.Event.prototype, name, {
                            enumerable: !0,
                            configurable: !0,
                            get: isFunction(hook) ? function() {
                                if (this.originalEvent) return hook(this.originalEvent);
                            } : function() {
                                if (this.originalEvent) return this.originalEvent[name];
                            },
                            set: function(value) {
                                Object.defineProperty(this, name, {
                                    enumerable: !0,
                                    configurable: !0,
                                    writable: !0,
                                    value
                                });
                            }
                        });
                    },
                    fix: function(originalEvent) {
                        return originalEvent[jQuery.expando] ? originalEvent : new jQuery.Event(originalEvent);
                    },
                    special: {
                        load: {
                            noBubble: !0
                        },
                        click: {
                            setup: function(data) {
                                var el = this || data;
                                return rcheckableType.test(el.type) && el.click && nodeName(el, "input") && leverageNative(el, "click", returnTrue), 
                                !1;
                            },
                            trigger: function(data) {
                                var el = this || data;
                                return rcheckableType.test(el.type) && el.click && nodeName(el, "input") && leverageNative(el, "click"), 
                                !0;
                            },
                            _default: function(event) {
                                var target = event.target;
                                return rcheckableType.test(target.type) && target.click && nodeName(target, "input") && dataPriv.get(target, "click") || nodeName(target, "a");
                            }
                        },
                        beforeunload: {
                            postDispatch: function(event) {
                                void 0 !== event.result && event.originalEvent && (event.originalEvent.returnValue = event.result);
                            }
                        }
                    }
                }, jQuery.removeEvent = function(elem, type, handle) {
                    elem.removeEventListener && elem.removeEventListener(type, handle);
                }, jQuery.Event = function(src, props) {
                    if (!(this instanceof jQuery.Event)) return new jQuery.Event(src, props);
                    src && src.type ? (this.originalEvent = src, this.type = src.type, this.isDefaultPrevented = src.defaultPrevented || void 0 === src.defaultPrevented && !1 === src.returnValue ? returnTrue : returnFalse, 
                    this.target = src.target && 3 === src.target.nodeType ? src.target.parentNode : src.target, 
                    this.currentTarget = src.currentTarget, this.relatedTarget = src.relatedTarget) : this.type = src, 
                    props && jQuery.extend(this, props), this.timeStamp = src && src.timeStamp || Date.now(), 
                    this[jQuery.expando] = !0;
                }, jQuery.Event.prototype = {
                    constructor: jQuery.Event,
                    isDefaultPrevented: returnFalse,
                    isPropagationStopped: returnFalse,
                    isImmediatePropagationStopped: returnFalse,
                    isSimulated: !1,
                    preventDefault: function() {
                        var e = this.originalEvent;
                        this.isDefaultPrevented = returnTrue, e && !this.isSimulated && e.preventDefault();
                    },
                    stopPropagation: function() {
                        var e = this.originalEvent;
                        this.isPropagationStopped = returnTrue, e && !this.isSimulated && e.stopPropagation();
                    },
                    stopImmediatePropagation: function() {
                        var e = this.originalEvent;
                        this.isImmediatePropagationStopped = returnTrue, e && !this.isSimulated && e.stopImmediatePropagation(), 
                        this.stopPropagation();
                    }
                }, jQuery.each({
                    altKey: !0,
                    bubbles: !0,
                    cancelable: !0,
                    changedTouches: !0,
                    ctrlKey: !0,
                    detail: !0,
                    eventPhase: !0,
                    metaKey: !0,
                    pageX: !0,
                    pageY: !0,
                    shiftKey: !0,
                    view: !0,
                    char: !0,
                    code: !0,
                    charCode: !0,
                    key: !0,
                    keyCode: !0,
                    button: !0,
                    buttons: !0,
                    clientX: !0,
                    clientY: !0,
                    offsetX: !0,
                    offsetY: !0,
                    pointerId: !0,
                    pointerType: !0,
                    screenX: !0,
                    screenY: !0,
                    targetTouches: !0,
                    toElement: !0,
                    touches: !0,
                    which: !0
                }, jQuery.event.addProp), jQuery.each({
                    focus: "focusin",
                    blur: "focusout"
                }, (function(type, delegateType) {
                    jQuery.event.special[type] = {
                        setup: function() {
                            return leverageNative(this, type, expectSync), !1;
                        },
                        trigger: function() {
                            return leverageNative(this, type), !0;
                        },
                        _default: function() {
                            return !0;
                        },
                        delegateType
                    };
                })), jQuery.each({
                    mouseenter: "mouseover",
                    mouseleave: "mouseout",
                    pointerenter: "pointerover",
                    pointerleave: "pointerout"
                }, (function(orig, fix) {
                    jQuery.event.special[orig] = {
                        delegateType: fix,
                        bindType: fix,
                        handle: function(event) {
                            var ret, target = this, related = event.relatedTarget, handleObj = event.handleObj;
                            return related && (related === target || jQuery.contains(target, related)) || (event.type = handleObj.origType, 
                            ret = handleObj.handler.apply(this, arguments), event.type = fix), ret;
                        }
                    };
                })), jQuery.fn.extend({
                    on: function(types, selector, data, fn) {
                        return on(this, types, selector, data, fn);
                    },
                    one: function(types, selector, data, fn) {
                        return on(this, types, selector, data, fn, 1);
                    },
                    off: function(types, selector, fn) {
                        var handleObj, type;
                        if (types && types.preventDefault && types.handleObj) return handleObj = types.handleObj, 
                        jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler), 
                        this;
                        if ("object" == typeof types) {
                            for (type in types) this.off(type, selector, types[type]);
                            return this;
                        }
                        return !1 !== selector && "function" != typeof selector || (fn = selector, selector = void 0), 
                        !1 === fn && (fn = returnFalse), this.each((function() {
                            jQuery.event.remove(this, types, fn, selector);
                        }));
                    }
                });
                var rnoInnerhtml = /<script|<style|<link/i, rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
                function manipulationTarget(elem, content) {
                    return nodeName(elem, "table") && nodeName(11 !== content.nodeType ? content : content.firstChild, "tr") && jQuery(elem).children("tbody")[0] || elem;
                }
                function disableScript(elem) {
                    return elem.type = (null !== elem.getAttribute("type")) + "/" + elem.type, elem;
                }
                function restoreScript(elem) {
                    return "true/" === (elem.type || "").slice(0, 5) ? elem.type = elem.type.slice(5) : elem.removeAttribute("type"), 
                    elem;
                }
                function cloneCopyEvent(src, dest) {
                    var i, l, type, udataOld, udataCur, events;
                    if (1 === dest.nodeType) {
                        if (dataPriv.hasData(src) && (events = dataPriv.get(src).events)) for (type in dataPriv.remove(dest, "handle events"), 
                        events) for (i = 0, l = events[type].length; i < l; i++) jQuery.event.add(dest, type, events[type][i]);
                        dataUser.hasData(src) && (udataOld = dataUser.access(src), udataCur = jQuery.extend({}, udataOld), 
                        dataUser.set(dest, udataCur));
                    }
                }
                function fixInput(src, dest) {
                    var nodeName = dest.nodeName.toLowerCase();
                    "input" === nodeName && rcheckableType.test(src.type) ? dest.checked = src.checked : "input" !== nodeName && "textarea" !== nodeName || (dest.defaultValue = src.defaultValue);
                }
                function domManip(collection, args, callback, ignored) {
                    args = flat(args);
                    var fragment, first, scripts, hasScripts, node, doc, i = 0, l = collection.length, iNoClone = l - 1, value = args[0], valueIsFunction = isFunction(value);
                    if (valueIsFunction || l > 1 && "string" == typeof value && !support.checkClone && rchecked.test(value)) return collection.each((function(index) {
                        var self = collection.eq(index);
                        valueIsFunction && (args[0] = value.call(this, index, self.html())), domManip(self, args, callback, ignored);
                    }));
                    if (l && (first = (fragment = buildFragment(args, collection[0].ownerDocument, !1, collection, ignored)).firstChild, 
                    1 === fragment.childNodes.length && (fragment = first), first || ignored)) {
                        for (hasScripts = (scripts = jQuery.map(getAll(fragment, "script"), disableScript)).length; i < l; i++) node = fragment, 
                        i !== iNoClone && (node = jQuery.clone(node, !0, !0), hasScripts && jQuery.merge(scripts, getAll(node, "script"))), 
                        callback.call(collection[i], node, i);
                        if (hasScripts) for (doc = scripts[scripts.length - 1].ownerDocument, jQuery.map(scripts, restoreScript), 
                        i = 0; i < hasScripts; i++) node = scripts[i], rscriptType.test(node.type || "") && !dataPriv.access(node, "globalEval") && jQuery.contains(doc, node) && (node.src && "module" !== (node.type || "").toLowerCase() ? jQuery._evalUrl && !node.noModule && jQuery._evalUrl(node.src, {
                            nonce: node.nonce || node.getAttribute("nonce")
                        }, doc) : DOMEval(node.textContent.replace(rcleanScript, ""), node, doc));
                    }
                    return collection;
                }
                function remove(elem, selector, keepData) {
                    for (var node, nodes = selector ? jQuery.filter(selector, elem) : elem, i = 0; null != (node = nodes[i]); i++) keepData || 1 !== node.nodeType || jQuery.cleanData(getAll(node)), 
                    node.parentNode && (keepData && isAttached(node) && setGlobalEval(getAll(node, "script")), 
                    node.parentNode.removeChild(node));
                    return elem;
                }
                jQuery.extend({
                    htmlPrefilter: function(html) {
                        return html;
                    },
                    clone: function(elem, dataAndEvents, deepDataAndEvents) {
                        var i, l, srcElements, destElements, clone = elem.cloneNode(!0), inPage = isAttached(elem);
                        if (!(support.noCloneChecked || 1 !== elem.nodeType && 11 !== elem.nodeType || jQuery.isXMLDoc(elem))) for (destElements = getAll(clone), 
                        i = 0, l = (srcElements = getAll(elem)).length; i < l; i++) fixInput(srcElements[i], destElements[i]);
                        if (dataAndEvents) if (deepDataAndEvents) for (srcElements = srcElements || getAll(elem), 
                        destElements = destElements || getAll(clone), i = 0, l = srcElements.length; i < l; i++) cloneCopyEvent(srcElements[i], destElements[i]); else cloneCopyEvent(elem, clone);
                        return (destElements = getAll(clone, "script")).length > 0 && setGlobalEval(destElements, !inPage && getAll(elem, "script")), 
                        clone;
                    },
                    cleanData: function(elems) {
                        for (var data, elem, type, special = jQuery.event.special, i = 0; void 0 !== (elem = elems[i]); i++) if (acceptData(elem)) {
                            if (data = elem[dataPriv.expando]) {
                                if (data.events) for (type in data.events) special[type] ? jQuery.event.remove(elem, type) : jQuery.removeEvent(elem, type, data.handle);
                                elem[dataPriv.expando] = void 0;
                            }
                            elem[dataUser.expando] && (elem[dataUser.expando] = void 0);
                        }
                    }
                }), jQuery.fn.extend({
                    detach: function(selector) {
                        return remove(this, selector, !0);
                    },
                    remove: function(selector) {
                        return remove(this, selector);
                    },
                    text: function(value) {
                        return access(this, (function(value) {
                            return void 0 === value ? jQuery.text(this) : this.empty().each((function() {
                                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = value);
                            }));
                        }), null, value, arguments.length);
                    },
                    append: function() {
                        return domManip(this, arguments, (function(elem) {
                            1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || manipulationTarget(this, elem).appendChild(elem);
                        }));
                    },
                    prepend: function() {
                        return domManip(this, arguments, (function(elem) {
                            if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                                var target = manipulationTarget(this, elem);
                                target.insertBefore(elem, target.firstChild);
                            }
                        }));
                    },
                    before: function() {
                        return domManip(this, arguments, (function(elem) {
                            this.parentNode && this.parentNode.insertBefore(elem, this);
                        }));
                    },
                    after: function() {
                        return domManip(this, arguments, (function(elem) {
                            this.parentNode && this.parentNode.insertBefore(elem, this.nextSibling);
                        }));
                    },
                    empty: function() {
                        for (var elem, i = 0; null != (elem = this[i]); i++) 1 === elem.nodeType && (jQuery.cleanData(getAll(elem, !1)), 
                        elem.textContent = "");
                        return this;
                    },
                    clone: function(dataAndEvents, deepDataAndEvents) {
                        return dataAndEvents = null != dataAndEvents && dataAndEvents, deepDataAndEvents = null == deepDataAndEvents ? dataAndEvents : deepDataAndEvents, 
                        this.map((function() {
                            return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
                        }));
                    },
                    html: function(value) {
                        return access(this, (function(value) {
                            var elem = this[0] || {}, i = 0, l = this.length;
                            if (void 0 === value && 1 === elem.nodeType) return elem.innerHTML;
                            if ("string" == typeof value && !rnoInnerhtml.test(value) && !wrapMap[(rtagName.exec(value) || [ "", "" ])[1].toLowerCase()]) {
                                value = jQuery.htmlPrefilter(value);
                                try {
                                    for (;i < l; i++) 1 === (elem = this[i] || {}).nodeType && (jQuery.cleanData(getAll(elem, !1)), 
                                    elem.innerHTML = value);
                                    elem = 0;
                                } catch (e) {}
                            }
                            elem && this.empty().append(value);
                        }), null, value, arguments.length);
                    },
                    replaceWith: function() {
                        var ignored = [];
                        return domManip(this, arguments, (function(elem) {
                            var parent = this.parentNode;
                            jQuery.inArray(this, ignored) < 0 && (jQuery.cleanData(getAll(this)), parent && parent.replaceChild(elem, this));
                        }), ignored);
                    }
                }), jQuery.each({
                    appendTo: "append",
                    prependTo: "prepend",
                    insertBefore: "before",
                    insertAfter: "after",
                    replaceAll: "replaceWith"
                }, (function(name, original) {
                    jQuery.fn[name] = function(selector) {
                        for (var elems, ret = [], insert = jQuery(selector), last = insert.length - 1, i = 0; i <= last; i++) elems = i === last ? this : this.clone(!0), 
                        jQuery(insert[i])[original](elems), push.apply(ret, elems.get());
                        return this.pushStack(ret);
                    };
                }));
                var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i"), getStyles = function(elem) {
                    var view = elem.ownerDocument.defaultView;
                    return view && view.opener || (view = window), view.getComputedStyle(elem);
                }, swap = function(elem, options, callback) {
                    var ret, name, old = {};
                    for (name in options) old[name] = elem.style[name], elem.style[name] = options[name];
                    for (name in ret = callback.call(elem), options) elem.style[name] = old[name];
                    return ret;
                }, rboxStyle = new RegExp(cssExpand.join("|"), "i");
                function curCSS(elem, name, computed) {
                    var width, minWidth, maxWidth, ret, style = elem.style;
                    return (computed = computed || getStyles(elem)) && ("" !== (ret = computed.getPropertyValue(name) || computed[name]) || isAttached(elem) || (ret = jQuery.style(elem, name)), 
                    !support.pixelBoxStyles() && rnumnonpx.test(ret) && rboxStyle.test(name) && (width = style.width, 
                    minWidth = style.minWidth, maxWidth = style.maxWidth, style.minWidth = style.maxWidth = style.width = ret, 
                    ret = computed.width, style.width = width, style.minWidth = minWidth, style.maxWidth = maxWidth)), 
                    void 0 !== ret ? ret + "" : ret;
                }
                function addGetHookIf(conditionFn, hookFn) {
                    return {
                        get: function() {
                            if (!conditionFn()) return (this.get = hookFn).apply(this, arguments);
                            delete this.get;
                        }
                    };
                }
                !function() {
                    function computeStyleTests() {
                        if (div) {
                            container.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0", 
                            div.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%", 
                            documentElement.appendChild(container).appendChild(div);
                            var divStyle = window.getComputedStyle(div);
                            pixelPositionVal = "1%" !== divStyle.top, reliableMarginLeftVal = 12 === roundPixelMeasures(divStyle.marginLeft), 
                            div.style.right = "60%", pixelBoxStylesVal = 36 === roundPixelMeasures(divStyle.right), 
                            boxSizingReliableVal = 36 === roundPixelMeasures(divStyle.width), div.style.position = "absolute", 
                            scrollboxSizeVal = 12 === roundPixelMeasures(div.offsetWidth / 3), documentElement.removeChild(container), 
                            div = null;
                        }
                    }
                    function roundPixelMeasures(measure) {
                        return Math.round(parseFloat(measure));
                    }
                    var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal, reliableTrDimensionsVal, reliableMarginLeftVal, container = document.createElement("div"), div = document.createElement("div");
                    div.style && (div.style.backgroundClip = "content-box", div.cloneNode(!0).style.backgroundClip = "", 
                    support.clearCloneStyle = "content-box" === div.style.backgroundClip, jQuery.extend(support, {
                        boxSizingReliable: function() {
                            return computeStyleTests(), boxSizingReliableVal;
                        },
                        pixelBoxStyles: function() {
                            return computeStyleTests(), pixelBoxStylesVal;
                        },
                        pixelPosition: function() {
                            return computeStyleTests(), pixelPositionVal;
                        },
                        reliableMarginLeft: function() {
                            return computeStyleTests(), reliableMarginLeftVal;
                        },
                        scrollboxSize: function() {
                            return computeStyleTests(), scrollboxSizeVal;
                        },
                        reliableTrDimensions: function() {
                            var table, tr, trChild, trStyle;
                            return null == reliableTrDimensionsVal && (table = document.createElement("table"), 
                            tr = document.createElement("tr"), trChild = document.createElement("div"), table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate", 
                            tr.style.cssText = "border:1px solid", tr.style.height = "1px", trChild.style.height = "9px", 
                            trChild.style.display = "block", documentElement.appendChild(table).appendChild(tr).appendChild(trChild), 
                            trStyle = window.getComputedStyle(tr), reliableTrDimensionsVal = parseInt(trStyle.height, 10) + parseInt(trStyle.borderTopWidth, 10) + parseInt(trStyle.borderBottomWidth, 10) === tr.offsetHeight, 
                            documentElement.removeChild(table)), reliableTrDimensionsVal;
                        }
                    }));
                }();
                var cssPrefixes = [ "Webkit", "Moz", "ms" ], emptyStyle = document.createElement("div").style, vendorProps = {};
                function finalPropName(name) {
                    var final = jQuery.cssProps[name] || vendorProps[name];
                    return final || (name in emptyStyle ? name : vendorProps[name] = function(name) {
                        for (var capName = name[0].toUpperCase() + name.slice(1), i = cssPrefixes.length; i--; ) if ((name = cssPrefixes[i] + capName) in emptyStyle) return name;
                    }(name) || name);
                }
                var rdisplayswap = /^(none|table(?!-c[ea]).+)/, rcustomProp = /^--/, cssShow = {
                    position: "absolute",
                    visibility: "hidden",
                    display: "block"
                }, cssNormalTransform = {
                    letterSpacing: "0",
                    fontWeight: "400"
                };
                function setPositiveNumber(_elem, value, subtract) {
                    var matches = rcssNum.exec(value);
                    return matches ? Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px") : value;
                }
                function boxModelAdjustment(elem, dimension, box, isBorderBox, styles, computedVal) {
                    var i = "width" === dimension ? 1 : 0, extra = 0, delta = 0;
                    if (box === (isBorderBox ? "border" : "content")) return 0;
                    for (;i < 4; i += 2) "margin" === box && (delta += jQuery.css(elem, box + cssExpand[i], !0, styles)), 
                    isBorderBox ? ("content" === box && (delta -= jQuery.css(elem, "padding" + cssExpand[i], !0, styles)), 
                    "margin" !== box && (delta -= jQuery.css(elem, "border" + cssExpand[i] + "Width", !0, styles))) : (delta += jQuery.css(elem, "padding" + cssExpand[i], !0, styles), 
                    "padding" !== box ? delta += jQuery.css(elem, "border" + cssExpand[i] + "Width", !0, styles) : extra += jQuery.css(elem, "border" + cssExpand[i] + "Width", !0, styles));
                    return !isBorderBox && computedVal >= 0 && (delta += Math.max(0, Math.ceil(elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - computedVal - delta - extra - .5)) || 0), 
                    delta;
                }
                function getWidthOrHeight(elem, dimension, extra) {
                    var styles = getStyles(elem), isBorderBox = (!support.boxSizingReliable() || extra) && "border-box" === jQuery.css(elem, "boxSizing", !1, styles), valueIsBorderBox = isBorderBox, val = curCSS(elem, dimension, styles), offsetProp = "offset" + dimension[0].toUpperCase() + dimension.slice(1);
                    if (rnumnonpx.test(val)) {
                        if (!extra) return val;
                        val = "auto";
                    }
                    return (!support.boxSizingReliable() && isBorderBox || !support.reliableTrDimensions() && nodeName(elem, "tr") || "auto" === val || !parseFloat(val) && "inline" === jQuery.css(elem, "display", !1, styles)) && elem.getClientRects().length && (isBorderBox = "border-box" === jQuery.css(elem, "boxSizing", !1, styles), 
                    (valueIsBorderBox = offsetProp in elem) && (val = elem[offsetProp])), (val = parseFloat(val) || 0) + boxModelAdjustment(elem, dimension, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles, val) + "px";
                }
                function Tween(elem, options, prop, end, easing) {
                    return new Tween.prototype.init(elem, options, prop, end, easing);
                }
                jQuery.extend({
                    cssHooks: {
                        opacity: {
                            get: function(elem, computed) {
                                if (computed) {
                                    var ret = curCSS(elem, "opacity");
                                    return "" === ret ? "1" : ret;
                                }
                            }
                        }
                    },
                    cssNumber: {
                        animationIterationCount: !0,
                        columnCount: !0,
                        fillOpacity: !0,
                        flexGrow: !0,
                        flexShrink: !0,
                        fontWeight: !0,
                        gridArea: !0,
                        gridColumn: !0,
                        gridColumnEnd: !0,
                        gridColumnStart: !0,
                        gridRow: !0,
                        gridRowEnd: !0,
                        gridRowStart: !0,
                        lineHeight: !0,
                        opacity: !0,
                        order: !0,
                        orphans: !0,
                        widows: !0,
                        zIndex: !0,
                        zoom: !0
                    },
                    cssProps: {},
                    style: function(elem, name, value, extra) {
                        if (elem && 3 !== elem.nodeType && 8 !== elem.nodeType && elem.style) {
                            var ret, type, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name), style = elem.style;
                            if (isCustomProp || (name = finalPropName(origName)), hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName], 
                            void 0 === value) return hooks && "get" in hooks && void 0 !== (ret = hooks.get(elem, !1, extra)) ? ret : style[name];
                            "string" === (type = typeof value) && (ret = rcssNum.exec(value)) && ret[1] && (value = adjustCSS(elem, name, ret), 
                            type = "number"), null != value && value == value && ("number" !== type || isCustomProp || (value += ret && ret[3] || (jQuery.cssNumber[origName] ? "" : "px")), 
                            support.clearCloneStyle || "" !== value || 0 !== name.indexOf("background") || (style[name] = "inherit"), 
                            hooks && "set" in hooks && void 0 === (value = hooks.set(elem, value, extra)) || (isCustomProp ? style.setProperty(name, value) : style[name] = value));
                        }
                    },
                    css: function(elem, name, extra, styles) {
                        var val, num, hooks, origName = camelCase(name);
                        return rcustomProp.test(name) || (name = finalPropName(origName)), (hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName]) && "get" in hooks && (val = hooks.get(elem, !0, extra)), 
                        void 0 === val && (val = curCSS(elem, name, styles)), "normal" === val && name in cssNormalTransform && (val = cssNormalTransform[name]), 
                        "" === extra || extra ? (num = parseFloat(val), !0 === extra || isFinite(num) ? num || 0 : val) : val;
                    }
                }), jQuery.each([ "height", "width" ], (function(_i, dimension) {
                    jQuery.cssHooks[dimension] = {
                        get: function(elem, computed, extra) {
                            if (computed) return !rdisplayswap.test(jQuery.css(elem, "display")) || elem.getClientRects().length && elem.getBoundingClientRect().width ? getWidthOrHeight(elem, dimension, extra) : swap(elem, cssShow, (function() {
                                return getWidthOrHeight(elem, dimension, extra);
                            }));
                        },
                        set: function(elem, value, extra) {
                            var matches, styles = getStyles(elem), scrollboxSizeBuggy = !support.scrollboxSize() && "absolute" === styles.position, isBorderBox = (scrollboxSizeBuggy || extra) && "border-box" === jQuery.css(elem, "boxSizing", !1, styles), subtract = extra ? boxModelAdjustment(elem, dimension, extra, isBorderBox, styles) : 0;
                            return isBorderBox && scrollboxSizeBuggy && (subtract -= Math.ceil(elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - parseFloat(styles[dimension]) - boxModelAdjustment(elem, dimension, "border", !1, styles) - .5)), 
                            subtract && (matches = rcssNum.exec(value)) && "px" !== (matches[3] || "px") && (elem.style[dimension] = value, 
                            value = jQuery.css(elem, dimension)), setPositiveNumber(0, value, subtract);
                        }
                    };
                })), jQuery.cssHooks.marginLeft = addGetHookIf(support.reliableMarginLeft, (function(elem, computed) {
                    if (computed) return (parseFloat(curCSS(elem, "marginLeft")) || elem.getBoundingClientRect().left - swap(elem, {
                        marginLeft: 0
                    }, (function() {
                        return elem.getBoundingClientRect().left;
                    }))) + "px";
                })), jQuery.each({
                    margin: "",
                    padding: "",
                    border: "Width"
                }, (function(prefix, suffix) {
                    jQuery.cssHooks[prefix + suffix] = {
                        expand: function(value) {
                            for (var i = 0, expanded = {}, parts = "string" == typeof value ? value.split(" ") : [ value ]; i < 4; i++) expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
                            return expanded;
                        }
                    }, "margin" !== prefix && (jQuery.cssHooks[prefix + suffix].set = setPositiveNumber);
                })), jQuery.fn.extend({
                    css: function(name, value) {
                        return access(this, (function(elem, name, value) {
                            var styles, len, map = {}, i = 0;
                            if (Array.isArray(name)) {
                                for (styles = getStyles(elem), len = name.length; i < len; i++) map[name[i]] = jQuery.css(elem, name[i], !1, styles);
                                return map;
                            }
                            return void 0 !== value ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
                        }), name, value, arguments.length > 1);
                    }
                }), jQuery.Tween = Tween, Tween.prototype = {
                    constructor: Tween,
                    init: function(elem, options, prop, end, easing, unit) {
                        this.elem = elem, this.prop = prop, this.easing = easing || jQuery.easing._default, 
                        this.options = options, this.start = this.now = this.cur(), this.end = end, this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
                    },
                    cur: function() {
                        var hooks = Tween.propHooks[this.prop];
                        return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
                    },
                    run: function(percent) {
                        var eased, hooks = Tween.propHooks[this.prop];
                        return this.options.duration ? this.pos = eased = jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration) : this.pos = eased = percent, 
                        this.now = (this.end - this.start) * eased + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), 
                        hooks && hooks.set ? hooks.set(this) : Tween.propHooks._default.set(this), this;
                    }
                }, Tween.prototype.init.prototype = Tween.prototype, Tween.propHooks = {
                    _default: {
                        get: function(tween) {
                            var result;
                            return 1 !== tween.elem.nodeType || null != tween.elem[tween.prop] && null == tween.elem.style[tween.prop] ? tween.elem[tween.prop] : (result = jQuery.css(tween.elem, tween.prop, "")) && "auto" !== result ? result : 0;
                        },
                        set: function(tween) {
                            jQuery.fx.step[tween.prop] ? jQuery.fx.step[tween.prop](tween) : 1 !== tween.elem.nodeType || !jQuery.cssHooks[tween.prop] && null == tween.elem.style[finalPropName(tween.prop)] ? tween.elem[tween.prop] = tween.now : jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
                        }
                    }
                }, Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
                    set: function(tween) {
                        tween.elem.nodeType && tween.elem.parentNode && (tween.elem[tween.prop] = tween.now);
                    }
                }, jQuery.easing = {
                    linear: function(p) {
                        return p;
                    },
                    swing: function(p) {
                        return .5 - Math.cos(p * Math.PI) / 2;
                    },
                    _default: "swing"
                }, jQuery.fx = Tween.prototype.init, jQuery.fx.step = {};
                var fxNow, inProgress, rfxtypes = /^(?:toggle|show|hide)$/, rrun = /queueHooks$/;
                function schedule() {
                    inProgress && (!1 === document.hidden && window.requestAnimationFrame ? window.requestAnimationFrame(schedule) : window.setTimeout(schedule, jQuery.fx.interval), 
                    jQuery.fx.tick());
                }
                function createFxNow() {
                    return window.setTimeout((function() {
                        fxNow = void 0;
                    })), fxNow = Date.now();
                }
                function genFx(type, includeWidth) {
                    var which, i = 0, attrs = {
                        height: type
                    };
                    for (includeWidth = includeWidth ? 1 : 0; i < 4; i += 2 - includeWidth) attrs["margin" + (which = cssExpand[i])] = attrs["padding" + which] = type;
                    return includeWidth && (attrs.opacity = attrs.width = type), attrs;
                }
                function createTween(value, prop, animation) {
                    for (var tween, collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]), index = 0, length = collection.length; index < length; index++) if (tween = collection[index].call(animation, prop, value)) return tween;
                }
                function Animation(elem, properties, options) {
                    var result, stopped, index = 0, length = Animation.prefilters.length, deferred = jQuery.Deferred().always((function() {
                        delete tick.elem;
                    })), tick = function() {
                        if (stopped) return !1;
                        for (var currentTime = fxNow || createFxNow(), remaining = Math.max(0, animation.startTime + animation.duration - currentTime), percent = 1 - (remaining / animation.duration || 0), index = 0, length = animation.tweens.length; index < length; index++) animation.tweens[index].run(percent);
                        return deferred.notifyWith(elem, [ animation, percent, remaining ]), percent < 1 && length ? remaining : (length || deferred.notifyWith(elem, [ animation, 1, 0 ]), 
                        deferred.resolveWith(elem, [ animation ]), !1);
                    }, animation = deferred.promise({
                        elem,
                        props: jQuery.extend({}, properties),
                        opts: jQuery.extend(!0, {
                            specialEasing: {},
                            easing: jQuery.easing._default
                        }, options),
                        originalProperties: properties,
                        originalOptions: options,
                        startTime: fxNow || createFxNow(),
                        duration: options.duration,
                        tweens: [],
                        createTween: function(prop, end) {
                            var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
                            return animation.tweens.push(tween), tween;
                        },
                        stop: function(gotoEnd) {
                            var index = 0, length = gotoEnd ? animation.tweens.length : 0;
                            if (stopped) return this;
                            for (stopped = !0; index < length; index++) animation.tweens[index].run(1);
                            return gotoEnd ? (deferred.notifyWith(elem, [ animation, 1, 0 ]), deferred.resolveWith(elem, [ animation, gotoEnd ])) : deferred.rejectWith(elem, [ animation, gotoEnd ]), 
                            this;
                        }
                    }), props = animation.props;
                    for (!function(props, specialEasing) {
                        var index, name, easing, value, hooks;
                        for (index in props) if (easing = specialEasing[name = camelCase(index)], value = props[index], 
                        Array.isArray(value) && (easing = value[1], value = props[index] = value[0]), index !== name && (props[name] = value, 
                        delete props[index]), (hooks = jQuery.cssHooks[name]) && "expand" in hooks) for (index in value = hooks.expand(value), 
                        delete props[name], value) index in props || (props[index] = value[index], specialEasing[index] = easing); else specialEasing[name] = easing;
                    }(props, animation.opts.specialEasing); index < length; index++) if (result = Animation.prefilters[index].call(animation, elem, props, animation.opts)) return isFunction(result.stop) && (jQuery._queueHooks(animation.elem, animation.opts.queue).stop = result.stop.bind(result)), 
                    result;
                    return jQuery.map(props, createTween, animation), isFunction(animation.opts.start) && animation.opts.start.call(elem, animation), 
                    animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always), 
                    jQuery.fx.timer(jQuery.extend(tick, {
                        elem,
                        anim: animation,
                        queue: animation.opts.queue
                    })), animation;
                }
                jQuery.Animation = jQuery.extend(Animation, {
                    tweeners: {
                        "*": [ function(prop, value) {
                            var tween = this.createTween(prop, value);
                            return adjustCSS(tween.elem, prop, rcssNum.exec(value), tween), tween;
                        } ]
                    },
                    tweener: function(props, callback) {
                        isFunction(props) ? (callback = props, props = [ "*" ]) : props = props.match(rnothtmlwhite);
                        for (var prop, index = 0, length = props.length; index < length; index++) prop = props[index], 
                        Animation.tweeners[prop] = Animation.tweeners[prop] || [], Animation.tweeners[prop].unshift(callback);
                    },
                    prefilters: [ function(elem, props, opts) {
                        var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display, isBox = "width" in props || "height" in props, anim = this, orig = {}, style = elem.style, hidden = elem.nodeType && isHiddenWithinTree(elem), dataShow = dataPriv.get(elem, "fxshow");
                        for (prop in opts.queue || (null == (hooks = jQuery._queueHooks(elem, "fx")).unqueued && (hooks.unqueued = 0, 
                        oldfire = hooks.empty.fire, hooks.empty.fire = function() {
                            hooks.unqueued || oldfire();
                        }), hooks.unqueued++, anim.always((function() {
                            anim.always((function() {
                                hooks.unqueued--, jQuery.queue(elem, "fx").length || hooks.empty.fire();
                            }));
                        }))), props) if (value = props[prop], rfxtypes.test(value)) {
                            if (delete props[prop], toggle = toggle || "toggle" === value, value === (hidden ? "hide" : "show")) {
                                if ("show" !== value || !dataShow || void 0 === dataShow[prop]) continue;
                                hidden = !0;
                            }
                            orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
                        }
                        if ((propTween = !jQuery.isEmptyObject(props)) || !jQuery.isEmptyObject(orig)) for (prop in isBox && 1 === elem.nodeType && (opts.overflow = [ style.overflow, style.overflowX, style.overflowY ], 
                        null == (restoreDisplay = dataShow && dataShow.display) && (restoreDisplay = dataPriv.get(elem, "display")), 
                        "none" === (display = jQuery.css(elem, "display")) && (restoreDisplay ? display = restoreDisplay : (showHide([ elem ], !0), 
                        restoreDisplay = elem.style.display || restoreDisplay, display = jQuery.css(elem, "display"), 
                        showHide([ elem ]))), ("inline" === display || "inline-block" === display && null != restoreDisplay) && "none" === jQuery.css(elem, "float") && (propTween || (anim.done((function() {
                            style.display = restoreDisplay;
                        })), null == restoreDisplay && (display = style.display, restoreDisplay = "none" === display ? "" : display)), 
                        style.display = "inline-block")), opts.overflow && (style.overflow = "hidden", anim.always((function() {
                            style.overflow = opts.overflow[0], style.overflowX = opts.overflow[1], style.overflowY = opts.overflow[2];
                        }))), propTween = !1, orig) propTween || (dataShow ? "hidden" in dataShow && (hidden = dataShow.hidden) : dataShow = dataPriv.access(elem, "fxshow", {
                            display: restoreDisplay
                        }), toggle && (dataShow.hidden = !hidden), hidden && showHide([ elem ], !0), anim.done((function() {
                            for (prop in hidden || showHide([ elem ]), dataPriv.remove(elem, "fxshow"), orig) jQuery.style(elem, prop, orig[prop]);
                        }))), propTween = createTween(hidden ? dataShow[prop] : 0, prop, anim), prop in dataShow || (dataShow[prop] = propTween.start, 
                        hidden && (propTween.end = propTween.start, propTween.start = 0));
                    } ],
                    prefilter: function(callback, prepend) {
                        prepend ? Animation.prefilters.unshift(callback) : Animation.prefilters.push(callback);
                    }
                }), jQuery.speed = function(speed, easing, fn) {
                    var opt = speed && "object" == typeof speed ? jQuery.extend({}, speed) : {
                        complete: fn || !fn && easing || isFunction(speed) && speed,
                        duration: speed,
                        easing: fn && easing || easing && !isFunction(easing) && easing
                    };
                    return jQuery.fx.off ? opt.duration = 0 : "number" != typeof opt.duration && (opt.duration in jQuery.fx.speeds ? opt.duration = jQuery.fx.speeds[opt.duration] : opt.duration = jQuery.fx.speeds._default), 
                    null != opt.queue && !0 !== opt.queue || (opt.queue = "fx"), opt.old = opt.complete, 
                    opt.complete = function() {
                        isFunction(opt.old) && opt.old.call(this), opt.queue && jQuery.dequeue(this, opt.queue);
                    }, opt;
                }, jQuery.fn.extend({
                    fadeTo: function(speed, to, easing, callback) {
                        return this.filter(isHiddenWithinTree).css("opacity", 0).show().end().animate({
                            opacity: to
                        }, speed, easing, callback);
                    },
                    animate: function(prop, speed, easing, callback) {
                        var empty = jQuery.isEmptyObject(prop), optall = jQuery.speed(speed, easing, callback), doAnimation = function() {
                            var anim = Animation(this, jQuery.extend({}, prop), optall);
                            (empty || dataPriv.get(this, "finish")) && anim.stop(!0);
                        };
                        return doAnimation.finish = doAnimation, empty || !1 === optall.queue ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
                    },
                    stop: function(type, clearQueue, gotoEnd) {
                        var stopQueue = function(hooks) {
                            var stop = hooks.stop;
                            delete hooks.stop, stop(gotoEnd);
                        };
                        return "string" != typeof type && (gotoEnd = clearQueue, clearQueue = type, type = void 0), 
                        clearQueue && this.queue(type || "fx", []), this.each((function() {
                            var dequeue = !0, index = null != type && type + "queueHooks", timers = jQuery.timers, data = dataPriv.get(this);
                            if (index) data[index] && data[index].stop && stopQueue(data[index]); else for (index in data) data[index] && data[index].stop && rrun.test(index) && stopQueue(data[index]);
                            for (index = timers.length; index--; ) timers[index].elem !== this || null != type && timers[index].queue !== type || (timers[index].anim.stop(gotoEnd), 
                            dequeue = !1, timers.splice(index, 1));
                            !dequeue && gotoEnd || jQuery.dequeue(this, type);
                        }));
                    },
                    finish: function(type) {
                        return !1 !== type && (type = type || "fx"), this.each((function() {
                            var index, data = dataPriv.get(this), queue = data[type + "queue"], hooks = data[type + "queueHooks"], timers = jQuery.timers, length = queue ? queue.length : 0;
                            for (data.finish = !0, jQuery.queue(this, type, []), hooks && hooks.stop && hooks.stop.call(this, !0), 
                            index = timers.length; index--; ) timers[index].elem === this && timers[index].queue === type && (timers[index].anim.stop(!0), 
                            timers.splice(index, 1));
                            for (index = 0; index < length; index++) queue[index] && queue[index].finish && queue[index].finish.call(this);
                            delete data.finish;
                        }));
                    }
                }), jQuery.each([ "toggle", "show", "hide" ], (function(_i, name) {
                    var cssFn = jQuery.fn[name];
                    jQuery.fn[name] = function(speed, easing, callback) {
                        return null == speed || "boolean" == typeof speed ? cssFn.apply(this, arguments) : this.animate(genFx(name, !0), speed, easing, callback);
                    };
                })), jQuery.each({
                    slideDown: genFx("show"),
                    slideUp: genFx("hide"),
                    slideToggle: genFx("toggle"),
                    fadeIn: {
                        opacity: "show"
                    },
                    fadeOut: {
                        opacity: "hide"
                    },
                    fadeToggle: {
                        opacity: "toggle"
                    }
                }, (function(name, props) {
                    jQuery.fn[name] = function(speed, easing, callback) {
                        return this.animate(props, speed, easing, callback);
                    };
                })), jQuery.timers = [], jQuery.fx.tick = function() {
                    var timer, i = 0, timers = jQuery.timers;
                    for (fxNow = Date.now(); i < timers.length; i++) (timer = timers[i])() || timers[i] !== timer || timers.splice(i--, 1);
                    timers.length || jQuery.fx.stop(), fxNow = void 0;
                }, jQuery.fx.timer = function(timer) {
                    jQuery.timers.push(timer), jQuery.fx.start();
                }, jQuery.fx.interval = 13, jQuery.fx.start = function() {
                    inProgress || (inProgress = !0, schedule());
                }, jQuery.fx.stop = function() {
                    inProgress = null;
                }, jQuery.fx.speeds = {
                    slow: 600,
                    fast: 200,
                    _default: 400
                }, jQuery.fn.delay = function(time, type) {
                    return time = jQuery.fx && jQuery.fx.speeds[time] || time, type = type || "fx", 
                    this.queue(type, (function(next, hooks) {
                        var timeout = window.setTimeout(next, time);
                        hooks.stop = function() {
                            window.clearTimeout(timeout);
                        };
                    }));
                }, function() {
                    var input = document.createElement("input"), opt = document.createElement("select").appendChild(document.createElement("option"));
                    input.type = "checkbox", support.checkOn = "" !== input.value, support.optSelected = opt.selected, 
                    (input = document.createElement("input")).value = "t", input.type = "radio", support.radioValue = "t" === input.value;
                }();
                var boolHook, attrHandle = jQuery.expr.attrHandle;
                jQuery.fn.extend({
                    attr: function(name, value) {
                        return access(this, jQuery.attr, name, value, arguments.length > 1);
                    },
                    removeAttr: function(name) {
                        return this.each((function() {
                            jQuery.removeAttr(this, name);
                        }));
                    }
                }), jQuery.extend({
                    attr: function(elem, name, value) {
                        var ret, hooks, nType = elem.nodeType;
                        if (3 !== nType && 8 !== nType && 2 !== nType) return void 0 === elem.getAttribute ? jQuery.prop(elem, name, value) : (1 === nType && jQuery.isXMLDoc(elem) || (hooks = jQuery.attrHooks[name.toLowerCase()] || (jQuery.expr.match.bool.test(name) ? boolHook : void 0)), 
                        void 0 !== value ? null === value ? void jQuery.removeAttr(elem, name) : hooks && "set" in hooks && void 0 !== (ret = hooks.set(elem, value, name)) ? ret : (elem.setAttribute(name, value + ""), 
                        value) : hooks && "get" in hooks && null !== (ret = hooks.get(elem, name)) ? ret : null == (ret = jQuery.find.attr(elem, name)) ? void 0 : ret);
                    },
                    attrHooks: {
                        type: {
                            set: function(elem, value) {
                                if (!support.radioValue && "radio" === value && nodeName(elem, "input")) {
                                    var val = elem.value;
                                    return elem.setAttribute("type", value), val && (elem.value = val), value;
                                }
                            }
                        }
                    },
                    removeAttr: function(elem, value) {
                        var name, i = 0, attrNames = value && value.match(rnothtmlwhite);
                        if (attrNames && 1 === elem.nodeType) for (;name = attrNames[i++]; ) elem.removeAttribute(name);
                    }
                }), boolHook = {
                    set: function(elem, value, name) {
                        return !1 === value ? jQuery.removeAttr(elem, name) : elem.setAttribute(name, name), 
                        name;
                    }
                }, jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), (function(_i, name) {
                    var getter = attrHandle[name] || jQuery.find.attr;
                    attrHandle[name] = function(elem, name, isXML) {
                        var ret, handle, lowercaseName = name.toLowerCase();
                        return isXML || (handle = attrHandle[lowercaseName], attrHandle[lowercaseName] = ret, 
                        ret = null != getter(elem, name, isXML) ? lowercaseName : null, attrHandle[lowercaseName] = handle), 
                        ret;
                    };
                }));
                var rfocusable = /^(?:input|select|textarea|button)$/i, rclickable = /^(?:a|area)$/i;
                function stripAndCollapse(value) {
                    return (value.match(rnothtmlwhite) || []).join(" ");
                }
                function getClass(elem) {
                    return elem.getAttribute && elem.getAttribute("class") || "";
                }
                function classesToArray(value) {
                    return Array.isArray(value) ? value : "string" == typeof value && value.match(rnothtmlwhite) || [];
                }
                jQuery.fn.extend({
                    prop: function(name, value) {
                        return access(this, jQuery.prop, name, value, arguments.length > 1);
                    },
                    removeProp: function(name) {
                        return this.each((function() {
                            delete this[jQuery.propFix[name] || name];
                        }));
                    }
                }), jQuery.extend({
                    prop: function(elem, name, value) {
                        var ret, hooks, nType = elem.nodeType;
                        if (3 !== nType && 8 !== nType && 2 !== nType) return 1 === nType && jQuery.isXMLDoc(elem) || (name = jQuery.propFix[name] || name, 
                        hooks = jQuery.propHooks[name]), void 0 !== value ? hooks && "set" in hooks && void 0 !== (ret = hooks.set(elem, value, name)) ? ret : elem[name] = value : hooks && "get" in hooks && null !== (ret = hooks.get(elem, name)) ? ret : elem[name];
                    },
                    propHooks: {
                        tabIndex: {
                            get: function(elem) {
                                var tabindex = jQuery.find.attr(elem, "tabindex");
                                return tabindex ? parseInt(tabindex, 10) : rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ? 0 : -1;
                            }
                        }
                    },
                    propFix: {
                        for: "htmlFor",
                        class: "className"
                    }
                }), support.optSelected || (jQuery.propHooks.selected = {
                    get: function(elem) {
                        var parent = elem.parentNode;
                        return parent && parent.parentNode && parent.parentNode.selectedIndex, null;
                    },
                    set: function(elem) {
                        var parent = elem.parentNode;
                        parent && (parent.selectedIndex, parent.parentNode && parent.parentNode.selectedIndex);
                    }
                }), jQuery.each([ "tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable" ], (function() {
                    jQuery.propFix[this.toLowerCase()] = this;
                })), jQuery.fn.extend({
                    addClass: function(value) {
                        var classes, elem, cur, curValue, clazz, j, finalValue, i = 0;
                        if (isFunction(value)) return this.each((function(j) {
                            jQuery(this).addClass(value.call(this, j, getClass(this)));
                        }));
                        if ((classes = classesToArray(value)).length) for (;elem = this[i++]; ) if (curValue = getClass(elem), 
                        cur = 1 === elem.nodeType && " " + stripAndCollapse(curValue) + " ") {
                            for (j = 0; clazz = classes[j++]; ) cur.indexOf(" " + clazz + " ") < 0 && (cur += clazz + " ");
                            curValue !== (finalValue = stripAndCollapse(cur)) && elem.setAttribute("class", finalValue);
                        }
                        return this;
                    },
                    removeClass: function(value) {
                        var classes, elem, cur, curValue, clazz, j, finalValue, i = 0;
                        if (isFunction(value)) return this.each((function(j) {
                            jQuery(this).removeClass(value.call(this, j, getClass(this)));
                        }));
                        if (!arguments.length) return this.attr("class", "");
                        if ((classes = classesToArray(value)).length) for (;elem = this[i++]; ) if (curValue = getClass(elem), 
                        cur = 1 === elem.nodeType && " " + stripAndCollapse(curValue) + " ") {
                            for (j = 0; clazz = classes[j++]; ) for (;cur.indexOf(" " + clazz + " ") > -1; ) cur = cur.replace(" " + clazz + " ", " ");
                            curValue !== (finalValue = stripAndCollapse(cur)) && elem.setAttribute("class", finalValue);
                        }
                        return this;
                    },
                    toggleClass: function(value, stateVal) {
                        var type = typeof value, isValidValue = "string" === type || Array.isArray(value);
                        return "boolean" == typeof stateVal && isValidValue ? stateVal ? this.addClass(value) : this.removeClass(value) : isFunction(value) ? this.each((function(i) {
                            jQuery(this).toggleClass(value.call(this, i, getClass(this), stateVal), stateVal);
                        })) : this.each((function() {
                            var className, i, self, classNames;
                            if (isValidValue) for (i = 0, self = jQuery(this), classNames = classesToArray(value); className = classNames[i++]; ) self.hasClass(className) ? self.removeClass(className) : self.addClass(className); else void 0 !== value && "boolean" !== type || ((className = getClass(this)) && dataPriv.set(this, "__className__", className), 
                            this.setAttribute && this.setAttribute("class", className || !1 === value ? "" : dataPriv.get(this, "__className__") || ""));
                        }));
                    },
                    hasClass: function(selector) {
                        var className, elem, i = 0;
                        for (className = " " + selector + " "; elem = this[i++]; ) if (1 === elem.nodeType && (" " + stripAndCollapse(getClass(elem)) + " ").indexOf(className) > -1) return !0;
                        return !1;
                    }
                });
                var rreturn = /\r/g;
                jQuery.fn.extend({
                    val: function(value) {
                        var hooks, ret, valueIsFunction, elem = this[0];
                        return arguments.length ? (valueIsFunction = isFunction(value), this.each((function(i) {
                            var val;
                            1 === this.nodeType && (null == (val = valueIsFunction ? value.call(this, i, jQuery(this).val()) : value) ? val = "" : "number" == typeof val ? val += "" : Array.isArray(val) && (val = jQuery.map(val, (function(value) {
                                return null == value ? "" : value + "";
                            }))), (hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()]) && "set" in hooks && void 0 !== hooks.set(this, val, "value") || (this.value = val));
                        }))) : elem ? (hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()]) && "get" in hooks && void 0 !== (ret = hooks.get(elem, "value")) ? ret : "string" == typeof (ret = elem.value) ? ret.replace(rreturn, "") : null == ret ? "" : ret : void 0;
                    }
                }), jQuery.extend({
                    valHooks: {
                        option: {
                            get: function(elem) {
                                var val = jQuery.find.attr(elem, "value");
                                return null != val ? val : stripAndCollapse(jQuery.text(elem));
                            }
                        },
                        select: {
                            get: function(elem) {
                                var value, option, i, options = elem.options, index = elem.selectedIndex, one = "select-one" === elem.type, values = one ? null : [], max = one ? index + 1 : options.length;
                                for (i = index < 0 ? max : one ? index : 0; i < max; i++) if (((option = options[i]).selected || i === index) && !option.disabled && (!option.parentNode.disabled || !nodeName(option.parentNode, "optgroup"))) {
                                    if (value = jQuery(option).val(), one) return value;
                                    values.push(value);
                                }
                                return values;
                            },
                            set: function(elem, value) {
                                for (var optionSet, option, options = elem.options, values = jQuery.makeArray(value), i = options.length; i--; ) ((option = options[i]).selected = jQuery.inArray(jQuery.valHooks.option.get(option), values) > -1) && (optionSet = !0);
                                return optionSet || (elem.selectedIndex = -1), values;
                            }
                        }
                    }
                }), jQuery.each([ "radio", "checkbox" ], (function() {
                    jQuery.valHooks[this] = {
                        set: function(elem, value) {
                            if (Array.isArray(value)) return elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1;
                        }
                    }, support.checkOn || (jQuery.valHooks[this].get = function(elem) {
                        return null === elem.getAttribute("value") ? "on" : elem.value;
                    });
                })), support.focusin = "onfocusin" in window;
                var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, stopPropagationCallback = function(e) {
                    e.stopPropagation();
                };
                jQuery.extend(jQuery.event, {
                    trigger: function(event, data, elem, onlyHandlers) {
                        var i, cur, tmp, bubbleType, ontype, handle, special, lastElement, eventPath = [ elem || document ], type = hasOwn.call(event, "type") ? event.type : event, namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
                        if (cur = lastElement = tmp = elem = elem || document, 3 !== elem.nodeType && 8 !== elem.nodeType && !rfocusMorph.test(type + jQuery.event.triggered) && (type.indexOf(".") > -1 && (namespaces = type.split("."), 
                        type = namespaces.shift(), namespaces.sort()), ontype = type.indexOf(":") < 0 && "on" + type, 
                        (event = event[jQuery.expando] ? event : new jQuery.Event(type, "object" == typeof event && event)).isTrigger = onlyHandlers ? 2 : 3, 
                        event.namespace = namespaces.join("."), event.rnamespace = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, 
                        event.result = void 0, event.target || (event.target = elem), data = null == data ? [ event ] : jQuery.makeArray(data, [ event ]), 
                        special = jQuery.event.special[type] || {}, onlyHandlers || !special.trigger || !1 !== special.trigger.apply(elem, data))) {
                            if (!onlyHandlers && !special.noBubble && !isWindow(elem)) {
                                for (bubbleType = special.delegateType || type, rfocusMorph.test(bubbleType + type) || (cur = cur.parentNode); cur; cur = cur.parentNode) eventPath.push(cur), 
                                tmp = cur;
                                tmp === (elem.ownerDocument || document) && eventPath.push(tmp.defaultView || tmp.parentWindow || window);
                            }
                            for (i = 0; (cur = eventPath[i++]) && !event.isPropagationStopped(); ) lastElement = cur, 
                            event.type = i > 1 ? bubbleType : special.bindType || type, (handle = (dataPriv.get(cur, "events") || Object.create(null))[event.type] && dataPriv.get(cur, "handle")) && handle.apply(cur, data), 
                            (handle = ontype && cur[ontype]) && handle.apply && acceptData(cur) && (event.result = handle.apply(cur, data), 
                            !1 === event.result && event.preventDefault());
                            return event.type = type, onlyHandlers || event.isDefaultPrevented() || special._default && !1 !== special._default.apply(eventPath.pop(), data) || !acceptData(elem) || ontype && isFunction(elem[type]) && !isWindow(elem) && ((tmp = elem[ontype]) && (elem[ontype] = null), 
                            jQuery.event.triggered = type, event.isPropagationStopped() && lastElement.addEventListener(type, stopPropagationCallback), 
                            elem[type](), event.isPropagationStopped() && lastElement.removeEventListener(type, stopPropagationCallback), 
                            jQuery.event.triggered = void 0, tmp && (elem[ontype] = tmp)), event.result;
                        }
                    },
                    simulate: function(type, elem, event) {
                        var e = jQuery.extend(new jQuery.Event, event, {
                            type,
                            isSimulated: !0
                        });
                        jQuery.event.trigger(e, null, elem);
                    }
                }), jQuery.fn.extend({
                    trigger: function(type, data) {
                        return this.each((function() {
                            jQuery.event.trigger(type, data, this);
                        }));
                    },
                    triggerHandler: function(type, data) {
                        var elem = this[0];
                        if (elem) return jQuery.event.trigger(type, data, elem, !0);
                    }
                }), support.focusin || jQuery.each({
                    focus: "focusin",
                    blur: "focusout"
                }, (function(orig, fix) {
                    var handler = function(event) {
                        jQuery.event.simulate(fix, event.target, jQuery.event.fix(event));
                    };
                    jQuery.event.special[fix] = {
                        setup: function() {
                            var doc = this.ownerDocument || this.document || this, attaches = dataPriv.access(doc, fix);
                            attaches || doc.addEventListener(orig, handler, !0), dataPriv.access(doc, fix, (attaches || 0) + 1);
                        },
                        teardown: function() {
                            var doc = this.ownerDocument || this.document || this, attaches = dataPriv.access(doc, fix) - 1;
                            attaches ? dataPriv.access(doc, fix, attaches) : (doc.removeEventListener(orig, handler, !0), 
                            dataPriv.remove(doc, fix));
                        }
                    };
                }));
                var location = window.location, nonce = {
                    guid: Date.now()
                }, rquery = /\?/;
                jQuery.parseXML = function(data) {
                    var xml, parserErrorElem;
                    if (!data || "string" != typeof data) return null;
                    try {
                        xml = (new window.DOMParser).parseFromString(data, "text/xml");
                    } catch (e) {}
                    return parserErrorElem = xml && xml.getElementsByTagName("parsererror")[0], xml && !parserErrorElem || jQuery.error("Invalid XML: " + (parserErrorElem ? jQuery.map(parserErrorElem.childNodes, (function(el) {
                        return el.textContent;
                    })).join("\n") : data)), xml;
                };
                var rbracket = /\[\]$/, rCRLF = /\r?\n/g, rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, rsubmittable = /^(?:input|select|textarea|keygen)/i;
                function buildParams(prefix, obj, traditional, add) {
                    var name;
                    if (Array.isArray(obj)) jQuery.each(obj, (function(i, v) {
                        traditional || rbracket.test(prefix) ? add(prefix, v) : buildParams(prefix + "[" + ("object" == typeof v && null != v ? i : "") + "]", v, traditional, add);
                    })); else if (traditional || "object" !== toType(obj)) add(prefix, obj); else for (name in obj) buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
                }
                jQuery.param = function(a, traditional) {
                    var prefix, s = [], add = function(key, valueOrFunction) {
                        var value = isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;
                        s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(null == value ? "" : value);
                    };
                    if (null == a) return "";
                    if (Array.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) jQuery.each(a, (function() {
                        add(this.name, this.value);
                    })); else for (prefix in a) buildParams(prefix, a[prefix], traditional, add);
                    return s.join("&");
                }, jQuery.fn.extend({
                    serialize: function() {
                        return jQuery.param(this.serializeArray());
                    },
                    serializeArray: function() {
                        return this.map((function() {
                            var elements = jQuery.prop(this, "elements");
                            return elements ? jQuery.makeArray(elements) : this;
                        })).filter((function() {
                            var type = this.type;
                            return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
                        })).map((function(_i, elem) {
                            var val = jQuery(this).val();
                            return null == val ? null : Array.isArray(val) ? jQuery.map(val, (function(val) {
                                return {
                                    name: elem.name,
                                    value: val.replace(rCRLF, "\r\n")
                                };
                            })) : {
                                name: elem.name,
                                value: val.replace(rCRLF, "\r\n")
                            };
                        })).get();
                    }
                });
                var r20 = /%20/g, rhash = /#.*$/, rantiCache = /([?&])_=[^&]*/, rheaders = /^(.*?):[ \t]*([^\r\n]*)$/gm, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, prefilters = {}, transports = {}, allTypes = "*/".concat("*"), originAnchor = document.createElement("a");
                function addToPrefiltersOrTransports(structure) {
                    return function(dataTypeExpression, func) {
                        "string" != typeof dataTypeExpression && (func = dataTypeExpression, dataTypeExpression = "*");
                        var dataType, i = 0, dataTypes = dataTypeExpression.toLowerCase().match(rnothtmlwhite) || [];
                        if (isFunction(func)) for (;dataType = dataTypes[i++]; ) "+" === dataType[0] ? (dataType = dataType.slice(1) || "*", 
                        (structure[dataType] = structure[dataType] || []).unshift(func)) : (structure[dataType] = structure[dataType] || []).push(func);
                    };
                }
                function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
                    var inspected = {}, seekingTransport = structure === transports;
                    function inspect(dataType) {
                        var selected;
                        return inspected[dataType] = !0, jQuery.each(structure[dataType] || [], (function(_, prefilterOrFactory) {
                            var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
                            return "string" != typeof dataTypeOrTransport || seekingTransport || inspected[dataTypeOrTransport] ? seekingTransport ? !(selected = dataTypeOrTransport) : void 0 : (options.dataTypes.unshift(dataTypeOrTransport), 
                            inspect(dataTypeOrTransport), !1);
                        })), selected;
                    }
                    return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
                }
                function ajaxExtend(target, src) {
                    var key, deep, flatOptions = jQuery.ajaxSettings.flatOptions || {};
                    for (key in src) void 0 !== src[key] && ((flatOptions[key] ? target : deep || (deep = {}))[key] = src[key]);
                    return deep && jQuery.extend(!0, target, deep), target;
                }
                originAnchor.href = location.href, jQuery.extend({
                    active: 0,
                    lastModified: {},
                    etag: {},
                    ajaxSettings: {
                        url: location.href,
                        type: "GET",
                        isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(location.protocol),
                        global: !0,
                        processData: !0,
                        async: !0,
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        accepts: {
                            "*": allTypes,
                            text: "text/plain",
                            html: "text/html",
                            xml: "application/xml, text/xml",
                            json: "application/json, text/javascript"
                        },
                        contents: {
                            xml: /\bxml\b/,
                            html: /\bhtml/,
                            json: /\bjson\b/
                        },
                        responseFields: {
                            xml: "responseXML",
                            text: "responseText",
                            json: "responseJSON"
                        },
                        converters: {
                            "* text": String,
                            "text html": !0,
                            "text json": JSON.parse,
                            "text xml": jQuery.parseXML
                        },
                        flatOptions: {
                            url: !0,
                            context: !0
                        }
                    },
                    ajaxSetup: function(target, settings) {
                        return settings ? ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) : ajaxExtend(jQuery.ajaxSettings, target);
                    },
                    ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
                    ajaxTransport: addToPrefiltersOrTransports(transports),
                    ajax: function(url, options) {
                        "object" == typeof url && (options = url, url = void 0), options = options || {};
                        var transport, cacheURL, responseHeadersString, responseHeaders, timeoutTimer, urlAnchor, completed, fireGlobals, i, uncached, s = jQuery.ajaxSetup({}, options), callbackContext = s.context || s, globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event, deferred = jQuery.Deferred(), completeDeferred = jQuery.Callbacks("once memory"), statusCode = s.statusCode || {}, requestHeaders = {}, requestHeadersNames = {}, strAbort = "canceled", jqXHR = {
                            readyState: 0,
                            getResponseHeader: function(key) {
                                var match;
                                if (completed) {
                                    if (!responseHeaders) for (responseHeaders = {}; match = rheaders.exec(responseHeadersString); ) responseHeaders[match[1].toLowerCase() + " "] = (responseHeaders[match[1].toLowerCase() + " "] || []).concat(match[2]);
                                    match = responseHeaders[key.toLowerCase() + " "];
                                }
                                return null == match ? null : match.join(", ");
                            },
                            getAllResponseHeaders: function() {
                                return completed ? responseHeadersString : null;
                            },
                            setRequestHeader: function(name, value) {
                                return null == completed && (name = requestHeadersNames[name.toLowerCase()] = requestHeadersNames[name.toLowerCase()] || name, 
                                requestHeaders[name] = value), this;
                            },
                            overrideMimeType: function(type) {
                                return null == completed && (s.mimeType = type), this;
                            },
                            statusCode: function(map) {
                                var code;
                                if (map) if (completed) jqXHR.always(map[jqXHR.status]); else for (code in map) statusCode[code] = [ statusCode[code], map[code] ];
                                return this;
                            },
                            abort: function(statusText) {
                                var finalText = statusText || strAbort;
                                return transport && transport.abort(finalText), done(0, finalText), this;
                            }
                        };
                        if (deferred.promise(jqXHR), s.url = ((url || s.url || location.href) + "").replace(rprotocol, location.protocol + "//"), 
                        s.type = options.method || options.type || s.method || s.type, s.dataTypes = (s.dataType || "*").toLowerCase().match(rnothtmlwhite) || [ "" ], 
                        null == s.crossDomain) {
                            urlAnchor = document.createElement("a");
                            try {
                                urlAnchor.href = s.url, urlAnchor.href = urlAnchor.href, s.crossDomain = originAnchor.protocol + "//" + originAnchor.host != urlAnchor.protocol + "//" + urlAnchor.host;
                            } catch (e) {
                                s.crossDomain = !0;
                            }
                        }
                        if (s.data && s.processData && "string" != typeof s.data && (s.data = jQuery.param(s.data, s.traditional)), 
                        inspectPrefiltersOrTransports(prefilters, s, options, jqXHR), completed) return jqXHR;
                        for (i in (fireGlobals = jQuery.event && s.global) && 0 == jQuery.active++ && jQuery.event.trigger("ajaxStart"), 
                        s.type = s.type.toUpperCase(), s.hasContent = !rnoContent.test(s.type), cacheURL = s.url.replace(rhash, ""), 
                        s.hasContent ? s.data && s.processData && 0 === (s.contentType || "").indexOf("application/x-www-form-urlencoded") && (s.data = s.data.replace(r20, "+")) : (uncached = s.url.slice(cacheURL.length), 
                        s.data && (s.processData || "string" == typeof s.data) && (cacheURL += (rquery.test(cacheURL) ? "&" : "?") + s.data, 
                        delete s.data), !1 === s.cache && (cacheURL = cacheURL.replace(rantiCache, "$1"), 
                        uncached = (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce.guid++ + uncached), 
                        s.url = cacheURL + uncached), s.ifModified && (jQuery.lastModified[cacheURL] && jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]), 
                        jQuery.etag[cacheURL] && jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL])), 
                        (s.data && s.hasContent && !1 !== s.contentType || options.contentType) && jqXHR.setRequestHeader("Content-Type", s.contentType), 
                        jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + ("*" !== s.dataTypes[0] ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]), 
                        s.headers) jqXHR.setRequestHeader(i, s.headers[i]);
                        if (s.beforeSend && (!1 === s.beforeSend.call(callbackContext, jqXHR, s) || completed)) return jqXHR.abort();
                        if (strAbort = "abort", completeDeferred.add(s.complete), jqXHR.done(s.success), 
                        jqXHR.fail(s.error), transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR)) {
                            if (jqXHR.readyState = 1, fireGlobals && globalEventContext.trigger("ajaxSend", [ jqXHR, s ]), 
                            completed) return jqXHR;
                            s.async && s.timeout > 0 && (timeoutTimer = window.setTimeout((function() {
                                jqXHR.abort("timeout");
                            }), s.timeout));
                            try {
                                completed = !1, transport.send(requestHeaders, done);
                            } catch (e) {
                                if (completed) throw e;
                                done(-1, e);
                            }
                        } else done(-1, "No Transport");
                        function done(status, nativeStatusText, responses, headers) {
                            var isSuccess, success, error, response, modified, statusText = nativeStatusText;
                            completed || (completed = !0, timeoutTimer && window.clearTimeout(timeoutTimer), 
                            transport = void 0, responseHeadersString = headers || "", jqXHR.readyState = status > 0 ? 4 : 0, 
                            isSuccess = status >= 200 && status < 300 || 304 === status, responses && (response = function(s, jqXHR, responses) {
                                for (var ct, type, finalDataType, firstDataType, contents = s.contents, dataTypes = s.dataTypes; "*" === dataTypes[0]; ) dataTypes.shift(), 
                                void 0 === ct && (ct = s.mimeType || jqXHR.getResponseHeader("Content-Type"));
                                if (ct) for (type in contents) if (contents[type] && contents[type].test(ct)) {
                                    dataTypes.unshift(type);
                                    break;
                                }
                                if (dataTypes[0] in responses) finalDataType = dataTypes[0]; else {
                                    for (type in responses) {
                                        if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
                                            finalDataType = type;
                                            break;
                                        }
                                        firstDataType || (firstDataType = type);
                                    }
                                    finalDataType = finalDataType || firstDataType;
                                }
                                if (finalDataType) return finalDataType !== dataTypes[0] && dataTypes.unshift(finalDataType), 
                                responses[finalDataType];
                            }(s, jqXHR, responses)), !isSuccess && jQuery.inArray("script", s.dataTypes) > -1 && jQuery.inArray("json", s.dataTypes) < 0 && (s.converters["text script"] = function() {}), 
                            response = function(s, response, jqXHR, isSuccess) {
                                var conv2, current, conv, tmp, prev, converters = {}, dataTypes = s.dataTypes.slice();
                                if (dataTypes[1]) for (conv in s.converters) converters[conv.toLowerCase()] = s.converters[conv];
                                for (current = dataTypes.shift(); current; ) if (s.responseFields[current] && (jqXHR[s.responseFields[current]] = response), 
                                !prev && isSuccess && s.dataFilter && (response = s.dataFilter(response, s.dataType)), 
                                prev = current, current = dataTypes.shift()) if ("*" === current) current = prev; else if ("*" !== prev && prev !== current) {
                                    if (!(conv = converters[prev + " " + current] || converters["* " + current])) for (conv2 in converters) if ((tmp = conv2.split(" "))[1] === current && (conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]])) {
                                        !0 === conv ? conv = converters[conv2] : !0 !== converters[conv2] && (current = tmp[0], 
                                        dataTypes.unshift(tmp[1]));
                                        break;
                                    }
                                    if (!0 !== conv) if (conv && s.throws) response = conv(response); else try {
                                        response = conv(response);
                                    } catch (e) {
                                        return {
                                            state: "parsererror",
                                            error: conv ? e : "No conversion from " + prev + " to " + current
                                        };
                                    }
                                }
                                return {
                                    state: "success",
                                    data: response
                                };
                            }(s, response, jqXHR, isSuccess), isSuccess ? (s.ifModified && ((modified = jqXHR.getResponseHeader("Last-Modified")) && (jQuery.lastModified[cacheURL] = modified), 
                            (modified = jqXHR.getResponseHeader("etag")) && (jQuery.etag[cacheURL] = modified)), 
                            204 === status || "HEAD" === s.type ? statusText = "nocontent" : 304 === status ? statusText = "notmodified" : (statusText = response.state, 
                            success = response.data, isSuccess = !(error = response.error))) : (error = statusText, 
                            !status && statusText || (statusText = "error", status < 0 && (status = 0))), jqXHR.status = status, 
                            jqXHR.statusText = (nativeStatusText || statusText) + "", isSuccess ? deferred.resolveWith(callbackContext, [ success, statusText, jqXHR ]) : deferred.rejectWith(callbackContext, [ jqXHR, statusText, error ]), 
                            jqXHR.statusCode(statusCode), statusCode = void 0, fireGlobals && globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [ jqXHR, s, isSuccess ? success : error ]), 
                            completeDeferred.fireWith(callbackContext, [ jqXHR, statusText ]), fireGlobals && (globalEventContext.trigger("ajaxComplete", [ jqXHR, s ]), 
                            --jQuery.active || jQuery.event.trigger("ajaxStop")));
                        }
                        return jqXHR;
                    },
                    getJSON: function(url, data, callback) {
                        return jQuery.get(url, data, callback, "json");
                    },
                    getScript: function(url, callback) {
                        return jQuery.get(url, void 0, callback, "script");
                    }
                }), jQuery.each([ "get", "post" ], (function(_i, method) {
                    jQuery[method] = function(url, data, callback, type) {
                        return isFunction(data) && (type = type || callback, callback = data, data = void 0), 
                        jQuery.ajax(jQuery.extend({
                            url,
                            type: method,
                            dataType: type,
                            data,
                            success: callback
                        }, jQuery.isPlainObject(url) && url));
                    };
                })), jQuery.ajaxPrefilter((function(s) {
                    var i;
                    for (i in s.headers) "content-type" === i.toLowerCase() && (s.contentType = s.headers[i] || "");
                })), jQuery._evalUrl = function(url, options, doc) {
                    return jQuery.ajax({
                        url,
                        type: "GET",
                        dataType: "script",
                        cache: !0,
                        async: !1,
                        global: !1,
                        converters: {
                            "text script": function() {}
                        },
                        dataFilter: function(response) {
                            jQuery.globalEval(response, options, doc);
                        }
                    });
                }, jQuery.fn.extend({
                    wrapAll: function(html) {
                        var wrap;
                        return this[0] && (isFunction(html) && (html = html.call(this[0])), wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(!0), 
                        this[0].parentNode && wrap.insertBefore(this[0]), wrap.map((function() {
                            for (var elem = this; elem.firstElementChild; ) elem = elem.firstElementChild;
                            return elem;
                        })).append(this)), this;
                    },
                    wrapInner: function(html) {
                        return isFunction(html) ? this.each((function(i) {
                            jQuery(this).wrapInner(html.call(this, i));
                        })) : this.each((function() {
                            var self = jQuery(this), contents = self.contents();
                            contents.length ? contents.wrapAll(html) : self.append(html);
                        }));
                    },
                    wrap: function(html) {
                        var htmlIsFunction = isFunction(html);
                        return this.each((function(i) {
                            jQuery(this).wrapAll(htmlIsFunction ? html.call(this, i) : html);
                        }));
                    },
                    unwrap: function(selector) {
                        return this.parent(selector).not("body").each((function() {
                            jQuery(this).replaceWith(this.childNodes);
                        })), this;
                    }
                }), jQuery.expr.pseudos.hidden = function(elem) {
                    return !jQuery.expr.pseudos.visible(elem);
                }, jQuery.expr.pseudos.visible = function(elem) {
                    return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
                }, jQuery.ajaxSettings.xhr = function() {
                    try {
                        return new window.XMLHttpRequest;
                    } catch (e) {}
                };
                var xhrSuccessStatus = {
                    0: 200,
                    1223: 204
                }, xhrSupported = jQuery.ajaxSettings.xhr();
                support.cors = !!xhrSupported && "withCredentials" in xhrSupported, support.ajax = xhrSupported = !!xhrSupported, 
                jQuery.ajaxTransport((function(options) {
                    var callback, errorCallback;
                    if (support.cors || xhrSupported && !options.crossDomain) return {
                        send: function(headers, complete) {
                            var i, xhr = options.xhr();
                            if (xhr.open(options.type, options.url, options.async, options.username, options.password), 
                            options.xhrFields) for (i in options.xhrFields) xhr[i] = options.xhrFields[i];
                            for (i in options.mimeType && xhr.overrideMimeType && xhr.overrideMimeType(options.mimeType), 
                            options.crossDomain || headers["X-Requested-With"] || (headers["X-Requested-With"] = "XMLHttpRequest"), 
                            headers) xhr.setRequestHeader(i, headers[i]);
                            callback = function(type) {
                                return function() {
                                    callback && (callback = errorCallback = xhr.onload = xhr.onerror = xhr.onabort = xhr.ontimeout = xhr.onreadystatechange = null, 
                                    "abort" === type ? xhr.abort() : "error" === type ? "number" != typeof xhr.status ? complete(0, "error") : complete(xhr.status, xhr.statusText) : complete(xhrSuccessStatus[xhr.status] || xhr.status, xhr.statusText, "text" !== (xhr.responseType || "text") || "string" != typeof xhr.responseText ? {
                                        binary: xhr.response
                                    } : {
                                        text: xhr.responseText
                                    }, xhr.getAllResponseHeaders()));
                                };
                            }, xhr.onload = callback(), errorCallback = xhr.onerror = xhr.ontimeout = callback("error"), 
                            void 0 !== xhr.onabort ? xhr.onabort = errorCallback : xhr.onreadystatechange = function() {
                                4 === xhr.readyState && window.setTimeout((function() {
                                    callback && errorCallback();
                                }));
                            }, callback = callback("abort");
                            try {
                                xhr.send(options.hasContent && options.data || null);
                            } catch (e) {
                                if (callback) throw e;
                            }
                        },
                        abort: function() {
                            callback && callback();
                        }
                    };
                })), jQuery.ajaxPrefilter((function(s) {
                    s.crossDomain && (s.contents.script = !1);
                })), jQuery.ajaxSetup({
                    accepts: {
                        script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
                    },
                    contents: {
                        script: /\b(?:java|ecma)script\b/
                    },
                    converters: {
                        "text script": function(text) {
                            return jQuery.globalEval(text), text;
                        }
                    }
                }), jQuery.ajaxPrefilter("script", (function(s) {
                    void 0 === s.cache && (s.cache = !1), s.crossDomain && (s.type = "GET");
                })), jQuery.ajaxTransport("script", (function(s) {
                    var script, callback;
                    if (s.crossDomain || s.scriptAttrs) return {
                        send: function(_, complete) {
                            script = jQuery("<script>").attr(s.scriptAttrs || {}).prop({
                                charset: s.scriptCharset,
                                src: s.url
                            }).on("load error", callback = function(evt) {
                                script.remove(), callback = null, evt && complete("error" === evt.type ? 404 : 200, evt.type);
                            }), document.head.appendChild(script[0]);
                        },
                        abort: function() {
                            callback && callback();
                        }
                    };
                }));
                var body, oldCallbacks = [], rjsonp = /(=)\?(?=&|$)|\?\?/;
                jQuery.ajaxSetup({
                    jsonp: "callback",
                    jsonpCallback: function() {
                        var callback = oldCallbacks.pop() || jQuery.expando + "_" + nonce.guid++;
                        return this[callback] = !0, callback;
                    }
                }), jQuery.ajaxPrefilter("json jsonp", (function(s, originalSettings, jqXHR) {
                    var callbackName, overwritten, responseContainer, jsonProp = !1 !== s.jsonp && (rjsonp.test(s.url) ? "url" : "string" == typeof s.data && 0 === (s.contentType || "").indexOf("application/x-www-form-urlencoded") && rjsonp.test(s.data) && "data");
                    if (jsonProp || "jsonp" === s.dataTypes[0]) return callbackName = s.jsonpCallback = isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback, 
                    jsonProp ? s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName) : !1 !== s.jsonp && (s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName), 
                    s.converters["script json"] = function() {
                        return responseContainer || jQuery.error(callbackName + " was not called"), responseContainer[0];
                    }, s.dataTypes[0] = "json", overwritten = window[callbackName], window[callbackName] = function() {
                        responseContainer = arguments;
                    }, jqXHR.always((function() {
                        void 0 === overwritten ? jQuery(window).removeProp(callbackName) : window[callbackName] = overwritten, 
                        s[callbackName] && (s.jsonpCallback = originalSettings.jsonpCallback, oldCallbacks.push(callbackName)), 
                        responseContainer && isFunction(overwritten) && overwritten(responseContainer[0]), 
                        responseContainer = overwritten = void 0;
                    })), "script";
                })), support.createHTMLDocument = ((body = document.implementation.createHTMLDocument("").body).innerHTML = "<form></form><form></form>", 
                2 === body.childNodes.length), jQuery.parseHTML = function(data, context, keepScripts) {
                    return "string" != typeof data ? [] : ("boolean" == typeof context && (keepScripts = context, 
                    context = !1), context || (support.createHTMLDocument ? ((base = (context = document.implementation.createHTMLDocument("")).createElement("base")).href = document.location.href, 
                    context.head.appendChild(base)) : context = document), scripts = !keepScripts && [], 
                    (parsed = rsingleTag.exec(data)) ? [ context.createElement(parsed[1]) ] : (parsed = buildFragment([ data ], context, scripts), 
                    scripts && scripts.length && jQuery(scripts).remove(), jQuery.merge([], parsed.childNodes)));
                    var base, parsed, scripts;
                }, jQuery.fn.load = function(url, params, callback) {
                    var selector, type, response, self = this, off = url.indexOf(" ");
                    return off > -1 && (selector = stripAndCollapse(url.slice(off)), url = url.slice(0, off)), 
                    isFunction(params) ? (callback = params, params = void 0) : params && "object" == typeof params && (type = "POST"), 
                    self.length > 0 && jQuery.ajax({
                        url,
                        type: type || "GET",
                        dataType: "html",
                        data: params
                    }).done((function(responseText) {
                        response = arguments, self.html(selector ? jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) : responseText);
                    })).always(callback && function(jqXHR, status) {
                        self.each((function() {
                            callback.apply(this, response || [ jqXHR.responseText, status, jqXHR ]);
                        }));
                    }), this;
                }, jQuery.expr.pseudos.animated = function(elem) {
                    return jQuery.grep(jQuery.timers, (function(fn) {
                        return elem === fn.elem;
                    })).length;
                }, jQuery.offset = {
                    setOffset: function(elem, options, i) {
                        var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, position = jQuery.css(elem, "position"), curElem = jQuery(elem), props = {};
                        "static" === position && (elem.style.position = "relative"), curOffset = curElem.offset(), 
                        curCSSTop = jQuery.css(elem, "top"), curCSSLeft = jQuery.css(elem, "left"), ("absolute" === position || "fixed" === position) && (curCSSTop + curCSSLeft).indexOf("auto") > -1 ? (curTop = (curPosition = curElem.position()).top, 
                        curLeft = curPosition.left) : (curTop = parseFloat(curCSSTop) || 0, curLeft = parseFloat(curCSSLeft) || 0), 
                        isFunction(options) && (options = options.call(elem, i, jQuery.extend({}, curOffset))), 
                        null != options.top && (props.top = options.top - curOffset.top + curTop), null != options.left && (props.left = options.left - curOffset.left + curLeft), 
                        "using" in options ? options.using.call(elem, props) : curElem.css(props);
                    }
                }, jQuery.fn.extend({
                    offset: function(options) {
                        if (arguments.length) return void 0 === options ? this : this.each((function(i) {
                            jQuery.offset.setOffset(this, options, i);
                        }));
                        var rect, win, elem = this[0];
                        return elem ? elem.getClientRects().length ? (rect = elem.getBoundingClientRect(), 
                        win = elem.ownerDocument.defaultView, {
                            top: rect.top + win.pageYOffset,
                            left: rect.left + win.pageXOffset
                        }) : {
                            top: 0,
                            left: 0
                        } : void 0;
                    },
                    position: function() {
                        if (this[0]) {
                            var offsetParent, offset, doc, elem = this[0], parentOffset = {
                                top: 0,
                                left: 0
                            };
                            if ("fixed" === jQuery.css(elem, "position")) offset = elem.getBoundingClientRect(); else {
                                for (offset = this.offset(), doc = elem.ownerDocument, offsetParent = elem.offsetParent || doc.documentElement; offsetParent && (offsetParent === doc.body || offsetParent === doc.documentElement) && "static" === jQuery.css(offsetParent, "position"); ) offsetParent = offsetParent.parentNode;
                                offsetParent && offsetParent !== elem && 1 === offsetParent.nodeType && ((parentOffset = jQuery(offsetParent).offset()).top += jQuery.css(offsetParent, "borderTopWidth", !0), 
                                parentOffset.left += jQuery.css(offsetParent, "borderLeftWidth", !0));
                            }
                            return {
                                top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", !0),
                                left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", !0)
                            };
                        }
                    },
                    offsetParent: function() {
                        return this.map((function() {
                            for (var offsetParent = this.offsetParent; offsetParent && "static" === jQuery.css(offsetParent, "position"); ) offsetParent = offsetParent.offsetParent;
                            return offsetParent || documentElement;
                        }));
                    }
                }), jQuery.each({
                    scrollLeft: "pageXOffset",
                    scrollTop: "pageYOffset"
                }, (function(method, prop) {
                    var top = "pageYOffset" === prop;
                    jQuery.fn[method] = function(val) {
                        return access(this, (function(elem, method, val) {
                            var win;
                            if (isWindow(elem) ? win = elem : 9 === elem.nodeType && (win = elem.defaultView), 
                            void 0 === val) return win ? win[prop] : elem[method];
                            win ? win.scrollTo(top ? win.pageXOffset : val, top ? val : win.pageYOffset) : elem[method] = val;
                        }), method, val, arguments.length);
                    };
                })), jQuery.each([ "top", "left" ], (function(_i, prop) {
                    jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, (function(elem, computed) {
                        if (computed) return computed = curCSS(elem, prop), rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
                    }));
                })), jQuery.each({
                    Height: "height",
                    Width: "width"
                }, (function(name, type) {
                    jQuery.each({
                        padding: "inner" + name,
                        content: type,
                        "": "outer" + name
                    }, (function(defaultExtra, funcName) {
                        jQuery.fn[funcName] = function(margin, value) {
                            var chainable = arguments.length && (defaultExtra || "boolean" != typeof margin), extra = defaultExtra || (!0 === margin || !0 === value ? "margin" : "border");
                            return access(this, (function(elem, type, value) {
                                var doc;
                                return isWindow(elem) ? 0 === funcName.indexOf("outer") ? elem["inner" + name] : elem.document.documentElement["client" + name] : 9 === elem.nodeType ? (doc = elem.documentElement, 
                                Math.max(elem.body["scroll" + name], doc["scroll" + name], elem.body["offset" + name], doc["offset" + name], doc["client" + name])) : void 0 === value ? jQuery.css(elem, type, extra) : jQuery.style(elem, type, value, extra);
                            }), type, chainable ? margin : void 0, chainable);
                        };
                    }));
                })), jQuery.each([ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], (function(_i, type) {
                    jQuery.fn[type] = function(fn) {
                        return this.on(type, fn);
                    };
                })), jQuery.fn.extend({
                    bind: function(types, data, fn) {
                        return this.on(types, null, data, fn);
                    },
                    unbind: function(types, fn) {
                        return this.off(types, null, fn);
                    },
                    delegate: function(selector, types, data, fn) {
                        return this.on(types, selector, data, fn);
                    },
                    undelegate: function(selector, types, fn) {
                        return 1 === arguments.length ? this.off(selector, "**") : this.off(types, selector || "**", fn);
                    },
                    hover: function(fnOver, fnOut) {
                        return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
                    }
                }), jQuery.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), (function(_i, name) {
                    jQuery.fn[name] = function(data, fn) {
                        return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
                    };
                }));
                var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
                jQuery.proxy = function(fn, context) {
                    var tmp, args, proxy;
                    if ("string" == typeof context && (tmp = fn[context], context = fn, fn = tmp), isFunction(fn)) return args = slice.call(arguments, 2), 
                    proxy = function() {
                        return fn.apply(context || this, args.concat(slice.call(arguments)));
                    }, proxy.guid = fn.guid = fn.guid || jQuery.guid++, proxy;
                }, jQuery.holdReady = function(hold) {
                    hold ? jQuery.readyWait++ : jQuery.ready(!0);
                }, jQuery.isArray = Array.isArray, jQuery.parseJSON = JSON.parse, jQuery.nodeName = nodeName, 
                jQuery.isFunction = isFunction, jQuery.isWindow = isWindow, jQuery.camelCase = camelCase, 
                jQuery.type = toType, jQuery.now = Date.now, jQuery.isNumeric = function(obj) {
                    var type = jQuery.type(obj);
                    return ("number" === type || "string" === type) && !isNaN(obj - parseFloat(obj));
                }, jQuery.trim = function(text) {
                    return null == text ? "" : (text + "").replace(rtrim, "");
                }, void 0 === (__WEBPACK_AMD_DEFINE_RESULT__ = function() {
                    return jQuery;
                }.apply(exports, [])) || (module.exports = __WEBPACK_AMD_DEFINE_RESULT__);
                var _jQuery = window.jQuery, _$ = window.$;
                return jQuery.noConflict = function(deep) {
                    return window.$ === jQuery && (window.$ = _$), deep && window.jQuery === jQuery && (window.jQuery = _jQuery), 
                    jQuery;
                }, void 0 === noGlobal && (window.jQuery = window.$ = jQuery), jQuery;
            }));
        },
        129: module => {
            "use strict";
            module.exports = '/* Breakpoints */\r\n/* Mixins */\r\n/* Remove */\r\n@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap");\r\n.r-m {\r\n  margin: 0 !important;\r\n}\r\n\r\n.r-m-t {\r\n  margin-top: 0 !important;\r\n}\r\n\r\n.r-p-t {\r\n  padding-top: 0 !important;\r\n}\r\n\r\n.r-m-l {\r\n  margin-left: 0 !important;\r\n}\r\n\r\n.r-p-l {\r\n  padding-left: 0 !important;\r\n}\r\n\r\n.r-m-r {\r\n  margin-right: 0 !important;\r\n}\r\n\r\n.r-p-r {\r\n  padding-right: 0 !important;\r\n}\r\n\r\n.r-m-b {\r\n  margin-bottom: 0 !important;\r\n}\r\n\r\n.r-p-b {\r\n  padding-bottom: 0 !important;\r\n}\r\n\r\n.r-b-r {\r\n  border-radius: 0px !important;\r\n}\r\n\r\n.r-boxshadow {\r\n  box-shadow: none !important;\r\n}\r\n\r\n:root {\r\n  /* Patreon Color */\r\n  --patreon: #F96854;\r\n  /* Custom Colors */\r\n  --base-red: #EF3E3A;\r\n  --active-red: #ea0f0a;\r\n  --base-blue: #4da9ff;\r\n  --base-orange: #ff8d4c;\r\n  --base-green: #24D154;\r\n  /* White Colors */\r\n  --base-white: #FAFAFA;\r\n  --white-5: #F0F0F0;\r\n  --white-10: #DCDCDC;\r\n  --white-15: #C8C8C8;\r\n  --white-20: #B4B4B4;\r\n  --white-25: #A0A0A0;\r\n  --white-30: #8C8C8C;\r\n  --white-35: #787878;\r\n  /* Black Colors */\r\n  --base-black: #191919;\r\n  --black-5: #5A5A5A;\r\n  --black-10: #464646;\r\n  --black-15: #323232;\r\n  --black-20: #282828;\r\n  --black-25: #1e1e1e;\r\n  --black-30: #0a0a0a;\r\n}\r\n\r\n.base-white-bg {\r\n  background-color: var(--base-white);\r\n}\r\n\r\n.white-5-bg {\r\n  background-color: var(--white-5);\r\n}\r\n\r\n.white-10-bg {\r\n  background-color: var(--white-10);\r\n}\r\n\r\n.white-15-bg {\r\n  background-color: var(--white-15);\r\n}\r\n\r\n.white-20-bg {\r\n  background-color: var(--white-20);\r\n}\r\n\r\n.white-25-bg {\r\n  background-color: var(--white-25);\r\n}\r\n\r\n.white-30-bg {\r\n  background-color: var(--white-30);\r\n}\r\n\r\n.white-35-bg {\r\n  background-color: var(--white-35);\r\n}\r\n\r\n.base-black-bg {\r\n  background-color: var(--base-black);\r\n}\r\n\r\n.black-5-bg {\r\n  background-color: var(--black-5);\r\n}\r\n\r\n.black-10-bg {\r\n  background-color: var(--black-10);\r\n}\r\n\r\n.black-15-bg {\r\n  background-color: var(--black-15);\r\n}\r\n\r\n.black-20-bg {\r\n  background-color: var(--black-20);\r\n}\r\n\r\n.black-25-bg {\r\n  background-color: var(--black-25);\r\n}\r\n\r\n.black-30-bg {\r\n  background-color: var(--black-30);\r\n}\r\n\r\n.black-35-bg {\r\n  background-color: var(--black-35);\r\n}\r\n\r\n.base-red-bg {\r\n  background-color: var(--base-red);\r\n}\r\n\r\n.active-red-bg {\r\n  background-color: var(--active-red);\r\n}\r\n\r\n.base-orange-bg {\r\n  background-color: var(--base-orange);\r\n}\r\n\r\n.base-blue-bg {\r\n  background-color: var(--base-blue);\r\n}\r\n\r\n.base-green-bg {\r\n  background-color: var(--base-green);\r\n}\r\n\r\n.patreon-bg {\r\n  background-color: var(--patreon);\r\n}\r\n\r\n.txt-blue {\r\n  color: var(--base-blue) !important;\r\n}\r\n\r\n.txt-red {\r\n  color: var(--base-red) !important;\r\n}\r\n\r\n.txt-white {\r\n  color: var(--base-white) !important;\r\n}\r\n\r\ndiv, p, span, a, h1, h2, h3, h4, h5, h6, li, ul, button {\r\n  word-wrap: break-word;\r\n}\r\n\r\n:root {\r\n  --regular: 400;\r\n  --medium: 500;\r\n  --semi-bold: 600;\r\n  --bold: 700;\r\n  --extra-bold: 800;\r\n  --black: 900;\r\n}\r\n\r\n.extension-title {\r\n  font-family: "Poppins", sans-serif;\r\n  font-weight: var(--medium);\r\n  color: var(--base-red);\r\n  font-size: 16px;\r\n  letter-spacing: 0.2px;\r\n}\r\n.extension-txt {\r\n  font-family: "Poppins", sans-serif;\r\n  font-weight: var(--regular);\r\n  color: white;\r\n  font-size: 14px;\r\n}\r\n.extension-txt-indicator {\r\n  font-family: "Poppins", sans-serif;\r\n  font-weight: var(--regular);\r\n  color: var(--white-35);\r\n  font-size: 11px;\r\n}\r\n.extension-description {\r\n  font-family: "Poppins", sans-serif;\r\n  font-weight: var(--medium);\r\n  color: var(--white-10);\r\n  font-size: 13px;\r\n}\r\n.extension-border-bot {\r\n  border-bottom: 1px solid var(--black-10);\r\n}\r\n.extension-border-top {\r\n  border-top: 1px solid var(--black-10);\r\n}\r\n.extension-btn {\r\n  width: 100%;\r\n  margin-top: 10px;\r\n  background: var(--base-red);\r\n  color: var(--base-white);\r\n  padding: 10px 0px;\r\n  border-radius: 2px;\r\n  font-family: "Poppins", sans-serif;\r\n  font-weight: var(--medium);\r\n  transition: background 0.3s ease;\r\n  display: flex;\r\n  flex-flow: wrap row;\r\n  justify-content: center;\r\n  font-size: 14px;\r\n}\r\n.extension-btn:hover {\r\n  background: var(--active-red);\r\n}\r\n.extension-btn a {\r\n  font-family: "Poppins", sans-serif;\r\n  font-weight: var(--medium);\r\n  color: var(--base-white);\r\n}\r\n\r\n#alert, #alert-dialog-wrapper {\r\n  display: flex;\r\n  flex-flow: wrap row;\r\n  position: fixed;\r\n  width: 100%;\r\n  height: 100%;\r\n  z-index: 9999999;\r\n  align-items: center;\r\n  box-shadow: 8px 6px 20px 1px rgba(0, 0, 0, 0.2);\r\n}\r\n#alert-dialog-container {\r\n  background: var(--base-black);\r\n  max-width: 400px;\r\n  margin: 0 auto;\r\n  border-radius: 4px;\r\n}\r\n#alert-title-wrapper {\r\n  padding: 20px 20px 0px 20px;\r\n}\r\n#alert-title-wrapper .alert-title {\r\n  display: flex;\r\n  flex-flow: wrap row;\r\n  justify-content: space-between;\r\n  align-items: center;\r\n}\r\n#alert-title-wrapper .alert-title .alert-x {\r\n  color: var(--base-white);\r\n}\r\n#alert-title-wrapper .extension-border-bot {\r\n  padding-top: 10px;\r\n}\r\n#alert-description {\r\n  padding: 10px 20px 20px 20px;\r\n}\r\n\r\n#alert-x-btn {\r\n  background: none !important;\r\n  border: none !important;\r\n}\r\n\r\n#alert-content-txt {\r\n  margin: 0 !important;\r\n}\r\n\r\n#alert-title-txt {\r\n  margin: 0 !important;\r\n}\r\n\r\n#alert-return-btn {\r\n  border: none !important;\r\n}\r\n\r\n/*# sourceMappingURL=alert.css.map */';
        },
        161: module => {
            "use strict";
            module.exports = '.hidden {\r\n    display: none !important;\r\n}\r\n\r\n.slider {\r\n    padding: 0% !important;\r\n}\r\n\r\n.tp-seperator {\r\n  border: 1px solid #323232;\r\n  border-radius: 1px;\r\n  width: 30px;\r\n  height: 0px;\r\n}\r\n\r\n#tp-controls-error-text {\r\n  color: var(--white-5);\r\n  text-align: center;\r\n  padding: 5px;\r\n}\r\n\r\n#tp-error-box {\r\n  width: 170px;\r\n  height: 60px;\r\n  z-index: 9999;\r\n  position: fixed;\r\n  right: 80px;\r\n  top: 50px;\r\n  /* box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.25); */\r\n  -webkit-backdrop-filter: blur(6px);\r\n  border-radius: 4px;\r\n  background-color: rgba(25, 25, 25, 0.7);\r\n  transition: transform 1s;\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n  justify-content: center;\r\n}\r\n\r\n#tp-buttons-container {\r\n  width: 50px;\r\n  z-index: 9999;\r\n  position: fixed;\r\n  right: 30px;\r\n  top: 50px;\r\n  border-radius: 4px;\r\n  background-color: rgba(0, 0, 0, 0.5);\r\n  transition: transform 1s;\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n}\r\n\r\n#tp-icon-container {\r\n  margin-top: 5px;\r\n  margin-bottom: 10px;\r\n  width: 40px;\r\n  height: 40px;\r\n  display: flex;\r\n  border-radius: 4.8px;\r\n  justify-content: center;\r\n  align-items: center;\r\n}\r\n\r\n.tp-center-image {\r\n  position: absolute;\r\n}\r\n\r\n#tp-icon-container:hover .tooltiptext {\r\n  visibility: visible;\r\n}\r\n\r\n.tp-control-button:hover .tooltiptext {\r\n  visibility: visible;\r\n}\r\n\r\n.tp-control-button:hover .tp-button-image {\r\n  visibility: hidden;\r\n}\r\n\r\n.tp-hover-image {\r\n  visibility: hidden;\r\n}\r\n\r\n.tp-control-button:hover .tp-hover-image {\r\n  visibility: visible;\r\n}\r\n\r\n.tp-control-button:hover {\r\n  background-color: var(--black-20);\r\n}\r\n\r\n#tp-message-indicator {\r\n  background: linear-gradient(\r\n135deg, #E34248 0%, #BC4D7A 56.67%, #9E55A0 100%);\r\n  width: 10px;\r\n  height: 10px;\r\n  border-radius: 10px;\r\n  position: absolute;\r\n  top: 2px;\r\n  right: 4px;\r\n}\r\n\r\n#tp-chat-close-button {\r\n  position: fixed;\r\n  width: 30px;\r\n  height: 30px;\r\n  right: calc(var(--chatWidth) + 5px);\r\n  top: 113px;\r\n  z-index: 9999;\r\n  background: rgba(40, 40, 40, 0.5);\r\n  -webkit-backdrop-filter: blur(4px);\r\n  border-radius: 26.4px;\r\n}\r\n\r\n#tp-chat-close-button img {\r\n  width: 22px;\r\n  height: 22px;\r\n}\r\n\r\n.tooltiptext {\r\n  visibility: hidden;\r\n  background: rgba(40, 40, 40, 0.5);\r\n  -webkit-backdrop-filter: blur(4px);\r\n  border-radius: 4px;\r\n  color: white !important;\r\n  font-size: 14px !important;\r\n  text-align: center;\r\n  vertical-align: center;\r\n  height: 40px;\r\n  padding: 5px 0;\r\n  border-radius: 4px;\r\n  position: absolute;\r\n  right: calc(105% + 5px);\r\n  align-items: center;\r\n  justify-content: center;\r\n  display: inline-flex;\r\n}\r\n\r\n.tp-control-button {\r\n  margin-top: 5px;\r\n  margin-bottom: 7px;\r\n  width: 40px;\r\n  height: 40px;\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  position: relative;\r\n  border-radius: 5px;\r\n}\r\n\r\n.tp-control-button img {\r\n  width: 60%;\r\n  height: 70%;\r\n}\r\n\r\n#tp-icon-white {\r\n  width: 16px;\r\n  height: 16px;\r\n}\r\n\r\n.createPartyContainer {\r\n    z-index: 9999;\r\n    right: 0px;\r\n    top: var(--containerTop);\r\n    position: fixed;\r\n    display: block;\r\n    background: var(--base-black);\r\n    width: 332px;\r\n    height: var(--containerHeight);\r\n    padding: 20px;\r\n    border-radius: 4px;\r\n}\r\n\r\n.buttonContainerVisible {\r\n    animation: goToContainer 0.6s;\r\n    animation-fill-mode: forwards;\r\n}\r\n\r\n.tpButtonHover{\r\n    animation: buttonHover 0.5s;\r\n    animation-fill-mode: forwards;\r\n}\r\n\r\n.tpButtonOut{\r\n    animation: hoverOut 0.5s;\r\n    animation-fill-mode: forwards;\r\n}\r\n\r\n.buttonContainerOut {\r\n    animation: buttonContainerOut 0.5s;\r\n    animation-fill-mode: forwards;\r\n}\r\n\r\n.containerIn {\r\n    animation: containerIn 0.5s;\r\n    animation-fill-mode: forwards;\r\n}\r\n\r\n.containerOut {\r\n    animation: containerOut 0.5s;\r\n    animation-fill-mode: forwards;\r\n}\r\n\r\n@keyframes goToContainer {\r\n    0% {\r\n        border-radius: 50%;\r\n        background-color: black;\r\n    }\r\n    100% {\r\n        opacity: 1;\r\n        top: calc(var(--containerTop) + 75px);\r\n        right: var(--containerWidth);\r\n        border-top-left-radius: 50%;\r\n        border-top-right-radius: 0px;\r\n        border-bottom-right-radius: 0px;\r\n        border-bottom-left-radius: 50%;\r\n        background-color: var(--base-black);\r\n    }\r\n}\r\n\r\n@keyframes containerIn {\r\n    0% {\r\n        right: -400px;\r\n    }\r\n    100% {\r\n        right: 0px;\r\n    }\r\n}\r\n\r\n\r\n@keyframes containerOut {\r\n    0% {\r\n        right: 0px;\r\n\r\n    }\r\n    100% {\r\n        right: -400px;\r\n    }\r\n}\r\n\r\n\r\n@keyframes buttonContainerOut {\r\n    0% {\r\n        opacity: 1;\r\n        top: calc(var(--containerTop) + 75px);\r\n        right: var(--containerWidth);\r\n        border-top-left-radius: 50%;\r\n        border-top-right-radius: 0px;\r\n        border-bottom-right-radius: 0px;\r\n        border-bottom-left-radius: 50%;\r\n        background-color: var(--base-black);\r\n    }\r\n    100% {\r\n        opacity: 0.2;\r\n        right: var(--outRight);\r\n        border-radius: 50%;\r\n        background-color: black;\r\n    }\r\n}\r\n\r\n@keyframes buttonHover {\r\n    0% {\r\n    }\r\n    100% {\r\n        opacity: 1;\r\n        right: 0px;\r\n    }\r\n}\r\n\r\n@keyframes hoverOut {\r\n    0% {\r\n        opacity: 1;\r\n        right: 0px;\r\n    }\r\n    100% {\r\n        opacity: 0.2;\r\n        right: var(--outRight);\r\n    }\r\n}\r\n\r\n\r\n\r\n\r\n\r\n@import "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap";\r\nbody,\r\nhtml {\r\n  font-size: 16px;\r\n  -webkit-font-smoothing: antialiased;\r\n  -moz-osx-font-smoothing: grayscale;\r\n}\r\n* {\r\n  box-sizing: border-box;\r\n}\r\nh1,\r\nh2,\r\nh3,\r\nh4,\r\nh5,\r\nh6,\r\na,\r\np,\r\nul,\r\nli,\r\nol,\r\nbutton,\r\nbody,\r\nhtml {\r\n  padding: 0em;\r\n}\r\nh1,\r\nh2,\r\nh3,\r\nh4,\r\nh5,\r\nh6,\r\na,\r\np,\r\nul,\r\nli,\r\nol,\r\nbutton,\r\nbody,\r\nhtml {\r\n  margin: 0em;\r\n}\r\nul,\r\nli,\r\nol,\r\na {\r\n  text-decoration: none;\r\n  list-style: none;\r\n}\r\ninput,\r\nbutton {\r\n  border: none;\r\n}\r\nh1,\r\nh2,\r\nh3,\r\nh4,\r\nh5,\r\nh6,\r\np,\r\nspan,\r\nbody,\r\nhtml {\r\n  user-select: text !important;\r\n  cursor: auto !important;\r\n}\r\nimg {\r\n  user-select: none !important;\r\n}\r\ndiv,\r\nsection,\r\nbutton,\r\ninput,\r\nform,\r\narticle {\r\n  outline: none;\r\n}\r\na {\r\n  display: inline;\r\n  /* width: fit-content; */\r\n}\r\nbutton,\r\ninput,\r\nform,\r\nfieldset {\r\n  background: none;\r\n}\r\nbutton:hover {\r\n  cursor: pointer;\r\n}\r\n.r-m {\r\n  margin: 0 !important;\r\n}\r\n.r-m-t {\r\n  margin-top: 0 !important;\r\n}\r\n.r-p-t {\r\n  padding-top: 0 !important;\r\n}\r\n.r-m-l {\r\n  margin-left: 0 !important;\r\n}\r\n.r-p-l {\r\n  padding-left: 0 !important;\r\n}\r\n.r-m-r {\r\n  margin-right: 0 !important;\r\n}\r\n.r-p-r {\r\n  padding-right: 0 !important;\r\n}\r\n.r-m-b {\r\n  margin-bottom: 0 !important;\r\n}\r\n.r-p-b {\r\n  padding-bottom: 0 !important;\r\n}\r\n.r-b-r {\r\n  border-radius: 0px !important;\r\n}\r\n.r-boxshadow {\r\n  box-shadow: none !important;\r\n}\r\n:root {\r\n    --outRight: -25px;\r\n    --containerTop: calc(50% - var(--containerHalf));\r\n    --containerHeight: 205px;\r\n    --containerHalf: 102.5px;\r\n  --chatWidth: 304px;\r\n  --patreon: #f96854;\r\n  --base-red: #ef3e3a;\r\n  --active-red: #ea0f0a;\r\n  --base-blue: #4da9ff;\r\n  --base-orange: #ff8d4c;\r\n  --base-green: #24d154;\r\n  --base-white: #fafafa;\r\n  --white-5: #f0f0f0;\r\n  --white-10: #dcdcdc;\r\n  --white-15: #c8c8c8;\r\n  --white-20: #b4b4b4;\r\n  --white-25: #a0a0a0;\r\n  --white-30: #8c8c8c;\r\n  --white-35: #787878;\r\n  --base-black: #191919;\r\n  --black-5: #5a5a5a;\r\n  --black-10: #464646;\r\n  --black-15: #323232;\r\n  --black-20: #282828;\r\n  --black-25: #1e1e1e;\r\n  --black-30: #0a0a0a;\r\n}\r\n.base-white-bg {\r\n  background-color: var(--base-white);\r\n}\r\n.white-5-bg {\r\n  background-color: var(--white-5);\r\n}\r\n.white-10-bg {\r\n  background-color: var(--white-10);\r\n}\r\n.white-15-bg {\r\n  background-color: var(--white-15);\r\n}\r\n.white-20-bg {\r\n  background-color: var(--white-20);\r\n}\r\n.white-25-bg {\r\n  background-color: var(--white-25);\r\n}\r\n.white-30-bg {\r\n  background-color: var(--white-30);\r\n}\r\n.white-35-bg {\r\n  background-color: var(--white-35);\r\n}\r\n.base-black-bg {\r\n  background-color: var(--base-black);\r\n}\r\n.black-5-bg {\r\n  background-color: var(--black-5);\r\n}\r\n.black-10-bg {\r\n  background-color: var(--black-10);\r\n}\r\n.black-15-bg {\r\n  background-color: var(--black-15);\r\n}\r\n.black-20-bg {\r\n  background-color: var(--black-20);\r\n}\r\n.black-25-bg {\r\n  background-color: var(--black-25);\r\n}\r\n.black-30-bg {\r\n  background-color: var(--black-30);\r\n}\r\n.black-35-bg {\r\n  background-color: var(--black-35);\r\n}\r\n.base-red-bg {\r\n  background-color: var(--base-red);\r\n}\r\n.active-red-bg {\r\n  background-color: var(--active-red);\r\n}\r\n.base-orange-bg {\r\n  background-color: var(--base-orange);\r\n}\r\n.base-blue-bg {\r\n  background-color: var(--base-blue);\r\n}\r\n.base-green-bg {\r\n  background-color: var(--base-green);\r\n}\r\n.patreon-bg {\r\n  background-color: var(--patreon);\r\n}\r\n.txt-blue {\r\n  color: var(--base-blue) !important;\r\n}\r\n.txt-red {\r\n  color: var(--base-red) !important;\r\n}\r\n.txt-white {\r\n  color: var(--base-white) !important;\r\n}\r\ndiv,\r\np,\r\nspan,\r\na,\r\nh1,\r\nh2,\r\nh3,\r\nh4,\r\nh5,\r\nh6,\r\nli,\r\nul,\r\nbutton {\r\n  word-wrap: normal;\r\n}\r\n:root {\r\n  --regular: 400;\r\n  --medium: 500;\r\n  --semi-bold: 600;\r\n  --bold: 700;\r\n  --extra-bold: 800;\r\n  --black: 900;\r\n}\r\n.extension-title {\r\n  font-family: "Poppins", sans-serif;\r\n  font-weight: var(--medium);\r\n  color: var(--base-red);\r\n  font-size: 16px;\r\n  letter-spacing: 0.2px;\r\n}\r\n.extension-txt {\r\n  font-family: "Poppins", sans-serif;\r\n  font-weight: var(--regular);\r\n  color: var(--white-15);\r\n  font-size: 14px;\r\n}\r\n.extension-txt-indicator {\r\n  font-family: "Poppins", sans-serif;\r\n  font-weight: var(--regular);\r\n  color: var(--white-35);\r\n  font-size: 11px;\r\n}\r\n.extension-description {\r\n  font-family: "Poppins", sans-serif;\r\n  font-weight: var(--medium);\r\n  color: var(--white-10);\r\n  font-size: 13px;\r\n}\r\n.extension-border-bot {\r\n  border-bottom: 1px solid var(--black-10);\r\n}\r\n.extension-border-top {\r\n  border-top: 1px solid var(--black-10);\r\n}\r\n.extension-btn {\r\n  width: 100%;\r\n  margin-top: 10px;\r\n  background: var(--base-red);\r\n  color: var(--base-white);\r\n  padding: 10px 0px;\r\n  border-radius: 2px;\r\n  font-family: "Poppins", sans-serif;\r\n  font-weight: var(--medium);\r\n  transition: background 0.3s ease;\r\n  display: flex;\r\n  flex-flow: wrap row;\r\n  justify-content: center;\r\n  font-size: 14px;\r\n}\r\n.extension-btn:hover {\r\n  background: var(--active-red);\r\n}\r\n.extension-btn a {\r\n  font-family: "Poppins", sans-serif;\r\n  font-weight: var(--medium);\r\n  color: var(--base-white);\r\n}\r\nhtml {\r\n  margin: 0;\r\n  padding: 0;\r\n  background: var(--base-black);\r\n  border-radius: 4px;\r\n}\r\n.no-error {\r\n  display: block;\r\n  background: var(--base-black);\r\n  width: var(--containerWidth);\r\n  padding: 20px;\r\n  border-radius: 4px;\r\n}\r\n.no-error input[type="text"] {\r\n  display: block;\r\n  outline-style: none;\r\n  color: var(--base-white);\r\n  border: 1px solid var(--base-white);\r\n  border-radius: 4px;\r\n  width: 100%;\r\n  height: 40px;\r\n  padding: 8px 12px;\r\n  margin-top: 10px;\r\n}\r\n.no-error input[type="text"]:focus {\r\n  border: 1px solid var(--white-35);\r\n}\r\n.no-error label {\r\n  -moz-user-select: none;\r\n  -webkit-user-select: none;\r\n  -ms-user-select: none;\r\n  display: flex;\r\n  flex-flow: wrap row;\r\n  align-items: center;\r\n  font-family: "Poppins", sans-serif;\r\n  font-weight: var(--regular);\r\n  color: var(--base-white);\r\n  font-size: 12px;\r\n  margin-top: 12px;\r\n}\r\n.no-error label input {\r\n  margin-right: 10px;\r\n}\r\n.no-error h2 {\r\n  font-family: "Poppins", sans-serif;\r\n  font-weight: var(--semi-bold);\r\n  color: var(--base-white);\r\n  font-size: 18px;\r\n  letter-spacing: 0.2px;\r\n}\r\n.no-error button {\r\n  font-family: "Poppins", sans-serif;\r\n  font-weight: var(--medium);\r\n  cursor: pointer;\r\n  background-color: var(--base-red);\r\n  color: var(--base-white);\r\n  transition: 0.3s ease;\r\n  font-size: 13px;\r\n  letter-spacing: 0.2px;\r\n  margin-top: 16px;\r\n  transform: translateY(0px);\r\n}\r\n.no-error button:hover {\r\n  transform: translateY(-2px);\r\n}\r\n.no-error i {\r\n  font-family: "Poppins", sans-serif;\r\n  font-weight: var(--bold);\r\n}\r\n.no-error .copy-val {\r\n  display: block;\r\n  width: fit-content;\r\n  margin-top: 10px;\r\n  padding: 10px 20px;\r\n}\r\n.no-error .copy-val a {\r\n  font-family: "Poppins", sans-serif;\r\n  font-weight: var(--medium);\r\n  border-radius: 2px;\r\n  transition: 0.3s ease;\r\n  font-size: 12px;\r\n}\r\n.some-error {\r\n  display: block;\r\n  background: var(--base-black);\r\n  width: 332px;\r\n  padding: 20px;\r\n  border-radius: 4px;\r\n}\r\n.hidden {\r\n  display: none !important;\r\n}\r\n.extension-btn {\r\n  margin-bottom: 10px;\r\n}\r\n#create-session {\r\n  background: #dc4046;\r\n  background: linear-gradient(140deg, #dc4046 0%, #9e55a0 100%);\r\n}\r\n#create-session:hover {\r\n  background: #dc4046;\r\n  background: linear-gradient(140deg, #dc4046 0%, #9e55a0 100%);\r\n}\r\n#accept-permissions {\r\n  background: #dc4046;\r\n  background: linear-gradient(140deg, #dc4046 0%, #9e55a0 100%);\r\n}\r\n#accept-permissions :hover {\r\n  background: #dc4046;\r\n  background: linear-gradient(140deg, #dc4046 0%, #9e55a0 100%);\r\n}\r\n.popup-url-container {\r\n  display: flex;\r\n  flex-flow: wrap row;\r\n  justify-content: space-between;\r\n  align-items: center;\r\n  margin-top: 15px;\r\n}\r\n.popup-url-container input[type="text"] {\r\n  display: block;\r\n  outline-style: none;\r\n  color: var(--base-white);\r\n  border: none;\r\n  border-bottom: 1px solid var(--base-white);\r\n  border-radius: 0px;\r\n  width: 60%;\r\n  height: 40px;\r\n  padding: 0px;\r\n  margin-top: 0px;\r\n}\r\n.popup-url-container input[type="text"]:focus {\r\n  border: none;\r\n}\r\n.popup-url-container .copy-val {\r\n  cursor: pointer !important;\r\n  width: 34%;\r\n  margin: 0;\r\n}\r\n.popup-url-container .copy-val a {\r\n  margin: 0;\r\n}\r\n.popup-showchat-container,\r\n.popup-controlchat-container {\r\n  display: flex;\r\n  flex-flow: wrap row;\r\n  align-items: center;\r\n  justify-content: space-between;\r\n  margin-top: 15px;\r\n}\r\n.popup-showchat-container .switch,\r\n.popup-controlchat-container .switch {\r\n  position: relative;\r\n  display: inline-block;\r\n  width: 52px;\r\n  height: 26px;\r\n  margin-top: 0;\r\n}\r\n.popup-showchat-container .switch input,\r\n.popup-controlchat-container .switch input {\r\n  opacity: 0;\r\n  width: 0;\r\n  height: 0;\r\n}\r\n.popup-showchat-container .switch input:checked + .slider,\r\n.popup-controlchat-container .switch input:checked + .slider {\r\n  background-color: var(--base-green);\r\n}\r\n.popup-showchat-container .switch input:checked + .slider:before,\r\n.popup-controlchat-container .switch input:checked + .slider:before {\r\n  -webkit-transform: translateX(26px);\r\n  -ms-transform: translateX(26px);\r\n  transform: translateX(26px);\r\n}\r\n.popup-showchat-container .switch .slider,\r\n.popup-controlchat-container .switch .slider {\r\n  position: absolute;\r\n  cursor: pointer;\r\n  top: 0;\r\n  left: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  background-color: var(--black-5);\r\n  -webkit-transition: 0.4s;\r\n  transition: 0.4s;\r\n}\r\n.popup-showchat-container .switch .slider:before,\r\n.popup-controlchat-container .switch .slider:before {\r\n  position: absolute;\r\n  content: "";\r\n  height: 18px;\r\n  width: 18px;\r\n  left: 4px;\r\n  bottom: 4px;\r\n  background-color: #fff;\r\n  -webkit-transition: 0.4s;\r\n  transition: 0.4s;\r\n}\r\n.popup-showchat-container .switch .round,\r\n.popup-controlchat-container .switch .round {\r\n  border-radius: 34px;\r\n}\r\n.popup-showchat-container .switch .round:before,\r\n.popup-controlchat-container .switch .round:before {\r\n  border-radius: 50%;\r\n}\r\n.popup-showchat-container .switch .round:hover,\r\n.popup-controlchat-container .switch .round:hover {\r\n  cursor: pointer !important;\r\n}\r\n.popup-review-container {\r\n  display: flex;\r\n  flex-flow: wrap column;\r\n  width: 100%;\r\n  padding-top: 15px;\r\n  margin-top: 15px;\r\n  border-top: 1px solid var(--black-10);\r\n}\r\n.popup-review-container button {\r\n  background: #dc4046;\r\n  background: linear-gradient(140deg, #dc4046 0%, #9e55a0 100%);\r\n}\r\n.popup-review-container button:hover {\r\n  background: #dc4046;\r\n  background: linear-gradient(140deg, #dc4046 0%, #9e55a0 100%);\r\n} /*# sourceMappingURL=pop.min.css.map */\r\n.ellipsis-anim span {\r\n  opacity: 0;\r\n  -webkit-animation: ellipsis-dot 1s infinite;\r\n  animation: ellipsis-dot 1s infinite;\r\n}\r\n\r\n.ellipsis-anim span:nth-child(1) {\r\n  -webkit-animation-delay: 0.0s;\r\n  animation-delay: 0.0s;\r\n}\r\n.ellipsis-anim span:nth-child(2) {\r\n  -webkit-animation-delay: 0.1s;\r\n  animation-delay: 0.1s;\r\n}\r\n.ellipsis-anim span:nth-child(3) {\r\n  -webkit-animation-delay: 0.2s;\r\n  animation-delay: 0.2s;\r\n}\r\n\r\n@-webkit-keyframes ellipsis-dot {\r\n    0% { opacity: 0; }\r\n   50% { opacity: 1; }\r\n  100% { opacity: 0; }\r\n}\r\n\r\n@keyframes ellipsis-dot {\r\n    0% { opacity: 0; }\r\n   50% { opacity: 1; }\r\n  100% { opacity: 0; }\r\n}';
        },
        236: module => {
            "use strict";
            module.exports = '@import "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap";\r\nbody,\r\nhtml {\r\n  font-size: 16px;\r\n  -webkit-font-smoothing: antialiased;\r\n  -moz-osx-font-smoothing: grayscale;\r\n}\r\n* {\r\n  box-sizing: border-box;\r\n}\r\nh1,\r\nh2,\r\nh3,\r\nh4,\r\nh5,\r\nh6,\r\na,\r\np,\r\nul,\r\nli,\r\nol,\r\nbutton,\r\nbody,\r\nhtml {\r\n  padding: 0em;\r\n}\r\nh1,\r\nh2,\r\nh3,\r\nh4,\r\nh5,\r\nh6,\r\na,\r\np,\r\nul,\r\nli,\r\nol,\r\nbutton,\r\nbody,\r\nhtml {\r\n  margin: 0em;\r\n}\r\nul,\r\nli,\r\nol,\r\na {\r\n  text-decoration: none;\r\n  list-style: none;\r\n}\r\ninput,\r\nbutton {\r\n  border: none;\r\n}\r\nh1,\r\nh2,\r\nh3,\r\nh4,\r\nh5,\r\nh6,\r\np,\r\nspan,\r\nbody,\r\nhtml {\r\n  user-select: text !important;\r\n  cursor: auto !important;\r\n}\r\nimg {\r\n  user-select: none !important;\r\n}\r\ndiv,\r\nsection,\r\nbutton,\r\ninput,\r\nform,\r\narticle {\r\n  outline: none;\r\n}\r\na {\r\n  display: block;\r\n  width: fit-content;\r\n}\r\nbutton,\r\ninput,\r\nform,\r\nfieldset {\r\n  background: none;\r\n}\r\nbutton:hover {\r\n  cursor: pointer;\r\n}\r\n.r-m {\r\n  margin: 0 !important;\r\n}\r\n.r-m-t {\r\n  margin-top: 0 !important;\r\n}\r\n.r-p-t {\r\n  padding-top: 0 !important;\r\n}\r\n.r-m-l {\r\n  margin-left: 0 !important;\r\n}\r\n.r-p-l {\r\n  padding-left: 0 !important;\r\n}\r\n.r-m-r {\r\n  margin-right: 0 !important;\r\n}\r\n.r-p-r {\r\n  padding-right: 0 !important;\r\n}\r\n.r-m-b {\r\n  margin-bottom: 0 !important;\r\n}\r\n.r-p-b {\r\n  padding-bottom: 0 !important;\r\n}\r\n.r-b-r {\r\n  border-radius: 0px !important;\r\n}\r\n.r-boxshadow {\r\n  box-shadow: none !important;\r\n}\r\n:root {\r\n  --base-width: 8px;\r\n  --chat-width: calc(var(--base-width) * 38);\r\n  --patreon: #f96854;\r\n  --base-red: #e34248;\r\n  --active-red: #ea0f0a;\r\n  --base-blue: #4da9ff;\r\n  --base-orange: #ff8d4c;\r\n  --base-green: #24d154;\r\n  --base-white: #fafafa;\r\n  --white-5: #f0f0f0;\r\n  --white-10: #dcdcdc;\r\n  --white-15: #c8c8c8;\r\n  --white-20: #b4b4b4;\r\n  --white-25: #a0a0a0;\r\n  --white-30: #8c8c8c;\r\n  --white-35: #787878;\r\n  --base-black: #191919;\r\n  --black-5: #5a5a5a;\r\n  --black-10: #464646;\r\n  --black-15: #323232;\r\n  --black-20: #282828;\r\n  --black-25: #1e1e1e;\r\n  --black-30: #0a0a0a;\r\n}\r\n.base-white-bg {\r\n  background-color: var(--base-white);\r\n}\r\n.white-5-bg {\r\n  background-color: var(--white-5);\r\n}\r\n.white-10-bg {\r\n  background-color: var(--white-10);\r\n}\r\n.white-15-bg {\r\n  background-color: var(--white-15);\r\n}\r\n.white-20-bg {\r\n  background-color: var(--white-20);\r\n}\r\n.white-25-bg {\r\n  background-color: var(--white-25);\r\n}\r\n.white-30-bg {\r\n  background-color: var(--white-30);\r\n}\r\n.white-35-bg {\r\n  background-color: var(--white-35);\r\n}\r\n.base-black-bg {\r\n  background-color: var(--base-black);\r\n}\r\n.black-5-bg {\r\n  background-color: var(--black-5);\r\n}\r\n.black-10-bg {\r\n  background-color: var(--black-10);\r\n}\r\n.black-15-bg {\r\n  background-color: var(--black-15);\r\n}\r\n.black-20-bg {\r\n  background-color: var(--black-20);\r\n}\r\n.black-25-bg {\r\n  background-color: var(--black-25);\r\n}\r\n.black-30-bg {\r\n  background-color: var(--black-30);\r\n}\r\n.black-35-bg {\r\n  background-color: var(--black-35);\r\n}\r\n.base-red-bg {\r\n  background-color: var(--base-red);\r\n}\r\n.active-red-bg {\r\n  background-color: var(--active-red);\r\n}\r\n.base-orange-bg {\r\n  background-color: var(--base-orange);\r\n}\r\n.base-blue-bg {\r\n  background-color: var(--base-blue);\r\n}\r\n.base-green-bg {\r\n  background-color: var(--base-green);\r\n}\r\n.patreon-bg {\r\n  background-color: var(--patreon);\r\n}\r\n.txt-blue {\r\n  color: var(--base-blue) !important;\r\n}\r\n.txt-red {\r\n  color: var(--base-red) !important;\r\n}\r\n.txt-white {\r\n  color: var(--base-white) !important;\r\n}\r\ndiv,\r\np,\r\nspan,\r\na,\r\nh1,\r\nh2,\r\nh3,\r\nh4,\r\nh5,\r\nh6,\r\nli,\r\nul,\r\nbutton {\r\n  word-wrap: break-word;\r\n}\r\n:root {\r\n  --regular: 400;\r\n  --medium: 500;\r\n  --semi-bold: 600;\r\n  --bold: 700;\r\n  --extra-bold: 800;\r\n  --black: 900;\r\n}\r\n.extension-title {\r\n  font-family: "Poppins", sans-serif !important;\r\n  font-weight: var(--medium);\r\n  color: var(--base-red);\r\n  font-size: 16px;\r\n  letter-spacing: 0.2px;\r\n}\r\n.extension-txt {\r\n  font-family: "Poppins", sans-serif !important;\r\n  font-weight: var(--regular);\r\n  color: var(--white-15);\r\n  font-size: 14px;\r\n}\r\n.extension-txt-indicator {\r\n  font-family: "Poppins", sans-serif !important;\r\n  font-weight: var(--regular);\r\n  color: var(--white-25);\r\n  font-size: 12px;\r\n}\r\n.extension-description {\r\n  font-family: "Poppins", sans-serif !important;\r\n  font-weight: var(--medium);\r\n  color: var(--white-10);\r\n  font-size: 13px;\r\n}\r\n.extension-border-bot {\r\n  border-bottom: 1px solid var(--black-20);\r\n}\r\n.extension-border-top {\r\n  border-top: 1px solid var(--black-10);\r\n}\r\n.extension-btn {\r\n  width: 100%;\r\n  margin-top: 10px;\r\n  background: var(--base-red);\r\n  color: var(--base-white);\r\n  padding: 10px 0px;\r\n  border-radius: 2px;\r\n  font-family: "Poppins", sans-serif !important;\r\n  font-weight: var(--medium);\r\n  transition: background 0.3s ease;\r\n  display: flex;\r\n  flex-flow: wrap row;\r\n  justify-content: center;\r\n  font-size: 14px;\r\n}\r\n.cancel-btn {\r\n  border: 1px solid #ef3e3a;\r\n  box-sizing: border-box;\r\n  border-radius: 2.23846px;\r\n  color: var(--base-red);\r\n  background: none !important;\r\n}\r\n.extension-btn:hover {\r\n  background: var(--active-red);\r\n}\r\n.extension-btn a {\r\n  font-family: "Poppins", sans-serif !important;\r\n  font-weight: var(--medium);\r\n  color: var(--base-white);\r\n}\r\n::-webkit-scrollbar {\r\n  width: 2px;\r\n}\r\n::-webkit-scrollbar-thumb {\r\n  background: var(--base-red);\r\n  border-radius: 10px;\r\n}\r\n\r\n#chat-wrapper {\r\n  transition: width 0.2s linear;\r\n  width: var(--chat-width);\r\n  height: 100%;\r\n  position: fixed;\r\n  top: 0;\r\n  left: auto;\r\n  right: 0;\r\n  bottom: 0;\r\n  cursor: auto;\r\n  user-select: text;\r\n  -webkit-user-select: text;\r\n  z-index: 9999999999;\r\n  background: var(--base-black);\r\n}\r\n\r\n.tpLogEventMessage {\r\n  margin-bottom: 20px;\r\n  font-size: 12px;\r\n}\r\n\r\n#chat-container {\r\n  height: 100%;\r\n  padding: calc(var(--base-width) * 2);\r\n  display: flex;\r\n  flex-direction: column;\r\n  overflow-y: scroll;\r\n  overflow-x: hidden;\r\n}\r\n#chat-main {\r\n  position: relative;\r\n  height: 100%;\r\n}\r\n#chat-menu-container {\r\n  display: flex;\r\n  flex-flow: wrap row;\r\n  justify-content: space-between;\r\n  align-items: center;\r\n  margin-top: 0px !important;\r\n  padding-left: 0px !important;\r\n  overflow: hidden;\r\n}\r\n#chat-menu-container li {\r\n  list-style: none !important;\r\n}\r\n#chat-menu-container #title h1 {\r\n  font-family: "Poppins", sans-serif !important;\r\n  font-weight: var(--medium);\r\n  color: var(--base-red);\r\n  font-size: 16px;\r\n  letter-spacing: 0.5px;\r\n}\r\n#chat-menu-container #function-user {\r\n  display: flex;\r\n  flex-flow: wrap row;\r\n}\r\n#chat-menu-container #function-user #link-icon,\r\n#chat-menu-container #function-user #reset-icon {\r\n  display: flex;\r\n  flex-flow: wrap row;\r\n  align-items: center;\r\n  padding-right: 10px;\r\n  cursor: pointer;\r\n}\r\n#chat-menu-container #function-user #link-icon .chat-link,\r\n#chat-menu-container #function-user #reset-icon .reset-link {\r\n  color: var(--base-white);\r\n  width: 18px;\r\n  height: 18px;\r\n  transform: scale(1);\r\n  opacity: 0.5;\r\n  transition: 0.3s ease;\r\n}\r\n#chat-menu-container #function-user #link-icon .chat-link:hover,\r\n#chat-menu-container #function-user #reset-icon .reset-link:hover {\r\n  color: var(--base-red);\r\n  opacity: 1;\r\n  transform: scale(1.05);\r\n}\r\n#chat-menu-container #function-user #user-icon img {\r\n  width: 38px;\r\n  height: 38px;\r\n  transform: scale(1);\r\n  transition: transform 0.3s ease;\r\n}\r\n#chat-menu-container #function-user #user-icon img:hover {\r\n  transform: scale(1.05);\r\n}\r\n#chat-ad-cta-text {\r\n  cursor: pointer !important;\r\n}\r\n#chat-ad-sponsored-text {\r\n  font-family: "Poppins", sans-serif !important;\r\n  font-weight: var(--regular);\r\n  color: var(--white-35);\r\n  font-size: 10px;\r\n  margin-bottom: 5px;\r\n}\r\n#chat-history-container {\r\n  display: flex;\r\n  flex-flow: column;\r\n  justify-content: flex-end;\r\n  flex: 1;\r\n  height: 50px;\r\n  margin-bottom: 10px;\r\n}\r\n#chat-history-container #chat-history {\r\n  overflow-y: scroll;\r\n  overflow-x: hidden;\r\n  width: 100%;\r\n  height: auto;\r\n  padding-top: 10px;\r\n}\r\n#chat-ad-holder {\r\n  padding-bottom: 10px;\r\n  border-bottom: 1px solid var(--black-10);\r\n}\r\n#chat-ad-header {\r\n  margin-bottom: 5px;\r\n}\r\n#chat-ad-header p {\r\n  color: var(--white-35);\r\n  font-size: 10px;\r\n}\r\n#chat-ad-image {\r\n  width: 264px;\r\n  height: 88px;\r\n  border-radius: 2px;\r\n}\r\n#chat-ad-btn {\r\n  background: linear-gradient(140deg, #dc4046 0%, #9e55a0 100%);\r\n}\r\n\r\n\r\n\r\n#chat-history-container #chat-history .msg,\r\n#chat-history-container #chat-history .msg-container {\r\n  display: flex;\r\n  flex-flow: wrap row;\r\n  justify-content: flex-start;\r\n  align-items: center;\r\n}\r\n\r\n#chat-history-container #chat-history .msg-container:hover {\r\n  background: var(--black-20);\r\n  border-radius: 4px;\r\n}\r\n\r\n#chat-history-container #chat-history .msg:hover {\r\n  background: var(--black-20);\r\n  border-radius: 4px;\r\n}\r\n\r\n#chat-history-container #chat-history .msg {\r\n  /* padding: 9px 10px 4px 10px; */\r\n  margin-right: 3px;\r\n  padding-bottom: 4px;\r\n  padding-left: 6px;\r\n}\r\n\r\n#chat-history-container #chat-history .msg:last-child {\r\n  padding-bottom: 0px;\r\n}\r\n#chat-history-container #chat-history .msg-container {\r\n  align-items: flex-start;\r\n  /* padding: 9px 10px 4px 10px; */\r\n  padding-left: 6px;\r\n  margin-right: 3px;\r\n  transition: .3s ease;\r\n}\r\n.tp-icon-name {\r\n  width: 40px;\r\n  margin-right: 5px;\r\n}\r\n#chat-history-container #chat-history .msg .icon img,\r\n#chat-history-container #chat-history .msg .tp-icon-name img,\r\n#chat-history-container #chat-history .msg-container .icon img,\r\n#chat-history-container #chat-history .msg-container .tp-icon-name img {\r\n  width: 36px;\r\n  height: 36px;\r\n}\r\n#chat-history-container #chat-history .msg .msg-txt,\r\n#chat-history-container #chat-history .msg-container .msg-txt {\r\n  display: flex;\r\n  flex-flow: wrap column;\r\n  flex: 1;\r\n}\r\n#chat-history-container #chat-history .msg-container .msg-txt h3,\r\np {\r\n  overflow: hidden;\r\n}\r\n.tp-msg-combined-message p {\r\n  margin-top: -1px;\r\n  margin-bottom: 5px;\r\n}\r\n\r\n.false-message {\r\n  padding-top: 8px;\r\n}\r\n\r\n#chat-history-container #chat-history .msg-container .msg-txt p {\r\n  margin-top: 4px;\r\n  margin-bottom: 4px;\r\n}\r\n#chat-history-container #chat-history .msg-container .msg-gif {\r\n  width: 80%;\r\n  font-size: 14px;\r\n}\r\n.tp-video-gif {\r\n  max-width: 100%;\r\n  border-radius: 5px;\r\n  max-height: 200px;\r\n  margin-top: 5px;\r\n  background: var(--black-15);\r\n}\r\n#chat-history-container #chat-history .msg .message,\r\n#chat-history-container #chat-history .msg .message-system,\r\n#chat-history-container #chat-history .msg .message-txt,\r\n#chat-history-container #chat-history .msg-container .message,\r\n#chat-history-container #chat-history .msg-container .message-system,\r\n#chat-history-container #chat-history .msg-container .message-txt {\r\n  width: 80%;\r\n}\r\n#chat-history-container #chat-history .msg .message h3,\r\n#chat-history-container #chat-history .msg .message-system h3,\r\n#chat-history-container #chat-history .msg .message-txt h3,\r\n#chat-history-container #chat-history .msg-container .message h3,\r\n#chat-history-container #chat-history .msg-container .message-system h3,\r\n#chat-history-container #chat-history .msg-container .message-txt h3,\r\n#chat-history-container #chat-history .msg-container .message-gif h3 {\r\n  font-family: "Poppins", sans-serif !important;\r\n  font-weight: var(--medium);\r\n  color: var(--base-white);\r\n  font-size: 14px;\r\n  line-height: 1.2;\r\n  letter-spacing: 0.2px;\r\n}\r\n#chat-history-container #chat-history .msg .message p,\r\n#chat-history-container #chat-history .msg .message-system p,\r\n#chat-history-container #chat-history .msg .message-txt p,\r\n#chat-history-container #chat-history .msg-container .message p,\r\n#chat-history-container #chat-history .msg-container .message-system p,\r\n#chat-history-container #chat-history .msg-container .message-txt p {\r\n  font-family: "Poppins", sans-serif !important;\r\n  font-weight: var(--regular);\r\n  font-size: 14px;\r\n  line-height: normal;\r\n}\r\n#chat-history-container #chat-history .msg .message-txt p,\r\n#chat-history-container #chat-history .msg-container .message-txt p {\r\n  color: var(--white-10);\r\n  word-break: break-word !important;\r\n  line-height: normal;\r\n  white-space: pre-line;\r\n}\r\n#chat-history-container #chat-history .msg .message-system p,\r\n#chat-history-container #chat-history .msg-container .message-system p {\r\n  color: var(--white-30);\r\n  line-height: normal;\r\n}\r\n#chat-input-container {\r\n  /* display: flex; */\r\n  justify-content: space-between;\r\n  background: var(--black-25);\r\n  border: 1.5px solid var(--black-10);\r\n  border-radius: 4px;\r\n  position: relative;\r\n  padding: var(--base-width);\r\n  padding-top: 0px;\r\n  width: calc(var(--base-width) * 34);\r\n  box-shadow: 0px 4px 10px #00000024;\r\n  left: 50%;\r\n  transform: translate(-50%);\r\n}\r\n.inTextEmoji {\r\n  font-size: 18px;\r\n}\r\n#chat-input {\r\n  overflow-x: hidden;\r\n  overflow-y: auto;\r\n  min-height: calc(var(--base-width) * 4);\r\n  width: 100%;\r\n  max-height: calc(var(--base-width) * 10);\r\n  border: none !important;\r\n  white-space: pre-wrap;\r\n  word-break: break-word;\r\n  overflow-wrap: break-word;\r\n  vertical-align: baseline;\r\n  line-height: 150%;\r\n  margin-top: calc(var(--base-width) * 1);\r\n  border: 1.5px solid var(--black-10);\r\n}\r\n\r\n#chat-input:empty:before {\r\n  display: block;\r\n  color: var(--black-10);\r\n  content: attr(data-placeholder);\r\n  pointer-events: none;\r\n}\r\n#chat-input::-webkit-scrollbar {\r\n  display: none;\r\n}\r\n\r\n#chat-input:hover {\r\n  cursor: auto !important;\r\n}\r\n#chat-input-container #emoji-picker-btn img,\r\n#chat-input-container #reaction-btn img,\r\n#chat-input-container #gif-btn img {\r\n  width: 18px;\r\n  height: 18px;\r\n  display: flex;\r\n  flex-flow: horizontal;\r\n  justify-content: center;\r\n  align-items: center;\r\n  opacity: 0.5;\r\n  margin: 0 auto;\r\n  transition: .2s ease;\r\n}\r\n\r\n#chat-input-container #emoji-picker-btn:hover img,\r\n#chat-input-container #reaction-btn:hover img,\r\n#chat-input-container #gif-btn:hover img {\r\n  opacity: 1;\r\n}\r\n\r\n\r\n#emoji-picker-btn:hover,\r\n#reaction-btn:hover,\r\n#gif-btn:hover {\r\n  background: var(--black-15);\r\n}\r\n\r\n#reaction-btn.inactive-bottom:hover\r\n  img\r\n  #emoji-picker-btn.inactive-bottom:hover\r\n  img,\r\n#gif-btn:hover.inactive-bottom img {\r\n  opacity: 0.8 !important;\r\n}\r\n\r\n#emoji-picker-btn,\r\n#reaction-btn,\r\n#gif-btn {\r\n  height: 28px;\r\n  width: 28px;\r\n  border-radius: 4px;\r\n  float: right;\r\n}\r\n\r\n#chat-input-container #emoji-btn {\r\n  width: 10%;\r\n}\r\n#chat-input-container #emoji-btn .test-emoji-btn {\r\n  width: 100%;\r\n  height: 100%;\r\n  border-radius: 50%;\r\n  padding: 2.5px;\r\n}\r\n\r\n#chat-icon-container {\r\n  display: flex;\r\n  flex-flow: wrap column;\r\n  flex-flow: column;\r\n  display: none;\r\n  padding-top: 10px;\r\n  box-shadow: 0px 4px 10px #00000024;\r\n}\r\n#chat-icon-container #icon-title-container {\r\n  padding-bottom: 10px;\r\n}\r\n#chat-icon-container #icon-holder {\r\n  display: flex;\r\n  flex-flow: wrap row;\r\n}\r\n#chat-icon-container #icon-holder .image-button {\r\n  width: 25%;\r\n  padding: 1px 3.75px;\r\n}\r\n#chat-icon-container #icon-holder .image-button .img-class {\r\n  width: 100%;\r\n  height: 100%;\r\n  transform: scale(0.95);\r\n  transition: transform 0.3s ease;\r\n}\r\n#chat-icon-container #icon-holder .image-button .img-class:hover {\r\n  transform: scale(1);\r\n  border: 2px solid white;\r\n  border-radius: 50px;\r\n}\r\n\r\n#chat-ad-btn p {\r\n  color: var(--base-white);\r\n  height: 100%;\r\n}\r\n\r\n#bottom-chat-controls {\r\n  width: 100%;\r\n  height: calc(var(--base-width) * 4);\r\n  display: flex;\r\n  flex-direction: row-reverse;\r\n  align-items: center;\r\n  border-radius: 0px 0px 4px 4px;\r\n  /* padding: 0px 10px; */\r\n}\r\n\r\n#emoji-filter-container {\r\n  display: flex;\r\n  flex-flow: wrap row;\r\n  justify-content: space-between;\r\n  height: 10%;\r\n}\r\n\r\n#gif-search {\r\n  width: 100%;\r\n  top: 0px;\r\n  border: none;\r\n  border-radius: 4px;\r\n  background: var(--black-30);\r\n  font-size: 14px;\r\n  padding: 0px 8px;\r\n  height: calc(var(--base-width) * 4);\r\n  margin-bottom: var(--base-width);\r\n  line-height: 20px;\r\n  align-items: center;\r\n  font-size: 14px;\r\n  font-family: "Poppins", sans-serif !important;\r\n  color: var(--white-15);\r\n}\r\n\r\n.gif-placeholder-1 {\r\n  height: 40px;\r\n}\r\n\r\n.gif-placeholder-2 {\r\n  height: 75px;\r\n}\r\n\r\n.gif-placeholder-3 {\r\n  height: 85px;\r\n}\r\n\r\n.gif-placeholder-4 {\r\n  height: 65px;\r\n}\r\n\r\n.gif-results {\r\n  display: flex;\r\n  flex-direction: column;\r\n  width: calc(var(--base-width) * 15.5)\r\n}\r\n\r\n.tp-toolcontainer {\r\n  position: relative;\r\n}\r\n\r\n.tp-toolcontainer:hover .tooltiptext {\r\n  visibility: visible;\r\n}\r\n\r\n.tp-toolcontainer .tooltiptext {\r\n  visibility: hidden;\r\n}\r\n\r\n.tooltiptext {\r\n  visibility: hidden;\r\n  background: rgba(40, 40, 40, 0.5);\r\n  -webkit-backdrop-filter: blur(4px);\r\n  border-radius: 4px;\r\n  color: white !important;\r\n  font-size: 14px !important;\r\n  text-align: center;\r\n  vertical-align: center;\r\n  height: 40px;\r\n  padding: 5px 0;\r\n  border-radius: 4px;\r\n  position: absolute;\r\n  right: calc(105% + 5px);\r\n  align-items: center;\r\n  justify-content: center;\r\n  display: inline-flex;\r\n}\r\n\r\n.gif-img {\r\n  width: 100% !important;\r\n  margin-bottom: 8px;\r\n  border-radius: 4px;\r\n  background: var(--black-15);\r\n  transform: scale(0.98);\r\n  transition: .2s ease;\r\n  opacity: 0.8;\r\n}\r\n.gif-img:hover {\r\n  /* border: 1.5px solid var(--active-red); */\r\n  opacity: 1;\r\n  background: var(--black-10);\r\n  transform: scale(1);\r\n  cursor: pointer;\r\n}\r\n\r\n#gif-results-left {\r\n  float: left;\r\n  padding-right: calc(var(--base-width) * 0.5);\r\n  padding-bottom: calc(var(--base-width) * 0.5);\r\n  padding-top: calc(var(--base-width) * 1);\r\n}\r\n\r\n#gif-results-left:first-child { \r\n  padding-right: calc(var(--base-width) * 0.5);\r\n  padding-bottom: calc(var(--base-width) * 0.5);\r\n  padding-top: calc(var(--base-width) * 1);\r\n}\r\n\r\n#gif-results-right {\r\n  float: right;\r\n  padding-top: calc(var(--base-width) * 1);\r\n}\r\n\r\n#gif-results-right:first-child { \r\n  padding-left: calc(var(--base-width) * 0.5);\r\n  padding-bottom: calc(var(--base-width) * 0.5);\r\n  padding-top: calc(var(--base-width) * 1);\r\n}\r\n\r\n#gif-columns-wrapper {\r\n  width: 100%;\r\n}\r\n\r\n#gif-results,\r\n#category-container {\r\n  display: block;\r\n  /* column-count: 2;\r\n  -webkit-column-count: 2;\r\n  column-gap: 8px;\r\n  -webkit-column-gap: 8px; */\r\n}\r\n#gif-back-btn {\r\n  transform: rotate(90deg);\r\n  -webkit-transform: rotate(90deg);\r\n  height: 60%;\r\n  width: 60%;\r\n}\r\n\r\n#gif-results-wrapper {\r\n  height: 208px;\r\n  overflow-x: hidden;\r\n}\r\n\r\n#gif-results-wrapper::-webkit-scrollbar {\r\n  width: 0px;\r\n}\r\n\r\n.gif-image-wrapper img {\r\n  object-fit: contain;\r\n}\r\n\r\n.gif-image-wrapper {\r\n  display: block;\r\n  margin-bottom: 10px;\r\n}\r\n\r\n#gif-input-wrapper {\r\n  border-bottom: 1.5px solid var(--black-10);\r\n  display: flex;\r\n  align-items: center;\r\n  width: 100%;\r\n  justify-content: space-between;\r\n}\r\n\r\n#gif-input-back {\r\n  width: 10%;\r\n  display: none;\r\n  padding-bottom: 8px;\r\n  text-align: left;\r\n}\r\n#category-container {\r\n  display: none;\r\n}\r\n.tp-category-div {\r\n  width: 110px;\r\n  height: 60px;\r\n  position: relative;\r\n  display: inline-block;\r\n  margin: 5px;\r\n  border-radius: 6px;\r\n  overflow: hidden;\r\n  background: var(--base-black);\r\n}\r\n\r\n.tp-category-div:hover {\r\n  border: 1.5px solid var(--active-red);\r\n}\r\n\r\n.tp-category-div:hover .category-img {\r\n  filter: brightness(40%);\r\n}\r\n\r\n#category-txt {\r\n  position: absolute;\r\n  top: 50%;\r\n  left: 50%;\r\n  transform: translate(-50%, -50%);\r\n  font-size: 14px;\r\n  font-weight: bold;\r\n  z-index: 1;\r\n  pointer-events: none;\r\n}\r\n.category-img {\r\n  filter: brightness(50%);\r\n  width: 100%;\r\n}\r\n\r\n#tp-emoji-frame {\r\n  border: none;\r\n  width: 100%;\r\n  height: 100%;\r\n  \r\n}\r\n\r\n.gif-image-wrapper:hover {\r\n  opacity: 60%;\r\n}\r\nemoji-picker {\r\n  --num-columns: 7;\r\n  --category-emoji-size: 12px;\r\n  --emoji-size: calc(var(--base-width) * 2.75);\r\n  --background: var(--black-25);\r\n  --input-line-height: calc(var(--base-width) * 4);\r\n  --indicator-height: 3px;\r\n  --emoji-padding: calc(var(--base-width) * 2) 0px calc(var(--base-width) * 1) 0px;\r\n  --input-font-size: 14px;\r\n  --input-font-color: var(--black-5);\r\n  --input-border-color: var(--black-15);\r\n  --input-border-size: 1.5px;\r\n  --input-padding: 0px 8px;\r\n  --category-font-size: 11px;\r\n  --category-font-color: var(--white-20);\r\n  --total-category-emoji-size: calc(var(--base-width) * 3);\r\n  height: 100%;\r\n  width: 100%;\r\n  margin-right: 5px;\r\n  overflow: hidden;\r\n  border-radius: 4px 4px 0px 0px;\r\n}\r\n#emoji-picker-container,\r\n#gif-picker-container {\r\n  position: absolute;\r\n  left: -1.5px;\r\n  background: var(--black-25);\r\n  width: calc(var(--base-width) * 34);\r\n  height: calc(var(--base-width) * 34);\r\n  margin: 0px auto;\r\n  display: none;\r\n  z-index: 10;\r\n  bottom: 40px;\r\n  padding: calc(var(--base-width) * 1);\r\n  border: 1.5px solid var(--black-10);\r\n  border-radius: 4px 4px 0px 0px;\r\n  /* overflow-y: scroll;\r\n  overflow-x: hidden; */\r\n}\r\n\r\n#emoji-filter-container .emoji-filter-icons {\r\n  width: 11%;\r\n  height: 100%;\r\n}\r\n\r\n#emoji-filter-container .emoji-filter-icons img {\r\n  width: 100%;\r\n  height: 100%;\r\n}\r\n#emoji-category-container {\r\n  width: 100%;\r\n  height: 100%;\r\n  overflow: auto;\r\n  position: relative;\r\n  margin-top: 4%;\r\n  height: 84%;\r\n}\r\n#emoji-category-container .emoji-category-wrap {\r\n  display: flex;\r\n  flex-flow: wrap row;\r\n  height: auto;\r\n  padding-top: 10px;\r\n}\r\n#emoji-category-container .emoji-category-wrap:first-child {\r\n  padding-top: 0px;\r\n}\r\n#emoji-category-container .emoji-category-wrap p {\r\n  width: 100%;\r\n  padding-bottom: 5px;\r\n}\r\n#emoji-category-container .emoji-category-wrap img {\r\n  width: 15%;\r\n  height: auto;\r\n  padding: 4px;\r\n}\r\n#icon-holder {\r\n  padding: 0px !important;\r\n  margin: 0px !important;\r\n}\r\n#icon-holder-container {\r\n  height: calc(100% - 74px);\r\n  overflow: auto;\r\n}\r\n.icon-holder-wrap {\r\n  padding: 10px 0px;\r\n}\r\n.icon-holder-wrap:first-child {\r\n  padding: 0px;\r\n}\r\n.icon-holder-wrap p {\r\n  padding-bottom: 5px;\r\n}\r\n.setting,\r\n.setting-container {\r\n  display: flex;\r\n  flex-flow: wrap column;\r\n  display: none;\r\n}\r\n.setting-usericon {\r\n  width: 100%;\r\n  display: flex;\r\n  flex-flow: wrap row;\r\n  justify-content: center;\r\n  padding-top: 10px;\r\n}\r\n.setting-usericon img {\r\n  width: 80px;\r\n  height: 80px;\r\n  transform: scale(1);\r\n  transition: transform 0.3s ease;\r\n}\r\n.setting-usericon img:hover {\r\n  transform: scale(1.05);\r\n}\r\n.setting-nickname {\r\n  margin-top: 10px;\r\n}\r\n.setting-nickname .nickname,\r\n.setting-nickname .nickname-input,\r\n.setting-nickname .nickname-wrap {\r\n  width: 100%;\r\n}\r\n.setting-nickname .nickname-wrap {\r\n  display: flex;\r\n  flex-flow: wrap column;\r\n}\r\n.setting-nickname .nickname-input {\r\n  margin-top: 5px;\r\n}\r\n.setting-nickname .nickname-input input {\r\n  border-radius: 2px;\r\n  padding: 8px 10px;\r\n  width: 100%;\r\n  background: var(--black-15);\r\n  border: none !important;\r\n}\r\n.setting-nickname .nickname-input input:hover {\r\n  cursor: auto !important;\r\n}\r\n.tp-emoji-large {\r\n  font-size: 32px !important;\r\n}\r\n\r\n.tp-reaction-btn {\r\n  width: calc(var(--base-width) * 4);\r\n  height: calc(var(--base-width) * 4);\r\n  transition: all 0.2s ease;\r\n  border-radius: 4px;\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n}\r\n\r\n.tp-reaction-btn .tp-reaction-gif {\r\n  display: none;\r\n  width: calc(var(--base-width) * 4);\r\n  height: calc(var(--base-width) * 4);\r\n}\r\n\r\n.tp-reaction-btn:hover .tp-reaction-gif {\r\n  display: block;\r\n}\r\n\r\n.tp-reaction-btn:hover .tp-reaction-static {\r\n  display: none;\r\n}\r\n\r\n.tp-reaction-btn .tp-reaction-static {\r\n  display: block;\r\n  width: calc(var(--base-width) * 3);\r\n  height: calc(var(--base-width) * 3);\r\n}\r\n\r\n.tp-reaction-btn:hover {\r\n  background: var(--black-20);\r\n}\r\n\r\n#reaction-holder {\r\n  display: none;\r\n  position: relative;\r\n  left: 50%;\r\n  transform: translate(-50%);\r\n  flex-direction: row;\r\n  justify-content: space-around;\r\n  align-items: center;\r\n  width: calc(var(--base-width) * 34);\r\n  height: calc(var(--base-width) * 6);\r\n  padding: calc(var(--base-width) * 1);\r\n  padding-top: 0px;\r\n  /* margin-bottom: calc(var(--base-width) * 1); */\r\n  border-bottom: 1.5px solid var(--black-10);\r\n}\r\n\r\n#reaction-holder[style*="display: block"] {\r\n  display: flex !important;\r\n}\r\n\r\n#presence-indicator {\r\n  display: flex;\r\n  height: 24px;\r\n  align-items: end;\r\n}\r\n#patreon,\r\n#patreon-link,\r\n#patreon-container {\r\n  display: flex;\r\n  flex-flow: wrap row;\r\n  justify-content: space-between;\r\n  align-items: center;\r\n  width: 100%;\r\n}\r\n#patreon-container {\r\n  padding-top: 10px;\r\n}\r\n#patreon-link img {\r\n  border-radius: 20px;\r\n  width: 130px;\r\n}\r\n#teleparty-blog-container {\r\n  display: flex;\r\n  flex-flow: wrap row;\r\n  padding-top: 10px;\r\n  z-index: 10;\r\n}\r\n#teleparty-blog-btn {\r\n  display: flex;\r\n  flex-flow: wrap row;\r\n  align-items: center;\r\n  justify-content: space-between;\r\n  width: 100%;\r\n  height: 36px;\r\n}\r\n#teleparty-blog-btn img {\r\n  height: 32px;\r\n}\r\n#teleparty-blog-btn p {\r\n  display: flex;\r\n  flex-flow: wrap row;\r\n  align-items: center;\r\n  font-family: "Poppins", sans-serif !important;\r\n  font-weight: var(--medium);\r\n  background: var(--base-red);\r\n  color: var(--base-white);\r\n  padding: 6px 20px;\r\n  border-radius: 20px;\r\n  height: 100%;\r\n}\r\n#teleparty-blog-btn p:hover {\r\n  cursor: pointer !important;\r\n} /*# sourceMappingURL=style.min.css.map */\r\n\r\n/* Reaction overlay */\r\n:root {\r\n  --reaction-size: 0px;\r\n}\r\n.video-overlay {\r\n  width: calc(100vw - var(--chat-width));\r\n  height: 100%;\r\n  position: fixed;\r\n  top: 0;\r\n  left: 0;\r\n  right: auto;\r\n  bottom: 0;\r\n  cursor: auto;\r\n  z-index: 9999999999;\r\n}\r\n.on-screen-reaction {\r\n  position: absolute;\r\n  bottom: 0;\r\n  font-size: 100px;\r\n  z-index: 9999999999;\r\n}\r\n.on-screen-reaction-1 {\r\n  animation: 5s cubic-bezier(0.5, 1, 0.89, 1) forwards on-screen-reaction-slide,\r\n    12s cubic-bezier(0.5, 1, 0.89, 1) forwards on-screen-reaction-1;\r\n}\r\n.on-screen-reaction-2 {\r\n  animation: 6s cubic-bezier(0.5, 1, 0.89, 1) forwards on-screen-reaction-slide,\r\n    12s cubic-bezier(0.5, 1, 0.89, 1) forwards on-screen-reaction-2;\r\n}\r\n.on-screen-reaction-3 {\r\n  animation: 7s cubic-bezier(0.5, 1, 0.89, 1) forwards on-screen-reaction-slide,\r\n    12s cubic-bezier(0.5, 1, 0.89, 1) forwards on-screen-reaction-3;\r\n}\r\n@keyframes on-screen-reaction-slide {\r\n  0% {\r\n    opacity: 0;\r\n    transform: translateY(calc(0 - var(--reaction-size)));\r\n  }\r\n  20% {\r\n    opacity: 0.8;\r\n  }\r\n  30% {\r\n    opacity: 0.8;\r\n  }\r\n  90% {\r\n    opacity: 0;\r\n  }\r\n  100% {\r\n    transform: translateY(-100vh) translateX(-10px);\r\n    opacity: 0;\r\n  }\r\n}\r\n@keyframes on-screen-reaction-1 {\r\n  10% {\r\n    margin-left: -6px;\r\n  }\r\n  25% {\r\n    margin-left: 4px;\r\n  }\r\n  30% {\r\n    margin-left: -5px;\r\n  }\r\n  45% {\r\n    margin-left: 5px;\r\n  }\r\n  55% {\r\n    margin-left: -3px;\r\n  }\r\n  60% {\r\n    margin-left: 5px;\r\n  }\r\n  70% {\r\n    margin-left: -5px;\r\n  }\r\n  85% {\r\n    margin-left: 5px;\r\n  }\r\n  90% {\r\n    margin-left: -7px;\r\n  }\r\n  100% {\r\n    margin-left: 5px;\r\n  }\r\n}\r\n@keyframes on-screen-reaction-2 {\r\n  15% {\r\n    margin-left: -2px;\r\n  }\r\n  20% {\r\n    margin-left: 5px;\r\n  }\r\n  35% {\r\n    margin-left: -6px;\r\n  }\r\n  40% {\r\n    margin-left: 5px;\r\n  }\r\n  50% {\r\n    margin-left: -5px;\r\n  }\r\n  65% {\r\n    margin-left: 5px;\r\n  }\r\n  70% {\r\n    margin-left: -5px;\r\n  }\r\n  80% {\r\n    margin-left: 4px;\r\n  }\r\n  95% {\r\n    margin-left: -5px;\r\n  }\r\n  100% {\r\n    margin-left: 5px;\r\n  }\r\n}\r\n@keyframes on-screen-reaction-3 {\r\n  15% {\r\n    margin-left: -4px;\r\n  }\r\n  20% {\r\n    margin-left: 5px;\r\n  }\r\n  35% {\r\n    margin-left: -2px;\r\n  }\r\n  40% {\r\n    margin-left: 5px;\r\n  }\r\n  50% {\r\n    margin-left: -3px;\r\n  }\r\n  65% {\r\n    margin-left: 5px;\r\n  }\r\n  70% {\r\n    margin-left: -5px;\r\n  }\r\n  80% {\r\n    margin-left: 5px;\r\n  }\r\n  95% {\r\n    margin-left: -4px;\r\n  }\r\n  100% {\r\n    margin-left: 5px;\r\n  }\r\n}\r\n';
        }
    }, __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (void 0 !== cachedModule) return cachedModule.exports;
        var module = __webpack_module_cache__[moduleId] = {
            exports: {}
        };
        return __webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
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
        var HboVideoType, __awaiter = function(thisArg, _arguments, P, generator) {
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
        function clickAtProgress(target, progress, eventType) {
            const {width, height, left, top} = target.getBoundingClientRect(), x = left + width * progress, y = top + height / 2, clickEvent = document.createEvent("MouseEvents");
            clickEvent.initMouseEvent(eventType, !0, !0, window, 0, 0, 0, x, y, !1, !1, !1, !1, 0, null), 
            target.dispatchEvent(clickEvent);
        }
        function delayUntil(condition, maxDelay, delayStep = 250) {
            return function() {
                const startTime = (new Date).getTime(), checkForCondition = function() {
                    return condition() ? Promise.resolve() : null !== maxDelay && (new Date).getTime() - startTime > maxDelay ? Promise.reject(new Error("delayUntil timed out: " + condition)) : delay(delayStep)().then(checkForCondition);
                };
                return checkForCondition();
            };
        }
        function shove(array, value, limit) {
            array.push(value), array.length > limit && array.splice(0, array.length - limit);
        }
        function median(array) {
            return array.concat().sort()[Math.floor(array.length / 2)];
        }
        !function(HboVideoType) {
            HboVideoType.HBO_EPISODE = "episode", HboVideoType.HBO_FEATURE = "feature", HboVideoType.HBO_EXTRA = "extra", 
            HboVideoType.NONE = "none";
        }(HboVideoType || (HboVideoType = {}));
        class _TaskManager {
            constructor() {
                this.resetTasks(), this._taskArray = [], this._tasksInFlight = 0, this._tasks = Promise.resolve(), 
                this._enabled = !0;
            }
            pushTask(action, name) {
                if (!this._enabled) return;
                const newTask = {
                    action,
                    name
                };
                0 === this._tasksInFlight && this.resetTasks(), this._tasksInFlight = this._taskArray.push(newTask), 
                this._tasks = this._tasks.then((() => {
                    if (this._taskArray.includes(newTask) && this._enabled) return this._swallow(newTask)().then((() => {
                        this._taskArray.shift(), this._tasksInFlight -= 1;
                    }));
                }));
            }
            disable() {
                this._enabled = !1, this.resetTasks();
            }
            resetTasks() {
                this._tasks = Promise.resolve(), this._taskArray = [], this._tasksInFlight = 0;
            }
            _swallow(task) {
                return function() {
                    return task.action().catch((() => {}));
                };
            }
            get tasksInFlight() {
                return this._tasksInFlight;
            }
            hasTaskInQueue(name) {
                return this._taskArray.some((task => task.name === name));
            }
            removeTask(name) {
                console.log(this._taskArray), this._taskArray = this._taskArray.filter(((task, index) => task.name === name && 0 == index ? (console.error("Cannot filter active task"), 
                !0) : task.name !== name)), this._tasksInFlight = this._taskArray.length, console.log(this._taskArray);
            }
        }
        const TaskManager_TaskManager = new _TaskManager;
        var debug = console.log.bind(window.console);
        const EXTENSION_ID = chrome.runtime.id, GIF_API_ENDPOINT = "https://sessions.teleparty.com", DEFAULT_FREQUENT_USED = [ {
            annotation: "face with tears of joy",
            group: 0,
            order: 8,
            tags: [ "face", "joy", "laugh", "tear" ],
            unicode: "😂",
            version: .6,
            emoticon: ":')",
            shortcodes: [ "joy", "lmao", "tears_of_joy" ]
        }, {
            annotation: "smiling face with heart-eyes",
            group: 0,
            order: 16,
            tags: [ "eye", "face", "love", "smile" ],
            unicode: "😍",
            version: .6,
            shortcodes: [ "heart_eyes", "smiling_face_with_heart_eyes" ]
        }, {
            shortcodes: [ "loudly_crying_face", "sob" ],
            annotation: "loudly crying face",
            tags: [ "cry", "face", "sad", "sob", "tear" ],
            unicode: "😭",
            order: 93,
            group: 0,
            version: .6,
            emoticon: ":'o"
        }, {
            shortcodes: [ "pleading", "pleading_face" ],
            annotation: "pleading face",
            tags: [ "begging", "mercy", "puppy eyes" ],
            unicode: "🥺",
            order: 85,
            group: 0,
            version: 11
        }, {
            shortcodes: [ "rofl" ],
            annotation: "rolling on the floor laughing",
            tags: [ "face", "floor", "laugh", "rofl", "rolling", "rotfl" ],
            unicode: "🤣",
            order: 7,
            group: 0,
            version: 3,
            emoticon: ":'D"
        }, {
            annotation: "red heart",
            group: 0,
            order: 149,
            tags: [ "heart" ],
            unicode: "❤️",
            version: .6,
            emoticon: "<3",
            shortcodes: [ "heart", "red_heart" ]
        } ], EMOJI_REGEX = /(?:\uD83D(?:\uDD73\uFE0F?|\uDC41(?:(?:\uFE0F(?:\u200D\uD83D\uDDE8\uFE0F?)?|\u200D\uD83D\uDDE8\uFE0F?))?|[\uDDE8\uDDEF]\uFE0F?|\uDC4B(?:\uD83C[\uDFFB-\uDFFF])?|\uDD90(?:(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F))?|[\uDD96\uDC4C\uDC48\uDC49\uDC46\uDD95\uDC47\uDC4D\uDC4E\uDC4A\uDC4F\uDE4C\uDC50\uDE4F\uDC85\uDCAA\uDC42\uDC43\uDC76\uDC66\uDC67](?:\uD83C[\uDFFB-\uDFFF])?|\uDC71(?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2640\u2642]\uFE0F?))?)|\u200D(?:[\u2640\u2642]\uFE0F?)))?|\uDC68(?:(?:\uD83C(?:\uDFFB(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF]|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?|\uDFFC(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF]|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?|\uDFFD(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?|\uDFFE(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF]|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?|\uDFFF(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE]|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?)|\u200D(?:\uD83E[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD]|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D(?:\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uDC68\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92])|\u2708\uFE0F?|\u2764(?:\uFE0F\u200D\uD83D(?:\uDC8B\u200D\uD83D\uDC68|\uDC68)|\u200D\uD83D(?:\uDC8B\u200D\uD83D\uDC68|\uDC68)))))?|\uDC69(?:(?:\uD83C(?:\uDFFB(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D(?:\uDC69\uD83C[\uDFFC-\uDFFF]|\uDC68\uD83C[\uDFFC-\uDFFF])|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?|\uDFFC(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D(?:\uDC69\uD83C[\uDFFB\uDFFD-\uDFFF]|\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF])|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?|\uDFFD(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D(?:\uDC69\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?|\uDFFE(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D(?:\uDC69\uD83C[\uDFFB-\uDFFD\uDFFF]|\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF])|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?|\uDFFF(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D(?:\uDC69\uD83C[\uDFFB-\uDFFE]|\uDC68\uD83C[\uDFFB-\uDFFE])|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?)|\u200D(?:\uD83E[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD]|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D(?:\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92])|\u2708\uFE0F?|\u2764(?:\uFE0F\u200D\uD83D(?:\uDC8B\u200D\uD83D[\uDC68\uDC69]|[\uDC68\uDC69])|\u200D\uD83D(?:\uDC8B\u200D\uD83D[\uDC68\uDC69]|[\uDC68\uDC69])))))?|[\uDC74\uDC75](?:\uD83C[\uDFFB-\uDFFF])?|[\uDE4D\uDE4E\uDE45\uDE46\uDC81\uDE4B\uDE47\uDC6E](?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|\uDD75(?:(?:\uFE0F(?:\u200D(?:[\u2642\u2640]\uFE0F?))?|\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDC82\uDC77](?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|\uDC78(?:\uD83C[\uDFFB-\uDFFF])?|\uDC73(?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDC72\uDC70\uDC7C](?:\uD83C[\uDFFB-\uDFFF])?|[\uDC86\uDC87\uDEB6](?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDC83\uDD7A](?:\uD83C[\uDFFB-\uDFFF])?|\uDD74(?:(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F))?|\uDC6F(?:\u200D(?:[\u2642\u2640]\uFE0F?))?|[\uDEA3\uDEB4\uDEB5](?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDEC0\uDECC\uDC6D\uDC6B\uDC6C](?:\uD83C[\uDFFB-\uDFFF])?|\uDDE3\uFE0F?|\uDC15(?:\u200D\uD83E\uDDBA)?|[\uDC3F\uDD4A\uDD77\uDD78\uDDFA\uDEE3\uDEE4\uDEE2\uDEF3\uDEE5\uDEE9\uDEF0\uDECE\uDD70\uDD79\uDDBC\uDD76\uDECD\uDDA5\uDDA8\uDDB1\uDDB2\uDCFD\uDD6F\uDDDE\uDDF3\uDD8B\uDD8A\uDD8C\uDD8D\uDDC2\uDDD2\uDDD3\uDD87\uDDC3\uDDC4\uDDD1\uDDDD\uDEE0\uDDE1\uDEE1\uDDDC\uDECF\uDECB\uDD49]\uFE0F?|[\uDE00\uDE03\uDE04\uDE01\uDE06\uDE05\uDE02\uDE42\uDE43\uDE09\uDE0A\uDE07\uDE0D\uDE18\uDE17\uDE1A\uDE19\uDE0B\uDE1B-\uDE1D\uDE10\uDE11\uDE36\uDE0F\uDE12\uDE44\uDE2C\uDE0C\uDE14\uDE2A\uDE34\uDE37\uDE35\uDE0E\uDE15\uDE1F\uDE41\uDE2E\uDE2F\uDE32\uDE33\uDE26-\uDE28\uDE30\uDE25\uDE22\uDE2D\uDE31\uDE16\uDE23\uDE1E\uDE13\uDE29\uDE2B\uDE24\uDE21\uDE20\uDE08\uDC7F\uDC80\uDCA9\uDC79-\uDC7B\uDC7D\uDC7E\uDE3A\uDE38\uDE39\uDE3B-\uDE3D\uDE40\uDE3F\uDE3E\uDE48-\uDE4A\uDC8B\uDC8C\uDC98\uDC9D\uDC96\uDC97\uDC93\uDC9E\uDC95\uDC9F\uDC94\uDC9B\uDC9A\uDC99\uDC9C\uDDA4\uDCAF\uDCA2\uDCA5\uDCAB\uDCA6\uDCA8\uDCA3\uDCAC\uDCAD\uDCA4\uDC40\uDC45\uDC44\uDC8F\uDC91\uDC6A\uDC64\uDC65\uDC63\uDC35\uDC12\uDC36\uDC29\uDC3A\uDC31\uDC08\uDC2F\uDC05\uDC06\uDC34\uDC0E\uDC2E\uDC02-\uDC04\uDC37\uDC16\uDC17\uDC3D\uDC0F\uDC11\uDC10\uDC2A\uDC2B\uDC18\uDC2D\uDC01\uDC00\uDC39\uDC30\uDC07\uDC3B\uDC28\uDC3C\uDC3E\uDC14\uDC13\uDC23-\uDC27\uDC38\uDC0A\uDC22\uDC0D\uDC32\uDC09\uDC33\uDC0B\uDC2C\uDC1F-\uDC21\uDC19\uDC1A\uDC0C\uDC1B-\uDC1E\uDC90\uDCAE\uDD2A\uDDFE\uDDFB\uDC92\uDDFC\uDDFD\uDD4C\uDED5\uDD4D\uDD4B\uDC88\uDE82-\uDE8A\uDE9D\uDE9E\uDE8B-\uDE8E\uDE90-\uDE9C\uDEF5\uDEFA\uDEB2\uDEF4\uDEF9\uDE8F\uDEA8\uDEA5\uDEA6\uDED1\uDEA7\uDEF6\uDEA4\uDEA2\uDEEB\uDEEC\uDCBA\uDE81\uDE9F-\uDEA1\uDE80\uDEF8\uDD5B\uDD67\uDD50\uDD5C\uDD51\uDD5D\uDD52\uDD5E\uDD53\uDD5F\uDD54\uDD60\uDD55\uDD61\uDD56\uDD62\uDD57\uDD63\uDD58\uDD64\uDD59\uDD65\uDD5A\uDD66\uDD25\uDCA7\uDEF7\uDD2E\uDC53-\uDC62\uDC51\uDC52\uDCFF\uDC84\uDC8D\uDC8E\uDD07-\uDD0A\uDCE2\uDCE3\uDCEF\uDD14\uDD15\uDCFB\uDCF1\uDCF2\uDCDE-\uDCE0\uDD0B\uDD0C\uDCBB\uDCBD-\uDCC0\uDCFA\uDCF7-\uDCF9\uDCFC\uDD0D\uDD0E\uDCA1\uDD26\uDCD4-\uDCDA\uDCD3\uDCD2\uDCC3\uDCDC\uDCC4\uDCF0\uDCD1\uDD16\uDCB0\uDCB4-\uDCB8\uDCB3\uDCB9\uDCB1\uDCB2\uDCE7-\uDCE9\uDCE4-\uDCE6\uDCEB\uDCEA\uDCEC-\uDCEE\uDCDD\uDCBC\uDCC1\uDCC2\uDCC5-\uDCD0\uDD12\uDD13\uDD0F-\uDD11\uDD28\uDD2B\uDD27\uDD29\uDD17\uDD2C\uDD2D\uDCE1\uDC89\uDC8A\uDEAA\uDEBD\uDEBF\uDEC1\uDED2\uDEAC\uDDFF\uDEAE\uDEB0\uDEB9-\uDEBC\uDEBE\uDEC2-\uDEC5\uDEB8\uDEAB\uDEB3\uDEAD\uDEAF\uDEB1\uDEB7\uDCF5\uDD1E\uDD03\uDD04\uDD19-\uDD1D\uDED0\uDD4E\uDD2F\uDD00-\uDD02\uDD3C\uDD3D\uDD05\uDD06\uDCF6\uDCF3\uDCF4\uDD31\uDCDB\uDD30\uDD1F-\uDD24\uDD34\uDFE0-\uDFE2\uDD35\uDFE3-\uDFE5\uDFE7-\uDFE9\uDFE6\uDFEA\uDFEB\uDD36-\uDD3B\uDCA0\uDD18\uDD33\uDD32\uDEA9])|\uD83E(?:[\uDD1A\uDD0F\uDD1E\uDD1F\uDD18\uDD19\uDD1B\uDD1C\uDD32\uDD33\uDDB5\uDDB6\uDDBB\uDDD2](?:\uD83C[\uDFFB-\uDFFF])?|\uDDD1(?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?)|\u200D(?:\uD83E(?:\uDD1D\u200D\uD83E\uDDD1|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?)))?|[\uDDD4\uDDD3](?:\uD83C[\uDFFB-\uDFFF])?|[\uDDCF\uDD26\uDD37](?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDD34\uDDD5\uDD35\uDD30\uDD31\uDD36](?:\uD83C[\uDFFB-\uDFFF])?|[\uDDB8\uDDB9\uDDD9-\uDDDD](?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDDDE\uDDDF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?|[\uDDCD\uDDCE\uDDD6\uDDD7\uDD38](?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|\uDD3C(?:\u200D(?:[\u2642\u2640]\uFE0F?))?|[\uDD3D\uDD3E\uDD39\uDDD8](?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDD23\uDD70\uDD29\uDD2A\uDD11\uDD17\uDD2D\uDD2B\uDD14\uDD10\uDD28\uDD25\uDD24\uDD12\uDD15\uDD22\uDD2E\uDD27\uDD75\uDD76\uDD74\uDD2F\uDD20\uDD73\uDD13\uDDD0\uDD7A\uDD71\uDD2C\uDD21\uDD16\uDDE1\uDD0E\uDD0D\uDD1D\uDDBE\uDDBF\uDDE0\uDDB7\uDDB4\uDD3A\uDDB0\uDDB1\uDDB3\uDDB2\uDD8D\uDDA7\uDDAE\uDD8A\uDD9D\uDD81\uDD84\uDD93\uDD8C\uDD99\uDD92\uDD8F\uDD9B\uDD94\uDD87\uDDA5\uDDA6\uDDA8\uDD98\uDDA1\uDD83\uDD85\uDD86\uDDA2\uDD89\uDDA9\uDD9A\uDD9C\uDD8E\uDD95\uDD96\uDD88\uDD8B\uDD97\uDD82\uDD9F\uDDA0\uDD40\uDD6D\uDD5D\uDD65\uDD51\uDD54\uDD55\uDD52\uDD6C\uDD66\uDDC4\uDDC5\uDD5C\uDD50\uDD56\uDD68\uDD6F\uDD5E\uDDC7\uDDC0\uDD69\uDD53\uDD6A\uDD59\uDDC6\uDD5A\uDD58\uDD63\uDD57\uDDC8\uDDC2\uDD6B\uDD6E\uDD5F-\uDD61\uDD80\uDD9E\uDD90\uDD91\uDDAA\uDDC1\uDD67\uDD5B\uDD42\uDD43\uDD64\uDDC3\uDDC9\uDDCA\uDD62\uDD44\uDDED\uDDF1\uDDBD\uDDBC\uDE82\uDDF3\uDE90\uDDE8\uDDE7\uDD47-\uDD49\uDD4E\uDD4F\uDD4D\uDD4A\uDD4B\uDD45\uDD3F\uDD4C\uDE80\uDE81\uDDFF\uDDE9\uDDF8\uDDF5\uDDF6\uDD7D\uDD7C\uDDBA\uDDE3-\uDDE6\uDD7B\uDE71-\uDE73\uDD7E\uDD7F\uDE70\uDDE2\uDE95\uDD41\uDDEE\uDE94\uDDFE\uDE93\uDDAF\uDDF0\uDDF2\uDDEA-\uDDEC\uDE78-\uDE7A\uDE91\uDE92\uDDF4\uDDF7\uDDF9-\uDDFD\uDDEF])|[\u263A\u2639\u2620\u2763\u2764]\uFE0F?|\u270B(?:\uD83C[\uDFFB-\uDFFF])?|[\u270C\u261D](?:(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F))?|\u270A(?:\uD83C[\uDFFB-\uDFFF])?|\u270D(?:(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F))?|\uD83C(?:\uDF85(?:\uD83C[\uDFFB-\uDFFF])?|\uDFC3(?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDFC7\uDFC2](?:\uD83C[\uDFFB-\uDFFF])?|\uDFCC(?:(?:\uFE0F(?:\u200D(?:[\u2642\u2640]\uFE0F?))?|\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDFC4\uDFCA](?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|\uDFCB(?:(?:\uFE0F(?:\u200D(?:[\u2642\u2640]\uFE0F?))?|\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDFF5\uDF36\uDF7D\uDFD4-\uDFD6\uDFDC-\uDFDF\uDFDB\uDFD7\uDFD8\uDFDA\uDFD9\uDFCE\uDFCD\uDF21\uDF24-\uDF2C\uDF97\uDF9F\uDF96\uDF99-\uDF9B\uDF9E\uDFF7\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37]\uFE0F?|\uDFF4(?:(?:\u200D\u2620\uFE0F?|\uDB40\uDC67\uDB40\uDC62\uDB40(?:\uDC65\uDB40\uDC6E\uDB40\uDC67\uDB40\uDC7F|\uDC73\uDB40\uDC63\uDB40\uDC74\uDB40\uDC7F|\uDC77\uDB40\uDC6C\uDB40\uDC73\uDB40\uDC7F)))?|\uDFF3(?:(?:\uFE0F(?:\u200D\uD83C\uDF08)?|\u200D\uD83C\uDF08))?|\uDDE6\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF]|\uDDE7\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF]|\uDDE8\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF]|\uDDE9\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF]|\uDDEA\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA]|\uDDEB\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7]|\uDDEC\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE]|\uDDED\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA]|\uDDEE\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9]|\uDDEF\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5]|\uDDF0\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF]|\uDDF1\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE]|\uDDF2\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF]|\uDDF3\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF]|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE]|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC]|\uDDF8\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF]|\uDDF9\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF]|\uDDFA\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF]|\uDDFB\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA]|\uDDFC\uD83C[\uDDEB\uDDF8]|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C[\uDDEA\uDDF9]|\uDDFF\uD83C[\uDDE6\uDDF2\uDDFC]|[\uDFFB-\uDFFF\uDF38-\uDF3C\uDF37\uDF31-\uDF35\uDF3E-\uDF43\uDF47-\uDF53\uDF45\uDF46\uDF3D\uDF44\uDF30\uDF5E\uDF56\uDF57\uDF54\uDF5F\uDF55\uDF2D-\uDF2F\uDF73\uDF72\uDF7F\uDF71\uDF58-\uDF5D\uDF60\uDF62-\uDF65\uDF61\uDF66-\uDF6A\uDF82\uDF70\uDF6B-\uDF6F\uDF7C\uDF75\uDF76\uDF7E\uDF77-\uDF7B\uDF74\uDFFA\uDF0D-\uDF10\uDF0B\uDFE0-\uDFE6\uDFE8-\uDFED\uDFEF\uDFF0\uDF01\uDF03-\uDF07\uDF09\uDFA0-\uDFA2\uDFAA\uDF11-\uDF20\uDF0C\uDF00\uDF08\uDF02\uDF0A\uDF83\uDF84\uDF86-\uDF8B\uDF8D-\uDF91\uDF80\uDF81\uDFAB\uDFC6\uDFC5\uDFC0\uDFD0\uDFC8\uDFC9\uDFBE\uDFB3\uDFCF\uDFD1-\uDFD3\uDFF8\uDFA3\uDFBD\uDFBF\uDFAF\uDFB1\uDFAE\uDFB0\uDFB2\uDCCF\uDC04\uDFB4\uDFAD\uDFA8\uDF92\uDFA9\uDF93\uDFBC\uDFB5\uDFB6\uDFA4\uDFA7\uDFB7-\uDFBB\uDFA5\uDFAC\uDFEE\uDFF9\uDFE7\uDFA6\uDD8E\uDD91-\uDD9A\uDE01\uDE36\uDE2F\uDE50\uDE39\uDE1A\uDE32\uDE51\uDE38\uDE34\uDE33\uDE3A\uDE35\uDFC1\uDF8C])|\u26F7\uFE0F?|\u26F9(?:(?:\uFE0F(?:\u200D(?:[\u2642\u2640]\uFE0F?))?|\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\u2618\u26F0\u26E9\u2668\u26F4\u2708\u23F1\u23F2\u2600\u2601\u26C8\u2602\u26F1\u2744\u2603\u2604\u26F8\u2660\u2665\u2666\u2663\u265F\u26D1\u260E\u2328\u2709\u270F\u2712\u2702\u26CF\u2692\u2694\u2699\u2696\u26D3\u2697\u26B0\u26B1\u26A0\u2622\u2623\u2B06\u2197\u27A1\u2198\u2B07\u2199\u2B05\u2196\u2195\u2194\u21A9\u21AA\u2934\u2935\u269B\u2721\u2638\u262F\u271D\u2626\u262A\u262E\u25B6\u23ED\u23EF\u25C0\u23EE\u23F8-\u23FA\u23CF\u2640\u2642\u2695\u267E\u267B\u269C\u2611\u2714\u2716\u303D\u2733\u2734\u2747\u203C\u2049\u3030\u00A9\u00AE\u2122]\uFE0F?|[\u0023\u002A\u0030-\u0039](?:\uFE0F\u20E3|\u20E3)|[\u2139\u24C2\u3297\u3299\u25FC\u25FB\u25AA\u25AB]\uFE0F?|[\u2615\u26EA\u26F2\u26FA\u26FD\u2693\u26F5\u231B\u23F3\u231A\u23F0\u2B50\u26C5\u2614\u26A1\u26C4\u2728\u26BD\u26BE\u26F3\u267F\u26D4\u2648-\u2653\u26CE\u23E9-\u23EC\u2B55\u2705\u274C\u274E\u2795-\u2797\u27B0\u27BF\u2753-\u2755\u2757\u26AB\u26AA\u2B1B\u2B1C\u25FE\u25FD])/g, oldIcons = [ "Batman.svg", "DeadPool.svg", "CptAmerica.svg", "Wolverine.svg", "IronMan.svg", "Goofy.svg", "Alien.svg", "Mulan.svg", "Snow-White.svg", "Poohbear.svg", "Sailormoon.svg", "Sailor Cat.svg", "Pizza.svg", "Cookie.svg", "Chocobar.svg", "hotdog.svg", "Hamburger.svg", "Popcorn.svg", "IceCream.svg", "ChickenLeg.svg" ], defaultIcons = [ "General/Alien.svg", "General/Batman.svg", "General/ChickenLeg.svg", "General/Chocobar.svg", "General/Cookie.svg", "General/CptAmerica.svg", "General/DeadPool.svg", "General/Goofy.svg", "General/Hamburger.svg", "General/hotdog.svg", "General/IceCream.svg", "General/IronMan.svg", "General/Mulan.svg", "General/Pizza.svg", "General/Poohbear.svg", "General/Popcorn.svg", "General/Sailor Cat.svg", "General/Sailormoon.svg", "General/Snow-White.svg", "General/Wolverine.svg" ], newIcons = [ "General/Alien.svg", "General/Batman.svg", "General/ChickenLeg.svg", "General/Chocobar.svg", "General/Cookie.svg", "General/CptAmerica.svg", "General/DeadPool.svg", "General/Goofy.svg", "General/Hamburger.svg", "General/hotdog.svg", "General/IceCream.svg", "General/IronMan.svg", "General/Mulan.svg", "General/Pizza.svg", "General/Poohbear.svg", "General/Popcorn.svg", "General/Sailor Cat.svg", "General/Sailormoon.svg", "General/Snow-White.svg", "General/Wolverine.svg", "Christmas/angel.svg", "Christmas/bell.svg", "Christmas/box.svg", "Christmas/cane.svg", "Christmas/flake.svg", "Christmas/gingerbread.svg", "Christmas/gingerbread_F.svg", "Christmas/gingerbread_M.svg", "Christmas/gloves_blue.svg", "Christmas/gloves_red.svg", "Christmas/hat.svg", "Christmas/ornament.svg", "Christmas/raindeer.svg", "Christmas/reef.svg", "Christmas/santa_F.svg", "Christmas/santa_M.svg", "Christmas/snowglobe.svg", "Christmas/snowman.svg", "Christmas/sock.svg", "Christmas/tree.svg", "Halloween/bats.svg", "Halloween/candy_corn.svg", "Halloween/cat_black.svg", "Halloween/cat_white.svg", "Halloween/coffin.svg", "Halloween/eye_ball.svg", "Halloween/face_angry.svg", "Halloween/face_evil.svg", "Halloween/face_silly.svg", "Halloween/face_smile.svg", "Halloween/frankenstein.svg", "Halloween/ghost_F.svg", "Halloween/ghost_M.svg", "Halloween/gravestone.svg", "Halloween/lollipop.svg", "Halloween/moon.svg", "Halloween/mummy.svg", "Halloween/potion.svg", "Halloween/pumpkin.svg", "Halloween/pumpkin_witch.svg", "Halloween/skull_brain.svg", "Halloween/skull_candy.svg", "Halloween/skull_girl.svg", "Halloween/witch_hat.svg", "Thanksgiving/acorn.svg", "Thanksgiving/bread.svg", "Thanksgiving/candles.svg", "Thanksgiving/corn.svg", "Thanksgiving/drinks.svg", "Thanksgiving/maple_leaf.svg", "Thanksgiving/plate_chicken.svg", "Thanksgiving/pumpkin.svg", "Thanksgiving/pumpkin_pie.svg", "Thanksgiving/slice_pie.svg", "Thanksgiving/sun_flower.svg", "Thanksgiving/turkey_face.svg" ], iconMap = {
            General: [ "Alien.svg", "Batman.svg", "ChickenLeg.svg", "Chocobar.svg", "Cookie.svg", "CptAmerica.svg", "DeadPool.svg", "Goofy.svg", "Hamburger.svg", "hotdog.svg", "IceCream.svg", "IronMan.svg", "Mulan.svg", "Pizza.svg", "Poohbear.svg", "Popcorn.svg", "Sailor Cat.svg", "Sailormoon.svg", "Snow-White.svg", "Wolverine.svg" ],
            Christmas: [ "angel.svg", "bell.svg", "box.svg", "cane.svg", "flake.svg", "gingerbread.svg", "gingerbread_F.svg", "gingerbread_M.svg", "gloves_blue.svg", "gloves_red.svg", "hat.svg", "ornament.svg", "raindeer.svg", "reef.svg", "santa_F.svg", "santa_M.svg", "snowglobe.svg", "snowman.svg", "sock.svg", "tree.svg" ],
            Halloween: [ "bats.svg", "candy_corn.svg", "cat_black.svg", "cat_white.svg", "coffin.svg", "eye_ball.svg", "face_angry.svg", "face_evil.svg", "face_silly.svg", "face_smile.svg", "frankenstein.svg", "ghost_F.svg", "ghost_M.svg", "gravestone.svg", "lollipop.svg", "moon.svg", "mummy.svg", "potion.svg", "pumpkin.svg", "pumpkin_witch.svg", "skull_brain.svg", "skull_candy.svg", "skull_girl.svg", "witch_hat.svg" ],
            Thanksgiving: [ "acorn.svg", "bread.svg", "candles.svg", "corn.svg", "drinks.svg", "maple_leaf.svg", "plate_chicken.svg", "pumpkin.svg", "pumpkin_pie.svg", "slice_pie.svg", "sun_flower.svg", "turkey_face.svg" ]
        };
        function escapeStr(str) {
            return str ? str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/[\r\n]{3,}/gm, "\n\n").replace(EMOJI_REGEX, `<span style="font-size: ${function(str) {
                let result = 16;
                const nonEmojiString = str.replace(EMOJI_REGEX, "").replace(/[\uFE0F]/g, ""), emojiCount = ((str || "").match(EMOJI_REGEX) || []).length;
                return 0 === nonEmojiString.length && emojiCount <= 3 && (result = 32), result;
            }(str)}px">$&</span>`) : str;
        }
        const enableIconsetFunctions = {
            General: function() {
                return !0;
            },
            Christmas: function() {
                return 11 === (new Date).getMonth();
            },
            Halloween: function() {
                const date = new Date;
                return 9 === date.getMonth() && date.getDate() >= 24;
            },
            Thanksgiving: function() {
                const date = new Date;
                return 10 === date.getMonth() && date.getDate() >= 18 && date.getDate() <= 28 || 9 === date.getMonth() && date.getDate() >= 8 && date.getDate() <= 14;
            }
        }, closeImage = chrome.extension.getURL("img/x-circle.svg"), ownerOnlyNextEpisodeModal = {
            title: "Teleparty | Disconnected from party",
            content: "Only the owner of this party can change the episode. Click the button below to be redirected to the party, then click on the red Tp icon to rejoin.",
            buttonTitle: "Return to Party"
        }, idleWarningModal = {
            title: "Teleparty | Are you still there?",
            content: "You will be removed from the party in 120 seconds for inactivity. Move your mouse to continue watching."
        }, failedNextEpisodeModal = {
            title: "Teleparty | Disconnected from party",
            content: "It looks like someone changed the video and we weren't able to connect you. Click the button below to be redirected to the party, then click on the red Tp icon to rejoin.",
            buttonTitle: "Return to Party"
        }, lostBackgroundConnectionModal = {
            title: "Teleparty | Disconnected from party",
            content: "It looks like you lost connection to the extension. Click the button below to be redirected to the party, then click on the red Tp icon to rejoin.",
            buttonTitle: "Return to Party"
        };
        function showButtonMessage(options, buttonUrl) {
            hideAlertMessages();
            const modalTemplate = buttonUrl ? function(options) {
                return `\n    <div id="alert-dialog-wrapper">\n      <div id="alert-dialog-container">\n        <div id="alert-title-wrapper">\n            <div class="alert-title">\n                <p id="alert-title-txt" class="extension-title">\n                    ${options.title}\n                </p>\n                <button id="alert-x-btn">\n                    <img src="${closeImage}" alt="close" />\n                </button>\n            </div>\n            <div class="extension-border-bot">\n                \n            </div>\n        </div>\n        <div id="alert-description">\n            <p id="alert-content-txt" class="extension-txt">\n              ${options.content}\n            </p>\n            <button id="alert-return-btn" class="extension-btn">${options.buttonTitle}</button>\n        </div>\n      </div>\n    </div>\n    `;
            }(options) : function(options) {
                return `\n  <div id="alert-dialog-wrapper">\n    <div id="alert-dialog-container">\n      <div id="alert-title-wrapper">\n          <div class="alert-title">\n              <p id="alert-title-txt" class="extension-title">\n                  ${options.title}\n              </p>\n              <button id="alert-x-btn">\n                  <img src="${closeImage}" alt="close" />\n              </button>\n          </div>\n          <div class="extension-border-bot">\n              \n          </div>\n      </div>\n      <div id="alert-description">\n          <p id="alert-content-txt" class="extension-txt">\n            ${options.content}\n          </p>\n      </div>\n    </div>\n  </div>\n  `;
            }(options);
            document.body.insertAdjacentHTML("afterbegin", modalTemplate), jQuery("#alert-x-btn").click((() => {
                hideAlertMessages();
            })), buttonUrl && jQuery("#alert-return-btn").click((() => {
                hideAlertMessages(), window.location.href = buttonUrl;
            }));
        }
        function hideAlertMessages() {
            const alertWrapper = document.querySelector("#alert-dialog-wrapper");
            alertWrapper && alertWrapper.remove();
        }
        const DEFAULT_TEARDOWN = {
            showAlert: !1
        }, IDLE_TEARDOWN = {
            showAlert: !0,
            alertModal: {
                title: "Teleparty | Disconnected from party",
                content: "You were removed from the party from inactivity. Click the button below rejoin the party.",
                buttonTitle: "Return to Party"
            }
        }, INVALID_NEXT_EPISODE_DATA = {
            showAlert: !0,
            alertModal: {
                title: "Teleparty | Disconnected from party",
                content: "Sorry, long parties only work for consecutive episodes for now. Please share a new Teleparty to continue watching together, or click the button below to rejoin the party.",
                buttonTitle: "Return to Party"
            }
        }, FAILED_NEXT_EPISODE_DATA = {
            showAlert: !0,
            alertModal: failedNextEpisodeModal
        }, WRONG_SCREEN_DATA = {
            showAlert: !0,
            alertModal: {
                title: "Teleparty | Disconnected from party",
                content: "It looks like you left the party. You can click the button below to rejoin the party.",
                buttonTitle: "Return to Party"
            }
        };
        class StreamingSerivce {
            constructor(requiredPermissions, contentScripts, serverName, name, syncFromEnd) {
                this.requiredPermissions = requiredPermissions, this.serverName = serverName, this.name = name, 
                this.contentScripts = contentScripts, this.syncFromEnd = syncFromEnd;
            }
            urlWithSessionId(sessionId) {
                return `https://redirect.teleparty.com/join/${sessionId}`;
            }
        }
        var StreamingServiceName;
        !function(StreamingServiceName) {
            StreamingServiceName.NETFLIX = "NETFLIX", StreamingServiceName.HULU = "HULU", StreamingServiceName.DISNEY_PLUS = "DISNEY_PLUS", 
            StreamingServiceName.HBO_MAX = "HBO_MAX", StreamingServiceName.YOUTUBE = "YOUTUBE", 
            StreamingServiceName.AMAZON = "AMAZON";
        }(StreamingServiceName || (StreamingServiceName = {}));
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
        __webpack_require__(640);
        var jquery = __webpack_require__(755), jquery_default = __webpack_require__.n(jquery), HboMaxVideoEventListener_awaiter = function(thisArg, _arguments, P, generator) {
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
        class HboMaxVideoEventListener extends class {
            constructor(videoApi) {
                this._videoApi = videoApi, console.log("Video Event Listener");
            }
            startListening() {
                this._startHeadphoneListener();
            }
            stopListening() {
                this._stopHeadphoneListener();
            }
            _startHeadphoneListener() {
                const nav = navigator;
                nav.mediaSession.setActionHandler("play", (() => __awaiter(this, void 0, void 0, (function*() {
                    this._onVideoUpdateWaitForChange(), this._videoApi.play(), console.log("Bluetooth device played the video");
                })))), nav.mediaSession.setActionHandler("pause", (() => __awaiter(this, void 0, void 0, (function*() {
                    this._onVideoUpdateWaitForChange(), this._videoApi.pause(), console.log("Bluetooth device paused the video");
                }))));
            }
            _stopHeadphoneListener() {
                const nav = navigator;
                nav.mediaSession.setActionHandler("play", null), nav.mediaSession.setActionHandler("pause", null);
            }
            _onVideoUpdate() {
                var _a;
                null === (_a = this._videoMessageForwarder) || void 0 === _a || _a.tryBroadcast(!1);
            }
            _onVideoUpdateWaitForChange() {
                var _a;
                null === (_a = this._videoMessageForwarder) || void 0 === _a || _a.tryBroadcast(!0);
            }
            _onVideoBuffering() {
                var _a;
                null === (_a = this._videoMessageForwarder) || void 0 === _a || _a.setBuffering(!0);
            }
            _onAdStart() {
                var _a;
                null === (_a = this._videoMessageForwarder) || void 0 === _a || _a.setWatchingAds(!0);
            }
            _onAdEnd() {
                var _a;
                null === (_a = this._videoMessageForwarder) || void 0 === _a || _a.setWatchingAds(!1);
            }
            _onVideoCanPlay() {
                var _a;
                null === (_a = this._videoMessageForwarder) || void 0 === _a || _a.setBuffering(!1);
            }
            _onNextEpisode(videoId) {
                var _a;
                null === (_a = this._videoMessageForwarder) || void 0 === _a || _a.sendNextEpisodeAsync(videoId);
            }
            _onTeardown(data) {
                var _a;
                null === (_a = this._videoMessageForwarder) || void 0 === _a || _a.sendTeardown(data);
            }
            setMessageForwarder(videoMessageForwarder) {
                this._videoMessageForwarder = videoMessageForwarder;
            }
            shouldSync() {
                return !0;
            }
        } {
            constructor(videoApi, chatApi) {
                var _a, _b;
                super(videoApi), this._coverCheckRunning = !1, this._onVideoLoad = this.checkWatchingAds.bind(this), 
                this._onUpdate = this._onVideoUpdateWaitForChange.bind(this), this._onBuffering = this._onVideoBuffering.bind(this), 
                this._onCanPlay = this._onVideoCanPlay.bind(this), this._onReplace = this.replaceStateInteraction.bind(this), 
                this._onReload = this.reloadListeners.bind(this), this.onInteraction = this._onInteraction.bind(this), 
                this._upNextClicked = !1, this.F_KEY_CODE = 70, this._resizeHandler = () => {
                    this._videoApi.canFixChat() || delay(100)().then((() => {
                        this._chatApi.getChatVisible() && (document.webkitIsFullScreen ? jquery_default()("video:not(.gif-img):not(.tp-video-gif)").width(window.innerWidth) : jquery_default()("video:not(.gif-img):not(.tp-video-gif)").width(window.innerWidth - 304));
                    }));
                }, this._videoApi = videoApi, this._videoApi.setVideoEventListener(this), this._chatApi = chatApi, 
                this._onNodeMessage = this._videoApi.onNode.bind(this._videoApi), this._coverObserver = new MutationObserver(this.coverChanged.bind(this)), 
                (null === (_a = window.teleparty) || void 0 === _a ? void 0 : _a.injectScriptLoaded) || function(scriptLocation) {
                    const s = document.createElement("script");
                    s.setAttribute("tpInjected", ""), s.src = scriptLocation, (document.head || document.documentElement).appendChild(s), 
                    s.remove();
                }(chrome.extension.getURL("content_scripts/hbo_max/hbo_max_injected_bundled.js")), 
                (null === (_b = window.teleparty) || void 0 === _b ? void 0 : _b.replaceScriptLoaded) || (debug("injecting replace script"), 
                function(script) {
                    const s = document.createElement("script");
                    s.setAttribute("tpInjected", ""), s.textContent = script, (document.head || document.documentElement).appendChild(s), 
                    s.remove();
                }('\n    if(!window.replaceScriptLoaded) {\n      window.replaceScriptLoaded = true;\n      (function(history){\n        var replaceState = history.replaceState;\n        history.replaceState = function(state) {\n          if (typeof history.onreplacestate == "function") {\n            history.onreplacestate({state: state});\n          }\n          return replaceState.apply(history, arguments);\n        }\n        var pushState = history.pushState;\n        history.pushState = function(state) {\n            if (typeof history.onpushstate == "function") {\n                history.onpushstate({state: state});\n            }\n            return pushState.apply(history, arguments);\n        };\n      })(window.history);\n\n      var popInteraction = function(e) {\n        // send message to content script w next episode\n        window.postMessage({ type: "FROM_PAGE_POP", text: "next episode from the webpage!"}, "*");\n      }\n\n      var reloadInteraction = function(e) {\n        // send message to content script w next episode\n        window.postMessage({ type: "FROM_PAGE", text: "next episode from the webpage!"}, "*");\n      }\n      window.onpopstate = popInteraction;\n      history.onreplacestate = history.onpushstate = reloadInteraction;\n    }\n')), 
                this.initListeners();
            }
            _getUpNextButton() {
                return document.querySelector("[aria-label*='Up Next']");
            }
            onCoverChangedAsync() {
                var _a, _b, _c;
                return HboMaxVideoEventListener_awaiter(this, void 0, void 0, (function*() {
                    if (!this._coverCheckRunning && !(null === (_a = this._videoMessageForwarder) || void 0 === _a ? void 0 : _a.changingVideo)) {
                        this._coverCheckRunning = !0;
                        try {
                            yield delayUntil(this._videoApi.removeVideoCover.bind(this._videoApi), 2500)(), 
                            yield delay(500)(), (null === (_b = this._videoMessageForwarder) || void 0 === _b ? void 0 : _b.changingVideo) || (TaskManager_TaskManager.pushTask(this._videoApi.skipPromo), 
                            this.reloadListeners(), null === (_c = this._videoMessageForwarder) || void 0 === _c || _c.forceSync());
                        } catch (e) {
                            this._videoApi.logError("unable to remove video cover", e);
                        } finally {
                            this._coverCheckRunning = !1;
                        }
                    }
                }));
            }
            coverChanged() {
                this.onCoverChangedAsync();
            }
            getPlayCover() {
                return document.querySelector("[style*='icn_tile_play_max_large_3']");
            }
            _onInteraction() {
                return HboMaxVideoEventListener_awaiter(this, void 0, void 0, (function*() {
                    console.log("Interaction"), TaskManager_TaskManager.tasksInFlight < 5 && !TaskManager_TaskManager.hasTaskInQueue("NETFLIX_WAIT_FOR_CHANGE") && this._onVideoUpdateWaitForChange();
                }));
            }
            reloadListeners() {
                this.stopListening(), this.startListening();
            }
            initListeners() {
                window.addEventListener("resize", this._resizeHandler.bind(this)), window.addEventListener("message", this._onReplace, !1), 
                window.addEventListener("FromNode", this._onNodeMessage, !1), window.addEventListener("reloadVideoListener", this._onReload, !1);
            }
            startListening() {
                super.startListening(), this._coverObserver.disconnect(), this._adInterval = setInterval((() => {
                    this.checkWatchingAds();
                }), 2e3);
                const playCover = this.getPlayCover();
                playCover && this._coverObserver.observe(playCover, {
                    childList: !0,
                    characterData: !0,
                    attributes: !0,
                    subtree: !0
                });
                const video = this.getVideo();
                video && (video.addEventListener("waiting", this._onBuffering), video.addEventListener("canplay", this._onCanPlay), 
                video.addEventListener("loadstart", this._onVideoLoad)), window.addEventListener("mouseup", this.onInteraction), 
                window.addEventListener("keyup", this.onInteraction), window.addEventListener("message", this._onReplace, !1), 
                window.addEventListener("FromNode", this._onNodeMessage, !1), this._videoApi.showControls();
            }
            getVideo() {
                const video = jquery_default()("video");
                return video && video.length ? video[0] : void 0;
            }
            stopListening() {
                super.stopListening(), this._coverObserver.disconnect();
                const video = this.getVideo();
                video && (video.removeEventListener("waiting", this._onBuffering), video.removeEventListener("buffering", this._onCanPlay), 
                video.removeEventListener("play", this._onUpdate), video.removeEventListener("pause", this._onUpdate), 
                video.removeEventListener("seeking", this._onUpdate), video.removeEventListener("loadstart", this._onVideoLoad)), 
                this._coverCheckInterval && clearInterval(this._coverCheckInterval), this._adInterval && clearInterval(this._adInterval), 
                window.removeEventListener("resize", this._resizeHandler), window.document.removeEventListener("webkitfullscreenchange", this._resizeHandler), 
                window.removeEventListener("message", this._onReplace, !1), window.removeEventListener("FromNode", this._onNodeMessage, !1), 
                window.addEventListener("reloadVideoListener", this._onReload, !1);
            }
            loadNewVideoAsync(nextEpisodeId) {
                return HboMaxVideoEventListener_awaiter(this, void 0, void 0, (function*() {
                    yield new Promise(((resolve, reject) => {
                        const start = performance.now(), interval = setInterval((() => {
                            if (this._videoApi.checkUpdateId(), this._videoApi.videoId === nextEpisodeId) {
                                const videoElement = this._videoApi.getVideoElement();
                                videoElement instanceof Element && videoElement.src && (clearInterval(interval), 
                                resolve());
                            }
                            performance.now() - start >= 2e4 && (clearInterval(interval), reject("Could not load new video in time."));
                        }), 200);
                    })), yield delayUntil((() => {
                        const updateStateEvent = new CustomEvent("tpVideoNode", {
                            detail: {
                                type: "UpdateState"
                            }
                        });
                        return window.dispatchEvent(updateStateEvent), this._videoApi.isVideoReady();
                    }), 1 / 0)(), yield this._videoApi.skipPromo(), this._resizeHandler(), this._onVideoCanPlay();
                }));
            }
            getVideoTitle() {
                try {
                    return jquery_default()("[style*='metadata_pipe.png']").parent().next().children().children()[1].innerText;
                } catch (e) {
                    return void this._videoApi.logError("unable to get video title (old method)", e);
                }
            }
            _getSlider() {
                const slider = document.querySelector("[style*='slider']");
                if (slider && slider.parentElement && slider.parentElement.parentElement && slider.parentElement.parentElement.parentElement) return slider.parentElement.parentElement.parentElement;
            }
            _waitAdsOver() {
                return HboMaxVideoEventListener_awaiter(this, void 0, void 0, (function*() {
                    yield delayUntil((() => {
                        const updateStateEvent = new CustomEvent("tpVideoNode", {
                            detail: {
                                type: "UpdateState"
                            }
                        });
                        return window.dispatchEvent(updateStateEvent), !this._videoApi.isWatchingAd();
                    }), 1 / 0)(), this._onAdEnd();
                }));
            }
            checkFixUpNext() {
                if (document.querySelector("[data-testid*='UpNext']")) {
                    const upNextRoot = jquery_default()("[data-testid*='UpNext']").closest("[style*='bottom: 125px;']");
                    upNextRoot && upNextRoot.length && (upNextRoot[0].style.paddingRight = this._chatApi.getChatVisible() ? "304px" : "0px");
                }
            }
            checkFixSkipButton() {
                if (document.querySelector("[data-testid='SkipButton']")) {
                    const upNextRoot = jquery_default()("[data-testid='SkipButton']").closest("[style*='bottom: 125px;']");
                    upNextRoot && upNextRoot.length && (upNextRoot[0].style.paddingRight = this._chatApi.getChatVisible() ? "304px" : "0px");
                }
            }
            checkWatchingAds() {
                var _a;
                return HboMaxVideoEventListener_awaiter(this, void 0, void 0, (function*() {
                    this.checkFixUpNext(), this.checkFixSkipButton(), yield this._videoApi.waitUpdateAPIState(), 
                    this._videoApi.isWatchingAd() && !(null === (_a = this._videoMessageForwarder) || void 0 === _a ? void 0 : _a.isWatchingAds()) && (this._onAdStart(), 
                    this._waitAdsOver());
                }));
            }
            _shouldCancelReplace() {
                var _a;
                return null == this._videoMessageForwarder || (null === (_a = this._videoMessageForwarder) || void 0 === _a ? void 0 : _a.changingVideo) && !this._upNextClicked || null == this._videoMessageForwarder.videoId;
            }
            replaceStateInteraction(event) {
                var _a, _b, _c, _d;
                return HboMaxVideoEventListener_awaiter(this, void 0, void 0, (function*() {
                    if (event.source != window || this._shouldCancelReplace()) return;
                    const episodePage = Services_HboMax.getVideoType(new URL(window.location.href)) != HboVideoType.NONE && null != this._videoApi.getVideoElement();
                    if ("FROM_PAGE_POP" !== event.data.type && episodePage) {
                        if (event.data.type && "FROM_PAGE" == event.data.type) {
                            if (debug("Replace called"), "episode" !== this._videoApi.videoType || "episode" !== Services_HboMax.getVideoType(new URL(window.location.href))) return void ((null === (_a = this._videoMessageForwarder) || void 0 === _a ? void 0 : _a.changingVideo) ? this._onTeardown(INVALID_NEXT_EPISODE_DATA) : this._onTeardown(WRONG_SCREEN_DATA));
                            this._videoMessageForwarder && (this._videoMessageForwarder.changingVideo = !0), 
                            this._upNextClicked = !1;
                            try {
                                yield this._videoApi.updateVideoId();
                                const nextVideoId = this._videoApi.videoId;
                                nextVideoId ? this._onNextEpisode(nextVideoId) : debug("No next episode: " + nextVideoId + " : " + (null === (_b = this._videoMessageForwarder) || void 0 === _b ? void 0 : _b.videoId));
                            } catch (err) {
                                null === this._videoApi.getVideoElement && this._onTeardown(DEFAULT_TEARDOWN), debug("Replace failed " + err), 
                                this._videoApi.videoId !== (null === (_c = this._videoMessageForwarder) || void 0 === _c ? void 0 : _c.videoId) ? (null === (_d = this._videoMessageForwarder) || void 0 === _d ? void 0 : _d.changingVideo) ? this._onTeardown(FAILED_NEXT_EPISODE_DATA) : this._onTeardown(INVALID_NEXT_EPISODE_DATA) : this._videoMessageForwarder && (this._videoMessageForwarder.changingVideo = !1);
                            }
                        }
                    } else this._onTeardown(DEFAULT_TEARDOWN);
                }));
            }
        }
        var PopupMessageType;
        !function(PopupMessageType) {
            PopupMessageType.CREATE_SESSION = "createSession", PopupMessageType.RE_INJECT = "reInject", 
            PopupMessageType.GET_INIT_DATA = "getInitData", PopupMessageType.IS_CONTENT_SCRIPT_READY = "isContentScriptReady", 
            PopupMessageType.SET_CHAT_VISIBLE = "setChatVisible", PopupMessageType.DISCONNECT = "teardown", 
            PopupMessageType.CLOSE_POPUP = "closePopup";
        }(PopupMessageType || (PopupMessageType = {}));
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
        class ClientMessage extends Message {
            constructor(sender, target, type) {
                super(sender, target, type), this._type = type;
            }
        }
        var ClientMessageType, BackgroundMessageType, ChatApiMessageType, SidebarMessageType;
        !function(ClientMessageType) {
            ClientMessageType.BROADCAST = "brodadcast", ClientMessageType.BROADCAST_NEXT_EPISODE = "broadcastNextEpisode", 
            ClientMessageType.SEND_MESSAGE = "sendMessage", ClientMessageType.CONTENT_SCRIPT_READY = "contentScriptReady", 
            ClientMessageType.CONTENT_SCRIPT_ERROR = "contentScriptError", ClientMessageType.TEARDOWN = "teardown", 
            ClientMessageType.GET_SESSION_DATA = "getSessionData", ClientMessageType.SET_TYPING = "setTyping", 
            ClientMessageType.SET_BUFFERING = "setBuffering", ClientMessageType.SET_WATCHING_ADS = "setWatchingAds", 
            ClientMessageType.BROADCAST_USER_SETTINGS = "brodadcastUserSettings", ClientMessageType.SEND_REACTION = "sendReaction", 
            ClientMessageType.SEND_GIF = "sendGIF";
        }(ClientMessageType || (ClientMessageType = {}));
        class GetSessionDataMessage extends ClientMessage {
            constructor(sender, target, data) {
                super(sender, target, ClientMessageType.GET_SESSION_DATA), this.data = data;
            }
        }
        !function(BackgroundMessageType) {
            BackgroundMessageType.JOIN_SESSION = "joinSession", BackgroundMessageType.GET_VIDEO_DATA = "getVideoData", 
            BackgroundMessageType.LOAD_SESSION = "loadSession", BackgroundMessageType.NO_SESSION_DATA = "noSessionData", 
            BackgroundMessageType.TEARDOWN = "teardown", BackgroundMessageType.ON_VIDEO_UPDATE = "onVideoUpdate", 
            BackgroundMessageType.SOCKET_LOST_CONNECTION = "socketLostConnection", BackgroundMessageType.REBOOT = "socketReconnect", 
            BackgroundMessageType.LOG_EVENT = "logEvent", BackgroundMessageType.LOG_EXPERIMENT = "logExpirement", 
            BackgroundMessageType.STAY_ALIVE = "stayAlive", BackgroundMessageType.LOAD_CHAT_WINDOW = "loadChatWindow", 
            BackgroundMessageType.RESET_CHAT_WINDOW = "resetChatWindow", BackgroundMessageType.HIDE_CHAT_WINDOW = "hideChatWindow";
        }(BackgroundMessageType || (BackgroundMessageType = {}));
        class CSMessageReceiver {
            constructor() {
                this._messageReceiver = this._onReceiveMesssage.bind(this), this._messageListeners = [], 
                this._registerMessageListener();
            }
            addMessageListener(listener) {
                this._messageListeners.push(listener);
            }
            removeMessageListener(listener) {
                this._messageListeners = this._messageListeners.filter((value => {}));
            }
            _registerMessageListener() {
                Messaging_MessagePasser.addListener(this._messageReceiver);
            }
            teardown() {
                this._messageListeners = [], Messaging_MessagePasser.removeListener(this._messageReceiver);
            }
            _onReceiveMesssage(message, sender, sendResponse) {
                if (!this._shouldListenToMessage(message)) return !1;
                return !!this._doesListenerHandleMessage(message, sender, sendResponse) || (sendResponse({}), 
                !1);
            }
            _shouldListenToMessage(message) {
                return "Content_Script" === message.target;
            }
            _doesListenerHandleMessage(message, sender, sendResponse) {
                let willSendResponse = !1;
                return this._messageListeners.forEach((listener => {
                    listener.onMessage(message, sender, sendResponse) && (willSendResponse = !0);
                })), willSendResponse;
            }
        }
        !function(ChatApiMessageType) {
            ChatApiMessageType.INIT_CHAT = "initChat", ChatApiMessageType.ON_MESSAGE = "onMessage", 
            ChatApiMessageType.ON_BUFFER = "onBuffer", ChatApiMessageType.ON_TYPING = "onTyping", 
            ChatApiMessageType.ON_WATCHING_ADS = "onWatchingAds", ChatApiMessageType.UPDATE_SETTINGS = "updateSettings", 
            ChatApiMessageType.ON_REACTION = "onReaction", ChatApiMessageType.ON_GIF = "onGif", 
            ChatApiMessageType.ON_LOG_EVENT = "onLogEvent";
        }(ChatApiMessageType || (ChatApiMessageType = {})), function(SidebarMessageType) {
            SidebarMessageType.SET_USER_LIST = "setUserList", SidebarMessageType.LOAD_INIT_DATA = "loadInitData", 
            SidebarMessageType.SET_PAGE_TITLE = "setPageTitle", SidebarMessageType.SET_USER_ICON_URL = "setUserIconUrl", 
            SidebarMessageType.ADD_MESSAGE = "addMessage", SidebarMessageType.ADD_GIF_MESSAGE = "addGifMessage", 
            SidebarMessageType.CLEAR_MESSAGES = "clearMessages", SidebarMessageType.SET_PRESENCE_MESSAGE = "setPresenceMessage", 
            SidebarMessageType.ON_PAGE_CLICK = "onPageClick", SidebarMessageType.SIDEBAR_MESSAGING_READY = "sidebarMessagingReady", 
            SidebarMessageType.RESET_VIEW = "resetView", SidebarMessageType.HIDE_CHAT = "hideChat", 
            SidebarMessageType.ON_UPDATE_SETTINGS = "onUpdateSettings", SidebarMessageType.UPDATE_SETTINGS = "updateSettings", 
            SidebarMessageType.SET_REACTIONS_ACTIVE = "setReactionsActive", SidebarMessageType.ON_FOCUS = "onSidebarFocus";
        }(SidebarMessageType || (SidebarMessageType = {}));
        var SessionState, PlaybackState, VideoApiMessageType, ChatMessageForwarder_awaiter = function(thisArg, _arguments, P, generator) {
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
        class ChatMessageForwarder {
            constructor(chatApi, browseScript) {
                this._chatApi = chatApi, this.pageControls = browseScript, debug("Chat forwarder");
            }
            onMessage(message, sender, sendResponse) {
                switch (message.type) {
                  case BackgroundMessageType.LOAD_SESSION:
                    {
                        const loadMessage = message;
                        return this._onLoadSession(loadMessage.data), !1;
                    }

                  case ChatApiMessageType.ON_MESSAGE:
                    {
                        const chatMessage = message;
                        return this._onMessage(chatMessage), this.pageControls.onChatMessage(), !1;
                    }

                  case ChatApiMessageType.ON_BUFFER:
                    {
                        const bufferMessage = message;
                        return this._onBuffer(bufferMessage), !1;
                    }

                  case ChatApiMessageType.ON_TYPING:
                    {
                        const typingMessage = message;
                        return this._onTyping(typingMessage), !1;
                    }

                  case ChatApiMessageType.ON_WATCHING_ADS:
                    {
                        const watchingAdsMessage = message;
                        return this._onWatchingAds(watchingAdsMessage), !1;
                    }

                  case ChatApiMessageType.UPDATE_SETTINGS:
                    {
                        const updateSettingsMessage = message;
                        return this._onUpdateSettings(updateSettingsMessage), !1;
                    }

                  case ChatApiMessageType.ON_REACTION:
                    {
                        const chatMessage = message;
                        return this._onReaction(chatMessage), !1;
                    }

                  case ChatApiMessageType.ON_GIF:
                    {
                        const chatMessage = message;
                        return this._onGif(chatMessage), !1;
                    }

                  case PopupMessageType.SET_CHAT_VISIBLE:
                    {
                        const visibleMessage = message;
                        return this._setChatVisible(visibleMessage.data), sendResponse(), !1;
                    }

                  case SidebarMessageType.SIDEBAR_MESSAGING_READY:
                    {
                        console.log("Sidebar Ready");
                        const tabId = message.tabId;
                        return this._chatApi.setChatFrameReady(null != tabId ? tabId : 0), sendResponse(), 
                        !0;
                    }

                  case SidebarMessageType.ON_UPDATE_SETTINGS:
                    {
                        const newSettingsData = message.data;
                        return this._chatApi.doUpdateSettings(newSettingsData), sendResponse(), !0;
                    }

                  case SidebarMessageType.SET_REACTIONS_ACTIVE:
                    {
                        const activeData = message.data;
                        return this._chatApi.setReactionsActive(activeData), sendResponse(), !0;
                    }

                  case SidebarMessageType.RESET_VIEW:
                    return this._chatApi.resetChatWindow(!0), sendResponse(), !0;

                  case SidebarMessageType.ON_FOCUS:
                    return this._chatApi.onSidebarFocus(), sendResponse(), !0;

                  default:
                    return !1;
                }
            }
            teardown() {
                this._chatApi.teardown();
            }
            _setChatVisible(data) {
                return ChatMessageForwarder_awaiter(this, void 0, void 0, (function*() {
                    this._chatApi.isPartyWindowsActive() ? data.visible ? yield this._chatApi.resetChatWindow() : yield this._chatApi.hideChatWindow() : (yield this._chatApi.setChatVisible(data.visible), 
                    this._chatApi.fixPageControls());
                }));
            }
            _onLoadSession(data) {
                const sessionId = data.sessionCallbackData.sessionId, partyUrl = `https://redirect.teleparty.com/join/${sessionId}`;
                if (this._chatApi.loadInitData(data), this._chatApi.setPartyUrl(partyUrl), this._chatApi.setSessionId(sessionId), 
                this._chatApi._initChat(data.storageData), this.pageControls.onInitChat(), data.showReviewMessage && this._chatApi.addReviewMessage(), 
                !data.isCreate) for (const message of data.sessionCallbackData.messages) "gifObject" in message ? this._chatApi.addGif(message) : this._chatApi.addMessage(message, !0);
            }
            _onMessage(message) {
                this._chatApi.addMessage(message.data);
            }
            _onReaction(message) {
                this._chatApi.showReaction(message.data);
            }
            _onGif(message) {
                this._chatApi.addGif(message.data);
            }
            _onBuffer(message) {
                this._chatApi.onBufferingMessage(message.data);
            }
            _onTyping(message) {
                this._chatApi.onTypingMessage(message.data);
            }
            _onWatchingAds(message) {
                this._chatApi.onWatchingAdsMessage(message.data);
            }
            _onUpdateSettings(message) {
                this._chatApi.onUpdateSettingsMessage(message.data);
            }
        }
        !function(SessionState) {
            SessionState.PAUSED = "paused", SessionState.PLAYING = "playing";
        }(SessionState || (SessionState = {})), function(PlaybackState) {
            PlaybackState.LOADING = "loading", PlaybackState.PLAYING = "playing", PlaybackState.IDLE = "idle", 
            PlaybackState.AD_PLAYING = "ad_playing", PlaybackState.PAUSED = "paused", PlaybackState.NOT_READY = "not_ready";
        }(PlaybackState || (PlaybackState = {})), function(VideoApiMessageType) {
            VideoApiMessageType.UPDATE_SESSION = "updateSession", VideoApiMessageType.NEXT_EPISODE = "nextEpisode", 
            VideoApiMessageType.REBOOT_SESSION = "rebootSession", VideoApiMessageType.GET_SERVER_TIME = "getServerTime", 
            VideoApiMessageType.RELOAD_PARTY = "reloadParty";
        }(VideoApiMessageType || (VideoApiMessageType = {}));
        class BroadcastMessage extends ClientMessage {
            constructor(sender, target, data) {
                super(sender, target, ClientMessageType.BROADCAST), this.data = data;
            }
        }
        class BackgroundMessage extends Message {
            constructor(sender, target, type) {
                super(sender, target, type), this.type = type;
            }
        }
        class TeardownMessage extends BackgroundMessage {
            constructor(sender, target, data) {
                super(sender, target, BackgroundMessageType.TEARDOWN), this.data = data;
            }
        }
        class VideoApiMessage extends Message {
            constructor(sender, target, type) {
                super(sender, target, type), this.type = type;
            }
        }
        class GetServerTimeMessage extends VideoApiMessage {
            constructor(sender, target) {
                super(sender, target, VideoApiMessageType.GET_SERVER_TIME);
            }
        }
        class BroadcastNextEpisodeMessage extends ClientMessage {
            constructor(sender, target, data) {
                super(sender, target, ClientMessageType.BROADCAST_NEXT_EPISODE), this.data = data;
            }
        }
        class SetBufferingMessage extends ClientMessage {
            constructor(sender, target, data) {
                super(sender, target, ClientMessageType.SET_BUFFERING), this.data = data;
            }
        }
        class SetWatchingAdsMessage extends ClientMessage {
            constructor(sender, target, data) {
                super(sender, target, ClientMessageType.SET_WATCHING_ADS), this.data = data;
            }
        }
        class LogEventMessage extends BackgroundMessage {
            constructor(sender, target, data) {
                super(sender, target, BackgroundMessageType.LOG_EVENT), this.data = data, this.sender = sender, 
                this.target = target;
            }
        }
        class StayAliveMessage extends BackgroundMessage {
            constructor(sender, target, data) {
                super(sender, target, BackgroundMessageType.STAY_ALIVE), this.data = data;
            }
        }
        const ChromeStorageReadError = "Failed to read chrome storage. Please refresh the page and try again", GenericErrorMessage = "An unexpected error occured. Please refresh the page and try again.";
        var ChromeStorageReader_awaiter = function(thisArg, _arguments, P, generator) {
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
                return ChromeStorageReader_awaiter(this, void 0, void 0, (function*() {
                    return new Promise(((resolve, reject) => {
                        chrome.storage.local.get(items, (result => {
                            chrome.runtime.lastError ? reject(new Error(ChromeStorageReadError)) : resolve(result);
                        }));
                    }));
                }));
            }
            getAllItemsAsync() {
                return ChromeStorageReader_awaiter(this, void 0, void 0, (function*() {
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
        var VideoMessageForwarder_awaiter = function(thisArg, _arguments, P, generator) {
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
        class VideoMessageForwarder {
            constructor(videoApi, chatApi, videoEventListener) {
                this._roundTripTimeRecent = [], this._roundTripTimeMedian = 0, this._localTimeMinusServerTimeMedian = 0, 
                this._localTimeMinusServerTimeRecent = [], this._selfWatchingAds = !1, this._watchingAds = !1, 
                this._hostOnly = !1, this._firstSyncCompleted = !1, this._adblockEnabled = void 0, 
                this.checkForAdblock = () => VideoMessageForwarder_awaiter(this, void 0, void 0, (function*() {
                    try {
                        yield fetch("https://www3.doubleclick.net", {
                            method: "HEAD",
                            mode: "no-cors",
                            cache: "no-store"
                        }), this._adblockEnabled = !1;
                    } catch (error) {
                        this._adblockEnabled = !0;
                    }
                })), this.broadcastAsync = (waitForChange = !1, nextEpisode = !1) => VideoMessageForwarder_awaiter(this, void 0, void 0, (function*() {
                    if (this._changingVideo) return;
                    if (this._hostOnly) return void this.forceSync();
                    if (!this._firstSyncCompleted) return;
                    const updateMessage = yield this._getUpdateMessageForVideoStateAsync();
                    if (yield this._shouldSendBroadcast(updateMessage.data, nextEpisode)) yield this._sendBroadcastMessage(updateMessage); else if (waitForChange) {
                        if (yield this._waitForChange(nextEpisode)) {
                            const newUpdateMessage = yield this._getUpdateMessageForVideoStateAsync();
                            yield this._sendBroadcastMessage(newUpdateMessage);
                        }
                    }
                })), this._sync = () => VideoMessageForwarder_awaiter(this, void 0, void 0, (function*() {
                    if (this._serverState == SessionState.PAUSED && this._heartBeatInterval && (clearInterval(this._heartBeatInterval), 
                    this._heartBeatInterval = setInterval((() => {
                        this._logHeartBeat();
                    }), 6e4)), this._shouldCancelSync()) return;
                    if (yield this._videoApi.waitVideoDoneLoadingAsync(), this._shouldCancelSync()) return;
                    const videoState = yield this._videoApi.getStateAsync();
                    this._serverState == SessionState.PAUSED ? yield this._checkPaused(videoState) : this._serverState == SessionState.PLAYING && (yield this._checkPlaying(videoState)), 
                    !1 === this._firstSyncCompleted && (this._firstSyncCompleted = !0);
                })), this._videoApi = videoApi, this._chatApi = chatApi, this._videoEventListener = videoEventListener, 
                this._videoEventListener.setMessageForwarder(this), this._videoChangeStartTime = 0, 
                this._changingVideo = !1, this._serverState = SessionState.PAUSED, this._lastKnownServerTime = 0, 
                this._lastKnownServerTimeUpdatedAt = 0, this._lastUpdateEventTime = 0, this._streamingServiceName = this._videoApi.getStreamingServiceName(), 
                debug("Video forwarder"), this.checkForAdblock();
            }
            onMessage(message, sender, sendResponse) {
                switch (message.type) {
                  case BackgroundMessageType.GET_VIDEO_DATA:
                    return this._sendVideoDataAsync(sendResponse), !0;

                  case BackgroundMessageType.LOAD_SESSION:
                    {
                        const loadSessionMessage = message;
                        return this._loadSessionDataAsync(loadSessionMessage.data), !1;
                    }

                  case VideoApiMessageType.UPDATE_SESSION:
                    {
                        const updateSessionMessage = message;
                        return this._updateSessionData(updateSessionMessage.data), !1;
                    }

                  case VideoApiMessageType.NEXT_EPISODE:
                    {
                        const nextEpisodeMessage = message;
                        return this._onNextEpisodeAsync(nextEpisodeMessage.data), !1;
                    }

                  case VideoApiMessageType.REBOOT_SESSION:
                    {
                        const rebootMessage = message;
                        return this._doReboot(rebootMessage.data, sendResponse), !0;
                    }

                  case VideoApiMessageType.RELOAD_PARTY:
                    return this.reloadPartyMessageAsync().then((() => console.log("Party Reloaded"))), 
                    !0;

                  case ChatApiMessageType.ON_WATCHING_ADS:
                    {
                        const watchingAdsMessage = message;
                        return this._onWatchingAds(watchingAdsMessage), !1;
                    }

                  default:
                    return !1;
                }
            }
            _onWatchingAds(message) {
                message.data.anyoneWatchingAds && !this._watchingAds && (TaskManager_TaskManager.pushTask(this._videoApi.doAdCheck.bind(this._videoApi)), 
                this.forceSync()), this._watchingAds = message.data.anyoneWatchingAds;
            }
            get videoId() {
                return this._videoId;
            }
            set videoId(value) {
                this._videoId = value;
            }
            sendTeardown(data) {
                const teardownMessage = new TeardownMessage("Content_Script", "Service_Background", data);
                Messaging_MessagePasser.sendMessageToExtension(teardownMessage);
            }
            teardown() {
                this._sessionId = void 0, this._syncInterval && clearInterval(this._syncInterval), 
                this._heartBeatInterval && clearInterval(this._heartBeatInterval), this._videoApi.pause(), 
                TaskManager_TaskManager.disable(), this._videoEventListener.stopListening();
            }
            _doReboot(rebootSessionData, sendResponse) {
                TaskManager_TaskManager.resetTasks(), this._videoId == rebootSessionData.videoId && this._updateSessionData(rebootSessionData), 
                sendResponse(this._videoId == rebootSessionData.videoId);
                const logReconnect = new LogEventMessage("Content_Script", "Service_Background", {
                    eventType: "reboot",
                    sessionId: this._sessionId
                });
                Messaging_MessagePasser.sendMessageToExtension(logReconnect);
            }
            tryBroadcast(waitForChange = !1) {
                this._selfWatchingAds || (this._hostOnly ? this.forceSync() : 0 != this._videoApi.uiEventsHappening || this._changingVideo || !this._sessionId || TaskManager_TaskManager.hasTaskInQueue("BROADCAST") || TaskManager_TaskManager.pushTask((() => this.broadcastAsync(waitForChange)), "BROADCAST"));
            }
            setBuffering(buffering) {
                if (this._sessionId) {
                    const setBufferingMessage = new SetBufferingMessage("Content_Script", "Service_Background", {
                        buffering
                    });
                    Messaging_MessagePasser.sendMessageToExtension(setBufferingMessage);
                }
            }
            isWatchingAds() {
                return this._selfWatchingAds;
            }
            setWatchingAds(watchingAds) {
                if (this._sessionId) {
                    this._selfWatchingAds = watchingAds;
                    const setWatchingAdsMessage = new SetWatchingAdsMessage("Content_Script", "Service_Background", {
                        watchingAds
                    });
                    Messaging_MessagePasser.sendMessageToExtension(setWatchingAdsMessage);
                }
            }
            sendNextEpisodeAsync(nextEpisodeId) {
                return VideoMessageForwarder_awaiter(this, void 0, void 0, (function*() {
                    if (this._sessionId && nextEpisodeId !== this._videoId && nextEpisodeId !== this._lastSentVideoId) {
                        this._lastSentVideoId = nextEpisodeId, this._changingVideo = !0;
                        const nextEpisodeMessage = new BroadcastNextEpisodeMessage("Content_Script", "Service_Background", {
                            nextEpisode: nextEpisodeId
                        }), response = yield Messaging_MessagePasser.sendMessageToExtension(nextEpisodeMessage);
                        response && "Locked Session" === response.errorMessage && (yield this._waitTillEpisodeChangesAsync(nextEpisodeId));
                    }
                }));
            }
            _waitTillEpisodeChangesAsync(nextEpisodeId) {
                return VideoMessageForwarder_awaiter(this, void 0, void 0, (function*() {
                    try {
                        yield delayUntil((() => nextEpisodeId == this._videoId), 1e4)(), this._changingVideo = !1;
                    } catch (error) {
                        this._logError("An error has occured when trying to wait till the episode changed videos");
                        const tearDownData = {
                            showAlert: !0,
                            alertModal: ownerOnlyNextEpisodeModal
                        };
                        this.sendTeardown(tearDownData);
                    }
                }));
            }
            _shouldSendBroadcast(data, nextEpisode) {
                return VideoMessageForwarder_awaiter(this, void 0, void 0, (function*() {
                    if (null == data.lastKnownTime || null == data.lastKnownTimeUpdatedAt || null == data.state) return !1;
                    if (nextEpisode && data.state === SessionState.PAUSED && data.lastKnownTime < 1e3) return !1;
                    const dif = Math.abs(data.lastKnownTime - this._getCurrentServerTime());
                    if (data.state == this._serverState && dif < 1e3) return !1;
                    if (dif >= 1e3) {
                        const logEventMessage = new LogEventMessage("Content_Script", "Service_Background", {
                            name: "video_seek",
                            action: {
                                source: "self"
                            }
                        });
                        Messaging_MessagePasser.sendMessageToExtension(logEventMessage), this._streamingServiceName == StreamingServiceName.AMAZON ? yield delay(200)() : this._streamingServiceName == StreamingServiceName.HBO_MAX && (yield delay(500)());
                    }
                    return !0;
                }));
            }
            _getUpdateMessageForVideoStateAsync() {
                return VideoMessageForwarder_awaiter(this, void 0, void 0, (function*() {
                    const updateSessionData = yield this._videoApi.getUpdateSessionDataAsync();
                    updateSessionData.lastKnownTimeUpdatedAt -= this._localTimeMinusServerTimeMedian, 
                    updateSessionData.lastKnownTime = Math.round(updateSessionData.lastKnownTime);
                    return new BroadcastMessage("Content_Script", "Service_Background", updateSessionData);
                }));
            }
            forceSync() {
                TaskManager_TaskManager.pushTask(this._sync, "SYNC");
            }
            _onNextEpisodeAsync(nextEpisodeMessageData) {
                return VideoMessageForwarder_awaiter(this, void 0, void 0, (function*() {
                    this._videoChangeStartTime = Date.now(), TaskManager_TaskManager.pushTask((() => this._continueNextEpisodeAsync(nextEpisodeMessageData)));
                }));
            }
            _continueNextEpisodeAsync(nextEpisodeMessageData) {
                return VideoMessageForwarder_awaiter(this, void 0, void 0, (function*() {
                    try {
                        debug("Continue next episode called"), this._changingVideo = !0, yield this._videoApi.jumpToNextEpisode(nextEpisodeMessageData), 
                        yield this._videoEventListener.loadNewVideoAsync(nextEpisodeMessageData.videoId), 
                        debug("After load new video"), this._videoEventListener.reloadListeners(), this._lastUpdateEventTime < this._videoChangeStartTime && (this._serverState = SessionState.PAUSED, 
                        this._lastKnownServerTime = 0, this._lastKnownServerTimeUpdatedAt = Date.now(), 
                        debug("Sending broadcast after next episode"), TaskManager_TaskManager.pushTask((() => this.broadcastAsync(!0, !0)), "BROADCAST"), 
                        TaskManager_TaskManager.removeTask("SYNC")), this._videoId = nextEpisodeMessageData.videoId, 
                        this._changingVideo = !1;
                        const logEventMessage = new LogEventMessage("Content_Script", "Service_Background", {
                            name: "video_start",
                            action: {
                                description: "video session has begun"
                            }
                        });
                        Messaging_MessagePasser.sendMessageToExtension(logEventMessage);
                    } catch (error) {
                        this._logError("Error loading new video."), console.log("Error was", error), yield this.reloadPartyMessageAsync();
                    }
                }));
            }
            reloadPartyMessageAsync() {
                var _a, _b;
                return VideoMessageForwarder_awaiter(this, void 0, void 0, (function*() {
                    try {
                        const sessionData = yield this.getVideoEndPointData();
                        sessionData.date = Date.now();
                        const redirectURL = yield this.parseRedirectUrl(sessionData), tabId = null !== (_b = null === (_a = window.teleparty) || void 0 === _a ? void 0 : _a.tabId) && void 0 !== _b ? _b : 0, stayAliveMessage = new StayAliveMessage("Content_Script", "Service_Background", {
                            tabId
                        });
                        yield Messaging_MessagePasser.sendMessageToExtension(stayAliveMessage), yield ChromeStorage_SessionMap.storeRedirectDataForTabAsync(sessionData, tabId), 
                        window.location.href = redirectURL;
                    } catch (error) {
                        this._logError("Failed to fix next episode.");
                        const teardownMessage = new TeardownMessage("Content_Script", "Service_Background", {
                            showAlert: !0,
                            alertModal: failedNextEpisodeModal
                        });
                        Messaging_MessagePasser.sendMessageToExtension(teardownMessage);
                    }
                }));
            }
            getVideoEndPointData() {
                return VideoMessageForwarder_awaiter(this, void 0, void 0, (function*() {
                    return new Promise(((resolve, reject) => {
                        const xhr = new XMLHttpRequest;
                        xhr.timeout = 1e4, xhr.ontimeout = () => {
                            reject(new Error);
                        }, xhr.onreadystatechange = () => {
                            if (xhr.readyState === XMLHttpRequest.DONE) try {
                                const sessionData = JSON.parse(xhr.responseText);
                                resolve(sessionData);
                            } catch (err) {
                                reject(err), this._logError("Unable to get video endpoint data to reload session");
                            }
                        }, xhr.open("GET", "https://sessions.teleparty.com/video?session=" + this._sessionId, !0), 
                        xhr.send(null);
                    }));
                }));
            }
            parseRedirectUrl(sessionData) {
                if ("object" == typeof (obj = sessionData) && null !== obj && "videoService" in obj && "videoId" in obj) {
                    switch (sessionData.videoService.toLowerCase()) {
                      case "netflix":
                        return `https://www.netflix.com/watch/${sessionData.videoId}`;

                      case "hulu":
                        return `https://www.hulu.com/watch/${sessionData.videoId}`;

                      case "disney":
                        return `https://www.disneyplus.com/video/${sessionData.videoId}`;

                      case "amazon":
                        {
                            const serviceDomain = sessionData.serviceDomain;
                            if (serviceDomain) return `https://${serviceDomain}/gp/video/detail/${sessionData.videoId}?autoplay=1`;
                            throw new Error("No service Domain");
                        }

                      case "hbomax":
                        {
                            const videoType = sessionData.videoType;
                            if (videoType) {
                                return `https://play.hbomax.com/${videoType}/urn:hbo:${videoType}:${sessionData.videoId}`;
                            }
                            throw new Error("No Video Type");
                        }

                      case "youtube":
                        {
                            const videoId = sessionData.videoId;
                            return videoId ? `https://www.youtube.com/watch?v=${videoId}?autoplay=1&mute=1` : "https://www.youtube.com/";
                        }

                      default:
                        throw new Error;
                    }
                }
                var obj;
                throw new Error("Invalid Session Response");
            }
            _updateSessionData(data) {
                this._lastUpdateEventTime = Date.now(), TaskManager_TaskManager.pushTask(this._receiveSessionData(data).bind(this));
            }
            _receiveSessionData(data) {
                if (data.state === SessionState.PAUSED && this._serverState === SessionState.PLAYING) {
                    this._logHeartBeat();
                    const logEventMessage = new LogEventMessage("Content_Script", "Service_Background", {
                        name: "video_pause",
                        action: {
                            description: "video was played from pause",
                            reason: "Video was played"
                        }
                    });
                    Messaging_MessagePasser.sendMessageToExtension(logEventMessage);
                } else if (data.state === SessionState.PLAYING && this._serverState === SessionState.PAUSED) {
                    const logData = {
                        name: "video_resume",
                        action: {
                            description: "video was played from pause",
                            reason: "Video was played"
                        }
                    };
                    this._logHeartBeat();
                    const logEventMessage = new LogEventMessage("Content_Script", "Service_Background", logData);
                    Messaging_MessagePasser.sendMessageToExtension(logEventMessage);
                }
                return this._serverState = data.state, this._lastKnownServerTime = data.lastKnownTime, 
                this._lastKnownServerTimeUpdatedAt = data.lastKnownTimeUpdatedAt, this._sync;
            }
            _sendVideoDataAsync(sendResponse) {
                var _a;
                return VideoMessageForwarder_awaiter(this, void 0, void 0, (function*() {
                    try {
                        const videoData = yield this._videoApi.getVideoDataAsync(), videoState = yield this._videoApi.getStateAsync();
                        videoData.is_player_fullscreen = null !== document.fullscreenElement, videoData.is_chat_visible = this._chatApi.getChatVisible(), 
                        videoData.is_adblock_enabled = this._adblockEnabled, videoData.video_ts_ms = videoState.playbackPositionMilliseconds, 
                        videoData.party_ts_ms = this._lastKnownServerTime, sendResponse(videoData);
                    } catch (error) {
                        this._logError(null !== (_a = error.message) && void 0 !== _a ? _a : "Unable to send video data"), 
                        sendResponse({
                            error
                        });
                    }
                }));
            }
            _logError(message) {
                const logEventMessage = new LogEventMessage("Content_Script", "Service_Background", {
                    name: "video_error",
                    action: {
                        description: message,
                        reason: "An errors has occurred during video playback"
                    }
                });
                Messaging_MessagePasser.sendMessageToExtension(logEventMessage);
            }
            _waitForChange(nextEpisode) {
                return VideoMessageForwarder_awaiter(this, void 0, void 0, (function*() {
                    return new Promise((resolve => {
                        const start = performance.now(), checkForChange = () => VideoMessageForwarder_awaiter(this, void 0, void 0, (function*() {
                            if (performance.now() - start >= 2500) resolve(!1); else {
                                const updateMessage = yield this._getUpdateMessageForVideoStateAsync();
                                (yield this._shouldSendBroadcast(updateMessage.data, nextEpisode)) ? resolve(!0) : setTimeout((() => {
                                    checkForChange();
                                }), 50);
                            }
                        }));
                        checkForChange();
                    }));
                }));
            }
            _sendBroadcastMessage(updateMessage) {
                return VideoMessageForwarder_awaiter(this, void 0, void 0, (function*() {
                    if (this._changingVideo) return;
                    const oldState = this._serverState;
                    if (updateMessage.data.bufferingState) {
                        updateMessage.data.state = SessionState.PAUSED, yield Messaging_MessagePasser.sendMessageToExtension(updateMessage), 
                        yield this._videoApi.waitVideoDoneLoadingAsync();
                        const newUpdateMessage = yield this._getUpdateMessageForVideoStateAsync();
                        newUpdateMessage.data.bufferingState = !0, oldState == SessionState.PLAYING && (newUpdateMessage.data.state = SessionState.PLAYING), 
                        yield Messaging_MessagePasser.sendMessageToExtension(newUpdateMessage);
                    } else yield Messaging_MessagePasser.sendMessageToExtension(updateMessage);
                }));
            }
            _loadSessionDataAsync(loadSessionData) {
                return VideoMessageForwarder_awaiter(this, void 0, void 0, (function*() {
                    const sessionData = loadSessionData.sessionCallbackData;
                    this._sessionId = sessionData.sessionId, this._serverState = sessionData.state, 
                    this._lastKnownServerTime = Number(sessionData.lastKnownTime), this._lastKnownServerTimeUpdatedAt = Number(sessionData.lastKnownTimeUpdatedAt), 
                    this._videoId = sessionData.videoId, this._watchingAds = !1, sessionData.ownerId && (this._hostOnly = !0), 
                    loadSessionData.isCreate ? (this._firstSyncCompleted = !0, TaskManager_TaskManager.pushTask(this.broadcastAsync.bind(this), "BROADCAST")) : this.forceSync();
                    const logEventMessage = new LogEventMessage("Content_Script", "Service_Background", {
                        name: "video_start",
                        action: {
                            description: "video session has begun"
                        }
                    });
                    Messaging_MessagePasser.sendMessageToExtension(logEventMessage), this._videoEventListener.startListening(), 
                    this._setupSyncInterval();
                }));
            }
            _ping() {
                return new Promise((resolve => {
                    const getServerTimeMessage = new GetServerTimeMessage("Content_Script", "Service_Background"), startTime = Date.now();
                    Messaging_MessagePasser.sendMessageToExtension(getServerTimeMessage).then((response => {
                        const now = Date.now();
                        if (response) {
                            const serverTime = response.serverTime;
                            serverTime && (shove(this._roundTripTimeRecent, now - startTime, 5), this._roundTripTimeMedian = median(this._roundTripTimeRecent), 
                            shove(this._localTimeMinusServerTimeRecent, now - Math.round(this._roundTripTimeMedian / 2) - serverTime, 5), 
                            this._localTimeMinusServerTimeMedian = median(this._localTimeMinusServerTimeRecent));
                        }
                    })).catch((error => {
                        debug(error), this._logError(error);
                    })), resolve();
                }));
            }
            _logHeartBeat() {
                const logEventMessage = new LogEventMessage("Content_Script", "Service_Background", {
                    name: "video_heartbeat",
                    action: {
                        description: "new heartbeat",
                        reason: "Heartbeat session was due"
                    }
                });
                Messaging_MessagePasser.sendMessageToExtension(logEventMessage);
            }
            _setupSyncInterval() {
                this._syncInterval && clearInterval(this._syncInterval), this._heartBeatInterval && clearInterval(this._heartBeatInterval), 
                this._syncInterval = setInterval((() => {
                    TaskManager_TaskManager.hasTaskInQueue("SYNC") || TaskManager_TaskManager.pushTask(this._sync, "SYNC");
                }), 5e3), this._heartBeatInterval = setInterval((() => {
                    this._logHeartBeat();
                }), 6e4), this._pingInterval = setInterval((() => {
                    TaskManager_TaskManager.hasTaskInQueue("PING") || TaskManager_TaskManager.pushTask(this._ping.bind(this), "PING");
                }), 12500), this._ping();
            }
            _shouldCancelSync() {
                return !this._sessionId || this._videoApi.uiEventsHappening > 0 || this._selfWatchingAds || this._changingVideo || !this._videoEventListener.shouldSync();
            }
            _checkPaused(videoState) {
                return VideoMessageForwarder_awaiter(this, void 0, void 0, (function*() {
                    const {playbackState, playbackPositionMilliseconds} = videoState;
                    if (playbackState !== PlaybackState.PAUSED && (yield this._videoApi.pause()), Math.abs(this._lastKnownServerTime - playbackPositionMilliseconds) > 2500) {
                        yield this._videoApi.setCurrentTime(this._lastKnownServerTime);
                        const logEventMessage = new LogEventMessage("Content_Script", "Service_Background", {
                            name: "video_seek",
                            action: {
                                source: "another user"
                            }
                        });
                        Messaging_MessagePasser.sendMessageToExtension(logEventMessage);
                    }
                }));
            }
            _checkPlaying(videoState) {
                return VideoMessageForwarder_awaiter(this, void 0, void 0, (function*() {
                    const {playbackState, playbackPositionMilliseconds} = videoState, serverTime = this._getCurrentServerTime();
                    if (playbackState == PlaybackState.PAUSED && (yield this._videoApi.play()), Math.abs(serverTime - playbackPositionMilliseconds) > 2500) {
                        yield this._videoApi.setCurrentTime(serverTime), yield this._videoApi.play();
                        const logEventMessage = new LogEventMessage("Content_Script", "Service_Background", {
                            name: "video_seek",
                            action: {
                                source: "another user"
                            }
                        });
                        Messaging_MessagePasser.sendMessageToExtension(logEventMessage);
                    }
                }));
            }
            _getServerTimeLapsed() {
                return this._serverState === SessionState.PLAYING ? Date.now() - (this._lastKnownServerTimeUpdatedAt + this._localTimeMinusServerTimeMedian) : 0;
            }
            _getCurrentServerTime() {
                return this._lastKnownServerTime + this._getServerTimeLapsed();
            }
            get changingVideo() {
                return this._changingVideo;
            }
            set changingVideo(changing) {
                this._changingVideo = changing;
            }
        }
        var ContentScript_awaiter = function(thisArg, _arguments, P, generator) {
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
        var VideoApi_awaiter = function(thisArg, _arguments, P, generator) {
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
        var ReactionTypes, HboMaxVideoApi_awaiter = function(thisArg, _arguments, P, generator) {
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
        class HboMaxVideoApi extends class {
            constructor() {
                this._uiEventsHappening = 0, this._hostOnly = !1;
            }
            set hostOnly(hostOnly) {
                this._hostOnly = hostOnly;
            }
            get hostOnly() {
                return this._hostOnly;
            }
            get uiEventsHappening() {
                return this._uiEventsHappening;
            }
            getScreenSize() {
                return {
                    width: window.outerWidth,
                    height: window.outerHeight
                };
            }
            getVideoContent(id, name, url, type, episodeData) {
                let episodeNum, seasonNum, episodeName;
                return episodeData && (episodeData.episodeNum && !isNaN(episodeData.episodeNum) && (episodeNum = episodeData.episodeNum), 
                episodeData.seasonNum && !isNaN(episodeData.seasonNum) && (seasonNum = episodeData.seasonNum), 
                episodeName = episodeData.title), {
                    id,
                    type,
                    name,
                    url,
                    episode: episodeNum,
                    season: seasonNum,
                    episode_name: episodeName,
                    service: this.getStreamingServiceName()
                };
            }
            logError(data, error) {
                const logEventMessage = new LogEventMessage("Content_Script", "Service_Background", {
                    name: "video_error",
                    action: {
                        description: data,
                        reason: error
                    }
                });
                Messaging_MessagePasser.sendMessageToExtension(logEventMessage);
            }
            doAdCheck() {
                return VideoApi_awaiter(this, void 0, void 0, (function*() {}));
            }
        } {
            constructor() {
                var _a, _b;
                super(), this._playCheckRunning = !1, this._checkVideoDelay = 500, this._stateUpdatedAt = 0, 
                this.videoIds = {}, this.videoTitle = null !== (_a = this._getVideoTitle()) && void 0 !== _a ? _a : "", 
                this._videoType = Services_HboMax.getVideoType(new URL(window.location.href)), this._playEvent = new CustomEvent("tpVideoNode", {
                    detail: {
                        type: "play"
                    }
                }), this._pauseEvent = new CustomEvent("tpVideoNode", {
                    detail: {
                        type: "pause"
                    }
                }), this._uiEventsHappening = 0, this.videoDuration = 0, this._playerState = {
                    time: 0,
                    playbackState: 1,
                    currentAd: void 0,
                    duration: 0,
                    videoId: null !== (_b = this._getDefaultVideoId()) && void 0 !== _b ? _b : "",
                    canFixChat: !0
                };
            }
            canFixChat() {
                return this._playerState.canFixChat;
            }
            isWatchingAd() {
                return void 0 !== this._playerState.currentAd;
            }
            setVideoEventListener(videoEventListener) {
                this._videoEventListener = videoEventListener;
            }
            get videoType() {
                return this._videoType;
            }
            getSeriesName() {
                return this._playerState.seriesName;
            }
            get playCheckRunning() {
                return this._playCheckRunning;
            }
            set playCheckRunning(value) {
                this._playCheckRunning = value;
            }
            onNode(evt) {
                const detail = evt.detail;
                if ("ManualClick" == detail.type) {
                    const video = this.getVideoElement();
                    video && (this._clickAtProgress(video, .5, "mousedown"), this._clickAtProgress(video, .5, "mouseup"));
                } else "StateUpdate" == detail.type && (this._stateUpdatedAt = detail.updatedAt, 
                this._playerState = detail.playerState);
            }
            removeVideoCover() {
                if (jQuery("[aria-label*='Choose language']").length) return !1;
                if (!jQuery("[style*='btn_play_large_initial']").length || !jQuery("[style*='btn_play_large_initial']").is(":visible")) return !(!jQuery("[data-testid='ContentDetailsPlayVideoButton']").length || !jQuery("[data-testid='ContentDetailsPlayVideoButton']").is(":visible")) && (jQuery("[data-testid='ContentDetailsPlayVideoButton']").click(), 
                !0);
                jQuery("[style*='btn_play_large_initial']").addClass("startPlay");
                const startPlay = document.querySelector(".startPlay");
                return !!startPlay && (this._clickAtProgress(startPlay, .5, "mousedown"), this._clickAtProgress(startPlay, .5, "mouseup"), 
                !0);
            }
            loadVideoData() {
                var _a;
                this.videoTitle = null !== (_a = this._getVideoTitle()) && void 0 !== _a ? _a : "", 
                this._videoType = Services_HboMax.getVideoType(new URL(window.location.href));
            }
            isVideoReady() {
                const state = this._getPlaybackState();
                return "paused" === state || "playing" === state;
            }
            waitVideoApiReadyAsync() {
                var _a, _b;
                return HboMaxVideoApi_awaiter(this, void 0, void 0, (function*() {
                    console.log("checking if joining");
                    const joiningSession = null != (yield ChromeStorage_SessionMap.getRedirectDataForTabAsync(null !== (_b = null === (_a = window.teleparty) || void 0 === _a ? void 0 : _a.tabId) && void 0 !== _b ? _b : 0));
                    yield delayUntil((() => (joiningSession && this.removeVideoCover(), this._videoType = Services_HboMax.getVideoType(new URL(window.location.href)), 
                    null != this.getVideoElement() && this._videoType !== HboVideoType.NONE)), 1 / 0, this._checkVideoDelay)(), 
                    joiningSession && this.removeVideoCover(), yield this.waitUpdateAPIState(), yield this.skipPromo(), 
                    this.loadVideoData();
                }));
            }
            waitVideoDoneLoadingAsync() {
                var _a;
                return HboMaxVideoApi_awaiter(this, void 0, void 0, (function*() {
                    yield null === (_a = this._videoEventListener) || void 0 === _a ? void 0 : _a.checkWatchingAds();
                    const video = this.getVideoElement();
                    video && 1 === video.readyState && (this._clickAtProgress(video, .5, "mousedown"), 
                    this._clickAtProgress(video, .5, "mouseup")), yield delayUntil((() => {
                        const updateStateEvent = new CustomEvent("tpVideoNode", {
                            detail: {
                                type: "UpdateState"
                            }
                        });
                        return window.dispatchEvent(updateStateEvent), this._getPlaybackState() !== PlaybackState.LOADING;
                    }), 5e3)();
                }));
            }
            get videoId() {
                return this._videoId;
            }
            set videoId(value) {
                this._videoId = value;
            }
            checkUpdateId() {
                this._playerState.videoId != this.videoId && (debug("Id change"), this.videoId = this._playerState.videoId);
            }
            getStateAsync() {
                return HboMaxVideoApi_awaiter(this, void 0, void 0, (function*() {
                    return yield this.waitUpdateAPIState(), new Promise(((resolve, reject) => {
                        const playbackState = this._getPlaybackState(), playbackPositionMilliseconds = this._getPlaybackPositionMiliseconds();
                        null != playbackState && null != playbackPositionMilliseconds ? resolve({
                            playbackState,
                            playbackPositionMilliseconds
                        }) : reject();
                    }));
                }));
            }
            waitUpdateAPIState() {
                var _a, _b, _c, _d, _e, _f;
                return HboMaxVideoApi_awaiter(this, void 0, void 0, (function*() {
                    const currentTime = Date.now(), updateStateEvent = new CustomEvent("tpVideoNode", {
                        detail: {
                            type: "UpdateState"
                        }
                    });
                    window.dispatchEvent(updateStateEvent);
                    try {
                        yield delayUntil((() => this._stateUpdatedAt >= currentTime), 500, 10)();
                    } catch (error) {
                        this._playerState = {
                            playbackState: (null === (_a = this.getVideoElement()) || void 0 === _a ? void 0 : _a.paused) ? 3 : 2,
                            time: Math.floor(1e3 * (null !== (_c = null === (_b = this.getVideoElement()) || void 0 === _b ? void 0 : _b.currentTime) && void 0 !== _c ? _c : 0)),
                            currentAd: void 0,
                            videoId: null !== (_d = this._getDefaultVideoId()) && void 0 !== _d ? _d : "",
                            duration: Math.floor(1e3 * (null !== (_f = null === (_e = this.getVideoElement()) || void 0 === _e ? void 0 : _e.duration) && void 0 !== _f ? _f : 0)),
                            canFixChat: !0,
                            seriesName: this._playerState.seriesName
                        }, this._stateUpdatedAt = Date.now();
                    }
                }));
            }
            getVideoDataAsync() {
                var _a, _b, _c;
                return HboMaxVideoApi_awaiter(this, void 0, void 0, (function*() {
                    yield this.waitUpdateAPIState(), this.loadVideoData(), this._videoId = this._playerState.videoId;
                    const videoTitle = this._getVideoTitle(), screen = this.getScreenSize(), episodeData = this._getEpisodeData(), content = this.getVideoContent(null !== (_a = this.videoId) && void 0 !== _a ? _a : "", null != videoTitle ? videoTitle : "", window.location.href, this._videoType, episodeData), state = yield this.getStateAsync();
                    return {
                        videoTitle: this.videoTitle,
                        videoDuration: Math.floor(null !== (_b = this._playerState.duration) && void 0 !== _b ? _b : 0),
                        videoId: null !== (_c = this._playerState.videoId) && void 0 !== _c ? _c : "",
                        videoType: this._videoType,
                        screen,
                        content,
                        videoState: state.playbackState
                    };
                }));
            }
            jumpToNextEpisode(nextEpisodeMessageData) {
                return HboMaxVideoApi_awaiter(this, void 0, void 0, (function*() {
                    if (this._uiEventsHappening += 1, this.videoId !== nextEpisodeMessageData.videoId) try {
                        window.dispatchEvent(new CustomEvent("tpVideoNode", {
                            detail: {
                                type: "nextEpisode",
                                videoId: nextEpisodeMessageData.videoId,
                                videoType: nextEpisodeMessageData.videoType
                            }
                        }));
                    } catch (error) {
                        debug("Click next episode failed, but we will wait and see if the video changes in time. " + error), 
                        this.logError("Click next episode failed, but we will wait and see if the video changes in time. ", error);
                    }
                    this._uiEventsHappening -= 1;
                }));
            }
            skipPromo() {
                return HboMaxVideoApi_awaiter(this, void 0, void 0, (function*() {}));
            }
            getStreamingServiceName() {
                return StreamingServiceName.HBO_MAX;
            }
            pause() {
                return new Promise(((resolve, reject) => {
                    debug("Attempting to pause"), this._uiEventsHappening += 1, (() => {
                        HboMaxVideoApi_awaiter(this, void 0, void 0, (function*() {
                            try {
                                window.dispatchEvent(this._pauseEvent), yield delayUntil((() => {
                                    const updateStateEvent = new CustomEvent("tpVideoNode", {
                                        detail: {
                                            type: "UpdateState"
                                        }
                                    });
                                    return window.dispatchEvent(updateStateEvent), this._getPlaybackState() === PlaybackState.PAUSED;
                                }), 2500)(), resolve();
                            } catch (error) {
                                this.logError("video was unable to pause correctly", error), reject(error);
                            } finally {
                                this._uiEventsHappening -= 1;
                            }
                        }));
                    })();
                }));
            }
            play() {
                return new Promise(((resolve, reject) => {
                    debug("Attempting to play"), this._uiEventsHappening += 1, (() => {
                        HboMaxVideoApi_awaiter(this, void 0, void 0, (function*() {
                            try {
                                window.dispatchEvent(this._playEvent), yield delayUntil((() => {
                                    const updateStateEvent = new CustomEvent("tpVideoNode", {
                                        detail: {
                                            type: "UpdateState"
                                        }
                                    });
                                    return window.dispatchEvent(updateStateEvent), this._getPlaybackState() === PlaybackState.PLAYING;
                                }), 2500)(), resolve();
                            } catch (error) {
                                this.logError("video was unable to play correctly", error), reject(error);
                            } finally {
                                this._uiEventsHappening -= 1;
                            }
                        }));
                    })();
                }));
            }
            freeze(milliseconds) {
                return HboMaxVideoApi_awaiter(this, void 0, void 0, (function*() {
                    this._uiEventsHappening += 1;
                    try {
                        yield this.pause(), yield delay(milliseconds)(), yield this.play();
                    } finally {
                        this._uiEventsHappening -= 1;
                    }
                }));
            }
            setCurrentTime(time) {
                return HboMaxVideoApi_awaiter(this, void 0, void 0, (function*() {
                    debug("Seek called", !0), this._uiEventsHappening += 1;
                    try {
                        window.dispatchEvent(new CustomEvent("tpVideoNode", {
                            detail: {
                                type: "seek",
                                time: time / 1e3
                            }
                        })), yield delay(500)(), yield this.waitVideoDoneLoadingAsync();
                    } finally {
                        this._uiEventsHappening -= 1;
                    }
                }));
            }
            _getDuration() {
                return this.videoDuration;
            }
            _getPlaybackPositionMiliseconds() {
                return Math.floor(this._playerState.time);
            }
            getVideoElement() {
                return document.querySelector("video");
            }
            _getPlaybackState() {
                const video = this.getVideoElement();
                return null === video || "" === video.src ? PlaybackState.NOT_READY : 4 == this._playerState.playbackState ? PlaybackState.LOADING : 3 == this._playerState.playbackState ? PlaybackState.PAUSED : 2 == this._playerState.playbackState ? PlaybackState.PLAYING : PlaybackState.NOT_READY;
            }
            _getVideoTitle() {
                try {
                    const header = document.querySelector("div[role='heading']");
                    if (header) {
                        return header.innerText.split("\n")[0];
                    }
                    return;
                } catch (e) {
                    return void this.logError("unable to get video title", e);
                }
            }
            _getEpisodeData() {
                var _a, _b, _c, _d, _e, _f;
                let episodeData = {};
                const heading = document.querySelector("div[role='heading']");
                if (heading) {
                    const metadata = heading.innerText.split("\n");
                    if (metadata[1] && this._videoType === HboVideoType.HBO_EPISODE) {
                        const match_season = null !== (_b = null === (_a = metadata[1]) || void 0 === _a ? void 0 : _a.match(/S(\d*)/)) && void 0 !== _b ? _b : [ "" ], match_episode = null !== (_d = null === (_c = metadata[1]) || void 0 === _c ? void 0 : _c.match(/E(\d*)/)) && void 0 !== _d ? _d : [ "" ], match_title = null !== (_f = null === (_e = metadata[1]) || void 0 === _e ? void 0 : _e.match(/:\s(.*)/)) && void 0 !== _f ? _f : [ "" ];
                        episodeData = {
                            episodeNum: Number(match_episode[1]),
                            seasonNum: Number(match_season[1]),
                            title: match_title[1]
                        };
                    }
                }
                return episodeData;
            }
            tryUpdateVideoTitle() {
                const currentTitle = this._getVideoTitle();
                return null != currentTitle && currentTitle !== this.videoTitle && (debug("New current Title: " + currentTitle), 
                this.videoTitle = currentTitle, !0);
            }
            updateVideoId() {
                return HboMaxVideoApi_awaiter(this, void 0, void 0, (function*() {
                    yield this.waitUpdateAPIState(), debug("Trying to update Video iD");
                    try {
                        yield delayUntil((() => {
                            const updateStateEvent = new CustomEvent("tpVideoNode", {
                                detail: {
                                    type: "UpdateState"
                                }
                            });
                            return window.dispatchEvent(updateStateEvent), !(!this._playerState.videoId || this._playerState.videoId == this.videoId) && (this.videoId = this._playerState.videoId, 
                            !0);
                        }), 1e4)(), debug("UPDATED VIDEO ID: " + this.videoTitle + "|" + this.videoId);
                    } catch (e) {
                        throw this.logError("unable to get new vieoId in time with error " + e), new Error("Couldn't get new videoId in time.");
                    }
                }));
            }
            _getDefaultVideoId() {
                return Services_HboMax.getVideoId(new URL(window.location.href));
            }
            triggerNextEpisode() {
                const videoElement = this.getVideoElement();
                if (null === videoElement) throw new Error("Video element not found.");
                debug("TRIGGERING NEXT EPISODE"), videoElement.currentTime = videoElement.duration;
            }
            showControls() {
                var _a, _b, _c, _d;
                this._uiEventsHappening += 1, jQuery("video").addClass("videoObject");
                const videoObject = document.querySelector(".videoObject");
                if (videoObject) {
                    const mouseX = 100, mouseY = 100, windowJquery = jQuery(window), eventOptions = {
                        bubbles: !0,
                        button: 0,
                        screenX: mouseX - (null !== (_a = windowJquery.scrollLeft()) && void 0 !== _a ? _a : 0),
                        screenY: mouseY - (null !== (_b = windowJquery.scrollTop()) && void 0 !== _b ? _b : 0),
                        clientX: mouseX - (null !== (_c = windowJquery.scrollLeft()) && void 0 !== _c ? _c : 0),
                        clientY: mouseY - (null !== (_d = windowJquery.scrollTop()) && void 0 !== _d ? _d : 0),
                        offsetX: mouseX,
                        offsetY: mouseY,
                        pageX: mouseX,
                        pageY: mouseY,
                        currentTarget: videoObject
                    };
                    videoObject.dispatchEvent(new MouseEvent("mousemove", eventOptions));
                }
                this._uiEventsHappening -= 1;
            }
            _getSlider() {
                const slider = document.querySelector("[style*='slider']");
                if (slider && slider.parentElement && slider.parentElement.parentElement && slider.parentElement.parentElement.parentElement) return slider.parentElement.parentElement.parentElement;
            }
            _clickAtProgress(target, progress, eventType) {
                const {width, height, left, top} = target.getBoundingClientRect(), x = left + width * progress, y = top + height / 2, clickEvent = document.createEvent("MouseEvents");
                clickEvent.initMouseEvent(eventType, !0, !0, window, 0, 0, 0, x, y, !1, !1, !1, !1, 0, null), 
                target.dispatchEvent(clickEvent);
            }
            getUpdateSessionDataAsync() {
                return HboMaxVideoApi_awaiter(this, void 0, void 0, (function*() {
                    yield this.waitUpdateAPIState();
                    const currentTime = this._getPlaybackPositionMiliseconds();
                    if (void 0 === currentTime) throw new Error;
                    const video = this.getVideoElement();
                    return {
                        state: video && !video.paused ? SessionState.PLAYING : SessionState.PAUSED,
                        lastKnownTime: currentTime,
                        lastKnownTimeUpdatedAt: Date.now()
                    };
                }));
            }
        }
        !function(ReactionTypes) {
            ReactionTypes.HEART = "heart", ReactionTypes.ANGRY = "angry", ReactionTypes.FIRE = "fire", 
            ReactionTypes.LAUGH = "laugh", ReactionTypes.CRY = "cry", ReactionTypes.SURPRISE = "surprise";
        }(ReactionTypes || (ReactionTypes = {}));
        var ChatEventListener_awaiter = function(thisArg, _arguments, P, generator) {
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
        class ChatEventListener {
            constructor(chatApi) {
                this.onFocus = this.onWindowFocus.bind(this), this._onReset = this.resetIdleTimer.bind(this), 
                this.globalClick = this._globalClick.bind(this), this.cancelEvent = this._cancelEvent.bind(this), 
                this.onEmojiClick = this._onEmojiClick.bind(this), this.onMessage = this._onMessage.bind(this), 
                this._chatApi = chatApi;
            }
            onIdleWarning() {
                debug("Idle Warning called"), showButtonMessage(idleWarningModal);
                const idleWarnMessage = new LogEventMessage("Content_Script", "Service_Background", {
                    name: "party_warning",
                    action: {
                        description: "user has been warned for being idle",
                        reason: "user was idle for 120000 time in milliseconds."
                    }
                });
                Messaging_MessagePasser.sendMessageToExtension(idleWarnMessage);
                const oldIdleWarnMessage = new LogEventMessage("Content_Script", "Service_Background", {
                    eventType: "idle-warn-2hr",
                    sessionId: this._chatApi.getSessionId()
                });
                Messaging_MessagePasser.sendMessageToExtension(oldIdleWarnMessage), this._idleKickTimeout = setTimeout(this.onIdleTimeout.bind(this), 12e4);
            }
            onIdleTimeout() {
                debug("Idle kick called");
                const logIdleKickMessage = new LogEventMessage("Content_Script", "Service_Background", {
                    name: "party_kick",
                    action: {
                        description: "user has been kicked for being idle",
                        reason: "user was idle for 7200000 time in milliseconds."
                    }
                }), teardownMessage = new TeardownMessage("Content_Script", "Service_Background", IDLE_TEARDOWN);
                Messaging_MessagePasser.sendMessageToExtension(logIdleKickMessage), Messaging_MessagePasser.sendMessageToExtension(teardownMessage);
            }
            resetIdleTimer() {
                this._idleWarningTimeout && clearTimeout(this._idleWarningTimeout), this._idleKickTimeout && (hideAlertMessages(), 
                clearTimeout(this._idleKickTimeout)), this._idleWarningTimeout = setTimeout(this.onIdleWarning.bind(this), 72e5);
            }
            setupIdleListeners() {
                this._idleWarningTimeout = setTimeout(this.onIdleWarning.bind(this), 72e5), window.onmousemove = e => {
                    e.isTrusted && this._onReset();
                }, window.onfocus = () => this._onReset(), window.onmousedown = () => this._onReset(), 
                window.ontouchstart = () => this._onReset(), window.onkeydown = () => this._onReset();
            }
            removeIdleListeners() {
                this._idleWarningTimeout && clearTimeout(this._idleWarningTimeout), this._idleKickTimeout && clearTimeout(this._idleKickTimeout), 
                window.onmousemove = null, window.onmousedown = null, window.ontouchstart = null, 
                window.onkeydown = null;
            }
            startListening() {
                debug("Listening for chat events"), this.setupIdleListeners(), this._initChatListeners(), 
                this.initWindowListeners();
            }
            stopListening() {
                this._removeChatListeners(), this.removeIdleListeners(), this._removeWindowListeners();
            }
            onWindowFocus() {
                this._chatApi.clearUnreadCount();
            }
            _onMessage(ev) {
                "TP_EMOJI_REQ_RELOAD" === ev.data && this.updateFrequentlyUsed(), ev.data && "emoji-click" === ev.data.type && this._onEmojiClick(ev.data);
            }
            _pasteHandler(e) {
                if (console.log("Pasting"), e.preventDefault(), e.clipboardData) {
                    const text = e.clipboardData.getData("text/plain");
                    document.execCommand("insertHTML", !1, text);
                }
                this._chatApi.onInputChange();
            }
            initWindowListeners() {
                jQuery(window).on("focus", this.onFocus), window.addEventListener("message", this.onMessage), 
                document.addEventListener("dragstart", this._dragHandler.bind(this)), document.addEventListener("webkitfullscreenchange", this._chatApi.onFullScreen), 
                document.addEventListener("fullscreenchange", this._chatApi.onFullScreen), document.addEventListener("keydown", this.cancelEvent, !0), 
                document.addEventListener("emoji-click", this.onEmojiClick), document.addEventListener("click", this.globalClick);
            }
            _initChatListeners() {
                jQuery(".user-icon").on("click", this._chatApi.toggleLargeUserIconButton.bind(this._chatApi)), 
                jQuery("#user-icon").on("click", this._chatApi.toggleIconContainer.bind(this._chatApi)), 
                jQuery("#link-icon").on("click", this._chatApi.linkIconListener.bind(this._chatApi)), 
                jQuery("#reset-icon").on("click", this._chatApi.resetIconListener.bind(this._chatApi)), 
                jQuery(".image-button").on("click", this._chatApi.userIconSelectorListener.bind(this._chatApi)), 
                jQuery("#chat-input-container").on("keydown", this._chatApi.onChatKeyDown.bind(this._chatApi)), 
                jQuery("#nickname-edit").on("keydown", this._chatApi.onChatKeyDown.bind(this._chatApi)), 
                jQuery("#chat-input").on("keypress", this._chatApi.onChatKeyPress.bind(this._chatApi)), 
                jQuery("#chat-input").on("input", this._chatApi.onInputChange.bind(this._chatApi)), 
                jQuery("#gif-search").on("keyup", this._chatApi.onGifSearch.bind(this._chatApi)), 
                jQuery("#saveChanges").on("click", this._chatApi.saveChangesListener.bind(this._chatApi)), 
                jQuery("#cancelNickname").on("click", this._chatApi.cancelNicknameListener.bind(this._chatApi)), 
                jQuery("#chat-wrapper").on("mouseup", this._chatApi.cancelEvent), jQuery("#chat-wrapper").on("mousedown", this._chatApi.cancelEvent), 
                jQuery("#chat-wrapper").on("pointerup", this._chatApi.cancelEvent), jQuery("#chat-wrapper").on("pointerdown", this._chatApi.cancelEvent), 
                jQuery("#chat-wrapper").on("mousemove", this._chatApi.cancelEvent), jQuery("#chat-wrapper").on("pointermove", this._chatApi.cancelEvent), 
                jQuery("#chat-wrapper").on("keyup", this._chatApi.onChatKeyUp.bind(this._chatApi)), 
                jQuery("#emoji-picker-btn").on("click", this._chatApi.addEmojiPicker.bind(this._chatApi)), 
                jQuery("#gif-btn").on("click", this._chatApi.addGifPicker.bind(this._chatApi)), 
                jQuery(".gif-img").on("click", this._chatApi.clickGif.bind(this._chatApi)), jQuery(".gif-results").on("click", "video", this._chatApi.clickGif.bind(this._chatApi)), 
                jQuery("#category-container").on("click", "video", this._chatApi.clickGif.bind(this._chatApi)), 
                jQuery("#gif-input-back").on("click", this._chatApi.resetGif.bind(this._chatApi)), 
                jQuery("#reaction-btn-icon").on("click", this._chatApi.addReactionTab.bind(this._chatApi)), 
                jQuery("#chat-input-container").on("click", this._onChatInputClicked.bind(this)), 
                jQuery("#chat-input").on("input", this._inputHandler.bind(this)), jQuery("#chat-input").on("drop", this._dropHandler.bind(this)), 
                jQuery("#chat-input")[0].addEventListener("paste", this._pasteHandler.bind(this)), 
                jQuery("#gif-results-wrapper").on("scroll", this._chatApi.onScrollToBottom.bind(this._chatApi)), 
                this._initializeReactions(), this._chatApi.initCustomListeners();
            }
            _initializeReactions() {
                jQuery("#tp-heart-button").on("click", (() => {
                    this._chatApi.onReactionClicked(ReactionTypes.HEART);
                })), jQuery("#tp-cry-button").on("click", (() => {
                    this._chatApi.onReactionClicked(ReactionTypes.CRY);
                })), jQuery("#tp-angry-button").on("click", (() => {
                    this._chatApi.onReactionClicked(ReactionTypes.ANGRY);
                })), jQuery("#tp-surprise-button").on("click", (() => {
                    this._chatApi.onReactionClicked(ReactionTypes.SURPRISE);
                })), jQuery("#tp-laugh-button").on("click", (() => {
                    this._chatApi.onReactionClicked(ReactionTypes.LAUGH);
                })), jQuery("#tp-fire-button").on("click", (() => {
                    this._chatApi.onReactionClicked(ReactionTypes.FIRE);
                }));
            }
            _cancelEvent(e) {
                e.target !== jQuery("#chat-input")[0] && e.target !== jQuery("#nickname-edit")[0] || e.stopImmediatePropagation();
            }
            _inputHandler() {
                var _a, _b;
                const bottomSize = null !== (_a = jQuery("#bottom-chat-controls").outerHeight(!0)) && void 0 !== _a ? _a : parseInt(jQuery("#bottom-chat-controls").css("height")), paddingSize = parseInt(jQuery("#chat-input-container").css("padding-bottom")), chatSize = (null !== (_b = jQuery("#chat-input").outerHeight(!0)) && void 0 !== _b ? _b : parseInt(jQuery("#chat-input").css("height"))) + bottomSize + paddingSize;
                jQuery("#emoji-picker-container").css({
                    bottom: chatSize
                }), jQuery("#gif-picker-container").css({
                    bottom: chatSize
                });
            }
            _dropHandler(event) {
                event.preventDefault();
            }
            _dragHandler(event) {
                event.preventDefault();
            }
            _onChatInputClicked(event) {
                event.target === jQuery("#chat-input")[0] && this._chatApi.focusChat();
            }
            _globalClick(event) {
                const clickedItem = event.target;
                let componentName = "" !== clickedItem.id ? clickedItem.id : clickedItem.className;
                componentName = clickedItem.getAttribute("data-tp-id") ? clickedItem.getAttribute("data-tp-id") : componentName;
                const logData = {
                    name: "user_click",
                    component: {
                        name: componentName,
                        type: clickedItem.nodeName,
                        origin: "other"
                    }
                };
                if (jQuery("#chat-wrapper")[0]) {
                    if (logData.component && jQuery("#chat-wrapper")[0] && jQuery("#chat-wrapper")[0].contains(clickedItem) && (logData.component.origin = "tp"), 
                    !jQuery("#gif-picker-container")[0].contains(clickedItem) && !jQuery("#reaction-holder")[0].contains(clickedItem)) {
                        const logClick = new LogEventMessage("Content_Script", "Service_Background", logData);
                        Messaging_MessagePasser.sendMessageToExtension(logClick);
                    }
                } else {
                    const logClick = new LogEventMessage("Content_Script", "Service_Background", logData);
                    Messaging_MessagePasser.sendMessageToExtension(logClick);
                }
                event.target === jQuery("emoji-picker")[0] || event.target === jQuery("#chat-input")[0] || jQuery("#emoji-picker-container").is(":hidden") || this._chatApi.toggleEmojiClicker(), 
                event.target instanceof HTMLElement && jQuery("#gif-picker-container")[0] && !jQuery("#gif-picker-container")[0].contains(event.target) && event.target !== jQuery("#chat-input")[0] && !jQuery("#gif-picker-container").is(":hidden") && "category-img" !== event.target.className && this._chatApi.toggleGIFs();
            }
            _emojiInput(emoji) {
                let sel, range;
                if (window.getSelection && (sel = window.getSelection(), sel && sel.getRangeAt && sel.rangeCount)) {
                    range = sel.getRangeAt(0), range.deleteContents();
                    const el = document.createElement("span");
                    el.className = "inTextEmoji", el.innerHTML = emoji;
                    const frag = document.createDocumentFragment();
                    let node, lastNode;
                    for (;node = el.firstChild; ) lastNode = frag.appendChild(node);
                    range.insertNode(frag), lastNode && (range = range.cloneRange(), range.setStartAfter(lastNode), 
                    range.collapse(!1), sel.removeAllRanges(), sel.addRange(range));
                }
            }
            validateEmojiObject(obj) {
                return "object" == typeof obj && null != obj && "unicode" in obj;
            }
            validateFrequentUsed(frequentUsed) {
                if (!Array.isArray(frequentUsed)) return !1;
                if (0 === frequentUsed.length) return !1;
                for (let i = 0; i < frequentUsed.length; i++) {
                    const target = frequentUsed[i];
                    if (!this.validateEmojiObject(target)) return !1;
                }
                return !0;
            }
            updateFrequentlyUsed(emoji) {
                var _a;
                return ChatEventListener_awaiter(this, void 0, void 0, (function*() {
                    const results = yield ChromeStorage_ChromeStorageReader.getItemsAsync([ "recentlyUsedEmojiMap" ]);
                    let frequentlyUsedMap = null !== (_a = results.recentlyUsedEmojiMap) && void 0 !== _a ? _a : DEFAULT_FREQUENT_USED;
                    this.validateFrequentUsed(frequentlyUsedMap) || (frequentlyUsedMap = DEFAULT_FREQUENT_USED), 
                    Array.isArray(frequentlyUsedMap) && (emoji && (frequentlyUsedMap = frequentlyUsedMap.filter((item => item.unicode != emoji.unicode)), 
                    frequentlyUsedMap.unshift(emoji), frequentlyUsedMap = frequentlyUsedMap.slice(0, 24)), 
                    yield ChromeStorage_ChromeStorageWriter.setItemsAsync({
                        recentlyUsedEmojiMap: frequentlyUsedMap
                    }), window.postMessage({
                        type: "TP_FREQ_USED",
                        data: frequentlyUsedMap
                    }, "*"));
                }));
            }
            _onEmojiClick(event) {
                console.log("on Emoji Click");
                const chat = jQuery("#chat-input")[0], emoji = event.detail.unicode, logEventMessage = new LogEventMessage("Content_Script", "Service_Background", {
                    name: "user_click",
                    component: {
                        name: "chat_input_container-emoji_picker-emoji",
                        type: emoji
                    }
                });
                Messaging_MessagePasser.sendMessageToExtension(logEventMessage);
                const oldLogEventMessage = new LogEventMessage("Content_Script", "Service_Background", {
                    eventType: `emoji-click-${emoji}`,
                    sessionId: this._chatApi.getSessionId()
                });
                Messaging_MessagePasser.sendMessageToExtension(oldLogEventMessage), TaskManager_TaskManager.pushTask((() => this.updateFrequentlyUsed(event.detail.emoji)));
                const selection = window.getSelection();
                if (!jQuery("#chat-input").is(":focus") && chat.lastChild) {
                    const range_cur = document.createRange();
                    range_cur.setStartAfter(chat.lastChild), null == selection || selection.removeAllRanges(), 
                    null == selection || selection.addRange(range_cur);
                }
                this._chatApi.focusChat(), this._emojiInput(emoji);
                chat.scrollHeight - chat.scrollTop <= chat.clientHeight + 40 && (chat.scrollTop = chat.scrollHeight), 
                this._inputHandler(), this._chatApi.onInputChange();
            }
            _removeWindowListeners() {
                jQuery(window).off("focus", this.onFocus), document.removeEventListener("emoji-click", this.onEmojiClick), 
                document.removeEventListener("keydown", this.cancelEvent, !0), document.removeEventListener("click", this.globalClick), 
                window.removeEventListener("message", this.onMessage), document.removeEventListener("webkitfullscreenchange", this._chatApi.onFullScreen), 
                document.removeEventListener("fullscreenchange", this._chatApi.onFullScreen);
            }
            _removeChatListeners() {
                jQuery(".user-icon").off(), jQuery("#user-icon").off(), jQuery("#link-icon").off(), 
                jQuery(".image-button").off(), jQuery("#chat-input").off(), jQuery("#saveChanges").off(), 
                jQuery("#cancelNickname").off(), jQuery("#chat-input-container").off(), jQuery("#chat-wrapper").off();
            }
        }
        class PresenceController {
            constructor(chatApi) {
                this._typing = !1, this._buffering = !1, this._watchingAds = !1, this._chatApi = chatApi;
            }
            setupPresenceIndicator() {
                this._typing = !1, this._buffering = !1, this._watchingAds = !1, this._setPresenceText();
            }
            _getPresenceIndicator() {
                return jQuery("#presence-indicator");
            }
            setTypingPresenceVisible(visible) {
                this._typing = visible, this._setPresenceText();
            }
            setBufferingPresenceVisible(visible) {
                this._buffering = visible, this._setPresenceText();
            }
            setWatchingAdsPresenceVisible(visible) {
                this._watchingAds = visible, this._setPresenceText();
            }
            getWatchingAdsVisible() {
                return this._watchingAds;
            }
            _getPresenceText() {
                return this._watchingAds ? "People are watching ads..." : this._typing && this._buffering ? "People are typing and buffering..." : this._typing ? "People are typing..." : this._buffering ? "People are buffering..." : "";
            }
            _setPresenceText() {
                const text = this._getPresenceText();
                this._getPresenceIndicator().text(text), this._chatApi.queueMessageForFrame(SidebarMessageType.SET_PRESENCE_MESSAGE, {
                    text
                });
            }
        }
        class MessageController {
            constructor(chatApi) {
                this._chatApi = chatApi, this._messages = [], this._unreadCount = 0, this._pageTitle = document.title, 
                this._messagesCount = 0, this._userIcons = new Map, this._userNicknames = new Map, 
                this._nicknamesInUse = [], this._iconsInUse = [], this._userIconUrl = "", debug("Message Controller");
            }
            getMessageElementWithNickname(userIconUrl, userNickname, message, showHeader) {
                return jQuery(`\n            <div class="msg-container ${!showHeader && "tp-msg-combined"}-message">\n                <div class="tp-icon-name">\n                    <div class="icon">\n                    ${showHeader ? `<img src="${escapeStr(userIconUrl)}" data-tp-id="chat_history_container-user_icon"/>` : ""}\n                    </div>\n                </div>\n                <div class="msg-txt message${message.isSystemMessage ? "-system" : "-txt"}">\n                    ${showHeader ? `<h3 data-tp-id="chat_history_container-nickname">${userNickname}</h3>` : ""}\n                    <p data-tp-id="chat_history_container-message">${escapeStr(message.body).trim()}</p>\n                </div>\n            </div>\n          `);
            }
            getMessageElementWithNicknameWithGif(userIconUrl, userNickname, message, showHeader) {
                const calc_height = 200 / (message.gifObject.media.full.dims[0] / message.gifObject.media.full.dims[1]);
                return jQuery(`\n            <div class="msg-container ${!showHeader && "tp-msg-combined"}-message">\n                <div class="tp-icon-name">\n                    <div class="icon" >\n                    ${showHeader ? `<img src="${escapeStr(userIconUrl)}" data-tp-id="chat_history_container-user_icon"/>` : ""}\n                    </div>\n                </div>\n                <div class="msg-gif message-gif">\n                    ${showHeader ? `<h3 data-tp-id="chat_history_container-nickname">${userNickname}</h3>` : ""}       \n                    <video src="${escapeStr(message.gifObject.media.full.url)}"  height="${calc_height}" class="tp-video-gif" data-tp-id="chat_history_container-gif" autoplay muted loop playsinline disablepictureinpicture disableremoteplayback>\n                </div>\n            </div>\n          `);
            }
            getMessageElementWithoutNickname(userIconUrl, message, showHeader) {
                return jQuery(`\n            <div class="msg ${!showHeader && "tp-msg-combined"}-message">\n                <div class="tp-icon-name">\n                    ${showHeader ? `<img src="${escapeStr(userIconUrl)}" data-tp-id="chat_history_container-user_icon"/>` : ""}\n                </div>\n                <div class="message${message.isSystemMessage ? "-system" : "-txt"}">\n                    <p class="msg-nickname"></p>\n                    <p data-tp-id="chat_history_container-message">${escapeStr(message.body).trim()}</p>\n                </div>\n            </div>\n        `);
            }
            getMessageElementWithoutNicknameWithGif(userIconUrl, message, showHeader) {
                const calc_height = 200 / (message.gifObject.media.full.dims[0] / message.gifObject.media.full.dims[1]);
                return jQuery(`\n            <div class="msg-container ${!showHeader && "tp-msg-combined"}-message">\n                <div class="tp-icon-name">\n                    <div class="tp-icon-name">\n                    ${showHeader ? `<img src="${escapeStr(userIconUrl)}" data-tp-id="chat_history_container-user_icon"/>` : ""}\n                    </div>\n                </div>\n                <div class="msg-gif message-gif">\n                    <p class="msg-nickname"></p>\n                    <video src="${escapeStr(message.gifObject.media.full.url)}" data-tp-id="chat_history_container-gif" height="${calc_height}" class = "tp-video-gif" autoplay loop playsinline disablepictureinpicture disableremoteplayback>\n                </div>\n            </div>\n          `);
            }
            _addMessageToHistory(messageElement, message, userIconUrl, userNickname, showHeader) {
                messageElement.appendTo(jQuery("#chat-history"));
                const messageElementTarget = messageElement[0];
                messageElementTarget._permId = message.permId, messageElementTarget._userIcon = userIconUrl, 
                messageElementTarget._userNickname = userNickname, messageElementTarget._message = message, 
                messageElementTarget._showHeader = showHeader;
            }
            reloadMessages() {
                this._chatApi.queueMessageForFrame(SidebarMessageType.CLEAR_MESSAGES, "");
                const oldMessages = JSON.parse(JSON.stringify(this._messages));
                for (let i = 0; i < oldMessages.length; i++) {
                    const message = oldMessages[i];
                    "gifObject" in message ? this.addGif(message, i) : this.addMessage(message, !1, i);
                }
                this._messages = oldMessages;
            }
            shouldCombineMessage(lastMessage, newMessage) {
                if (Math.abs(lastMessage.timestamp - newMessage.timestamp) > 6e4) return !1;
                if (lastMessage.permId !== newMessage.permId) return !1;
                if ("isSystemMessage" in newMessage && newMessage.isSystemMessage && (newMessage.body.includes("joined") || newMessage.body.includes("left"))) return !1;
                if ("gifObject" in lastMessage) {
                    if ("isSystemMessage" in newMessage && newMessage.isSystemMessage) return !1;
                } else {
                    if (lastMessage.isSystemMessage && (lastMessage.body.includes("joined") || lastMessage.body.includes("left"))) return !1;
                    if ("gifObject" in newMessage) {
                        if (lastMessage.isSystemMessage) return !1;
                    } else if (lastMessage.isSystemMessage !== newMessage.isSystemMessage) return !1;
                }
                return !0;
            }
            addMessage(originalMessage, checkIcons, messageIndex) {
                if (void 0 === messageIndex && (messageIndex = this._messages.length), originalMessage.isSystemMessage && "left" === originalMessage.body && (console.log("trying to add left message"), 
                !originalMessage.userIcon && !this._userIcons.has(originalMessage.permId))) return;
                if (0 === messageIndex && originalMessage.isSystemMessage && originalMessage.body.includes("joined")) return;
                checkIcons && originalMessage.isSystemMessage && originalMessage.body.indexOf("updated their user icon") > -1 && (originalMessage.userIcon && this.setUserIcon(originalMessage.permId, originalMessage.userIcon), 
                originalMessage.userNickname && this.setUserNickname(originalMessage.permId, originalMessage.userNickname));
                const lastMessage = this._messages.slice(-1).pop(), showHeader = !(void 0 !== lastMessage && messageIndex > 0) || !this.shouldCombineMessage(lastMessage, originalMessage);
                this._messages.push(originalMessage);
                const message = Object.assign({}, originalMessage), userIcon = this.getUserIconURL(message.permId, message.userIcon), userNickname = this.getUserNickname(message.permId, message.userNickname);
                this._chatApi.queueMessageForFrame(SidebarMessageType.ADD_MESSAGE, {
                    originalMessage: message,
                    userIcon,
                    userNickname
                });
                const messageElement = "" === userNickname ? this.getMessageElementWithoutNickname(userIcon, message, showHeader) : this.getMessageElementWithNickname(userIcon, userNickname, message, showHeader);
                this._addMessageToHistory(messageElement, message, userIcon, userNickname, showHeader), 
                this.scrollToBottom(), this._increaseMessageCount();
            }
            addGif(message, messageIndex) {
                void 0 === messageIndex && (messageIndex = this._messages.length);
                const lastMessage = this._messages.slice(-1).pop(), showHeader = !(void 0 !== lastMessage && messageIndex > 0) || !this.shouldCombineMessage(lastMessage, message);
                this._messages.push(message);
                const userIcon = message.userIcon ? this.getUserIconURL(message.permId, message.userIcon) : this.getUserIconURL(message.permId), userNickname = message.userNickname ? this.getUserNickname(message.permId, message.userNickname) : "";
                this._chatApi.queueMessageForFrame(SidebarMessageType.ADD_MESSAGE, {
                    originalMessage: message,
                    userIcon,
                    userNickname
                });
                const messageElement = "" === userNickname ? this.getMessageElementWithoutNicknameWithGif(userIcon, message, showHeader) : this.getMessageElementWithNicknameWithGif(userIcon, userNickname, message, showHeader);
                messageElement[0]._isGif = !0, this._addMessageToHistory(messageElement, message, userIcon, userNickname, showHeader), 
                delay(100)().then(this.scrollToBottom.bind(this)), this._increaseMessageCount();
            }
            scrollToBottom() {
                jQuery("#chat-history").scrollTop(jQuery("#chat-history").prop("scrollHeight"));
            }
            clearUnreadCount() {
                this._unreadCount > 0 && (this._unreadCount = 0, document.title = this._pageTitle);
            }
            _increaseMessageCount() {
                this._unreadCount += 1, this._messagesCount += 1, document.hasFocus() || (document.title = "(" + String(this._unreadCount) + ") " + this._pageTitle);
            }
            getUserIconURL(userId, userIcon = "") {
                if (!this._userIcons.has(userId)) {
                    const parsedIconSrc = this._parseIconSrc(userIcon), iconURL = void 0 !== parsedIconSrc ? parsedIconSrc : this._getDefaultIconUrl();
                    this._userIcons.set(userId, iconURL), this._iconsInUse.push(iconURL);
                }
                return this._userIcons.get(userId);
            }
            _parseIconSrc(userIcon) {
                const newIcon = userIcon.includes("?newIconUrl=") ? userIcon.split("?newIconUrl=")[1] : userIcon, oldIcon = userIcon.includes("?newIconUrl=") ? userIcon.split("?newIconUrl=")[0] : userIcon;
                return newIcons.includes(newIcon) ? chrome.runtime.getURL("img/icons/" + userIcon) : oldIcons.includes(oldIcon) ? chrome.runtime.getURL("img/icons/General/" + userIcon) : void 0;
            }
            getUserNickname(userId, userNickname = "") {
                return this._userNicknames.has(userId) || (this._userNicknames.set(userId, userNickname), 
                this._nicknamesInUse.push(userNickname)), escapeStr(this._userNicknames.get(userId));
            }
            _getDefaultIconUrl() {
                let iconURL = chrome.runtime.getURL("img/icons/General/" + oldIcons[Math.floor(Math.random() * oldIcons.length)]);
                if (this._iconsInUse.length < iconMap.General.length) for (;this._iconsInUse.includes(iconURL); ) iconURL = chrome.runtime.getURL("img/icons/General/" + oldIcons[Math.floor(Math.random() * oldIcons.length)]);
                return iconURL;
            }
            _refreshMsgContainer(msgContainer) {
                const messageElement = msgContainer[0], permId = messageElement._permId;
                let userIcon = messageElement._userIcon;
                permId && this.getUserIconURL(permId) !== userIcon && (userIcon = this.getUserIconURL(permId), 
                msgContainer.find("img").attr("src", userIcon), messageElement._userIcon = userIcon);
                const msgNickname = messageElement._userNickname;
                if (permId && userIcon) {
                    const userNickname = this.getUserNickname(permId);
                    if (userNickname !== msgNickname) {
                        const message = messageElement._message, showHeader = messageElement._showHeader;
                        let nicknameMessage;
                        if (messageElement._isGif && message && "gifObject" in message && showHeader && (nicknameMessage = "" == userNickname ? this.getMessageElementWithoutNicknameWithGif(userIcon, message, showHeader) : this.getMessageElementWithNicknameWithGif(userIcon, userNickname, message, showHeader)), 
                        !messageElement._isGif && message && "isSystemMessage" in message && showHeader && (nicknameMessage = "" == userNickname ? this.getMessageElementWithoutNickname(userIcon, message, showHeader) : this.getMessageElementWithNickname(userIcon, userNickname, message, showHeader)), 
                        nicknameMessage) {
                            msgContainer.replaceWith(nicknameMessage);
                            const nicknameMessageElement = nicknameMessage[0];
                            nicknameMessageElement._permId = permId, nicknameMessageElement._userIcon = userIcon, 
                            nicknameMessageElement._userNickname = userNickname, nicknameMessageElement._message = message, 
                            nicknameMessageElement._showHeader = showHeader;
                        }
                    }
                }
            }
            setUserIconUrl(userIconUrl) {
                this._userIconUrl = userIconUrl, this._chatApi.queueMessageForFrame(SidebarMessageType.SET_USER_ICON_URL, userIconUrl);
            }
            renderSidebar() {
                jQuery("#user-icon img").attr("src", this._userIconUrl), jQuery(".user-icon img").attr("src", this._userIconUrl);
                const msgs = jQuery(".msg");
                for (let i = 0; i < msgs.length; i++) this._refreshMsgContainer(jQuery(msgs[i]));
                const msgContainers = jQuery(".msg-container");
                for (let i = 0; i < msgContainers.length; i++) this._refreshMsgContainer(jQuery(msgContainers[i]));
                this._chatApi.isPartyWindowsActive() && this.reloadMessages();
            }
            _parseIconUrlOrGetRandom(queryIconUrl) {
                let iconUrl = null;
                if (queryIconUrl) if (queryIconUrl.includes("?newIconUrl=")) {
                    const userIconParts = queryIconUrl.split("?newIconUrl="), parsedIcon = userIconParts[1], oldIcon = userIconParts[0];
                    newIcons.includes(parsedIcon) ? iconUrl = chrome.runtime.getURL(`img/icons/${parsedIcon}`) : oldIcons.includes(oldIcon) && (iconUrl = chrome.runtime.getURL(`img/icons/General/${oldIcon}`));
                } else newIcons.includes(queryIconUrl) ? iconUrl = chrome.runtime.getURL(`img/icons/${queryIconUrl}`) : oldIcons.includes(queryIconUrl) && (iconUrl = chrome.runtime.getURL(`img/icons/General/${queryIconUrl}`));
                if (null === iconUrl) {
                    let possibleIcons = iconMap.General.filter((icon => !this._iconsInUse.includes(icon)));
                    0 === possibleIcons.length && (possibleIcons = iconMap.General);
                    const randomIcon = possibleIcons[Math.floor(Math.random() * possibleIcons.length)];
                    iconUrl = chrome.runtime.getURL(`/img/icons/General/${randomIcon}`);
                }
                return iconUrl;
            }
            setUserIcon(userId, newUserIcon) {
                const iconUrl = this._parseIconUrlOrGetRandom(newUserIcon);
                this._userIcons.set(userId, iconUrl), this._iconsInUse.push(iconUrl), this.renderSidebar();
            }
            setUserNickname(userId, userNickname) {
                const escapedUserNickName = escapeStr(userNickname);
                this._userNicknames.set(userId, escapedUserNickName), this._nicknamesInUse.push(escapedUserNickName), 
                this.renderSidebar();
            }
            updateUserData(userId, userIcon, userNickname) {
                const iconUrl = this._parseIconUrlOrGetRandom(userIcon);
                this._userIcons.set(userId, iconUrl), this._iconsInUse.push(iconUrl), this._userNicknames.set(userId, userNickname), 
                this._nicknamesInUse.push(userNickname), this.renderSidebar();
            }
            addYoutubePromo() {
                jQuery(`\n        <div class="msg-container">\n            <div class="msg-txt message-system">\n                <div style="width:100%; height: 100px">\n                    <img data-tp-id="tp_youtube_promo" style="width: 100%;height: 100%;object-fit: contain;cursor:pointer !important;" src="${chrome.runtime.getURL("img/youtube_promo.jpg")}" \n                    onclick="window.open('https://teleparty.com/youtube')"\n                    />\n                </div>\n            </div>\n        </div>\n        `).prependTo(jQuery("#chat-history"));
            }
            addReviewMessage() {
                jQuery('\n          <div class="msg-container">\n          <div class="msg-txt message-system" style="width:100%">\n          <p>\n          Thanks for using Teleparty! <br> \n          If you enjoy the extension, please leave a positive review \n          <a id="reviewLink" href="https://chrome.google.com/webstore/detail/netflix-party-is-now-tele/oocalimimngaihdkbihfgmpkcpnmlaoa/reviews" style="display:inline;color:red;text-decoration:underline;" target="none">here!</a>\n          </p>\n          </div>\n          </div>\n          ').appendTo(jQuery("#chat-history"));
                const logEventMessage = new LogEventMessage("Content_Script", "Service_Background", {
                    name: "review-shown",
                    action: {
                        description: "review was shown on chrome",
                        reason: "review was shown."
                    }
                });
                Messaging_MessagePasser.sendMessageToExtension(logEventMessage);
                const oldLogEventData = {
                    eventType: "review-shown-chrome",
                    sessionId: this._chatApi.getSessionId()
                }, oldLogEventMessage = new LogEventMessage("Content_Script", "Service_Background", oldLogEventData);
                Messaging_MessagePasser.sendMessageToExtension(oldLogEventMessage), jQuery("#reviewLink").click((() => {
                    chrome.storage.local.set({
                        reviewClicked: !0
                    });
                    const logEventMessage = new LogEventMessage("Content_Script", "Service_Background", {
                        name: "review-clicked",
                        action: {
                            description: "review was clicked on chrome",
                            reason: "review was clicked."
                        }
                    });
                    Messaging_MessagePasser.sendMessageToExtension(logEventMessage);
                    const oldLogData = {
                        eventType: "review-clicked-chrome",
                        sessionId: this._chatApi.getSessionId()
                    }, oldLogEventMessage = new LogEventMessage("Content_Script", "Service_Background", oldLogData);
                    Messaging_MessagePasser.sendMessageToExtension(oldLogEventMessage);
                }));
            }
        }
        var css_alert = __webpack_require__(129), chat = __webpack_require__(236), browse = __webpack_require__(161);
        var getRandomValues, html_chat = __webpack_require__(301), chat_default = __webpack_require__.n(html_chat);
        class UserSettingsController {
            constructor(storageData) {
                var _a, _b, _c;
                this._userSettings = {
                    userIcon: null !== (_a = storageData.userIcon) && void 0 !== _a ? _a : "",
                    userNickname: null !== (_b = storageData.userNickname) && void 0 !== _b ? _b : ""
                }, this._permId = null !== (_c = storageData.userId) && void 0 !== _c ? _c : "";
            }
            saveUserIcon(newUserIcon) {
                newUserIcon = escapeStr(newUserIcon), this._userSettings.userIcon = newUserIcon, 
                ChromeStorage_ChromeStorageWriter.setItemsAsync({
                    userIcon: newUserIcon
                }), debug("new user settings after set user icon: " + JSON.stringify(this._userSettings));
            }
            saveUserNickname(userNickname) {
                this._userSettings.userNickname = userNickname, ChromeStorage_ChromeStorageWriter.setItemsAsync({
                    userNickname
                }), debug("new user settings after set user nickname: " + JSON.stringify(this._userSettings));
            }
            get userSettings() {
                return this._userSettings;
            }
            get permId() {
                return this._permId;
            }
            get userIcon() {
                return this._userSettings.userIcon;
            }
            get userNickname() {
                return this._userSettings.userNickname;
            }
        }
        class SetTypingMessage extends ClientMessage {
            constructor(sender, target, data) {
                super(sender, target, ClientMessageType.SET_TYPING), this.data = data;
            }
        }
        class SendChatMessage extends ClientMessage {
            constructor(sender, target, data) {
                super(sender, target, ClientMessageType.SEND_MESSAGE), this.data = data;
            }
        }
        class BroadcastUserSettingsMessage extends ClientMessage {
            constructor(sender, target, data) {
                super(sender, target, ClientMessageType.BROADCAST_USER_SETTINGS), this.data = data;
            }
        }
        class SendReactionMessage extends ClientMessage {
            constructor(sender, target, data) {
                super(sender, target, ClientMessageType.SEND_REACTION), this.data = data;
            }
        }
        class SendGIFMessage extends ClientMessage {
            constructor(sender, target, data) {
                super(sender, target, ClientMessageType.SEND_GIF), this.data = data;
            }
        }
        var rnds8 = new Uint8Array(16);
        function rng() {
            if (!getRandomValues && !(getRandomValues = "undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || "undefined" != typeof msCrypto && "function" == typeof msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto))) throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
            return getRandomValues(rnds8);
        }
        const regex = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
        const esm_browser_validate = function(uuid) {
            return "string" == typeof uuid && regex.test(uuid);
        };
        for (var byteToHex = [], i = 0; i < 256; ++i) byteToHex.push((i + 256).toString(16).substr(1));
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
        var ChatApi_awaiter = function(thisArg, _arguments, P, generator) {
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
        var HboMaxChatApi_awaiter = function(thisArg, _arguments, P, generator) {
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
        class HboMaxChatApi extends class {
            constructor() {
                this._GIFNewPageLoading = !1, this._GIFPage = 1, this._partyUrl = "", this._sessionId = "", 
                this._nextGIFPos = "0", this._activeGIFUrl = "", this._shouldChatBeVisible = !0, 
                this._adsActive = !1, this._emojiCount = 0, this._currentGIFs = [], this._chatTaskManager = new _TaskManager, 
                this._chatFrameReady = !1, this._initSessionData = void 0, this._chatWindowActive = this.shouldUseSideWindow(), 
                this._chatWindowVisible = this.shouldUseSideWindow(), this._shouldReturnToVideo = !1, 
                this.logEvent = logData => {
                    const logEventMessage = new LogEventMessage("Content_Script", "Service_Background", logData);
                    Messaging_MessagePasser.sendMessageToExtension(logEventMessage);
                }, this.checkInitReactionContainer = () => {
                    ChromeStorage_ChromeStorageReader.getItemsAsync([ "reactionContainerOpen" ]).then((res => {
                        !0 !== res.reactionContainerOpen && void 0 !== res.reactionContainerOpen || this.showReactionHolder();
                    }));
                }, this.onSidebarFocus = () => {
                    var _a;
                    null === (_a = this.pageControls) || void 0 === _a || _a.hideMessageIndicator();
                }, this.setReactionsActive = data => {
                    this._chatTaskManager.pushTask((() => ChromeStorage_ChromeStorageWriter.setItemsAsync({
                        reactionContainerOpen: data.active
                    })));
                }, this.onFullScreen = () => {
                    var _a;
                    this.scrollToBottom(), null != document.fullscreenElement ? (this.logEvent({
                        name: "fullscreen_enter"
                    }), this.shouldUseSideWindow() && (this._chatWindowActive = !1, this.setChatVisible(this.shouldChatBeVisible()))) : (this.logEvent({
                        name: "fullscreen_exit"
                    }), this.shouldUseSideWindow() && (this._chatWindowActive = this.shouldUseSideWindow(), 
                    jQuery("#chat-wrapper").hide(), this.setChatVisible(!1, !1), this.removeChat())), 
                    null === (_a = this.pageControls) || void 0 === _a || _a.setChatButtons();
                }, this.cancelEvent = event => {
                    event.stopPropagation();
                }, this._inSession = !1, this._chatEventListener = new ChatEventListener(this), 
                this._chatPresenceController = new PresenceController(this), this._messageController = new MessageController(this), 
                this._typingTimeout = void 0, this._GIFSearchTimeout = void 0, this._showingReviewMessage = !1;
            }
            setPageControls(pageControls) {
                this.pageControls = pageControls;
            }
            fixPageControls() {
                var _a, _b;
                null === (_a = this.pageControls) || void 0 === _a || _a.enablePartyIcons(), null === (_b = this.pageControls) || void 0 === _b || _b.setChatButtons();
            }
            setChatVisible(visible, userInitiated = !0) {
                return ChatApi_awaiter(this, void 0, void 0, (function*() {
                    if (this.isPartyWindowsActive()) throw new Error("Invalid Set Chat");
                    userInitiated && (this._shouldChatBeVisible = visible), visible && !this._isChatInjected() && this.reloadChat();
                }));
            }
            _logError(message, error) {
                const logEventMessage = new LogEventMessage("Content_Script", "Service_Background", {
                    name: "error",
                    action: {
                        reason: error,
                        description: message
                    }
                });
                Messaging_MessagePasser.sendMessageToExtension(logEventMessage);
            }
            getChatWindowVisible() {
                return this._chatWindowVisible;
            }
            isPartyWindowsActive() {
                return this._chatWindowActive;
            }
            shouldChatBeVisible() {
                return this._shouldChatBeVisible;
            }
            incrementEmojiCount() {
                this._emojiCount++;
            }
            resetEmojiCount() {
                this._emojiCount = 0;
            }
            getEmojiCount() {
                return this._emojiCount;
            }
            setChatFrameReady(tabId) {
                this._chatFrameReady && this.reloadChatFrame(), this._chatFrameReady = !0, this._chatTabId = tabId, 
                this._chatWindowActive = !0, console.log("setChatFrameReady");
            }
            queueMessageForFrame(type, data) {
                this.shouldUseSideWindow() && this._chatTaskManager.pushTask((() => ChatApi_awaiter(this, void 0, void 0, (function*() {
                    this._sendMessageToFrame(type, data);
                }))));
            }
            _sendMessageToFrame(type, data) {
                return ChatApi_awaiter(this, void 0, void 0, (function*() {
                    const tabId = this._chatTabId, message = {
                        type,
                        data,
                        target: "TP_Sidebar",
                        tabId,
                        sender: "Content_Script"
                    };
                    Messaging_MessagePasser.sendMessageToExtension(message);
                }));
            }
            _waitChatFrameReady() {
                var _a;
                return ChatApi_awaiter(this, void 0, void 0, (function*() {
                    try {
                        yield delayUntil((() => this._chatFrameReady && null != this._chatTabId), 3e4)(), 
                        console.log("Chat Frame is Loaded"), this._initSessionData && this.sendInitDataToSidebar(this._initSessionData), 
                        null === (_a = this.pageControls) || void 0 === _a || _a.setResetChatButton();
                    } catch (error) {
                        this._logError("Sidewindow didn't load in time", error);
                    }
                }));
            }
            shouldUseSideWindow() {
                return !1;
            }
            loadNewChatWindow() {
                return ChatApi_awaiter(this, void 0, void 0, (function*() {
                    yield Messaging_MessagePasser.sendMessageToExtension(new BackgroundMessage("Content_Script", "Service_Background", BackgroundMessageType.LOAD_CHAT_WINDOW)), 
                    console.log(this._chatTabId);
                }));
            }
            resetChatWindow(returnToVideo = !1) {
                return ChatApi_awaiter(this, void 0, void 0, (function*() {
                    yield Messaging_MessagePasser.sendMessageToExtension(new BackgroundMessage("Content_Script", "Service_Background", BackgroundMessageType.RESET_CHAT_WINDOW)), 
                    console.log(this._chatTabId), this._chatWindowVisible = !0, this._shouldChatBeVisible = !0, 
                    this._shouldReturnToVideo && returnToVideo && this.resetIconListener();
                }));
            }
            hideChatWindow() {
                return ChatApi_awaiter(this, void 0, void 0, (function*() {
                    yield Messaging_MessagePasser.sendMessageToExtension(new BackgroundMessage("Content_Script", "Service_Background", BackgroundMessageType.HIDE_CHAT_WINDOW)), 
                    this._chatWindowVisible = !1, this._shouldChatBeVisible = !1;
                }));
            }
            setupSideWindow() {
                return ChatApi_awaiter(this, void 0, void 0, (function*() {
                    this.loadNewChatWindow(), this._chatTaskManager.pushTask(this._waitChatFrameReady.bind(this));
                }));
            }
            loadInitData(data) {
                this._initSessionData = data;
            }
            sendInitDataToSidebar(data) {
                return ChatApi_awaiter(this, void 0, void 0, (function*() {
                    const finalData = Object.assign({}, data);
                    if (finalData.iconMap = iconMap, finalData.extensionBaseUrl = chrome.runtime.getURL(""), 
                    finalData.storageData) {
                        const storageData = yield ChromeStorage_ChromeStorageValidator.getValidatedChromeStorageDataAsync();
                        finalData.storageData = storageData;
                    }
                    this.queueMessageForFrame(SidebarMessageType.LOAD_INIT_DATA, finalData);
                    const pageTitle = yield this.getVideoTitle();
                    this.queueMessageForFrame(SidebarMessageType.SET_PAGE_TITLE, {
                        pageTitle
                    });
                }));
            }
            reloadChatFrame() {
                return ChatApi_awaiter(this, void 0, void 0, (function*() {
                    if (console.log("Reloading chat Frame"), this._initSessionData && (yield this.sendInitDataToSidebar(this._initSessionData)), 
                    this._userSettingsController) {
                        const currentUrl = this._messageController.getUserIconURL(this._userSettingsController.permId, this._userSettingsController.userIcon);
                        this.queueMessageForFrame(SidebarMessageType.SET_USER_ICON_URL, currentUrl);
                    }
                    const pageTitle = yield this.getVideoTitle();
                    this.queueMessageForFrame(SidebarMessageType.SET_PAGE_TITLE, {
                        pageTitle
                    }), this.reloadMessages();
                }));
            }
            setupInBrowserChat() {
                this._injectChat(), this.setChatVisible(!0), this.addIconSelector(), this._startEventListener(), 
                this._chatPresenceController.setupPresenceIndicator(), this.checkInitReactionContainer();
            }
            _initChat(storageData) {
                this._chatEventListener.initWindowListeners(), this.shouldUseSideWindow() && this.setupSideWindow(), 
                hideAlertMessages(), this._userSettingsController = new UserSettingsController(storageData);
                const currentUrl = this._messageController.getUserIconURL(this._userSettingsController.permId, this._userSettingsController.userIcon);
                this._messageController.setUserIconUrl(currentUrl), this._messageController.renderSidebar(), 
                this._isChatInjected() && this.removeChat(), this._inSession = !0, this._setChatHtml(), 
                this.shouldUseSideWindow() ? jQuery("body").after(`\n    <style>\n      ${css_alert}\n    </style>\n    <style tpInjected>\n      .on-screen-reaction {\n        position: absolute;\n        bottom: 0;\n        font-size: 100px;\n        z-index: 9999999999;\n      }\n      .on-screen-reaction-1 {\n        animation: 5s cubic-bezier(0.5, 1, 0.89, 1) forwards on-screen-reaction-slide,\n          12s cubic-bezier(0.5, 1, 0.89, 1) forwards on-screen-reaction-1;\n      }\n      .on-screen-reaction-2 {\n        animation: 6s cubic-bezier(0.5, 1, 0.89, 1) forwards on-screen-reaction-slide,\n          12s cubic-bezier(0.5, 1, 0.89, 1) forwards on-screen-reaction-2;\n      }\n      .on-screen-reaction-3 {\n        animation: 7s cubic-bezier(0.5, 1, 0.89, 1) forwards on-screen-reaction-slide,\n          12s cubic-bezier(0.5, 1, 0.89, 1) forwards on-screen-reaction-3;\n      }\n      @keyframes on-screen-reaction-slide {\n        0% {\n          opacity: 0;\n          transform: translateY(calc(0 - var(--reaction-size)));\n        }\n        20% {\n          opacity: 0.8;\n        }\n        30% {\n          opacity: 0.8;\n        }\n        90% {\n          opacity: 0;\n        }\n        100% {\n          transform: translateY(-100vh) translateX(-10px);\n          opacity: 0;\n        }\n      }\n      @keyframes on-screen-reaction-1 {\n        10% {\n          margin-left: -6px;\n        }\n        25% {\n          margin-left: 4px;\n        }\n        30% {\n          margin-left: -5px;\n        }\n        45% {\n          margin-left: 5px;\n        }\n        55% {\n          margin-left: -3px;\n        }\n        60% {\n          margin-left: 5px;\n        }\n        70% {\n          margin-left: -5px;\n        }\n        85% {\n          margin-left: 5px;\n        }\n        90% {\n          margin-left: -7px;\n        }\n        100% {\n          margin-left: 5px;\n        }\n      }\n      @keyframes on-screen-reaction-2 {\n        15% {\n          margin-left: -2px;\n        }\n        20% {\n          margin-left: 5px;\n        }\n        35% {\n          margin-left: -6px;\n        }\n        40% {\n          margin-left: 5px;\n        }\n        50% {\n          margin-left: -5px;\n        }\n        65% {\n          margin-left: 5px;\n        }\n        70% {\n          margin-left: -5px;\n        }\n        80% {\n          margin-left: 4px;\n        }\n        95% {\n          margin-left: -5px;\n        }\n        100% {\n          margin-left: 5px;\n        }\n      }\n      @keyframes on-screen-reaction-3 {\n        15% {\n          margin-left: -4px;\n        }\n        20% {\n          margin-left: 5px;\n        }\n        35% {\n          margin-left: -2px;\n        }\n        40% {\n          margin-left: 5px;\n        }\n        50% {\n          margin-left: -3px;\n        }\n        65% {\n          margin-left: 5px;\n        }\n        70% {\n          margin-left: -5px;\n        }\n        80% {\n          margin-left: 5px;\n        }\n        95% {\n          margin-left: -4px;\n        }\n        100% {\n          margin-left: 5px;\n        }\n      }\n    </style>\n  `) : (this.setupInBrowserChat(), 
                this.checkAddYoutubePromo());
            }
            checkAddYoutubePromo() {
                return ChatApi_awaiter(this, void 0, void 0, (function*() {
                    "true" !== (yield ChromeStorage_ChromeStorageReader.getItemsAsync([ "seenYoutubePromo" ])).seenYoutubePromo && (this._messageController.addYoutubePromo(), 
                    ChromeStorage_ChromeStorageWriter.setItemsAsync({
                        seenYoutubePromo: "true"
                    }));
                }));
            }
            reloadChat() {
                this._isChatInjected() || this.isPartyWindowsActive() || (this._injectChat(), this.setChatVisible(this._shouldChatBeVisible), 
                this.addIconSelector(), this._stopEventListener(), this._startEventListener(), this._chatPresenceController.setupPresenceIndicator(), 
                this.reloadMessages(), this.scrollToBottom(), this.checkInitReactionContainer());
            }
            sendTeardown(teardownData) {
                const teardownMessage = new TeardownMessage("Content_Script", "Service_Background", teardownData);
                Messaging_MessagePasser.sendMessageToExtension(teardownMessage);
            }
            _isChatInjected() {
                return jQuery("#chat-wrapper").length > 0;
            }
            clearUnreadCount() {
                this._messageController.clearUnreadCount();
            }
            waitForChatHistory() {
                return ChatApi_awaiter(this, void 0, void 0, (function*() {
                    try {
                        yield delayUntil((() => null !== document.querySelector("#chat-history") || this._chatWindowActive), 5e3)();
                    } catch (error) {
                        this._logError("Failed to find chat history", error);
                    }
                }));
            }
            addMessage(message, checkIcons = !1) {
                this._chatTaskManager.pushTask((() => ChatApi_awaiter(this, void 0, void 0, (function*() {
                    yield this.waitForChatHistory(), this._messageController.addMessage(message, checkIcons);
                }))));
            }
            addGif(gifMessage) {
                this._chatTaskManager.pushTask((() => ChatApi_awaiter(this, void 0, void 0, (function*() {
                    yield this.waitForChatHistory(), this._messageController.addGif(gifMessage);
                }))));
            }
            reloadMessages() {
                this._messageController.reloadMessages();
            }
            scrollToBottom() {
                this._messageController.scrollToBottom();
            }
            addReviewMessage() {
                this._messageController.addReviewMessage(), this._showingReviewMessage = !0;
            }
            get showingReveiwMessage() {
                return this._showingReviewMessage;
            }
            set shouldReturnToVideo(resetVideo) {
                this._shouldReturnToVideo = resetVideo;
            }
            onBufferingMessage(message) {
                this._chatPresenceController.setBufferingPresenceVisible(message.usersBuffering.length > 0);
            }
            onTypingMessage(message) {
                this._chatPresenceController.setTypingPresenceVisible(message.usersTyping.length > 0);
            }
            onWatchingAdsMessage(message) {
                this._chatPresenceController.setWatchingAdsPresenceVisible(message.usersWatchingAds.length > 0);
            }
            getWatchingAds() {
                return this._chatPresenceController.getWatchingAdsVisible();
            }
            doUpdateSettings(newSettings) {
                var _a, _b;
                null === (_a = this._userSettingsController) || void 0 === _a || _a.saveUserIcon(newSettings.userIcon), 
                null === (_b = this._userSettingsController) || void 0 === _b || _b.saveUserNickname(newSettings.userNickname), 
                this._emitToSocket(this._getUpdateSettingsMessage(newSettings));
            }
            onUpdateSettingsMessage(message) {
                if (this._messageController.updateUserData(message.permId, message.userSettings.userIcon, message.userSettings.userNickname), 
                this._userSettingsController) {
                    const currentUrl = this._messageController.getUserIconURL(this._userSettingsController.permId, this._userSettingsController.userIcon);
                    this._messageController.setUserIconUrl(currentUrl), this._messageController.renderSidebar();
                }
            }
            _startEventListener() {
                delayUntil((() => this._isChatInjected()), 1e4)().then((() => {
                    this._chatEventListener.startListening();
                }));
            }
            _stopEventListener() {
                this._chatEventListener.stopListening(), this._changeAdInterval && (clearTimeout(this._changeAdInterval), 
                this._adsActive = !1);
            }
            teardown() {
                this._inSession = !1, this._stopEventListener(), jQuery("[tpInjected]").remove(), 
                this.setChatVisible(!1), this.removeChat();
            }
            focusChat() {
                jQuery("#chat-input")[0].focus();
            }
            showEmojiPicker() {
                var _a, _b;
                jQuery("#gif-picker-container").is(":hidden") || this.toggleGIFs(), jQuery("#emoji-picker-btn-icon").css({
                    opacity: "1"
                });
                const bottomSize = null !== (_a = jQuery("#bottom-chat-controls").outerHeight(!0)) && void 0 !== _a ? _a : parseInt(jQuery("#bottom-chat-controls").css("height")), paddingSize = parseInt(jQuery("#chat-input-container").css("padding-bottom")), chatSize = (null !== (_b = jQuery("#chat-input").outerHeight(!0)) && void 0 !== _b ? _b : parseInt(jQuery("#chat-input").css("height"))) + bottomSize + paddingSize;
                jQuery("#emoji-picker-container").css({
                    bottom: chatSize
                });
            }
            hideEmojiPicker() {
                jQuery("#emoji-picker-btn-icon").css({
                    opacity: ""
                }), jQuery("#emoji-picker-container").css("bottom", "");
            }
            showReactionHolder() {
                jQuery("#reaction-btn-icon").css({
                    opacity: "1"
                }), jQuery("#reaction-holder").css({
                    display: "flex"
                }), jQuery("#reaction-holder").css({
                    "padding-top": "8px"
                }), jQuery("#chat-input-container").css({
                    "padding-top": "0"
                });
            }
            hideReactionHolder() {
                jQuery("#reaction-btn-icon").css({
                    opacity: ""
                }), jQuery("#reaction-btn").css({
                    background: "",
                    padding: ""
                }), jQuery("#reaction-holder").css({
                    "padding-top": ""
                }), jQuery("#chat-input-container").css({
                    "padding-top": ""
                }), this._chatTaskManager.pushTask((() => ChromeStorage_ChromeStorageWriter.setItemsAsync({
                    reactionContainerOpen: !1
                })));
            }
            onOpenGifPicker() {
                var _a, _b;
                return ChatApi_awaiter(this, void 0, void 0, (function*() {
                    jQuery("#emoji-picker-container").is(":hidden") || this.toggleEmojiClicker(), jQuery("#gif-results-left")[0].innerHTML || this.fetchGIFs(), 
                    jQuery("#gif-btn-icon").css({
                        opacity: "1"
                    });
                    const bottomSize = null !== (_a = jQuery("#bottom-chat-controls").outerHeight(!0)) && void 0 !== _a ? _a : parseInt(jQuery("#bottom-chat-controls").css("height")), paddingSize = parseInt(jQuery("#chat-input-container").css("padding-bottom")), chatSize = (null !== (_b = jQuery("#chat-input").outerHeight(!0)) && void 0 !== _b ? _b : parseInt(jQuery("#chat-input").css("height"))) + bottomSize + paddingSize;
                    jQuery("#gif-picker-container").css({
                        bottom: chatSize
                    });
                }));
            }
            onCloseGifPicker() {
                jQuery("#gif-btn-icon").css({
                    opacity: ""
                }), jQuery("#gif-btn").css({
                    background: "",
                    padding: ""
                });
            }
            toggleEmojiClicker() {
                jQuery("#emoji-picker-container").slideToggle(0, (() => {
                    jQuery("#emoji-picker-container").is(":hidden") ? this.hideEmojiPicker() : this.showEmojiPicker();
                }));
            }
            toggleReactions() {
                const chatHistory = document.querySelector("#chat-history");
                let fixScroll = !1;
                chatHistory && Math.abs(chatHistory.scrollHeight - chatHistory.scrollTop - chatHistory.clientHeight) < 10 && (fixScroll = !0), 
                jQuery("#reaction-holder").slideToggle(0, (() => {
                    const toggleCheck = jQuery("#reaction-holder").is(":hidden");
                    toggleCheck ? this.hideReactionHolder() : this.showReactionHolder(), !toggleCheck && fixScroll && this._messageController.scrollToBottom();
                }));
            }
            toggleGIFs() {
                jQuery("#gif-picker-container").slideToggle(0, (() => {
                    jQuery("#gif-picker-container").is(":hidden") ? this.onCloseGifPicker() : this.onOpenGifPicker();
                }));
            }
            addEmojiPicker(event) {
                event.stopPropagation();
                const logReconnect = new LogEventMessage("Content_Script", "Service_Background", {
                    name: "user_click",
                    component: {
                        name: "chat_input_container-emoji_picker",
                        type: "button",
                        origin: "tp"
                    }
                });
                Messaging_MessagePasser.sendMessageToExtension(logReconnect), this.toggleEmojiClicker();
            }
            addGifPicker(event) {
                event.stopPropagation();
                const logReconnect = new LogEventMessage("Content_Script", "Service_Background", {
                    name: "user_click",
                    component: {
                        name: "chat_input_container-gif_popup",
                        type: "button",
                        origin: "tp"
                    }
                });
                Messaging_MessagePasser.sendMessageToExtension(logReconnect), this.toggleGIFs();
            }
            addReactionTab(event) {
                event.stopPropagation();
                const logReconnect = new LogEventMessage("Content_Script", "Service_Background", {
                    name: "user_click",
                    component: {
                        name: "chat_input_container-reaction_pinner",
                        type: "button",
                        origin: "tp"
                    }
                });
                Messaging_MessagePasser.sendMessageToExtension(logReconnect), this.toggleReactions();
            }
            _setChatHtml() {
                if (debug("Set Chat Html called"), this._chatHtml = chat_default(), this._chatHtml = this._chatHtml.replace(/{EXTENSION_LOGO}/g, escapeStr(chrome.runtime.getURL("img/tp_logo.svg"))), 
                void 0 === this._userSettingsController) throw new Error("Attempt to set chatHtml when _userSettings is undefined.");
                this._chatHtml = this._chatHtml.replace(/{USER_NICKNAME}/g, this._userSettingsController.userNickname ? escapeStr(this._userSettingsController.userNickname) : "Add a nickname"), 
                this._chatHtml = this._chatHtml.replace(/{USER_ICON}/g, this._messageController.getUserIconURL(this._userSettingsController.permId, this._userSettingsController.userIcon)), 
                this._chatHtml = this._chatHtml.replace(/{LINK_SVG}/g, chrome.runtime.getURL("img/icon_link_active.svg")), 
                this._chatHtml = this._chatHtml.replace(/{RESET_SGV}/g, chrome.runtime.getURL("img/reset_chat.svg")), 
                this._chatHtml = this._chatHtml.replace(/{EMOJI_PICKER_ICON}/g, chrome.runtime.getURL("img/emoji_picker.svg")), 
                this._chatHtml = this._chatHtml.replace(/{REACTION_PICKER_ICON}/g, chrome.runtime.getURL("img/reaction-popup.svg")), 
                this._chatHtml = this._chatHtml.replace(/{GIF_PICKER_ICON}/g, chrome.runtime.getURL("img/gif_icon.svg")), 
                this._chatHtml = this._chatHtml.replace(/{GIF_BACK_BUTTON}/g, chrome.runtime.getURL("img/icon_chevron.svg")), 
                this._chatHtml = this._chatHtml.replace(/{EMOJI_LIB}/g, chrome.runtime.getURL("lib/tp_emoji/picker_bundled.js")), 
                this._chatHtml = this._chatHtml.replace(/{EMOJI_FRAME}/g, chrome.runtime.getURL("web/emojiPicker.html")), 
                this._chatHtml = this._chatHtml.replace(/{X_CIRCLE}/g, chrome.runtime.getURL("img/x-circle.svg")), 
                this._chatHtml = this._chatHtml.replace(/{HEART_STATIC}/g, chrome.runtime.getURL("img/reactions/heart_static.svg")), 
                this._chatHtml = this._chatHtml.replace(/{HEART_GIF}/g, chrome.runtime.getURL("img/reactions/heart.gif")), 
                this._chatHtml = this._chatHtml.replace(/{CRY_STATIC}/g, chrome.runtime.getURL("img/reactions/cry_static.svg")), 
                this._chatHtml = this._chatHtml.replace(/{CRY_GIF}/g, chrome.runtime.getURL("img/reactions/crying.gif")), 
                this._chatHtml = this._chatHtml.replace(/{LAUGH_STATIC}/g, chrome.runtime.getURL("img/reactions/laugh_static.svg")), 
                this._chatHtml = this._chatHtml.replace(/{LAUGH_GIF}/g, chrome.runtime.getURL("img/reactions/laugh.gif")), 
                this._chatHtml = this._chatHtml.replace(/{SURPRISE_STATIC}/g, chrome.runtime.getURL("img/reactions/surprise_static.svg")), 
                this._chatHtml = this._chatHtml.replace(/{SURPRISE_GIF}/g, chrome.runtime.getURL("img/reactions/surprise.gif")), 
                this._chatHtml = this._chatHtml.replace(/{FIRE_STATIC}/g, chrome.runtime.getURL("img/reactions/fire_static.svg")), 
                this._chatHtml = this._chatHtml.replace(/{FIRE_GIF}/g, chrome.runtime.getURL("img/reactions/fire.gif")), 
                this._chatHtml = this._chatHtml.replace(/{ANGRY_STATIC}/g, chrome.runtime.getURL("img/reactions/angry_static.svg")), 
                this._chatHtml = this._chatHtml.replace(/{ANGRY_GIF}/g, chrome.runtime.getURL("img/reactions/angry.gif"));
            }
            toggleIconContainer() {
                var _a, _b, _c, _d;
                jQuery("#chat-icon-container").data("active") ? (jQuery("#chat-icon-container").data("active", !1), 
                jQuery("#chat-icon-container").hide(), jQuery(".chat-settings-container").hide(), 
                jQuery("#chat-history-container").show(), this._adsActive && jQuery("#chat-ad-holder").show(), 
                jQuery("#chat-input-container").show(), jQuery("#reaction-holder").hide(), this.hideReactionHolder(), 
                jQuery("#teleparty-blog-container").show(), jQuery("#presence-indicator").show(), 
                jQuery("#chat-header-container").removeClass("chat-header-container-active")) : (jQuery("#chat-icon-container").data("active", !0), 
                jQuery(".chat-settings-container").show(), jQuery("#chat-icon-container").hide(), 
                jQuery("#chat-link-container").hide(), jQuery("#chat-history-container").hide(), 
                jQuery("#chat-ad-holder").hide(), jQuery("#chat-input-container").hide(), jQuery("#teleparty-blog-container").hide(), 
                jQuery("#presence-indicator").hide(), jQuery("#reaction-holder").hide(), jQuery("#nickname-edit").attr("placeholder", null !== (_b = null === (_a = this._userSettingsController) || void 0 === _a ? void 0 : _a.userNickname) && void 0 !== _b ? _b : ""), 
                jQuery("#nickname-edit")[0].value = null !== (_d = null === (_c = this._userSettingsController) || void 0 === _c ? void 0 : _c.userNickname) && void 0 !== _d ? _d : "");
            }
            toggleLargeUserIconButton() {
                jQuery("#chat-icon-container").data("active") && (jQuery("#chat-icon-container").show(), 
                jQuery(".chat-settings-container").hide(), jQuery("#chat-header-container").addClass("chat-header-container-active"));
            }
            linkIconListener() {
                navigator.clipboard.writeText(this.getPartyUrl());
            }
            resetIconListener() {
                var _a;
                if (null === (_a = this._videoMessageForwarder) || void 0 === _a ? void 0 : _a.videoId) {
                    const jumpToNextEpisode = new CustomEvent("YoutubeVideoMessage", {
                        detail: {
                            type: "jumpToNextEpisode",
                            nextVideoId: this._videoMessageForwarder.videoId
                        }
                    });
                    window.dispatchEvent(jumpToNextEpisode);
                }
            }
            setPartyUrl(url) {
                this._partyUrl = url;
            }
            setMessageForwarder(videoMessageForwarder) {
                this._videoMessageForwarder = videoMessageForwarder;
            }
            setSessionId(sessionId) {
                this._sessionId = sessionId;
            }
            getSessionId() {
                return this._sessionId;
            }
            getPartyUrl() {
                return this._partyUrl;
            }
            userIconSelectorListener(event) {
                const icon = jQuery(event.currentTarget).data("icon");
                icon && (debug("userIconSelector button clicked: " + icon), this._userSettingsController && (this._userSettingsController.saveUserIcon(icon), 
                this.queueMessageForFrame(SidebarMessageType.UPDATE_SETTINGS, {
                    userSettings: this._userSettingsController.userSettings
                }), this._emitToSocket(this._getUpdateSettingsMessage(this._userSettingsController.userSettings)))), 
                this.toggleIconContainer();
            }
            removeChat() {
                this.clearUnreadCount(), jQuery("#chat-container").remove(), jQuery("#chat-wrapper").remove();
            }
            _emitToSocket(message, callback) {
                Messaging_MessagePasser.sendMessageToExtension(message).then(callback);
            }
            _getSendReactionBody(reactionType) {
                return new SendReactionMessage("Content_Script", "Service_Background", {
                    reactionType
                });
            }
            _getSendGif(gifObject) {
                return new SendGIFMessage("Content_Script", "Service_Background", {
                    gifObject
                });
            }
            _getSendMessageClass(body) {
                return new SendChatMessage("Content_Script", "Service_Background", {
                    body
                });
            }
            _getTypingMessage(typing) {
                return new SetTypingMessage("Content_Script", "Service_Background", {
                    typing
                });
            }
            _getUpdateSettingsMessage(userSettings) {
                return new BroadcastUserSettingsMessage("Content_Script", "Service_Background", {
                    userSettings
                });
            }
            _getReactionUrl(reactionType) {
                switch (reactionType) {
                  case ReactionTypes.HEART:
                    return chrome.runtime.getURL("img/reactions/heart.gif");

                  case ReactionTypes.CRY:
                    return chrome.runtime.getURL("img/reactions/crying.gif");

                  case ReactionTypes.SURPRISE:
                    return chrome.runtime.getURL("img/reactions/surprise.gif");

                  case ReactionTypes.FIRE:
                    return chrome.runtime.getURL("img/reactions/fire.gif");

                  case ReactionTypes.LAUGH:
                    return chrome.runtime.getURL("img/reactions/laugh.gif");

                  case ReactionTypes.ANGRY:
                    return chrome.runtime.getURL("img/reactions/angry.gif");
                }
            }
            showReaction(reactionMessage) {
                if (!this.shouldShowReaction()) return;
                const reactionType = reactionMessage.reactionType, parent = this.getReactionContainer();
                if (parent) {
                    const r_size = Math.floor(40 * Math.random()) + 40, leftSpace = parent[0].offsetWidth - (this.shouldAddReactionSpace() ? 304 : 0) - r_size, reactionOffset = Math.floor(Math.random() * leftSpace) + (this.shouldAddReactionSpace() ? 304 : 0), reactionUrl = this._getReactionUrl(reactionType), animation = Math.ceil(3 * Math.random()), reaction = jQuery(`<img class="on-screen-reaction on-screen-reaction-${animation}" src='${reactionUrl}' />`);
                    reaction.css("right", `${reactionOffset}px`), reaction.css("width", `${r_size}px`), 
                    reaction.css("height", `${r_size}px`), parent.append(reaction), setTimeout((() => {
                        reaction.remove();
                    }), 5e3);
                }
            }
            onReactionClicked(reactionType) {
                console.log(reactionType), this._emitToSocket(this._getSendReactionBody(reactionType));
                const logEventMessage = new LogEventMessage("Content_Script", "Service_Background", {
                    name: "user_click",
                    component: {
                        name: "chat_input_container-reaction_holder-reaction",
                        type: reactionType,
                        origin: "tp"
                    }
                });
                Messaging_MessagePasser.sendMessageToExtension(logEventMessage);
                const oldLogEventMessage = new LogEventMessage("Content_Script", "Service_Background", {
                    eventType: "reaction-" + reactionType,
                    sessionId: this.getSessionId()
                });
                Messaging_MessagePasser.sendMessageToExtension(oldLogEventMessage);
            }
            onChatKeyUp(event) {
                event.stopPropagation();
            }
            onChatKeyDown(event) {
                event.stopPropagation(), this._chatEventListener.resetIdleTimer();
            }
            initCustomListeners() {}
            getClientLocale() {
                if ("undefined" != typeof Intl) try {
                    return Intl.NumberFormat().resolvedOptions().locale;
                } catch (err) {
                    console.error("Cannot get locale from Intl"), this._logError("Cannot get locale from Intl", err);
                }
            }
            clickGif(event) {
                let currentGIFID = event.target.id;
                if (isNaN(currentGIFID)) currentGIFID = "trending" === currentGIFID ? "" : currentGIFID, 
                this.fetchGIFs(currentGIFID), jQuery("#gif-search")[0].value = currentGIFID; else {
                    const gif = this._currentGIFs.find((g => g.id === currentGIFID));
                    if (!gif) return;
                    const gif_object = {
                        id: gif.id,
                        title: gif.title,
                        description: gif.content_description,
                        isSticker: !1,
                        media: gif.media
                    };
                    this._emitToSocket(this._getSendGif(gif_object), (() => {
                        this.logShare(gif.id, jQuery("#gif-search")[0].value);
                        const logData = {
                            name: "user_click",
                            action: {
                                description: "gif clicked",
                                source: gif.media.full.url
                            },
                            component: {
                                name: "chat_input_container-gif_popup-gif",
                                type: "video",
                                origin: "tp"
                            }
                        }, logEventMessage = new LogEventMessage("Content_Script", "Service_Background", logData);
                        Messaging_MessagePasser.sendMessageToExtension(logEventMessage);
                        const oldLogEventMessage = new LogEventMessage("Content_Script", "Service_Background", {
                            eventType: "gif-share",
                            sessionId: this.getSessionId()
                        });
                        Messaging_MessagePasser.sendMessageToExtension(oldLogEventMessage);
                    })), this.toggleGIFs();
                }
            }
            _getVideoObjectForGif(gif) {
                const video = document.createElement("video"), calc_height = 124 / (gif.media.preview.dims[0] / gif.media.preview.dims[1]);
                return video.autoplay = !0, video.loop = !0, video.playsInline = !0, video.setAttribute("disablePictureInPicture", ""), 
                video.setAttribute("disableRemotePlayback", ""), video.src = gif.media.preview.url, 
                video.muted = !0, video.id = gif.id, video.height = calc_height, video.className = "gif-img", 
                video;
            }
            loadGIFs(data) {
                jQuery(".gif-placeholder").remove(), this._currentGIFs.push(...data.results), this._nextGIFPos = data.next, 
                data.results.forEach((gif => {
                    const video = this._getVideoObjectForGif(gif);
                    (jQuery("#gif-results-left")[0].scrollHeight > jQuery("#gif-results-right")[0].scrollHeight ? jQuery("#gif-results-right")[0] : jQuery("#gif-results-left")[0]).appendChild(video);
                })), this._GIFPage < 6 && this.loadPlaceHolders(), setTimeout((() => {
                    this._GIFNewPageLoading = !1;
                }), 100);
            }
            onScrollToBottom(event) {
                return ChatApi_awaiter(this, void 0, void 0, (function*() {
                    const atBottom = event.target.scrollHeight - event.target.scrollTop <= event.target.clientHeight + 450;
                    if (this._GIFNewPageLoading) event.preventDefault(); else if ("0" !== this._nextGIFPos && atBottom && this._GIFPage < 6) {
                        this._GIFPage += 1, this._GIFNewPageLoading = !0, event.preventDefault();
                        const response = yield fetch(this._activeGIFUrl + `&pos=${this._nextGIFPos}`), data = yield response.json();
                        this.loadGIFs(data);
                    }
                }));
            }
            resetGif() {
                jQuery("#gif-search")[0].value = "", jQuery("#gif-input-back").hide(), jQuery("#gif-search").css("width", ""), 
                this.fetchGIFs();
            }
            displayCategories() {
                jQuery("#gif-search")[0].value = "", jQuery("#category-container").show(), jQuery("#gif-results").hide(), 
                jQuery("#gif-input-back").hide(), jQuery("#gif-search").css("width", "");
            }
            showCategories() {
                jQuery("#gif-search")[0].value = "", jQuery("#gif-input-back").hide(), jQuery("#gif-search").css("width", "");
                const category_container = document.createElement("div");
                [ "trending", "dance", "annoyed", "omg", "crazy", "shrug", "smile", "awkward", "ew", "surprised", "why", "ouch " ].forEach((category => {
                    const category_wrapper = document.createElement("div"), text_wrapper = document.createElement("span");
                    text_wrapper.id = "category-txt", text_wrapper.innerHTML = category, category_wrapper.className = "tp-category-div";
                    const img = document.createElement("video");
                    img.autoplay = !0, img.src = "https://media.tenor.com/videos/166d7d5a1be3b0755e7f9e29ebefe2c3/mp4", 
                    img.className = "category-img", img.id = category, img.loop = !0, category_wrapper.appendChild(text_wrapper), 
                    category_wrapper.appendChild(img), category_container.appendChild(category_wrapper);
                })), jQuery("#category-container")[0].innerHTML = category_container.innerHTML;
            }
            getRandomPlaceholders() {
                const placeHolders = [], used = [];
                for (let i = 0; i < 4; i++) {
                    let placeHolder = Math.floor(4 * Math.random()) + 1;
                    for (;used.includes(placeHolder); ) placeHolder = Math.floor(4 * Math.random()) + 1;
                    used.push(placeHolder);
                    const placeHolderNode = document.createElement("div");
                    placeHolderNode.className = `gif-placeholder gif-placeholder-${placeHolder} gif-img`, 
                    placeHolders.push(placeHolderNode);
                }
                return placeHolders;
            }
            loadPlaceHolders() {
                return ChatApi_awaiter(this, void 0, void 0, (function*() {
                    jQuery("#gif-results-left")[0].append(...this.getRandomPlaceholders()), jQuery("#gif-results-right")[0].append(...this.getRandomPlaceholders());
                }));
            }
            logShare(id, query) {
                return ChatApi_awaiter(this, void 0, void 0, (function*() {
                    const locale = this.getClientLocale(), locale_string = locale ? `&locale=${locale}` : "", id_string = `&id=${id}`, search_url = query && query.length > 0 ? `q=${query}` : "";
                    yield fetch(`${GIF_API_ENDPOINT}/register-share?${search_url}${locale_string}${id_string}`);
                }));
            }
            fetchGIFs(search) {
                return ChatApi_awaiter(this, void 0, void 0, (function*() {
                    const unfilteredTitle = yield this.getVideoTitle(), pageTitle = null == unfilteredTitle ? void 0 : unfilteredTitle.replace(/[^\w\s]/g, "");
                    this._GIFPage = 1, this._GIFNewPageLoading = !0, jQuery("#category-container").hide(), 
                    jQuery("#gif-columns-wrapper").show(), jQuery("#gif-results-left")[0].innerHTML = "", 
                    jQuery("#gif-results-right")[0].innerHTML = "", this._currentGIFs = [], this.loadPlaceHolders();
                    const locale = this.getClientLocale(), locale_string = locale ? `&locale=${locale}` : "";
                    let search_url = pageTitle ? `search-gifs?q=${pageTitle}` : "trending-gifs?";
                    search_url = search ? `search-gifs?q=${search}` : search_url, this._activeGIFUrl = `${GIF_API_ENDPOINT}/${search_url}${locale_string}`;
                    const response = yield fetch(`${GIF_API_ENDPOINT}/${search_url}${locale_string}`), responseData = yield response.json();
                    if (responseData.results && responseData.results.length > 0) this.loadGIFs(responseData); else if (!search) {
                        const trendingRespnose = yield fetch(`${GIF_API_ENDPOINT}/trending_gifs?${locale_string}`);
                        this._activeGIFUrl = `${GIF_API_ENDPOINT}/trending_gifs?${locale_string}`;
                        const trendingResponseData = yield trendingRespnose.json();
                        this.loadGIFs(trendingResponseData);
                    }
                }));
            }
            onGifSearch(event) {
                event.stopPropagation();
                const search_term = event.target.value;
                if (void 0 !== this._GIFSearchTimeout && clearTimeout(this._GIFSearchTimeout), !search_term) return jQuery("#gif-input-back").hide(), 
                jQuery("#gif-search").css("width", ""), void this.fetchGIFs();
                jQuery("#gif-input-back").show(), jQuery("#gif-search").css("width", "90%"), this._GIFSearchTimeout = setTimeout((() => {
                    this.fetchGIFs(search_term);
                }), 500);
            }
            validateMessageBody(body) {
                return "string" == typeof body && "" !== body.replace(/^\s+|\s+$/g, "");
            }
            onChatKeyPress(event) {
                if (event.stopPropagation(), "Enter" !== event.key || event.shiftKey) void 0 === this._typingTimeout ? this._emitToSocket(this._getTypingMessage(!0)) : clearTimeout(this._typingTimeout), 
                this._typingTimeout = setTimeout((() => {
                    this._typingTimeout = void 0, this._emitToSocket(this._getTypingMessage(!1));
                }), 500); else {
                    jQuery("#emoji-picker-container").is(":hidden") || this.toggleEmojiClicker();
                    const chatInput = jQuery("#chat-input"), body = chatInput[0].textContent;
                    if (body && this.validateMessageBody(body)) {
                        void 0 !== this._typingTimeout && (clearTimeout(this._typingTimeout), this._typingTimeout = void 0, 
                        this._emitToSocket(this._getTypingMessage(!1))), chatInput.prop("contenteditable", !1), 
                        this._emitToSocket(this._getSendMessageClass(body.substring(0, 1500)), (() => {
                            chatInput[0].textContent = "", chatInput.prop("contenteditable", !0), this.focusChat(), 
                            this.onInputChange();
                        }));
                        const logData = {
                            name: "chat_send",
                            action: {
                                description: "message was sent"
                            },
                            message: {
                                id: function() {
                                    try {
                                        return esm_browser_v4();
                                    } catch (e) {
                                        return "";
                                    }
                                }(),
                                text: body.trim()
                            }
                        }, logEventMessage = new LogEventMessage("Content_Script", "Service_Background", logData);
                        Messaging_MessagePasser.sendMessageToExtension(logEventMessage);
                    } else event.stopImmediatePropagation(), event.preventDefault(), chatInput[0].textContent = "", 
                    this.onInputChange();
                }
            }
            onInputChange() {
                const chatInput = jQuery("#chat-input");
                if (chatInput.length > 0) {
                    const body = chatInput[0].textContent;
                    body && this.shouldShowIncreasedSize(body) ? chatInput.addClass("tp-emoji-large") : chatInput.removeClass("tp-emoji-large");
                }
                jQuery("#emoji-picker-container").css("bottom").length > 0 && (jQuery("#emoji-picker-container").is(":hidden") || this.showEmojiPicker());
            }
            shouldShowIncreasedSize(str) {
                const nonEmojiString = str.replace(EMOJI_REGEX, "").replace(/[\uFE0F]/g, ""), emojiCount = ((str || "").match(EMOJI_REGEX) || []).length;
                return 0 === nonEmojiString.length && emojiCount <= 3 && emojiCount > 0;
            }
            saveChangesListener() {
                var _a;
                const nicknameText = jQuery("#nickname-edit").val().slice(0, 25).replace(/^\s+|\s+$/g, "");
                debug("saveChanges button clicked: " + nicknameText), nicknameText !== (null === (_a = this._userSettingsController) || void 0 === _a ? void 0 : _a.userNickname) && this._userSettingsController && (this._userSettingsController.saveUserNickname(nicknameText), 
                this.queueMessageForFrame(SidebarMessageType.UPDATE_SETTINGS, {
                    userSettings: this._userSettingsController.userSettings
                }), this._emitToSocket(this._getUpdateSettingsMessage(this._userSettingsController.userSettings)), 
                jQuery("#nickname-edit").attr("placeholder", nicknameText), jQuery("#nickname-edit").text(nicknameText)), 
                this.toggleIconContainer();
            }
            cancelNicknameListener() {
                this.toggleIconContainer();
            }
            get inSession() {
                return this._inSession;
            }
            addIconSelector() {
                Object.keys(iconMap).forEach((categoryName => {
                    if (enableIconsetFunctions[categoryName]()) {
                        const icons = iconMap[categoryName], iconHolder = jQuery('\n                <ul id="icon-holder"></ul>\n            ');
                        for (const icon of icons) this._addIconButton(`${categoryName}/${icon}`, iconHolder, icon);
                        const categorySection = jQuery(`\n                <div class="icon-holder-wrap">\n                  <p class="extension-txt-indicator" data-tp-id="chat_container-new_icon_selection-category_name>${categoryName}</p>\n                </div>\n            `);
                        iconHolder.appendTo(categorySection), categorySection.appendTo(jQuery("#icon-holder-template"));
                    }
                }), this);
            }
            inputHeightCheck() {
                const currentInput = jQuery("#chat-input").text(), tempCount = ((currentInput || "").match(EMOJI_REGEX) || []).length, nonEmojiInput = currentInput.replace(EMOJI_REGEX, "");
                tempCount <= 3 || nonEmojiInput ? jQuery(".inTextEmoji").css("font-size", "24px") : tempCount > 0 ? jQuery(".inTextEmoji").css("font-size", "20px") : jQuery(".inTextEmoji").css("font-size", "18px");
            }
            _addIconButton(iconPath, iconHolder, iconName) {
                jQuery(`\n            <a class="image-button">\n                <img class="img-class" src='${chrome.runtime.getURL("img/icons/" + iconPath)}' data-tp-id="chat_container-new_icon_selection-${iconName}">\n            </a>\n        `).appendTo(iconHolder).data("icon", iconPath);
            }
        } {
            constructor(videoApi) {
                super(), this._customCss = "\n          .chat-wrapper-short {\n            height: calc(100% - 126px) !important;\n            position: absolute !important;\n          }\n\n          .tp-left-align {\n            align-items: flex-start !important;\n          }\n        ", 
                this._videoApi = videoApi;
            }
            shouldShowReaction() {
                return !this._videoApi.isWatchingAd();
            }
            teardown() {
                super.teardown(), document.documentElement.style.overflow = "auto";
            }
            getReactionContainer() {
                return jquery_default()("body");
            }
            _injectChat() {
                this._chatHtml && (jquery_default()("#rn-video").parent().append(function(chatHtml, customCss = "") {
                    return `\n    <style>\n      ${css_alert}\n    </style>\n\n      <style tpInjected>\n    \n\n      .with-chat {\n        left: 0px !important;\n        width: calc(100% - 304px) !important;\n      }\n\n      .tp-video {\n        transition: width 250ms linear 0.2s;\n      }\n\n      ${customCss}\n    \n      ${chat}\n      \n    </style>\n\n    ${chatHtml}\n  `;
                }(this._chatHtml, this._customCss)), document.documentElement.style.overflow = "hidden");
            }
            getVideoTitle() {
                return HboMaxChatApi_awaiter(this, void 0, void 0, (function*() {
                    return yield this._videoApi.waitUpdateAPIState(), this._videoApi.getSeriesName();
                }));
            }
            getChatVisible() {
                return jquery_default()("#chat-wrapper").is(":visible");
            }
            shouldAddReactionSpace() {
                return !0;
            }
            setChatVisible(visible, userInitiated = !0) {
                const _super = Object.create(null, {
                    setChatVisible: {
                        get: () => super.setChatVisible
                    }
                });
                return HboMaxChatApi_awaiter(this, void 0, void 0, (function*() {
                    try {
                        yield _super.setChatVisible.call(this, visible, userInitiated);
                    } catch (e) {
                        if (!visible) {
                            const setChatEvent = new CustomEvent("tpVideoNode", {
                                detail: {
                                    type: "SetChatVisible",
                                    visible
                                }
                            });
                            window.dispatchEvent(setChatEvent);
                        }
                        return;
                    }
                    if (console.log("set chat"), this._videoApi.canFixChat()) {
                        const setChatEvent = new CustomEvent("tpVideoNode", {
                            detail: {
                                type: "SetChatVisible",
                                visible
                            }
                        });
                        window.dispatchEvent(setChatEvent);
                        const videoWrapper = jquery_default()("#rn-video").parent();
                        visible ? (jquery_default()("#chat-wrapper").show(), document.hasFocus() || this.clearUnreadCount(), 
                        videoWrapper.addClass("tp-left-align")) : (jquery_default()("#chat-wrapper").hide(), 
                        videoWrapper.removeClass("tp-left-align"));
                    } else this.setChatVisibleOld(visible);
                }));
            }
            setChatVisibleOld(visible) {
                return HboMaxChatApi_awaiter(this, void 0, void 0, (function*() {
                    visible ? (jquery_default()("video").width(window.innerWidth - 304), jquery_default()("video").addClass("tp-video"), 
                    jquery_default()("#chat-wrapper").addClass("chat-wrapper-short"), jquery_default()("#chat-wrapper").show(), 
                    document.hasFocus() || this.clearUnreadCount()) : (jquery_default()("video").width(window.innerWidth), 
                    jquery_default()("#chat-wrapper").hide(), jquery_default()(window).trigger("resize")), 
                    this.fixSkipButtons(visible);
                }));
            }
            fixSkipButtons(visible) {
                const skipButton = document.querySelector("[data-testid='SkipButton']");
                skipButton && (skipButton.style.left = visible ? "-250px" : "10px", console.log("Fixing skip button" + skipButton), 
                skipButton.onclick = e => HboMaxChatApi_awaiter(this, void 0, void 0, (function*() {
                    return console.log("Clicked skip"), e.stopPropagation(), e.stopImmediatePropagation(), 
                    skipButton.style.left = "10px", yield delay(250)(), clickAtProgress(skipButton, .5, "mousedown"), 
                    clickAtProgress(skipButton, .5, "mouseup"), !1;
                })));
                const upNextButton = document.querySelector("[data-testid*='UpNext']");
                upNextButton && (upNextButton.style.left = visible ? "-250px" : "10px");
            }
        }
        var browsePopup = __webpack_require__(726), browsePopup_default = __webpack_require__.n(browsePopup);
        class PopupMessage extends Message {
            constructor(sender, target, type) {
                super(sender, target, type), this.type = type;
            }
        }
        class CreateSessionMessage extends PopupMessage {
            constructor(sender, target, data) {
                super(sender, target, PopupMessageType.CREATE_SESSION), this.data = data;
            }
        }
        const Netflix = new class extends StreamingSerivce {
            isValidUrl(url) {
                return function(url) {
                    return url.hostname.includes(".netflix.") && url.pathname.includes("/watch");
                }(url);
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
        class ReInjectMessage extends PopupMessage {
            constructor(sender, target, data) {
                super(sender, target, PopupMessageType.RE_INJECT), this.data = data;
            }
        }
        var PageControls_awaiter = function(thisArg, _arguments, P, generator) {
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
        var _a, HboMaxPageControls_awaiter = function(thisArg, _arguments, P, generator) {
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
        class HboMaxPageControls extends class {
            constructor(chatApi) {
                var _a, _b, _c;
                this.overlayVisible = !1, this._scriptLoading = !1, this._hostOnlyControls = !1, 
                this._unopenedMessageCount = 0, this._manualShow = !1, this._showRunning = !1, this._overlayEnabled = !1, 
                this.checkShowMenu = () => {
                    this.shouldMenuBeVisible() ? this.showTpIcon() : this.hideTpIcon();
                }, console.log("Teleparty Browse Loaded " + (null === (_a = window.teleparty) || void 0 === _a ? void 0 : _a.tabId)), 
                this._extensionTab = new ExtensionTab(new URL(window.location.href), null !== (_c = null === (_b = window.teleparty) || void 0 === _b ? void 0 : _b.tabId) && void 0 !== _c ? _c : 0), 
                this._chatAPI = chatApi, this._chatAPI.setPageControls(this);
            }
            setChatApi(chatApi) {
                this._chatAPI = chatApi, this._chatAPI.setPageControls(this);
            }
            loadHostOnlyImage() {
                jQuery("#tp-control-lock-button .tooltiptext").text(this._hostOnlyControls ? "Only I have control" : "Everyone has control"), 
                this._hostOnlyControls ? (jQuery("#tp-unlocked-image").addClass("hidden"), jQuery("#tp-locked-image").removeClass("hidden")) : (jQuery("#tp-unlocked-image").removeClass("hidden"), 
                jQuery("#tp-locked-image").addClass("hidden"));
            }
            onHostOnlyClicked() {
                this._scriptLoading || (this._hostOnlyControls = !this._hostOnlyControls, this.loadHostOnlyImage());
            }
            setResetChatButton() {
                this._chatAPI.getChatWindowVisible() ? (jQuery("#tp-chat-button .tooltiptext").text("Reset View"), 
                jQuery("#tp-chat-reset").removeClass("hidden"), jQuery("#tp-chat-gray").addClass("hidden"), 
                jQuery("#tp-chat-button .tp-hover-image").addClass("hidden"), jQuery("#tp-chat-hidden").addClass("hidden")) : (jQuery("#tp-chat-button .tooltiptext").text("Open Chat"), 
                jQuery("#tp-chat-reset").addClass("hidden"), jQuery("#tp-chat-gray").removeClass("hidden"), 
                jQuery("#tp-chat-button .tp-hover-image").removeClass("hidden"), jQuery("#tp-chat-hidden").removeClass("hidden"));
            }
            showMessageIndicator() {
                jQuery("#tp-chat-hidden").addClass("hidden"), this._chatAPI.isPartyWindowsActive() ? (this.setResetChatButton(), 
                jQuery("#tp-message-indicator").removeClass("hidden")) : (jQuery("#tp-message-indicator").removeClass("hidden"), 
                jQuery("#tp-chat-button .tooltiptext").text(`${this._unopenedMessageCount} unread ${1 == this._unopenedMessageCount ? "message" : "messages"}`), 
                jQuery("#tp-chat-gray").removeClass("hidden"), jQuery("#tp-chat-reset").addClass("hidden"), 
                jQuery("#tp-chat-button .tp-hover-image").removeClass("hidden"));
            }
            hideMessageIndicator() {
                jQuery("#tp-message-indicator").addClass("hidden"), this._chatAPI.isPartyWindowsActive() ? this.setResetChatButton() : (jQuery("#tp-chat-button .tp-hover-image").removeClass("hidden"), 
                jQuery("#tp-chat-button .tooltiptext").text("Show chat"), jQuery("#tp-chat-gray").addClass("hidden"), 
                jQuery("#tp-chat-hidden").removeClass("hidden"), jQuery("#tp-chat-reset").addClass("hidden"));
            }
            onChatMessage() {
                this._chatAPI.shouldChatBeVisible() || this._chatAPI.isPartyWindowsActive() || (this._unopenedMessageCount++, 
                this.showMessageIndicator(), this._manualShow = !0, this.showTpIcon(), delay(1e3)().then((() => {
                    this._manualShow = !1;
                })));
            }
            teardown() {
                this.disablePartyIcons(), this.hideTpIcon(), this._checkMenuInterval && clearInterval(this._checkMenuInterval);
            }
            sendCreate() {
                var _a;
                return PageControls_awaiter(this, void 0, void 0, (function*() {
                    if (this._scriptLoading || this._chatAPI.inSession) return;
                    if (this.startSpinning(), this._scriptLoading = !0, !(null === (_a = window.teleparty) || void 0 === _a ? void 0 : _a.contentScriptInjected)) {
                        console.log("Re injecting");
                        const reInjectMessage = new ReInjectMessage("Page_Controls", "Service_Background", {
                            extensionTabData: this._extensionTab
                        });
                        try {
                            yield Messaging_MessagePasser.sendMessageToExtension(reInjectMessage);
                        } catch (err) {
                            return console.log(err), this.stopSpinning(), this.logError(err), this.showError(GenericErrorMessage), 
                            void (this._scriptLoading = !1);
                        }
                    }
                    console.log("Sending create");
                    const createSessionMessage = this.getCreateSessionMessage();
                    try {
                        const response = yield Messaging_MessagePasser.sendMessageToExtension(createSessionMessage);
                        response.error ? (this.showError(response.error.message), this.logError(response.error.message)) : (this._scriptLoading = !1, 
                        this.sessionId = response.sessionId, this.showChatOpenButton(), this.enablePartyIcons());
                    } catch (err) {
                        console.log(err), this.showError(GenericErrorMessage), this.logError(err);
                    }
                    this.stopSpinning(), this._scriptLoading = !1;
                }));
            }
            enablePartyIcons() {
                this.hideError(), jQuery("#tp-party-active").removeClass("hidden"), jQuery("#tp-party-inactive").addClass("hidden"), 
                jQuery("#tp-icon-container .tooltiptext").addClass("hidden"), jQuery("#tp-icon-container").attr("style", "cursor: auto");
            }
            disablePartyIcons() {
                jQuery("#tp-party-active").addClass("hidden"), jQuery("#tp-party-inactive").removeClass("hidden"), 
                jQuery("#tp-icon-container .tooltiptext").removeClass("hidden"), jQuery("#tp-icon-container").attr("style", "");
            }
            logError(message) {
                const logEventMessage = new LogEventMessage("Popup", "Service_Background", {
                    name: "error",
                    action: {
                        description: "an error has occured",
                        reason: message
                    }
                });
                Messaging_MessagePasser.sendMessageToExtension(logEventMessage);
            }
            showError(message) {
                jQuery("#tp-controls-error-text").text(message), jQuery("#tp-error-box").removeClass("hidden"), 
                jQuery("#tp-icon-container .tooltiptext").addClass("hidden");
            }
            hideError() {
                jQuery("#tp-error-box").addClass("hidden");
            }
            loadImages(html) {
                return html.replace(/{EXTENSION_LOGO_WHITE}/g, escapeStr(chrome.runtime.getURL("img/icon_white.svg"))).replace(/{EXTENSION_LOGO_GRADIENT}/g, escapeStr(chrome.runtime.getURL("img/icon_gradient.svg"))).replace(/{PLAY_IMAGE}/g, escapeStr(chrome.runtime.getURL("img/play.svg"))).replace(/{UNLOCKED_IMAGE}/g, escapeStr(chrome.runtime.getURL("img/icon_remote_inactive.svg"))).replace(/{LOCKED_IMAGE}/g, escapeStr(chrome.runtime.getURL("img/icon_remote_active.svg"))).replace(/{ARROW_RIGHT}/g, escapeStr(chrome.runtime.getURL("img/arrow-right.svg"))).replace(/{LINK_IMAGE}/g, escapeStr(chrome.runtime.getURL("img/icon_link_active.svg"))).replace(/{LINK_ACTIVE_IMAGE}/g, escapeStr(chrome.runtime.getURL("img/icon_link_active.svg"))).replace(/{CHAT_HIDDEN_IMAGE}/g, escapeStr(chrome.runtime.getURL("img/icon_chat_inactive.svg"))).replace(/{CHAT_GRAY_IMAGE}/g, escapeStr(chrome.runtime.getURL("img/icon_chatgray_active.svg"))).replace(/{CHAT_ACTIVE_IMAGE}/g, escapeStr(chrome.runtime.getURL("img/icon_chat_active.svg"))).replace(/{DISCONNECT_IMAGE}/g, escapeStr(chrome.runtime.getURL("img/icon_logout_active.svg"))).replace(/{RESET_CHAT_IMAGE}/g, escapeStr(chrome.runtime.getURL("img/reset_chat.svg")));
            }
            hideTpIcon() {
                this._manualShow || (this.hideError(), jQuery("#tpIconContainer").addClass("hidden"));
            }
            showTpIcon() {
                return PageControls_awaiter(this, void 0, void 0, (function*() {
                    if (!this._showRunning && (this._overlayEnabled || this._chatAPI.inSession)) {
                        this._showRunning = !0;
                        try {
                            yield this.addTpIcon(), this._chatAPI.inSession ? this.enablePartyIcons() : this.disablePartyIcons(), 
                            jQuery("#tpIconContainer").removeClass("hidden"), this.setChatButtons();
                        } finally {
                            this._showRunning = !1;
                        }
                    }
                }));
            }
            startEventListener() {
                this._checkMenuInterval = setInterval(this.checkShowMenu, 200);
            }
            stopEventListener() {
                this._checkMenuInterval && clearInterval(this._checkMenuInterval);
            }
            getControlsHeight() {
                return "100px";
            }
            addTpIcon() {
                return PageControls_awaiter(this, void 0, void 0, (function*() {
                    if ((this._overlayEnabled || this._chatAPI.inSession) && 0 === jQuery("#tpIconContainer").length) {
                        const sideHtml = this.loadImages(browsePopup_default()), controlsRoot = yield this.getControlsRoot();
                        controlsRoot.length > 0 && controlsRoot.append(function(browseHtml, customCss = "") {
                            return `\n    <style>\n      ${browse}\n      ${customCss}\n    </style>\n    ${browseHtml}\n  `;
                        }(sideHtml)), this.loadHostOnlyImage(), this._setupEventHandlers();
                    }
                }));
            }
            _setupEventHandlers() {
                jQuery("#tp-control-lock-button").click(this.onHostOnlyClicked.bind(this)), jQuery("#tp-buttons-container").attr("style", `top:${this.getControlsHeight()}`), 
                jQuery("#tp-chat-close-button").attr("style", `top:${this.getControlsHeight()}`), 
                jQuery("#tp-error-box").attr("style", `top:${this.getControlsHeight()}`), jQuery("#tp-link-button").click(this.onLinkClicked.bind(this)), 
                jQuery("#tp-chat-close-button")[0].addEventListener("mousedown", (e => (e.stopImmediatePropagation(), 
                e.stopPropagation(), !1)), {
                    capture: !0
                }), jQuery("#tp-chat-close-button")[0].addEventListener("mouseup", (e => (this.onToggleChat(), 
                e.stopImmediatePropagation(), e.stopPropagation(), !1)), {
                    capture: !0
                }), jQuery("#tp-icon-container")[0].addEventListener("mousedown", (e => (this.sendCreate(), 
                e.stopImmediatePropagation(), e.stopPropagation(), !1)), {
                    capture: !0
                }), jQuery("#tp-chat-button")[0].addEventListener("mousedown", (e => (this.onToggleChat(), 
                e.stopImmediatePropagation(), e.stopPropagation(), !1)), {
                    capture: !0
                }), jQuery("#tp-disconnect-button").click(this.onDisconnect.bind(this));
            }
            onDisconnect() {
                const teardownMessage = new TeardownMessage("Page_Controls", "Service_Background", DEFAULT_TEARDOWN);
                Messaging_MessagePasser.sendMessageToExtension(teardownMessage), this.hideTpIcon();
            }
            onLinkClicked() {
                this._chatAPI.linkIconListener(), jQuery("#tp-link-button .tooltiptext").text("Link copied"), 
                setTimeout((() => {
                    jQuery("#tp-link-button .tooltiptext").text("Copy join link");
                }), 1e3);
            }
            onToggleChat() {
                return PageControls_awaiter(this, void 0, void 0, (function*() {
                    this._unopenedMessageCount = 0, this.hideMessageIndicator(), this._chatAPI.isPartyWindowsActive() ? this._chatAPI.resetChatWindow(!0) : (this._chatAPI.shouldChatBeVisible(), 
                    yield this._chatAPI.setChatVisible(!this._chatAPI.shouldChatBeVisible()), this.setChatButtons());
                }));
            }
            onInitChat() {
                this.overlayVisible && this.showTpIcon();
            }
            setChatButtons() {
                this._chatAPI.inSession && this._chatAPI.getChatVisible() ? this.showChatOpenButton() : this.hideChatOpenButton(), 
                this._chatAPI.isPartyWindowsActive() ? this.setResetChatButton() : this.hideMessageIndicator();
            }
            showChatOpenButton() {
                return PageControls_awaiter(this, void 0, void 0, (function*() {
                    this._chatAPI.inSession && this._chatAPI.shouldChatBeVisible() && (jQuery("#tp-chat-close-button").removeClass("hidden"), 
                    jQuery("#tp-buttons-container").addClass("hidden"));
                }));
            }
            hideChatOpenButton() {
                jQuery("#tp-chat-close-button").addClass("hidden"), jQuery("#tp-buttons-container").removeClass("hidden");
            }
            getCreateSessionMessage() {
                return new CreateSessionMessage("Page_Controls", "Service_Background", this.getCreateSessionData());
            }
            getCreateSessionData() {
                return {
                    createSettings: {
                        controlLock: this._hostOnlyControls
                    },
                    extensionTabData: this._extensionTab,
                    pageControls: !0
                };
            }
            startSpinning() {
                jQuery("#tp-icon-container .tooltiptext").html('Loading <span class="ellipsis-anim"><span>.</span><span>.</span><span>.</span></span>');
            }
            stopSpinning() {
                jQuery("#tp-icon-container .tooltiptext").html("Start a party");
            }
        } {
            constructor() {
                super(...arguments), this._showing = !1;
            }
            getControlsRoot() {
                return HboMaxPageControls_awaiter(this, void 0, void 0, (function*() {
                    return jQuery("body");
                }));
            }
            shouldMenuBeVisible() {
                return null !== document.querySelector("[aria-label='Dismiss Controls']");
            }
            getControlsHeight() {
                return "100px";
            }
        }
        class HboMaxContentScript extends class {
            constructor(chatApi, videoApi, videoEventListener, pageControls) {
                this._chatApi = chatApi, this._videoApi = videoApi, this._videoEventListener = videoEventListener, 
                this._pageControls = pageControls, window.teleparty && !window.teleparty.pageControls ? (window.teleparty.pageControls = pageControls, 
                console.log("Setting Page COntrols")) : (pageControls.setChatApi(this._chatApi), 
                console.log("Resetting Chat Api for old controls")), this._chatMessageForwarder = new ChatMessageForwarder(this._chatApi, this._pageControls), 
                this._videoMessageForwarder = new VideoMessageForwarder(this._videoApi, this._chatApi, this._videoEventListener), 
                this._isContentScriptReady = !1, this._isContentScriptLoading = !1, this._showingReviewMessage = !1, 
                this._messageReceiver = new CSMessageReceiver, this._messageReceiver.addMessageListener(this._videoMessageForwarder), 
                this._messageReceiver.addMessageListener(this._chatMessageForwarder), this._messageReceiver.addMessageListener(this), 
                this._hasBackgroundConnection = !1, this._setupPingPort();
            }
            loadBrowseButton() {
                return ContentScript_awaiter(this, void 0, void 0, (function*() {
                    yield this._pageControls.addTpIcon(), this._pageControls.startEventListener();
                }));
            }
            _setupPingPort() {
                const backgroundPort = chrome.runtime.connect();
                backgroundPort.onDisconnect.addListener((() => {
                    console.log("Lost background script. Teardown");
                    const teardownData = {
                        showAlert: this._chatApi.inSession,
                        alertModal: lostBackgroundConnectionModal
                    };
                    this._teardown(teardownData);
                })), backgroundPort.onMessage.addListener((() => {
                    debug("Got background script"), this._hasBackgroundConnection = !0;
                }));
            }
            onMessage(message, _sender, sendResponse) {
                if ("Content_Script" == message.target) {
                    if (message.type === PopupMessageType.IS_CONTENT_SCRIPT_READY) {
                        if (this._isContentScriptReady) {
                            sendResponse({
                                ready: !0
                            });
                        } else this._isContentScriptLoading || (this._isContentScriptLoading = !0, this._waitScriptReadyAsync().then(sendResponse));
                        return !0;
                    }
                    if (message.type === PopupMessageType.GET_INIT_DATA) {
                        return sendResponse(this._getInitDataResponse()), !0;
                    }
                    if (message.type === PopupMessageType.DISCONNECT && "Popup" == message.sender) {
                        const teardownMessage = new TeardownMessage("Content_Script", "Service_Background", DEFAULT_TEARDOWN);
                        Messaging_MessagePasser.sendMessageToExtension(teardownMessage), sendResponse();
                    } else if (message.type == BackgroundMessageType.TEARDOWN) {
                        const teardownMessage = message;
                        return this._teardown(teardownMessage.data), sendResponse(), !0;
                    }
                }
                return !1;
            }
            _teardown(data) {
                var _a, _b, _c;
                if (data.showAlert && data.alertModal) {
                    const buttonUrl = null !== (_a = data.buttonUrl) && void 0 !== _a ? _a : this._chatApi.getPartyUrl();
                    showButtonMessage(data.alertModal, buttonUrl);
                }
                this._pageControls.teardown(), this._videoMessageForwarder.teardown(), this._chatMessageForwarder.teardown(), 
                this._messageReceiver.teardown();
                const logEventData = {
                    name: "error",
                    action: {
                        description: null === (_b = data.alertModal) || void 0 === _b ? void 0 : _b.title,
                        reason: null === (_c = data.alertModal) || void 0 === _c ? void 0 : _c.content
                    }
                }, logEventMessage = new LogEventMessage("Content_Script", "Service_Background", logEventData);
                Messaging_MessagePasser.sendMessageToExtension(logEventMessage), window.teleparty && (window.teleparty.contentScriptInjected = !1) && (window.teleparty.contentScriptReady = !1);
            }
            logError(data) {
                const logEventMessage = new LogEventMessage("Content_Script", "Service_Background", {
                    name: "error",
                    action: {
                        reason: data
                    }
                });
                Messaging_MessagePasser.sendMessageToExtension(logEventMessage);
            }
            waitBackgroundConnectionReadyAsync() {
                return ContentScript_awaiter(this, void 0, void 0, (function*() {
                    return delayUntil((() => this._hasBackgroundConnection), 5e3)();
                }));
            }
            _waitScriptReadyAsync() {
                return ContentScript_awaiter(this, void 0, void 0, (function*() {
                    try {
                        yield this.waitBackgroundConnectionReadyAsync();
                        const response = yield this._waitContentScriptReadyAsync();
                        return this.loadBrowseButton(), response;
                    } catch (error) {
                        const errorData = {
                            message: "Failed to connect to Script. Please refresh the page and try again",
                            showButton: !1
                        };
                        return this.logError("Failed to connect to Script. Please refresh the page and try again"), 
                        {
                            ready: !1,
                            error: errorData
                        };
                    } finally {
                        this._isContentScriptLoading = !1;
                    }
                }));
            }
            _waitContentScriptReadyAsync() {
                return ContentScript_awaiter(this, void 0, void 0, (function*() {
                    let errorData;
                    try {
                        yield this._videoApi.waitVideoApiReadyAsync();
                        const response = yield this._waitBackgroundResponseAsync();
                        response && response.error ? (debug("Error"), errorData = {
                            message: response.error,
                            showButton: !0
                        }, this._isContentScriptReady = !0, window.teleparty && (window.teleparty.contentScriptReady = !0)) : (response && response.showReviewMessage && (this._showingReviewMessage = !0), 
                        this._isContentScriptReady = !0, window.teleparty && (window.teleparty.contentScriptReady = !0));
                    } catch (error) {
                        errorData = {
                            message: error.message,
                            showButton: !1
                        }, this.logError(error.message);
                    }
                    return {
                        ready: this._isContentScriptReady,
                        error: errorData
                    };
                }));
            }
            _getInitDataResponse() {
                return {
                    inSession: this._chatApi.inSession,
                    isChatVisible: this._chatApi.isPartyWindowsActive() ? this._chatApi.getChatWindowVisible() : this._chatApi.getChatVisible(),
                    partyUrl: this._chatApi.getPartyUrl(),
                    showReviewMessage: !1,
                    partyWindowsActive: this._chatApi.isPartyWindowsActive()
                };
            }
            _waitBackgroundResponseAsync() {
                return ContentScript_awaiter(this, void 0, void 0, (function*() {
                    const getSessionDataMessage = yield this._getSessionDataRequestAsync();
                    return Messaging_MessagePasser.sendMessageToExtension(getSessionDataMessage);
                }));
            }
            _getSessionDataRequestAsync() {
                return ContentScript_awaiter(this, void 0, void 0, (function*() {
                    const sessionRequestData = {
                        videoId: (yield this._videoApi.getVideoDataAsync()).videoId
                    };
                    return new GetSessionDataMessage("Content_Script", "Service_Background", sessionRequestData);
                }));
            }
        } {
            constructor() {
                const hboMaxVideoApi = new HboMaxVideoApi, hboMaxChatApi = new HboMaxChatApi(hboMaxVideoApi), hboMaxVideoEventListener = new HboMaxVideoEventListener(hboMaxVideoApi, hboMaxChatApi);
                let pageControls;
                window.teleparty && window.teleparty.pageControls ? (pageControls = window.teleparty.pageControls, 
                console.log("Using existing page controls")) : pageControls = new HboMaxPageControls(hboMaxChatApi), 
                super(hboMaxChatApi, hboMaxVideoApi, hboMaxVideoEventListener, pageControls);
            }
        }
        window.teleparty && (null === (_a = window.teleparty) || void 0 === _a ? void 0 : _a.contentScriptInjected) || (window.teleparty || (window.teleparty = {}), 
        window.teleparty.contentScriptInjected = !0, new HboMaxContentScript);
    })();
})();