CREATE TABLE profiles(
    id  uuid PRIMARY KEY references auth.users(id) on delete cascade,
    ftp int,
    max_hr int
);

alter table profiles enable row level security;

create policy "Logged-In Users can read their own profile"
on profiles for select
to authenticated
using ((select auth.uid()) = id);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path= ''
as $$
begin
insert into public.profiles (id)
values (new.id);
return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

insert into profiles (id) select id from auth.users;