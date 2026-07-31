-- 003_password_recovery.sql
-- Récupération de mot de passe SANS email : code de récupération personnel
-- stocké haché (bcrypt via pgcrypto) + réinitialisation du mot de passe
-- administrateur effectuée côté base (auth.users), avec révocation des sessions.
-- RPC exposées :
--   set_recovery_code(text)            -> réservée à 'authenticated' (panneau admin)
--   recover_admin_password(text, text) -> accessible à 'anon' (écran récupération)

create extension if not exists pgcrypto;

create table if not exists public.admin_recovery (
  id integer primary key default 1 check (id = 1),
  admin_email text not null,
  code_hash text,
  updated_at timestamptz not null default now()
);

alter table public.admin_recovery enable row level security;

-- ---------------------------------------------------------------------------
-- Définit (ou remplace) le code de récupération. Enregistre aussi l'email du
-- compte admin connecté pour que la récupération cible toujours ce compte.
-- ---------------------------------------------------------------------------
create or replace function public.set_recovery_code(new_code text)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  caller_email text;
begin
  caller_email := nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'email', '');
  if caller_email is null then
    raise exception 'Session invalide, reconnectez-vous.';
  end if;

  if new_code is null or length(new_code) < 8 then
    raise exception 'Le code doit contenir au moins 8 caractères.';
  end if;

  insert into public.admin_recovery (id, admin_email, code_hash, updated_at)
  values (1, caller_email, crypt(new_code, gen_salt('bf')), now())
  on conflict (id) do update
  set admin_email = excluded.admin_email,
      code_hash = excluded.code_hash,
      updated_at = now();

  return true;
end;
$$;

revoke all on function public.set_recovery_code(text) from public;
grant execute on function public.set_recovery_code(text) to authenticated;

-- ---------------------------------------------------------------------------
-- Vérifie le code de récupération puis réinitialise le mot de passe admin et
-- révoque toutes les sessions existantes (reconnexion obligatoire partout).
-- ---------------------------------------------------------------------------
create or replace function public.recover_admin_password(recovery_code text, new_password text)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_admin_email text;
  v_code_hash text;
  v_user_id uuid;
begin
  select admin_email, code_hash into v_admin_email, v_code_hash
  from public.admin_recovery
  where id = 1;

  if v_code_hash is null then
    raise exception 'Aucun code de récupération configuré.';
  end if;

  if recovery_code is null or crypt(recovery_code, v_code_hash) <> v_code_hash then
    raise exception 'Code de récupération invalide.';
  end if;

  if new_password is null or length(new_password) < 8 then
    raise exception 'Le mot de passe doit contenir au moins 8 caractères.';
  end if;

  select id into v_user_id
  from auth.users
  where email = v_admin_email;

  if v_user_id is null then
    raise exception 'Compte administrateur introuvable.';
  end if;

  update auth.users
  set encrypted_password = crypt(new_password, gen_salt('bf')),
      updated_at = now()
  where id = v_user_id;

  if to_regclass('auth.sessions') is not null then
    delete from auth.sessions where user_id = v_user_id;
  end if;
  if to_regclass('auth.refresh_tokens') is not null then
    delete from auth.refresh_tokens where user_id = v_user_id;
  end if;

  return true;
end;
$$;

revoke all on function public.recover_admin_password(text, text) from public;
grant execute on function public.recover_admin_password(text, text) to anon;
