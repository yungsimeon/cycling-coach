alter table rides 
add column peak_power integer check (peak_power <= 2500 and peak_power >= 0),
add column peak_hr integer check (peak_hr <= 230 and peak_hr >= 40);