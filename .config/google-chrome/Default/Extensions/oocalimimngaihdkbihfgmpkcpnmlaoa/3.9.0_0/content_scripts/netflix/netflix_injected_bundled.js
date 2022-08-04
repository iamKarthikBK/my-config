/*******************************************************
* Copyright (C) 2018-2022 WP Interactive Media, Inc. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
*******************************************************/
(() => {
    "use strict";
    ({
        478: function() {
            var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
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
            const getVideoPlayer = () => {
                var e = window.netflix.appContext.state.playerApp.getAPI().videoPlayer, t = e.getAllPlayerSessionIds().find((val => val.includes("watch")));
                return e.getVideoPlayerBySessionId(t);
            }, delay = milliseconds => __awaiter(void 0, void 0, void 0, (function*() {
                return new Promise((resolve => {
                    setTimeout((() => {
                        resolve();
                    }), milliseconds);
                }));
            })), delayUntil = (condition, maxDelay, delayStep = 250) => function() {
                const startTime = (new Date).getTime(), checkForCondition = function() {
                    return condition() ? Promise.resolve() : null !== maxDelay && (new Date).getTime() - startTime > maxDelay ? Promise.reject(new Error("delayUntil timed out" + condition)) : delay(delayStep).then(checkForCondition);
                };
                return checkForCondition();
            }, checkSkipSupplemental = () => __awaiter(void 0, void 0, void 0, (function*() {
                try {
                    yield delayUntil((() => {
                        try {
                            return null != getWrapperStateNode().state.activeVideoMetadata._video;
                        } catch (e) {
                            return !1;
                        }
                    }), 5e3)(), "supplemental" == getWrapperStateNode().state.activeVideoMetadata._video.type && (console.log("SKIPPING SUPPLEMENTAL"), 
                    getWrapperStateNode().handleFinishPrePlay(), yield delayUntil((() => {
                        try {
                            return "supplemental" != getWrapperStateNode().state.activeVideoMetadata._video.type;
                        } catch (e) {
                            return !1;
                        }
                    }), 1 / 0)(), console.log("DOne Skip"));
                } catch (e) {
                    console.log(e);
                }
            })), getWrapperStateNode = () => {
                const watchVideoWrapper = document.querySelector(".watch-video");
                if (watchVideoWrapper) {
                    const internals = getReactInternals(watchVideoWrapper);
                    if (internals) return internals.return.stateNode;
                }
                return null;
            }, isMovie = () => {
                try {
                    const wrapperStateNode = getWrapperStateNode();
                    return !!wrapperStateNode && "movie" === wrapperStateNode.state.playableData.summary.type;
                } catch (error) {
                    return !1;
                }
            }, getReactInternals = root => {
                if (null == root) return null;
                for (var keys = Object.keys(root), key = null, i = 0; i < keys.length; i++) if (keys[i].startsWith("__reactInternalInstance")) {
                    key = keys[i];
                    break;
                }
                return key ? root[key] : null;
            }, showControlsAsync = () => __awaiter(void 0, void 0, void 0, (function*() {
                const wrapper = (() => {
                    try {
                        const selectorList = [ document.querySelector('div[data-uia="player"]'), document.querySelector("div[data-videoid]"), document.querySelector("div .ltr-fntwn3"), document.querySelector(".active"), document.querySelector(".inactive"), document.querySelector(".passive"), document.querySelector(".watch-video--player-view").children[0] ];
                        for (var i = 0; i < selectorList.length; i++) try {
                            if (selectorList[i]) return selectorList[i];
                        } catch (error) {}
                        return null;
                    } catch (error) {
                        return null;
                    }
                })();
                if (wrapper) {
                    const reactInstance = getReactInternals(wrapper);
                    reactInstance && (reactInstance.memoizedProps.onPointerMoveCapture({
                        stopPropagation: () => {},
                        preventDefault: () => {}
                    }), yield delay(2));
                }
            })), changeEpisodeFallback = id => __awaiter(void 0, void 0, void 0, (function*() {
                try {
                    (() => {
                        try {
                            return getReactInternals(document.querySelector(".watch-video")).return.stateNode;
                        } catch (e) {
                            return;
                        }
                    })().handleSelectorEpisodePlay({
                        stopPropagation: () => {}
                    }, id);
                } catch (error) {
                    console.log(error);
                }
            }));
            var seekInteraction = function(e) {
                try {
                    if (e.source == window) if (e.data.type && "SEEK" === e.data.type) e.data.time >= getVideoPlayer().duration ? (getVideoPlayer().pause(), 
                    getVideoPlayer().seek(getVideoPlayer().duration - 100)) : getVideoPlayer().seek(e.data.time); else if (e.data.type && "PAUSE" === e.data.type) getVideoPlayer().pause(); else if (e.data.type && "FIX_POST_PLAY" === e.data.type) (() => {
                        if (isMovie()) {
                            const wrapperStateNode = getWrapperStateNode();
                            wrapperStateNode && (window.oldHasPostPlay = wrapperStateNode.hasPostPlay, wrapperStateNode.hasPostPlay = () => !1, 
                            console.log("DISABLED POST PLAY FOR MOVIE"));
                        }
                    })(); else if (e.data.type && "PLAY" === e.data.type) isMovie(), getVideoPlayer().play(); else if (e.data.type && "IsPaused" === e.data.type) {
                        const paused = getVideoPlayer().isPaused();
                        let evt = new CustomEvent("FromNode", {
                            detail: {
                                type: "IsPaused",
                                paused,
                                updatedAt: Date.now()
                            }
                        });
                        window.dispatchEvent(evt);
                    } else if (e.data.type && "GetCurrentTime" === e.data.type) {
                        const time = getVideoPlayer().getCurrentTime();
                        let evt = new CustomEvent("FromNode", {
                            detail: {
                                type: "CurrentTime",
                                time,
                                updatedAt: Date.now()
                            }
                        });
                        window.dispatchEvent(evt);
                    } else if (e.data.type && "teardown" == e.data.type) (() => {
                        const wrapperStateNode = getWrapperStateNode();
                        wrapperStateNode && window.oldHasPostPlay && (wrapperStateNode.hasPostPlay = window.oldHasPostPlay);
                    })(), window.removeEventListener("message", seekInteraction, !1), window.injectScriptLoaded = !1; else if (e.data.type && "NEXT_EPISODE" == e.data.type) try {
                        changeEpisodeFallback(e.data.videoId);
                    } catch (error) {
                        console.log("Caught Error in React Next Episode " + error);
                    } else if (e.data.type && "GetState" == e.data.type) {
                        const player = getVideoPlayer();
                        if (isMovie(), player) {
                            const paused = player.isPaused(), time = player.getCurrentTime(), loading = null !== player.getBusy();
                            let evt = new CustomEvent("FromNode", {
                                detail: {
                                    type: "UpdateState",
                                    time,
                                    paused,
                                    loading,
                                    updatedAt: Date.now()
                                }
                            });
                            window.dispatchEvent(evt);
                        }
                    } else if (e.data.type && "ShowControls" === e.data.type) showControlsAsync(); else if (e.data.type && "CheckSkipSupplemental" === e.data.type) checkSkipSupplemental().then((() => {
                        var evt = new CustomEvent("FromNode", {
                            detail: {
                                type: "CheckSkipSupplemental",
                                updatedAt: Date.now()
                            }
                        });
                        window.dispatchEvent(evt);
                    })); else if (e.data.type && "GetPageTitle" === e.data.type) try {
                        const pageTitle = (() => {
                            try {
                                return getWrapperStateNode().state.activeVideoMetadata._metadata._metadata.video;
                            } catch (error) {
                                return;
                            }
                        })().title;
                        let evt = new CustomEvent("FromNode", {
                            detail: {
                                type: "GetTitle",
                                pageTitle,
                                updatedAt: Date.now()
                            }
                        });
                        window.dispatchEvent(evt);
                    } catch (e) {} else if (e.data.type && "GetVideoType" === e.data.type) {
                        let VideoType = "Episode";
                        isMovie() && (VideoType = "Movie");
                        let evt = new CustomEvent("FromNode", {
                            detail: {
                                type: "GetType",
                                VideoType,
                                updatedAt: Date.now()
                            }
                        });
                        window.dispatchEvent(evt);
                    } else if (e.data.type && "GetEpisodeData" === e.data.type) {
                        let episodeData;
                        try {
                            episodeData = (() => {
                                const title = getWrapperStateNode().state.activeVideoMetadata._video.title, episodeNum = getWrapperStateNode().state.activeVideoMetadata._video.seq;
                                return {
                                    title,
                                    seasonNum: getWrapperStateNode().state.activeVideoMetadata._season._season.seq,
                                    episodeNum
                                };
                            })();
                            let evt = new CustomEvent("FromNode", {
                                detail: {
                                    type: "GetEpData",
                                    episodeData,
                                    updatedAt: Date.now()
                                }
                            });
                            window.dispatchEvent(evt);
                        } catch (error) {}
                    }
                } catch (error) {
                    console.log(error);
                }
            };
            window.injectScriptLoaded || (window.injectScriptLoaded = !0, console.log("Loaded TP Netflix Injected"), 
            checkSkipSupplemental(), window.addEventListener("message", seekInteraction, !1));
        }
    })[478]();
})();