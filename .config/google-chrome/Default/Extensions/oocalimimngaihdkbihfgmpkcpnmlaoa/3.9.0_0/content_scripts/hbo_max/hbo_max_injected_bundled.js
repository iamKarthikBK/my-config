/*******************************************************
* Copyright (C) 2018-2022 WP Interactive Media, Inc. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
*******************************************************/
(() => {
    "use strict";
    function findVideoPlayerProps() {
        try {
            const propsParent = document.querySelector("#rn-video").parentElement, key = Object.keys(propsParent).find((key => key.startsWith("__reactProps")));
            return propsParent[key].children[1].props.videoPlayer;
        } catch (e) {
            return;
        }
    }
    function findViewProps() {
        try {
            const propsParent = document.querySelector("#rn-video").parentElement, key = Object.keys(propsParent).find((key => key.startsWith("__reactProps")));
            return propsParent[key].children[2].props;
        } catch (e) {
            return;
        }
    }
    function canFixChat() {
        const viewProps = findViewProps(), videoProps = findVideoPlayerProps();
        return videoProps && videoProps.seekTo && viewProps && void 0 !== viewProps.insets && void 0 !== viewProps.insets.right;
    }
    window.nodeScriptLoaded || (console.log("VIDEO NODE SCRIPT"), window.nodeScriptLoaded = !0, 
    window.addEventListener("tpVideoNode", (function(evt) {
        var _a, type = evt.detail.type;
        if ("seek" === type) {
            const props = findVideoPlayerProps();
            props && props.seekTo(evt.detail.time);
        } else if ("pause" === type) {
            const props = findVideoPlayerProps();
            props && props.pause();
        } else if ("play" === type) {
            const props = findVideoPlayerProps();
            props && props.play();
        } else if ("nextEpisode" === type) {
            const props = findVideoPlayerProps();
            if (props) {
                const urn = `urn:hbo:${null !== (_a = evt.detail.videoType) && void 0 !== _a ? _a : "episode"}:${evt.detail.videoId}`;
                props.loadByUrn(urn);
            }
        } else if ("UpdateState" === type) {
            const props = findVideoPlayerProps();
            if (props) {
                const playerState = {
                    playbackState: props._videoEngine._videoPlayer._video.playbackState,
                    time: 1e3 * props._uiManager._uiState.timelinePosition,
                    currentAd: props._store.getState().AdsManager.activeAdBreak,
                    videoId: props._store.getState().VideoPlayer.cutId,
                    duration: 1e3 * props._uiManager._uiState.timelineDuration,
                    canFixChat: canFixChat(),
                    seriesName: props._store.getState().ContentManager.fullSeriesTitle
                };
                let evt = new CustomEvent("FromNode", {
                    detail: {
                        type: "StateUpdate",
                        playerState,
                        updatedAt: (new Date).getTime()
                    }
                });
                window.dispatchEvent(evt);
            }
        } else if ("SetChatVisible" == type) {
            !function(visible) {
                findViewProps().insets.right = visible ? 304 : 0;
                const videoProps = findVideoPlayerProps();
                videoProps.seekTo(videoProps._videoEngine._videoPlayer._video._currentPosition - 1e-4);
            }(evt.detail.visible);
        }
    })));
})();