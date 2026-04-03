alter table public.packages
  add column if not exists tags_type text,
  add column if not exists external_link text,
  add column if not exists raw_duration text,
  add column if not exists source_category text;
