// lib/saveUserToMongoDB.ts

export async function saveUserToMongoDB(user: {
  firebaseUid: string;
  email: string;
  name: string;
  userType: "student" | "client";
  avatar?: string;
}) {
  try {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Failed to save user:", data);
      throw new Error(data.error || "Failed to save user");
    }

    console.log("✅ User saved successfully:", data);
    return data.data;
  } catch (err) {
    console.error("❌ Error in saveUserToMongoDB:", err);
    throw err;
  }
}
