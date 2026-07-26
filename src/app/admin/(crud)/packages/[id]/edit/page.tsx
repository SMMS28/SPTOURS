import { notFound } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ItineraryBuilder } from "@/components/admin/itinerary-builder";
import { updatePackage } from "@/lib/actions/packages";
import { getPackageByIdForAdmin, getPackageExtrasByIdForAdmin } from "@/lib/data/packages";

export default async function EditPackagePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ message?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const travelPackage = await getPackageByIdForAdmin(id);
  const extras = await getPackageExtrasByIdForAdmin(id);

  if (!travelPackage) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold">Edit package</h1>
      <p className="mt-2 text-muted-foreground">Update package details and publish status.</p>

      <form
        action={updatePackage}
        data-confirm-message="Confirm updating this package?"
        className="mt-6 space-y-4 rounded-lg border p-6"
      >
        <input type="hidden" name="packageId" value={travelPackage.id} />
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={travelPackage.title} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={travelPackage.slug} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input id="destination" name="destination" defaultValue={travelPackage.destination} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" defaultValue={travelPackage.location} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="durationDays">Duration (days)</Label>
            <Input
              id="durationDays"
              name="durationDays"
              type="number"
              min={1}
              defaultValue={travelPackage.duration_days}
              required
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="rawDuration">Duration (raw text)</Label>
            <Input
              id="rawDuration"
              name="rawDuration"
              defaultValue={travelPackage.raw_duration ?? ""}
              placeholder="7 D / 6 N"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tagsType">Tags / Type</Label>
            <Input
              id="tagsType"
              name="tagsType"
              defaultValue={travelPackage.tags_type ?? ""}
              placeholder="GROUP TOUR | Long Tour"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sourceCategory">Source category</Label>
            <Input
              id="sourceCategory"
              name="sourceCategory"
              defaultValue={travelPackage.source_category ?? ""}
              placeholder="India Tour Packages"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="externalLink">External reference link</Label>
            <Input
              id="externalLink"
              name="externalLink"
              defaultValue={travelPackage.external_link ?? ""}
              placeholder="https://..."
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priceInr">Price (INR)</Label>
          <Input
            id="priceInr"
            name="priceInr"
            type="number"
            min={0}
            step="0.01"
            defaultValue={travelPackage.price_inr}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="coverImage">Cover image path or URL</Label>
          <Input
            id="coverImage"
            name="coverImage"
            defaultValue={travelPackage.cover_image ?? ""}
            placeholder="/images/p1.jpg"
          />
          <Label htmlFor="coverPhotoFile" className="pt-1">
            Upload new cover photo
          </Label>
          <Input id="coverPhotoFile" name="coverPhotoFile" type="file" accept="image/*" />
          <p className="text-xs text-muted-foreground">
            Uploading a file here will replace the current cover image.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="shortDescription">Short description</Label>
          <Textarea
            id="shortDescription"
            name="shortDescription"
            rows={3}
            defaultValue={travelPackage.short_description}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Detailed description</Label>
          <Textarea id="description" name="description" rows={5} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inclusions">Inclusions (comma separated)</Label>
          <Input
            id="inclusions"
            name="inclusions"
            defaultValue={travelPackage.inclusions.join(", ")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="photoUrls">Package photos (up to 10, one URL/path per line)</Label>
          <Textarea
            id="photoUrls"
            name="photoUrls"
            rows={5}
            defaultValue={extras.imagePaths.slice(0, 10).join("\n")}
            placeholder="/images/p1.jpg&#10;/images/p2.jpg&#10;https://..."
          />
          <Label htmlFor="photoFiles" className="pt-1">
            Upload additional package photos
          </Label>
          <Input id="photoFiles" name="photoFiles" type="file" accept="image/*" multiple />
          <p className="text-xs text-muted-foreground">
            Uploaded files are added to the package gallery with the URLs listed above (max 10 total).
          </p>
        </div>
        <ItineraryBuilder initialRows={extras.itineraryRows} />
        <div className="flex items-center gap-2">
          <input
            id="isPublished"
            name="isPublished"
            type="checkbox"
            className="size-4 rounded border"
            defaultChecked={travelPackage.is_published}
          />
          <Label htmlFor="isPublished">Published</Label>
        </div>
        <Button type="submit">
          Update package
        </Button>
      </form>

      {query.message && <p className="mt-4 text-sm text-muted-foreground">{query.message}</p>}
    </div>
  );
}
