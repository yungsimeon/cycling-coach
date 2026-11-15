alter table rides
add column peak_speed_mps double precision check (peak_speed_mps >= 0 and peak_speed_mps <= 36),
add column avg_cadence integer check (avg_cadence >= 0 and avg_cadence <= 200);