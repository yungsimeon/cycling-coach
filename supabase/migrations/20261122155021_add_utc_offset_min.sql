alter table rides
add column utc_offset_min integer check (utc_offset_min between -12 * 60 and 14 * 60);
-- this checks if the offset is within utc-12 and utc+14, the two outmost timezones. otherwise the offset must be invalid