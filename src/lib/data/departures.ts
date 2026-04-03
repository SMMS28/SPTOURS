export type DepartureSlot = {
  date: string;
  label: string;
  availability: "available" | "limited";
};

const formatDateLabel = (date: Date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

const hashSeed = (value: string) =>
  value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

export const generateDepartureCalendar = (slug: string, daysAhead = 45): DepartureSlot[] => {
  const safeDaysAhead = Math.max(daysAhead, 14);
  const seed = hashSeed(slug);

  const totalSlots = Math.max(6, Math.min(12, Math.floor(safeDaysAhead / 6)));
  const slots: DepartureSlot[] = [];

  for (let index = 0; index < totalSlots; index += 1) {
    const offset = 3 + index * 5 + (seed % 3);
    if (offset > safeDaysAhead) {
      break;
    }

    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + offset);

    slots.push({
      date: date.toISOString(),
      label: formatDateLabel(date),
      availability: (index + seed) % 3 === 0 ? "limited" : "available",
    });
  }

  return slots;
};
