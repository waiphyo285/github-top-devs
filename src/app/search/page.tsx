import React from "react";
import Link from "next/link";
import { getPaginatedDevelopers, getCountries } from "@/lib/data";
import { Avatar } from "@/components/ui/avatar";
import {
  Search,
  MapPin,
  Building,
  ChevronRight,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { FlagImage } from "@/components/custom/flag-image";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

export const revalidate = 0; // Dynamic search page

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const page = Math.max(1, parseInt(params.page || "1", 10));

  // Fetch paginated results for search query
  let devs: ReturnType<typeof getPaginatedDevelopers>["data"] = [];
  let total = 0;
  let totalPages = 0;

  if (query) {
    const result = getPaginatedDevelopers({
      page,
      pageSize: 30,
      sortBy: "score",
      sortOrder: "desc",
      search: query,
    });
    devs = result.data;
    total = result.total;
    totalPages = result.totalPages;
  }

  // Load countries catalog to map flag URLs for results
  const countries = getCountries();
  const getFlagUrl = (countryName: string) => {
    const match = countries.find(
      (c) => c.country.toLowerCase() === countryName.toLowerCase(),
    );
    return match ? match.flagUrl : null;
  };

  // Helper to build URL pagination
  const createPaginationUrl = (newPage: number) => {
    return `/search?q=${encodeURIComponent(query)}&page=${newPage}`;
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Header & Search Bar */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Global Search
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Query across the database of 120,000+ developers, countries, and
            companies.
          </p>
        </div>

        {/* Big Search Input */}
        <Card className="border-border/40 bg-card/25 backdrop-blur-sm p-2 shadow-lg">
          <CardContent className="p-0">
            <form
              method="GET"
              action="/search"
              className="relative flex items-center"
            >
              <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search name, username, company, location or country..."
                required
                className="w-full bg-transparent border-0 rounded-xl py-4 pl-12 pr-28 text-sm sm:text-base focus:outline-none placeholder:text-muted-foreground/60 text-foreground"
              />
              <button
                type="submit"
                className="absolute right-2 px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg text-xs sm:text-sm hover:bg-primary/95 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              >
                Search
              </button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Search results */}
      {query ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border/20 pb-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Search Results
            </h3>
            <span className="text-xs font-mono bg-secondary px-2.5 py-0.5 rounded text-foreground">
              {total.toLocaleString()} matches
            </span>
          </div>

          {devs.length > 0 ? (
            <div className="space-y-3">
              {devs.map((dev) => {
                const flagUrl = getFlagUrl(dev.country);
                return (
                  <div
                    key={`${dev.login}_${dev.country}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border/40 bg-card/25 hover:bg-card/45 transition-colors gap-4"
                  >
                    <div className="flex items-center space-x-4 min-w-0">
                      <Link
                        href={`/developers/${dev.login}`}
                        className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border hover:border-primary transition-all"
                      >
                        <Avatar
                          src={dev.avatarUrl}
                          alt={`${dev.login} avatar`}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </Link>

                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Link
                            href={`/developers/${dev.login}`}
                            className="text-base font-bold text-foreground hover:text-primary transition-colors truncate"
                          >
                            {dev.name || dev.login}
                          </Link>
                          <span className="text-xs text-muted-foreground font-mono">
                            @{dev.login}
                          </span>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          {dev.company && (
                            <span className="inline-flex items-center gap-1 bg-secondary/60 px-2 py-0.5 rounded max-w-[150px] truncate">
                              <Building className="h-3 w-3 shrink-0" />
                              <span className="truncate">{dev.company}</span>
                            </span>
                          )}

                          {dev.location && (
                            <span className="inline-flex items-center gap-1 bg-secondary/60 px-2 py-0.5 rounded max-w-[150px] truncate">
                              <MapPin className="h-3 w-3 shrink-0" />
                              <span className="truncate">{dev.location}</span>
                            </span>
                          )}

                          <span className="inline-flex items-center gap-1 bg-secondary/60 px-2 py-0.5 rounded">
                            {flagUrl && (
                              <span className="relative h-2.5 w-3.5 overflow-hidden rounded border border-border/10">
                                <FlagImage
                                  src={flagUrl}
                                  alt=""
                                  className="object-cover w-full h-full"
                                />
                              </span>
                            )}
                            <span>{dev.countryName}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats & Rank */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-border/10 sm:border-t-0 pt-3 sm:pt-0 shrink-0">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">
                          Global Rank
                        </span>
                        <span className="text-sm font-bold font-mono text-foreground">
                          #{dev.globalRank?.toLocaleString()}
                        </span>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">
                          Followers
                        </span>
                        <span className="text-sm font-bold font-mono text-foreground">
                          {dev.followers.toLocaleString()}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-primary block font-bold uppercase tracking-wider">
                          Score
                        </span>
                        <span className="text-sm font-bold font-mono text-primary">
                          {dev.score.toLocaleString()}
                        </span>
                      </div>

                      <Link
                        href={`/developers/${dev.login}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/50 text-muted-foreground hover:text-primary hover:bg-secondary border border-border/40"
                      >
                        <ChevronRight className="h-4.5 w-4.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Card className="border-border/40 bg-card/25 p-8 text-center">
              <p className="text-muted-foreground font-semibold">
                No developers match your query. Try something else.
              </p>
            </Card>
          )}

          {/* Search Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border/20 pt-6">
              <div className="text-sm text-muted-foreground font-mono">
                Page <span className="text-foreground font-bold">{page}</span>{" "}
                of{" "}
                <span className="text-foreground font-bold">{totalPages}</span>
              </div>

              <div className="flex space-x-2">
                {page > 1 ? (
                  <Link
                    href={createPaginationUrl(page - 1)}
                    className={buttonVariants({
                      variant: "outline",
                      className:
                        "h-9 border-border hover:bg-secondary flex items-center gap-1 px-3 text-sm",
                    })}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Prev</span>
                  </Link>
                ) : (
                  <Button
                    variant="outline"
                    disabled
                    className="h-9 border-border disabled:opacity-50 flex items-center gap-1 cursor-not-allowed px-3 text-sm"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Prev</span>
                  </Button>
                )}

                {page < totalPages ? (
                  <Link
                    href={createPaginationUrl(page + 1)}
                    className={buttonVariants({
                      variant: "outline",
                      className:
                        "h-9 border-border hover:bg-secondary flex items-center gap-1 px-3 text-sm",
                    })}
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <Button
                    variant="outline"
                    disabled
                    className="h-9 border-border disabled:opacity-50 flex items-center gap-1 cursor-not-allowed px-3 text-sm"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty/Entry state */
        <div className="space-y-6 pt-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="h-4.5 w-4.5 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Search suggestions
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Specific Usernames",
                desc: 'Type exact handles like "aung aung", "kyaw kyaw", or "waiphyo".',
                query: "aung aung",
              },
              {
                title: "Company / Organization",
                desc: 'Search for developers at organizations like "KBZ Bank", "Wave Money", or "AYA Bank".',
                query: "KBZ Bank",
              },
              {
                title: "City or Region",
                desc: 'Discover developers located in cities like "Yangon", "Mandalay", or "Naypyidaw".',
                query: "Yangon",
              },
            ].map((suggest, index) => (
              <Link
                key={index}
                href={`/search?q=${suggest.query}`}
                className="group border border-border/40 bg-card/20 p-5 rounded-xl hover:border-primary/30 transition-all hover:bg-card/40"
              >
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm">
                  {suggest.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {suggest.desc}
                </p>
                <div className="text-xs text-primary font-bold mt-4 inline-flex items-center gap-1">
                  <span>Try: &quot;{suggest.query}&quot;</span>
                  <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
