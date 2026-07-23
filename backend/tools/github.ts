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
