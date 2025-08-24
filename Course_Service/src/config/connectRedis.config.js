"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectDeletedKeys = exports.getRedisClient = exports.initRedisClient = void 0;
var ioredis_1 = require("ioredis");
var module_schema_1 = require("../models/module.schema");
var fs = require("fs");
var redisClient = null;
var initRedisClient = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        redisClient = new ioredis_1.default({ host: '127.0.0.1', port: 6381 });
        redisClient.on("connect", function () {
            console.log("Redis Client Connected 127.0.01:6381");
        });
        redisClient.on('error', function (err) {
            console.error('Redis Connection Error', err);
        });
        return [2 /*return*/];
    });
}); };
exports.initRedisClient = initRedisClient;
var getRedisClient = function () {
    if (!redisClient) {
        return null;
    }
    return redisClient;
};
exports.getRedisClient = getRedisClient;
var detectDeletedKeys = function () { return __awaiter(void 0, void 0, void 0, function () {
    var sub, redisClient;
    return __generator(this, function (_a) {
        sub = new ioredis_1.default({ host: '127.0.0.1', port: 6381 });
        sub.psubscribe("__keyevent@0__:expired");
        redisClient = (0, exports.getRedisClient)();
        if (!redisClient) {
            console.log("Got RedisClient Null ");
            return [2 /*return*/];
        }
        sub.on("pmessage", function (pattern, channel, message) { return __awaiter(void 0, void 0, void 0, function () {
            var moduleId, s3UrlData, localVideoUrl, updateData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!message.startsWith("module-")) return [3 /*break*/, 5];
                        moduleId = message.replace("module-", "");
                        return [4 /*yield*/, redisClient.hget("module-ref:".concat(moduleId), "s3VideoUrl")];
                    case 1:
                        s3UrlData = _a.sent();
                        return [4 /*yield*/, redisClient.hget("module-ref:".concat(moduleId), "localVideoUrl")];
                    case 2:
                        localVideoUrl = _a.sent();
                        return [4 /*yield*/, module_schema_1.course_modules.update({
                                is_module_live: false,
                                video_url: s3UrlData
                            }, { where: { id: moduleId } })];
                    case 3:
                        updateData = _a.sent();
                        if (localVideoUrl) {
                            fs.unlink(localVideoUrl, function (err) {
                                if (err) {
                                    console.log("Error Removing LocalVideo", err);
                                }
                            });
                        }
                        return [4 /*yield*/, redisClient.del("module-ref:".concat(moduleId))];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        console.log("=====================Key Deletion Detection Enabled(redis)=====================");
        return [2 /*return*/];
    });
}); };
exports.detectDeletedKeys = detectDeletedKeys;
