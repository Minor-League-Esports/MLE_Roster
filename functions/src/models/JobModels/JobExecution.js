"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobExecution = void 0;
class JobExecution {
    constructor(options) {
        this.run =
            async (job) => {
                console.log(`Executing: ${job.description}`);
                const data = await options.run(job);
                job.childJobs.forEach((j) => j.data = data);
                console.log(`Done executing: ${job.description}`);
            };
    }
}
exports.JobExecution = JobExecution;
//# sourceMappingURL=JobExecution.js.map