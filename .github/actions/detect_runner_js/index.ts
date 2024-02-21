import { Octokit } from "@octokit/action";
import { RestEndpointMethodTypes } from "@octokit/action";

type RunnerForJobs = {
    githubHosted: string[]
    slefHosted: string[]
};
type ListJobsForWorkflowResponseData = RestEndpointMethodTypes["actions"]["listJobsForWorkflowRun"]["response"]["data"];

const selfHostedLabel = "self-hosted";

export async function getRunnerForJobs(): Promise<RunnerForJobs> {
    const octokit = new Octokit();
    const [owner, repo] = process.env.GITHUB_REPOSITORY!.split("/");

    const res = await octokit.actions.listJobsForWorkflowRun({
        owner: owner,
        repo: repo,
        run_id: Number(process.env.GITHUB_RUN_ID!),
    });
    const data: ListJobsForWorkflowResponseData = res.data;

    const runnerForJobs: RunnerForJobs = {
        githubHosted: [],
        slefHosted: [],
    }
    data.jobs.forEach((job) => {
        const targetList = job.labels.includes(selfHostedLabel) ? runnerForJobs.slefHosted : runnerForJobs.githubHosted;
        targetList.push(job.name);
    })
    console.log(runnerForJobs);
    return runnerForJobs;
}



const world = 'world';
export function hello(who: string = world): string {
    return `Hello ${who}! `;
};

console.log(getRunnerForJobs());
console.log(hello());