import { Octokit as OctokitRest } from "@octokit/rest";
import { getIDToken, getInput } from "@actions/core";

type RunnerForJobs = {
    githubHosted: string[]
    selfHosted: string[]
};

const selfHostedLabel = "self-hosted";

export async function ensureOnlyGithubHostedRunners(): Promise<void> {
    const iDToken = await getIDToken();
    console.dir(iDToken);

    const token = getInput("token");

    const [owner, repo] = process.env.GITHUB_REPOSITORY!.split("/");
    const octokitRest = new OctokitRest({ auth: token });
    const jobs = await octokitRest.paginate(
        octokitRest.rest.actions.listJobsForWorkflowRun,
        {
            owner: owner,
            repo: repo,
            run_id: Number(process.env.GITHUB_RUN_ID),
        },
    );
    console.dir(jobs, {
        depth: 10
    });

    const selfHostedRunnersForRepo = await octokitRest.paginate(
        octokitRest.rest.actions.listSelfHostedRunnersForRepo,
        {
            owner: owner,
            repo: repo,
        },
    );
    console.dir(selfHostedRunnersForRepo, {
        depth: 10
    });;

    const selfHostedRunnerLabels: Set<string> = new Set<string>(
        selfHostedRunnersForRepo.map(
            runner => runner.labels.map(label => label.name)
        ).flat()
    );
    const jobLabels: Set<string> = new Set<string>(
        jobs.map(job => job.labels).flat()
    );
    const commonLabels = [...jobLabels].filter(
        label => selfHostedRunnerLabels.has(label)
    );
    if (commonLabels.length) {
        const msg = `Self-hosted runners are not allowed in SLSA Level 3 workflows. labels: ${commonLabels}`;
        console.log(msg);
    };
}



const world = 'world';
export function hello(who: string = world): string {
    return `Hello ${who}! `;
};

console.log(ensureOnlyGithubHostedRunners());
console.log(hello());