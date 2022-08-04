/*******************************************************
* Copyright (C) 2018-2022 WP Interactive Media, Inc. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
*******************************************************/
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
        } ], EMOJI_REGEX = /(?:\uD83D(?:\uDD73\uFE0F?|\uDC41(?:(?:\uFE0F(?:\u200D\uD83D\uDDE8\uFE0F?)?|\u200D\uD83D\uDDE8\uFE0F?))?|[\uDDE8\uDDEF]\uFE0F?|\uDC4B(?:\uD83C[\uDFFB-\uDFFF])?|\uDD90(?:(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F))?|[\uDD96\uDC4C\uDC48\uDC49\uDC46\uDD95\uDC47\uDC4D\uDC4E\uDC4A\uDC4F\uDE4C\uDC50\uDE4F\uDC85\uDCAA\uDC42\uDC43\uDC76\uDC66\uDC67](?:\uD83C[\uDFFB-\uDFFF])?|\uDC71(?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2640\u2642]\uFE0F?))?)|\u200D(?:[\u2640\u2642]\uFE0F?)))?|\uDC68(?:(?:\uD83C(?:\uDFFB(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF]|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?|\uDFFC(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF]|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?|\uDFFD(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?|\uDFFE(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF]|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?|\uDFFF(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE]|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?)|\u200D(?:\uD83E[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD]|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D(?:\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uDC68\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92])|\u2708\uFE0F?|\u2764(?:\uFE0F\u200D\uD83D(?:\uDC8B\u200D\uD83D\uDC68|\uDC68)|\u200D\uD83D(?:\uDC8B\u200D\uD83D\uDC68|\uDC68)))))?|\uDC69(?:(?:\uD83C(?:\uDFFB(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D(?:\uDC69\uD83C[\uDFFC-\uDFFF]|\uDC68\uD83C[\uDFFC-\uDFFF])|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?|\uDFFC(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D(?:\uDC69\uD83C[\uDFFB\uDFFD-\uDFFF]|\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF])|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?|\uDFFD(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D(?:\uDC69\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?|\uDFFE(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D(?:\uDC69\uD83C[\uDFFB-\uDFFD\uDFFF]|\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF])|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?|\uDFFF(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D(?:\uDC69\uD83C[\uDFFB-\uDFFE]|\uDC68\uD83C[\uDFFB-\uDFFE])|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?)|\u200D(?:\uD83E[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD]|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D(?:\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92])|\u2708\uFE0F?|\u2764(?:\uFE0F\u200D\uD83D(?:\uDC8B\u200D\uD83D[\uDC68\uDC69]|[\uDC68\uDC69])|\u200D\uD83D(?:\uDC8B\u200D\uD83D[\uDC68\uDC69]|[\uDC68\uDC69])))))?|[\uDC74\uDC75](?:\uD83C[\uDFFB-\uDFFF])?|[\uDE4D\uDE4E\uDE45\uDE46\uDC81\uDE4B\uDE47\uDC6E](?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|\uDD75(?:(?:\uFE0F(?:\u200D(?:[\u2642\u2640]\uFE0F?))?|\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDC82\uDC77](?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|\uDC78(?:\uD83C[\uDFFB-\uDFFF])?|\uDC73(?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDC72\uDC70\uDC7C](?:\uD83C[\uDFFB-\uDFFF])?|[\uDC86\uDC87\uDEB6](?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDC83\uDD7A](?:\uD83C[\uDFFB-\uDFFF])?|\uDD74(?:(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F))?|\uDC6F(?:\u200D(?:[\u2642\u2640]\uFE0F?))?|[\uDEA3\uDEB4\uDEB5](?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDEC0\uDECC\uDC6D\uDC6B\uDC6C](?:\uD83C[\uDFFB-\uDFFF])?|\uDDE3\uFE0F?|\uDC15(?:\u200D\uD83E\uDDBA)?|[\uDC3F\uDD4A\uDD77\uDD78\uDDFA\uDEE3\uDEE4\uDEE2\uDEF3\uDEE5\uDEE9\uDEF0\uDECE\uDD70\uDD79\uDDBC\uDD76\uDECD\uDDA5\uDDA8\uDDB1\uDDB2\uDCFD\uDD6F\uDDDE\uDDF3\uDD8B\uDD8A\uDD8C\uDD8D\uDDC2\uDDD2\uDDD3\uDD87\uDDC3\uDDC4\uDDD1\uDDDD\uDEE0\uDDE1\uDEE1\uDDDC\uDECF\uDECB\uDD49]\uFE0F?|[\uDE00\uDE03\uDE04\uDE01\uDE06\uDE05\uDE02\uDE42\uDE43\uDE09\uDE0A\uDE07\uDE0D\uDE18\uDE17\uDE1A\uDE19\uDE0B\uDE1B-\uDE1D\uDE10\uDE11\uDE36\uDE0F\uDE12\uDE44\uDE2C\uDE0C\uDE14\uDE2A\uDE34\uDE37\uDE35\uDE0E\uDE15\uDE1F\uDE41\uDE2E\uDE2F\uDE32\uDE33\uDE26-\uDE28\uDE30\uDE25\uDE22\uDE2D\uDE31\uDE16\uDE23\uDE1E\uDE13\uDE29\uDE2B\uDE24\uDE21\uDE20\uDE08\uDC7F\uDC80\uDCA9\uDC79-\uDC7B\uDC7D\uDC7E\uDE3A\uDE38\uDE39\uDE3B-\uDE3D\uDE40\uDE3F\uDE3E\uDE48-\uDE4A\uDC8B\uDC8C\uDC98\uDC9D\uDC96\uDC97\uDC93\uDC9E\uDC95\uDC9F\uDC94\uDC9B\uDC9A\uDC99\uDC9C\uDDA4\uDCAF\uDCA2\uDCA5\uDCAB\uDCA6\uDCA8\uDCA3\uDCAC\uDCAD\uDCA4\uDC40\uDC45\uDC44\uDC8F\uDC91\uDC6A\uDC64\uDC65\uDC63\uDC35\uDC12\uDC36\uDC29\uDC3A\uDC31\uDC08\uDC2F\uDC05\uDC06\uDC34\uDC0E\uDC2E\uDC02-\uDC04\uDC37\uDC16\uDC17\uDC3D\uDC0F\uDC11\uDC10\uDC2A\uDC2B\uDC18\uDC2D\uDC01\uDC00\uDC39\uDC30\uDC07\uDC3B\uDC28\uDC3C\uDC3E\uDC14\uDC13\uDC23-\uDC27\uDC38\uDC0A\uDC22\uDC0D\uDC32\uDC09\uDC33\uDC0B\uDC2C\uDC1F-\uDC21\uDC19\uDC1A\uDC0C\uDC1B-\uDC1E\uDC90\uDCAE\uDD2A\uDDFE\uDDFB\uDC92\uDDFC\uDDFD\uDD4C\uDED5\uDD4D\uDD4B\uDC88\uDE82-\uDE8A\uDE9D\uDE9E\uDE8B-\uDE8E\uDE90-\uDE9C\uDEF5\uDEFA\uDEB2\uDEF4\uDEF9\uDE8F\uDEA8\uDEA5\uDEA6\uDED1\uDEA7\uDEF6\uDEA4\uDEA2\uDEEB\uDEEC\uDCBA\uDE81\uDE9F-\uDEA1\uDE80\uDEF8\uDD5B\uDD67\uDD50\uDD5C\uDD51\uDD5D\uDD52\uDD5E\uDD53\uDD5F\uDD54\uDD60\uDD55\uDD61\uDD56\uDD62\uDD57\uDD63\uDD58\uDD64\uDD59\uDD65\uDD5A\uDD66\uDD25\uDCA7\uDEF7\uDD2E\uDC53-\uDC62\uDC51\uDC52\uDCFF\uDC84\uDC8D\uDC8E\uDD07-\uDD0A\uDCE2\uDCE3\uDCEF\uDD14\uDD15\uDCFB\uDCF1\uDCF2\uDCDE-\uDCE0\uDD0B\uDD0C\uDCBB\uDCBD-\uDCC0\uDCFA\uDCF7-\uDCF9\uDCFC\uDD0D\uDD0E\uDCA1\uDD26\uDCD4-\uDCDA\uDCD3\uDCD2\uDCC3\uDCDC\uDCC4\uDCF0\uDCD1\uDD16\uDCB0\uDCB4-\uDCB8\uDCB3\uDCB9\uDCB1\uDCB2\uDCE7-\uDCE9\uDCE4-\uDCE6\uDCEB\uDCEA\uDCEC-\uDCEE\uDCDD\uDCBC\uDCC1\uDCC2\uDCC5-\uDCD0\uDD12\uDD13\uDD0F-\uDD11\uDD28\uDD2B\uDD27\uDD29\uDD17\uDD2C\uDD2D\uDCE1\uDC89\uDC8A\uDEAA\uDEBD\uDEBF\uDEC1\uDED2\uDEAC\uDDFF\uDEAE\uDEB0\uDEB9-\uDEBC\uDEBE\uDEC2-\uDEC5\uDEB8\uDEAB\uDEB3\uDEAD\uDEAF\uDEB1\uDEB7\uDCF5\uDD1E\uDD03\uDD04\uDD19-\uDD1D\uDED0\uDD4E\uDD2F\uDD00-\uDD02\uDD3C\uDD3D\uDD05\uDD06\uDCF6\uDCF3\uDCF4\uDD31\uDCDB\uDD30\uDD1F-\uDD24\uDD34\uDFE0-\uDFE2\uDD35\uDFE3-\uDFE5\uDFE7-\uDFE9\uDFE6\uDFEA\uDFEB\uDD36-\uDD3B\uDCA0\uDD18\uDD33\uDD32\uDEA9])|\uD83E(?:[\uDD1A\uDD0F\uDD1E\uDD1F\uDD18\uDD19\uDD1B\uDD1C\uDD32\uDD33\uDDB5\uDDB6\uDDBB\uDDD2](?:\uD83C[\uDFFB-\uDFFF])?|\uDDD1(?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?)|\u200D(?:\uD83E(?:\uDD1D\u200D\uD83E\uDDD1|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?)))?|[\uDDD4\uDDD3](?:\uD83C[\uDFFB-\uDFFF])?|[\uDDCF\uDD26\uDD37](?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDD34\uDDD5\uDD35\uDD30\uDD31\uDD36](?:\uD83C[\uDFFB-\uDFFF])?|[\uDDB8\uDDB9\uDDD9-\uDDDD](?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDDDE\uDDDF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?|[\uDDCD\uDDCE\uDDD6\uDDD7\uDD38](?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|\uDD3C(?:\u200D(?:[\u2642\u2640]\uFE0F?))?|[\uDD3D\uDD3E\uDD39\uDDD8](?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDD23\uDD70\uDD29\uDD2A\uDD11\uDD17\uDD2D\uDD2B\uDD14\uDD10\uDD28\uDD25\uDD24\uDD12\uDD15\uDD22\uDD2E\uDD27\uDD75\uDD76\uDD74\uDD2F\uDD20\uDD73\uDD13\uDDD0\uDD7A\uDD71\uDD2C\uDD21\uDD16\uDDE1\uDD0E\uDD0D\uDD1D\uDDBE\uDDBF\uDDE0\uDDB7\uDDB4\uDD3A\uDDB0\uDDB1\uDDB3\uDDB2\uDD8D\uDDA7\uDDAE\uDD8A\uDD9D\uDD81\uDD84\uDD93\uDD8C\uDD99\uDD92\uDD8F\uDD9B\uDD94\uDD87\uDDA5\uDDA6\uDDA8\uDD98\uDDA1\uDD83\uDD85\uDD86\uDDA2\uDD89\uDDA9\uDD9A\uDD9C\uDD8E\uDD95\uDD96\uDD88\uDD8B\uDD97\uDD82\uDD9F\uDDA0\uDD40\uDD6D\uDD5D\uDD65\uDD51\uDD54\uDD55\uDD52\uDD6C\uDD66\uDDC4\uDDC5\uDD5C\uDD50\uDD56\uDD68\uDD6F\uDD5E\uDDC7\uDDC0\uDD69\uDD53\uDD6A\uDD59\uDDC6\uDD5A\uDD58\uDD63\uDD57\uDDC8\uDDC2\uDD6B\uDD6E\uDD5F-\uDD61\uDD80\uDD9E\uDD90\uDD91\uDDAA\uDDC1\uDD67\uDD5B\uDD42\uDD43\uDD64\uDDC3\uDDC9\uDDCA\uDD62\uDD44\uDDED\uDDF1\uDDBD\uDDBC\uDE82\uDDF3\uDE90\uDDE8\uDDE7\uDD47-\uDD49\uDD4E\uDD4F\uDD4D\uDD4A\uDD4B\uDD45\uDD3F\uDD4C\uDE80\uDE81\uDDFF\uDDE9\uDDF8\uDDF5\uDDF6\uDD7D\uDD7C\uDDBA\uDDE3-\uDDE6\uDD7B\uDE71-\uDE73\uDD7E\uDD7F\uDE70\uDDE2\uDE95\uDD41\uDDEE\uDE94\uDDFE\uDE93\uDDAF\uDDF0\uDDF2\uDDEA-\uDDEC\uDE78-\uDE7A\uDE91\uDE92\uDDF4\uDDF7\uDDF9-\uDDFD\uDDEF])|[\u263A\u2639\u2620\u2763\u2764]\uFE0F?|\u270B(?:\uD83C[\uDFFB-\uDFFF])?|[\u270C\u261D](?:(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F))?|\u270A(?:\uD83C[\uDFFB-\uDFFF])?|\u270D(?:(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F))?|\uD83C(?:\uDF85(?:\uD83C[\uDFFB-\uDFFF])?|\uDFC3(?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDFC7\uDFC2](?:\uD83C[\uDFFB-\uDFFF])?|\uDFCC(?:(?:\uFE0F(?:\u200D(?:[\u2642\u2640]\uFE0F?))?|\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDFC4\uDFCA](?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|\uDFCB(?:(?:\uFE0F(?:\u200D(?:[\u2642\u2640]\uFE0F?))?|\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDFF5\uDF36\uDF7D\uDFD4-\uDFD6\uDFDC-\uDFDF\uDFDB\uDFD7\uDFD8\uDFDA\uDFD9\uDFCE\uDFCD\uDF21\uDF24-\uDF2C\uDF97\uDF9F\uDF96\uDF99-\uDF9B\uDF9E\uDFF7\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37]\uFE0F?|\uDFF4(?:(?:\u200D\u2620\uFE0F?|\uDB40\uDC67\uDB40\uDC62\uDB40(?:\uDC65\uDB40\uDC6E\uDB40\uDC67\uDB40\uDC7F|\uDC73\uDB40\uDC63\uDB40\uDC74\uDB40\uDC7F|\uDC77\uDB40\uDC6C\uDB40\uDC73\uDB40\uDC7F)))?|\uDFF3(?:(?:\uFE0F(?:\u200D\uD83C\uDF08)?|\u200D\uD83C\uDF08))?|\uDDE6\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF]|\uDDE7\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF]|\uDDE8\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF]|\uDDE9\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF]|\uDDEA\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA]|\uDDEB\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7]|\uDDEC\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE]|\uDDED\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA]|\uDDEE\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9]|\uDDEF\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5]|\uDDF0\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF]|\uDDF1\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE]|\uDDF2\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF]|\uDDF3\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF]|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE]|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC]|\uDDF8\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF]|\uDDF9\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF]|\uDDFA\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF]|\uDDFB\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA]|\uDDFC\uD83C[\uDDEB\uDDF8]|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C[\uDDEA\uDDF9]|\uDDFF\uD83C[\uDDE6\uDDF2\uDDFC]|[\uDFFB-\uDFFF\uDF38-\uDF3C\uDF37\uDF31-\uDF35\uDF3E-\uDF43\uDF47-\uDF53\uDF45\uDF46\uDF3D\uDF44\uDF30\uDF5E\uDF56\uDF57\uDF54\uDF5F\uDF55\uDF2D-\uDF2F\uDF73\uDF72\uDF7F\uDF71\uDF58-\uDF5D\uDF60\uDF62-\uDF65\uDF61\uDF66-\uDF6A\uDF82\uDF70\uDF6B-\uDF6F\uDF7C\uDF75\uDF76\uDF7E\uDF77-\uDF7B\uDF74\uDFFA\uDF0D-\uDF10\uDF0B\uDFE0-\uDFE6\uDFE8-\uDFED\uDFEF\uDFF0\uDF01\uDF03-\uDF07\uDF09\uDFA0-\uDFA2\uDFAA\uDF11-\uDF20\uDF0C\uDF00\uDF08\uDF02\uDF0A\uDF83\uDF84\uDF86-\uDF8B\uDF8D-\uDF91\uDF80\uDF81\uDFAB\uDFC6\uDFC5\uDFC0\uDFD0\uDFC8\uDFC9\uDFBE\uDFB3\uDFCF\uDFD1-\uDFD3\uDFF8\uDFA3\uDFBD\uDFBF\uDFAF\uDFB1\uDFAE\uDFB0\uDFB2\uDCCF\uDC04\uDFB4\uDFAD\uDFA8\uDF92\uDFA9\uDF93\uDFBC\uDFB5\uDFB6\uDFA4\uDFA7\uDFB7-\uDFBB\uDFA5\uDFAC\uDFEE\uDFF9\uDFE7\uDFA6\uDD8E\uDD91-\uDD9A\uDE01\uDE36\uDE2F\uDE50\uDE39\uDE1A\uDE32\uDE51\uDE38\uDE34\uDE33\uDE3A\uDE35\uDFC1\uDF8C])|\u26F7\uFE0F?|\u26F9(?:(?:\uFE0F(?:\u200D(?:[\u2642\u2640]\uFE0F?))?|\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\u2618\u26F0\u26E9\u2668\u26F4\u2708\u23F1\u23F2\u2600\u2601\u26C8\u2602\u26F1\u2744\u2603\u2604\u26F8\u2660\u2665\u2666\u2663\u265F\u26D1\u260E\u2328\u2709\u270F\u2712\u2702\u26CF\u2692\u2694\u2699\u2696\u26D3\u2697\u26B0\u26B1\u26A0\u2622\u2623\u2B06\u2197\u27A1\u2198\u2B07\u2199\u2B05\u2196\u2195\u2194\u21A9\u21AA\u2934\u2935\u269B\u2721\u2638\u262F\u271D\u2626\u262A\u262E\u25B6\u23ED\u23EF\u25C0\u23EE\u23F8-\u23FA\u23CF\u2640\u2642\u2695\u267E\u267B\u269C\u2611\u2714\u2716\u303D\u2733\u2734\u2747\u203C\u2049\u3030\u00A9\u00AE\u2122]\uFE0F?|[\u0023\u002A\u0030-\u0039](?:\uFE0F\u20E3|\u20E3)|[\u2139\u24C2\u3297\u3299\u25FC\u25FB\u25AA\u25AB]\uFE0F?|[\u2615\u26EA\u26F2\u26FA\u26FD\u2693\u26F5\u231B\u23F3\u231A\u23F0\u2B50\u26C5\u2614\u26A1\u26C4\u2728\u26BD\u26BE\u26F3\u267F\u26D4\u2648-\u2653\u26CE\u23E9-\u23EC\u2B55\u2705\u274C\u274E\u2795-\u2797\u27B0\u27BF\u2753-\u2755\u2757\u26AB\u26AA\u2B1B\u2B1C\u25FE\u25FD])/g;
        var debug = console.log.bind(window.console);
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
        var PlaybackState, HboVideoType, SessionState, StreamingServiceName, __awaiter = function(thisArg, _arguments, P, generator) {
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
        function injectScriptText(script) {
            const s = document.createElement("script");
            s.setAttribute("tpInjected", ""), s.textContent = script, (document.head || document.documentElement).appendChild(s), 
            s.remove();
        }
        !function(PlaybackState) {
            PlaybackState.LOADING = "loading", PlaybackState.PLAYING = "playing", PlaybackState.IDLE = "idle", 
            PlaybackState.AD_PLAYING = "ad_playing", PlaybackState.PAUSED = "paused", PlaybackState.NOT_READY = "not_ready";
        }(PlaybackState || (PlaybackState = {})), function(HboVideoType) {
            HboVideoType.HBO_EPISODE = "episode", HboVideoType.HBO_FEATURE = "feature", HboVideoType.HBO_EXTRA = "extra", 
            HboVideoType.NONE = "none";
        }(HboVideoType || (HboVideoType = {})), function(SessionState) {
            SessionState.PAUSED = "paused", SessionState.PLAYING = "playing";
        }(SessionState || (SessionState = {}));
        class StreamingSerivce {
            constructor(requiredPermissions, contentScripts, serverName, name, syncFromEnd) {
                this.requiredPermissions = requiredPermissions, this.serverName = serverName, this.name = name, 
                this.contentScripts = contentScripts, this.syncFromEnd = syncFromEnd;
            }
            urlWithSessionId(sessionId) {
                return `https://redirect.teleparty.com/join/${sessionId}`;
            }
        }
        !function(StreamingServiceName) {
            StreamingServiceName.NETFLIX = "NETFLIX", StreamingServiceName.HULU = "HULU", StreamingServiceName.DISNEY_PLUS = "DISNEY_PLUS", 
            StreamingServiceName.HBO_MAX = "HBO_MAX", StreamingServiceName.YOUTUBE = "YOUTUBE", 
            StreamingServiceName.AMAZON = "AMAZON";
        }(StreamingServiceName || (StreamingServiceName = {}));
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
        const Services_Netflix = Netflix, ChromeStorageReadError = "Failed to read chrome storage. Please refresh the page and try again", VideoLoadError = "Failed to load video in time. Please refresh the page and try again.", GenericErrorMessage = "An unexpected error occured. Please refresh the page and try again.";
        var NetflixVideoApi_awaiter = function(thisArg, _arguments, P, generator) {
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
        class NetflixVideoApi extends class {
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
                return __awaiter(this, void 0, void 0, (function*() {}));
            }
        } {
            constructor() {
                super(), this.setInSession = inSession => {
                    this._inSession = inSession;
                }, this._uiEventsHappening = 0, this._stateUpdatedAt = 0, this._supplementalUpdatedAt = 0, 
                this._pageTitleUpdatedAt = 0, this._videoTypeUpdatedAt = 0, this._episodeDataUpdatedAt = 0, 
                this._playerState = {
                    time: 0,
                    paused: !0,
                    loading: !1
                }, this._inSession = !1;
            }
            get pageTitle() {
                return this._pageTitle;
            }
            skipIdle() {
                jQuery(".center-controls .nf-big-play-pause-secondary").length > 0 ? jQuery(".center-controls .nf-big-play-pause-secondary").trigger("click") : jQuery(".watch-video--playback-restart button").length > 0 && jQuery(".watch-video--playback-restart button").trigger("click");
            }
            getStreamingServiceName() {
                return StreamingServiceName.NETFLIX;
            }
            waitVideoDoneLoadingAsync() {
                return NetflixVideoApi_awaiter(this, void 0, void 0, (function*() {
                    return new Promise((resolve => {
                        const checkForChange = () => NetflixVideoApi_awaiter(this, void 0, void 0, (function*() {
                            yield this.waitUpdateAPIState(), this._playerState.loading || this.getPlaybackState() === PlaybackState.LOADING || this.getPlaybackState() === PlaybackState.IDLE ? setTimeout((() => {
                                checkForChange();
                            }), 100) : resolve();
                        }));
                        checkForChange();
                    }));
                }));
            }
            waitVideoApiReadyAsync() {
                var _a;
                return NetflixVideoApi_awaiter(this, void 0, void 0, (function*() {
                    if (!this._video) try {
                        yield delayUntil((() => {
                            const video = document.querySelector("video"), videoDomId = void 0 !== jQuery("video").parent()[0] ? jQuery("video").parent()[0].id : null;
                            return video instanceof Element && video.readyState > 0 && null != videoDomId && "" != videoDomId;
                        }), 1 / 0)(), console.log("Got video"), yield this.waitSkipSupplemental(), this._video = null !== (_a = document.querySelector("video")) && void 0 !== _a ? _a : void 0;
                    } catch (error) {
                        throw this.logError(VideoLoadError, error), new Error(VideoLoadError);
                    }
                }));
            }
            getVideoDataAsync() {
                return NetflixVideoApi_awaiter(this, void 0, void 0, (function*() {
                    const state = yield this.getStateAsync();
                    return yield this.waitUpdatePageTitleAsync(), yield this.waitUpdateVideoType(), 
                    "Episode" == this._videoType && (yield this.waitUpdateEpisodeData()), new Promise(((resolve, reject) => {
                        var _a, _b;
                        const videoTitle = null !== (_a = this.pageTitle) && void 0 !== _a ? _a : "", videoType = this._videoType, videoDuration = 1e3 * (null !== (_b = this._getDuration()) && void 0 !== _b ? _b : 1), videoId = this._getVideoId(), screen = this.getScreenSize(), content = this.getVideoContent(videoId, videoTitle, window.location.href, videoType, this._episodeData);
                        null !== videoTitle && null !== videoDuration && null !== videoId ? resolve({
                            videoTitle,
                            videoDuration,
                            videoId,
                            screen,
                            content,
                            videoState: state.playbackState
                        }) : reject(VideoLoadError);
                    }));
                }));
            }
            _manualNextEpisodeClick() {
                if (jQuery(".WatchNext-still-hover-container").length > 0) return jQuery(".WatchNext-still-hover-container").click(), 
                !0;
                if (jQuery(".button-nfplayerNextEpisode").length > 0) return jQuery(".button-nfplayerNextEpisode").click(), 
                !0;
                if (!(jQuery(".nf-flat-button-text").length > 0)) {
                    if (jQuery("[data-uia='next-episode-seamless-button']").length > 0) return jQuery("[data-uia='next-episode-seamless-button']")[0].click(), 
                    console.log("Clicking seamless button"), !0;
                    {
                        const newNextButton = document.querySelector("[data-uia='control-next']");
                        return !!newNextButton && (newNextButton.click(), !0);
                    }
                }
                return !!jQuery(".nf-flat-button-text").text().toLowerCase().includes("next episode") && (jQuery(".nf-flat-button-text")[0].click(), 
                !0);
            }
            jumpToNextEpisode(nextEpisodeMessageData) {
                return NetflixVideoApi_awaiter(this, void 0, void 0, (function*() {
                    this._uiEventsHappening += 1;
                    const urlVideoId = this._getVideoIdFromCurrentUrl();
                    if (urlVideoId != parseInt(nextEpisodeMessageData.videoId)) if (console.log(urlVideoId), 
                    console.log(parseInt(nextEpisodeMessageData.videoId)), urlVideoId && urlVideoId + 1 === parseInt(nextEpisodeMessageData.videoId)) {
                        debug("Used Manual Click");
                        this._manualNextEpisodeClick() || window.postMessage({
                            type: "NEXT_EPISODE",
                            videoId: parseInt(nextEpisodeMessageData.videoId)
                        }, "*");
                    } else debug("Used React Click"), window.postMessage({
                        type: "NEXT_EPISODE",
                        videoId: parseInt(nextEpisodeMessageData.videoId)
                    }, "*");
                    this._uiEventsHappening -= 1;
                }));
            }
            _getVideoIdFromCurrentUrl() {
                var _a, _b, _c;
                return 0 !== (null !== (_a = window.location.href.match(/^.*\/([0-9]+)\??.*/)) && void 0 !== _a ? _a : "").length ? parseInt(null !== (_c = (null !== (_b = window.location.href.match(/^.*\/([0-9]+)\??.*/)) && void 0 !== _b ? _b : [])[1]) && void 0 !== _c ? _c : null) : null;
            }
            freeze(milliseconds) {
                return this._uiEventsHappening += 1, jQuery(".button-nfplayerPause").click(), delay(milliseconds)().then((() => {
                    jQuery(".button-nfplayerPlay").click();
                })).then(this._hideControls).finally((() => {
                    this._uiEventsHappening -= 1;
                }));
            }
            pause() {
                return NetflixVideoApi_awaiter(this, void 0, void 0, (function*() {
                    this._uiEventsHappening += 1, window.postMessage({
                        type: "PAUSE"
                    }, "*"), yield this.waitUpdateAPIState(), yield delay(500)();
                    try {
                        yield delayUntil((() => (window.postMessage({
                            type: "GetState"
                        }, "*"), this._playerState.paused)), 2500)(), yield this._hideControls(), console.log("Paused");
                    } catch (e) {
                        this.logError("Video failed to pause", e), console.log("Didn't pause, but continuing.");
                    } finally {
                        this._uiEventsHappening -= 1;
                    }
                }));
            }
            play() {
                return NetflixVideoApi_awaiter(this, void 0, void 0, (function*() {
                    this._uiEventsHappening += 1, window.postMessage({
                        type: "PLAY"
                    }, "*"), yield this.waitUpdateAPIState(), yield delay(500)();
                    try {
                        yield delayUntil((() => (window.postMessage({
                            type: "GetState"
                        }, "*"), !this._playerState.paused)), 2500)(), yield this._hideControls(), console.log("Played");
                    } catch (e) {
                        this.logError("video failed to play", e), console.log("Didn't play, but continuing.");
                    } finally {
                        this._uiEventsHappening -= 1;
                    }
                }));
            }
            waitVideoDoneLoading() {
                return NetflixVideoApi_awaiter(this, void 0, void 0, (function*() {
                    return new Promise(((resolve, reject) => {
                        const start = performance.now(), checkForChange = () => NetflixVideoApi_awaiter(this, void 0, void 0, (function*() {
                            const state = yield this.getPlayerState(), now = performance.now();
                            state.loading ? now - start > 5e3 ? reject(new Error("Video Didn't stop loading")) : setTimeout(checkForChange, 250) : resolve();
                        }));
                        checkForChange();
                    }));
                }));
            }
            setCurrentTime(time) {
                return NetflixVideoApi_awaiter(this, void 0, void 0, (function*() {
                    debug("Seek called with window post Message", !0), this._uiEventsHappening += 1, 
                    window.postMessage({
                        type: "SEEK",
                        time
                    }, "*");
                    try {
                        yield delay(500)(), yield this.waitVideoDoneLoading(), yield this._hideControls();
                    } finally {
                        this._uiEventsHappening -= 1;
                    }
                }));
            }
            _hideControls() {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                this._uiEventsHappening += 1;
                const player = jQuery(".VideoContainer"), windowJquery = jQuery(window), eventOptions = {
                    bubbles: !0,
                    button: 0,
                    screenX: 100 - (null !== (_a = windowJquery.scrollLeft()) && void 0 !== _a ? _a : 0),
                    screenY: 100 - (null !== (_b = windowJquery.scrollTop()) && void 0 !== _b ? _b : 0),
                    clientX: 100 - (null !== (_c = windowJquery.scrollLeft()) && void 0 !== _c ? _c : 0),
                    clientY: 100 - (null !== (_d = windowJquery.scrollTop()) && void 0 !== _d ? _d : 0),
                    offsetX: 100 - (null !== (_f = null === (_e = player.offset()) || void 0 === _e ? void 0 : _e.left) && void 0 !== _f ? _f : 0),
                    offsetY: 100 - (null !== (_h = null === (_g = player.offset()) || void 0 === _g ? void 0 : _g.top) && void 0 !== _h ? _h : 0),
                    pageX: 100,
                    pageY: 100,
                    currentTarget: player[0]
                };
                return player.length > 0 ? player[0].dispatchEvent(new MouseEvent("mousemove", eventOptions)) : console.warn("Couldn't find player to hide controls"), 
                delay(1)().finally((() => {
                    this._uiEventsHappening -= 1;
                }));
            }
            getVideoElement() {
                return document.querySelector("video");
            }
            getPlaybackState() {
                return jQuery(".center-controls .nf-big-play-pause-secondary").length > 0 || jQuery(".watch-video--playback-restart button").length > 0 ? PlaybackState.IDLE : jQuery(".AkiraPlayerSpinner--container").length > 0 ? PlaybackState.LOADING : jQuery(".button-nfplayerPause").length > 0 ? PlaybackState.PLAYING : PlaybackState.PAUSED;
            }
            getHTMLCurrentTime() {
                const video = this.getVideoElement();
                if (video) return Math.floor(1e3 * video.currentTime);
            }
            _getVideoTitle() {
                return "";
            }
            _getDuration() {
                var _a, _b;
                return null !== (_b = null === (_a = this.getVideoElement()) || void 0 === _a ? void 0 : _a.duration) && void 0 !== _b ? _b : null;
            }
            _getVideoId() {
                var _a;
                const currVideoId = null !== (_a = Services_Netflix.getVideoId(new URL(window.location.href))) && void 0 !== _a ? _a : "", videoDomId = void 0 !== jQuery("video").parent()[0] ? jQuery("video").parent()[0].id : null;
                let tempVideoId = currVideoId;
                return this._inSession || null == videoDomId || "" == videoDomId || videoDomId == currVideoId || (debug("Replacing with dom id"), 
                history.replaceState("data to be passed", "Title of the page", "/watch/" + jQuery(jQuery("video").parent())[0].id), 
                tempVideoId = videoDomId), tempVideoId;
            }
            onNode(evt) {
                const detail = evt.detail;
                "UpdateState" == detail.type ? (this._playerState = {
                    paused: detail.paused,
                    time: detail.time,
                    loading: detail.loading
                }, this._stateUpdatedAt = detail.updatedAt) : "GetTitle" == detail.type ? (this._pageTitle = detail.pageTitle, 
                this._pageTitleUpdatedAt = detail.updatedAt) : "GetType" == detail.type ? (this._videoType = detail.VideoType, 
                this._videoTypeUpdatedAt = detail.updatedAt) : "GetEpData" == detail.type ? (this._episodeData = detail.episodeData, 
                this._episodeDataUpdatedAt = detail.updatedAt) : "CheckSkipSupplemental" == detail.type && (this._supplementalUpdatedAt = detail.updatedAt);
            }
            waitUpdatePageTitleAsync() {
                return NetflixVideoApi_awaiter(this, void 0, void 0, (function*() {
                    const currentTime = Date.now();
                    window.postMessage({
                        type: "GetPageTitle"
                    }, "*");
                    try {
                        yield delayUntil((() => this._pageTitleUpdatedAt >= currentTime), 500, 10)();
                    } catch (error) {
                        this.logError("unable to update page title", error), this._pageTitle = void 0;
                    }
                }));
            }
            waitUpdateVideoType() {
                return NetflixVideoApi_awaiter(this, void 0, void 0, (function*() {
                    const currentTime = Date.now();
                    window.postMessage({
                        type: "GetVideoType"
                    }, "*");
                    try {
                        yield delayUntil((() => this._videoTypeUpdatedAt >= currentTime), 500, 10)();
                    } catch (error) {
                        this.logError("unable to update video type", error), this._videoType = void 0;
                    }
                }));
            }
            waitUpdateEpisodeData() {
                return NetflixVideoApi_awaiter(this, void 0, void 0, (function*() {
                    const currentTime = Date.now();
                    window.postMessage({
                        type: "GetEpisodeData"
                    }, "*");
                    try {
                        yield delayUntil((() => this._episodeDataUpdatedAt >= currentTime), 500, 10)();
                    } catch (error) {
                        this.logError("unable to update episode data", error), this._episodeData = void 0;
                    }
                }));
            }
            waitSkipSupplemental() {
                return NetflixVideoApi_awaiter(this, void 0, void 0, (function*() {
                    const currentTime = Date.now();
                    window.postMessage({
                        type: "CheckSkipSupplemental"
                    }, "*"), yield delayUntil((() => this._supplementalUpdatedAt >= currentTime), 1e4, 100)();
                }));
            }
            waitUpdateAPIState() {
                var _a, _b, _c, _d;
                return NetflixVideoApi_awaiter(this, void 0, void 0, (function*() {
                    const currentTime = Date.now();
                    window.postMessage({
                        type: "GetState"
                    }, "*");
                    try {
                        yield delayUntil((() => this._stateUpdatedAt >= currentTime), 500, 10)();
                    } catch (error) {
                        this.logError("unable to update API state", error), this._playerState = {
                            paused: null !== (_b = null === (_a = this.getVideoElement()) || void 0 === _a ? void 0 : _a.paused) && void 0 !== _b && _b,
                            time: null !== (_d = null === (_c = this.getVideoElement()) || void 0 === _c ? void 0 : _c.currentTime) && void 0 !== _d ? _d : 0,
                            loading: !1
                        }, this._stateUpdatedAt = Date.now();
                    }
                }));
            }
            getUpdateSessionDataAsync() {
                return NetflixVideoApi_awaiter(this, void 0, void 0, (function*() {
                    return yield delayUntil((() => null != this.getVideoElement()), 5e3)(), yield this.waitUpdateAPIState(), 
                    {
                        state: this._playerState.paused ? SessionState.PAUSED : SessionState.PLAYING,
                        lastKnownTime: this._playerState.time,
                        lastKnownTimeUpdatedAt: this._stateUpdatedAt,
                        bufferingState: this._playerState.loading
                    };
                }));
            }
            getPlayerState() {
                return NetflixVideoApi_awaiter(this, void 0, void 0, (function*() {
                    return yield this.waitUpdateAPIState(), this._playerState;
                }));
            }
            _fixPlaybackRate() {
                const video = this.getVideoElement();
                if (video) {
                    1 != video.playbackRate && (debug("Resetting playback rate to 1"), video.playbackRate = 1);
                }
            }
            getStateAsync() {
                return NetflixVideoApi_awaiter(this, void 0, void 0, (function*() {
                    yield this.waitUpdateAPIState(), this._fixPlaybackRate();
                    let playbackState = this.getPlaybackState();
                    playbackState !== PlaybackState.PLAYING && playbackState !== PlaybackState.PAUSED || (playbackState = this._playerState.paused ? PlaybackState.PAUSED : PlaybackState.PLAYING);
                    return {
                        playbackState,
                        playbackPositionMilliseconds: this._playerState.time
                    };
                }));
            }
        }
        const closeImage = chrome.extension.getURL("img/x-circle.svg"), ownerOnlyNextEpisodeModal = {
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
        }, testParticipationModal = {
            title: "Teleparty | Test Participation",
            content: "You are using an experimental Netflix video player which Teleparty does not support.\n\nPlease click the button below, disable your test participation and return to the party to continue using Teleparty.",
            buttonTitle: "Disable test participation"
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
        }, WRONG_SCREEN_DATA = {
            showAlert: !0,
            alertModal: {
                title: "Teleparty | Disconnected from party",
                content: "It looks like you left the party. You can click the button below to rejoin the party.",
                buttonTitle: "Return to Party"
            }
        };
        class TeardownMessage extends BackgroundMessage {
            constructor(sender, target, data) {
                super(sender, target, BackgroundMessageType.TEARDOWN), this.data = data;
            }
        }
        var ReactionTypes;
        !function(ReactionTypes) {
            ReactionTypes.HEART = "heart", ReactionTypes.ANGRY = "angry", ReactionTypes.FIRE = "fire", 
            ReactionTypes.LAUGH = "laugh", ReactionTypes.CRY = "cry", ReactionTypes.SURPRISE = "surprise";
        }(ReactionTypes || (ReactionTypes = {}));
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
        var SidebarMessageType;
        !function(SidebarMessageType) {
            SidebarMessageType.SET_USER_LIST = "setUserList", SidebarMessageType.LOAD_INIT_DATA = "loadInitData", 
            SidebarMessageType.SET_PAGE_TITLE = "setPageTitle", SidebarMessageType.SET_USER_ICON_URL = "setUserIconUrl", 
            SidebarMessageType.ADD_MESSAGE = "addMessage", SidebarMessageType.ADD_GIF_MESSAGE = "addGifMessage", 
            SidebarMessageType.CLEAR_MESSAGES = "clearMessages", SidebarMessageType.SET_PRESENCE_MESSAGE = "setPresenceMessage", 
            SidebarMessageType.ON_PAGE_CLICK = "onPageClick", SidebarMessageType.SIDEBAR_MESSAGING_READY = "sidebarMessagingReady", 
            SidebarMessageType.RESET_VIEW = "resetView", SidebarMessageType.HIDE_CHAT = "hideChat", 
            SidebarMessageType.ON_UPDATE_SETTINGS = "onUpdateSettings", SidebarMessageType.UPDATE_SETTINGS = "updateSettings", 
            SidebarMessageType.SET_REACTIONS_ACTIVE = "setReactionsActive", SidebarMessageType.ON_FOCUS = "onSidebarFocus";
        }(SidebarMessageType || (SidebarMessageType = {}));
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
        const oldIcons = [ "Batman.svg", "DeadPool.svg", "CptAmerica.svg", "Wolverine.svg", "IronMan.svg", "Goofy.svg", "Alien.svg", "Mulan.svg", "Snow-White.svg", "Poohbear.svg", "Sailormoon.svg", "Sailor Cat.svg", "Pizza.svg", "Cookie.svg", "Chocobar.svg", "hotdog.svg", "Hamburger.svg", "Popcorn.svg", "IceCream.svg", "ChickenLeg.svg" ], defaultIcons = [ "General/Alien.svg", "General/Batman.svg", "General/ChickenLeg.svg", "General/Chocobar.svg", "General/Cookie.svg", "General/CptAmerica.svg", "General/DeadPool.svg", "General/Goofy.svg", "General/Hamburger.svg", "General/hotdog.svg", "General/IceCream.svg", "General/IronMan.svg", "General/Mulan.svg", "General/Pizza.svg", "General/Poohbear.svg", "General/Popcorn.svg", "General/Sailor Cat.svg", "General/Sailormoon.svg", "General/Snow-White.svg", "General/Wolverine.svg" ], newIcons = [ "General/Alien.svg", "General/Batman.svg", "General/ChickenLeg.svg", "General/Chocobar.svg", "General/Cookie.svg", "General/CptAmerica.svg", "General/DeadPool.svg", "General/Goofy.svg", "General/Hamburger.svg", "General/hotdog.svg", "General/IceCream.svg", "General/IronMan.svg", "General/Mulan.svg", "General/Pizza.svg", "General/Poohbear.svg", "General/Popcorn.svg", "General/Sailor Cat.svg", "General/Sailormoon.svg", "General/Snow-White.svg", "General/Wolverine.svg", "Christmas/angel.svg", "Christmas/bell.svg", "Christmas/box.svg", "Christmas/cane.svg", "Christmas/flake.svg", "Christmas/gingerbread.svg", "Christmas/gingerbread_F.svg", "Christmas/gingerbread_M.svg", "Christmas/gloves_blue.svg", "Christmas/gloves_red.svg", "Christmas/hat.svg", "Christmas/ornament.svg", "Christmas/raindeer.svg", "Christmas/reef.svg", "Christmas/santa_F.svg", "Christmas/santa_M.svg", "Christmas/snowglobe.svg", "Christmas/snowman.svg", "Christmas/sock.svg", "Christmas/tree.svg", "Halloween/bats.svg", "Halloween/candy_corn.svg", "Halloween/cat_black.svg", "Halloween/cat_white.svg", "Halloween/coffin.svg", "Halloween/eye_ball.svg", "Halloween/face_angry.svg", "Halloween/face_evil.svg", "Halloween/face_silly.svg", "Halloween/face_smile.svg", "Halloween/frankenstein.svg", "Halloween/ghost_F.svg", "Halloween/ghost_M.svg", "Halloween/gravestone.svg", "Halloween/lollipop.svg", "Halloween/moon.svg", "Halloween/mummy.svg", "Halloween/potion.svg", "Halloween/pumpkin.svg", "Halloween/pumpkin_witch.svg", "Halloween/skull_brain.svg", "Halloween/skull_candy.svg", "Halloween/skull_girl.svg", "Halloween/witch_hat.svg", "Thanksgiving/acorn.svg", "Thanksgiving/bread.svg", "Thanksgiving/candles.svg", "Thanksgiving/corn.svg", "Thanksgiving/drinks.svg", "Thanksgiving/maple_leaf.svg", "Thanksgiving/plate_chicken.svg", "Thanksgiving/pumpkin.svg", "Thanksgiving/pumpkin_pie.svg", "Thanksgiving/slice_pie.svg", "Thanksgiving/sun_flower.svg", "Thanksgiving/turkey_face.svg" ], iconMap = {
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
        };
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
        function sidebarInjected(chatHtml, customCss = "") {
            return `\n    <style>\n      ${css_alert}\n    </style>\n\n      <style tpInjected>\n    \n\n      .with-chat {\n        left: 0px !important;\n        width: calc(100% - 304px) !important;\n      }\n\n      .tp-video {\n        transition: width 250ms linear 0.2s;\n      }\n\n      ${customCss}\n    \n      ${chat}\n      \n    </style>\n\n    ${chatHtml}\n  `;
        }
        var ClientMessageType, getRandomValues, html_chat = __webpack_require__(301), chat_default = __webpack_require__.n(html_chat);
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
        class ClientMessage extends Message {
            constructor(sender, target, type) {
                super(sender, target, type), this._type = type;
            }
        }
        !function(ClientMessageType) {
            ClientMessageType.BROADCAST = "brodadcast", ClientMessageType.BROADCAST_NEXT_EPISODE = "broadcastNextEpisode", 
            ClientMessageType.SEND_MESSAGE = "sendMessage", ClientMessageType.CONTENT_SCRIPT_READY = "contentScriptReady", 
            ClientMessageType.CONTENT_SCRIPT_ERROR = "contentScriptError", ClientMessageType.TEARDOWN = "teardown", 
            ClientMessageType.GET_SESSION_DATA = "getSessionData", ClientMessageType.SET_TYPING = "setTyping", 
            ClientMessageType.SET_BUFFERING = "setBuffering", ClientMessageType.SET_WATCHING_ADS = "setWatchingAds", 
            ClientMessageType.BROADCAST_USER_SETTINGS = "brodadcastUserSettings", ClientMessageType.SEND_REACTION = "sendReaction", 
            ClientMessageType.SEND_GIF = "sendGIF";
        }(ClientMessageType || (ClientMessageType = {}));
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
        var PopupMessageType, ChatApiMessageType, NetflixChatApi_awaiter = function(thisArg, _arguments, P, generator) {
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
        class NetflixChatApi extends class {
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
                super(), this._shouldBeFocused = !0, this._gifInputFocused = !1, this._selectionStart = 0, 
                this._selectionEnd = 0, this._selectionDirection = "forward", this._videoApi = videoApi;
            }
            shouldShowReaction() {
                return !0;
            }
            shouldAddReactionSpace() {
                return !1;
            }
            onClick(e) {
                e.target === jQuery("#chat-input")[0] || e.target === jQuery("#nickname-edit")[0] || e.target === jQuery("#gif-search")[0] ? (this.updateSelectionRange(), 
                this._shouldBeFocused = !0, e.target === jQuery("#gif-search")[0] ? this._gifInputFocused = !0 : this._gifInputFocused = !1) : (this._shouldBeFocused = !1, 
                this._gifInputFocused = !1);
            }
            getVideoTitle() {
                return NetflixChatApi_awaiter(this, void 0, void 0, (function*() {
                    return yield this._videoApi.waitUpdatePageTitleAsync(), this._videoApi.pageTitle;
                }));
            }
            onBlur() {
                if (this._shouldBeFocused) if (jQuery("#nickname-edit").is(":visible")) {
                    const input = jQuery("#nickname-edit")[0];
                    input && input.focus();
                } else if (jQuery("#gif-search").is(":visible") && this._gifInputFocused) {
                    const input = jQuery("#gif-search")[0];
                    input && input.focus();
                } else {
                    const input = jQuery("#chat-input")[0];
                    input && input.focus();
                }
            }
            updateSelectionRange() {
                var _a, _b, _c;
                const input = jQuery("#chat-input")[0];
                this._selectionStart = null !== (_a = input.selectionStart) && void 0 !== _a ? _a : 0, 
                this._selectionEnd = null !== (_b = input.selectionEnd) && void 0 !== _b ? _b : 0, 
                this._selectionDirection = null !== (_c = input.selectionDirection) && void 0 !== _c ? _c : "forward";
            }
            initCustomListeners() {
                console.log("Init Custom Listeners"), jQuery("#chat-input").on("blur", this.onBlur.bind(this)), 
                jQuery("#nickname-edit").on("blur", this.onBlur.bind(this)), jQuery("#gif-search").on("blur", this.onBlur.bind(this)), 
                window.addEventListener("click", this.onClick.bind(this)), jQuery("#chat-input").on("select", (() => {
                    this.updateSelectionRange();
                })), jQuery("#chat-input").on("keyup", (() => {
                    this.updateSelectionRange();
                }));
            }
            onChatKeyDown(event) {
                super.onChatKeyDown(event), this._shouldBeFocused = !0, document.querySelector("[data-uia='controls-standard']") && (console.log("Keep active"), 
                window.postMessage({
                    type: "ShowControls"
                }, "*"));
            }
            getReactionContainer() {
                return jQuery(".watch-video--player-view");
            }
            _injectChat() {
                if (this._chatHtml) {
                    const sizingWrapper = jQuery(".sizing-wrapper"), watchVideoWrapper = jQuery(".watch-video--player-view");
                    if (sizingWrapper.length > 0) this.chatWrapper = sizingWrapper, this.chatWrapper.after(sidebarInjected(this._chatHtml)); else {
                        if (!(watchVideoWrapper.length > 0)) {
                            const teardownData = {
                                showAlert: !0,
                                alertModal: testParticipationModal,
                                buttonUrl: "https://www.netflix.com/donottest"
                            };
                            return document.body.after(`\n  <style>\n    ${css_alert}\n  </style>\n  `), void this.sendTeardown(teardownData);
                        }
                        this.chatWrapper = watchVideoWrapper, this.chatWrapper.append(sidebarInjected(this._chatHtml));
                    }
                    this.chatWrapper.addClass("with-chat"), this.chatWrapper.addClass("tp-video");
                }
                this.fixRTL();
            }
            fixRTL() {
                const rtl = jQuery("[dir='rtl']");
                rtl.length && rtl.attr("dir", "ltr");
            }
            removeChat() {
                var _a, _b;
                super.removeChat(), null === (_a = this.chatWrapper) || void 0 === _a || _a.removeClass("with-chat"), 
                null === (_b = this.chatWrapper) || void 0 === _b || _b.removeClass("tp-video");
            }
            getChatVisible() {
                var _a, _b;
                return null !== (_b = null === (_a = this.chatWrapper) || void 0 === _a ? void 0 : _a.hasClass("with-chat")) && void 0 !== _b && _b;
            }
            setChatVisible(visible, userInitiated = !0) {
                const _super = Object.create(null, {
                    setChatVisible: {
                        get: () => super.setChatVisible
                    }
                });
                var _a, _b;
                return NetflixChatApi_awaiter(this, void 0, void 0, (function*() {
                    try {
                        yield _super.setChatVisible.call(this, visible, userInitiated);
                    } catch (e) {
                        return void window.dispatchEvent(new Event("resize"));
                    }
                    if (this.fixRTL(), visible) {
                        jQuery("#chat-wrapper").length || this.isPartyWindowsActive() || this.reloadChat(), 
                        jQuery("#chat-wrapper").animate({
                            width: 304
                        }, 250), null === (_a = this.chatWrapper) || void 0 === _a || _a.addClass("with-chat"), 
                        document.hasFocus() || this.clearUnreadCount();
                    } else jQuery("#chat-wrapper").animate({
                        width: 0
                    }, 250), null === (_b = this.chatWrapper) || void 0 === _b || _b.removeClass("with-chat");
                    yield delay(400)(), window.dispatchEvent(new Event("resize"));
                }));
            }
        }
        !function(PopupMessageType) {
            PopupMessageType.CREATE_SESSION = "createSession", PopupMessageType.RE_INJECT = "reInject", 
            PopupMessageType.GET_INIT_DATA = "getInitData", PopupMessageType.IS_CONTENT_SCRIPT_READY = "isContentScriptReady", 
            PopupMessageType.SET_CHAT_VISIBLE = "setChatVisible", PopupMessageType.DISCONNECT = "teardown", 
            PopupMessageType.CLOSE_POPUP = "closePopup";
        }(PopupMessageType || (PopupMessageType = {}));
        class GetSessionDataMessage extends ClientMessage {
            constructor(sender, target, data) {
                super(sender, target, ClientMessageType.GET_SESSION_DATA), this.data = data;
            }
        }
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
        }(ChatApiMessageType || (ChatApiMessageType = {}));
        var VideoApiMessageType, ChatMessageForwarder_awaiter = function(thisArg, _arguments, P, generator) {
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
        !function(VideoApiMessageType) {
            VideoApiMessageType.UPDATE_SESSION = "updateSession", VideoApiMessageType.NEXT_EPISODE = "nextEpisode", 
            VideoApiMessageType.REBOOT_SESSION = "rebootSession", VideoApiMessageType.GET_SERVER_TIME = "getServerTime", 
            VideoApiMessageType.RELOAD_PARTY = "reloadParty";
        }(VideoApiMessageType || (VideoApiMessageType = {}));
        class BroadcastMessage extends ClientMessage {
            constructor(sender, target, data) {
                super(sender, target, ClientMessageType.BROADCAST), this.data = data;
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
        class StayAliveMessage extends BackgroundMessage {
            constructor(sender, target, data) {
                super(sender, target, BackgroundMessageType.STAY_ALIVE), this.data = data;
            }
        }
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
        __webpack_require__(640);
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
        var VideoEventListener_awaiter = function(thisArg, _arguments, P, generator) {
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
        var NetflixVideoEventListener_awaiter = function(thisArg, _arguments, P, generator) {
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
        class NetflixVideoEventListener extends class {
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
                nav.mediaSession.setActionHandler("play", (() => VideoEventListener_awaiter(this, void 0, void 0, (function*() {
                    this._onVideoUpdateWaitForChange(), this._videoApi.play(), console.log("Bluetooth device played the video");
                })))), nav.mediaSession.setActionHandler("pause", (() => VideoEventListener_awaiter(this, void 0, void 0, (function*() {
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
                super(videoApi), this._onUpdate = this._onVideoUpdate.bind(this), this._onInteraction = this.onUserInteraction.bind(this), 
                this._onReplace = this.replaceStateInteraction.bind(this), this._videoApi = videoApi, 
                this._chatApi = chatApi, (null === (_a = window.teleparty) || void 0 === _a ? void 0 : _a.replaceScriptLoaded) || (debug("injecting replace script"), 
                injectScriptText('\n    if(!window.replaceScriptLoaded) {\n      window.replaceScriptLoaded = true;\n      (function(history){\n        var replaceState = history.replaceState;\n        history.replaceState = function(state) {\n          if (typeof history.onreplacestate == "function") {\n            history.onreplacestate({state: state});\n          }\n          return replaceState.apply(history, arguments);\n        }\n        var pushState = history.pushState;\n        history.pushState = function(state) {\n            if (typeof history.onpushstate == "function") {\n                history.onpushstate({state: state});\n            }\n            return pushState.apply(history, arguments);\n        };\n      })(window.history);\n\n      var popInteraction = function(e) {\n        // send message to content script w next episode\n        window.postMessage({ type: "FROM_PAGE_POP", text: "next episode from the webpage!"}, "*");\n      }\n\n      var reloadInteraction = function(e) {\n        // send message to content script w next episode\n        window.postMessage({ type: "FROM_PAGE", text: "next episode from the webpage!"}, "*");\n      }\n      window.onpopstate = popInteraction;\n      history.onreplacestate = history.onpushstate = reloadInteraction;\n    }\n')), 
                (null === (_b = window.teleparty) || void 0 === _b ? void 0 : _b.injectScriptLoaded) || function(scriptLocation) {
                    const s = document.createElement("script");
                    s.setAttribute("tpInjected", ""), s.src = scriptLocation, (document.head || document.documentElement).appendChild(s), 
                    s.remove();
                }(chrome.extension.getURL("content_scripts/netflix/netflix_injected_bundled.js")), 
                this._videoApi.waitVideoApiReadyAsync().then((() => {
                    var _a;
                    injectScriptText(Services_Netflix.getFullscreenScript()), null === (_a = this._videoMessageForwarder) || void 0 === _a || _a.forceSync();
                })), this._onNodeMessage = this._videoApi.onNode.bind(this._videoApi), window.addEventListener("FromNode", this._onNodeMessage, !1), 
                this._videoApi.skipIdle();
            }
            checkVideo() {
                var _a;
                this._videoApi.getPlaybackState() == PlaybackState.IDLE && (debug("Detected video idle. Removing."), 
                this._videoApi.skipIdle(), TaskManager_TaskManager.hasTaskInQueue("removeIdle") || (TaskManager_TaskManager.pushTask(this.onIdleRemovedAsync.bind(this), "removeIdle"), 
                null === (_a = this._videoMessageForwarder) || void 0 === _a || _a.forceSync()));
                const currentVideo = this.getVideo();
                currentVideo && currentVideo !== this._videoElement && this.reloadListeners();
            }
            onIdleRemovedAsync() {
                var _a, _b;
                return NetflixVideoEventListener_awaiter(this, void 0, void 0, (function*() {
                    try {
                        yield delay(1e3)(), yield this.loadNewVideoAsync(null !== (_b = null === (_a = this._videoMessageForwarder) || void 0 === _a ? void 0 : _a.videoId) && void 0 !== _b ? _b : ""), 
                        this.reloadListeners(), this._chatApi.reloadChat(), debug("Detected idle removed: succeeded");
                    } catch (error) {
                        this._onTeardown(WRONG_SCREEN_DATA);
                    }
                }));
            }
            reloadListeners() {
                this.stopListening(), this.startListening(), injectScriptText(Services_Netflix.getFullscreenScript());
            }
            onUserInteraction() {
                return NetflixVideoEventListener_awaiter(this, void 0, void 0, (function*() {
                    TaskManager_TaskManager.tasksInFlight < 5 && !TaskManager_TaskManager.hasTaskInQueue("NETFLIX_WAIT_FOR_CHANGE") && this._onVideoUpdateWaitForChange();
                }));
            }
            didChangeHappen(oldState, newState) {
                return (newState.paused !== oldState.paused || Math.abs(newState.time - oldState.time) > 2500) && (console.log("Change"), 
                console.log(newState), !0);
            }
            waitForVideoChange(oldVideoState, oldHtmlTime) {
                var _a;
                return NetflixVideoEventListener_awaiter(this, void 0, void 0, (function*() {
                    const oldState = null != oldVideoState ? oldVideoState : yield this._videoApi.getPlayerState(), oldTime = null != oldHtmlTime ? oldHtmlTime : null !== (_a = this._videoApi.getHTMLCurrentTime()) && void 0 !== _a ? _a : 0;
                    console.log("Old State: " + oldTime), console.log(oldVideoState);
                    const start = performance.now();
                    return new Promise(((resolve, reject) => {
                        console.log("New States ------");
                        const checkForChange = () => NetflixVideoEventListener_awaiter(this, void 0, void 0, (function*() {
                            const newVideoState = yield this._videoApi.getPlayerState();
                            performance.now() - start >= 2500 ? (console.log("Fail"), reject(new Error("Wait for Video Change failed"))) : this._timerState && this.didChangeHappen(this._timerState, oldState) ? (console.log("Detected Timer State Change"), 
                            resolve()) : this.didChangeHappen(oldState, newVideoState) ? resolve() : Math.abs(newVideoState.time - oldTime) > 2500 ? (console.log("Change HTML"), 
                            console.log(newVideoState), resolve()) : setTimeout((() => {
                                checkForChange();
                            }), 50);
                        }));
                        checkForChange();
                    }));
                }));
            }
            startListening() {
                super.startListening(), this._videoApi.setInSession(!0), window.postMessage({
                    type: "FIX_POST_PLAY"
                }, "*"), this._videoCheckInterval = setInterval(this.checkVideo.bind(this), 1e4);
                const checkState = () => NetflixVideoEventListener_awaiter(this, void 0, void 0, (function*() {
                    try {
                        const oldState = this._timerState;
                        if (this._timerState = yield this._videoApi.getPlayerState(), oldState) {
                            const dif = Math.abs(oldState.time - this._timerState.time);
                            (oldState.paused != this._timerState.paused || dif > 2500) && this._onVideoUpdateWaitForChange();
                        }
                        this._timerState.loading != (null == oldState ? void 0 : oldState.loading) && (this._timerState.loading ? this._onVideoBuffering() : this._onVideoCanPlay());
                    } catch (e) {}
                    this._stateTimerInterval = setTimeout(checkState, 250);
                }));
                checkState();
                const video = this.getVideo();
                this._videoElement = video, window.addEventListener("mouseup", this._onInteraction), 
                window.addEventListener("keyup", this._onInteraction), window.addEventListener("message", this._onReplace, !1);
            }
            getVideo() {
                const video = jQuery("video");
                return video && video.length ? video[0] : void 0;
            }
            stopListening() {
                super.stopListening(), this._videoCheckInterval && clearInterval(this._videoCheckInterval), 
                this._stateTimerInterval && clearTimeout(this._stateTimerInterval), window.removeEventListener("mouseup", this._onInteraction), 
                window.removeEventListener("keyup", this._onInteraction), window.removeEventListener("message", this._onReplace, !1), 
                this._videoApi.setInSession(!1);
            }
            loadNewVideoAsync(videoId) {
                return NetflixVideoEventListener_awaiter(this, void 0, void 0, (function*() {
                    const start = performance.now();
                    yield new Promise(((resolve, reject) => {
                        const interval = setInterval((() => {
                            if (Services_Netflix.getVideoId(new URL(window.location.href)) === videoId) {
                                const videoElement = document.querySelector("video");
                                if (videoElement instanceof Element && videoElement.parentElement && videoElement.parentElement.id == videoId) return debug("Loaded new netflix video"), 
                                clearInterval(interval), this._chatApi.reloadChat(), void resolve();
                            }
                            performance.now() - start >= 2e4 && (reject(new Error("Could not load new video in time.")), 
                            clearInterval(interval));
                        }), 100);
                    })), yield this._videoApi.waitVideoDoneLoadingAsync();
                }));
            }
            replaceStateInteraction(event) {
                var _a;
                if (event.source == window) if ("FROM_PAGE_POP" !== event.data.type) {
                    if (event.data.type && "FROM_PAGE" == event.data.type) {
                        if (window.location.href.match(/^.*\/(watch)\/.*/)) {
                            const nextVideoId = Services_Netflix.getVideoId(new URL(window.location.href));
                            if (!nextVideoId) return debug("No video found. Tearing down"), void this._onTeardown(DEFAULT_TEARDOWN);
                            nextVideoId !== (null === (_a = this._videoMessageForwarder) || void 0 === _a ? void 0 : _a.videoId) && this._onNextEpisode(nextVideoId);
                        } else this._onTeardown(DEFAULT_TEARDOWN);
                    }
                } else this._onTeardown(DEFAULT_TEARDOWN);
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
        var _a, NetflixPageControls_awaiter = function(thisArg, _arguments, P, generator) {
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
        class NetflixPageControls extends class {
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
            getControlsRoot() {
                return NetflixPageControls_awaiter(this, void 0, void 0, (function*() {
                    return jQuery(".watch-video--player-view");
                }));
            }
            shouldMenuBeVisible() {
                return null !== document.querySelector("[data-uia='control-back10']");
            }
            startEventListener() {
                super.startEventListener(), jQuery("#tp-buttons-container").hover((() => {
                    window.postMessage({
                        type: "ShowControls"
                    }, "*");
                }));
            }
            getControlsHeight() {
                return "100px";
            }
            stopEventListener() {
                super.stopEventListener(), jQuery("#tp-buttons-container").off("hover");
            }
        }
        class NetflixContentScript extends class {
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
                const netflixVideoApi = new NetflixVideoApi, netflixChatApi = new NetflixChatApi(netflixVideoApi), videoEventListener = new NetflixVideoEventListener(netflixVideoApi, netflixChatApi);
                let pageControls;
                pageControls = window.teleparty && window.teleparty.pageControls ? window.teleparty.pageControls : new NetflixPageControls(netflixChatApi), 
                super(netflixChatApi, netflixVideoApi, videoEventListener, pageControls), debug("Netflix Content Script");
            }
        }
        window.teleparty && (null === (_a = window.teleparty) || void 0 === _a ? void 0 : _a.contentScriptInjected) || (window.teleparty || (console.log("Set Teleparty"), 
        window.teleparty = {}), window.teleparty.contentScriptInjected = !0, new NetflixContentScript, 
        debug("Initialized content script"));
    })();
})();