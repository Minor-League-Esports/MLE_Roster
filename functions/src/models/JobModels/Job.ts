import {Serializable} from "../HelperModels";
import {JobType} from "./JobType";

export interface JobOptions {
    jobType?: JobType,
    childJobs?: Job[],
    data?: any,
    metadata?: any
    description?: string
}

export class Job extends Serializable {
    jobType: JobType | undefined;
    childJobs: Job[];
    data: any;
    metadata: any;
    description: string | undefined;

    constructor(options: JobOptions = {}){
        super();
        this.jobType = options.jobType;
        this.childJobs = options.childJobs ?? [];
        this.data = options.data;
        this.metadata = options.metadata ?? {};
        this.description = options.description;
    }
}