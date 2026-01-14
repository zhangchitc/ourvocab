import { config } from 'dotenv';
import mongoose from 'mongoose';

// Load .env.local file
config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI!;
const USER_ID = 'default_user';
const INITIAL_STAGE = 4; // stage 4 = 已学过1天

const WordSchema = new mongoose.Schema({
  word: { type: String, required: true, unique: true, index: true },
});

const UserProgressSchema = new mongoose.Schema({
  user_id: { type: String, required: true, default: 'default_user' },
  word_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Word', required: true },
  stage: { type: Number, default: 0, min: 0, max: 8 },
  next_review_time: { type: Date, default: Date.now, index: true },
  status: { type: String, enum: ['learning', 'mastered'], default: 'learning' },
  wrong_count: { type: Number, default: 0 },
  last_reviewed_at: { type: Date },
});

UserProgressSchema.index({ user_id: 1, word_id: 1 }, { unique: true });

const Word = mongoose.models.Word || mongoose.model('Word', WordSchema);
const UserProgress = mongoose.models.UserProgress || mongoose.model('UserProgress', UserProgressSchema);

async function initProgress() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected!');

  // 获取统计
  const totalWords = await Word.countDocuments();
  const existingProgress = await UserProgress.countDocuments({ user_id: USER_ID });

  console.log(`词库总数: ${totalWords}`);
  console.log(`已有进度记录: ${existingProgress}`);

  // 找出未初始化的单词
  const existingWordIds = await UserProgress.find({ user_id: USER_ID }).distinct('word_id');
  const uninitializedWords = await Word.find({ _id: { $nin: existingWordIds } });

  console.log(`需要初始化: ${uninitializedWords.length}`);

  if (uninitializedWords.length === 0) {
    console.log('所有单词都已初始化！');
    await mongoose.disconnect();
    process.exit(0);
  }

  // 批量创建进度记录
  const now = new Date();
  const records = uninitializedWords.map((word: any) => ({
    user_id: USER_ID,
    word_id: word._id,
    stage: INITIAL_STAGE,
    next_review_time: now, // 立即可复习
    status: 'learning',
    wrong_count: 0,
    last_reviewed_at: now,
  }));

  await UserProgress.insertMany(records);
  console.log(`✅ 成功初始化 ${records.length} 个单词到 stage ${INITIAL_STAGE}`);

  await mongoose.disconnect();
  process.exit(0);
}

initProgress().catch((err) => {
  console.error('初始化失败:', err);
  process.exit(1);
});
