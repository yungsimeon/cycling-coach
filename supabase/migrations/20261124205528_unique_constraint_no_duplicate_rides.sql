alter table rides
add constraint rides_user_id_started_at_key unique (user_id, started_at);
-- same user can't have two rides starting at the same second, prevents duplicate uploads