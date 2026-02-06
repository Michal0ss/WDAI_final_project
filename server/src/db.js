import path from 'path';
import { fileURLToPath } from 'url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbFile = path.join(__dirname, '..', 'db.json');

const defaultData = {
  users: [],
  reviews: [],
  orders: []
};

const adapter = new JSONFile(dbFile);
const db = new Low(adapter, defaultData);

await db.read();
if (!db.data) {
  db.data = defaultData;
}

if (db.data.users.length === 0) {
  const seedUsers = [
    { id: 'u1', username: 'student1', role: 'user' },
    { id: 'u2', username: 'student2', role: 'user' },
    { id: 'u3', username: 'teacher', role: 'admin' },
    { id: 'u4', username: 'admin', role: 'admin' }
  ].map(u => ({
    ...u,
    passwordHash: bcrypt.hashSync('password', 10)
  }));

  db.data.users.push(...seedUsers);
  await db.write();
}

export { db };
