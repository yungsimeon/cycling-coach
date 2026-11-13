alter table profiles
add column lthr integer check (lthr >= 100 and lthr <= 220 );