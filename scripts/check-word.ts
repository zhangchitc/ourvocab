import { config } from 'dotenv';
import mongoose from 'mongoose';

config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI!;

async function check() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db!;

  // Check one word
  const word = await db.collection('words').findOne({ word: 'especially' });
  console.log('Sample word data:');
  console.log(JSON.stringify(word, null, 2));

  // Count total
  const count = await db.collection('words').countDocuments();
  console.log(`\nTotal words: ${count}`);

  await mongoose.disconnect();
}

check();
