import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDeveloperByUsername, getCountries } from "@/lib/data";
import { fetchGitHubData } from "@/lib/github";
import { Avatar } from "@/components/ui/avatar";
import {
  Building,
  MapPin,
  Award,
  ArrowLeft,
  ExternalLink,
  Globe,
  Zap,
  Star,
  Activity,
  Image as ImageIcon,
  Code2,
} from "lucide-react";
import { GithubIcon as Github } from "@/components/custom/github-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { FlagImage } from "@/components/custom/flag-image";
import { DeveloperCard } from "@/components/custom/developer-card";

import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const routeParams = await params;
  const username = routeParams.username;
  const dev = getDeveloperByUsername(username);

  if (!dev) {
    return {
      title: "Developer Not Found | Github Top Devs",
    };
  }

  const displayName = dev.name || dev.login;
  return {
    title: `${displayName} (@${dev.login}) - GitHub Profile & Insights | Github Top Devs`,
    description: `View GitHub ranking, stats, followers, public/private contributions, and developer insights for ${displayName} (@${dev.login}) in ${dev.countryName}.`,
  };
}

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    country?: string;
    fromCountry?: string;
  }>;
}

export const revalidate = 0; // Dynamic profile page

export default async function DeveloperProfilePage({
  params,
  searchParams,
}: ProfilePageProps) {
  const routeParams = await params;
  const username = routeParams.username;
  const searchParamsVal = await searchParams;

  const cachedDev = getDeveloperByUsername(username);

  if (!cachedDev) {
    notFound();
  }

  const dev = { ...cachedDev };

  const liveData = await fetchGitHubData(username);

  if (liveData) {
    dev.avatarUrl = liveData.avatarUrl;
    dev.name = liveData.name;
    dev.followers = liveData.followers;
    dev.location = liveData.location;
    dev.company = liveData.company;
  }

  const topLang = liveData ? liveData.topLanguage : "N/A";
  const stars = liveData ? liveData.stars.toLocaleString() : "N/A";

  const countries = getCountries();
  const countryMeta = countries.find(
    (c) => c.country.toLowerCase() === dev.country.toLowerCase(),
  );

  const totalInCountry = countryMeta ? countryMeta.developerCount : 1000;
  const countryPercentage =
    dev.countryRank && totalInCountry
      ? ((dev.countryRank / totalInCountry) * 100).toFixed(2)
      : "0.00";

  const totalContributions = dev.publicContributions + dev.privateContributions;
  const contributionRatio =
    totalContributions > 0
      ? Math.round((dev.publicContributions / totalContributions) * 100)
      : 100;

  const fromCountry = searchParamsVal.fromCountry;
  const backParams = new URLSearchParams();
  if (searchParamsVal.page) backParams.set("page", searchParamsVal.page);
  if (searchParamsVal.search) backParams.set("search", searchParamsVal.search);
  if (searchParamsVal.sortBy) backParams.set("sortBy", searchParamsVal.sortBy);
  if (searchParamsVal.sortOrder)
    backParams.set("sortOrder", searchParamsVal.sortOrder);

  if (!fromCountry && searchParamsVal.country) {
    backParams.set("country", searchParamsVal.country);
  }

  const backQuery = backParams.toString();
  const backUrl = fromCountry
    ? `/countries/${fromCountry.toLowerCase().replace(/ /g, "_")}${backQuery ? `?${backQuery}` : ""}`
    : `/developers${backQuery ? `?${backQuery}` : ""}`;

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          href={backUrl}
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
            className:
              "-ml-3 text-muted-foreground hover:text-foreground flex items-center gap-1 w-fit",
          })}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to leaderboard</span>
        </Link>

        <DeveloperCard
          dev={dev}
          countryMeta={countryMeta}
          trigger={
            <Button
              size="sm"
              variant="default"
              className="h-9 gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <ImageIcon className="h-4 w-4" />
              <span>Save</span>
            </Button>
          }
        />
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-card/25 backdrop-blur-md p-6 sm:p-10 shadow-[0_0_50px_rgba(16,185,129,0.03)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
          <div className="relative h-32 w-32 sm:h-40 sm:w-40 overflow-hidden rounded-full border-2 border-primary/30 p-1.5 bg-background shadow-[0_0_25px_rgba(16,185,129,0.15)] shrink-0 group">
            <div className="relative h-full w-full overflow-hidden rounded-full">
              <Avatar
                src={dev.avatarUrl}
                alt={`${dev.login} avatar`}
                fill
                sizes="(max-width: 640px) 128px, 160px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
          </div>

          <div className="flex-1 space-y-5 min-w-0">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                  {dev.name || dev.login}
                </h1>
              </div>

              <div className="text-lg font-mono text-muted-foreground/80">
                @{dev.login}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3.5 text-sm text-muted-foreground">
              {dev.company && (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-secondary/50 rounded-lg border border-border/40">
                  <Building className="h-4 w-4 text-muted-foreground/75" />
                  <span>{dev.company}</span>
                </span>
              )}
              {dev.location && (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-secondary/50 rounded-lg border border-border/40">
                  <MapPin className="h-4 w-4 text-muted-foreground/75" />
                  <span>{dev.location}</span>
                </span>
              )}
              <Link
                href={`/countries/${dev.country.toLowerCase().replace(/ /g, "_")}`}
                className="flex items-center gap-1.5 px-3 py-1 bg-secondary/50 rounded-lg border border-border/40 hover:border-primary/30 hover:text-primary transition-all group"
              >
                {countryMeta && (
                  <div className="relative h-3 w-4.5 overflow-hidden rounded border border-border/20 shrink-0">
                    <FlagImage
                      src={countryMeta.flagUrl}
                      alt={`${dev.countryName} flag`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <span>{dev.countryName}</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <a
                href={`https://github.com/${dev.login}`}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({
                  size: "sm",
                  className:
                    "bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-md shadow-primary/10 flex items-center space-x-2",
                })}
              >
                <Github className="h-4 w-4" />
                <span>GitHub Profile</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href={`https://github.com/${dev.login}?tab=repositories`}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "border-border hover:bg-secondary",
                })}
              >
                View Repositories
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/40 bg-card/30 backdrop-blur-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-muted-foreground uppercase tracking-wider">
                Followers Rank
              </span>
              <Award className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-4xl font-extrabold tracking-tight font-mono text-foreground">
                {dev.followers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                Total GitHub account followers
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/30 backdrop-blur-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-muted-foreground uppercase tracking-wider">
                Contributions
              </span>
              <Activity className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-4xl font-extrabold tracking-tight font-mono text-foreground">
                {totalContributions.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
                <span>
                  Total contributions (
                  {dev.publicContributions.toLocaleString()} public)
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/30 backdrop-blur-sm border-primary/20 shadow-[0_0_20px_rgba(16,185,129,0.02)]">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-muted-foreground uppercase tracking-wider">
                Consolidated Score
              </span>
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-4xl font-extrabold tracking-tight font-mono text-primary">
                {dev.score.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                Followers + Total Contributions
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/40 bg-card/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Globe className="h-4.5 w-4.5 text-primary" />
              <span>Leaderboard Standings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between p-3.5 bg-secondary/30 rounded-xl border border-border/20">
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">
                  Global Rank
                </h4>
                <p className="text-2xl font-bold font-mono text-foreground mt-0.5">
                  {dev.globalRank && dev.globalRank > 0
                    ? `#${dev.globalRank.toLocaleString()}`
                    : "Unranked"}
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-secondary text-foreground rounded border border-border">
                Top Developers
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-secondary/30 rounded-xl border border-border/20">
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">
                  Rank in {dev.countryName}
                </h4>
                <p className="text-2xl font-bold font-mono text-primary mt-0.5">
                  {dev.countryRank && dev.countryRank > 0
                    ? `#${dev.countryRank.toLocaleString()}`
                    : "Unranked"}
                </p>
              </div>
              {dev.countryRank && dev.countryRank > 0 ? (
                <div className="text-right">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded border border-primary/20 block text-center">
                    Top {countryPercentage}%
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-1 block">
                    Out of {totalInCountry.toLocaleString()} devs
                  </span>
                </div>
              ) : (
                <div className="text-right">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-secondary text-muted-foreground rounded border border-border block text-center">
                    Unranked
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Star className="h-4.5 w-4.5 text-primary" />
              <span>Developer Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-2.5">
              <div className="flex items-center justify-between p-2.5 bg-secondary/20 rounded-xl border border-border/10">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-purple-500" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    Top Language
                  </span>
                </div>
                <span className="font-bold font-mono text-sm text-foreground">
                  {topLang}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-secondary/20 rounded-xl border border-border/10">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500/20" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    Total Stars
                  </span>
                </div>
                <span className="font-bold font-mono text-sm text-foreground">
                  {stars}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Public vs Private index:</span>
                <span className="font-semibold text-foreground font-mono">
                  {contributionRatio}% Public
                </span>
              </div>

              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden border border-border/30">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full"
                  style={{ width: `${contributionRatio}%` }}
                />
              </div>
            </div>

            <div className="pt-2 text-xs text-muted-foreground leading-relaxed space-y-2">
              <p>
                <strong>Global Ranking:</strong>{" "}
                {dev.globalRank && dev.globalRank > 0 ? (
                  <>
                    With a score index of{" "}
                    <strong>{dev.score.toLocaleString()}</strong>, this
                    developer ranks{" "}
                    <strong>#{dev.globalRank.toLocaleString()}</strong>{" "}
                    worldwide.
                  </>
                ) : (
                  <>
                    This developer is currently unranked in the global
                    leaderboard.
                  </>
                )}{" "}
                Explore top developers from the same country and see how they
                compare in our developer directory.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href={`/countries/${dev.country.toLowerCase().replace(/ /g, "_")}`}
                className={buttonVariants({
                  variant: "link",
                  size: "sm",
                  className:
                    "p-0 text-primary hover:underline flex items-center gap-1 font-semibold text-xs w-fit",
                })}
              >
                <span>Browse {dev.countryName} Leaderboard</span>
                <ArrowLeft className="h-3 w-3 rotate-180" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
