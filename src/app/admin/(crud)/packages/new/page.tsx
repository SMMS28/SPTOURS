import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ItineraryBuilder } from "@/components/admin/itinerary-builder";
import { createPackage } from "@/lib/actions/packages";

export const metadata = {
  title: "New Package | SP TOURS AND TRAVELLS",
};

export default async function NewPackagePage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold">Create package</h1>
      <p className="mt-2 text-muted-foreground">Add a package with pricing, duration, and publish status.</p>

      <form
        action={createPackage}
        data-confirm-message="Confirm creating this package?"
        className="mt-6 space-y-4 rounded-lg border p-6"
      >
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" placeholder="Bali Cultural Journey" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" placeholder="bali-cultural-journey" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input id="destination" name="destination" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="durationDays">Duration (days)</Label>
            <Input id="durationDays" name="durationDays" type="number" min={1} required />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="rawDuration">Duration (raw text)</Label>
            <Input id="rawDuration" name="rawDuration" placeholder="7 D / 6 N" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tagsType">Tags / Type</Label>
            <Input id="tagsType" name="tagsType" placeholder="GROUP TOUR | Long Tour" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sourceCategory">Source category</Label>
            <Input id="sourceCategory" name="sourceCategory" placeholder="India Tour Packages" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="externalLink">External reference link</Label>
            <Input id="externalLink" name="externalLink" placeholder="https://..." />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priceInr">Price (INR)</Label>
          <Input id="priceInr" name="priceInr" type="number" min={0} step="0.01" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="coverImage">Cover image path or URL</Label>
          <Input id="coverImage" name="coverImage" placeholder="/images/p1.jpg" />
          <Label htmlFor="coverPhotoFile" className="pt-1">
            Upload cover photo
          </Label>
          <Input id="coverPhotoFile" name="coverPhotoFile" type="file" accept="image/*" />
          <p className="text-xs text-muted-foreground">
            You can either paste a URL/path above or upload an image file here.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="shortDescription">Short description</Label>
          <Textarea id="shortDescription" name="shortDescription" rows={3} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Detailed description</Label>
          <Textarea id="description" name="description" rows={5} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inclusions">Inclusions (comma separated)</Label>
          <Input id="inclusions" name="inclusions" placeholder="Hotel, Breakfast, Transfers" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="photoUrls">Package photos (up to 10, one URL/path per line)</Label>
          <Textarea
            id="photoUrls"
            name="photoUrls"
            rows={5}
            placeholder="/images/p1.jpg&#10;/images/p2.jpg&#10;https://..."
          />
          <Label htmlFor="photoFiles" className="pt-1">
            Upload package photos (up to 10)
          </Label>
          <Input id="photoFiles" name="photoFiles" type="file" accept="image/*" multiple />
          <p className="text-xs text-muted-foreground">
            Upload files with this button, or paste image URLs above.
          </p>
        </div>
        <ItineraryBuilder />
        <div className="flex items-center gap-2">
          <input
            id="isPublished"
            name="isPublished"
            type="checkbox"
            className="size-4 rounded border"
            defaultChecked
          />
          <Label htmlFor="isPublished">Publish now</Label>
        </div>
        <Button type="submit">
          Save package
        </Button>
      </form>

      {params.message && (
        <p className="mt-4 text-sm text-muted-foreground">{params.message}</p>
      )}
    </div>
  );
}
