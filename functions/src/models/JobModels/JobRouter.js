"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobRouter = void 0;
const JobType_1 = require("./JobType");
const JobExecution_1 = require("./JobExecution");
const players_1 = require("../../functions/players");
const teams_1 = require("../../functions/teams");
const s11stats_1 = require("../../functions/s11stats");
const database_1 = require("../../functions/database");
const BatchModels_1 = require("../BatchModels");
exports.JobRouter = new Map([
    [
        JobType_1.JobType.PLAYERS,
        new JobExecution_1.JobExecution({
            run: async (job) => players_1.updatePlayers()
        })
    ],
    [
        JobType_1.JobType.SEASONSTATS,
        new JobExecution_1.JobExecution({
            run: async (job) => BatchModels_1.PrebatchData.deconstruct(await s11stats_1.getS11Stats(job.data))
        })
    ],
    [
        JobType_1.JobType.TEAMS,
        new JobExecution_1.JobExecution({
            run: async (job) => teams_1.updateTeams(job.data)
        })
    ],
    [
        JobType_1.JobType.SCHEDULE,
        new JobExecution_1.JobExecution({
            run: async (job) => s11stats_1.updateS11Schedule()
        })
    ],
    [
        JobType_1.JobType.STANDINGS,
        new JobExecution_1.JobExecution({
            run: async (job) => s11stats_1.updateS11Standings(job.data)
        })
    ],
    [
        JobType_1.JobType.METADATA,
        new JobExecution_1.JobExecution({
            run: async (job) => database_1.updateMetadata()
        })
    ]
]);
//# sourceMappingURL=JobRouter.js.map