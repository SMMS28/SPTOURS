"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { linkButton } from "@/lib/link-styles";
import { getSafePackageImageSrc } from "@/lib/data/media";
import { getDurationSummary } from "@/lib/duration";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TravelPackage } from "@/lib/types";

export const PackageCard = ({ travelPackage }: { travelPackage: TravelPackage }) => {
  const duration = getDurationSummary(travelPackage.duration_days, travelPackage.raw_duration);
  const imageSources = useMemo(() => {
    const gallery =
      travelPackage.package_images
        ?.slice()
        .sort((first, second) => first.sort_order - second.sort_order)
        .map((image) => getSafePackageImageSrc(image.storage_path, `${travelPackage.slug}-${image.sort_order}`)) ?? [];

    if (gallery.length > 0) {
      return gallery;
    }

    return [getSafePackageImageSrc(travelPackage.cover_image, travelPackage.slug)];
  }, [travelPackage.cover_image, travelPackage.package_images, travelPackage.slug]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (imageSources.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveImageIndex((currentIndex) => (currentIndex + 1) % imageSources.length);
    }, 3000);

    return () => {
      window.clearInterval(interval);
    };
  }, [imageSources.length]);

  return (
    <Card className="group/card h-full animate-fade-up transition-transform duration-300 hover:-translate-y-1">
      <div className="relative h-44 overflow-hidden border-b">
        <Image
          src={imageSources[activeImageIndex]}
          alt="Travel package preview"
          fill
          className="object-cover transition-transform duration-500 group-hover/card:scale-105"
        />
        {imageSources.length > 1 && (
          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/40 px-2 py-1">
            {imageSources.map((_, index) => (
              <span
                key={`${travelPackage.slug}-dot-${index}`}
                className={`h-1.5 w-1.5 rounded-full ${
                  index === activeImageIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle>{travelPackage.title}</CardTitle>
        <CardDescription>
          {travelPackage.destination}, {travelPackage.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{travelPackage.short_description}</p>
        <div className="flex flex-wrap gap-2">
          {travelPackage.tags_type && (
            <Badge variant="outline">{travelPackage.tags_type}</Badge>
          )}
          {travelPackage.inclusions.slice(0, 3).map((item) => (
            <Badge key={item} variant="secondary">
              {item}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm text-muted-foreground">
            {duration.label}
          </p>
          <p className="text-lg font-semibold">₹{travelPackage.price_inr.toLocaleString("en-IN")}</p>
        </div>
        <Link href={`/packages/${travelPackage.slug}`} className={linkButton()}>
          View details
        </Link>
      </CardFooter>
    </Card>
  );
};
