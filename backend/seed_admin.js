const bcrypt = require("bcryptjs");
const { Client } = require("pg");

async function main() {
  const client = new Client({
    host: "localhost",
    user: "postgres",
    password: process.env.DB_PASS || "9137",
    database: "taskdb",
    port: 5432,
  });

  await client.connect();

  // Ensure default posts exist.
  const postNames = ["Manager", "Developer", "HR", "Sales"];
  for (const name of postNames) {
    await client.query(
      'INSERT INTO "Posts" (name,"createdAt","updatedAt") VALUES ($1,NOW(),NOW()) ON CONFLICT (name) DO NOTHING',
      [name]
    );
  }

  const adminEmail = "admin@test.com";
  const adminPassword = "Admin@123";
  const hashed = await bcrypt.hash(adminPassword, 10);

  const managerPost = await client.query('SELECT id FROM "Posts" WHERE name=$1', ["Manager"]);
  const post_id = managerPost.rows[0]?.id ?? null;

  await client.query(
    `INSERT INTO "Users" (name,email,password,role,post_id,status,"createdAt","updatedAt")
     VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())
     ON CONFLICT (email) DO UPDATE SET role=EXCLUDED.role, post_id=EXCLUDED.post_id, password=EXCLUDED.password, "updatedAt"=NOW()`,
    ["admin", adminEmail, hashed, "admin", post_id, "active"]
  );

  // Ensure profile row exists.
  await client.query(
    `INSERT INTO "Profiles" (user_id, first_name,last_name,full_name,email,mobile,address,image,"createdAt","updatedAt")
     VALUES (
       (SELECT id FROM "Users" WHERE email=$1),
       NULL,NULL,$2,$1,NULL,NULL,NULL,
       NOW(),NOW()
     )
     ON CONFLICT (user_id) DO NOTHING`,
    [adminEmail, "admin"]
  );

  console.log("Seeded admin user + profile");
  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

