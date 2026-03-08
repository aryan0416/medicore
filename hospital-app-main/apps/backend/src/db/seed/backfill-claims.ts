import { db } from "../index";
import { users, userRoles, roles, rolePermissions, permissions } from "../schema";
import { eq, inArray } from "drizzle-orm";
import { supabaseAdmin } from "../../config/supabase";

async function backfillUserClaims() {
    console.log("🚀 Starting JWT Claim Back-fill for all users...");

    try {
        const allUsers = await db.select().from(users);

        for (const user of allUsers) {
            console.log(`Processing user: ${user.email} (${user.id})`);

            // 1. Get user roles
            const userRoleRows = await db
                .select()
                .from(userRoles)
                .where(eq(userRoles.userId, user.id));

            const roleIds = userRoleRows.map((ur) => ur.roleId);

            let userRolesList: string[] = [];
            let permissionCodes: string[] = [];

            if (roleIds.length > 0) {
                const rolesData = await db
                    .select({ name: roles.name })
                    .from(roles)
                    .where(inArray(roles.id, roleIds));

                userRolesList = rolesData.map(r => r.name);

                const rpRows = await db
                    .select()
                    .from(rolePermissions)
                    .where(inArray(rolePermissions.roleId, roleIds));

                const permIds = rpRows.map((rp) => rp.permissionId);

                if (permIds.length > 0) {
                    const perms = await db
                        .select({ code: permissions.code })
                        .from(permissions)
                        .where(inArray(permissions.id, permIds));

                    permissionCodes = perms.map((p) => p.code);
                }
            }

            permissionCodes = [...new Set(permissionCodes)];

            // 2. Push to Supabase directly
            // Triggers handle this moving forward, but we need to do it once manually 
            // for users created prior to the triggers existing.
            const { error } = await supabaseAdmin.auth.admin.updateUserById(
                user.supabaseUid,
                {
                    app_metadata: {
                        roles: userRolesList,
                        permissions: permissionCodes,
                    }
                }
            );

            if (error) {
                console.error(`❌ Failed to update Supabase claims for ${user.email}:`, error);
            } else {
                console.log(`✅ Updated claims for ${user.email}`);
            }
        }

        console.log("🎉 Backfill complete!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Backfill failed:", error);
        process.exit(1);
    }
}

backfillUserClaims();
