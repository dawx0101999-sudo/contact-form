-- Run this in Supabase > SQL Editor
create table public.contacts (
  id          bigint generated always as identity primary key,
  name        text not null,
  email       text not null,
  phone       text,
  subject     text not null,
  message     text not null,
  created_at  timestamptz not null default now()
);

-- Lock the table; only the server (service key) can write.
alter table public.contacts enable row level security;
