import React from 'react';
import Link from 'next/link';
import {
  Award,
  BookOpen,
  Info,
  Calendar,
  Zap,
  Users,
  Search,
  Scale,
} from 'lucide-react';
import { GithubIcon as Github } from '@/components/ui/github-icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';

export const revalidate = 3600; // Hourly cache

export default function AboutPage() {
  return (
    <div className="space-y-12 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-border/20 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent flex items-center gap-2.5">
          <Info className="h-7 w-7 text-primary animate-pulse" />
          <span>About Github Top Devs</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Learn about our metrics, ranking methodology, and data sourcing pipeline.
        </p>
      </div>

      {/* Methodology Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-foreground">
          <Scale className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold tracking-tight">Ranking Methodology</h2>
        </div>

        <Card className="border-border/40 bg-card/25 backdrop-blur-md overflow-hidden">
          <CardHeader className="bg-card/40 border-b border-border/30">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Zap className="h-4.5 w-4.5 text-primary" />
              <span>Consolidated Score Formula</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              We rank developers globally and regionally based on a consolidated score that balances their popularity with active open-source contribution output.
            </p>

            {/* Formula display */}
            <div className="p-5 rounded-xl bg-secondary/60 border border-border/45 flex flex-col items-center justify-center text-center space-y-2">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Formula
              </span>
              <code className="text-base sm:text-lg font-mono font-bold text-primary bg-background px-4 py-2 rounded-lg border border-border">
                Score = Followers + Total Contributions
              </code>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-primary" />
                  <span>Followers weight</span>
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Followers represent a developer's community reach, popularity, and credibility within the global ecosystem.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>Contributions weight</span>
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Total contributions represents the sum of public and private contributions (commits, PRs merged, code reviews, and issue discussions) over the past year.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Sourcing Sourcing */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-foreground">
          <Github className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold tracking-tight">Data Pipeline & Credits</h2>
        </div>

        <Card className="border-border/40 bg-card/25 backdrop-blur-md">
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Github Top Devs is a **read-only client web interface**. We do not run databases, query credentials, or track user activity.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All stats, ranks, avatars, and profile metadata are fetched directly from the open-source{' '}
              <a
                href="https://github.com/gayanvoice/top-github-users"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline font-bold"
              >
                top-github-users
              </a>{' '}
              repository curated by gayanvoice. The repository automatically crawls and updates list files daily utilizing GitHub Actions.
            </p>
            <div className="pt-2">
              <a
                href="https://github.com/gayanvoice/top-github-users"
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({
                  variant: 'outline',
                  className: 'border-border hover:bg-secondary flex items-center gap-2 w-fit',
                })}
              >
                <Github className="h-4 w-4" />
                <span>Visit upstream data repository</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-foreground">
          <Award className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'How can I add myself or update my country location?',
              a: 'Locations are parsed directly from your GitHub profile location string (e.g. "San Francisco, CA"). If your location field matches one of the crawled countries, the upstream crawler will automatically capture your profile in its daily runs. Update your location on github.com to get listed!',
            },
            {
              q: 'Why are some developers showing "undefined value" for locations or companies?',
              a: 'Upstream data is captured directly from public profile fields. If a user sets their company or location privacy, or removes it, it will show empty on our leaderboard cards.',
            },
            {
              q: 'How often is the data synced?',
              a: 'The upstream repository crawls daily. Github Top Devs caches this data inside static files inside the Next.js bundle and revalidates them periodically (hourly) to guarantee fast page response times under 2 seconds worldwide.',
            },
          ].map((faq, index) => (
            <Card key={index} className="border-border/40 bg-card/15">
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-extrabold text-foreground">
                  {faq.q}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4 pt-0">
                <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Sync Timestamp */}
      <div className="flex justify-center pt-4 border-t border-border/20 text-xs text-muted-foreground/60 gap-1.5 items-center font-mono">
        <Calendar className="h-3.5 w-3.5" />
        <span>Github Top Devs Client v1.0.0 (MVP) • Static CDN cache enabled</span>
      </div>
    </div>
  );
}
