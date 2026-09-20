export async function up(db) {
  await db.createCollection("tasks");

  await db.collection("tasks").createIndex(
    { user: 1 }
  );

  await db.collection("tasks").createIndex(
    { status: 1 }
  );

  await db.collection("tasks").createIndex(
    { priority: 1 }
  );

  await db.collection("tasks").createIndex(
    { dueDate: 1 }
  );

  await db.collection("tasks").createIndex(
    { createdAt: -1 }
  );

  console.log("Tasks collection created successfully");
}

export async function down(db) {
  await db.collection("tasks").drop();

  console.log("Tasks collection dropped successfully");
}