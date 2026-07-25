/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const CONFIG_URL =
  "https://raw.githubusercontent.com/gayanvoice/top-github-users/main/config.json";
const CACHE_BASE_URL =
  "https://raw.githubusercontent.com/gayanvoice/top-github-users/main/cache";

const publicDataDir = path.join(__dirname, "..", "public", "data");
const countriesDataDir = path.join(publicDataDir, "countries");

// Ensure directories exist
if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
}
if (!fs.existsSync(countriesDataDir)) {
  fs.mkdirSync(countriesDataDir, { recursive: true });
}

function safeWriteJson(filePath, data) {
  const newContent = JSON.stringify(data, null, 2) + "\n";
  if (fs.existsSync(filePath)) {
    const existingContent = fs.readFileSync(filePath, "utf8");
    if (existingContent === newContent) {
      return false;
    }
  }
  fs.writeFileSync(filePath, newContent, "utf8");
  return true;
}

async function run() {
  try {
    if (
      fs.existsSync(path.join(publicDataDir, "all.json")) &&
      !process.argv.includes("--force")
    ) {
      console.log("⚡ Using cached data. Pass --force to refetch.");
      return;
    }
    const configRes = await fetch(CONFIG_URL);
    if (!configRes.ok) {
      throw new Error(`Failed to fetch config: ${configRes.statusText}`);
    }
    const config = await configRes.json();
    const locations = config.locations || [];

    const countriesMetadata = [];
    let allDevelopers = [];
    let updatedCountryCount = 0;

    // Fetch each country data
    for (const loc of locations) {
      const countryKey = loc.country; // e.g. "united states" or "japan"
      const countryFileName =
        countryKey.toLowerCase().replace(/ /g, "_") + ".json";
      const countryUrl = `${CACHE_BASE_URL}/${countryFileName}`;

      try {
        const countryRes = await fetch(countryUrl);
        if (!countryRes.ok) {
          continue;
        }

        const devList = await countryRes.json();
        if (!Array.isArray(devList)) {
          continue;
        }

        // Sort by followers descending to assign country rank
        const sortedCountryDevs = [...devList].sort(
          (a, b) => (b.followers || 0) - (a.followers || 0),
        );

        const processedCountryDevs = sortedCountryDevs.map((dev, idx) => {
          const score =
            (dev.followers || 0) +
            (dev.publicContributions || 0) +
            (dev.privateContributions || 0);
          return {
            login: dev.login,
            name: dev.name === "undefined value" ? "" : dev.name,
            avatarUrl: dev.avatarUrl,
            location: dev.location === "undefined value" ? "" : dev.location,
            company: dev.company === "undefined value" ? "" : dev.company,
            followers: dev.followers || 0,
            publicContributions: dev.publicContributions || 0,
            privateContributions: dev.privateContributions || 0,
            country: countryKey,
            countryName: loc.geoName,
            countryRank: idx + 1,
            score: score,
          };
        });

        // Save individual country data only if changed
        const countryFilePath = path.join(countriesDataDir, countryFileName);
        const written = safeWriteJson(countryFilePath, processedCountryDevs);
        if (written) {
          updatedCountryCount++;
        }

        countriesMetadata.push({
          country: countryKey,
          geoName: loc.geoName,
          flagUrl: loc.imageUrl,
          developerCount: devList.length,
        });

        allDevelopers.push(...processedCountryDevs);
      } catch (err) {
        console.error(`❌ Error loading country ${loc.geoName}:`, err.message);
      }
    }

    console.log(`✅ Synced ${locations.length} countries. Updated files: ${updatedCountryCount}`);

    // Sort global list of all developers by followers descending to assign global rank
    allDevelopers.sort((a, b) => b.followers - a.followers);

    // Assign global rank for all.json
    allDevelopers = allDevelopers.map((dev, idx) => ({
      ...dev,
      globalRank: idx + 1,
    }));

    // Save consolidated all.json only if changed
    safeWriteJson(path.join(publicDataDir, "all.json"), allDevelopers);

    // Save countries metadata only if changed
    safeWriteJson(path.join(publicDataDir, "countries.json"), countriesMetadata);

    // Calculate global stats
    const totalDevelopers = allDevelopers.length;
    const totalCountries = countriesMetadata.length;
    const totalFollowers = allDevelopers.reduce(
      (sum, dev) => sum + (dev.followers || 0),
      0,
    );
    const totalContributions = allDevelopers.reduce(
      (sum, dev) =>
        sum + (dev.publicContributions || 0) + (dev.privateContributions || 0),
      0,
    );

    // Sort countries by developerCount descending
    const topCountries = [...countriesMetadata]
      .sort((a, b) => b.developerCount - a.developerCount)
      .slice(0, 8);

    // Get top developers preview
    const topDevelopers = allDevelopers.slice(0, 10);

    let lastUpdated = new Date().toISOString();
    const statsPath = path.join(publicDataDir, "stats.json");
    if (fs.existsSync(statsPath)) {
      try {
        const existingStats = JSON.parse(fs.readFileSync(statsPath, "utf8"));
        const newStatsPreview = JSON.stringify({
          totalDevelopers,
          totalCountries,
          totalFollowers,
          totalContributions,
          topCountries,
          topDevelopers,
        });
        const existingStatsPreview = JSON.stringify({
          totalDevelopers: existingStats.totalDevelopers,
          totalCountries: existingStats.totalCountries,
          totalFollowers: existingStats.totalFollowers,
          totalContributions: existingStats.totalContributions,
          topCountries: existingStats.topCountries,
          topDevelopers: existingStats.topDevelopers,
        });
        if (newStatsPreview === existingStatsPreview && existingStats.lastUpdated) {
          lastUpdated = existingStats.lastUpdated;
        }
      } catch {
        // use new timestamp
      }
    }

    const stats = {
      totalDevelopers,
      totalCountries,
      totalFollowers,
      totalContributions,
      topCountries,
      topDevelopers,
      lastUpdated,
    };

    safeWriteJson(statsPath, stats);
  } catch (err) {
    console.error("Fetch script error:", err);
    process.exit(1);
  }
}

run();
