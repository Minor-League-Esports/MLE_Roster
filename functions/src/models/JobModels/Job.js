"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
const HelperModels_1 = require("../HelperModels");
class Job extends HelperModels_1.Serializable {
    constructor(options = {}) {
        var _a, _b;
        super();
        this.jobType = options.jobType;
        this.childJobs = (_a = options.childJobs) !== null && _a !== void 0 ? _a : [];
        this.data = options.data;
        this.metadata = (_b = options.metadata) !== null && _b !== void 0 ? _b : {};
        this.description = options.description;
    }
}
exports.Job = Job;
//# sourceMappingURL=Job.js.map