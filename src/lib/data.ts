import fs from 'fs';
import path from 'path';

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

// In-memory cache for all developers
let cachedDevelopers: Developer[] | null = null;

export function getAllDevelopers(): Developer[] {
  if (cachedDevelopers) {
    return cachedDevelopers;
  }

  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'all.json');
    if (fs.existsSync(filePath)) {
      console.log('Loading all.json into memory...');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      cachedDevelopers = JSON.parse(fileContent);
      console.log(`Successfully loaded ${cachedDevelopers?.length} developers.`);
    } else {
      cachedDevelopers = [];
    }
  } catch (error) {
    console.error('Error loading all developers:', error);
    cachedDevelopers = [];
  }

  return cachedDevelopers || [];
}

export function getCountries(): CountryMetadata[] {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'countries.json');
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error('Error loading countries metadata:', error);
  }
  return [];
}

export function getGlobalStats(): GlobalStats | null {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'stats.json');
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error('Error loading global stats:', error);
  }
  return null;
}

export function getCountryDevelopers(countryKey: string): Developer[] {
  try {
    const formattedKey = countryKey.toLowerCase().replace(/ /g, '_');
    const filePath = path.join(process.cwd(), 'public', 'data', 'countries', `${formattedKey}.json`);
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error(`Error loading developers for country ${countryKey}:`, error);
  }
  return [];
}

export function getDeveloperByUsername(username: string): Developer | null {
  // First look in global memory cache
  const allDevs = getAllDevelopers();
  const lowerUsername = username.toLowerCase();
  const found = allDevs.find((d) => d.login.toLowerCase() === lowerUsername);
  if (found) {
    return found;
  }
  return null;
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
  sortBy = 'globalRank',
  sortOrder = 'asc',
  search = '',
  country = '',
}: {
  page?: number;
  pageSize?: number;
  sortBy?: 'globalRank' | 'countryRank' | 'followers' | 'score' | 'publicContributions';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  country?: string;
} = {}): PaginatedResult<Developer> {
  let list: Developer[] = [];

  // If a specific country is filtered, fetch country list (saves parsing all.json)
  if (country) {
    list = getCountryDevelopers(country);
  } else {
    list = getAllDevelopers();
  }

  // Apply search filter if query exists
  if (search) {
    const query = search.toLowerCase().trim();
    list = list.filter(
      (dev) =>
        dev.login.toLowerCase().includes(query) ||
        (dev.name && dev.name.toLowerCase().includes(query)) ||
        (dev.company && dev.company.toLowerCase().includes(query)) ||
        (dev.location && dev.location.toLowerCase().includes(query)) ||
        (dev.countryName && dev.countryName.toLowerCase().includes(query))
    );
  }

  // Apply sorting
  list.sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];
    return sortOrder === 'asc' ? valA - valB : valB - valA;
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
