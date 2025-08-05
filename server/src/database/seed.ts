import { executeQuery } from "./connection";

const sampleUsers = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    age: 30,
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    age: 25,
  },
  {
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    age: 35,
  },
  {
    name: "Alice Brown",
    email: "alice.brown@example.com",
    age: 28,
  },
  {
    name: "Charlie Wilson",
    email: "charlie.wilson@example.com",
    age: 32,
  },
];

const insertUserQuery = `
  INSERT INTO users (name, email, age) 
  VALUES (?, ?, ?)
  ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    age = VALUES(age)
`;

export const seedDatabase = async (): Promise<void> => {
  try {
    console.log("🌱 Starting database seeding...");

    for (const user of sampleUsers) {
      console.log(`👤 Seeding user: ${user.name}`);
      await executeQuery(insertUserQuery, [user.name, user.email, user.age]);
    }

    console.log("✅ Database seeding completed successfully");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("🎉 Database seeded successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    });
}
