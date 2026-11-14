alter table profiles
drop constraint profiles_lthr_check,
add constraint lthr_check check (lthr >= 120 and lthr <= 210 ),
add constraint ftp_check check (ftp >= 50 and ftp <= 600 ),
add constraint maxhr_check check (max_hr >= 130 and max_hr <= 230 );

