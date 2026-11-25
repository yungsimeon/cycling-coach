create policy "Users can update their own rides"
on rides for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id); 

revoke update on rides from authenticated;
-- RLS limits which rows; this limits which columns (metrics stay read-only)
grant update (name, description) on rides to authenticated;