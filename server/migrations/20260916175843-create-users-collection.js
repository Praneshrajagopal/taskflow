export async function up(db) {
  await db.createCollection("users");

  await db.collection("users").createIndex(
    { email: 1 },
    { unique: true }
  );

  await db.collection("users").createIndex({ createdAt: -1 });

  console.log("Users collection created successfully");
}

export async function down(db) {
  await db.collection("users").drop();

  console.log("Users collection dropped successfully");
}