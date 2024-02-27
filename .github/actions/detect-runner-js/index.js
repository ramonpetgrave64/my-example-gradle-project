"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hello = exports.ensureOnlyGithubHostedRunners = void 0;
const rest_1 = require("@octokit/rest");
const core_1 = require("@actions/core");
const selfHostedLabel = "self-hosted";
function ensureOnlyGithubHostedRunners() {
    return __awaiter(this, void 0, void 0, function* () {
        const iDToken = yield (0, core_1.getIDToken)();
        console.dir(iDToken);
        const token = (0, core_1.getInput)("token");
        const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
        const octokitRest = new rest_1.Octokit({ auth: token });
        const jobs = yield octokitRest.paginate(octokitRest.rest.actions.listJobsForWorkflowRun, {
            owner: owner,
            repo: repo,
            run_id: Number(process.env.GITHUB_RUN_ID),
        });
        console.dir(jobs);
        const selfHostedRunnersForRepo = yield octokitRest.paginate(octokitRest.rest.actions.listSelfHostedRunnersForRepo, {
            owner: owner,
            repo: repo,
        });
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
    });
}
exports.ensureOnlyGithubHostedRunners = ensureOnlyGithubHostedRunners;
const world = 'world';
function hello(who = world) {
    return `Hello ${who}! `;
}
exports.hello = hello;
;
console.log(ensureOnlyGithubHostedRunners());
console.log(hello());
