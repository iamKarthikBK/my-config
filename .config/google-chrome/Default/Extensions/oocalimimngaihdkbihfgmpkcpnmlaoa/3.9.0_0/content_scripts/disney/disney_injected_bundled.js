/*******************************************************
* Copyright (C) 2018-2022 WP Interactive Media, Inc. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
*******************************************************/
(() => {
    "use strict";
    window.seekScriptLoaded = !0;
    var seekInteraction = function(e) {
        if (e.source == window) {
            if (e.data.type && "NEXT_EPISODE" == e.data.type) {
                (function() {
                    const elementRoot = document.querySelector("main#section_index > div");
                    if (null == elementRoot) return null;
                    const keys = Object.keys(elementRoot);
                    let key = null;
                    for (let i = 0; i < keys.length; i++) if (keys[i].startsWith("__reactInternalInstance")) {
                        key = keys[i];
                        break;
                    }
                    return null == key || void 0 === elementRoot[key] || void 0 === elementRoot[key].memoizedProps.children._owner ? null : elementRoot[key].memoizedProps.children._owner.memoizedProps;
                })().navigate({
                    name: "video",
                    params: {
                        contentId: e.data.videoId,
                        timerAutoAdvanced: !0
                    }
                });
            }
            e.data.type && "teardown" == e.data.type && (console.log("teardown"), window.removeEventListener("message", seekInteraction, !1), 
            window.seekScriptLoaded = !1);
        }
    };
    console.log("setup"), window.addEventListener("message", seekInteraction, !1);
})();