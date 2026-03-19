"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCached = getCached;
exports.setCache = setCache;
exports.delCache = delCache;
exports.flushCache = flushCache;
const node_cache_1 = __importDefault(require("node-cache"));
// Cache com TTL padrão de 1 hora (3600 segundos)
const cache = new node_cache_1.default({ stdTTL: 3600, checkperiod: 120 });
function getCached(key) {
    return cache.get(key);
}
function setCache(key, value, ttl) {
    if (ttl === undefined) {
        cache.set(key, value);
    }
    else {
        cache.set(key, value, ttl);
    }
}
function delCache(key) {
    cache.del(key);
}
function flushCache() {
    cache.flushAll();
}
//# sourceMappingURL=cache.js.map