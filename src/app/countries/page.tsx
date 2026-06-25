import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { getCountries } from "@/lib/data";
import {
  Globe,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Users,
  ArrowDownAZ,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { FlagImage } from "@/components/custom/flag-image";

export const metadata: Metadata = {
  title: "Explore Countries | Github Top Devs",
  description:
    "Browse GitHub developer rankings across different countries and regions, including Myanmar, USA, Germany, Denmark, and more.",
};

interface PageProps {
  searchParams: Promise<{
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export const revalidate = 3600;

export default async function CountriesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const sortBy = params.sortBy === "name" ? "name" : "developerCount";
  const sortOrder = params.sortOrder === "asc" ? "asc" : "desc";

  let list = getCountries();

  if (search) {
    const query = search.toLowerCase().trim();
    list = list.filter(
      (c) =>
        c.country.toLowerCase().includes(query) ||
        c.geoName.toLowerCase().includes(query),
    );
  }

  list.sort((a, b) => {
    if (sortBy === "name") {
      const nameA = a.geoName.toLowerCase();
      const nameB = b.geoName.toLowerCase();
      if (nameA < nameB) return sortOrder === "asc" ? -1 : 1;
      if (nameA > nameB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    } else {
      const countA = a.developerCount;
      const fontB = b.developerCount;
      return sortOrder === "asc" ? countA - fontB : fontB - countA;
    }
  });

  const myanmarIndex = list.findIndex(
    (c) => c.country.toLowerCase() === "myanmar",
  );
  if (myanmarIndex > -1) {
    const [myanmar] = list.splice(myanmarIndex, 1);
    list.unshift(myanmar);
  }

  const createQueryString = (update: Record<string, string | undefined>) => {
    const current = new URLSearchParams();
    if (search) current.set("search", search);
    if (sortBy !== "developerCount") current.set("sortBy", sortBy);
    if (sortOrder !== "desc") current.set("sortOrder", sortOrder);

    Object.entries(update).forEach(([key, val]) => {
      if (val === undefined || val === "") {
        current.delete(key);
      } else {
        current.set(key, val);
      }
    });

    const query = current.toString();
    return query ? `?${query}` : "";
  };

  const renderSortLink = (
    column: typeof sortBy,
    label: string,
    SortIcon: React.ComponentType<{ className?: string }>,
  ) => {
    const isActive = sortBy === column;
    const nextOrder = isActive && sortOrder === "desc" ? "asc" : "desc";
    const Icon = isActive
      ? sortOrder === "asc"
        ? ArrowUp
        : ArrowDown
      : ArrowUpDown;

    return (
      <Link
        href={`/countries${createQueryString({ sortBy: column, sortOrder: nextOrder })}`}
        title={label}
        className={`inline-flex items-center gap-1.5 hover:text-primary transition-colors text-xs font-semibold px-2.5 py-1.5 rounded-lg border ${
          isActive
            ? "bg-primary/10 text-primary border-primary/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]"
            : "border-border bg-card/40 text-muted-foreground"
        }`}
      >
        <SortIcon className="h-4 w-4" />
        <Icon className="h-3 w-3 text-muted-foreground/60" />
      </Link>
    );
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/20 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Explore Countries
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse ranking databases across {list.length} countries and regions.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-card/40 border border-border/40 px-4 py-2.5 rounded-xl text-xs font-mono">
          <Globe className="h-4 w-4 text-primary animate-spin-slow" />
          <span>Select a country to view regional ranks</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <form
          method="GET"
          className="relative flex items-center max-w-sm w-full"
        >
          {sortBy !== "developerCount" && (
            <input type="hidden" name="sortBy" value={sortBy} />
          )}
          {sortOrder !== "desc" && (
            <input type="hidden" name="sortOrder" value={sortOrder} />
          )}
          <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search countries..."
            className="w-full bg-secondary/60 border border-border/60 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground/70"
          />
        </form>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground font-mono">
            Sort by:
          </span>
          {renderSortLink("developerCount", "Sort by Developer Count", Users)}
          {renderSortLink("name", "Sort Alphabetically", ArrowDownAZ)}
        </div>
      </div>

      {list.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {list.map((c) => {
            const isMyanmar = c.country.toLowerCase() === "myanmar";
            return (
              <Link
                key={c.country}
                href={`/countries/${c.country.toLowerCase().replace(/ /g, "_")}`}
                className="group"
              >
                <Card
                  className={`h-full bg-card/20 hover:bg-card/45 hover:border-primary/30 hover:ring-primary/30 transition-all shadow-sm group-hover:-translate-y-1 duration-200 ${
                    isMyanmar
                      ? "border-primary/30 ring-primary/30"
                      : "border-border/40"
                  }`}
                >
                  <CardContent className="p-4 flex flex-col h-full space-y-4">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border/40 bg-muted/20">
                      <FlagImage
                        src={c.flagUrl}
                        alt={`${c.geoName} flag`}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-base truncate">
                          {c.geoName}
                        </h3>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate uppercase">
                          {c.country}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border/10">
                        <span className="text-xs text-muted-foreground">
                          Top Developers
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs font-mono font-bold bg-secondary px-2.5 py-0.5 rounded text-foreground">
                            {c.developerCount.toLocaleString()}
                          </span>
                          <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-border/40 rounded-2xl">
          <p className="text-muted-foreground font-medium">
            No countries found matching your search.
          </p>
          <Link
            href="/countries"
            className={buttonVariants({
              variant: "link",
              className: "text-primary mt-2",
            })}
          >
            Reset Search
          </Link>
        </div>
      )}
    </div>
  );
}
