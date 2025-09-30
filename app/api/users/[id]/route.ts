// app/api/users/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { db as firestoreDB } from "@/lib/firebaseAdmin";

export async function GET(request: Request) {
  try {
    await connectDB();

    // Extract Firebase UID from the URL
    const url = new URL(request.url);
    const pathSegments = url.pathname.split("/"); // ['/api','users','<id>']
    const firebaseUid = pathSegments[pathSegments.length - 1];

    if (!firebaseUid) {
      return NextResponse.json(
        { success: false, error: "Firebase UID is required" },
        { status: 400 }
      );
    }

    // Fetch from Firestore
    const userRef = firestoreDB.collection("users").doc(firebaseUid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { success: false, error: "User not found in Firestore" },
        { status: 404 }
      );
    }

    const firestoreUser = userDoc.data();

    // Sync with MongoDB
    let user = await User.findOne({ firebaseUid });
    if (!user) {
      user = await User.create({
        firebaseUid,
        email: firestoreUser?.email || "",
        name: firestoreUser?.name || "",
        userType: firestoreUser?.userType || "student",
        avatar: firestoreUser?.avatar || "",
      });
      console.log("MongoDB: User created ->", user);
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    console.error("GET /api/users/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
