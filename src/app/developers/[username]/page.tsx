import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDeveloperByUsername, getCountries } from '@/lib/data';
import { Avatar } from '@/components/ui/avatar';
import {
  Building,
  MapPin,
  Award,
  ArrowLeft,
  ExternalLink,
  Globe,
  Sparkles,
  Zap,
  Star,
  Activity,
} from 'lucide-react';
import { GithubIcon as Github } from '@/components/ui/github-icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { FlagImage } from '@/components/ui/flag-image';

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export const revalidate = 0; // Dynamic profile page

export default async function DeveloperProfilePage({ params }: ProfilePageProps) {
  const routeParams = await params;
  const username = routeParams.username;

  // Fetch developer details
  const dev = getDeveloperByUsername(username);

  // If not found, trigger 404
  if (!dev) {
    notFound();
  }

  // Look up country flag
  const countries = getCountries();
  const countryMeta = countries.find(
    (c) => c.country.toLowerCase() === dev.country.toLowerCase()
  );

  // Calculate percentages/stats for visual interest
  // Assume a default population scale context (just for visual dashboard polish)
  const totalInCountry = countryMeta ? countryMeta.developerCount : 1000;
  const countryPercentage = ((dev.countryRank / totalInCountry) * 100).toFixed(2);
  
  // Custom score calculations for visual bars
  const totalContributions = dev.publicContributions + dev.privateContributions;
  const contributionRatio = totalContributions > 0 
    ? Math.round((dev.publicContributions / totalContributions) * 100) 
    : 100;

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          href="/developers"
          className={buttonVariants({
            variant: 'ghost',
            size: 'sm',
            className: '-ml-3 text-muted-foreground hover:text-foreground flex items-center gap-1 w-fit',
          })}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to leaderboard</span>
        </Link>
      </div>

      {/* Profile Cyber Card */}
      <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-card/25 backdrop-blur-md p-6 sm:p-10 shadow-[0_0_50px_rgba(16,185,129,0.03)]">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[90px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
          
          {/* Large Avatar */}
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

          {/* Details */}
          <div className="flex-1 space-y-5 min-w-0">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                  {dev.name || dev.login}
                </h1>
                
                {/* Score badge */}
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                  <Sparkles className="h-3 w-3" />
                  <span>Score: {dev.score.toLocaleString()}</span>
                </div>
              </div>

              <div className="text-lg font-mono text-muted-foreground/80">
                @{dev.login}
              </div>
            </div>

            {/* Badges for company/location */}
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
                href={`/countries/${dev.country.toLowerCase().replace(/ /g, '_')}`}
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

            {/* External CTA Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <a
                href={`https://github.com/${dev.login}`}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({
                  size: 'sm',
                  className: 'bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-md shadow-primary/10 flex items-center space-x-2',
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
                  variant: 'outline',
                  size: 'sm',
                  className: 'border-border hover:bg-secondary',
                })}
              >
                View Repositories
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Stat 1: Followers */}
        <Card className="border-border/40 bg-card/30 backdrop-blur-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-muted-foreground uppercase tracking-wider">
                Followers Rank
              </span>
              <Award className="h-5 w-5 text-indigo-400" />
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

        {/* Stat 2: Contributions */}
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
                <span>Total contributions ({dev.publicContributions.toLocaleString()} public)</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stat 3: Total Score */}
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

      {/* Standings Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Leaderboard rankings info */}
        <Card className="border-border/40 bg-card/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Globe className="h-4.5 w-4.5 text-primary" />
              <span>Leaderboard Standings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Global Standing */}
            <div className="flex items-center justify-between p-3.5 bg-secondary/30 rounded-xl border border-border/20">
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Global Rank</h4>
                <p className="text-2xl font-bold font-mono text-foreground mt-0.5">
                  #{dev.globalRank.toLocaleString()}
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-secondary text-foreground rounded border border-border">
                Top Developers
              </span>
            </div>

            {/* Country Standing */}
            <div className="flex items-center justify-between p-3.5 bg-secondary/30 rounded-xl border border-border/20">
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">
                  Rank in {dev.countryName}
                </h4>
                <p className="text-2xl font-bold font-mono text-primary mt-0.5">
                  #{dev.countryRank.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded border border-primary/20 block text-center">
                  Top {countryPercentage}%
                </span>
                <span className="text-[10px] text-muted-foreground mt-1 block">
                  Out of {totalInCountry.toLocaleString()} devs
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Insights card */}
        <Card className="border-border/40 bg-card/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Star className="h-4.5 w-4.5 text-primary" />
              <span>Developer Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Public vs Private index:</span>
                <span className="font-semibold text-foreground font-mono">{contributionRatio}% Public</span>
              </div>
              
              {/* Simulated Progress Bar */}
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden border border-border/30">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full"
                  style={{ width: `${contributionRatio}%` }}
                />
              </div>
            </div>

            <div className="pt-2 text-xs text-muted-foreground leading-relaxed space-y-2">
              <p>
                💡 **Rank calculation**: The global score index of **{dev.score.toLocaleString()}** places this account at rank **#{dev.globalRank.toLocaleString()}** globally.
              </p>
              <p>
                Explore more developers in the same country by visiting the dedicated database directory.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href={`/countries/${dev.country.toLowerCase().replace(/ /g, '_')}`}
                className={buttonVariants({
                  variant: 'link',
                  size: 'sm',
                  className: 'p-0 text-primary hover:underline flex items-center gap-1 font-semibold text-xs w-fit',
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
