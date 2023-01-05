"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authStrategies = void 0;
const jwt_strategy_1 = require("./jwt.strategy");
const local_stratedy_1 = require("./local.stratedy");
exports.authStrategies = [jwt_strategy_1.JwtStrategy, local_stratedy_1.LocalStrategy];
//# sourceMappingURL=index.js.map