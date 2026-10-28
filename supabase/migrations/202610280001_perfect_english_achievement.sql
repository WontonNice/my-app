-- Keep existing Math designs and permit the official-practice English badge.
alter table public.achievement_designs
  drop constraint if exists achievement_designs_id_check;
alter table public.achievement_designs
  add constraint achievement_designs_id_check
  check (id in ('perfect-math', 'perfect-english'));
