"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobExecution = void 0;
const LZUTF8 = require("lzutf8");
class JobExecution {
    constructor(options) {
        this.run =
            async (job) => {
                console.log(`Executing: ${job.description}`);
                const data = LZUTF8.compress(JSON.stringify(await options.run(job)) || "", { outputEncoding: "Base64" });
                job.childJobs.forEach((j) => j.data = data);
                console.log(`Done executing: ${job.description}`);
            };
    }
}
exports.JobExecution = JobExecution;
//# sourceMappingURL=JobExecution.js.map