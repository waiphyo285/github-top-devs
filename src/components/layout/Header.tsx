"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Users,
  Globe,
  Search,
  Info,
  ChevronDown,
  Database,
  Code2,
} from "lucide-react";
import { GithubIcon as Github } from "@/components/custom/github-icon";
import { buttonVariants } from "@/components/ui/button";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [gitHubMenuOpen, setGitHubMenuOpen] = useState(false);

  const navigation = [
    { name: "Developers", href: "/developers", icon: Users },
    { name: "Countries", href: "/countries", icon: Globe },
    { name: "Search", href: "/search", icon: Search },
    { name: "About", href: "/about", icon: Info },
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
                      ? "bg-secondary text-primary"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* External Links Dropdown */}
          <div className="hidden md:flex items-center space-x-3 relative">
            <button
              onClick={() => setGitHubMenuOpen(!gitHubMenuOpen)}
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className:
                  "border-primary/20 hover:bg-secondary/50 flex items-center space-x-1 h-9 px-2 rounded-md cursor-pointer",
              })}
              title="GitHub Repositories"
            >
              <Github className="h-4 w-4" />
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>

            {gitHubMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setGitHubMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 origin-top-right rounded-xl border border-border/40 bg-card/95 backdrop-blur-md p-1 shadow-lg z-20">
                  <a
                    href="https://github.com/waiphyo285/github-top-devs"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setGitHubMenuOpen(false)}
                    className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    <Code2 className="h-4 w-4 text-emerald-400" />
                    <span>Source Code</span>
                  </a>
                  <a
                    href="https://github.com/gayanvoice/top-github-users"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setGitHubMenuOpen(false)}
                    className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    <Database className="h-4 w-4 text-emerald-400" />
                    <span>Source Data</span>
                  </a>
                </div>
              </>
            )}
          </div>

          {/* Mobile elements (Theme Toggle + Menu button) */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
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
                    ? "bg-secondary text-primary"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div className="pt-4 pb-2 border-t border-border/40 space-y-2">
            <a
              href="https://github.com/waiphyo285/github-top-devs"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-3 rounded-md px-3 py-2.5 text-base font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            >
              <Code2 className="h-5 w-5 text-emerald-400" />
              <span>Source Code</span>
            </a>
            <a
              href="https://github.com/gayanvoice/top-github-users"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-3 rounded-md px-3 py-2.5 text-base font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            >
              <Database className="h-5 w-5 text-emerald-400" />
              <span>Source Data</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
