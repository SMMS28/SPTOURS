"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ItineraryRow = {
  day_number: number;
  title: string;
  details: string;
};

const createEmptyRow = (day: number): ItineraryRow => ({
  day_number: day,
  title: "",
  details: "",
});

export function ItineraryBuilder({
  initialRows,
}: {
  initialRows?: ItineraryRow[];
}) {
  const sortedInitialRows = useMemo(() => {
    if (!initialRows?.length) {
      return [createEmptyRow(1)];
    }

    return [...initialRows].sort((a, b) => a.day_number - b.day_number);
  }, [initialRows]);

  const [rows, setRows] = useState<ItineraryRow[]>(sortedInitialRows);

  const addRow = () => {
    setRows((prev) => {
      const nextDay = Math.min(30, Math.max(1, ...prev.map((row) => row.day_number)) + 1);
      return [...prev, createEmptyRow(nextDay)];
    });
  };

  const removeRow = (index: number) => {
    setRows((prev) => {
      if (prev.length === 1) {
        return [createEmptyRow(1)];
      }
      return prev.filter((_, rowIndex) => rowIndex !== index);
    });
  };

  const updateRow = (index: number, updates: Partial<ItineraryRow>) => {
    setRows((prev) =>
      prev.map((row, rowIndex) => (rowIndex === index ? { ...row, ...updates } : row)),
    );
  };

  return (
    <div className="space-y-3 rounded-md border p-4">
      <div className="flex items-center justify-between">
        <Label>Day-wise itinerary</Label>
        <Button type="button" variant="outline" size="sm" onClick={addRow}>
          + Add day
        </Button>
      </div>

      {rows.map((row, index) => (
        <div key={`itinerary-${index}`} className="rounded-md border p-3 space-y-2">
          <div className="grid gap-2 sm:grid-cols-[130px_1fr_auto] sm:items-end">
            <div className="space-y-1">
              <Label htmlFor={`day-${index}`}>Day</Label>
              <select
                id={`day-${index}`}
                value={row.day_number}
                onChange={(event) => updateRow(index, { day_number: Number(event.target.value) })}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                {Array.from({ length: 30 }).map((_, dayIndex) => {
                  const day = dayIndex + 1;
                  return (
                    <option key={day} value={day}>
                      Day {day}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor={`title-${index}`}>Title</Label>
              <Input
                id={`title-${index}`}
                value={row.title}
                onChange={(event) => updateRow(index, { title: event.target.value })}
                placeholder="Arrival and check-in"
              />
            </div>

            <Button type="button" variant="outline" size="sm" onClick={() => removeRow(index)}>
              - Remove
            </Button>
          </div>

          <div className="space-y-1">
            <Label htmlFor={`details-${index}`}>Details</Label>
            <Textarea
              id={`details-${index}`}
              rows={3}
              value={row.details}
              onChange={(event) => updateRow(index, { details: event.target.value })}
              placeholder="Airport transfer and hotel check-in"
            />
          </div>
        </div>
      ))}

      <input type="hidden" name="itineraryJson" value={JSON.stringify(rows)} />
      <p className="text-xs text-muted-foreground">
        Use + and - to add or remove days, then pick Day 1, Day 2, etc. from the dropdown.
      </p>
    </div>
  );
}
