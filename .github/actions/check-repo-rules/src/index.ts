/**
 * The entrypoint for the action.
 */
import { run } from './main'
import { Octokit } from '@octokit/rest'

export async function go(): Promise<void> {
  const [owner, repo] = `${process.env.GITHUB_REPOSITORY}`.split('/')
  const octokit = new Octokit()
  const branch = (await octokit.repos.get({ owner, repo })).data.default_branch
  const rules = await octokit.paginate(octokit.repos.getBranchRules, {
    owner,
    repo,
    branch
  })
  console.dir(rules, { depth: 10 })
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run()
go()
