// lib/verifyFirebaseToken.ts
import { getAuth } from "firebase-admin/auth";
import { NextRequest } from "next/server";

export async function verifyFirebaseToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const idToken = authHeader.split(" ")[1];

  try {
    const decoded = await getAuth().verifyIdToken(idToken);
    return decoded; // contains uid, email, etc.
  } catch (error) {
    console.error("❌ Invalid Firebase token:", error);
    return null;
  }
}
