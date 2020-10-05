import {Job} from "./Job";
import * as LZUTF8 from "lzutf8";

interface JobFunction{
    (job: Job): Promise<any>
}

export interface JobExecutionOptions {
    run: JobFunction
}
export class JobExecution {
    run: JobFunction

    constructor(options: JobExecutionOptions){
        this.run =
            async (job: Job) => {
                console.log(`Executing: ${job.description}`);
                const data = LZUTF8.compress(JSON.stringify(await options.run(job)), {outputEncoding: "Base64"});
                job.childJobs.forEach((j: Job) => j.data = data);
                console.log(`Done executing: ${job.description}`);
            }

    }
}
