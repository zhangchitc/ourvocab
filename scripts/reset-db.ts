import { config } from 'dotenv';
import mongoose from 'mongoose';

// Load .env.local file
config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI!;

async function reset() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected!');

  const db = mongoose.connection.db!;

  // Delete all words
  const wordResult = await db.collection('words').deleteMany({});
  console.log(`Deleted ${wordResult.deletedCount} words`);

  // Delete all user progress
  const progressResult = await db.collection('userprogresses').deleteMany({});
  console.log(`Deleted ${progressResult.deletedCount} user progress records`);

  console.log('\nDatabase cleared! Now run: npx ts-node scripts/seed.ts');

  await mongoose.disconnect();
  process.exit(0);
}

reset().catch((err) => {
  console.error('Reset failed:', err);
  process.exit(1);
});
