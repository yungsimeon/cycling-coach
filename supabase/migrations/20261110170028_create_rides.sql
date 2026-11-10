CREATE TABLE rides(
    id  uuid default gen_random_uuid() PRIMARY KEY not null,
    user_id uuid references profiles(id) on delete cascade not null,
    started_at timestamptz not null,
    sport text not null,
    moving_time_s integer not null,
    total_time_s integer not null,
    distance_m integer,
    elevation_gain_m integer,
    avg_power integer,
    normalized_power integer,
    ftp integer,
    intensity_factor double precision,
    tss double precision,
    time_in_zones jsonb,
    fit_file_path text not null,
    created_at timestamptz default now() not null
);

alter table rides enable row level security;

create policy "Users can view their own rides"
on rides for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can upload a ride"
on rides for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can delete their ride"
on rides for delete
to authenticated
using ((select auth.uid()) = user_id);