/**
 * Creates a real GitHub issue if GITHUB_TOKEN is provided, otherwise mocks it.
 */
export async function createGithubIssue(title: string, body: string, labels: string[], assignees: string[] = []): Promise<string> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || "example/repo"; // Format: owner/repo

  if (!token || repo === "example/repo") {
    console.log(`\n================ GITHUB NOTIFICATION ================`);
    console.log(`[GITHUB MOCK] Created Issue: ${title}`);
    console.log(`[GITHUB MOCK] Repo: ${repo}`);
    console.log(`[GITHUB MOCK] Labels: ${labels.join(", ")}`);
    console.log(`[GITHUB MOCK] Assignees: ${assignees.join(", ") || "None"}`);
    console.log(`=====================================================\n`);
    return `https://github.com/${repo}/issues/mock-123`;
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/issues`, {
      method: "POST",
      headers: {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": `token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        body,
        labels,
        assignees
      })
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`\n================ GITHUB NOTIFICATION ================`);
    console.log(`[GITHUB API] Created Real Issue: ${data.html_url}`);
    console.log(`=====================================================\n`);
    return data.html_url;
  } catch (error) {
    console.error("[GITHUB ERROR] Failed to create issue:", error);
    return "";
  }
}

export async function createGithubPullRequest(title: string, body: string, files: Record<string, string>, assignees: string[] = []): Promise<string> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || "example/repo";

  if (!token || repo === "example/repo") {
    console.log(`\n================ GITHUB NOTIFICATION ================`);
    console.log(`[GITHUB MOCK] Created Pull Request: ${title}`);
    console.log(`[GITHUB MOCK] Repo: ${repo}`);
    console.log(`[GITHUB MOCK] Files Added: \n${Object.keys(files).map(f => `  - ${f}`).join('\n')}`);
    console.log(`[GITHUB MOCK] Assignees: ${assignees.join(", ") || "None"}`);
    console.log(`=====================================================\n`);
    return `https://github.com/${repo}/pull/mock-pr-123`;
  }

  try {
    const headers = {
      "Accept": "application/vnd.github.v3+json",
      "Authorization": `token ${token}`,
      "Content-Type": "application/json"
    };

    // 1. Get Repo Details to find default branch
    const repoRes = await fetch(`https://api.github.com/repos/${repo}`, { headers });
    if (!repoRes.ok) throw new Error("Could not fetch repo details");
    const repoData = await repoRes.json();
    const defaultBranch = repoData.default_branch || "main";

    // 2. Get SHA of default branch
    const branchRes = await fetch(`https://api.github.com/repos/${repo}/git/refs/heads/${defaultBranch}`, { headers });
    if (!branchRes.ok) throw new Error(`Could not fetch branch ${defaultBranch}`);
    const branchData = await branchRes.json();
    const baseSha = branchData.object.sha;

    // 3. Create new branch
    const branchName = `feature/${title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-${Date.now()}`;
    const newRefRes = await fetch(`https://api.github.com/repos/${repo}/git/refs`, {
      method: "POST",
      headers,
      body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: baseSha })
    });
    if (!newRefRes.ok) throw new Error("Could not create branch");

    // 4. Commit files
    for (const [filePath, content] of Object.entries(files)) {
      const b64Content = Buffer.from(content).toString("base64");
      await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          message: `Add boilerplate for ${filePath}`,
          content: b64Content,
          branch: branchName
        })
      });
    }

    // 5. Open PR
    const prRes = await fetch(`https://api.github.com/repos/${repo}/pulls`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        title,
        body,
        head: branchName,
        base: defaultBranch
      })
    });
    
    if (!prRes.ok) {
      throw new Error(`GitHub API error creating PR: ${prRes.statusText}`);
    }

    const prData = await prRes.json();
    console.log(`\n================ GITHUB NOTIFICATION ================`);
    console.log(`[GITHUB API] Created Real Pull Request: ${prData.html_url}`);
    console.log(`=====================================================\n`);
    return prData.html_url;
  } catch (error) {
    console.error("[GITHUB ERROR] Failed to create PR:", error);
    return "";
  }
}
