const { MongoClient } = require("mongodb");

const COLLECTIONS = Object.freeze({
  USERS: "users",
  TUITIONS: "tuitions",
  APPLICATIONS: "applications",
  PAYMENTS: "payments",
});

let dbPromise;

async function getDb() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }
  if (!dbPromise) {
    dbPromise = (async () => {
      const client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();
      return client.db(process.env.MONGODB_DB_NAME || "mentorlagbe");
    })().catch((error) => {
      dbPromise = undefined;
      throw error;
    });
  }
  return dbPromise;
}

module.exports = { getDb, COLLECTIONS };
