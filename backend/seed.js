import dotenv from "dotenv";
import dns from "dns";
import mongoose from "mongoose";
import User from "./models/User.js";

dotenv.config();
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  // Clear existing users
  await User.deleteMany({});

  // Create default users
  const users = [
    {
      name: "Admin User",
      email: "admin@vms.com",
      password: "admin123",
      role: "admin",
      department: "Management",
      phone: "9999999999",
    },
    {
      name: "Security Guard",
      email: "security@vms.com",
      password: "security123",
      role: "security",
      department: "Security",
      phone: "8888888888",
    },
    {
      name: "Host Employee",
      email: "host@vms.com",
      password: "host123",
      role: "host",
      department: "Engineering",
      phone: "7777777777",
    },
  ];

  await User.create(users);
  console.log("✅ Seeded users:");
  console.log("   admin@vms.com      / admin123    (role: admin)");
  console.log("   security@vms.com   / security123 (role: security)");
  console.log("   host@vms.com       / host123     (role: host)");

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed error:", err.message);
  process.exit(1);
});
