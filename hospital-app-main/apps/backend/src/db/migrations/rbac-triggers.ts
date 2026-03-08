import { db } from "../index";
import { sql } from "drizzle-orm";

async function applyTriggers() {
    console.log("🚀 Applying Supabase Custom Claims Triggers...");

    try {
        // 1. Create the function that syncs roles and permissions to auth.users.raw_app_meta_data
        await db.execute(sql`
      CREATE OR REPLACE FUNCTION public.sync_user_roles_to_jwt()
      RETURNS trigger AS $$
      DECLARE
        _user_id uuid;
        _roles jsonb;
        _permissions jsonb;
      BEGIN
        -- Determine which user we are updating based on the table triggering this
        IF TG_TABLE_NAME = 'user_roles' THEN
          IF TG_OP = 'DELETE' THEN
            _user_id := OLD.user_id;
          ELSE
            _user_id := NEW.user_id;
          END IF;
        ELSIF TG_TABLE_NAME = 'role_permissions' THEN
          -- For role_permissions, we need to update ALL users who have this role
          -- This might be heavy if many users share a role, but it's required for immediate consistency.
          -- Alternative is forcing users to relogin, but this trigger handles it dynamically.
          -- For simplicity in this trigger structure, we will update the specific role's users below.
          -- (Handled by a separate loop or statement)
        END IF;

        IF _user_id IS NOT NULL THEN
          -- Build JSON array of role names
          SELECT COALESCE(jsonb_agg(r.name), '[]'::jsonb)
          INTO _roles
          FROM public.user_roles ur
          JOIN public.roles r ON r.id = ur.role_id
          WHERE ur.user_id = _user_id;

          -- Build JSON array of permission codes
          SELECT COALESCE(jsonb_agg(DISTINCT p.code), '[]'::jsonb)
          INTO _permissions
          FROM public.user_roles ur
          JOIN public.role_permissions rp ON rp.role_id = ur.role_id
          JOIN public.permissions p ON p.id = rp.permission_id
          WHERE ur.user_id = _user_id;

          -- Update auth.users
          -- We only want to update the 'roles' and 'permissions' keys within raw_app_meta_data
          UPDATE auth.users
          SET raw_app_meta_data = 
            COALESCE(raw_app_meta_data, '{}'::jsonb) || 
            jsonb_build_object('roles', _roles, 'permissions', _permissions)
          WHERE id = (SELECT supabase_uid FROM public.users WHERE id = _user_id);
        END IF;

        RETURN NULL; -- AFTER triggers can return NULL
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `);
        console.log("✅ Function sync_user_roles_to_jwt created.");

        // 2. Create trigger for user_roles
        await db.execute(sql`
      DROP TRIGGER IF EXISTS on_user_role_change ON public.user_roles;
      CREATE TRIGGER on_user_role_change
      AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
      FOR EACH ROW EXECUTE FUNCTION public.sync_user_roles_to_jwt();
    `);
        console.log("✅ Trigger on_user_role_change created.");

        // 3. Create wrapper function for role_permissions 
        // (If a permission is added/removed to/from a role, update all users with that role)
        await db.execute(sql`
      CREATE OR REPLACE FUNCTION public.sync_role_permissions_to_jwt()
      RETURNS trigger AS $$
      DECLARE
        _role_id uuid;
        _user_record RECORD;
      BEGIN
        IF TG_OP = 'DELETE' THEN
          _role_id := OLD.role_id;
        ELSE
          _role_id := NEW.role_id;
        END IF;

        -- Loop through all users with this role and trigger their JWT update
        FOR _user_record IN SELECT user_id FROM public.user_roles WHERE role_id = _role_id LOOP
          -- We can't directly call sync_user_roles_to_jwt because it relies on trigger variables (OLD/NEW).
          -- So we just manually run the update logic for each user.
          
          DECLARE
            _roles jsonb;
            _permissions jsonb;
          BEGIN
            SELECT COALESCE(jsonb_agg(r.name), '[]'::jsonb) INTO _roles
            FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = _user_record.user_id;

            SELECT COALESCE(jsonb_agg(DISTINCT p.code), '[]'::jsonb) INTO _permissions
            FROM public.user_roles ur JOIN public.role_permissions rp ON rp.role_id = ur.role_id
            JOIN public.permissions p ON p.id = rp.permission_id
            WHERE ur.user_id = _user_record.user_id;

            UPDATE auth.users
            SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('roles', _roles, 'permissions', _permissions)
            WHERE id = (SELECT supabase_uid FROM public.users WHERE id = _user_record.user_id);
          END;
        END LOOP;
        
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `);

        // 4. Create trigger for role_permissions
        await db.execute(sql`
      DROP TRIGGER IF EXISTS on_role_permission_change ON public.role_permissions;
      CREATE TRIGGER on_role_permission_change
      AFTER INSERT OR UPDATE OR DELETE ON public.role_permissions
      FOR EACH ROW EXECUTE FUNCTION public.sync_role_permissions_to_jwt();
    `);
        console.log("✅ Trigger on_role_permission_change created.");

        console.log("🎉 All triggers successfully applied!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Failed to apply triggers:", error);
        process.exit(1);
    }
}

applyTriggers();
