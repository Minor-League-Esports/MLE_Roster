/**
 * All job implementations
 */
import {JobType} from "./JobType";
import {Job} from "./Job";

/**
 * Player Job Chain
 */
const teamJob = new Job(
    {
        jobType: JobType.TEAMS,
        description: "Update Teams"
    }
)
export const directoryJobChain = new Job(
    {
        jobType: JobType.PLAYERS,
        childJobs: [teamJob],
        description: "Update Players"
    }
);

export const updateMetadataJobChain = new Job(
    {
        jobType: JobType.METADATA,
        description: "Update Metadata"
    }
)

/**
 * Season 11 job chain
 */
function seasonStatsFactory(season: number): Job {
    const standingsJob = new Job(
        {
            jobType: JobType.STANDINGS,
            description: `Update season ${season} standings`,
            metadata: {
                season
            }
        });
    const statsJob = new Job(
        {
            jobType: JobType.SEASONSTATS,
            description: `Update season ${season} statistics`,
            metadata: {
                season
            },
            childJobs: [standingsJob]
        });
    return new Job(
        {
            jobType: JobType.SCHEDULE,
            description: `Update season ${season} schedule`,
            metadata: {
                season
            },
            childJobs: [statsJob]
        }
    )
}

export const season11JobChain = seasonStatsFactory(11);
