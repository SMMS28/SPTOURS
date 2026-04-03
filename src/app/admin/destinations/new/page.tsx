import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createDestination } from "@/lib/actions/destinations";

export const metadata = {
  title: "New Destination | SP TOURS AND TRAVELLS",
};

export default async function NewDestinationPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold">Create destination</h1>
      <p className="mt-2 text-muted-foreground">Add a destination used in package discovery and publishing.</p>

      <form action={createDestination} className="mt-6 space-y-4 rounded-lg border p-6" data-confirm-message="Confirm creating this destination?">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="Meghalaya" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" name="country" placeholder="India" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" placeholder="meghalaya" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={5} />
        </div>
        <div className="flex items-center gap-2">
          <input id="isPublished" name="isPublished" type="checkbox" className="size-4 rounded border" defaultChecked />
          <Label htmlFor="isPublished">Publish now</Label>
        </div>
        <Button type="submit">Save destination</Button>
      </form>

      {params.message && <p className="mt-4 text-sm text-muted-foreground">{params.message}</p>}
    </div>
  );
}