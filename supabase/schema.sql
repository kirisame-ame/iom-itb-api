create extension if not exists pgcrypto;

do $$
begin
  create type transaction_status as enum (
    'waiting',
    'on process',
    'on delivery',
    'arrived',
    'done',
    'canceled',
    'denied'
  );
exception
  when duplicate_object then null;
end $$;

create or replace function set_updated_at()
returns trigger as $$
begin
  new."updatedAt" = now();
  return new;
end;
$$ language plpgsql;

create table if not exists "Merchandises" (
  id bigserial primary key,
  image text,
  name text not null,
  description text,
  price numeric(10,2) not null,
  stock integer not null,
  link text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists "Users" (
  id uuid primary key default gen_random_uuid(),
  photo text,
  "noMember" text not null unique,
  name text not null,
  faculty text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists "Activities" (
  id bigserial primary key,
  image text,
  title text not null,
  date timestamptz not null,
  description text,
  url text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists "Members" (
  id bigserial primary key,
  code text not null,
  "parentName" text not null,
  "childNim" text not null,
  "noWhatsapp" text not null,
  picture text,
  file text,
  options jsonb,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists "Donations" (
  id bigserial primary key,
  name text not null,
  email text not null,
  "noWhatsapp" text not null,
  proof text,
  notification jsonb not null,
  amount numeric(10,2) default 0,
  options jsonb,
  date timestamptz,
  bank text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists "HelpSubmissions" (
  id bigserial primary key,
  name text not null,
  nim text not null,
  "noWhatsapp" text not null,
  type text not null,
  reason text not null,
  "toPropose" text not null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists "Admins" (
  id bigserial primary key,
  email text not null unique,
  password text not null,
  approved boolean not null default false,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists "Transactions" (
  id bigserial primary key,
  code text,
  username text not null,
  email text not null,
  "noTelp" text not null,
  address text not null,
  "merchandiseId" bigint not null references "Merchandises"(id) on update cascade on delete cascade,
  qty integer not null,
  status transaction_status not null default 'waiting',
  payment text not null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

drop trigger if exists trg_merchandises_updated_at on "Merchandises";
create trigger trg_merchandises_updated_at
before update on "Merchandises"
for each row execute function set_updated_at();

drop trigger if exists trg_users_updated_at on "Users";
create trigger trg_users_updated_at
before update on "Users"
for each row execute function set_updated_at();

drop trigger if exists trg_activities_updated_at on "Activities";
create trigger trg_activities_updated_at
before update on "Activities"
for each row execute function set_updated_at();

drop trigger if exists trg_members_updated_at on "Members";
create trigger trg_members_updated_at
before update on "Members"
for each row execute function set_updated_at();

drop trigger if exists trg_donations_updated_at on "Donations";
create trigger trg_donations_updated_at
before update on "Donations"
for each row execute function set_updated_at();

drop trigger if exists trg_help_submissions_updated_at on "HelpSubmissions";
create trigger trg_help_submissions_updated_at
before update on "HelpSubmissions"
for each row execute function set_updated_at();

drop trigger if exists trg_admins_updated_at on "Admins";
create trigger trg_admins_updated_at
before update on "Admins"
for each row execute function set_updated_at();

drop trigger if exists trg_transactions_updated_at on "Transactions";
create trigger trg_transactions_updated_at
before update on "Transactions"
for each row execute function set_updated_at();
