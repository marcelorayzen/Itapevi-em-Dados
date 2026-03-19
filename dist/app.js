"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listenHttp = listenHttp;
const express_1 = __importDefault(require("express"));
const health_1 = require("./health");
const app = (0, express_1.default)();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.get('/health', (req, res) => {
    return res.json((0, health_1.healthCheck)());
});
function listenHttp() {
    app.listen(port, () => {
        console.log(`HTTP health server rodando em http://localhost:${port}/health`);
    });
}
exports.default = app;
//# sourceMappingURL=app.js.map