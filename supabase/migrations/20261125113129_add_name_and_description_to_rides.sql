alter table rides
add column name text check (char_length(btrim(name)) >= 1 and char_length(name) <= 100),
add column description text check (char_length(btrim(description)) >= 1 and char_length(description) <= 2000);