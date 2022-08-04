/*******************************************************
* Copyright (C) 2018-2022 WP Interactive Media, Inc. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
*******************************************************/
(() => {
    "use strict";
    if (!window.videoIdScriptLoaded) {
        console.log("Browse script loaded"), window.videoIdScriptLoaded = !0, window.addEventListener("AmazonVideoMessage", (function(evt) {
            if ("getVideoId" === evt.detail.type) {
                const videoId = findTitle();
                if (videoId) {
                    const newEvent = new CustomEvent("FromNode", {
                        detail: {
                            type: "VideoId",
                            videoId,
                            updatedAt: (new Date).getTime()
                        }
                    });
                    window.dispatchEvent(newEvent);
                }
            }
        }));
        var findTitle = function() {
            var _a;
            try {
                const elementRoot = document.querySelector(".atvwebplayersdk-title-text");
                if (null == elementRoot) return null;
                const keys = Object.keys(elementRoot);
                let key = null;
                for (let i = 0; i < keys.length; i++) if (keys[i].startsWith("__reactInternalInstance")) {
                    key = keys[i];
                    break;
                }
                const section_path = elementRoot[key].return.return.stateNode.context.stores.adPlayback.player.ui.xrayController.controller.metricsFeature.mediaEventController.acquisitionMediaEventController.mpPlayer.primaryContentMpPlayer.contentSource.mediaRepresentation.dashMediaRepresentationContext.sourceUrlStore.mediaEventReportingPlaylistListener.titleView.currentItem, titlePath = null !== (_a = section_path.catalogMetadata.catalog.id) && void 0 !== _a ? _a : section_path.returnedTitleRendition.asin;
                return null == key || void 0 === elementRoot[key] || void 0 === titlePath ? null : titlePath;
            } catch (err) {
                return;
            }
        };
    }
})();