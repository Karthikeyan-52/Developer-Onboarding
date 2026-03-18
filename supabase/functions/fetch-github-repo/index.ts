import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GitHubTreeItem {
  path: string;
  type: string;
  sha: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const GITHUB_TOKEN = Deno.env.get('GITHUB_TOKEN');

  try {
    const { repoUrl } = await req.json();
    if (!repoUrl) {
      return new Response(JSON.stringify({ error: 'repoUrl is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse owner/repo from URL
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/\s]+)/);
    if (!match) {
      return new Response(JSON.stringify({ error: 'Invalid GitHub URL' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const owner = match[1];
    const repo = match[2].replace(/\.git$/, '');
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'DevOnboard',
    };
    // Only add auth header if token exists and looks valid
    if (GITHUB_TOKEN && GITHUB_TOKEN.length > 10) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    // Fetch repo info - retry without auth if 401
    let repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    
    if (repoRes.status === 401 && headers['Authorization']) {
      console.log('Auth failed, retrying without token');
      delete headers['Authorization'];
      repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    }

    if (!repoRes.ok) {
      const errBody = await repoRes.text();
      return new Response(JSON.stringify({ error: `GitHub API error [${repoRes.status}]: ${errBody}` }), {
        status: repoRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch PRs and tree with same (possibly updated) headers
    const pullsRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls?state=all&sort=updated&direction=desc&per_page=10`,
      { headers }
    );
    
    if (!pullsRes.ok) {
      console.error(`Failed to fetch pulls: ${pullsRes.status} ${await pullsRes.text()}`);
    }

    const repoData = await repoRes.json();
    const defaultBranch = repoData.default_branch || 'main';

    // Fetch tree
    const treeRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
      { headers }
    );
    const treeData = await treeRes.json();

    // Build file tree
    const fileTree = buildFileTree(treeData.tree || [], repoData.name);

    // Process PRs
    const pullsData = pullsRes.ok ? await pullsRes.json() : [];
    const _pullsArray = Array.isArray(pullsData) ? pullsData : (pullsData.items || []);
    const pullRequests = _pullsArray.slice(0, 8).map((pr: any) => ({
      id: pr.number || Math.floor(Math.random() * 10000),
      title: pr.title || 'Untitled',
      author: pr.user?.login || 'unknown',
      date: (pr.merged_at || pr.closed_at || pr.updated_at || pr.created_at || new Date().toISOString()).split('T')[0],
      description: (pr.body || '')?.substring(0, 300) || 'No description provided.',
      impact: (pr.labels || [])?.some((l: any) => /breaking|critical|major/i.test(l.name)) ? 'high' :
              (pr.labels || [])?.some((l: any) => /feature|enhancement/i.test(l.name)) ? 'medium' : 'low',
      labels: (pr.labels || []).map((l: any) => l.name).slice(0, 4),
    }));

    // Extract top-level modules
    const topDirs = (treeData.tree || [])
      .filter((item: GitHubTreeItem) => item.type === 'tree' && !item.path.includes('/'))
      .map((item: GitHubTreeItem) => item.path);

    const modules = topDirs.slice(0, 8).map((dir: string) => {
      const filesInDir = (treeData.tree || []).filter(
        (item: GitHubTreeItem) => item.path.startsWith(dir + '/') && item.type === 'blob'
      );
      return {
        name: dir,
        path: dir,
        description: `Contains ${filesInDir.length} file(s). Top-level directory in the repository.`,
        importance: ['src', 'lib', 'app', 'packages'].includes(dir) ? 'critical' :
                    ['tests', 'test', 'docs', 'config'].includes(dir) ? 'standard' : 'important',
        connections: [],
      };
    });

    // Stats
    const stats = {
      totalFiles: (treeData.tree || []).filter((i: GitHubTreeItem) => i.type === 'blob').length,
      totalFolders: (treeData.tree || []).filter((i: GitHubTreeItem) => i.type === 'tree').length,
      totalPRs: pullRequests.length,
      stars: repoData.stargazers_count,
      language: repoData.language,
      repoName: repoData.full_name,
    };

    return new Response(JSON.stringify({ fileTree, modules, pullRequests, stats }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function buildFileTree(items: GitHubTreeItem[], rootName: string) {
  const root: any = { name: rootName, type: 'folder', children: [] };
  const map: Record<string, any> = { '': root };

  // Sort so directories come first
  const sorted = [...items].sort((a, b) => {
    if (a.type === b.type) return a.path.localeCompare(b.path);
    return a.type === 'tree' ? -1 : 1;
  });

  for (const item of sorted) {
    const parts = item.path.split('/');
    const name = parts[parts.length - 1];
    const parentPath = parts.slice(0, -1).join('/');

    const node: any = {
      name,
      type: item.type === 'tree' ? 'folder' : 'file',
    };

    if (item.type === 'tree') {
      node.children = [];
      map[item.path] = node;
    } else {
      const ext = name.split('.').pop()?.toLowerCase();
      node.language = ext;
    }

    const parent = map[parentPath];
    if (parent) {
      parent.children = parent.children || [];
      parent.children.push(node);
    }
  }

  return root;
}
