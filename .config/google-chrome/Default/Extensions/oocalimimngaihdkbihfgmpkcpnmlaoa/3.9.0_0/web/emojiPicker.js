document.querySelector("emoji-picker").addEventListener("emoji-click", (event => window.top.postMessage({
    type: "emoji-click",
    detail: event.detail
}, "*")));