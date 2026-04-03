alter table public.bookings
  add column if not exists booking_reference text,
  add column if not exists referral_code text,
  add column if not exists share_token text;

update public.bookings
set
  booking_reference = coalesce(booking_reference, concat('BK-', to_char(created_at, 'YYYYMMDD'), '-', substring(id::text, 1, 8))),
  share_token = coalesce(share_token, encode(gen_random_bytes(6), 'hex'))
where booking_reference is null or share_token is null;

alter table public.bookings
  alter column booking_reference set default concat('BK-', to_char(timezone('utc', now()), 'YYYYMMDD'), '-', substring(gen_random_uuid()::text, 1, 8)),
  alter column share_token set default encode(gen_random_bytes(6), 'hex');

create unique index if not exists bookings_booking_reference_key on public.bookings (booking_reference);
create unique index if not exists bookings_share_token_key on public.bookings (share_token);

alter table public.inquiries
  add column if not exists travelers_count int,
  add column if not exists travel_date date,
  add column if not exists booking_id uuid references public.bookings(id) on delete set null,
  add column if not exists source text not null default 'website';

alter table public.inquiries
  drop constraint if exists inquiries_travelers_count_check;

alter table public.inquiries
  add constraint inquiries_travelers_count_check check (travelers_count is null or travelers_count > 0);

create index if not exists inquiries_booking_id_idx on public.inquiries (booking_id);
create index if not exists inquiries_travel_date_idx on public.inquiries (travel_date);

create index if not exists packages_search_idx
on public.packages using gin (
  to_tsvector(
    'simple',
    coalesce(title, '') || ' ' ||
    coalesce(destination, '') || ' ' ||
    coalesce(location, '') || ' ' ||
    coalesce(short_description, '')
  )
);

create or replace function public.search_published_packages(
  search_q text default null,
  category_filter text default null,
  min_days int default null,
  max_days int default null,
  max_budget numeric default null,
  sort_key text default 'popularity',
  page_number int default 1,
  page_size int default 12
)
returns table (
  id uuid,
  title text,
  slug text,
  destination text,
  location text,
  tags_type text,
  external_link text,
  raw_duration text,
  source_category text,
  cover_image text,
  duration_days int,
  price_inr numeric,
  short_description text,
  description text,
  inclusions text[],
  is_published boolean,
  created_at timestamptz,
  popularity_score bigint,
  total_count bigint
)
language sql
stable
as $$
  with package_popularity as (
    select
      p.id,
      coalesce(b.booking_count, 0) + coalesce(i.inquiry_count, 0) as popularity_score
    from public.packages p
    left join (
      select package_id, count(*)::bigint as booking_count
      from public.bookings
      group by package_id
    ) b on b.package_id = p.id
    left join (
      select package_id, count(*)::bigint as inquiry_count
      from public.inquiries
      where package_id is not null
      group by package_id
    ) i on i.package_id = p.id
  ),
  filtered as (
    select
      p.id,
      p.title,
      p.slug,
      p.destination,
      p.location,
      p.tags_type,
      p.external_link,
      p.raw_duration,
      p.source_category,
      p.cover_image,
      p.duration_days,
      p.price_inr,
      p.short_description,
      p.description,
      p.inclusions,
      p.is_published,
      p.created_at,
      coalesce(pp.popularity_score, 0) as popularity_score
    from public.packages p
    left join package_popularity pp on pp.id = p.id
    where p.is_published = true
      and (
        search_q is null
        or btrim(search_q) = ''
        or to_tsvector(
          'simple',
          coalesce(p.title, '') || ' ' ||
          coalesce(p.destination, '') || ' ' ||
          coalesce(p.location, '') || ' ' ||
          coalesce(p.short_description, '')
        ) @@ plainto_tsquery('simple', search_q)
        or p.title ilike '%' || search_q || '%'
        or p.destination ilike '%' || search_q || '%'
        or p.location ilike '%' || search_q || '%'
      )
      and (
        category_filter is null
        or btrim(category_filter) = ''
        or lower(coalesce(p.source_category, '')) = lower(category_filter)
        or lower(coalesce(p.tags_type, '')) = lower(category_filter)
      )
      and (min_days is null or min_days <= 0 or p.duration_days >= min_days)
      and (max_days is null or max_days <= 0 or p.duration_days <= max_days)
      and (max_budget is null or max_budget <= 0 or p.price_inr <= max_budget)
  )
  select
    f.id,
    f.title,
    f.slug,
    f.destination,
    f.location,
    f.tags_type,
    f.external_link,
    f.raw_duration,
    f.source_category,
    f.cover_image,
    f.duration_days,
    f.price_inr,
    f.short_description,
    f.description,
    f.inclusions,
    f.is_published,
    f.created_at,
    f.popularity_score,
    count(*) over() as total_count
  from filtered f
  order by
    case when sort_key = 'price_asc' then f.price_inr end asc nulls last,
    case when sort_key = 'price_desc' then f.price_inr end desc nulls last,
    case when sort_key = 'duration_asc' then f.duration_days end asc nulls last,
    case when sort_key = 'duration_desc' then f.duration_days end desc nulls last,
    case when sort_key = 'date_asc' then f.created_at end asc nulls last,
    case when sort_key = 'date_desc' then f.created_at end desc nulls last,
    case when sort_key = 'popularity' then f.popularity_score end desc nulls last,
    f.created_at desc
  limit greatest(page_size, 1)
  offset (greatest(page_number, 1) - 1) * greatest(page_size, 1);
$$;

grant execute on function public.search_published_packages(text, text, int, int, numeric, text, int, int) to anon, authenticated;