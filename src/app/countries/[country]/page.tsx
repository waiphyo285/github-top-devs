import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCountries, getPaginatedDevelopers } from '@/lib/data';
import { Avatar } from '@/components/ui/avatar';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Globe,
  Building,
  MapPin,
  ArrowLeft,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { FlagImage } from '@/components/ui/flag-image';

interface CountryPageProps {
  params: Promise<{
    country: string;
  }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export const revalidate = 0; // Dynamic page

export default async function CountryDetailPage({ params, searchParams }: CountryPageProps) {
  const routeParams = await params;
  const urlCountry = routeParams.country;
  
  const searchParamsVal = await searchParams;
  const page = Math.max(1, parseInt(searchParamsVal.page || '1', 10));
  const search = searchParamsVal.search || '';

  // Look up country metadata
  const countries = getCountries();
  const countryData = countries.find(
    (c) => c.country.toLowerCase().replace(/ /g, '_') === urlCountry.toLowerCase()
  );

  // If not found, trigger 404
  if (!countryData) {
    notFound();
  }

  // Sort parsing (default is countryRank for country ranking tables)
  const validSortBy = ['countryRank', 'globalRank', 'followers', 'score', 'publicContributions'];
  const sortBy = validSortBy.includes(searchParamsVal.sortBy || '')
    ? (searchParamsVal.sortBy as 'countryRank' | 'globalRank' | 'followers' | 'score' | 'publicContributions')
    : 'countryRank';
  
  const sortOrder = searchParamsVal.sortOrder === 'desc' ? 'desc' : 'asc';

  // Load paginated list of country developers
  const { data: devs, total, totalPages } = getPaginatedDevelopers({
    page,
    pageSize: 50,
    sortBy,
    sortOrder,
    search,
    country: countryData.country,
  });

  // Helper to build URL with updated params
  const createQueryString = (update: Record<string, string | number | undefined>) => {
    const current = new URLSearchParams();
    if (page > 1) current.set('page', page.toString());
    if (search) current.set('search', search);
    if (sortBy !== 'countryRank') current.set('sortBy', sortBy);
    if (sortOrder !== 'asc') current.set('sortOrder', sortOrder);

    Object.entries(update).forEach(([key, val]) => {
      if (val === undefined || val === '') {
        current.delete(key);
      } else {
        current.set(key, val.toString());
      }
    });

    const query = current.toString();
    return query ? `?${query}` : '';
  };

  const renderSortLink = (column: typeof sortBy, label: string) => {
    const isActive = sortBy === column;
    const nextOrder = isActive && sortOrder === 'asc' ? 'desc' : 'asc';
    const Icon = isActive ? (sortOrder === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown;

    return (
      <Link
        href={`/countries/${urlCountry}${createQueryString({ sortBy: column, sortOrder: nextOrder, page: 1 })}`}
        className={`inline-flex items-center gap-1 hover:text-primary transition-colors py-2 ${
          isActive ? 'text-primary font-bold' : 'text-muted-foreground'
        }`}
      >
        <span>{label}</span>
        <Icon className="h-3.5 w-3.5" />
      </Link>
    );
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Back to all countries link */}
      <div>
        <Link
          href="/countries"
          className={buttonVariants({
            variant: 'ghost',
            size: 'sm',
            className: '-ml-3 text-muted-foreground hover:text-foreground flex items-center gap-1 w-fit',
          })}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to countries</span>
        </Link>
      </div>

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/20 pb-6">
        <div className="flex items-center gap-5">
          {/* Wikipedia Flag */}
          <div className="relative h-12 w-20 overflow-hidden rounded-lg border border-border bg-muted/20 shadow-md shrink-0">
            <FlagImage
              src={countryData.flagUrl}
              alt={`${countryData.geoName} flag`}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <span>{countryData.geoName}</span>
              <span className="text-sm font-normal text-muted-foreground bg-secondary px-2.5 py-0.5 rounded font-mono uppercase">
                {countryData.country}
              </span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Top GitHub developers in {countryData.geoName}. Listing {Math.min(total, 50)} of {total.toLocaleString()} profiles.
            </p>
          </div>
        </div>

        {/* Global info card */}
        <div className="flex items-center gap-3 bg-card/45 border border-border/40 px-4 py-2.5 rounded-xl text-xs font-mono">
          <Globe className="h-4 w-4 text-primary" />
          <span>Regional ranking leaderboard</span>
        </div>
      </div>

      {/* Filtering Search Card */}
      <Card className="border-border/40 bg-card/25 backdrop-blur-sm">
        <CardContent className="p-4">
          <form method="GET" className="flex flex-col sm:flex-row gap-4">
            {sortBy !== 'countryRank' && <input type="hidden" name="sortBy" value={sortBy} />}
            {sortOrder !== 'asc' && <input type="hidden" name="sortOrder" value={sortOrder} />}

            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder={`Search developers in ${countryData.geoName} by name, username, company...`}
                className="w-full h-10 bg-secondary/60 border border-border/60 rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground/70"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-lg shadow-sm text-xs">
                Search Country
              </Button>
              {search && (
                <Link
                  href={`/countries/${urlCountry}`}
                  className={buttonVariants({
                    variant: 'outline',
                    className: 'h-10 border-border hover:bg-secondary text-xs flex items-center justify-center px-3 rounded-lg',
                  })}
                >
                  Reset
                </Link>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Rankings Table */}
      <div className="max-h-[600px] overflow-auto border border-border/40 rounded-2xl bg-card/15 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-card/95 backdrop-blur-md border-b border-border/30">
            <tr className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <th className="py-4 px-6 font-medium w-20">Rank</th>
              <th className="py-4 px-6 font-medium">Developer</th>
              <th className="py-4 px-6 font-medium w-32 text-right">
                {renderSortLink("followers", "Followers")}
              </th>
              <th className="py-4 px-6 font-medium w-36 text-right">
                {renderSortLink("publicContributions", "Contributions")}
              </th>
              <th className="py-4 px-6 font-medium w-32 text-right">
                {renderSortLink("score", "Score")}
              </th>
              <th className="py-4 px-6 font-medium w-24 text-center">
                {renderSortLink("globalRank", "Global")}
              </th>
              <th className="py-4 px-6 font-medium w-40">City / Location</th>
              <th className="py-4 px-6 font-medium w-16">Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {devs.length > 0 ? (
              devs.map((dev) => (
                <tr
                  key={`${dev.login}_${dev.country}`}
                  className="hover:bg-card/45 transition-colors group text-sm"
                >
                  {/* Local Country Rank */}
                  <td className="py-4 px-6 font-mono font-bold text-muted-foreground/80">
                    <span className="text-foreground">#{dev.countryRank}</span>
                  </td>

                  {/* Profile info */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3.5">
                      <Link
                        href={`/developers/${dev.login}`}
                        className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border/60 hover:border-primary/80 transition-all shadow-sm"
                      >
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
                          className="font-bold text-foreground hover:text-primary transition-colors truncate block"
                        >
                          {dev.name || dev.login}
                        </Link>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground/80 font-mono mt-0.5">
                          <span>@{dev.login}</span>
                          {dev.company && (
                            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-secondary/80 px-1.5 py-0.5 rounded max-w-[120px] truncate">
                              <Building className="h-2.5 w-2.5 shrink-0" />
                              <span className="truncate">{dev.company}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Followers */}
                  <td className="py-4 px-6 text-right font-mono font-bold text-foreground">
                    {dev.followers.toLocaleString()}
                  </td>

                  {/* Contributions */}
                  <td className="py-4 px-6 text-right font-mono text-muted-foreground/90">
                    <span className="text-foreground font-bold">
                      {dev.publicContributions.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-muted-foreground block">
                      public
                    </span>
                  </td>

                  {/* Score */}
                  <td className="py-4 px-6 text-right font-mono font-bold text-primary">
                    {dev.score.toLocaleString()}
                  </td>

                  {/* Global Rank badge */}
                  <td className="py-4 px-6 text-center">
                    <span className="inline-block px-2.5 py-1 text-xs font-mono font-bold bg-secondary rounded border border-border text-foreground">
                      #{dev.globalRank.toLocaleString()}
                    </span>
                  </td>

                  {/* Location info */}
                  <td className="py-4 px-6">
                    {dev.location ? (
                      <span className="text-xs text-muted-foreground/90 flex items-center gap-1 truncate max-w-[160px]">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                        <span className="truncate">{dev.location}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground/40 font-mono">—</span>
                    )}
                  </td>

                  {/* Profile link */}
                  <td className="py-4 px-6">
                    <Link
                      href={`/developers/${dev.login}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/60 text-muted-foreground hover:text-primary hover:bg-secondary/100 transition-colors border border-border/40"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-12 text-center text-muted-foreground font-medium">
                  No developers found matching the search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border/20 pt-6">
          <div className="text-sm text-muted-foreground font-mono">
            Page <span className="text-foreground font-bold">{page}</span> of{' '}
            <span className="text-foreground font-bold">{totalPages}</span>
          </div>

          <div className="flex space-x-2">
            {page > 1 ? (
              <Link
                href={`/countries/${urlCountry}${createQueryString({ page: page - 1 })}`}
                className={buttonVariants({
                  variant: 'outline',
                  className: 'h-9 border-border hover:bg-secondary flex items-center gap-1 px-3 text-sm',
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

            {/* Render limited page buttons */}
            <div className="hidden sm:flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p = page;
                if (page <= 3) {
                  p = i + 1;
                } else if (page >= totalPages - 2) {
                  p = totalPages - 4 + i;
                } else {
                  p = page - 2 + i;
                }

                if (p < 1 || p > totalPages) return null;

                const isCurrent = page === p;
                return isCurrent ? (
                  <Button
                    key={p}
                    variant="default"
                    className="h-9 w-9 p-0 font-mono bg-primary text-primary-foreground font-bold text-sm"
                  >
                    <span>{p}</span>
                  </Button>
                ) : (
                  <Link
                    key={p}
                    href={`/countries/${urlCountry}${createQueryString({ page: p })}`}
                    className={buttonVariants({
                      variant: 'outline',
                      className: 'h-9 w-9 p-0 font-mono border-border hover:bg-secondary flex items-center justify-center text-sm',
                    })}
                  >
                    {p}
                  </Link>
                );
              })}
            </div>

            {page < totalPages ? (
              <Link
                href={`/countries/${urlCountry}${createQueryString({ page: page + 1 })}`}
                className={buttonVariants({
                  variant: 'outline',
                  className: 'h-9 border-border hover:bg-secondary flex items-center gap-1 px-3 text-sm',
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
  );
}
