/**
 * The entrypoint for the action.
 */
import { run } from './main'
import { Octokit } from '@octokit/rest'

export async function go(): Promise<void> {
  const [owner, repo] = `${process.env.GITHUB_REPOSITORY}`.split('/')
  const octokit = new Octokit()
  const repo_data = (await octokit.repos.get({ owner, repo })).data
  const branch = repo_data.default_branch
  const rules = await octokit.paginate(octokit.repos.getBranchRules, {
    owner,
    repo,
    branch
  })
  console.dir('rules')
  console.dir(rules, { depth: 10 })
  // not all repos belong to an oreganization
  if (repo_data.organization) {
    const org = repo_data.organization.login
    // requires a token with members:read permissions
    const non_2fa_members = octokit.paginate(octokit.orgs.listMembers, {
      org,
      filter: '2fa_disabled'
    })
    console.dir('non_2fa_members')
    console.dir(non_2fa_members, { depth: 10 })
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run()
go()
