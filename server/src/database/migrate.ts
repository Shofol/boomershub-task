import { executeQuery, testConnection } from "./connection";

const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    age INT NOT NULL CHECK (age > 0 AND age <= 120),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const checkIndexExists = `
  SELECT COUNT(*) as count 
  FROM information_schema.statistics 
  WHERE table_schema = DATABASE() 
  AND table_name = 'users' 
  AND index_name = ?
`;

const createNameIndex = `CREATE INDEX idx_users_name ON users(name)`;
const createAgeIndex = `CREATE INDEX idx_users_age ON users(age)`;

export const runMigrations = async (): Promise<void> => {
  try {
    console.log("🔄 Starting database migrations...");

    // Test connection first
    await testConnection();

    // Create users table
    console.log("📋 Creating users table...");
    await executeQuery(createUsersTable);

    // Create additional indexes if they don't exist
    console.log("🔍 Creating indexes...");

    // Check and create name index
    const nameIndexExists = (await executeQuery(checkIndexExists, [
      "idx_users_name",
    ])) as any[];
    if (nameIndexExists[0]?.count === 0) {
      console.log("  Creating name index...");
      await executeQuery(createNameIndex);
    } else {
      console.log("  Name index already exists");
    }

    // Check and create age index
    const ageIndexExists = (await executeQuery(checkIndexExists, [
      "idx_users_age",
    ])) as any[];
    if (ageIndexExists[0]?.count === 0) {
      console.log("  Creating age index...");
      await executeQuery(createAgeIndex);
    } else {
      console.log("  Age index already exists");
    }

    console.log("✅ Database migrations completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
};

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log("🎉 All migrations completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Migration failed:", error);
      process.exit(1);
    });
}
