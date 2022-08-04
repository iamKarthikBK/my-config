/*******************************************************
* Copyright (C) 2018-2022 WP Interactive Media, Inc. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
*******************************************************/
(() => {
    "use strict";
    let resizeVisible;
    if (!window.videoIdScriptLoaded) {
        window.videoIdScriptLoaded = !0, window.resizeScriptReady = !1, window.addEventListener("YoutubeVideoMessage", (function(event) {
            if (!1 === window.resizeScriptReady && window._yt_player && function(ytPlayer) {
                let video = document.querySelector("#movie_player");
                Object.getOwnPropertyNames(ytPlayer).forEach((prop => {
                    let obj = ytPlayer[prop];
                    if ("function(a,b){this.width=a;this.height=b}" === obj.toString()) {
                        const oldObj = obj;
                        window._yt_player[prop] = function(a, b) {
                            return video.isFullscreen() && resizeVisible && (b = b / a * (a -= 318)), new oldObj(a, b);
                        }, window._yt_player[prop].prototype = oldObj.prototype, window.resizeScriptReady = !0;
                    }
                }));
            }(window._yt_player), event.detail) {
                var type = event.detail.type;
                if ("pauseVideo" === type) getVideoElement().pauseVideo(); else if ("playVideo" === type) getVideoElement().playVideo(); else if ("getVideoTitle" === type) {
                    const title = getVideoElement().getVideoData().title;
                    if (title) {
                        const titleEvent = new CustomEvent("FromNode", {
                            detail: {
                                type: "VideoTitle",
                                title
                            }
                        });
                        window.dispatchEvent(titleEvent);
                    }
                } else if ("setTheater" === type) setTheater(); else if ("getVideoId" === type) {
                    const videoId = getVideoElement().getVideoData().video_id;
                    if (videoId) {
                        const videoIdEvent = new CustomEvent("FromNode", {
                            detail: {
                                type: "VideoId",
                                videoId
                            }
                        });
                        window.dispatchEvent(videoIdEvent);
                    }
                } else if ("seekTo" === type) {
                    const video = getVideoElement();
                    video && video.seekTo(event.detail.seekTo);
                } else if ("jumpToNextEpisode" === type) {
                    const navigationData = {
                        endpoint: {
                            commandMetadata: {
                                webCommandMetadata: {
                                    url: `/watch?v=${event.detail.nextVideoId}`,
                                    rootVe: 3832,
                                    webPageType: "WEB_PAGE_TYPE_WATCH"
                                },
                                watchEndpoint: {
                                    videoId: event.detail.nextVideoId,
                                    nofollow: !0
                                }
                            }
                        }
                    }, ytNavigator = document.querySelector("ytd-app");
                    if (!ytNavigator) throw new Error("There is no navigation on this page");
                    {
                        ytNavigator.fire("yt-navigate", navigationData);
                        const navigateEvent = new CustomEvent("FromNode", {
                            detail: {
                                type: "Navigated"
                            }
                        });
                        window.dispatchEvent(navigateEvent);
                    }
                } else if ("SetChatVisible" == type) {
                    resizeVisible = event.detail.visible;
                    const video = getVideoElement();
                    video && (video.setSize(), video.setInternalSize());
                }
            }
        }));
        const setTheater = () => {
            const inTheater = document.querySelector("ytd-watch-flexy");
            if (inTheater && null !== inTheater.theater) {
                const theaterButton = document.querySelector(".ytp-size-button");
                theaterButton && !inTheater.theater && theaterButton.click();
            }
        }, getVideoElement = () => {
            const url = window.location.href;
            let video;
            if (isPlayerPage()) if (url.includes("watch?")) video = document.querySelector("#movie_player"); else {
                if (!url.includes("/shorts/")) throw new Error("Unknown Video Type");
                video = document.querySelector("#shorts-player");
            }
            return video;
        }, isPlayerPage = () => !(!window.location.href.includes("watch?") && !window.location.href.includes("/shorts/"));
    }
})();