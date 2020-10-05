import {JobType} from "./JobType";
import {JobExecution} from "./JobExecution";
import {updatePlayers} from "../../functions/players";
import {Job} from "./Job";
import {updateTeams} from "../../functions/teams";
import {getS11Stats, updateS11Schedule, updateS11Standings} from "../../functions/s11stats";
import {updateMetadata} from "../../functions/database";
import {PrebatchData} from "../BatchModels";

export const JobRouter: Map<JobType, JobExecution> = new Map<JobType, JobExecution>([
    [
        JobType.PLAYERS,
        new JobExecution({
            run: async (job: Job) => updatePlayers()
        })
    ],
    [
        JobType.SEASONSTATS,
        new JobExecution({
            run: async (job: Job) => PrebatchData.deconstruct(await getS11Stats(job.data))
        })
    ],
    [
        JobType.TEAMS,
        new JobExecution({
            run: async (job: Job) => updateTeams(job.data)
        })
    ],
    [
        JobType.SCHEDULE,
        new JobExecution({
            run: async (job: Job) => updateS11Schedule()
        })
    ],
    [
        JobType.STANDINGS,
        new JobExecution({
            run: async (job: Job) => updateS11Standings(job.data)
        })
    ],
    [
        JobType.METADATA,
        new JobExecution({
            run: async (job: Job) => updateMetadata()
        })
    ]
]);