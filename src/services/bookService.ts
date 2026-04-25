import type { Book } from '../types';

export const DEFAULT_BOOKS: Book[] = [
  {
    id: 'book-1',
    title: '好饿的毛毛虫',
    author: '艾瑞·卡尔',
    description: '一只小毛毛虫从蛋里孵化出来，每天吃不同的食物，最后变成美丽的蝴蝶。书中带有洞洞设计，适合宝宝手指探索。',
    suitableAge: [0, 3],
    rating: 4.9,
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    category: '认知启蒙',
  },
  {
    id: 'book-2',
    title: '棕色的熊，棕色的熊，你在看什么？',
    author: '比尔·马丁',
    description: '通过重复的句式和鲜艳的色彩，帮助孩子认识动物和颜色。节奏感强，适合亲子共读。',
    suitableAge: [0, 3],
    rating: 4.8,
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    category: '认知启蒙',
  },
  {
    id: 'book-3',
    title: '猜猜我有多爱你',
    author: '山姆·麦克布雷尼',
    description: '小兔子和大兔子用各种方式表达谁爱对方更多，温馨感人的睡前故事，传递亲子之爱。',
    suitableAge: [0, 5],
    rating: 4.9,
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
    category: '情感绘本',
  },
  {
    id: 'book-4',
    title: '我爸爸',
    author: '安东尼·布朗',
    description: '用孩子的视角描述爸爸的伟大，充满想象力和幽默感，帮助孩子建立对父亲的崇拜感。',
    suitableAge: [1, 4],
    rating: 4.8,
    cover: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400',
    category: '家庭亲情',
  },
  {
    id: 'book-5',
    title: '我妈妈',
    author: '安东尼·布朗',
    description: '《我爸爸》的姊妹篇，描述妈妈的多才多艺和温柔体贴，让孩子感受母爱的温暖。',
    suitableAge: [1, 4],
    rating: 4.8,
    cover: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=400',
    category: '家庭亲情',
  },
  {
    id: 'book-6',
    title: '小蓝和小黄',
    author: '李欧·李奥尼',
    description: '两个好朋友小蓝和小黄拥抱后变成了绿色，通过简单的故事讲述颜色的混合原理。',
    suitableAge: [2, 5],
    rating: 4.7,
    cover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
    category: '艺术创意',
  },
  {
    id: 'book-7',
    title: '爷爷一定有办法',
    author: '菲比·吉尔曼',
    description: '爷爷用巧手把旧毯子变成外套、背心、领带等各种物品，展现智慧和亲情的传承。',
    suitableAge: [3, 7],
    rating: 4.8,
    cover: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400',
    category: '家庭亲情',
  },
  {
    id: 'book-8',
    title: '大卫，不可以',
    author: '大卫·香农',
    description: '调皮的大卫总是做各种淘气的行为，但妈妈最后还是会给他温暖的拥抱。帮助孩子理解规则和爱。',
    suitableAge: [2, 5],
    rating: 4.7,
    cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400',
    category: '行为习惯',
  },
  {
    id: 'book-9',
    title: '逃家小兔',
    author: '玛格丽特·怀兹·布朗',
    description: '小兔子想象自己变成各种东西逃离家，但妈妈总有办法找到他，表达母爱的永恒追随。',
    suitableAge: [2, 6],
    rating: 4.8,
    cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400',
    category: '情感绘本',
  },
  {
    id: 'book-10',
    title: '小熊宝宝绘本系列',
    author: '佐佐木洋子',
    description: '涵盖吃饭、睡觉、洗澡、刷牙等日常生活场景，帮助宝宝建立良好的生活习惯。',
    suitableAge: [1, 4],
    rating: 4.9,
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
    category: '行为习惯',
  },
  {
    id: 'book-11',
    title: '点点点',
    author: '埃尔维·杜莱',
    description: '互动性极强的创意绘本，通过按点、摩擦、摇晃等动作，让画面产生神奇变化，激发想象力。',
    suitableAge: [2, 6],
    rating: 4.9,
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
    category: '互动游戏',
  },
  {
    id: 'book-12',
    title: '蹦！',
    author: '松冈达英',
    description: '简单的"蹦"字重复出现，各种动物和小朋友一起蹦跳，适合低龄宝宝的语言启蒙。',
    suitableAge: [0, 3],
    rating: 4.7,
    cover: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400',
    category: '语言启蒙',
  },
  {
    id: 'book-13',
    title: '晚安，月亮',
    author: '玛格丽特·怀兹·布朗',
    description: '小兔子睡前向房间里的每样东西道晚安，温柔舒缓的睡前仪式，帮助孩子安然入睡。',
    suitableAge: [0, 4],
    rating: 4.8,
    cover: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=400',
    category: '睡前故事',
  },
  {
    id: 'book-14',
    title: '彩虹色的花',
    author: '麦克·格雷涅茨',
    description: '一朵彩虹色的花帮助各种小动物，最后虽然凋零但春天会再次绽放，传递分享与奉献的精神。',
    suitableAge: [2, 6],
    rating: 4.8,
    cover: 'https://images.unsplash.com/photo-1460518451285-97b6aa326961?w=400',
    category: '品格培养',
  },
  {
    id: 'book-15',
    title: '猜猜我是谁',
    author: '尼娜·兰登',
    description: '洞洞书设计，通过局部图案猜测是什么动物，最后是一面镜子看到宝宝自己，趣味十足。',
    suitableAge: [0, 3],
    rating: 4.7,
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    category: '互动游戏',
  },
];

export class BookService {
  static getAllBooks(): Book[] {
    return DEFAULT_BOOKS;
  }

  static getBookById(id: string): Book | null {
    return DEFAULT_BOOKS.find((b) => b.id === id) || null;
  }

  static getBooksByAge(age: number): Book[] {
    return DEFAULT_BOOKS.filter((b) => age >= b.suitableAge[0] && age <= b.suitableAge[1]);
  }

  static getBooksByCategory(category: string): Book[] {
    return DEFAULT_BOOKS.filter((b) => b.category === category);
  }

  static getCategories(): string[] {
    return [...new Set(DEFAULT_BOOKS.map((b) => b.category))];
  }

  static searchBooks(query: string): Book[] {
    const lowerQuery = query.toLowerCase();
    return DEFAULT_BOOKS.filter(
      (b) =>
        b.title.toLowerCase().includes(lowerQuery) ||
        b.author.toLowerCase().includes(lowerQuery) ||
        b.description.toLowerCase().includes(lowerQuery)
    );
  }

  static getTopRatedBooks(limit: number = 5): Book[] {
    return [...DEFAULT_BOOKS].sort((a, b) => b.rating - a.rating).slice(0, limit);
  }
}
