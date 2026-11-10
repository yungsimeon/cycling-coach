insert into storage.buckets
(id, name, public)
values
('fit-files', 'fit-files', false);

create policy "Users can view their FIT file"
on storage.objects for select
to authenticated
using (bucket_id = 'fit-files' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Users can upload a FIT file"
on storage.objects for insert
to authenticated
with check (bucket_id = 'fit-files' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "User can delete their FIT file"
on storage.objects for delete
to authenticated
using (bucket_id = 'fit-files' and (storage.foldername(name))[1] = (select auth.uid())::text);
