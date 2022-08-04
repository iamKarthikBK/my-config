/*******************************************************
* Copyright (C) 2018-2022 WP Interactive Media, Inc. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
*******************************************************/
(() => {
    "use strict";
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
    function assertNonEmptyString(str) {
        if ("string" != typeof str || !str) throw new Error("expected a non-empty string, got: " + str);
    }
    function assertNumber(number) {
        if ("number" != typeof number) throw new Error("expected a number, got: " + number);
    }
    const KEY_ETAG = "eTag", KEY_URL = "url";
    function uniqEmoji(emojis) {
        return function(arr, func) {
            const set = new Set, res = [];
            for (const item of arr) {
                const key = func(item);
                set.has(key) || (set.add(key), res.push(item));
            }
            return res;
        }(emojis, (_ => _.unicode));
    }
    const openReqs = {}, databaseCache = {}, onCloseListeners = {};
    function handleOpenOrDeleteReq(resolve, reject, req) {
        req.onerror = () => reject(req.error), req.onblocked = () => reject(new Error("IDB blocked")), 
        req.onsuccess = () => resolve(req.result);
    }
    function createDatabase(dbName) {
        return __awaiter(this, void 0, void 0, (function*() {
            const db = yield new Promise(((resolve, reject) => {
                const req = indexedDB.open(dbName, 1);
                openReqs[dbName] = req, req.onupgradeneeded = e => {
                    e.oldVersion < 1 && function(db) {
                        function createObjectStore(name, keyPath, indexes) {
                            const store = keyPath ? db.createObjectStore(name, {
                                keyPath
                            }) : db.createObjectStore(name);
                            if (indexes) for (const [indexName, [keyPath, multiEntry]] of Object.entries(indexes)) store.createIndex(indexName, keyPath, {
                                multiEntry
                            });
                            return store;
                        }
                        createObjectStore("keyvalue"), createObjectStore("emoji", "unicode", {
                            tokens: [ "tokens", !0 ],
                            "group-order": [ [ "group", "order" ] ],
                            skinUnicodes: [ "skinUnicodes", !0 ]
                        }), createObjectStore("favorites", void 0, {
                            count: [ "" ]
                        });
                    }(req.result);
                }, handleOpenOrDeleteReq(resolve, reject, req);
            }));
            return db.onclose = () => closeDatabase(dbName), db;
        }));
    }
    function dbPromise(db, storeName, readOnlyOrReadWrite, cb) {
        return new Promise(((resolve, reject) => {
            const txn = db.transaction(storeName, readOnlyOrReadWrite, {
                durability: "relaxed"
            }), store = "string" == typeof storeName ? txn.objectStore(storeName) : storeName.map((name => txn.objectStore(name)));
            let res;
            cb(store, txn, (result => {
                res = result;
            })), txn.oncomplete = () => resolve(res), txn.onerror = () => reject(txn.error);
        }));
    }
    function closeDatabase(dbName) {
        const req = openReqs[dbName], db = req && req.result;
        if (db) {
            db.close();
            const listeners = onCloseListeners[dbName];
            if (listeners) for (const listener of listeners) listener();
        }
        delete openReqs[dbName], delete databaseCache[dbName], delete onCloseListeners[dbName];
    }
    const irregularEmoticons = new Set([ ":D", "XD", ":'D", "O:)", ":X", ":P", ";P", "XP", ":L", ":Z", ":j", "8D", "XO", "8)", ":B", ":O", ":S", ":'o", "Dx", "X(", "D:", ":C", ">0)", ":3", "</3", "<3", "\\M/", ":E", "8#" ]);
    function extractTokens(str) {
        return str.split(/[\s_]+/).map((word => !word.match(/\w/) || irregularEmoticons.has(word) ? word.toLowerCase() : word.replace(/[)(:,]/g, "").replace(/’/g, "'").toLowerCase())).filter(Boolean);
    }
    function normalizeTokens(str) {
        return str.filter(Boolean).map((_ => _.toLowerCase())).filter((_ => _.length >= 2));
    }
    function callStore(store, method, key, cb) {
        store[method](key).onsuccess = e => cb && cb(e.target.result);
    }
    function getIDB(store, key, cb) {
        callStore(store, "get", key, cb);
    }
    function getAllIDB(store, key, cb) {
        callStore(store, "getAll", key, cb);
    }
    function commit(txn) {
        txn.commit && txn.commit();
    }
    function findCommonMembers(arrays, uniqByFunc) {
        const shortestArray = function(array, func) {
            let minItem = array[0];
            for (let i = 1; i < array.length; i++) {
                const item = array[i];
                func(minItem) > func(item) && (minItem = item);
            }
            return minItem;
        }(arrays, (_ => _.length)), results = [];
        for (const item of shortestArray) arrays.some((array => -1 === array.findIndex((_ => uniqByFunc(_) === uniqByFunc(item))))) || results.push(item);
        return results;
    }
    function loadData(db, emojiData, url, eTag) {
        return __awaiter(this, void 0, void 0, (function*() {
            try {
                const transformedData = function(emojiData) {
                    return emojiData.map((({annotation, emoticon, group, order, shortcodes, skins, tags, emoji, version}) => {
                        const tokens = [ ...new Set(normalizeTokens([ ...(shortcodes || []).map(extractTokens).flat(), ...tags.map(extractTokens).flat(), ...extractTokens(annotation), emoticon ])) ].sort(), res = {
                            annotation,
                            group,
                            order,
                            tags,
                            tokens,
                            unicode: emoji,
                            version
                        };
                        if (emoticon && (res.emoticon = emoticon), shortcodes && (res.shortcodes = shortcodes), 
                        skins) {
                            res.skinTones = [], res.skinUnicodes = [], res.skinVersions = [];
                            for (const {tone, emoji, version} of skins) res.skinTones.push(tone), res.skinUnicodes.push(emoji), 
                            res.skinVersions.push(version);
                        }
                        return res;
                    }));
                }(emojiData);
                yield dbPromise(db, [ "emoji", "keyvalue" ], "readwrite", (([emojiStore, metaStore], txn) => {
                    let oldETag, oldUrl, todo = 0;
                    function checkFetched() {
                        2 == ++todo && function() {
                            if (oldETag === eTag && oldUrl === url) return;
                            emojiStore.clear();
                            for (const data of transformedData) emojiStore.put(data);
                            metaStore.put(eTag, KEY_ETAG), metaStore.put(url, KEY_URL), commit(txn);
                        }();
                    }
                    getIDB(metaStore, KEY_ETAG, (result => {
                        oldETag = result, checkFetched();
                    })), getIDB(metaStore, KEY_URL, (result => {
                        oldUrl = result, checkFetched();
                    }));
                }));
            } finally {}
        }));
    }
    function getEmojiBySearchQuery(db, query) {
        return __awaiter(this, void 0, void 0, (function*() {
            const tokens = normalizeTokens(extractTokens(query));
            return tokens.length ? dbPromise(db, "emoji", "readonly", ((emojiStore, txn, cb) => {
                const intermediateResults = [], onDone = () => {
                    const results = findCommonMembers(intermediateResults, (_ => _.unicode));
                    cb(results.sort(((a, b) => a.order < b.order ? -1 : 1)));
                };
                for (let i = 0; i < tokens.length; i++) {
                    const token = tokens[i], range = i === tokens.length - 1 ? IDBKeyRange.bound(token, token + "￿", !1, !0) : IDBKeyRange.only(token);
                    getAllIDB(emojiStore.index("tokens"), range, (result => {
                        intermediateResults.push(result), intermediateResults.length === tokens.length && onDone();
                    }));
                }
            })) : [];
        }));
    }
    function getEmojiByShortcode(db, shortcode) {
        return __awaiter(this, void 0, void 0, (function*() {
            const emojis = yield getEmojiBySearchQuery(db, shortcode);
            if (!emojis.length) {
                const predicate = _ => (_.shortcodes || []).includes(shortcode.toLowerCase());
                return (yield function(db, predicate) {
                    return __awaiter(this, void 0, void 0, (function*() {
                        return dbPromise(db, "emoji", "readonly", ((emojiStore, txn, cb) => {
                            let lastKey;
                            const processNextBatch = () => {
                                emojiStore.getAll(lastKey && IDBKeyRange.lowerBound(lastKey, !0), 50).onsuccess = e => {
                                    const results = e.target.result;
                                    for (const result of results) if (lastKey = result.unicode, predicate(result)) return cb(result);
                                    if (results.length < 50) return cb();
                                    processNextBatch();
                                };
                            };
                            processNextBatch();
                        }));
                    }));
                }(db, predicate)) || null;
            }
            return emojis.filter((_ => {
                const lowerShortcodes = (_.shortcodes || []).map((_ => _.toLowerCase()));
                return lowerShortcodes.includes(shortcode.toLowerCase());
            }))[0] || null;
        }));
    }
    function get(db, storeName, key) {
        return dbPromise(db, storeName, "readonly", ((store, txn, cb) => getIDB(store, key, cb)));
    }
    const requiredKeys$1 = [ "name", "url" ];
    function customEmojiIndex(customEmojis) {
        !function(customEmojis) {
            const isArray = customEmojis && Array.isArray(customEmojis), firstItemIsFaulty = isArray && customEmojis.length && (!customEmojis[0] || requiredKeys$1.some((key => !(key in customEmojis[0]))));
            if (!isArray || firstItemIsFaulty) throw new Error("Custom emojis are in the wrong format");
        }(customEmojis);
        const sortByName = (a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1, all = customEmojis.sort(sortByName), searchTrie = function(arr, itemToTokens) {
            const map = new Map;
            for (const item of arr) {
                const tokens = itemToTokens(item);
                for (const token of tokens) {
                    let currentMap = map;
                    for (let i = 0; i < token.length; i++) {
                        const char = token.charAt(i);
                        let nextMap = currentMap.get(char);
                        nextMap || (nextMap = new Map, currentMap.set(char, nextMap)), currentMap = nextMap;
                    }
                    let valuesAtCoda = currentMap.get("");
                    valuesAtCoda || (valuesAtCoda = [], currentMap.set("", valuesAtCoda)), valuesAtCoda.push(item);
                }
            }
            return (query, exact) => {
                let currentMap = map;
                for (let i = 0; i < query.length; i++) {
                    const char = query.charAt(i), nextMap = currentMap.get(char);
                    if (!nextMap) return [];
                    currentMap = nextMap;
                }
                if (exact) return currentMap.get("") || [];
                const results = [], queue = [ currentMap ];
                for (;queue.length; ) {
                    const entriesSortedByKey = [ ...queue.shift().entries() ].sort(((a, b) => a[0] < b[0] ? -1 : 1));
                    for (const [key, value] of entriesSortedByKey) "" === key ? results.push(...value) : queue.push(value);
                }
                return results;
            };
        }(customEmojis, (emoji => [ ...new Set((emoji.shortcodes || []).map((shortcode => extractTokens(shortcode))).flat()) ])), searchByExactMatch = _ => searchTrie(_, !0), searchByPrefix = _ => searchTrie(_, !1), shortcodeToEmoji = new Map, nameToEmoji = new Map;
        for (const customEmoji of customEmojis) {
            nameToEmoji.set(customEmoji.name.toLowerCase(), customEmoji);
            for (const shortcode of customEmoji.shortcodes || []) shortcodeToEmoji.set(shortcode.toLowerCase(), customEmoji);
        }
        return {
            all,
            search: query => {
                const tokens = extractTokens(query);
                return findCommonMembers(tokens.map(((token, i) => (i < tokens.length - 1 ? searchByExactMatch : searchByPrefix)(token))), (_ => _.name)).sort(sortByName);
            },
            byShortcode: shortcode => shortcodeToEmoji.get(shortcode.toLowerCase()),
            byName: name => nameToEmoji.get(name.toLowerCase())
        };
    }
    function cleanEmoji(emoji) {
        if (!emoji) return emoji;
        if (delete emoji.tokens, emoji.skinTones) {
            const len = emoji.skinTones.length;
            emoji.skins = Array(len);
            for (let i = 0; i < len; i++) emoji.skins[i] = {
                tone: emoji.skinTones[i],
                unicode: emoji.skinUnicodes[i],
                version: emoji.skinVersions[i]
            };
            delete emoji.skinTones, delete emoji.skinUnicodes, delete emoji.skinVersions;
        }
        return emoji;
    }
    function warnETag(eTag) {
        eTag || console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.");
    }
    const requiredKeys = [ "annotation", "emoji", "group", "order", "tags", "version" ];
    function assertStatus(response, dataSource) {
        if (2 !== Math.floor(response.status / 100)) throw new Error("Failed to fetch: " + dataSource + ":  " + response.status);
    }
    function getETag(dataSource) {
        return __awaiter(this, void 0, void 0, (function*() {
            const response = yield fetch(dataSource, {
                method: "HEAD"
            });
            assertStatus(response, dataSource);
            const eTag = response.headers.get("etag");
            return warnETag(eTag), eTag;
        }));
    }
    function getETagAndData(dataSource) {
        return __awaiter(this, void 0, void 0, (function*() {
            const response = yield fetch(dataSource, {
                method: "GET"
            });
            let emojiData, eTag;
            if (console.warn(response), assertStatus(response, dataSource), response.type) emojiData = yield response.json(), 
            eTag = yield getETag(dataSource); else {
                const emojiText = yield response.text();
                eTag = response.headers.etag, emojiData = JSON.parse(emojiText), console.warn("Alternative Type Found");
            }
            return warnETag(eTag), function(emojiData) {
                if (!emojiData || !Array.isArray(emojiData) || !emojiData[0] || "object" != typeof emojiData[0] || requiredKeys.some((key => !(key in emojiData[0])))) throw new Error("Emoji data is in the wrong format");
            }(emojiData), [ eTag, emojiData ];
        }));
    }
    function jsonChecksum(object) {
        return __awaiter(this, void 0, void 0, (function*() {
            const inBuffer = function(binary) {
                for (var length = binary.length, buf = new ArrayBuffer(length), arr = new Uint8Array(buf), i = -1; ++i < length; ) arr[i] = binary.charCodeAt(i);
                return buf;
            }(JSON.stringify(object)), outBinString = function(buffer) {
                for (var binary = "", bytes = new Uint8Array(buffer), length = bytes.byteLength, i = -1; ++i < length; ) binary += String.fromCharCode(bytes[i]);
                return binary;
            }(yield crypto.subtle.digest("SHA-1", inBuffer));
            return btoa(outBinString);
        }));
    }
    function checkForUpdates(db, dataSource) {
        return __awaiter(this, void 0, void 0, (function*() {
            let emojiData, eTag = yield getETag(dataSource);
            if (!eTag) {
                const emojiData = yield getETagAndData(dataSource);
                emojiData = eTagAndData[1], eTag || (eTag = yield jsonChecksum(emojiData));
            }
            if (yield function(db, url, eTag) {
                return __awaiter(this, void 0, void 0, (function*() {
                    const [oldETag, oldUrl] = yield Promise.all([ KEY_ETAG, KEY_URL ].map((key => get(db, "keyvalue", key))));
                    return oldETag === eTag && oldUrl === url;
                }));
            }(db, dataSource, eTag)) ; else {
                if (!emojiData) {
                    emojiData = (yield getETagAndData(dataSource))[1];
                }
                yield loadData(db, emojiData, dataSource, eTag);
            }
        }));
    }
    class Database {
        constructor({dataSource = "chrome-extension://oocalimimngaihdkbihfgmpkcpnmlaoa/lib/tp_emoji/emoji-picker.json", locale = "en", customEmoji = []} = {}) {
            this.dataSource = dataSource, this.locale = locale, this._dbName = `emoji-picker-element-${this.locale}`, 
            this._db = void 0, this._lazyUpdate = void 0, this._custom = customEmojiIndex(customEmoji), 
            this._clear = this._clear.bind(this), this._ready = this._init();
        }
        _init() {
            return __awaiter(this, void 0, void 0, (function*() {
                const db = this._db = yield (dbName = this._dbName, databaseCache[dbName] || (databaseCache[dbName] = createDatabase(dbName)), 
                databaseCache[dbName]);
                var dbName;
                !function(dbName, listener) {
                    let listeners = onCloseListeners[dbName];
                    listeners || (listeners = onCloseListeners[dbName] = []), listeners.push(listener);
                }(this._dbName, this._clear);
                const dataSource = this.dataSource, empty = yield function(db) {
                    return __awaiter(this, void 0, void 0, (function*() {
                        return !(yield get(db, "keyvalue", KEY_URL));
                    }));
                }(db);
                empty ? yield function(db, dataSource) {
                    return __awaiter(this, void 0, void 0, (function*() {
                        let [eTag, emojiData] = yield getETagAndData(dataSource);
                        eTag || (eTag = yield jsonChecksum(emojiData)), yield loadData(db, emojiData, dataSource, eTag);
                    }));
                }(db, dataSource) : this._lazyUpdate = checkForUpdates(db, dataSource);
            }));
        }
        ready() {
            return __awaiter(this, void 0, void 0, (function*() {
                const checkReady = () => __awaiter(this, void 0, void 0, (function*() {
                    return this._ready || (this._ready = this._init()), this._ready;
                }));
                yield checkReady(), this._db || (yield checkReady());
            }));
        }
        getEmojiByGroup(group) {
            return __awaiter(this, void 0, void 0, (function*() {
                return assertNumber(group), yield this.ready(), uniqEmoji(yield function(db, group) {
                    return __awaiter(this, void 0, void 0, (function*() {
                        return dbPromise(db, "emoji", "readonly", ((emojiStore, txn, cb) => {
                            const range = IDBKeyRange.bound([ group, 0 ], [ group + 1, 0 ], !1, !0);
                            getAllIDB(emojiStore.index("group-order"), range, cb);
                        }));
                    }));
                }(this._db, group)).map(cleanEmoji);
            }));
        }
        getEmojiBySearchQuery(query) {
            return __awaiter(this, void 0, void 0, (function*() {
                assertNonEmptyString(query), yield this.ready();
                return [ ...this._custom.search(query), ...uniqEmoji(yield getEmojiBySearchQuery(this._db, query)).map(cleanEmoji) ];
            }));
        }
        getEmojiByShortcode(shortcode) {
            return __awaiter(this, void 0, void 0, (function*() {
                assertNonEmptyString(shortcode), yield this.ready();
                const custom = this._custom.byShortcode(shortcode);
                return custom || cleanEmoji(yield getEmojiByShortcode(this._db, shortcode));
            }));
        }
        getEmojiByUnicodeOrName(unicodeOrName) {
            return __awaiter(this, void 0, void 0, (function*() {
                assertNonEmptyString(unicodeOrName), yield this.ready();
                const custom = this._custom.byName(unicodeOrName);
                return custom || cleanEmoji(yield function(db, unicode) {
                    return __awaiter(this, void 0, void 0, (function*() {
                        return dbPromise(db, "emoji", "readonly", ((emojiStore, txn, cb) => getIDB(emojiStore, unicode, (result => {
                            if (result) return cb(result);
                            getIDB(emojiStore.index("skinUnicodes"), unicode, (result => cb(result || null)));
                        }))));
                    }));
                }(this._db, unicodeOrName));
            }));
        }
        getPreferredSkinTone() {
            return __awaiter(this, void 0, void 0, (function*() {
                return yield this.ready(), (yield get(this._db, "keyvalue", "skinTone")) || 0;
            }));
        }
        setPreferredSkinTone(skinTone) {
            return __awaiter(this, void 0, void 0, (function*() {
                return assertNumber(skinTone), yield this.ready(), db = this._db, key = "skinTone", 
                value = skinTone, dbPromise(db, "keyvalue", "readwrite", ((store, txn) => {
                    store.put(value, key), commit(txn);
                }));
                var db, key, value;
            }));
        }
        incrementFavoriteEmojiCount(unicodeOrName) {
            return __awaiter(this, void 0, void 0, (function*() {
                return assertNonEmptyString(unicodeOrName), yield this.ready(), db = this._db, unicode = unicodeOrName, 
                dbPromise(db, "favorites", "readwrite", ((store, txn) => getIDB(store, unicode, (result => {
                    store.put((result || 0) + 1, unicode), commit(txn);
                }))));
                var db, unicode;
            }));
        }
        getTopFavoriteEmoji(limit) {
            return __awaiter(this, void 0, void 0, (function*() {
                return assertNumber(limit), yield this.ready(), (yield function(db, customEmojiIndex, limit) {
                    return 0 === limit ? [] : dbPromise(db, [ "favorites", "emoji" ], "readonly", (([favoritesStore, emojiStore], txn, cb) => {
                        const results = [];
                        favoritesStore.index("count").openCursor(void 0, "prev").onsuccess = e => {
                            const cursor = e.target.result;
                            if (!cursor) return cb(results);
                            function addResult(result) {
                                if (results.push(result), results.length === limit) return cb(results);
                                cursor.continue();
                            }
                            const unicodeOrName = cursor.primaryKey, custom = customEmojiIndex.byName(unicodeOrName);
                            if (custom) return addResult(custom);
                            getIDB(emojiStore, unicodeOrName, (emoji => {
                                if (emoji) return addResult(emoji);
                                cursor.continue();
                            }));
                        };
                    }));
                }(this._db, this._custom, limit)).map(cleanEmoji);
            }));
        }
        set customEmoji(customEmojis) {
            this._custom = customEmojiIndex(customEmojis);
        }
        get customEmoji() {
            return this._custom.all;
        }
        _shutdown() {
            return __awaiter(this, void 0, void 0, (function*() {
                yield this.ready();
                try {
                    yield this._lazyUpdate;
                } catch (err) {}
            }));
        }
        _clear() {
            this._db = this._ready = this._lazyUpdate = void 0;
        }
        close() {
            return __awaiter(this, void 0, void 0, (function*() {
                yield this._shutdown(), yield closeDatabase(this._dbName);
            }));
        }
        delete() {
            return __awaiter(this, void 0, void 0, (function*() {
                var dbName;
                yield this._shutdown(), yield (dbName = this._dbName, new Promise(((resolve, reject) => {
                    closeDatabase(dbName), handleOpenOrDeleteReq(resolve, reject, indexedDB.deleteDatabase(dbName));
                })));
            }));
        }
    }
    var picker_awaiter = function(thisArg, _arguments, P, generator) {
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
    function noop() {}
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return "function" == typeof thing;
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || a && "object" == typeof a || "function" == typeof a;
    }
    let src_url_equal_anchor, current_component;
    function src_url_equal(element_src, url) {
        return src_url_equal_anchor || (src_url_equal_anchor = document.createElement("a")), 
        src_url_equal_anchor.href = url, element_src === src_url_equal_anchor.href;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function picker_element(name) {
        return document.createElement(name);
    }
    function picker_text(data) {
        return document.createTextNode(data);
    }
    function listen(node, event, handler, options) {
        return node.addEventListener(event, handler, options), () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        null == value ? node.removeAttribute(attribute) : node.getAttribute(attribute) !== value && node.setAttribute(attribute, value);
    }
    function set_data(text, data) {
        data = "" + data, text.wholeText !== data && (text.data = data);
    }
    function set_input_value(input, value) {
        input.value = null == value ? "" : value;
    }
    function set_style(node, key, value, important) {
        null === value ? node.style.removeProperty(key) : node.style.setProperty(key, value, important ? "important" : "");
    }
    function set_current_component(component) {
        current_component = component;
    }
    const dirty_components = [], binding_callbacks = [], render_callbacks = [], flush_callbacks = [], resolved_promise = Promise.resolve();
    let update_scheduled = !1;
    function schedule_update() {
        update_scheduled || (update_scheduled = !0, resolved_promise.then(flush));
    }
    function tick() {
        return schedule_update(), resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    const seen_callbacks = new Set;
    let flushidx = 0;
    function flush() {
        const saved_component = current_component;
        do {
            for (;flushidx < dirty_components.length; ) {
                const component = dirty_components[flushidx];
                flushidx++, set_current_component(component), update(component.$$);
            }
            for (set_current_component(null), dirty_components.length = 0, flushidx = 0; binding_callbacks.length; ) binding_callbacks.pop()();
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                seen_callbacks.has(callback) || (seen_callbacks.add(callback), callback());
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        for (;flush_callbacks.length; ) flush_callbacks.pop()();
        update_scheduled = !1, seen_callbacks.clear(), set_current_component(saved_component);
    }
    function update($$) {
        if (null !== $$.fragment) {
            $$.update(), run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [ -1 ], $$.fragment && $$.fragment.p($$.ctx, dirty), $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set;
    function transition_in(block, local) {
        block && block.i && (outroing.delete(block), block.i(local));
    }
    const globals = "undefined" != typeof window ? window : "undefined" != typeof globalThis ? globalThis : global;
    function destroy_block(block, lookup) {
        block.d(1), lookup.delete(block.key);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length, n = list.length, i = o;
        const old_indexes = {};
        for (;i--; ) old_indexes[old_blocks[i].key] = i;
        const new_blocks = [], new_lookup = new Map, deltas = new Map;
        for (i = n; i--; ) {
            const child_ctx = get_context(ctx, list, i), key = get_key(child_ctx);
            let block = lookup.get(key);
            block ? dynamic && block.p(child_ctx, dirty) : (block = create_each_block(key, child_ctx), 
            block.c()), new_lookup.set(key, new_blocks[i] = block), key in old_indexes && deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set, did_move = new Set;
        function insert(block) {
            transition_in(block, 1), block.m(node, next), lookup.set(block.key, block), next = block.first, 
            n--;
        }
        for (;o && n; ) {
            const new_block = new_blocks[n - 1], old_block = old_blocks[o - 1], new_key = new_block.key, old_key = old_block.key;
            new_block === old_block ? (next = new_block.first, o--, n--) : new_lookup.has(old_key) ? !lookup.has(new_key) || will_move.has(new_key) ? insert(new_block) : did_move.has(old_key) ? o-- : deltas.get(new_key) > deltas.get(old_key) ? (did_move.add(new_key), 
            insert(new_block)) : (will_move.add(old_key), o--) : (destroy(old_block, lookup), 
            o--);
        }
        for (;o--; ) {
            const old_block = old_blocks[o];
            new_lookup.has(old_block.key) || destroy(old_block, lookup);
        }
        for (;n; ) insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [ -1 ]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            callbacks: blank_object(),
            dirty,
            skip_bound: !1,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = !1;
        $$.ctx = instance ? instance(component, options.props || {}, ((i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            return $$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value) && (!$$.skip_bound && $$.bound[i] && $$.bound[i](value), 
            ready && function(component, i) {
                -1 === component.$$.dirty[0] && (dirty_components.push(component), schedule_update(), 
                component.$$.dirty.fill(0)), component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
            }(component, i)), ret;
        })) : [], $$.update(), ready = !0, run_all($$.before_update), $$.fragment = !!create_fragment && create_fragment($$.ctx), 
        options.target && ($$.fragment && $$.fragment.c(), options.intro && transition_in(component.$$.fragment), 
        function(component, target, anchor, customElement) {
            const {fragment, on_mount, on_destroy, after_update} = component.$$;
            fragment && fragment.m(target, anchor), customElement || add_render_callback((() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                on_destroy ? on_destroy.push(...new_on_destroy) : run_all(new_on_destroy), component.$$.on_mount = [];
            })), after_update.forEach(add_render_callback);
        }(component, options.target, options.anchor, options.customElement), flush()), set_current_component(parent_component);
    }
    const allGroups = [ [ -1, "✨", "custom" ], [ 10, "🕔", "recents" ], [ 0, "😀", "smileys" ], [ 3, "🐱", "leaf" ], [ 4, "🍎", "food" ], [ 5, "🏠️", "places" ], [ 6, "⚽", "activities" ], [ 7, "📝", "objects" ], [ 8, "⛔️", "symbols" ], [ 9, "🏁", "flag" ] ].map((([id, emoji, name]) => ({
        id,
        emoji,
        name
    }))), groups = allGroups.slice(1), customGroup = allGroups[0], rIC = "function" == typeof requestIdleCallback ? requestIdleCallback : setTimeout;
    function hasZwj(emoji) {
        return emoji.unicode.includes("‍");
    }
    const versionsAndTestEmoji = {
        "🫠": 14,
        "🥲": 13.1,
        "🥻": 12.1,
        "🥰": 11,
        "🤩": 5,
        "👱‍♀️": 4,
        "🤣": 3,
        "👁️‍🗨️": 2,
        "😀": 1,
        "😐️": .7,
        "😃": .6
    }, MOST_COMMONLY_USED_EMOJI = [ "😊", "😒", "♥️", "👍️", "😍", "😂", "😭", "☺️", "😔", "😩", "😏", "💕", "🙌", "😘" ], DEFAULT_FREQUENTLY_USED = [ "😂", "😍", "😲", "🙌", "👍", "👎", "❤️", "👋", "🎉" ], FONT_FAMILY = '"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Twemoji Mozilla","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif', DEFAULT_CATEGORY_SORTING = (a, b) => a < b ? -1 : a > b ? 1 : 0, getTextFeature = (text, color) => {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 1;
        const ctx = canvas.getContext("2d");
        return ctx.textBaseline = "top", ctx.font = `100px ${FONT_FAMILY}`, ctx.fillStyle = color, 
        ctx.scale(.01, .01), ctx.fillText(text, 0, 0), ctx.getImageData(0, 0, 1, 1).data;
    };
    function testColorEmojiSupported(text) {
        const feature1 = getTextFeature(text, "#000"), feature2 = getTextFeature(text, "#fff");
        return feature1 && feature2 && ((feature1, feature2) => {
            const feature1Str = [ ...feature1 ].join(",");
            return feature1Str === [ ...feature2 ].join(",") && !feature1Str.startsWith("0,0,0,");
        })(feature1, feature2);
    }
    const emojiSupportLevelPromise = new Promise((resolve => rIC((() => resolve(function() {
        const entries = Object.entries(versionsAndTestEmoji);
        try {
            for (const [emoji, version] of entries) if (testColorEmojiSupported(emoji)) return version;
        } catch (e) {}
        return entries[0][1];
    }()))))), supportedZwjEmojis = new Map;
    function halt(event) {
        event.preventDefault(), event.stopPropagation();
    }
    function incrementOrDecrement(decrement, val, arr) {
        return (val += decrement ? -1 : 1) < 0 ? val = arr.length - 1 : val >= arr.length && (val = 0), 
        val;
    }
    function picker_uniqBy(arr, func) {
        const set = new Set, res = [];
        for (const item of arr) {
            const key = func(item);
            set.has(key) || (set.add(key), res.push(item));
        }
        return res;
    }
    const rAF = requestAnimationFrame;
    let baselineEmojiWidth, resizeObserverSupported = "function" == typeof ResizeObserver;
    function calculateTextWidth(node) {
        {
            const range = document.createRange();
            return range.selectNode(node.firstChild), range.getBoundingClientRect().width;
        }
    }
    const {Map: Map_1} = globals;
    function get_each_context(ctx, list, i) {
        const child_ctx = ctx.slice();
        return child_ctx[73] = list[i], child_ctx[75] = i, child_ctx;
    }
    function get_each_context_1(ctx, list, i) {
        const child_ctx = ctx.slice();
        return child_ctx[76] = list[i], child_ctx[78] = i, child_ctx;
    }
    function get_each_context_2(ctx, list, i) {
        const child_ctx = ctx.slice();
        return child_ctx[79] = list[i], child_ctx[75] = i, child_ctx;
    }
    function get_each_context_3(ctx, list, i) {
        const child_ctx = ctx.slice();
        return child_ctx[73] = list[i], child_ctx[75] = i, child_ctx;
    }
    function get_each_context_4(ctx, list, i) {
        const child_ctx = ctx.slice();
        return child_ctx[76] = list[i], child_ctx;
    }
    function get_each_context_5(ctx, list, i) {
        const child_ctx = ctx.slice();
        return child_ctx[84] = list[i], child_ctx[75] = i, child_ctx;
    }
    function create_each_block_5(key_1, ctx) {
        let div, t, div_id_value, div_class_value, div_aria_selected_value, div_title_value, div_aria_label_value, t_value = ctx[84] + "";
        return {
            key: key_1,
            first: null,
            c() {
                div = picker_element("div"), t = picker_text(t_value), attr(div, "id", div_id_value = "skintone-" + ctx[75]), 
                attr(div, "class", div_class_value = "emoji hide-focus " + (ctx[75] === ctx[19] ? "active" : "")), 
                attr(div, "aria-selected", div_aria_selected_value = ctx[75] === ctx[19]), attr(div, "role", "option"), 
                attr(div, "title", div_title_value = ctx[0].skinTones[ctx[75]]), attr(div, "tabindex", "-1"), 
                attr(div, "aria-label", div_aria_label_value = ctx[0].skinTones[ctx[75]]), this.first = div;
            },
            m(target, anchor) {
                insert(target, div, anchor), append(div, t);
            },
            p(new_ctx, dirty) {
                ctx = new_ctx, 256 & dirty[0] && t_value !== (t_value = ctx[84] + "") && set_data(t, t_value), 
                256 & dirty[0] && div_id_value !== (div_id_value = "skintone-" + ctx[75]) && attr(div, "id", div_id_value), 
                524544 & dirty[0] && div_class_value !== (div_class_value = "emoji hide-focus " + (ctx[75] === ctx[19] ? "active" : "")) && attr(div, "class", div_class_value), 
                524544 & dirty[0] && div_aria_selected_value !== (div_aria_selected_value = ctx[75] === ctx[19]) && attr(div, "aria-selected", div_aria_selected_value), 
                257 & dirty[0] && div_title_value !== (div_title_value = ctx[0].skinTones[ctx[75]]) && attr(div, "title", div_title_value), 
                257 & dirty[0] && div_aria_label_value !== (div_aria_label_value = ctx[0].skinTones[ctx[75]]) && attr(div, "aria-label", div_aria_label_value);
            },
            d(detaching) {
                detaching && detach(div);
            }
        };
    }
    function create_each_block_4(key_1, ctx) {
        let button, div, button_aria_controls_value, button_aria_label_value, button_aria_selected_value, button_title_value, mounted, dispose, raw_value = imageGenerator(ctx[76].name) + "";
        function click_handler() {
            return ctx[53](ctx[76]);
        }
        return {
            key: key_1,
            first: null,
            c() {
                button = picker_element("button"), div = picker_element("div"), attr(div, "class", "nav-emoji emoji"), 
                attr(button, "role", "tab"), attr(button, "class", "nav-button"), attr(button, "aria-controls", button_aria_controls_value = "tab-" + ctx[76].id), 
                attr(button, "aria-label", button_aria_label_value = ctx[0].categories[ctx[76].name]), 
                attr(button, "aria-selected", button_aria_selected_value = !ctx[3] && ctx[11].id === ctx[76].id), 
                attr(button, "title", button_title_value = ctx[0].categories[ctx[76].name]), this.first = button;
            },
            m(target, anchor) {
                insert(target, button, anchor), append(button, div), div.innerHTML = raw_value, 
                mounted || (dispose = listen(button, "click", click_handler), mounted = !0);
            },
            p(new_ctx, dirty) {
                ctx = new_ctx, 1024 & dirty[0] && raw_value !== (raw_value = imageGenerator(ctx[76].name) + "") && (div.innerHTML = raw_value), 
                1024 & dirty[0] && button_aria_controls_value !== (button_aria_controls_value = "tab-" + ctx[76].id) && attr(button, "aria-controls", button_aria_controls_value), 
                1025 & dirty[0] && button_aria_label_value !== (button_aria_label_value = ctx[0].categories[ctx[76].name]) && attr(button, "aria-label", button_aria_label_value), 
                3080 & dirty[0] && button_aria_selected_value !== (button_aria_selected_value = !ctx[3] && ctx[11].id === ctx[76].id) && attr(button, "aria-selected", button_aria_selected_value), 
                1025 & dirty[0] && button_title_value !== (button_title_value = ctx[0].categories[ctx[76].name]) && attr(button, "title", button_title_value);
            },
            d(detaching) {
                detaching && detach(button), mounted = !1, dispose();
            }
        };
    }
    function create_else_block_1(ctx) {
        let img, img_src_value;
        return {
            c() {
                img = picker_element("img"), attr(img, "class", "custom-emoji"), src_url_equal(img.src, img_src_value = ctx[73].url) || attr(img, "src", img_src_value), 
                attr(img, "alt", ""), attr(img, "loading", "lazy");
            },
            m(target, anchor) {
                insert(target, img, anchor);
            },
            p(ctx, dirty) {
                134217728 & dirty[0] && !src_url_equal(img.src, img_src_value = ctx[73].url) && attr(img, "src", img_src_value);
            },
            d(detaching) {
                detaching && detach(img);
            }
        };
    }
    function create_if_block_1(ctx) {
        let t, t_value = ctx[28](ctx[73], ctx[7]) + "";
        return {
            c() {
                t = picker_text(t_value);
            },
            m(target, anchor) {
                insert(target, t, anchor);
            },
            p(ctx, dirty) {
                134217856 & dirty[0] && t_value !== (t_value = ctx[28](ctx[73], ctx[7]) + "") && set_data(t, t_value);
            },
            d(detaching) {
                detaching && detach(t);
            }
        };
    }
    function create_each_block_3(key_1, ctx) {
        let div, button, button_role_value, button_aria_selected_value, button_aria_label_value, button_title_value, button_class_value, button_id_value;
        function select_block_type(ctx, dirty) {
            return ctx[73].unicode ? create_if_block_1 : create_else_block_1;
        }
        let current_block_type = select_block_type(ctx), if_block = current_block_type(ctx);
        return {
            key: key_1,
            first: null,
            c() {
                div = picker_element("div"), button = picker_element("button"), if_block.c(), attr(button, "role", button_role_value = ctx[3] ? "option" : "menuitem"), 
                attr(button, "aria-selected", button_aria_selected_value = ctx[3] ? ctx[75] == ctx[4] : ""), 
                attr(button, "aria-label", button_aria_label_value = ctx[29](ctx[73], ctx[7])), 
                attr(button, "title", button_title_value = ctx[73].title), attr(button, "class", button_class_value = "emoji " + (ctx[3] && ctx[75] === ctx[4] ? "active" : "")), 
                attr(button, "id", button_id_value = "emo-" + ctx[73].id), attr(div, "class", "emoji-wrapper"), 
                this.first = div;
            },
            m(target, anchor) {
                insert(target, div, anchor), append(div, button), if_block.m(button, null);
            },
            p(new_ctx, dirty) {
                current_block_type === (current_block_type = select_block_type(ctx = new_ctx)) && if_block ? if_block.p(ctx, dirty) : (if_block.d(1), 
                if_block = current_block_type(ctx), if_block && (if_block.c(), if_block.m(button, null))), 
                8 & dirty[0] && button_role_value !== (button_role_value = ctx[3] ? "option" : "menuitem") && attr(button, "role", button_role_value), 
                134217752 & dirty[0] && button_aria_selected_value !== (button_aria_selected_value = ctx[3] ? ctx[75] == ctx[4] : "") && attr(button, "aria-selected", button_aria_selected_value), 
                134217856 & dirty[0] && button_aria_label_value !== (button_aria_label_value = ctx[29](ctx[73], ctx[7])) && attr(button, "aria-label", button_aria_label_value), 
                134217728 & dirty[0] && button_title_value !== (button_title_value = ctx[73].title) && attr(button, "title", button_title_value), 
                134217752 & dirty[0] && button_class_value !== (button_class_value = "emoji " + (ctx[3] && ctx[75] === ctx[4] ? "active" : "")) && attr(button, "class", button_class_value), 
                134217728 & dirty[0] && button_id_value !== (button_id_value = "emo-" + ctx[73].id) && attr(button, "id", button_id_value);
            },
            d(detaching) {
                detaching && detach(div), if_block.d();
            }
        };
    }
    function create_each_block_2(key_1, ctx) {
        let div0, t, div0_id_value, div1, div1_role_value, div1_id_value, t_value = (ctx[3] ? ctx[0].searchResultsLabel : ctx[79].category ? ctx[79].category : ctx[13].length > 1 ? ctx[0].categories.custom : ctx[0].categories[ctx[10][ctx[78]].name]) + "", each_blocks = [], each_1_lookup = new Map_1, each_value_3 = ctx[79].emojis;
        const get_key = ctx => ctx[73].id;
        for (let i = 0; i < each_value_3.length; i += 1) {
            let child_ctx = get_each_context_3(ctx, each_value_3, i), key = get_key(child_ctx);
            each_1_lookup.set(key, each_blocks[i] = create_each_block_3(key, child_ctx));
        }
        return {
            key: key_1,
            first: null,
            c() {
                div0 = picker_element("div"), t = picker_text(t_value), div1 = picker_element("div");
                for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].c();
                attr(div0, "id", div0_id_value = ctx[10][ctx[78]].name), attr(div0, "class", "category"), 
                attr(div0, "aria-hidden", "true"), attr(div1, "class", "emoji-menu"), attr(div1, "role", div1_role_value = ctx[3] ? "listbox" : "menu"), 
                attr(div1, "aria-labelledby", "menu-label"), attr(div1, "id", div1_id_value = ctx[3] ? "search-results" : `emoji-menu-${ctx[10][ctx[78]].name}`), 
                this.first = div0;
            },
            m(target, anchor) {
                insert(target, div0, anchor), append(div0, t), insert(target, div1, anchor);
                for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].m(div1, null);
            },
            p(new_ctx, dirty) {
                ctx = new_ctx, 134226953 & dirty[0] && t_value !== (t_value = (ctx[3] ? ctx[0].searchResultsLabel : ctx[79].category ? ctx[79].category : ctx[13].length > 1 ? ctx[0].categories.custom : ctx[0].categories[ctx[10][ctx[78]].name]) + "") && set_data(t, t_value), 
                1024 & dirty[0] && div0_id_value !== (div0_id_value = ctx[10][ctx[78]].name) && attr(div0, "id", div0_id_value), 
                939524248 & dirty[0] && (each_value_3 = ctx[79].emojis, each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_3, each_1_lookup, div1, destroy_block, create_each_block_3, null, get_each_context_3)), 
                8 & dirty[0] && div1_role_value !== (div1_role_value = ctx[3] ? "listbox" : "menu") && attr(div1, "role", div1_role_value), 
                1032 & dirty[0] && div1_id_value !== (div1_id_value = ctx[3] ? "search-results" : `emoji-menu-${ctx[10][ctx[78]].name}`) && attr(div1, "id", div1_id_value);
            },
            d(detaching) {
                detaching && detach(div0), detaching && detach(div1);
                for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].d();
            }
        };
    }
    function create_each_block_1(ctx) {
        let each_1_anchor, each_blocks = [], each_1_lookup = new Map_1, each_value_2 = ctx[76] || [];
        const get_key = ctx => ctx[79].category;
        for (let i = 0; i < each_value_2.length; i += 1) {
            let child_ctx = get_each_context_2(ctx, each_value_2, i), key = get_key(child_ctx);
            each_1_lookup.set(key, each_blocks[i] = create_each_block_2(key, child_ctx));
        }
        return {
            c() {
                for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].c();
                each_1_anchor = picker_text("");
            },
            m(target, anchor) {
                for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].m(target, anchor);
                insert(target, each_1_anchor, anchor);
            },
            p(ctx, dirty) {
                939533465 & dirty[0] && (each_value_2 = ctx[76] || [], each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_2, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block_2, each_1_anchor, get_each_context_2));
            },
            d(detaching) {
                for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].d(detaching);
                detaching && detach(each_1_anchor);
            }
        };
    }
    function create_else_block(ctx) {
        let img, img_src_value;
        return {
            c() {
                img = picker_element("img"), attr(img, "class", "custom-emoji"), src_url_equal(img.src, img_src_value = ctx[73].url) || attr(img, "src", img_src_value), 
                attr(img, "alt", ""), attr(img, "loading", "lazy");
            },
            m(target, anchor) {
                insert(target, img, anchor);
            },
            p(ctx, dirty) {
                512 & dirty[0] && !src_url_equal(img.src, img_src_value = ctx[73].url) && attr(img, "src", img_src_value);
            },
            d(detaching) {
                detaching && detach(img);
            }
        };
    }
    function create_if_block(ctx) {
        let t, t_value = ctx[28](ctx[73], ctx[7]) + "";
        return {
            c() {
                t = picker_text(t_value);
            },
            m(target, anchor) {
                insert(target, t, anchor);
            },
            p(ctx, dirty) {
                640 & dirty[0] && t_value !== (t_value = ctx[28](ctx[73], ctx[7]) + "") && set_data(t, t_value);
            },
            d(detaching) {
                detaching && detach(t);
            }
        };
    }
    function create_each_block(key_1, ctx) {
        let button, button_aria_label_value, button_title_value, button_id_value;
        function select_block_type_1(ctx, dirty) {
            return ctx[73].unicode ? create_if_block : create_else_block;
        }
        let current_block_type = select_block_type_1(ctx), if_block = current_block_type(ctx);
        return {
            key: key_1,
            first: null,
            c() {
                button = picker_element("button"), if_block.c(), attr(button, "role", "menuitem"), 
                attr(button, "aria-label", button_aria_label_value = ctx[29](ctx[73], ctx[7])), 
                attr(button, "title", button_title_value = ctx[73].title), attr(button, "class", "emoji"), 
                attr(button, "id", button_id_value = "fav-" + ctx[73].id), this.first = button;
            },
            m(target, anchor) {
                insert(target, button, anchor), if_block.m(button, null);
            },
            p(new_ctx, dirty) {
                current_block_type === (current_block_type = select_block_type_1(ctx = new_ctx)) && if_block ? if_block.p(ctx, dirty) : (if_block.d(1), 
                if_block = current_block_type(ctx), if_block && (if_block.c(), if_block.m(button, null))), 
                640 & dirty[0] && button_aria_label_value !== (button_aria_label_value = ctx[29](ctx[73], ctx[7])) && attr(button, "aria-label", button_aria_label_value), 
                512 & dirty[0] && button_title_value !== (button_title_value = ctx[73].title) && attr(button, "title", button_title_value), 
                512 & dirty[0] && button_id_value !== (button_id_value = "fav-" + ctx[73].id) && attr(button, "id", button_id_value);
            },
            d(detaching) {
                detaching && detach(button), if_block.d();
            }
        };
    }
    function create_fragment(ctx) {
        let section, div0, div4, div1, input, input_placeholder_value, input_aria_expanded_value, input_aria_activedescendant_value, label, t0, span0, t1, div2, button0, t2, button0_class_value, div2_class_value, span1, t3, div3, div3_class_value, div3_aria_label_value, div3_aria_activedescendant_value, div3_aria_hidden_value, div5, div5_aria_label_value, div7, div6, div8, t4, div8_class_value, div10, div9, div10_class_value, div10_role_value, div10_aria_label_value, div10_id_value, div11, div11_class_value, div11_aria_label_value, button1, section_aria_label_value, mounted, dispose, t0_value = ctx[0].searchLabel + "", t1_value = ctx[0].searchDescription + "", t3_value = ctx[0].skinToneDescription + "", each_blocks_3 = [], each0_lookup = new Map_1, each_blocks_2 = [], each1_lookup = new Map_1, each_blocks = [], each3_lookup = new Map_1, each_value_5 = ctx[8];
        const get_key = ctx => ctx[84];
        for (let i = 0; i < each_value_5.length; i += 1) {
            let child_ctx = get_each_context_5(ctx, each_value_5, i), key = get_key(child_ctx);
            each0_lookup.set(key, each_blocks_3[i] = create_each_block_5(key, child_ctx));
        }
        let each_value_4 = ctx[10];
        const get_key_1 = ctx => ctx[76].id;
        for (let i = 0; i < each_value_4.length; i += 1) {
            let child_ctx = get_each_context_4(ctx, each_value_4, i), key = get_key_1(child_ctx);
            each1_lookup.set(key, each_blocks_2[i] = create_each_block_4(key, child_ctx));
        }
        let each_value_1 = ctx[27] || [], each_blocks_1 = [];
        for (let i = 0; i < each_value_1.length; i += 1) each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
        let each_value = ctx[9];
        const get_key_2 = ctx => ctx[73].id;
        for (let i = 0; i < each_value.length; i += 1) {
            let child_ctx = get_each_context(ctx, each_value, i), key = get_key_2(child_ctx);
            each3_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
        }
        return {
            c() {
                section = picker_element("section"), div0 = picker_element("div"), div4 = picker_element("div"), 
                div1 = picker_element("div"), input = picker_element("input"), label = picker_element("label"), 
                t0 = picker_text(t0_value), span0 = picker_element("span"), t1 = picker_text(t1_value), 
                div2 = picker_element("div"), button0 = picker_element("button"), t2 = picker_text(ctx[20]), 
                span1 = picker_element("span"), t3 = picker_text(t3_value), div3 = picker_element("div");
                for (let i = 0; i < each_blocks_3.length; i += 1) each_blocks_3[i].c();
                div5 = picker_element("div");
                for (let i = 0; i < each_blocks_2.length; i += 1) each_blocks_2[i].c();
                div7 = picker_element("div"), div6 = picker_element("div"), div8 = picker_element("div"), 
                t4 = picker_text(ctx[17]), div10 = picker_element("div"), div9 = picker_element("div");
                for (let i = 0; i < each_blocks_1.length; i += 1) each_blocks_1[i].c();
                div11 = picker_element("div");
                for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].c();
                button1 = picker_element("button"), button1.textContent = "😀", attr(div0, "class", "pad-top"), 
                attr(input, "id", "search"), attr(input, "class", "search"), attr(input, "type", "search"), 
                attr(input, "role", "combobox"), attr(input, "enterkeyhint", "search"), attr(input, "placeholder", input_placeholder_value = ctx[0].searchLabel), 
                attr(input, "autocapitalize", "none"), attr(input, "autocomplete", "off"), attr(input, "spellcheck", "true"), 
                attr(input, "aria-expanded", input_aria_expanded_value = !(!ctx[3] || !ctx[1].length)), 
                attr(input, "aria-controls", "search-results"), attr(input, "aria-owns", "search-results"), 
                attr(input, "aria-describedby", "search-description"), attr(input, "aria-autocomplete", "list"), 
                attr(input, "aria-activedescendant", input_aria_activedescendant_value = ctx[26] ? `emo-${ctx[26]}` : ""), 
                attr(label, "class", "sr-only"), attr(label, "for", "search"), attr(span0, "id", "search-description"), 
                attr(span0, "class", "sr-only"), attr(div1, "class", "search-wrapper"), attr(button0, "id", "skintone-button"), 
                attr(button0, "class", button0_class_value = "emoji " + (ctx[5] ? "hide-focus" : "")), 
                attr(button0, "aria-label", ctx[22]), attr(button0, "title", ctx[22]), attr(button0, "aria-describedby", "skintone-description"), 
                attr(button0, "aria-haspopup", "listbox"), attr(button0, "aria-expanded", ctx[5]), 
                attr(button0, "aria-controls", "skintone-list"), attr(div2, "class", div2_class_value = "skintone-button-wrapper " + (ctx[18] ? "expanded" : "")), 
                attr(span1, "id", "skintone-description"), attr(span1, "class", "sr-only"), attr(div3, "id", "skintone-list"), 
                attr(div3, "class", div3_class_value = "skintone-list " + (ctx[5] ? "" : "hidden no-animate")), 
                set_style(div3, "transform", "translateY(" + (ctx[5] ? 0 : "calc(-1 * var(--num-skintones) * var(--total-emoji-size))") + ")"), 
                attr(div3, "role", "listbox"), attr(div3, "aria-label", div3_aria_label_value = ctx[0].skinTonesLabel), 
                attr(div3, "aria-activedescendant", div3_aria_activedescendant_value = "skintone-" + ctx[19]), 
                attr(div3, "aria-hidden", div3_aria_hidden_value = !ctx[5]), attr(div4, "class", "search-row"), 
                attr(div5, "class", "nav"), attr(div5, "role", "tablist"), set_style(div5, "grid-template-columns", "repeat(" + ctx[10].length + ", 1fr)"), 
                attr(div5, "aria-label", div5_aria_label_value = ctx[0].categoriesLabel), attr(div6, "class", "indicator"), 
                set_style(div6, "transform", "translateX(" + (ctx[23] ? -1 : 1) * ctx[25] * 100 + "%)"), 
                attr(div7, "class", "indicator-wrapper"), attr(div8, "class", div8_class_value = "message " + (ctx[17] ? "" : "gone")), 
                attr(div8, "role", "alert"), attr(div8, "aria-live", "polite"), attr(div10, "class", div10_class_value = "tabpanel " + (!ctx[12] || ctx[17] ? "gone" : "")), 
                attr(div10, "role", div10_role_value = ctx[3] ? "region" : "tabpanel"), attr(div10, "aria-label", div10_aria_label_value = ctx[3] ? ctx[0].searchResultsLabel : ctx[0].categories[ctx[11].name]), 
                attr(div10, "id", div10_id_value = ctx[3] ? "" : `tab-${ctx[11].id}`), attr(div10, "tabindex", "0"), 
                attr(div11, "class", div11_class_value = "favorites emoji-menu gone " + (ctx[17] ? "gone" : "")), 
                attr(div11, "role", "menu"), attr(div11, "aria-label", div11_aria_label_value = ctx[0].favoritesLabel), 
                set_style(div11, "padding-inline-end", ctx[24] + "px"), attr(button1, "aria-hidden", "true"), 
                attr(button1, "tabindex", "-1"), attr(button1, "class", "abs-pos hidden emoji"), 
                attr(section, "class", "picker"), attr(section, "aria-label", section_aria_label_value = ctx[0].regionLabel), 
                attr(section, "style", ctx[21]);
            },
            m(target, anchor) {
                insert(target, section, anchor), append(section, div0), append(section, div4), append(div4, div1), 
                append(div1, input), set_input_value(input, ctx[2]), append(div1, label), append(label, t0), 
                append(div1, span0), append(span0, t1), append(div4, div2), append(div2, button0), 
                append(button0, t2), append(div4, span1), append(span1, t3), append(div4, div3);
                for (let i = 0; i < each_blocks_3.length; i += 1) each_blocks_3[i].m(div3, null);
                ctx[52](div3), append(section, div5);
                for (let i = 0; i < each_blocks_2.length; i += 1) each_blocks_2[i].m(div5, null);
                append(section, div7), append(div7, div6), append(section, div8), append(div8, t4), 
                append(section, div10), append(div10, div9);
                for (let i = 0; i < each_blocks_1.length; i += 1) each_blocks_1[i].m(div9, null);
                ctx[54](div10), append(section, div11);
                for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].m(div11, null);
                var action_result;
                append(section, button1), ctx[56](button1), ctx[57](section), mounted || (dispose = [ listen(input, "input", ctx[51]), listen(input, "keydown", ctx[31]), listen(button0, "click", ctx[37]), listen(div3, "focusout", ctx[40]), listen(div3, "click", ctx[36]), listen(div3, "keydown", ctx[38]), listen(div3, "keyup", ctx[39]), listen(div5, "keydown", ctx[34]), (action_result = ctx[30].call(null, div9), 
                action_result && is_function(action_result.destroy) ? action_result.destroy : noop), listen(div10, "click", ctx[35]), listen(div10, "scroll", ctx[55]), listen(div11, "click", ctx[35]) ], 
                mounted = !0);
            },
            p(ctx, dirty) {
                if (1 & dirty[0] && input_placeholder_value !== (input_placeholder_value = ctx[0].searchLabel) && attr(input, "placeholder", input_placeholder_value), 
                10 & dirty[0] && input_aria_expanded_value !== (input_aria_expanded_value = !(!ctx[3] || !ctx[1].length)) && attr(input, "aria-expanded", input_aria_expanded_value), 
                67108864 & dirty[0] && input_aria_activedescendant_value !== (input_aria_activedescendant_value = ctx[26] ? `emo-${ctx[26]}` : "") && attr(input, "aria-activedescendant", input_aria_activedescendant_value), 
                4 & dirty[0] && set_input_value(input, ctx[2]), 1 & dirty[0] && t0_value !== (t0_value = ctx[0].searchLabel + "") && set_data(t0, t0_value), 
                1 & dirty[0] && t1_value !== (t1_value = ctx[0].searchDescription + "") && set_data(t1, t1_value), 
                1048576 & dirty[0] && set_data(t2, ctx[20]), 32 & dirty[0] && button0_class_value !== (button0_class_value = "emoji " + (ctx[5] ? "hide-focus" : "")) && attr(button0, "class", button0_class_value), 
                4194304 & dirty[0] && attr(button0, "aria-label", ctx[22]), 4194304 & dirty[0] && attr(button0, "title", ctx[22]), 
                32 & dirty[0] && attr(button0, "aria-expanded", ctx[5]), 262144 & dirty[0] && div2_class_value !== (div2_class_value = "skintone-button-wrapper " + (ctx[18] ? "expanded" : "")) && attr(div2, "class", div2_class_value), 
                1 & dirty[0] && t3_value !== (t3_value = ctx[0].skinToneDescription + "") && set_data(t3, t3_value), 
                524545 & dirty[0] && (each_value_5 = ctx[8], each_blocks_3 = update_keyed_each(each_blocks_3, dirty, get_key, 1, ctx, each_value_5, each0_lookup, div3, destroy_block, create_each_block_5, null, get_each_context_5)), 
                32 & dirty[0] && div3_class_value !== (div3_class_value = "skintone-list " + (ctx[5] ? "" : "hidden no-animate")) && attr(div3, "class", div3_class_value), 
                32 & dirty[0] && set_style(div3, "transform", "translateY(" + (ctx[5] ? 0 : "calc(-1 * var(--num-skintones) * var(--total-emoji-size))") + ")"), 
                1 & dirty[0] && div3_aria_label_value !== (div3_aria_label_value = ctx[0].skinTonesLabel) && attr(div3, "aria-label", div3_aria_label_value), 
                524288 & dirty[0] && div3_aria_activedescendant_value !== (div3_aria_activedescendant_value = "skintone-" + ctx[19]) && attr(div3, "aria-activedescendant", div3_aria_activedescendant_value), 
                32 & dirty[0] && div3_aria_hidden_value !== (div3_aria_hidden_value = !ctx[5]) && attr(div3, "aria-hidden", div3_aria_hidden_value), 
                3081 & dirty[0] | 2 & dirty[1] && (each_value_4 = ctx[10], each_blocks_2 = update_keyed_each(each_blocks_2, dirty, get_key_1, 1, ctx, each_value_4, each1_lookup, div5, destroy_block, create_each_block_4, null, get_each_context_4)), 
                1024 & dirty[0] && set_style(div5, "grid-template-columns", "repeat(" + ctx[10].length + ", 1fr)"), 
                1 & dirty[0] && div5_aria_label_value !== (div5_aria_label_value = ctx[0].categoriesLabel) && attr(div5, "aria-label", div5_aria_label_value), 
                41943040 & dirty[0] && set_style(div6, "transform", "translateX(" + (ctx[23] ? -1 : 1) * ctx[25] * 100 + "%)"), 
                131072 & dirty[0] && set_data(t4, ctx[17]), 131072 & dirty[0] && div8_class_value !== (div8_class_value = "message " + (ctx[17] ? "" : "gone")) && attr(div8, "class", div8_class_value), 
                939533465 & dirty[0]) {
                    let i;
                    for (each_value_1 = ctx[27] || [], i = 0; i < each_value_1.length; i += 1) {
                        const child_ctx = get_each_context_1(ctx, each_value_1, i);
                        each_blocks_1[i] ? each_blocks_1[i].p(child_ctx, dirty) : (each_blocks_1[i] = create_each_block_1(child_ctx), 
                        each_blocks_1[i].c(), each_blocks_1[i].m(div9, null));
                    }
                    for (;i < each_blocks_1.length; i += 1) each_blocks_1[i].d(1);
                    each_blocks_1.length = each_value_1.length;
                }
                135168 & dirty[0] && div10_class_value !== (div10_class_value = "tabpanel " + (!ctx[12] || ctx[17] ? "gone" : "")) && attr(div10, "class", div10_class_value), 
                8 & dirty[0] && div10_role_value !== (div10_role_value = ctx[3] ? "region" : "tabpanel") && attr(div10, "role", div10_role_value), 
                2057 & dirty[0] && div10_aria_label_value !== (div10_aria_label_value = ctx[3] ? ctx[0].searchResultsLabel : ctx[0].categories[ctx[11].name]) && attr(div10, "aria-label", div10_aria_label_value), 
                2056 & dirty[0] && div10_id_value !== (div10_id_value = ctx[3] ? "" : `tab-${ctx[11].id}`) && attr(div10, "id", div10_id_value), 
                805307008 & dirty[0] && (each_value = ctx[9], each_blocks = update_keyed_each(each_blocks, dirty, get_key_2, 1, ctx, each_value, each3_lookup, div11, destroy_block, create_each_block, null, get_each_context)), 
                131072 & dirty[0] && div11_class_value !== (div11_class_value = "favorites emoji-menu gone " + (ctx[17] ? "gone" : "")) && attr(div11, "class", div11_class_value), 
                1 & dirty[0] && div11_aria_label_value !== (div11_aria_label_value = ctx[0].favoritesLabel) && attr(div11, "aria-label", div11_aria_label_value), 
                16777216 & dirty[0] && set_style(div11, "padding-inline-end", ctx[24] + "px"), 1 & dirty[0] && section_aria_label_value !== (section_aria_label_value = ctx[0].regionLabel) && attr(section, "aria-label", section_aria_label_value), 
                2097152 & dirty[0] && attr(section, "style", ctx[21]);
            },
            i: noop,
            o: noop,
            d(detaching) {
                detaching && detach(section);
                for (let i = 0; i < each_blocks_3.length; i += 1) each_blocks_3[i].d();
                ctx[52](null);
                for (let i = 0; i < each_blocks_2.length; i += 1) each_blocks_2[i].d();
                !function(iterations, detaching) {
                    for (let i = 0; i < iterations.length; i += 1) iterations[i] && iterations[i].d(detaching);
                }(each_blocks_1, detaching), ctx[54](null);
                for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].d();
                ctx[56](null), ctx[57](null), mounted = !1, run_all(dispose);
            }
        };
    }
    function imageGenerator(icon) {
        return `<img class="${"recents" !== icon ? "category-img" : "category-img current"}" id=${`${icon}-img`} src=${`chrome-extension://oocalimimngaihdkbihfgmpkcpnmlaoa/img/emoji_categories/icon_emoji_${icon}.svg`} >`;
    }
    function instance($$self, $$props, $$invalidate) {
        let rootElement, baselineEmoji, tabpanelElement, message, skinToneDropdown, skinToneButtonText, pickerStyle, defaultFavoriteEmojis, activeSearchItemId, FREQUENTLY_USED, {skinToneEmoji} = $$props, {i18n} = $$props, {database} = $$props, {customEmoji} = $$props, {customCategorySorting} = $$props, currentEmojis = [], currentEmojisWithCategories = [], allCategorizedEmojis = [], rawSearchText = "", searchText = "", searchMode = !1, activeSearchItem = -1, skinTonePickerExpanded = !1, skinTonePickerExpandedAfterAnimation = !1, currentSkinTone = 0, activeSkinTone = 0, skinToneButtonLabel = "", skinTones = [], currentFavorites = [], numColumns = 8, isRtl = !1, scrollbarWidth = 0, currentGroupIndex = 0, groups$1 = groups, currentGroup = groups$1[0], scrollIndex = 0, databaseLoaded = !1, allEmojis = [];
        window.addEventListener("message", (function(e) {
            e.data && "TP_FREQ_USED" === e.data.type && rAF((() => {
                FREQUENTLY_USED = e.data.data;
            }));
        })), window.postMessage("TP_EMOJI_REQ_RELOAD");
        const focus = id => {
            rootElement.getRootNode().getElementById(id).focus();
        }, fireEvent = (name, detail) => {
            rootElement.dispatchEvent(new CustomEvent(name, {
                detail,
                bubbles: !0,
                composed: !0
            }));
        }, unicodeWithSkin = (emoji, currentSkinTone) => currentSkinTone && emoji.skins && emoji.skins[currentSkinTone] || emoji.unicode, isSkinToneOption = element => /^skintone-/.test(element.id);
        function checkZwjSupportAndUpdate(zwjEmojisToCheck) {
            const rootNode = rootElement.getRootNode();
            !function(zwjEmojisToCheck, baselineEmoji, emojiToDomNode) {
                for (const emoji of zwjEmojisToCheck) {
                    const emojiWidth = calculateTextWidth(emojiToDomNode(emoji));
                    void 0 === baselineEmojiWidth && (baselineEmojiWidth = calculateTextWidth(baselineEmoji));
                    const supported = emojiWidth / 1.8 < baselineEmojiWidth;
                    supportedZwjEmojis.set(emoji.unicode, supported);
                }
            }(zwjEmojisToCheck, baselineEmoji, (emoji => rootNode.getElementById(`emo-${emoji.id}`))), 
            $$invalidate(1, currentEmojis = currentEmojis), $$invalidate(46, allCategorizedEmojis), 
            $$invalidate(12, databaseLoaded), $$invalidate(47, searchText), $$invalidate(11, currentGroup), 
            $$invalidate(10, groups$1), $$invalidate(1, currentEmojis), $$invalidate(3, searchMode), 
            $$invalidate(0, i18n), $$invalidate(41, database), $$invalidate(2, rawSearchText), 
            $$invalidate(50, currentGroupIndex), $$invalidate(43, customEmoji);
        }
        function isZwjSupported(emoji) {
            return !emoji.unicode || !hasZwj(emoji) || supportedZwjEmojis.get(emoji.unicode);
        }
        function filterEmojisByVersion(emojis) {
            return picker_awaiter(this, void 0, void 0, (function*() {
                const emojiSupportLevel = yield emojiSupportLevelPromise;
                return emojis.filter((({version}) => !version || version <= emojiSupportLevel));
            }));
        }
        function summarizeEmojis(emojis) {
            return picker_awaiter(this, void 0, void 0, (function*() {
                return function(emojis, emojiSupportLevel) {
                    const toSimpleSkinsMap = skins => {
                        const res = {};
                        for (const skin of skins) "number" == typeof skin.tone && skin.version <= emojiSupportLevel && (res[skin.tone] = skin.unicode);
                        return res;
                    };
                    return emojis.map((({unicode, skins, shortcodes, url, name, category}) => ({
                        unicode,
                        name,
                        shortcodes,
                        url,
                        category,
                        id: unicode || name,
                        skins: skins && toSimpleSkinsMap(skins),
                        title: (shortcodes || []).join(", ")
                    })));
                }(emojis, yield emojiSupportLevelPromise);
            }));
        }
        function getEmojisByGroup(group) {
            return picker_awaiter(this, void 0, void 0, (function*() {
                if (yield function() {
                    return picker_awaiter(this, void 0, void 0, (function*() {
                        if (FREQUENTLY_USED) return;
                        const freqUsed = (yield Promise.all(DEFAULT_FREQUENTLY_USED.map((unicode => database.getEmojiByUnicodeOrName(unicode))))).filter(Boolean);
                        FREQUENTLY_USED || (FREQUENTLY_USED = freqUsed);
                    }));
                }(), void 0 === group) return [];
                let emoji = -1 === group ? customEmoji : yield database.getEmojiByGroup(group);
                return 0 === group && (emoji = emoji.concat(yield database.getEmojiByGroup(1))), 
                10 === group && (emoji = FREQUENTLY_USED), summarizeEmojis(yield filterEmojisByVersion(emoji));
            }));
        }
        function onNavClick(group) {
            return picker_awaiter(this, void 0, void 0, (function*() {
                $$invalidate(2, rawSearchText = ""), $$invalidate(47, searchText = ""), $$invalidate(4, activeSearchItem = -1), 
                $$invalidate(25, scrollIndex = groups$1.findIndex((_ => _.id === group.id))), $$invalidate(50, currentGroupIndex = scrollIndex), 
                yield tick(), setTimeout((() => {
                    const rootNode = rootElement.getRootNode();
                    rootNode.querySelectorAll(".category-img").forEach((element => {
                        element.classList.remove("current");
                    })), rootNode.getElementById(`${group.name}-img`).classList.add("current");
                    var target = rootNode.getElementById(`${groups$1[scrollIndex].name}`);
                    target.offsetParent.scrollTop = target.offsetTop;
                }), 50);
            }));
        }
        function navScroll() {
            if (searchMode) return;
            const rootNode = rootElement.getRootNode(), mainNav = rootNode.querySelectorAll(".category-img");
            let fromTop = (tabpanelElement || {}).scrollTop;
            mainNav.forEach(((nav, index) => {
                const currentSelectorIndex = index, currentGroupName = groups$1[currentSelectorIndex].name, correspondingButton = rootNode.getElementById(`${currentGroupName}`), emojiHeight = rootNode.getElementById(`emoji-menu-${currentGroupName}`);
                correspondingButton && correspondingButton.offsetTop <= fromTop && correspondingButton.offsetTop + emojiHeight.offsetHeight + correspondingButton.offsetHeight - 5 > fromTop && (mainNav.forEach((element => {
                    element.classList.remove("current");
                })), nav.classList.add("current"), $$invalidate(25, scrollIndex = currentSelectorIndex), 
                $$invalidate(50, currentGroupIndex = scrollIndex));
            }));
        }
        function clickEmoji(unicodeOrName) {
            return picker_awaiter(this, void 0, void 0, (function*() {
                const emoji = yield database.getEmojiByUnicodeOrName(unicodeOrName);
                let emojiSummary;
                for (const currEmoji of allCategorizedEmojis) if (emojiSummary = currEmoji.find((_ => _.id === unicodeOrName)), 
                emojiSummary) break;
                const skinTonedUnicode = emojiSummary.unicode && unicodeWithSkin(emojiSummary, currentSkinTone);
                yield database.incrementFavoriteEmojiCount(unicodeOrName), fireEvent("emoji-click", Object.assign(Object.assign({
                    emoji,
                    skinTone: currentSkinTone
                }, skinTonedUnicode && {
                    unicode: skinTonedUnicode
                }), emojiSummary.name && {
                    name: emojiSummary.name
                })), $$invalidate(50, currentGroupIndex = scrollIndex);
            }));
        }
        function onSkinToneOptionsClick(event) {
            return picker_awaiter(this, void 0, void 0, (function*() {
                const {target} = event;
                if (!isSkinToneOption(target)) return;
                halt(event);
                const skinTone = parseInt(target.id.slice(9), 10);
                $$invalidate(7, currentSkinTone = skinTone), $$invalidate(5, skinTonePickerExpanded = !1), 
                focus("skintone-button"), fireEvent("skin-tone-change", {
                    skinTone
                }), database.setPreferredSkinTone(skinTone);
            }));
        }
        emojiSupportLevelPromise.then((level => {
            level || $$invalidate(17, message = i18n.emojiUnsupportedMessage);
        }));
        return $$self.$$set = $$props => {
            "skinToneEmoji" in $$props && $$invalidate(42, skinToneEmoji = $$props.skinToneEmoji), 
            "i18n" in $$props && $$invalidate(0, i18n = $$props.i18n), "database" in $$props && $$invalidate(41, database = $$props.database), 
            "customEmoji" in $$props && $$invalidate(43, customEmoji = $$props.customEmoji), 
            "customCategorySorting" in $$props && $$invalidate(44, customCategorySorting = $$props.customCategorySorting);
        }, $$self.$$.update = () => {
            if (5120 & $$self.$$.dirty[1] && customEmoji && database && $$invalidate(41, database.customEmoji = customEmoji, database), 
            1 & $$self.$$.dirty[0] | 1024 & $$self.$$.dirty[1]) {
                function handleDatabaseLoading() {
                    return picker_awaiter(this, void 0, void 0, (function*() {
                        let showingLoadingMessage = !1;
                        const timeoutHandle = setTimeout((() => {
                            showingLoadingMessage = !0, $$invalidate(17, message = i18n.loadingMessage);
                        }), 1e3);
                        try {
                            yield database.ready(), $$invalidate(12, databaseLoaded = !0);
                        } catch (err) {
                            console.error(err), $$invalidate(17, message = i18n.networkErrorMessage);
                        } finally {
                            clearTimeout(timeoutHandle), showingLoadingMessage && (showingLoadingMessage = !1, 
                            $$invalidate(17, message = ""));
                        }
                    }));
                }
                database && handleDatabaseLoading();
            }
            if (1024 & $$self.$$.dirty[0] | 4096 & $$self.$$.dirty[1] && (customEmoji && customEmoji.length ? $$invalidate(10, groups$1 = [ customGroup, ...groups ]) : groups$1 !== groups && $$invalidate(10, groups$1 = groups)), 
            4 & $$self.$$.dirty[0] && rIC((() => {
                $$invalidate(47, searchText = (rawSearchText || "").trim()), $$invalidate(4, activeSearchItem = -1);
            })), 1024 & $$self.$$.dirty[0] | 524288 & $$self.$$.dirty[1] && $$invalidate(11, currentGroup = groups$1[currentGroupIndex]), 
            7168 & $$self.$$.dirty[0] | 65536 & $$self.$$.dirty[1]) {
                function updateEmojis() {
                    return picker_awaiter(this, void 0, void 0, (function*() {
                        if (databaseLoaded) {
                            if (searchText.length >= 2) {
                                $$invalidate(3, searchMode = !0);
                                const currentSearchText = searchText, newEmojis = yield function(query) {
                                    return picker_awaiter(this, void 0, void 0, (function*() {
                                        return summarizeEmojis(yield filterEmojisByVersion(yield database.getEmojiBySearchQuery(query)));
                                    }));
                                }(currentSearchText);
                                currentSearchText === searchText && ($$invalidate(1, currentEmojis = newEmojis), 
                                $$invalidate(46, allCategorizedEmojis = [ newEmojis ]), $$invalidate(27, allEmojis = [ newEmojis ]));
                            } else if (currentGroup) {
                                currentGroup.id;
                                const recents = yield getEmojisByGroup(10), newEmojis = yield function() {
                                    return picker_awaiter(this, void 0, void 0, (function*() {
                                        const recentEmojis = window.sessionStorage.getItem("FREQUENTLY_USED");
                                        if (!recentEmojis || JSON.parse(recentEmojis), "undefined" == typeof group) return [];
                                        let emoji = [];
                                        emoji = emoji.concat(FREQUENTLY_USED);
                                        for (let i = 1; i < groups$1.length; i++) emoji = emoji.concat(yield database.getEmojiByGroup(groups$1[i].id));
                                        return summarizeEmojis(yield filterEmojisByVersion(emoji));
                                    }));
                                }();
                                let tempEmojis = [];
                                tempEmojis[0] = recents;
                                for (let i = 1; i < groups$1.length; i++) {
                                    const categoryID = groups$1[i].id, newEmojis = yield getEmojisByGroup(categoryID);
                                    tempEmojis[i] = newEmojis;
                                }
                                $$invalidate(46, allCategorizedEmojis = tempEmojis), $$invalidate(1, currentEmojis = recents.concat(newEmojis)), 
                                $$invalidate(3, searchMode = !1);
                            }
                        } else $$invalidate(1, currentEmojis = []), $$invalidate(46, allCategorizedEmojis = []), 
                        $$invalidate(3, searchMode = !1);
                    }));
                }
                updateEmojis();
            }
            if (1032 & $$self.$$.dirty[0] && $$invalidate(21, pickerStyle = `\n  --font-family: ${FONT_FAMILY};\n  --num-groups: ${groups$1.length}; \n  --indicator-opacity: ${searchMode ? 0 : 1}; \n  --num-skintones: 6;`), 
            4096 & $$self.$$.dirty[0] | 1024 & $$self.$$.dirty[1]) {
                function updatePreferredSkinTone() {
                    return picker_awaiter(this, void 0, void 0, (function*() {
                        databaseLoaded && $$invalidate(7, currentSkinTone = yield database.getPreferredSkinTone());
                    }));
                }
                updatePreferredSkinTone();
            }
            if (2048 & $$self.$$.dirty[1] && $$invalidate(8, skinTones = Array(6).fill().map(((_, i) => function(str, skinTone) {
                if (0 === skinTone) return str;
                const zwjIndex = str.indexOf("‍");
                return -1 !== zwjIndex ? str.substring(0, zwjIndex) + String.fromCodePoint(127995 + skinTone - 1) + str.substring(zwjIndex) : (str.endsWith("️") && (str = str.substring(0, str.length - 1)), 
                str + "\ud83c" + String.fromCodePoint(57339 + skinTone - 1));
            }(skinToneEmoji, i)))), 384 & $$self.$$.dirty[0] && $$invalidate(20, skinToneButtonText = skinTones[currentSkinTone]), 
            129 & $$self.$$.dirty[0] && $$invalidate(22, skinToneButtonLabel = i18n.skinToneLabel.replace("{skinTone}", i18n.skinTones[currentSkinTone])), 
            4096 & $$self.$$.dirty[0] | 1024 & $$self.$$.dirty[1]) {
                function updateDefaultFavoriteEmojis() {
                    return picker_awaiter(this, void 0, void 0, (function*() {
                        $$invalidate(48, defaultFavoriteEmojis = (yield Promise.all(MOST_COMMONLY_USED_EMOJI.map((unicode => database.getEmojiByUnicodeOrName(unicode))))).filter(Boolean));
                    }));
                }
                databaseLoaded && updateDefaultFavoriteEmojis();
            }
            if (4096 & $$self.$$.dirty[0] | 394240 & $$self.$$.dirty[1]) {
                function updateFavorites() {
                    return picker_awaiter(this, void 0, void 0, (function*() {
                        const dbFavorites = yield database.getTopFavoriteEmoji(numColumns), favorites = yield summarizeEmojis(picker_uniqBy([ ...dbFavorites, ...defaultFavoriteEmojis ], (_ => _.unicode || _.name)).slice(0, numColumns));
                        $$invalidate(9, currentFavorites = favorites);
                    }));
                }
                databaseLoaded && defaultFavoriteEmojis && updateFavorites();
            }
            if (10 & $$self.$$.dirty[0] | 32768 & $$self.$$.dirty[1]) {
                const zwjEmojisToCheck = currentEmojis.filter((emoji => emoji.unicode)).filter((emoji => hasZwj(emoji) && !supportedZwjEmojis.has(emoji.unicode))), AllEmojisToCheck = allCategorizedEmojis.map((a => a.filter((emoji => emoji.unicode)).filter((emoji => hasZwj(emoji) && !supportedZwjEmojis.has(emoji.unicode)))));
                zwjEmojisToCheck.length ? (searchMode || rAF((() => AllEmojisToCheck.forEach((a => checkZwjSupportAndUpdate(a))))), 
                rAF((() => checkZwjSupportAndUpdate(zwjEmojisToCheck)))) : ($$invalidate(1, currentEmojis = currentEmojis.filter(isZwjSupported)), 
                $$invalidate(46, allCategorizedEmojis = allCategorizedEmojis.map((a => a.filter(isZwjSupported)))), 
                rAF((() => {})));
            }
            if ($$self.$$.dirty[0], $$self.$$.dirty[1], 10 & $$self.$$.dirty[0] | 8192 & $$self.$$.dirty[1]) {
                function calculateCurrentEmojisWithCategories() {
                    if (searchMode) return [ {
                        category: "",
                        emojis: currentEmojis
                    } ];
                    const categoriesToEmoji = new Map;
                    for (const emoji of currentEmojis) {
                        const category = emoji.category || "";
                        let emojis = categoriesToEmoji.get(category);
                        emojis || (emojis = [], categoriesToEmoji.set(category, emojis)), emojis.push(emoji);
                    }
                    return [ ...categoriesToEmoji.entries() ].map((([category, emojis]) => ({
                        category,
                        emojis
                    }))).sort(((a, b) => customCategorySorting(a.category, b.category)));
                }
                $$invalidate(13, currentEmojisWithCategories = calculateCurrentEmojisWithCategories());
            }
            if (10 & $$self.$$.dirty[0] | 40960 & $$self.$$.dirty[1]) {
                function calculateAllEmojisWithCategories(emoji_iter) {
                    if (searchMode) return [ {
                        category: "",
                        emojis: currentEmojis
                    } ];
                    const categoriesToEmoji = new Map;
                    for (const emoji of emoji_iter) {
                        const category = emoji.category || "";
                        let emojis = categoriesToEmoji.get(category);
                        emojis || (emojis = [], categoriesToEmoji.set(category, emojis)), emojis.push(emoji);
                    }
                    return [ ...categoriesToEmoji.entries() ].map((([category, emojis]) => ({
                        category,
                        emojis
                    }))).sort(((a, b) => customCategorySorting(a.category, b.category)));
                }
                allCategorizedEmojis.map(((emoji_iter, index) => $$invalidate(27, allEmojis[index] = calculateAllEmojisWithCategories(emoji_iter), allEmojis)));
            }
            18 & $$self.$$.dirty[0] && $$invalidate(26, activeSearchItemId = -1 !== activeSearchItem && currentEmojis[activeSearchItem].id), 
            96 & $$self.$$.dirty[0] && (skinTonePickerExpanded ? skinToneDropdown.addEventListener("transitionend", (() => {
                $$invalidate(18, skinTonePickerExpandedAfterAnimation = !0);
            }), {
                once: !0
            }) : $$invalidate(18, skinTonePickerExpandedAfterAnimation = !1));
        }, [ i18n, currentEmojis, rawSearchText, searchMode, activeSearchItem, skinTonePickerExpanded, skinToneDropdown, currentSkinTone, skinTones, currentFavorites, groups$1, currentGroup, databaseLoaded, currentEmojisWithCategories, rootElement, baselineEmoji, tabpanelElement, message, skinTonePickerExpandedAfterAnimation, activeSkinTone, skinToneButtonText, pickerStyle, skinToneButtonLabel, isRtl, scrollbarWidth, scrollIndex, activeSearchItemId, allEmojis, unicodeWithSkin, (emoji, currentSkinTone) => {
            return (arr = [ emoji.name || unicodeWithSkin(emoji, currentSkinTone), ...emoji.shortcodes || [] ], 
            picker_uniqBy(arr, (_ => _))).join(", ");
            var arr;
        }, function(node) {
            return function(node, onUpdate) {
                let resizeObserver;
                return resizeObserverSupported ? (resizeObserver = new ResizeObserver((entries => onUpdate(entries[0].contentRect.width))), 
                resizeObserver.observe(node)) : rAF((() => onUpdate(node.getBoundingClientRect().width))), 
                {
                    destroy() {
                        resizeObserver && resizeObserver.disconnect();
                    }
                };
            }(node, (width => {
                {
                    const style = getComputedStyle(rootElement), newNumColumns = parseInt(style.getPropertyValue("--num-columns"), 10), newIsRtl = "rtl" === style.getPropertyValue("direction"), newScrollbarWidth = node.parentElement.getBoundingClientRect().width - width;
                    $$invalidate(49, numColumns = newNumColumns), $$invalidate(24, scrollbarWidth = newScrollbarWidth), 
                    $$invalidate(23, isRtl = newIsRtl);
                }
            }));
        }, function(event) {
            if (!searchMode || !currentEmojis.length) return;
            const goToNextOrPrevious = previous => {
                halt(event), $$invalidate(4, activeSearchItem = incrementOrDecrement(previous, activeSearchItem, currentEmojis));
            };
            switch (event.key) {
              case "ArrowDown":
                return goToNextOrPrevious(!1);

              case "ArrowUp":
                return goToNextOrPrevious(!0);

              case "Enter":
                if (-1 !== activeSearchItem) return halt(event), clickEmoji(currentEmojis[activeSearchItem].id);
                currentEmojis.length && $$invalidate(4, activeSearchItem = 0);
            }
        }, onNavClick, navScroll, function(event) {
            const {target, key} = event, doFocus = el => {
                el && (halt(event), el.focus());
            };
            switch (key) {
              case "ArrowLeft":
                return doFocus(target.previousSibling);

              case "ArrowRight":
                return doFocus(target.nextSibling);

              case "Home":
                return doFocus(target.parentElement.firstChild);

              case "End":
                return doFocus(target.parentElement.lastChild);
            }
        }, function(event) {
            return picker_awaiter(this, void 0, void 0, (function*() {
                const {target} = event;
                if (!target.classList.contains("emoji")) return;
                halt(event);
                clickEmoji(target.id.substring(4));
            }));
        }, onSkinToneOptionsClick, function(event) {
            return picker_awaiter(this, void 0, void 0, (function*() {
                $$invalidate(5, skinTonePickerExpanded = !skinTonePickerExpanded), $$invalidate(19, activeSkinTone = currentSkinTone), 
                skinTonePickerExpanded && (halt(event), rAF((() => focus(`skintone-${activeSkinTone}`))));
            }));
        }, function(event) {
            if (!skinTonePickerExpanded) return;
            const changeActiveSkinTone = nextSkinTone => picker_awaiter(this, void 0, void 0, (function*() {
                halt(event), $$invalidate(19, activeSkinTone = nextSkinTone), yield tick(), focus(`skintone-${activeSkinTone}`);
            }));
            switch (event.key) {
              case "ArrowUp":
                return changeActiveSkinTone(incrementOrDecrement(!0, activeSkinTone, skinTones));

              case "ArrowDown":
                return changeActiveSkinTone(incrementOrDecrement(!1, activeSkinTone, skinTones));

              case "Home":
                return changeActiveSkinTone(0);

              case "End":
                return changeActiveSkinTone(skinTones.length - 1);

              case "Enter":
                return onSkinToneOptionsClick(event);

              case "Escape":
                return halt(event), $$invalidate(5, skinTonePickerExpanded = !1), focus("skintone-button");
            }
        }, function(event) {
            if (skinTonePickerExpanded) return " " === event.key ? onSkinToneOptionsClick(event) : void 0;
        }, function(event) {
            return picker_awaiter(this, void 0, void 0, (function*() {
                const {relatedTarget} = event;
                relatedTarget && isSkinToneOption(relatedTarget) || $$invalidate(5, skinTonePickerExpanded = !1);
            }));
        }, database, skinToneEmoji, customEmoji, customCategorySorting, !0, allCategorizedEmojis, searchText, defaultFavoriteEmojis, numColumns, currentGroupIndex, function() {
            rawSearchText = this.value, $$invalidate(2, rawSearchText);
        }, function($$value) {
            binding_callbacks[$$value ? "unshift" : "push"]((() => {
                skinToneDropdown = $$value, $$invalidate(6, skinToneDropdown);
            }));
        }, group => onNavClick(group), function($$value) {
            binding_callbacks[$$value ? "unshift" : "push"]((() => {
                tabpanelElement = $$value, $$invalidate(16, tabpanelElement);
            }));
        }, () => navScroll(), function($$value) {
            binding_callbacks[$$value ? "unshift" : "push"]((() => {
                baselineEmoji = $$value, $$invalidate(15, baselineEmoji);
            }));
        }, function($$value) {
            binding_callbacks[$$value ? "unshift" : "push"]((() => {
                rootElement = $$value, $$invalidate(14, rootElement);
            }));
        } ];
    }
    class Picker extends class {
        $destroy() {
            !function(component, detaching) {
                const $$ = component.$$;
                null !== $$.fragment && (run_all($$.on_destroy), $$.fragment && $$.fragment.d(detaching), 
                $$.on_destroy = $$.fragment = null, $$.ctx = []);
            }(this, 1), this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
            return callbacks.push(callback), () => {
                const index = callbacks.indexOf(callback);
                -1 !== index && callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            var obj;
            this.$$set && (obj = $$props, 0 !== Object.keys(obj).length) && (this.$$.skip_bound = !0, 
            this.$$set($$props), this.$$.skip_bound = !1);
        }
    } {
        constructor(options) {
            super(), init(this, options, instance, create_fragment, safe_not_equal, {
                skinToneEmoji: 42,
                i18n: 0,
                database: 41,
                customEmoji: 43,
                customCategorySorting: 44
            }, null, [ -1, -1, -1 ]);
        }
    }
    var enI18n = {
        categoriesLabel: "Categories",
        emojiUnsupportedMessage: "Your browser does not support color emoji.",
        favoritesLabel: "Favorites",
        loadingMessage: "Loading…",
        networkErrorMessage: "Could not load emoji.",
        regionLabel: "Emoji picker",
        searchDescription: "When search results are available, press up or down to select and enter to choose.",
        searchLabel: "Search",
        searchResultsLabel: "Search results",
        skinToneDescription: "When expanded, press up or down to select and enter to choose.",
        skinToneLabel: "Choose a skin tone (currently {skinTone})",
        skinTonesLabel: "Skin tones",
        skinTones: [ "Default", "Light", "Medium-Light", "Medium", "Medium-Dark", "Dark" ],
        categories: {
            custom: "Custom",
            smileys: "Smileys and emoticons",
            people: "People and body",
            leaf: "Animals and nature",
            food: "Food and drink",
            places: "Travel and places",
            activities: "Activities",
            objects: "Objects",
            symbols: "Symbols",
            flag: "Flags",
            recents: "Frequently Used"
        }
    };
    const PROPS = [ "customEmoji", "customCategorySorting", "database", "dataSource", "i18n", "locale", "skinToneEmoji" ];
    class PickerElement extends HTMLElement {
        constructor(props) {
            super(), this.attachShadow({
                mode: "open"
            });
            const style = document.createElement("style");
            style.textContent = ':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.dark),:host(.light){--button-active-background:#555555;--button-hover-background:#484848;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef}@media (prefers-color-scheme:dark){:host{--button-active-background:#555555;--button-hover-background:#484848;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);width:100%;height:100%;overflow:hidden;--total-emoji-size:32px;--total-category-emoji-size:24px}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}::-webkit-scrollbar{width:0}::-webkit-scrollbar-thumb{background:#ef3e3a;border-radius:10px}.skintone-button-wrapper{background:var(--background);z-index:3;user-select:none;-webkit-user-select:none}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;background:var(--background);border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%;user-select:none;row-gap:8px;-webkit-user-select:none}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color);letter-spacing:1px;padding-top:16px;padding-bottom:8px;text-transform:uppercase;font-weight:600}.emoji-wrapper:hover{transform:scale(1.05)}.custom-emoji,.emoji,button.emoji{height:var(--total-emoji-size);width:var(--total-emoji-size)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;line-height:1;overflow:hidden;font-family:"Poppins",sans-serif;cursor:pointer;background:0 0;transition:.1s ease;transform:scale(1);backface-visibility:hidden;--webkit-backface-visibility:hidden}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{transform:scale(1.05);border-radius:4px;background:#f0f0f01c}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.custom-emoji{padding:var(--emoji-padding);object-fit:contain;pointer-events:none;background-repeat:no-repeat;background-position:center center;background-size:var(--emoji-size) var(--emoji-size)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content;height:32px}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.category-img{width:60%;height:60%;opacity:.5}.category-img.current,.category-img:hover{opacity:1}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background:linear-gradient(91.19deg,#ef3e3a 0,#ef3e3a .01%,#9e55a0 100%);will-change:transform,opacity;transition:opacity .1s linear,transform .02s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top{width:100%;height:var(--emoji-padding);z-index:3;background:var(--background)}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);background:#0a0a0a;color:var(--input-font-color);width:216px;font-size:var(--input-font-size);font-family:"Poppins",sans-serif;line-height:var(--input-line-height)}input.search::placeholder{color:#5a5a5a}input.search:focus{outline-color:#5a5a5a}input.search::-webkit-search-cancel-button{display:none}.favorites{display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}', 
            this.shadowRoot.appendChild(style), this._ctx = Object.assign({
                locale: "en",
                dataSource: "chrome-extension://oocalimimngaihdkbihfgmpkcpnmlaoa/lib/tp_emoji/emoji-picker.json",
                skinToneEmoji: "👋",
                customCategorySorting: DEFAULT_CATEGORY_SORTING,
                customEmoji: null,
                i18n: enI18n
            }, props);
            for (const prop of PROPS) "database" !== prop && Object.prototype.hasOwnProperty.call(this, prop) && (this._ctx[prop] = this[prop], 
            delete this[prop]);
            this._dbFlush();
        }
        connectedCallback() {
            this._cmp = new Picker({
                target: this.shadowRoot,
                props: this._ctx
            });
        }
        disconnectedCallback() {
            this._cmp.$destroy(), this._cmp = void 0;
            const {database} = this._ctx;
            database && database.close().catch((err => console.error(err)));
        }
        static get observedAttributes() {
            return [ "locale", "data-source", "skin-tone-emoji" ];
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            this._set(attrName.replace(/-([a-z])/g, ((_, up) => up.toUpperCase())), newValue);
        }
        _set(prop, newValue) {
            this._ctx[prop] = newValue, this._cmp && this._cmp.$set({
                [prop]: newValue
            }), [ "locale", "dataSource" ].includes(prop) && this._dbFlush();
        }
        _dbCreate() {
            const {locale, dataSource, database} = this._ctx;
            database && database.locale === locale && database.dataSource === dataSource || this._set("database", new Database({
                locale,
                dataSource
            }));
        }
        _dbFlush() {
            Promise.resolve().then((() => this._dbCreate()));
        }
    }
    const definitions = {};
    for (const prop of PROPS) definitions[prop] = {
        get() {
            return "database" === prop && this._dbCreate(), this._ctx[prop];
        },
        set(val) {
            if ("database" === prop) throw new Error("database is read-only");
            this._set(prop, val);
        }
    };
    Object.defineProperties(PickerElement.prototype, definitions), customElements.get("emoji-picker") || customElements.define("emoji-picker", PickerElement);
})();