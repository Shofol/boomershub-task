import { executeQuery, testConnection } from "./connection";

const createPropertiesTable = `
  CREATE TABLE IF NOT EXISTS properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    city VARCHAR(255),
    county VARCHAR(255),
    zipcode VARCHAR(20),
    state VARCHAR(100),
    phone VARCHAR(50),
    type VARCHAR(255),
    capacity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_city (city),
    INDEX idx_state (state),
    INDEX idx_created_at (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const checkIndexExists = `
  SELECT COUNT(*) as count 
  FROM information_schema.statistics 
  WHERE table_schema = DATABASE() 
  AND table_name = 'properties' 
  AND index_name = ?
`;

const createNameIndex = `CREATE INDEX idx_properties_name ON properties(name)`;
const createCityIndex = `CREATE INDEX idx_properties_city ON properties(city)`;
const createStateIndex = `CREATE INDEX idx_properties_state ON properties(state)`;

export const runMigrations = async (): Promise<void> => {
  try {
    console.log("🔄 Starting database migrations...");

    // Test connection first
    await testConnection();

    // Create properties table
    console.log("📋 Creating properties table...");
    await executeQuery(createPropertiesTable);

    // Create additional indexes if they don't exist
    console.log("🔍 Creating indexes...");

    // Check and create name index
    const nameIndexExists = (await executeQuery(checkIndexExists, [
      "idx_properties_name",
    ])) as any[];
    if (nameIndexExists[0]?.count === 0) {
      console.log("  Creating name index...");
      await executeQuery(createNameIndex);
    } else {
      console.log("  Name index already exists");
    }

    // Check and create city index
    const cityIndexExists = (await executeQuery(checkIndexExists, [
      "idx_properties_city",
    ])) as any[];
    if (cityIndexExists[0]?.count === 0) {
      console.log("  Creating city index...");
      await executeQuery(createCityIndex);
    } else {
      console.log("  City index already exists");
    }

    // Check and create state index
    const stateIndexExists = (await executeQuery(checkIndexExists, [
      "idx_properties_state",
    ])) as any[];
    if (stateIndexExists[0]?.count === 0) {
      console.log("  Creating state index...");
      await executeQuery(createStateIndex);
    } else {
      console.log("  State index already exists");
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
