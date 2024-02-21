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
exports.hello = exports.getRunnerForJobs = void 0;
const action_1 = require("@octokit/action");
const selfHostedLabel = "self-hosted";
function getRunnerForJobs() {
    return __awaiter(this, void 0, void 0, function* () {
        const octokit = new action_1.Octokit();
        const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
        const res = yield octokit.actions.listJobsForWorkflowRun({
            owner: owner,
            repo: repo,
            run_id: Number(process.env.GITHUB_RUN_ID),
        });
        const data = res.data;
        const runnerForJobs = {
            githubHosted: [],
            selfHosted: [],
        };
        data.jobs.forEach((job) => {
            const targetList = job.labels.includes(selfHostedLabel) ? runnerForJobs.selfHosted : runnerForJobs.githubHosted;
            targetList.push(job.name);
        });
        console.log(runnerForJobs);
        return runnerForJobs;
    });
}
exports.getRunnerForJobs = getRunnerForJobs;
const world = 'world';
function hello(who = world) {
    return `Hello ${who}! `;
}
exports.hello = hello;
;
console.log(getRunnerForJobs());
console.log(hello());
