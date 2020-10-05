"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.season11JobChain = exports.updateMetadataJobChain = exports.directoryJobChain = void 0;
/**
 * All job implementations
 */
const JobType_1 = require("./JobType");
const Job_1 = require("./Job");
/**
 * Player Job Chain
 */
const teamJob = new Job_1.Job({
    jobType: JobType_1.JobType.TEAMS,
    description: "Update Teams"
});
exports.directoryJobChain = new Job_1.Job({
    jobType: JobType_1.JobType.PLAYERS,
    childJobs: [teamJob],
    description: "Update Players"
});
exports.updateMetadataJobChain = new Job_1.Job({
    jobType: JobType_1.JobType.METADATA,
    description: "Update Metadata"
});
/**
 * Season 11 job chain
 */
function seasonStatsFactory(season) {
    const standingsJob = new Job_1.Job({
        jobType: JobType_1.JobType.STANDINGS,
        description: `Update season ${season} standings`,
        metadata: {
            season
        }
    });
    const statsJob = new Job_1.Job({
        jobType: JobType_1.JobType.SEASONSTATS,
        description: `Update season ${season} statistics`,
        metadata: {
            season
        },
        childJobs: [standingsJob]
    });
    return new Job_1.Job({
        jobType: JobType_1.JobType.SCHEDULE,
        description: `Update season ${season} schedule`,
        metadata: {
            season
        },
        childJobs: [statsJob]
    });
}
exports.season11JobChain = seasonStatsFactory(11);
//# sourceMappingURL=Jobs.js.map