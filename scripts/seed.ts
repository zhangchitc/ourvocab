import { config } from 'dotenv';
import mongoose from 'mongoose';

// Load .env.local file
config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI!;

const WordSchema = new mongoose.Schema({
  word: { type: String, required: true, unique: true, index: true },
  phonetic: { type: String, default: '' },
  meanings: [{ type: String }],
  collocations: [{ type: String }],
  sentences: [{ en: String, cn: String }],
  is_custom: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

const Word = mongoose.models.Word || mongoose.model('Word', WordSchema);

const initialWords = [
  {
    word: 'especially',
    phonetic: '/ɪˈspeʃəli/',
    meanings: ['adv. 特别是，尤其'],
    collocations: ['especially for', 'especially when', 'especially important'],
    sentences: [
      { en: 'I love fruits, especially strawberries.', cn: '我喜欢水果，尤其是草莓。' },
      { en: 'This is especially important for beginners.', cn: '这对初学者来说尤为重要。' }
    ]
  },
  {
    word: 'specific',
    phonetic: '/spəˈsɪfɪk/',
    meanings: ['adj. 特定的，具体的'],
    collocations: ['specific to', 'specific details', 'be specific about'],
    sentences: [
      { en: 'Can you be more specific about the problem?', cn: '你能更具体地说明一下问题吗？' },
      { en: 'This rule is specific to our company.', cn: '这条规则是我们公司特有的。' }
    ]
  },
  {
    word: 'bargain',
    phonetic: '/ˈbɑːrɡən/',
    meanings: ['n. 便宜货，特价商品', 'v. 讨价还价'],
    collocations: ['a real bargain', 'bargain for', 'bargain hunter'],
    sentences: [
      { en: 'This dress is a real bargain at half price!', cn: '这条裙子半价，真是太划算了！' },
      { en: 'She loves bargain hunting at the mall.', cn: '她喜欢在商场淘便宜货。' }
    ]
  },
  {
    word: 'groceries',
    phonetic: '/ˈɡroʊsəriz/',
    meanings: ['n. 杂货，食品'],
    collocations: ['buy groceries', 'grocery store', 'grocery shopping'],
    sentences: [
      { en: 'I need to buy some groceries after work.', cn: '下班后我需要买些杂货。' },
      { en: 'We do grocery shopping every weekend.', cn: '我们每个周末都去买食品杂货。' }
    ]
  },
  {
    word: 'afford',
    phonetic: '/əˈfɔːrd/',
    meanings: ['v. 买得起，负担得起'],
    collocations: ['can afford', 'afford to do', 'affordable'],
    sentences: [
      { en: "I can't afford to buy a new car right now.", cn: '我现在买不起新车。' },
      { en: 'Can you afford to take a vacation this year?', cn: '你今年能负担得起度假吗？' }
    ]
  },
  {
    word: 'spend',
    phonetic: '/spend/',
    meanings: ['v. 花费（时间/金钱）'],
    collocations: ['spend time', 'spend money on', 'spend wisely'],
    sentences: [
      { en: 'How much did you spend on this bag?', cn: '你这个包花了多少钱？' },
      { en: "I like to spend time with my family.", cn: '我喜欢和家人共度时光。' }
    ]
  },
  {
    word: 'individual',
    phonetic: '/ˌɪndɪˈvɪdʒuəl/',
    meanings: ['n. 个人', 'adj. 个人的，单独的'],
    collocations: ['individual needs', 'as an individual', 'individual differences'],
    sentences: [
      { en: 'Every individual has unique talents.', cn: '每个人都有独特的天赋。' },
      { en: 'We respect individual differences here.', cn: '我们这里尊重个体差异。' }
    ]
  },
  {
    word: 'organization',
    phonetic: '/ˌɔːrɡənəˈzeɪʃn/',
    meanings: ['n. 组织，机构'],
    collocations: ['non-profit organization', 'join an organization', 'organization skills'],
    sentences: [
      { en: 'She works for an international organization.', cn: '她在一个国际组织工作。' },
      { en: 'Good organization skills are essential for this job.', cn: '良好的组织能力对这份工作至关重要。' }
    ]
  },
  {
    word: 'amount',
    phonetic: '/əˈmaʊnt/',
    meanings: ['n. 数量，金额'],
    collocations: ['a large amount of', 'the total amount', 'amount to'],
    sentences: [
      { en: 'A large amount of money was donated.', cn: '捐赠了大量的资金。' },
      { en: 'What is the total amount I need to pay?', cn: '我总共需要付多少钱？' }
    ]
  },
  {
    word: 'television',
    phonetic: '/ˈtelɪvɪʒn/',
    meanings: ['n. 电视，电视机'],
    collocations: ['watch television', 'on television', 'television program'],
    sentences: [
      { en: 'I saw it on television last night.', cn: '我昨晚在电视上看到的。' },
      { en: "Let's watch television together.", cn: '我们一起看电视吧。' }
    ]
  },
  {
    word: 'carpet',
    phonetic: '/ˈkɑːrpɪt/',
    meanings: ['n. 地毯'],
    collocations: ['on the carpet', 'carpet floor', 'red carpet'],
    sentences: [
      { en: 'The cat is sleeping on the carpet.', cn: '猫在地毯上睡觉。' },
      { en: 'We need to clean the carpet this weekend.', cn: '这周末我们需要清洁地毯。' }
    ]
  },
  {
    word: 'borrow',
    phonetic: '/ˈbɑːroʊ/',
    meanings: ['v. 借入，借用'],
    collocations: ['borrow from', 'borrow money', 'borrow books'],
    sentences: [
      { en: 'Can I borrow your pen for a moment?', cn: '我能借用一下你的笔吗？' },
      { en: 'She borrowed some money from her friend.', cn: '她向朋友借了些钱。' }
    ]
  },
  {
    word: 'lend',
    phonetic: '/lend/',
    meanings: ['v. 借出，把...借给'],
    collocations: ['lend to', 'lend a hand', 'lend money'],
    sentences: [
      { en: 'Could you lend me your umbrella?', cn: '你能把伞借给我吗？' },
      { en: "I'll lend you a hand with the project.", cn: '我来帮你做这个项目。' }
    ]
  },
  {
    word: 'loan',
    phonetic: '/loʊn/',
    meanings: ['n. 贷款，借款', 'v. 贷款给'],
    collocations: ['bank loan', 'student loan', 'take out a loan'],
    sentences: [
      { en: 'I need to apply for a bank loan.', cn: '我需要申请银行贷款。' },
      { en: "She's still paying off her student loan.", cn: '她还在偿还学生贷款。' }
    ]
  },
  {
    word: 'interest',
    phonetic: '/ˈɪntrəst/',
    meanings: ['n. 兴趣', 'n. 利息'],
    collocations: ['interest rate', 'show interest in', 'lose interest'],
    sentences: [
      { en: 'She shows great interest in music.', cn: '她对音乐表现出极大的兴趣。' },
      { en: 'The interest rate is 5% per year.', cn: '年利率是5%。' }
    ]
  },
  {
    word: 'extra',
    phonetic: '/ˈekstrə/',
    meanings: ['adj. 额外的，附加的', 'n. 额外的东西'],
    collocations: ['extra money', 'extra time', 'extra charge'],
    sentences: [
      { en: 'Is there any extra charge for delivery?', cn: '配送有额外收费吗？' },
      { en: 'I need some extra time to finish this.', cn: '我需要一些额外的时间来完成这个。' }
    ]
  },
  {
    word: 'additional',
    phonetic: '/əˈdɪʃənl/',
    meanings: ['adj. 额外的，附加的'],
    collocations: ['additional information', 'additional cost', 'additional support'],
    sentences: [
      { en: 'Do you need any additional information?', cn: '你需要任何额外的信息吗？' },
      { en: 'There will be no additional cost.', cn: '不会有额外费用。' }
    ]
  },
  {
    word: 'major',
    phonetic: '/ˈmeɪdʒər/',
    meanings: ['adj. 主要的，重大的', 'n. 专业'],
    collocations: ['major in', 'major problem', 'major city'],
    sentences: [
      { en: 'What was your major in college?', cn: '你大学学的什么专业？' },
      { en: 'This is a major decision in my life.', cn: '这是我人生中的重大决定。' }
    ]
  },
  {
    word: 'ancient',
    phonetic: '/ˈeɪnʃənt/',
    meanings: ['adj. 古代的，古老的'],
    collocations: ['ancient history', 'ancient civilization', 'ancient times'],
    sentences: [
      { en: 'I love learning about ancient history.', cn: '我喜欢学习古代历史。' },
      { en: 'This is an ancient temple from 2000 years ago.', cn: '这是一座2000年前的古老寺庙。' }
    ]
  },
  {
    word: 'hall',
    phonetic: '/hɔːl/',
    meanings: ['n. 大厅，展厅，走廊'],
    collocations: ['concert hall', 'city hall', 'in the hall'],
    sentences: [
      { en: 'The concert will be held in the main hall.', cn: '音乐会将在大厅举行。' },
      { en: 'Please wait in the hall.', cn: '请在大厅等候。' }
    ]
  },
  {
    word: 'castle',
    phonetic: '/ˈkæsl/',
    meanings: ['n. 城堡'],
    collocations: ['ancient castle', 'fairy-tale castle', 'castle walls'],
    sentences: [
      { en: 'We visited a beautiful castle in Scotland.', cn: '我们参观了苏格兰一座美丽的城堡。' },
      { en: 'The princess lived in a grand castle.', cn: '公主住在一座宏伟的城堡里。' }
    ]
  },
  {
    word: 'patience',
    phonetic: '/ˈpeɪʃns/',
    meanings: ['n. 耐心，耐性'],
    collocations: ['have patience', 'lose patience', 'patience with'],
    sentences: [
      { en: 'Learning a language requires patience.', cn: '学习语言需要耐心。' },
      { en: 'Please have patience, it will take some time.', cn: '请耐心等待，这需要一些时间。' }
    ]
  },
  {
    word: 'patient',
    phonetic: '/ˈpeɪʃnt/',
    meanings: ['adj. 耐心的', 'n. 病人'],
    collocations: ['be patient with', 'patient care', 'hospital patient'],
    sentences: [
      { en: 'Please be patient with me, I am learning.', cn: '请对我耐心点，我在学习中。' },
      { en: 'The doctor is seeing a patient now.', cn: '医生现在正在看一位病人。' }
    ]
  },
  {
    word: 'passion',
    phonetic: '/ˈpæʃn/',
    meanings: ['n. 热情，激情，酷爱'],
    collocations: ['passion for', 'with passion', 'follow your passion'],
    sentences: [
      { en: 'She has a passion for cooking.', cn: '她对烹饪充满热情。' },
      { en: 'Follow your passion and you will succeed.', cn: '追随你的热情，你会成功的。' }
    ]
  },
  {
    word: 'promotion',
    phonetic: '/prəˈmoʊʃn/',
    meanings: ['n. 促销，晋升，推广'],
    collocations: ['sales promotion', 'get a promotion', 'promotion campaign'],
    sentences: [
      { en: 'There is a big promotion at the store today.', cn: '今天商店有大促销。' },
      { en: 'Congratulations on your promotion!', cn: '恭喜你升职！' }
    ]
  },
  {
    word: 'bear',
    phonetic: '/ber/',
    meanings: ['n. 熊', 'v. 承担，忍受'],
    collocations: ['polar bear', 'bear in mind', 'bear the cost'],
    sentences: [
      { en: 'I saw a bear in the zoo yesterday.', cn: '我昨天在动物园看到了一只熊。' },
      { en: "I can't bear the noise anymore.", cn: '我再也无法忍受这噪音了。' }
    ]
  },
  {
    word: 'household',
    phonetic: '/ˈhaʊshoʊld/',
    meanings: ['n. 家庭', 'adj. 家用的，家庭的'],
    collocations: ['household items', 'household chores', 'household expenses'],
    sentences: [
      { en: 'We need to buy some household items.', cn: '我们需要买一些家用物品。' },
      { en: 'Household chores take up a lot of time.', cn: '家务活占用了很多时间。' }
    ]
  },
  {
    word: 'appliances',
    phonetic: '/əˈplaɪənsɪz/',
    meanings: ['n. 电器，器具'],
    collocations: ['home appliances', 'kitchen appliances', 'electrical appliances'],
    sentences: [
      { en: 'This store sells all kinds of home appliances.', cn: '这家店卖各种家用电器。' },
      { en: 'Modern kitchen appliances make cooking easier.', cn: '现代厨房电器让烹饪更轻松。' }
    ]
  },
  {
    word: 'fridge',
    phonetic: '/frɪdʒ/',
    meanings: ['n. 冰箱'],
    collocations: ['in the fridge', 'put in the fridge', 'fridge door'],
    sentences: [
      { en: 'Put the milk in the fridge please.', cn: '请把牛奶放进冰箱。' },
      { en: 'There is nothing in the fridge.', cn: '冰箱里什么都没有。' }
    ]
  },
  {
    word: 'available',
    phonetic: '/əˈveɪləbl/',
    meanings: ['adj. 可用的，可获得的', 'adj. 有空的，单身的'],
    collocations: ['available for', 'readily available', 'available time'],
    sentences: [
      { en: 'Is this seat available?', cn: '这个座位有人吗？' },
      { en: 'I am available this weekend.', cn: '我这周末有空。' }
    ]
  },
  {
    word: 'hire',
    phonetic: '/haɪər/',
    meanings: ['v. 聘用，雇用', 'v. 租用'],
    collocations: ['hire someone', 'for hire', 'hire a car'],
    sentences: [
      { en: 'We need to hire more staff.', cn: '我们需要雇用更多员工。' },
      { en: "Let's hire a car for the trip.", cn: '我们租辆车去旅行吧。' }
    ]
  },
  {
    word: 'intersection',
    phonetic: '/ˌɪntərˈsekʃn/',
    meanings: ['n. 十字路口，交叉点'],
    collocations: ['at the intersection', 'road intersection', 'intersection of'],
    sentences: [
      { en: 'Turn left at the next intersection.', cn: '在下一个十字路口左转。' },
      { en: 'There was an accident at the intersection.', cn: '十字路口发生了一起事故。' }
    ]
  },
  {
    word: 'recommend',
    phonetic: '/ˌrekəˈmend/',
    meanings: ['v. 推荐，建议'],
    collocations: ['highly recommend', 'recommend to', 'recommend doing'],
    sentences: [
      { en: 'I highly recommend this restaurant.', cn: '我强烈推荐这家餐厅。' },
      { en: 'Can you recommend a good book?', cn: '你能推荐一本好书吗？' }
    ]
  },
  {
    word: 'alternative',
    phonetic: '/ɔːlˈtɜːrnətɪv/',
    meanings: ['n. 替代选择', 'adj. 可替代的，另类的'],
    collocations: ['alternative to', 'alternative option', 'alternative energy'],
    sentences: [
      { en: 'Is there an alternative to this plan?', cn: '有这个计划的替代方案吗？' },
      { en: 'We should consider alternative energy sources.', cn: '我们应该考虑替代能源。' }
    ]
  },
  {
    word: 'exhibition',
    phonetic: '/ˌeksɪˈbɪʃn/',
    meanings: ['n. 展览，展览会'],
    collocations: ['art exhibition', 'hold an exhibition', 'exhibition hall'],
    sentences: [
      { en: 'There is an art exhibition at the museum.', cn: '博物馆有一场艺术展览。' },
      { en: "Let's go to the exhibition this weekend.", cn: '这周末我们去看展览吧。' }
    ]
  },
  {
    word: 'exhibit',
    phonetic: '/ɪɡˈzɪbɪt/',
    meanings: ['v. 展出，陈列', 'n. 展品'],
    collocations: ['exhibit at', 'on exhibit', 'museum exhibit'],
    sentences: [
      { en: 'The museum exhibits ancient artifacts.', cn: '博物馆展出古代文物。' },
      { en: 'This painting is the main exhibit.', cn: '这幅画是主要展品。' }
    ]
  },
  {
    word: 'approximately',
    phonetic: '/əˈprɑːksɪmətli/',
    meanings: ['adv. 大约，近似地'],
    collocations: ['approximately equal', 'approximately how many'],
    sentences: [
      { en: 'It takes approximately two hours to get there.', cn: '到那里大约需要两个小时。' },
      { en: 'There are approximately 100 people here.', cn: '这里大约有100人。' }
    ]
  },
  {
    word: 'hitchhike',
    phonetic: '/ˈhɪtʃhaɪk/',
    meanings: ['v. 搭便车'],
    collocations: ['hitchhike across', 'go hitchhiking'],
    sentences: [
      { en: 'We hitchhiked across the country.', cn: '我们搭便车穿越了全国。' },
      { en: 'Hitchhiking can be dangerous.', cn: '搭便车可能很危险。' }
    ]
  },
  {
    word: 'vehicle',
    phonetic: '/ˈviːɪkl/',
    meanings: ['n. 交通工具，车辆'],
    collocations: ['motor vehicle', 'vehicle registration', 'electric vehicle'],
    sentences: [
      { en: 'What type of vehicle do you drive?', cn: '你开什么类型的车？' },
      { en: 'Electric vehicles are becoming popular.', cn: '电动车越来越受欢迎。' }
    ]
  },
  {
    word: 'involve',
    phonetic: '/ɪnˈvɑːlv/',
    meanings: ['v. 涉及，包含，牵涉'],
    collocations: ['involve in', 'involve doing', 'get involved'],
    sentences: [
      { en: 'This project involves a lot of research.', cn: '这个项目涉及大量研究。' },
      { en: "Don't get involved in their argument.", cn: '不要卷入他们的争论。' }
    ]
  },
  {
    word: 'congested',
    phonetic: '/kənˈdʒestɪd/',
    meanings: ['adj. 拥挤的，堵塞的'],
    collocations: ['congested traffic', 'congested roads', 'congested area'],
    sentences: [
      { en: 'The roads are always congested during rush hour.', cn: '高峰时段道路总是很拥堵。' },
      { en: 'I have a congested nose from my cold.', cn: '我感冒了鼻子很堵。' }
    ]
  },
  {
    word: 'maze',
    phonetic: '/meɪz/',
    meanings: ['n. 迷宫'],
    collocations: ['a maze of', 'lost in a maze', 'maze puzzle'],
    sentences: [
      { en: 'The children got lost in the maze.', cn: '孩子们在迷宫里迷路了。' },
      { en: 'The old city is a maze of narrow streets.', cn: '老城区是一个由窄街组成的迷宫。' }
    ]
  },
  {
    word: 'farewell',
    phonetic: '/ˌferˈwel/',
    meanings: ['n. 告别，道别', 'int. 再见'],
    collocations: ['farewell party', 'bid farewell', 'farewell speech'],
    sentences: [
      { en: "We held a farewell party for her.", cn: '我们为她举办了一个告别派对。' },
      { en: 'It was hard to say farewell.', cn: '道别真的很难。' }
    ]
  },
  {
    word: 'scenario',
    phonetic: '/səˈnerioʊ/',
    meanings: ['n. 场景，情景，方案'],
    collocations: ['worst-case scenario', 'possible scenario', 'in this scenario'],
    sentences: [
      { en: "Let's consider the worst-case scenario.", cn: '让我们考虑一下最坏的情况。' },
      { en: 'In this scenario, we need a backup plan.', cn: '在这种情况下，我们需要一个备用计划。' }
    ]
  },
  {
    word: 'souvenir',
    phonetic: '/ˌsuːvəˈnɪr/',
    meanings: ['n. 纪念品'],
    collocations: ['souvenir shop', 'buy souvenirs', 'as a souvenir'],
    sentences: [
      { en: 'I bought this as a souvenir from Paris.', cn: '我买这个作为巴黎的纪念品。' },
      { en: "Let's stop at the souvenir shop.", cn: '我们去纪念品店看看吧。' }
    ]
  },
  {
    word: 'gesture',
    phonetic: '/ˈdʒestʃər/',
    meanings: ['n. 手势，姿态', 'n. 表示，举动'],
    collocations: ['make a gesture', 'kind gesture', 'hand gesture'],
    sentences: [
      { en: 'He made a gesture with his hand.', cn: '他做了一个手势。' },
      { en: 'Sending flowers was a nice gesture.', cn: '送花是一个很好的表示。' }
    ]
  },
  {
    word: 'photography',
    phonetic: '/fəˈtɑːɡrəfi/',
    meanings: ['n. 摄影，摄影术'],
    collocations: ['photography skills', 'wedding photography', 'photography class'],
    sentences: [
      { en: 'She is studying photography at college.', cn: '她在大学学习摄影。' },
      { en: 'I have a passion for photography.', cn: '我对摄影充满热情。' }
    ]
  },
  {
    word: 'pursue',
    phonetic: '/pərˈsuː/',
    meanings: ['v. 追求，追赶'],
    collocations: ['pursue a career', 'pursue a dream', 'pursue happiness'],
    sentences: [
      { en: 'She decided to pursue her dream of becoming a singer.', cn: '她决定追求成为歌手的梦想。' },
      { en: 'Everyone has the right to pursue happiness.', cn: '每个人都有追求幸福的权利。' }
    ]
  },
  {
    word: 'accept',
    phonetic: '/əkˈsept/',
    meanings: ['v. 接受，认可'],
    collocations: ['accept an offer', 'accept responsibility', 'widely accepted'],
    sentences: [
      { en: 'I decided to accept the job offer.', cn: '我决定接受这份工作邀请。' },
      { en: 'You need to accept responsibility for your actions.', cn: '你需要为自己的行为承担责任。' }
    ]
  },
  {
    word: 'transaction',
    phonetic: '/trænˈzækʃn/',
    meanings: ['n. 交易，业务'],
    collocations: ['business transaction', 'financial transaction', 'online transaction'],
    sentences: [
      { en: 'The transaction was completed successfully.', cn: '交易成功完成。' },
      { en: 'Online transactions are very convenient.', cn: '在线交易非常方便。' }
    ]
  },
  {
    word: 'reunion',
    phonetic: '/riːˈjuːniən/',
    meanings: ['n. 重聚，团聚，聚会'],
    collocations: ['family reunion', 'class reunion', 'reunion party'],
    sentences: [
      { en: 'We have a family reunion every Chinese New Year.', cn: '我们每年春节都有家庭团聚。' },
      { en: 'I am going to my high school reunion next month.', cn: '下个月我要参加高中同学聚会。' }
    ]
  },
  {
    word: 'attend',
    phonetic: '/əˈtend/',
    meanings: ['v. 参加，出席'],
    collocations: ['attend a meeting', 'attend school', 'attend to'],
    sentences: [
      { en: 'Will you attend the wedding?', cn: '你会参加婚礼吗？' },
      { en: 'She attends a local university.', cn: '她在当地一所大学上学。' }
    ]
  },
  {
    word: 'graduate',
    phonetic: '/ˈɡrædʒuət/',
    meanings: ['v. 毕业', 'n. 毕业生'],
    collocations: ['graduate from', 'college graduate', 'graduate school'],
    sentences: [
      { en: 'I graduated from university last year.', cn: '我去年大学毕业。' },
      { en: 'She is a graduate of Harvard.', cn: '她是哈佛大学的毕业生。' }
    ]
  },
  {
    word: 'formal',
    phonetic: '/ˈfɔːrml/',
    meanings: ['adj. 正式的，正规的'],
    collocations: ['formal dress', 'formal education', 'formal language'],
    sentences: [
      { en: 'Please wear formal dress to the dinner.', cn: '请穿正装参加晚宴。' },
      { en: 'This is a formal meeting.', cn: '这是一个正式会议。' }
    ]
  },
  {
    word: 'reach',
    phonetic: '/riːtʃ/',
    meanings: ['v. 到达，联系', 'v. 伸出'],
    collocations: ['reach out', 'reach a goal', 'reach an agreement'],
    sentences: [
      { en: 'I tried to reach you but your phone was off.', cn: '我试着联系你，但你的电话关机了。' },
      { en: 'We finally reached an agreement.', cn: '我们终于达成了协议。' }
    ]
  },
  {
    word: 'cereal',
    phonetic: '/ˈsɪriəl/',
    meanings: ['n. 麦片，谷物'],
    collocations: ['breakfast cereal', 'cereal box', 'cereal with milk'],
    sentences: [
      { en: 'I usually have cereal for breakfast.', cn: '我通常早餐吃麦片。' },
      { en: 'Do you want cereal with milk?', cn: '你要加牛奶的麦片吗？' }
    ]
  },
  {
    word: 'minor',
    phonetic: '/ˈmaɪnər/',
    meanings: ['adj. 较小的，轻微的', 'n. 未成年人'],
    collocations: ['minor problem', 'minor injury', 'minor details'],
    sentences: [
      { en: 'It is just a minor problem, do not worry.', cn: '这只是个小问题，别担心。' },
      { en: 'She suffered only minor injuries.', cn: '她只受了轻伤。' }
    ]
  },
  {
    word: 'polite',
    phonetic: '/pəˈlaɪt/',
    meanings: ['adj. 有礼貌的，客气的'],
    collocations: ['polite to', 'polite manner', 'polite request'],
    sentences: [
      { en: 'Please be polite to the guests.', cn: '请对客人有礼貌。' },
      { en: 'It is polite to say thank you.', cn: '说谢谢是有礼貌的表现。' }
    ]
  },
  {
    word: 'refuse',
    phonetic: '/rɪˈfjuːz/',
    meanings: ['v. 拒绝'],
    collocations: ['refuse to do', 'refuse an offer', 'politely refuse'],
    sentences: [
      { en: 'She refused to answer the question.', cn: '她拒绝回答这个问题。' },
      { en: 'I had to politely refuse the invitation.', cn: '我不得不礼貌地拒绝邀请。' }
    ]
  },
  {
    word: 'decline',
    phonetic: '/dɪˈklaɪn/',
    meanings: ['v. 拒绝，婉拒', 'v. 下降'],
    collocations: ['decline an invitation', 'decline in', 'sharp decline'],
    sentences: [
      { en: 'I had to decline the invitation.', cn: '我不得不婉拒邀请。' },
      { en: 'Sales have declined this year.', cn: '今年销售额下降了。' }
    ]
  },
  {
    word: 'healthcare',
    phonetic: '/ˈhelθker/',
    meanings: ['n. 医疗保健'],
    collocations: ['healthcare system', 'healthcare worker', 'healthcare costs'],
    sentences: [
      { en: 'Everyone deserves good healthcare.', cn: '每个人都应该享有良好的医疗保健。' },
      { en: 'Healthcare costs keep rising.', cn: '医疗费用不断上涨。' }
    ]
  },
  {
    word: 'medicine',
    phonetic: '/ˈmedɪsn/',
    meanings: ['n. 药物，医学'],
    collocations: ['take medicine', 'study medicine', 'traditional medicine'],
    sentences: [
      { en: 'Remember to take your medicine.', cn: '记得吃药。' },
      { en: 'She is studying medicine at university.', cn: '她在大学学医。' }
    ]
  },
  {
    word: 'emphasize',
    phonetic: '/ˈemfəsaɪz/',
    meanings: ['v. 强调，重视'],
    collocations: ['emphasize the importance', 'strongly emphasize', 'emphasize that'],
    sentences: [
      { en: 'I want to emphasize the importance of this.', cn: '我想强调这件事的重要性。' },
      { en: 'The teacher emphasized that we should study hard.', cn: '老师强调我们应该努力学习。' }
    ]
  },
  {
    word: 'positive',
    phonetic: '/ˈpɑːzətɪv/',
    meanings: ['adj. 积极的，正面的', 'adj. 确定的'],
    collocations: ['positive attitude', 'positive feedback', 'stay positive'],
    sentences: [
      { en: 'Try to stay positive during difficult times.', cn: '在困难时期尽量保持积极。' },
      { en: 'We received positive feedback from customers.', cn: '我们收到了客户的正面反馈。' }
    ]
  },
  {
    word: 'nationality',
    phonetic: '/ˌnæʃəˈnæləti/',
    meanings: ['n. 国籍'],
    collocations: ['Chinese nationality', 'dual nationality', 'nationality and citizenship'],
    sentences: [
      { en: 'What is your nationality?', cn: '你是哪国人？' },
      { en: 'She has dual nationality.', cn: '她有双重国籍。' }
    ]
  },
  {
    word: 'responsible',
    phonetic: '/rɪˈspɑːnsəbl/',
    meanings: ['adj. 负责的，有责任的'],
    collocations: ['responsible for', 'be held responsible', 'responsible person'],
    sentences: [
      { en: 'Who is responsible for this project?', cn: '谁负责这个项目？' },
      { en: 'She is a very responsible person.', cn: '她是一个非常负责任的人。' }
    ]
  },
  {
    word: 'occasionally',
    phonetic: '/əˈkeɪʒnəli/',
    meanings: ['adv. 偶尔，有时'],
    collocations: ['occasionally visit', 'only occasionally', 'occasionally used'],
    sentences: [
      { en: 'I occasionally eat fast food.', cn: '我偶尔吃快餐。' },
      { en: 'We meet occasionally for coffee.', cn: '我们偶尔见面喝咖啡。' }
    ]
  },
  {
    word: 'admire',
    phonetic: '/ədˈmaɪər/',
    meanings: ['v. 钦佩，欣赏，赞赏'],
    collocations: ['admire someone', 'greatly admire', 'admire for'],
    sentences: [
      { en: 'I really admire your courage.', cn: '我真的很钦佩你的勇气。' },
      { en: 'She is admired for her kindness.', cn: '她因善良而受人赞赏。' }
    ]
  },
  {
    word: 'describe',
    phonetic: '/dɪˈskraɪb/',
    meanings: ['v. 描述，形容'],
    collocations: ['describe as', 'describe in detail', 'hard to describe'],
    sentences: [
      { en: 'Can you describe what happened?', cn: '你能描述一下发生了什么吗？' },
      { en: 'Words cannot describe how happy I am.', cn: '言语无法形容我有多高兴。' }
    ]
  },
  {
    word: 'environment',
    phonetic: '/ɪnˈvaɪrənmənt/',
    meanings: ['n. 环境'],
    collocations: ['natural environment', 'protect the environment', 'work environment'],
    sentences: [
      { en: 'We must protect the environment.', cn: '我们必须保护环境。' },
      { en: 'The work environment here is very friendly.', cn: '这里的工作环境非常友好。' }
    ]
  },
  {
    word: 'polluted',
    phonetic: '/pəˈluːtɪd/',
    meanings: ['adj. 被污染的'],
    collocations: ['polluted air', 'polluted water', 'heavily polluted'],
    sentences: [
      { en: 'The river is heavily polluted.', cn: '这条河被严重污染了。' },
      { en: 'We need to clean up the polluted areas.', cn: '我们需要清理被污染的地区。' }
    ]
  },
  {
    word: 'tolerate',
    phonetic: '/ˈtɑːləreɪt/',
    meanings: ['v. 忍受，容忍'],
    collocations: ['cannot tolerate', 'tolerate behavior', 'hard to tolerate'],
    sentences: [
      { en: 'I cannot tolerate rudeness.', cn: '我无法容忍粗鲁的行为。' },
      { en: 'She tolerated the pain without complaining.', cn: '她忍受着疼痛没有抱怨。' }
    ]
  },
  {
    word: 'intact',
    phonetic: '/ɪnˈtækt/',
    meanings: ['adj. 完整的，未受损的'],
    collocations: ['remain intact', 'keep intact', 'intact structure'],
    sentences: [
      { en: 'The building remained intact after the earthquake.', cn: '地震后建筑物完好无损。' },
      { en: 'Luckily, the package arrived intact.', cn: '幸运的是，包裹完好无损地到达了。' }
    ]
  },
  {
    word: 'culture',
    phonetic: '/ˈkʌltʃər/',
    meanings: ['n. 文化'],
    collocations: ['Chinese culture', 'popular culture', 'cultural differences'],
    sentences: [
      { en: 'I love learning about different cultures.', cn: '我喜欢了解不同的文化。' },
      { en: 'Chinese culture has a long history.', cn: '中国文化有着悠久的历史。' }
    ]
  },
  {
    word: 'common',
    phonetic: '/ˈkɑːmən/',
    meanings: ['adj. 常见的，普通的'],
    collocations: ['common problem', 'in common', 'common sense'],
    sentences: [
      { en: 'This is a very common mistake.', cn: '这是一个非常常见的错误。' },
      { en: 'We have a lot in common.', cn: '我们有很多共同点。' }
    ]
  },
  {
    word: 'spicy',
    phonetic: '/ˈspaɪsi/',
    meanings: ['adj. 辣的，辛辣的'],
    collocations: ['spicy food', 'too spicy', 'spicy flavor'],
    sentences: [
      { en: 'I love spicy food!', cn: '我喜欢吃辣！' },
      { en: 'This dish is too spicy for me.', cn: '这道菜对我来说太辣了。' }
    ]
  },
  {
    word: 'accommodation',
    phonetic: '/əˌkɑːməˈdeɪʃn/',
    meanings: ['n. 住宿，住处'],
    collocations: ['find accommodation', 'hotel accommodation', 'student accommodation'],
    sentences: [
      { en: 'We need to find accommodation for the night.', cn: '我们需要找个地方过夜。' },
      { en: 'The price includes accommodation and meals.', cn: '价格包含住宿和餐饮。' }
    ]
  },
  {
    word: 'aware',
    phonetic: '/əˈwer/',
    meanings: ['adj. 意识到的，知道的'],
    collocations: ['be aware of', 'become aware', 'well aware'],
    sentences: [
      { en: 'Are you aware of the risks?', cn: '你意识到风险了吗？' },
      { en: 'I am well aware of the problem.', cn: '我很清楚这个问题。' }
    ]
  },
  {
    word: 'scam',
    phonetic: '/skæm/',
    meanings: ['n. 骗局，诈骗', 'v. 诈骗'],
    collocations: ['online scam', 'scam alert', 'fall for a scam'],
    sentences: [
      { en: 'Be careful of online scams.', cn: '小心网络诈骗。' },
      { en: 'She almost fell for the scam.', cn: '她差点上当受骗。' }
    ]
  },
  {
    word: 'fraud',
    phonetic: '/frɔːd/',
    meanings: ['n. 欺诈，诈骗'],
    collocations: ['credit card fraud', 'commit fraud', 'fraud prevention'],
    sentences: [
      { en: 'He was arrested for fraud.', cn: '他因欺诈被逮捕。' },
      { en: 'Credit card fraud is increasing.', cn: '信用卡诈骗正在增加。' }
    ]
  },
  {
    word: 'privacy',
    phonetic: '/ˈpraɪvəsi/',
    meanings: ['n. 隐私，私密'],
    collocations: ['respect privacy', 'invasion of privacy', 'privacy policy'],
    sentences: [
      { en: 'Please respect my privacy.', cn: '请尊重我的隐私。' },
      { en: 'Read the privacy policy before signing up.', cn: '注册前请阅读隐私政策。' }
    ]
  },
  {
    word: 'government',
    phonetic: '/ˈɡʌvərnmənt/',
    meanings: ['n. 政府'],
    collocations: ['local government', 'government policy', 'government official'],
    sentences: [
      { en: 'The government announced new policies.', cn: '政府宣布了新政策。' },
      { en: 'She works for the local government.', cn: '她在当地政府工作。' }
    ]
  },
  {
    word: 'ambulance',
    phonetic: '/ˈæmbjələns/',
    meanings: ['n. 救护车'],
    collocations: ['call an ambulance', 'ambulance service', 'ambulance driver'],
    sentences: [
      { en: 'Quick! Call an ambulance!', cn: '快！叫救护车！' },
      { en: 'The ambulance arrived within minutes.', cn: '救护车几分钟内就到了。' }
    ]
  },
  {
    word: 'ambition',
    phonetic: '/æmˈbɪʃn/',
    meanings: ['n. 野心，雄心，抱负'],
    collocations: ['have ambition', 'career ambition', 'achieve ambition'],
    sentences: [
      { en: 'She has great ambition to succeed.', cn: '她有很大的成功抱负。' },
      { en: 'What is your greatest ambition?', cn: '你最大的抱负是什么？' }
    ]
  },
  {
    word: 'treasure',
    phonetic: '/ˈtreʒər/',
    meanings: ['n. 财宝，珍宝', 'v. 珍惜'],
    collocations: ['hidden treasure', 'treasure hunt', 'treasure the memory'],
    sentences: [
      { en: 'They found buried treasure on the island.', cn: '他们在岛上发现了埋藏的宝藏。' },
      { en: 'I treasure our friendship.', cn: '我珍惜我们的友谊。' }
    ]
  },
  {
    word: 'fortune',
    phonetic: '/ˈfɔːrtʃən/',
    meanings: ['n. 财富，运气'],
    collocations: ['make a fortune', 'good fortune', 'fortune teller'],
    sentences: [
      { en: 'He made a fortune in real estate.', cn: '他在房地产上发了财。' },
      { en: 'I wish you good fortune!', cn: '祝你好运！' }
    ]
  },
  {
    word: 'gym',
    phonetic: '/dʒɪm/',
    meanings: ['n. 健身房，体育馆'],
    collocations: ['go to the gym', 'gym membership', 'gym workout'],
    sentences: [
      { en: 'I go to the gym three times a week.', cn: '我每周去健身房三次。' },
      { en: 'Do you have a gym membership?', cn: '你有健身房会员卡吗？' }
    ]
  },
  {
    word: 'maintain',
    phonetic: '/meɪnˈteɪn/',
    meanings: ['v. 保持，维护，维持'],
    collocations: ['maintain health', 'maintain balance', 'maintain contact'],
    sentences: [
      { en: 'It is important to maintain a healthy lifestyle.', cn: '保持健康的生活方式很重要。' },
      { en: 'We need to maintain good relationships.', cn: '我们需要保持良好的关系。' }
    ]
  },
  {
    word: 'consume',
    phonetic: '/kənˈsuːm/',
    meanings: ['v. 消耗，消费，吃喝'],
    collocations: ['consume energy', 'consume food', 'time-consuming'],
    sentences: [
      { en: 'This device consumes a lot of energy.', cn: '这个设备消耗很多能源。' },
      { en: 'How much water do you consume daily?', cn: '你每天喝多少水？' }
    ]
  },
  {
    word: 'shoulder',
    phonetic: '/ˈʃoʊldər/',
    meanings: ['n. 肩膀', 'v. 承担'],
    collocations: ['on your shoulder', 'shoulder to shoulder', 'shoulder responsibility'],
    sentences: [
      { en: 'She put her hand on my shoulder.', cn: '她把手放在我肩膀上。' },
      { en: 'We stood shoulder to shoulder.', cn: '我们肩并肩站着。' }
    ]
  },
];

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected!');

  console.log(`Seeding ${initialWords.length} words with full data...`);

  let inserted = 0;
  let skipped = 0;

  for (const wordData of initialWords) {
    try {
      await Word.findOneAndUpdate(
        { word: wordData.word },
        {
          ...wordData,
          is_custom: false,
        },
        { upsert: true, new: true }
      );
      inserted++;
      process.stdout.write(`\rProgress: ${inserted}/${initialWords.length}`);
    } catch (error) {
      skipped++;
      console.log(`\nSkipped: ${wordData.word}`);
    }
  }

  console.log(`\nDone! Inserted/Updated: ${inserted}, Skipped: ${skipped}`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
