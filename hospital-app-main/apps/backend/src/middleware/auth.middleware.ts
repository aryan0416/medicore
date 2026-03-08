import { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "../config/supabase";
import { db } from "../db";
import { users, roles, userRoles } from "../db/schema";
import { eq, sql } from "drizzle-orm";

// Extend the Express Request to include our custom user shape
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    roles: string[];
    permissions: string[];
  };
}

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const supabaseUser = data.user;

    // The roles and permissions are now injected into raw_app_meta_data
    // thanks to our Postgres Triggers!
    const roles = supabaseUser.app_metadata?.roles || [];
    const permissions = supabaseUser.app_metadata?.permissions || [];

    req.user = {
      id: supabaseUser.id,
      email: supabaseUser.email!,
      roles,
      permissions,
    };
    next();
  } catch (err) {
    // ✅ Only log full errors outside production
    if (process.env.NODE_ENV !== "production") {
      console.error("Auth middleware error:", err);

    }
    return res.status(500).json({ message: "Authentication failed" });
  }
}
