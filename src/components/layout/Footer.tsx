import React from 'react';
import Link from 'next/link';
import { Heart, MessageSquare } from 'lucide-react';
import { GithubIcon as Github } from '@/components/ui/github-icon';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 bg-background/50 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand section */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                GitDevRank
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Explore and track the world's top GitHub developers, ranked by followers, contributions, and global score.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Navigation</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link href="/developers" className="text-muted-foreground hover:text-primary transition-colors">
                Top Developers
              </Link>
              <Link href="/countries" className="text-muted-foreground hover:text-primary transition-colors">
                Countries Grid
              </Link>
              <Link href="/search" className="text-muted-foreground hover:text-primary transition-colors">
                Fuzzy Search
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                Methodology
              </Link>
            </div>
          </div>

          {/* About / Data source */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Data & Credits</h4>
            <p className="text-sm text-muted-foreground">
              Data dynamically loaded from the open-source{' '}
              <a
                href="https://github.com/gayanvoice/top-github-users"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                top-github-users
              </a>{' '}
              repository.
            </p>
            <div className="flex space-x-4 pt-1">
              <a
                href="https://github.com/gayanvoice/top-github-users"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {currentYear} GitDevRank. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Built for developers with</span>
            <Heart className="h-3 w-3 text-emerald-500 fill-emerald-500" />
            <span>and Next.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
