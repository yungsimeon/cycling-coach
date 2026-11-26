alter table rides
add column route jsonb check (jsonb_typeof(route) = 'array');