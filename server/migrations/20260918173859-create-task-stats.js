export async function up(db) {
  await db.createCollection("task_stats");

  await db.collection("task_stats").createIndex(
    { user: 1 },
    { unique: true }
  );

  await db.collection("task_stats").createIndex(
    { updatedAt: -1 }
  );

  console.log(
    "Task stats collection created successfully"
  );
}

export async function down(db) {
  await db.collection("task_stats").drop();

  console.log(
    "Task stats collection dropped successfully"
  );
}