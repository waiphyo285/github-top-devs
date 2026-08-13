import fs from "fs";
import path from "path";

export interface Developer {
  login: string;
  name: string;
  avatarUrl: string;
  location: string;
  company: string;
  followers: number;
  publicContributions: number;
  privateContributions: number;
  country: string;
  countryName: string;
  countryRank: number;
  globalRank: number;
  score: number;
}

export interface CountryMetadata {
  country: string;
  geoName: string;
  flagUrl: string;
  developerCount: number;
}

export interface GlobalStats {
  totalDevelopers: number;
  totalCountries: number;
  totalFollowers: number;
  totalContributions: number;
  topCountries: CountryMetadata[];
  topDevelopers: Developer[];
  lastUpdated: string;
}

// In-memory caches for fast server responses
let cachedDevelopers: Developer[] | null = null;
let cachedTopGlobal: Developer[] | null = null;
let cachedUsernameMap: Record<string, string> | null = null;

function safeJsonParse<T>(content: string): T {
  let sanitized = content;
  if (sanitized.includes("<<<<<<<")) {
    sanitized = sanitized.replace(
      /<<<<<<< HEAD\n([\s\S]*?)=======\n[\s\S]*?>>>>>>> [a-f0-9]+\n/g,
      "$1",
    );
  }
  return JSON.parse(sanitized);
}

export function getAllDevelopers(): Developer[] {
  if (cachedDevelopers) {
    return cachedDevelopers;
  }

  try {
    const filePath = path.join(process.cwd(), "data", "all.json");
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      cachedDevelopers = safeJsonParse(fileContent);
    } else {
      cachedDevelopers = [];
    }
  } catch (error) {
    console.error("Error loading all developers:", error);
    cachedDevelopers = [];
  }

  return cachedDevelopers || [];
}

export function getTopGlobalDevelopers(): Developer[] {
  if (cachedTopGlobal) {
    return cachedTopGlobal;
  }

  try {
    const filePath = path.join(process.cwd(), "data", "top-global.json");
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      cachedTopGlobal = safeJsonParse(fileContent);
      return cachedTopGlobal || [];
    }
  } catch (error) {
    console.error("Error loading top global developers:", error);
  }

  return getAllDevelopers().slice(0, 1000);
}

export function getUsernameMap(): Record<string, string> {
  if (cachedUsernameMap) {
    return cachedUsernameMap;
  }

  try {
    const filePath = path.join(process.cwd(), "data", "username-map.json");
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      cachedUsernameMap = safeJsonParse(fileContent);
      return cachedUsernameMap || {};
    }
  } catch (error) {
    console.error("Error loading username map:", error);
  }

  return {};
}

export function getCountries(): CountryMetadata[] {
  try {
    const filePath = path.join(process.cwd(), "data", "countries.json");
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const list: CountryMetadata[] = safeJsonParse(fileContent);
      const myanmarIndex = list.findIndex(
        (c) => c.country.toLowerCase() === "myanmar",
      );
      if (myanmarIndex > -1) {
        const [myanmar] = list.splice(myanmarIndex, 1);
        list.unshift(myanmar);
      }
      return list;
    }
  } catch (error) {
    console.error("Error loading countries metadata:", error);
  }
  return [];
}

export function getGlobalStats(): GlobalStats | null {
  try {
    const filePath = path.join(process.cwd(), "data", "stats.json");
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      return safeJsonParse(fileContent);
    }
  } catch (error) {
    console.error("Error loading global stats:", error);
  }
  return null;
}

export function getCountryDevelopers(countryKey: string): Developer[] {
  try {
    const formattedKey = countryKey.toLowerCase().replace(/ /g, "_");
    const filePath = path.join(
      process.cwd(),
      "data",
      "countries",
      `${formattedKey}.json`,
    );
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const devs: Developer[] = safeJsonParse(fileContent);
      return devs;
    }
  } catch (error) {
    console.error(
      `Error loading developers for country ${countryKey}:`,
      error,
    );
  }
  return [];
}

export function getDeveloperByUsername(username: string): Developer | null {
  const lowerUsername = username.toLowerCase();
  const usernameMap = getUsernameMap();
  const countryKey = usernameMap[lowerUsername];

  if (countryKey) {
    const countryDevs = getCountryDevelopers(countryKey);
    const found = countryDevs.find(
      (d) => d.login.toLowerCase() === lowerUsername,
    );
    if (found) {
      if (!found.globalRank || found.globalRank <= 0) {
        const topDevs = getTopGlobalDevelopers();
        const topFound = topDevs.find(
          (d) => d.login.toLowerCase() === lowerUsername,
        );
        if (topFound && topFound.globalRank) {
          found.globalRank = topFound.globalRank;
        } else {
          const allDevs = getAllDevelopers();
          const allFound = allDevs.find(
            (d) => d.login.toLowerCase() === lowerUsername,
          );
          if (allFound && allFound.globalRank) {
            found.globalRank = allFound.globalRank;
          }
        }
      }
      return found;
    }
  }

  // Fallback to top global
  const topDevs = getTopGlobalDevelopers();
  const topFound = topDevs.find(
    (d) => d.login.toLowerCase() === lowerUsername,
  );
  if (topFound) {
    return topFound;
  }

  // Final fallback
  const allDevs = getAllDevelopers();
  return allDevs.find((d) => d.login.toLowerCase() === lowerUsername) || null;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function getPaginatedDevelopers({
  page = 1,
  pageSize = 50,
  sortBy = "globalRank",
  sortOrder = "asc",
  search = "",
  country = "",
}: {
  page?: number;
  pageSize?: number;
  sortBy?:
    | "globalRank"
    | "countryRank"
    | "followers"
    | "score"
    | "publicContributions";
  sortOrder?: "asc" | "desc";
  search?: string;
  country?: string;
} = {}): PaginatedResult<Developer> {
  let list: Developer[] = [];

  if (country) {
    list = getCountryDevelopers(country);
  } else if (!search && page <= 20 && pageSize * page <= 1000) {
    // Fast path: Use top 1,000 developers for default global views
    list = getTopGlobalDevelopers();
  } else {
    list = getAllDevelopers();
  }

  if (search) {
    const query = search.toLowerCase().trim();
    list = list.filter(
      (dev) =>
        dev.login.toLowerCase().includes(query) ||
        (dev.name && dev.name.toLowerCase().includes(query)) ||
        (dev.company && dev.company.toLowerCase().includes(query)) ||
        (dev.location && dev.location.toLowerCase().includes(query)) ||
        (dev.countryName && dev.countryName.toLowerCase().includes(query)),
    );
  }

  list.sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];
    return sortOrder === "asc" ? valA - valB : valB - valA;
  });

  const total = list.length;
  const startIndex = (page - 1) * pageSize;
  const paginatedData = list.slice(startIndex, startIndex + pageSize);

  return {
    data: paginatedData,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
