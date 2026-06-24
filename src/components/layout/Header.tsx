'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Users, Globe, Search, Info } from 'lucide-react';
import { GithubIcon as Github } from '@/components/ui/github-icon';
import { buttonVariants } from '@/components/ui/button';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Developers', href: '/developers', icon: Users },
    { name: 'Countries', href: '/countries', icon: Globe },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'About', href: '/about', icon: Info },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Github Top Devs
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-secondary text-primary'
                      : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* External Links & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-3">
            <a
              href="https://github.com/gayanvoice/top-github-users"
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({
                variant: 'outline',
                size: 'sm',
                className: 'border-primary/20 hover:bg-primary/5 flex items-center space-x-2',
              })}
            >
              <Github className="h-4 w-4" />
              <span>Source Data</span>
            </a>
          </div>

          {/* Mobile elements (Theme Toggle + Menu button) */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border/40 bg-background/95 px-4 py-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 rounded-md px-3 py-2.5 text-base font-medium transition-colors ${
                  active
                    ? 'bg-secondary text-primary'
                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div className="pt-4 pb-2 border-t border-border/40">
            <a
              href="https://github.com/gayanvoice/top-github-users"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-3 rounded-md px-3 py-2.5 text-base font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            >
              <Github className="h-5 w-5" />
              <span>Source Data</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
