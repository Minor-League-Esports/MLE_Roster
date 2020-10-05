import {Job} from "./Job";

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
                const data = await options.run(job);
                job.childJobs.forEach((j: Job) => j.data = data);
                console.log(`Done executing: ${job.description}`);
            }

    }
}
