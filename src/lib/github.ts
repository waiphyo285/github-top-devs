export interface GitHubUserResponse {
  login: string;
  name: string | null;
  avatar_url: string;
  location: string | null;
  company: string | null;
  followers: number;
  public_repos: number;
}

export interface GitHubRepoResponse {
  name: string;
  stargazers_count: number;
  language: string | null;
  html_url: string;
}

export interface LiveGitHubData {
  login: string;
  name: string;
  avatarUrl: string;
  location: string;
  company: string;
  followers: number;
  publicRepos: number;
  stars: number;
  topLanguage: string;
}

export async function fetchGitHubData(
  username: string,
): Promise<LiveGitHubData | null> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!userRes.ok) {
      if (userRes.status === 404) return null;
      throw new Error(
        `Failed to fetch user from GitHub: ${userRes.statusText}`,
      );
    }

    const userData: GitHubUserResponse = await userRes.json();

    // Fetch repos (up to 100) to aggregate stars and languages
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100`,
      {
        headers,
        next: { revalidate: 3600 },
      },
    );

    let stars = 0;
    let topLanguage = "N/A";

    if (reposRes.ok) {
      const reposData: GitHubRepoResponse[] = await reposRes.json();
      if (Array.isArray(reposData)) {
        stars = reposData.reduce(
          (acc, repo) => acc + (repo.stargazers_count || 0),
          0,
        );

        const languages: Record<string, number> = {};
        reposData.forEach((repo) => {
          if (repo.language) {
            languages[repo.language] = (languages[repo.language] || 0) + 1;
          }
        });

        let maxCount = 0;
        Object.entries(languages).forEach(([lang, count]) => {
          if (count > maxCount) {
            maxCount = count;
            topLanguage = lang;
          }
        });
      }
    }

    return {
      login: userData.login,
      name: userData.name || userData.login,
      avatarUrl: userData.avatar_url,
      location: userData.location || "",
      company: userData.company || "",
      followers: userData.followers,
      publicRepos: userData.public_repos,
      stars,
      topLanguage,
    };
  } catch (error) {
    console.error(`Error fetching GitHub data for ${username}:`, error);
    return null;
  }
}
