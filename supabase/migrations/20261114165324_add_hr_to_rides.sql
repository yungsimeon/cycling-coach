alter table rides 
add column avg_hr integer check(avg_hr >= 50 and avg_hr <= 210),
add column lthr integer check(lthr >= 110 and lthr <= 210),
add column lthr_estimated boolean,
add column hr_tss double precision,
add column time_in_hr_zones jsonb,
add constraint lthr_pair_check check((lthr is null) = (lthr_estimated is null)); --This check ensures that the db doesnt accept an lthr without lthr_estimated (we wouldnt know if the lthr values was estimated or not) 