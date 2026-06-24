import React from 'react';
import Link from 'next/link';
import { getGlobalStats } from '@/lib/data';
import {
  Globe,
  Users,
  Search,
  Award,
  TrendingUp,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { GithubIcon as Github } from '@/components/ui/github-icon';
import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { FlagImage } from '@/components/ui/flag-image';
import { Avatar } from '@/components/ui/avatar';

export const revalidate = 3600; // Revalidate every hour

export default function HomePage() {
  const stats = getGlobalStats();

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <h2 className="text-xl font-semibold text-foreground">Loading platform stats...</h2>
        <p className="text-muted-foreground mt-2">Data is being prepared. If this takes too long, check build logs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-border/30 bg-gradient-to-b from-card/80 to-background p-8 md:p-16 shadow-[0_0_50px_rgba(16,185,129,0.05)] text-center max-w-5xl mx-auto">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08),transparent_50%)]" />
        
        {/* Glow accent */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Explore
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-[length:200%_auto] bg-clip-text text-transparent animate-pulse">
              {' '}Top Developers{' '}
            </span>
            Worldwide
          </h1>
          
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Browse and search rankings of the top open-source talent worldwide. Discover top developers based on followers and public contributions.
          </p>

          {/* Instant Search Bar */}
          <div className="max-w-xl mx-auto pt-4">
            <form action="/search" method="GET" className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                name="q"
                placeholder="Search username, name, country, or company..."
                required
                className="w-full bg-secondary/80 border border-border/60 rounded-xl py-3.5 pl-12 pr-28 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-1.5 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:bg-primary/95 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. Global Statistics Dashboard */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2">
          <Layers className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold tracking-tight text-foreground">Global Overview</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Developers',
              value: stats.totalDevelopers.toLocaleString(),
              desc: 'Ranked globally',
              icon: Users,
              color: 'text-emerald-500',
              bg: 'bg-emerald-500/10',
            },
            {
              label: 'Countries Crawled',
              value: stats.totalCountries.toLocaleString(),
              desc: 'Across the globe',
              icon: Globe,
              color: 'text-teal-500',
              bg: 'bg-teal-500/10',
            },
            {
              label: 'Aggregated Followers',
              value: stats.totalFollowers.toLocaleString(),
              desc: 'Total developer reach',
              icon: Award,
              color: 'text-indigo-500',
              bg: 'bg-indigo-500/10',
            },
            {
              label: 'Total Contributions',
              value: stats.totalContributions.toLocaleString(),
              desc: 'Commits, issues & PRs',
              icon: TrendingUp,
              color: 'text-cyan-500',
              bg: 'bg-cyan-500/10',
            },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="border-border/40 bg-card/40 backdrop-blur-sm overflow-hidden hover:border-primary/20 transition-all group">
                <CardContent className="p-6 relative">
                  <div className="absolute right-4 top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Icon className="h-12 w-12 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">{stat.value}</h3>
                    <p className="text-xs text-muted-foreground/80">{stat.desc}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 3. Top Countries Previews & Top Developers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Top 8 Countries Preview (takes 1 col) */}
        <div className="space-y-6 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <span>Top Countries</span>
            </h3>
            <Link href="/countries" className="text-xs font-semibold text-primary flex items-center hover:underline">
              <span>View All</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {stats.topCountries.map((c) => (
              <Link
                key={c.country}
                href={`/countries/${c.country.toLowerCase().replace(/ /g, '_')}`}
                className="flex items-center justify-between p-3.5 rounded-xl border border-border/40 bg-card/30 hover:bg-card/70 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="relative h-6 w-9 overflow-hidden rounded border border-border/30 bg-muted/20">
                    <FlagImage
                      src={c.flagUrl}
                      alt={`${c.geoName} flag`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {c.geoName}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span className="font-mono bg-secondary px-2 py-0.5 rounded text-foreground">
                    {c.developerCount.toLocaleString()}
                  </span>
                  <span>devs</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Column: Top Developers globally preview (takes 2 cols) */}
        <div className="space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <span>Leaderboard Preview</span>
            </h3>
            <Link href="/developers" className="text-xs font-semibold text-primary flex items-center hover:underline">
              <span>Full Leaderboard</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="border border-border/40 rounded-2xl bg-card/20 overflow-hidden divide-y divide-border/40">
            {stats.topDevelopers.slice(0, 5).map((dev) => (
              <div key={dev.login} className="flex items-center justify-between p-4 hover:bg-card/40 transition-colors">
                <div className="flex items-center space-x-4 min-w-0">
                  <div className="flex items-center justify-center font-mono font-bold text-sm text-muted-foreground w-6">
                    #{dev.globalRank}
                  </div>
                  <Link href={`/developers/${dev.login}`} className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border/60 hover:border-primary transition-all">
                    <Avatar
                      src={dev.avatarUrl}
                      alt={`${dev.login} avatar`}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="min-w-0">
                    <Link
                      href={`/developers/${dev.login}`}
                      className="text-sm font-bold text-foreground hover:text-primary transition-colors block truncate"
                    >
                      {dev.name || dev.login}
                    </Link>
                    <span className="text-xs text-muted-foreground hover:text-foreground transition-colors font-mono">
                      @{dev.login}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  {/* Stats detail */}
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-xs text-muted-foreground font-semibold">Followers</span>
                    <span className="text-sm font-bold text-foreground font-mono">
                      {dev.followers.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground font-semibold">Contributions</span>
                    <span className="text-sm font-bold text-foreground font-mono">
                      {(dev.publicContributions + dev.privateContributions).toLocaleString()}
                    </span>
                  </div>

                  {/* Profile link */}
                  <Link
                    href={`/developers/${dev.login}`}
                    className="p-2 rounded-lg bg-secondary/80 text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Mini features list */}
      <section className="border-t border-border/20 pt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: 'Fuzzy Search',
            desc: 'Instant search engine querying username, name, locations, or companies client-side.',
            icon: Search,
            href: '/search',
          },
          {
            title: 'Rankings by Country',
            desc: 'Browse and explore over 130 countries, each with its dedicated developer rank table.',
            icon: Globe,
            href: '/countries',
          },
          {
            title: 'Open Source Methodology',
            desc: 'Read how scores and global rankings are calculated based on public records.',
            icon: Github,
            href: '/about',
          },
        ].map((feat, index) => {
          const Icon = feat.icon;
          return (
            <div key={index} className="space-y-3 p-5 rounded-2xl bg-card/25 border border-border/20 hover:border-primary/20 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/25">
                <Icon className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-foreground">{feat.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
              <div className="pt-2">
                <Link
                  href={feat.href}
                  className={buttonVariants({
                    variant: 'link',
                    size: 'sm',
                    className: 'p-0 text-primary hover:text-primary/80 inline-flex items-center gap-1',
                  })}
                >
                  <span>Learn more</span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </section>
      
      {/* 5. Last updated stamp */}
      <div className="text-center text-xs text-muted-foreground/60">
        Database last synced: {new Date(stats.lastUpdated).toLocaleString()} • Static cache revalidating hourly
      </div>
    </div>
  );
}
