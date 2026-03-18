import fs from 'fs';

async function testFetch() {
  const repoUrl = "https://github.com/facebook/react";
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/\s]+)/);
  const owner = match[1];
  const repo = match[2].replace(/\.git$/, '');

  const pullsRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls?state=all&sort=updated&direction=desc&per_page=10`
  );

  const pullsData = await pullsRes.json();
const pullRequests = pullsData.slice(0, 8).map((pr) => ({
    id: pr.number,
    title: pr.title,
    author: pr.user?.login || 'unknown',
    date: pr.merged_at || pr.closed_at || pr.updated_at,
    description: pr.body?.slice(0, 300) || 'No description provided.',
    impact: pr.labels?.some((l) => /breaking|critical|major/i.test(l.name)) ? 'high' :
            pr.labels?.some((l) => /feature|enhancement/i.test(l.name)) ? 'medium' : 'low',
    labels: (pr.labels || []).map((l) => l.name).slice(0, 4),
  }));

  console.log(pullRequests);
}

testFetch().catch(console.error);
