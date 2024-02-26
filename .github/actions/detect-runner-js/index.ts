import { Octokit as OctokitRest } from "@octokit/rest";

type RunnerForJobs = {
    githubHosted: string[]
    selfHosted: string[]
};

const selfHostedLabel = "self-hosted";

export async function ensureOnlyGithubHostedRunners(): Promise<void> {
    const [owner, repo] = process.env.GITHUB_REPOSITORY!.split("/");
    const octokitRest = new OctokitRest();
    const jobs = await octokitRest.paginate(
        octokitRest.rest.actions.listJobsForWorkflowRun,
        {
            owner: owner,
            repo: repo,
            run_id: Number(process.env.GITHUB_RUN_ID),
        },
    );
    console.dir(jobs);
    const selfHostedRunnersForRepo = await octokitRest.paginate(
        octokitRest.rest.actions.listSelfHostedRunnersForRepo,
        {
            owner: owner,
            repo: repo,
        },
    );
    console.dir(selfHostedRunnersForRepo);
    // const runnerForJobs: RunnerForJobs = {
    //     githubHosted: [],
    //     selfHosted: [],
    // }
    // data.jobs.forEach((job) => {
    //     const targetList = job.labels.includes(selfHostedLabel) ? runnerForJobs.selfHosted : runnerForJobs.githubHosted;
    //     targetList.push(job.name);
    // })
    // console.log(runnerForJobs);
}



const world = 'world';
export function hello(who: string = world): string {
    return `Hello ${who}! `;
};

console.log(ensureOnlyGithubHostedRunners());
console.log(hello());