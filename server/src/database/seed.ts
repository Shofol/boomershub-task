import { executeQuery } from "./connection";

export const seedDatabase = async (): Promise<void> => {
  try {
    console.log("🌱 Database seeding completed - no sample data added");
    console.log("📝 Properties will be added through web scraping");
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
