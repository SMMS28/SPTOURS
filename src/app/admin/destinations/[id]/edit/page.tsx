import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateDestination } from "@/lib/actions/destinations";
import { getDestinationByIdForAdmin } from "@/lib/data/destinations";

export default async function EditDestinationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ message?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const destination = await getDestinationByIdForAdmin(id);

  if (!destination) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold">Edit destination</h1>
      <p className="mt-2 text-muted-foreground">Update destination details and publish status.</p>

      <form action={updateDestination} className="mt-6 space-y-4 rounded-lg border p-6" data-confirm-message="Confirm updating this destination?">
        <input type="hidden" name="id" value={destination.id} />
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={destination.name} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" name="country" defaultValue={destination.country} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" defaultValue={destination.slug} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={5} defaultValue={destination.description ?? ""} />
        </div>
        <div className="flex items-center gap-2">
          <input id="isPublished" name="isPublished" type="checkbox" className="size-4 rounded border" defaultChecked={destination.is_published} />
          <Label htmlFor="isPublished">Published</Label>
        </div>
        <Button type="submit">Update destination</Button>
      </form>

      {query.message && <p className="mt-4 text-sm text-muted-foreground">{query.message}</p>}
    </div>
  );
}