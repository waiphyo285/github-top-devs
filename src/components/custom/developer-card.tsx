"use client";

import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Developer, CountryMetadata } from "@/lib/data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface CardStyle {
  tierName: string;
  badgeEmoji: string;
  bgFromViaTo: string;
  ovrGradient: string;
  shadowColor: string;
  borderWrap: string;
  isLegendary: boolean;
  borderClass: string;
  bgGlow1: string;
  bgGlow2: string;
  avatarBorder: string;
  badgeClass: string;
  textClass: string;
}

const TIER_STYLES: Record<string, Omit<CardStyle, "isLegendary">> = {
  Legendary: {
    tierName: "Legendary",
    badgeEmoji: "🏆",
    bgFromViaTo: "from-[#181206] via-[#080602] to-[#181206]",
    ovrGradient: "from-amber-400 via-yellow-200 to-amber-500",
    shadowColor: "rgba(245,158,11,0.25)",
    borderWrap: "from-amber-400/40 via-yellow-500/20",
    borderClass: "border-2 border-amber-400/60",
    bgGlow1: "bg-amber-500/10",
    bgGlow2: "bg-yellow-500/10",
    avatarBorder: "border-amber-400/40",
    badgeClass: "bg-amber-400 border border-amber-400/30 text-stone-950",
    textClass: "text-amber-400",
  },
  Elite: {
    tierName: "Elite",
    badgeEmoji: "🔮",
    bgFromViaTo: "from-[#180e29] via-[#080310] to-[#180e29]",
    ovrGradient: "from-purple-400 via-fuchsia-300 to-purple-600",
    shadowColor: "rgba(168,85,247,0.2)",
    borderWrap: "from-purple-500/35 via-fuchsia-600/10",
    borderClass: "border border-purple-500/50",
    bgGlow1: "bg-purple-500/10",
    bgGlow2: "bg-fuchsia-600/5",
    avatarBorder: "border-purple-500/30",
    badgeClass: "bg-purple-500/10 border border-purple-500/20 text-purple-300",
    textClass: "text-purple-400",
  },
  Builder: {
    tierName: "Builder",
    badgeEmoji: "💎",

    bgFromViaTo: "from-[#061e14] via-[#010a06] to-[#061e14]",
    ovrGradient: "from-emerald-400 via-teal-300 to-emerald-600",
    shadowColor: "rgba(16,185,129,0.1)",
    borderWrap: "from-emerald-600/20 via-teal-950/10",
    borderClass: "border border-emerald-600/30",
    bgGlow1: "bg-emerald-500/10",
    bgGlow2: "bg-teal-600/5",
    avatarBorder: "border-emerald-500/30",
    badgeClass:
      "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400",
    textClass: "text-emerald-400",
  },
  Contributor: {
    tierName: "Contributor",
    badgeEmoji: "🍀",
    bgFromViaTo: "from-[#0b1b3a] via-[#020718] to-[#0b1b3a]",
    ovrGradient: "from-blue-400 via-cyan-300 to-indigo-500",
    shadowColor: "rgba(59,130,246,0.15)",
    borderWrap: "from-blue-500/25 via-indigo-600/10",
    borderClass: "border border-blue-500/40",
    bgGlow1: "bg-blue-500/10",
    bgGlow2: "bg-indigo-600/5",
    avatarBorder: "border-blue-500/30",
    badgeClass: "bg-blue-500/10 border border-blue-500/20 text-blue-300",
    textClass: "text-blue-400",
  },
};

const getCardStyle = (ovr: number): CardStyle => {
  if (ovr >= 90) return { ...TIER_STYLES.Legendary, isLegendary: true };
  if (ovr >= 85) return { ...TIER_STYLES.Elite, isLegendary: false };
  if (ovr >= 75) return { ...TIER_STYLES.Builder, isLegendary: false };
  return { ...TIER_STYLES.Contributor, isLegendary: false };
};

interface DeveloperCardProps {
  dev: Developer;
  countryMeta?: CountryMetadata;
  trigger: React.ReactNode;
}

export function DeveloperCard({
  dev,
  countryMeta,
  trigger,
}: DeveloperCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const totalContributions = dev.publicContributions + dev.privateContributions;

  const getOVR = (rank: number) => {
    if (rank <= 10) return 99;
    if (rank <= 50) return 98;
    if (rank <= 150) return 97;
    if (rank <= 500) return 96;
    if (rank <= 1000) return 95;
    if (rank <= 2000) return 94;
    if (rank <= 4000) return 93;
    if (rank <= 8000) return 92;
    if (rank <= 12000) return 91;
    if (rank <= 16000) return 90;
    if (rank <= 20000) return 89;
    if (rank <= 25000) return 88;
    if (rank <= 30000) return 87;
    if (rank <= 40000) return 85;
    if (rank <= 50000) return 83;
    if (rank <= 60000) return 80;
    if (rank <= 80000) return 75;
    if (rank <= 100000) return 70;
    return Math.max(60, 70 - Math.floor((rank - 100000) / 2000));
  };

  const ovr =
    dev.globalRank && dev.globalRank > 0 ? getOVR(dev.globalRank) : 60;
  const style = getCardStyle(ovr);

  let pctText = "UNRANKED";
  if (dev.globalRank && dev.globalRank > 0) {
    const pct = (dev.globalRank / 123072) * 100;
    if (pct <= 0.1) {
      pctText = "TOP 0.1% DEV";
    } else if (pct <= 1) {
      pctText = "TOP 1% DEV";
    } else {
      pctText = `TOP ${Math.ceil(pct)}% DEV`;
    }
  }

  const handleDownload = async () => {
    if (!cardRef.current || isDownloading) return;

    try {
      setIsDownloading(true);
      await new Promise((resolve) => setTimeout(resolve, 250));

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      });

      const link = document.createElement("a");
      link.download = `${dev.login}-card.png`;
      link.href = dataUrl;
      link.click();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to generate developer card image:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const textClass = style.textClass;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-[390px] bg-card border-border/40 text-foreground flex flex-col items-center p-5 rounded-2xl">
        <DialogHeader className="w-full text-center sm:text-center space-y-1 mb-2">
          <DialogTitle className="text-lg font-bold flex items-center justify-center gap-1.5 bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Developer Card</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Your GitHub journey, in one card.
          </DialogDescription>
        </DialogHeader>

        {/* Card Component (Will be captured as image) */}
        <div
          className={`p-1 rounded-2xl bg-gradient-to-b ${style.borderWrap} to-transparent`}
        >
          <div
            ref={cardRef}
            style={{ boxShadow: `0 0 40px ${style.shadowColor}` }}
            className={`w-[330px] h-[495px] bg-gradient-to-b ${style.bgFromViaTo} ${style.borderClass} rounded-2xl p-6 relative flex flex-col items-center text-center text-white overflow-hidden font-sans`}
          >
            {/* Background Glows */}
            <div
              className={`absolute -top-16 -right-16 w-40 h-40 ${style.bgGlow1} rounded-full blur-3xl pointer-events-none`}
            />
            <div
              className={`absolute -bottom-16 -left-16 w-40 h-40 ${style.bgGlow2} rounded-full blur-3xl pointer-events-none`}
            />

            {/* OVR Rating badge top-left */}
            <div className="absolute top-5 left-5 text-left leading-none">
              <div
                className={`text-4xl font-black font-mono tracking-tighter bg-gradient-to-br ${style.ovrGradient} bg-clip-text text-transparent`}
              >
                {ovr}
              </div>
            </div>

            {/* Avatar in the middle */}
            <div
              className={`mt-8 relative h-28 w-28 overflow-hidden rounded-full border-2 ${style.avatarBorder} p-1 bg-[#080c14] shadow-[0_0_20px_rgba(16,185,129,0.15)] shrink-0`}
            >
              <img
                src={dev.avatarUrl}
                alt={`${dev.login} avatar`}
                crossOrigin="anonymous"
                className="object-cover w-full h-full rounded-full"
              />
            </div>

            {/* Developer Names */}
            <div className="mt-4 space-y-0.5 w-full px-2">
              <h2 className="text-lg font-bold text-slate-100 tracking-tight truncate leading-tight">
                {dev.name || dev.login}
              </h2>
              <p className="text-xs font-mono text-muted-foreground">
                @{dev.login}
              </p>
            </div>

            {/* Divider */}
            <div className="w-full border-t border-slate-800/60 my-4" />

            {/* Leaderboard Rankings */}
            <div className="w-full space-y-2.5 px-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-mono text-[9px] uppercase tracking-wider">
                  Global Rank
                </span>
                <span className="font-bold font-mono text-slate-100">
                  {dev.globalRank && dev.globalRank > 0
                    ? `#${dev.globalRank.toLocaleString()}`
                    : "Unranked"}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-mono text-[9px] uppercase tracking-wider">
                  Country Rank
                </span>
                <span
                  className={`font-bold font-mono ${textClass} flex items-center gap-1.5`}
                >
                  {dev.countryRank && dev.countryRank > 0
                    ? `#${dev.countryRank.toLocaleString()}`
                    : "Unranked"}
                  {countryMeta && dev.countryRank && dev.countryRank > 0 && (
                    <img
                      src={countryMeta.flagUrl}
                      alt={`${dev.countryName} flag`}
                      crossOrigin="anonymous"
                      className="w-4.5 h-3 object-cover rounded-sm border border-slate-800/40"
                    />
                  )}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full border-t border-slate-800/60 my-4" />

            {/* Key Stats (Grid of 3 columns) */}
            <div className="grid grid-cols-3 w-full gap-2 px-1">
              <div className="text-center">
                <div className="text-[9px] font-bold font-mono text-muted-foreground uppercase tracking-wider">
                  Followers
                </div>
                <div className="text-xs font-extrabold font-mono text-slate-100 mt-0.5">
                  {dev.followers.toLocaleString()}
                </div>
              </div>
              <div className="text-center border-x border-slate-800/60">
                <div className="text-[9px] font-bold font-mono text-muted-foreground uppercase tracking-wider">
                  Contribs
                </div>
                <div className="text-xs font-extrabold font-mono text-slate-100 mt-0.5">
                  {totalContributions.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[9px] font-bold font-mono text-muted-foreground uppercase tracking-wider">
                  Score
                </div>
                <div
                  className={`text-xs font-extrabold font-mono ${textClass} mt-0.5`}
                >
                  {dev.score.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Spacer to push badge to bottom */}
            <div className="flex-1" />

            {/* Developer Level Badge */}
            <div
              className={`w-full py-2 rounded-xl text-center shadow-sm ${style.badgeClass}`}
            >
              <span className="text-[10px] font-black tracking-widest uppercase">
                {style.badgeEmoji} {style.tierName} • {pctText}
              </span>
            </div>

            {/* Footer Branding */}
            <div className="mt-4 text-[9px] font-mono text-muted-foreground/60 tracking-wider">
              Powered by github-top-devs.vercel.app
            </div>
          </div>
        </div>

        <DialogFooter className="w-full mt-4 flex sm:flex-row gap-2">
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/95 font-bold shadow-md shadow-primary/10 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>{isDownloading ? "Generating..." : "Save as PNG"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
