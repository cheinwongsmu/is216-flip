-- ============================================================
-- FLIP – Supabase Schema
-- Run this once in your Supabase SQL editor (Database → SQL Editor)
-- ============================================================

-- 1. Profiles table (one row per auth user)
create table public.profiles (
  created_at timestamp with time zone not null default now(),
  username text null default ''::text,
  email text null default ''::text,
  role text null default 'user'::text,
  user_uuid uuid not null default auth.uid (),
  constraint profiles_pkey primary key (user_uuid)
) TABLESPACE pg_default;

-- 2. Decks table
create table public.decks (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  user_uuid uuid null default auth.uid (),
  title text null,
  subject text null,
  description text null,
  constraint decks_pkey primary key (id),
  constraint decks_user_uuid_fkey foreign KEY (user_uuid) references profiles (user_uuid)
) TABLESPACE pg_default;

-- 3. Cards table
create table public.cards (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  front text null,
  back text null,
  is_known boolean null default false,
  deck_id uuid null default auth.uid (),
  constraint cards_pkey primary key (id),
  constraint cards_deck_id_fkey foreign KEY (deck_id) references decks (id) on delete CASCADE
) TABLESPACE pg_default;
