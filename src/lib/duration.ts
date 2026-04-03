const durationPattern = /(\d+)\s*(?:d|day)/i;
const nightPattern = /(\d+)\s*(?:n|night)/i;

export const getDurationSummary = (durationDays?: number | null, rawDuration?: string | null) => {
  const normalizedDays = Number.isFinite(durationDays) ? Number(durationDays) : 0;

  if (normalizedDays > 0) {
    const nights = Math.max(normalizedDays - 1, 0);
    return {
      days: normalizedDays,
      nights,
      label: `${normalizedDays} Days${nights > 0 ? ` / ${nights} Nights` : ""}`,
    };
  }

  const source = (rawDuration ?? "").trim();
  if (source) {
    const dayMatch = source.match(durationPattern);
    const nightMatch = source.match(nightPattern);
    const parsedDays = dayMatch ? Number(dayMatch[1]) : 0;
    const parsedNights = nightMatch ? Number(nightMatch[1]) : Math.max(parsedDays - 1, 0);

    if (parsedDays > 0 || parsedNights > 0) {
      return {
        days: parsedDays,
        nights: parsedNights,
        label: `${parsedDays || parsedNights + 1} Days${parsedNights > 0 ? ` / ${parsedNights} Nights` : ""}`,
      };
    }

    return {
      days: 0,
      nights: 0,
      label: source,
    };
  }

  return {
    days: 0,
    nights: 0,
    label: "Duration on request",
  };
};
