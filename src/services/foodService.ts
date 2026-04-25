import type { FoodRecipe } from '../types';

export const DEFAULT_RECIPES: FoodRecipe[] = [
  {
    id: 'recipe-1',
    name: '高铁米粉',
    description: '宝宝的第一口辅食，易消化且富含铁元素',
    ingredients: ['婴儿高铁米粉 10g', '温水 60ml'],
    steps: ['准备60ml温水（约40-50°C）', '将米粉均匀撒入水中', '静置30秒后顺时针搅拌', '调至顺滑糊状即可喂食'],
    nutrition: '富含铁、锌、维生素B族，补充母乳/奶粉中铁含量不足',
    suitableAge: [6, 8],
    difficulty: 'easy',
    duration: 5,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
    category: '泥糊状',
  },
  {
    id: 'recipe-2',
    name: '胡萝卜泥',
    description: '富含维生素A，有助于宝宝视力发育',
    ingredients: ['胡萝卜 1根', '清水 适量'],
    steps: ['胡萝卜去皮洗净切小块', '上锅蒸15-20分钟至软烂', '放入辅食机打成泥', '可加少许温水调至合适稠度'],
    nutrition: '富含β-胡萝卜素、维生素A、膳食纤维',
    suitableAge: [6, 9],
    difficulty: 'easy',
    duration: 25,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
    category: '蔬菜泥',
  },
  {
    id: 'recipe-3',
    name: '南瓜小米粥',
    description: '香甜软糯，易消化吸收',
    ingredients: ['小米 20g', '南瓜 50g', '清水 200ml'],
    steps: ['小米淘洗干净', '南瓜去皮去籽切小丁', '小米和南瓜一起放入锅中', '加清水大火煮开转小火煮30分钟', '煮至软烂成粥状'],
    nutrition: '富含碳水化合物、维生素A、B族维生素、钾',
    suitableAge: [7, 12],
    difficulty: 'easy',
    duration: 40,
    image: 'https://images.unsplash.com/photo-1511914678378-2906b1f69dcf?w=400',
    category: '粥类',
  },
  {
    id: 'recipe-4',
    name: '鸡肉蔬菜泥',
    description: '优质蛋白搭配蔬菜，营养均衡',
    ingredients: ['鸡胸肉 30g', '西兰花 20g', '胡萝卜 20g', '清水 适量'],
    steps: ['鸡肉洗净去筋膜切小块', '西兰花、胡萝卜洗净切小朵', '鸡肉和蔬菜分别焯水煮熟', '放入辅食机打成泥', '可加少许煮肉汤调稀'],
    nutrition: '优质蛋白质、铁、锌、维生素C、膳食纤维',
    suitableAge: [7, 10],
    difficulty: 'medium',
    duration: 30,
    image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400',
    category: '肉泥',
  },
  {
    id: 'recipe-5',
    name: '苹果泥',
    description: '酸甜可口，富含维生素C',
    ingredients: ['苹果 1个', '清水 少许'],
    steps: ['苹果洗净去皮去核', '切小块放入蒸锅', '蒸5-8分钟至软', '用辅食机打成泥或直接刮泥'],
    nutrition: '维生素C、果胶、膳食纤维、钾',
    suitableAge: [6, 9],
    difficulty: 'easy',
    duration: 15,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
    category: '果泥',
  },
  {
    id: 'recipe-6',
    name: '三文鱼蔬菜粥',
    description: 'DHA丰富，促进大脑发育',
    ingredients: ['三文鱼 30g', '大米 20g', '菠菜 20g', '清水 200ml'],
    steps: ['大米淘洗煮粥', '三文鱼洗净去刺切小丁', '菠菜焯水切碎', '粥快熟时加入三文鱼', '最后加入菠菜煮2分钟即可'],
    nutrition: 'DHA、优质蛋白、Omega-3、铁、钙',
    suitableAge: [8, 15],
    difficulty: 'medium',
    duration: 45,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    category: '鱼肉类',
  },
  {
    id: 'recipe-7',
    name: '蛋黄泥',
    description: '富含卵磷脂和铁，营养密度高',
    ingredients: ['鸡蛋 1个', '温水 少许'],
    steps: ['鸡蛋冷水下锅', '水开后煮8-10分钟', '捞出过凉水', '剥壳取蛋黄', '蛋黄加少许温水压成泥'],
    nutrition: '卵磷脂、铁、蛋白质、维生素A、D、E',
    suitableAge: [8, 12],
    difficulty: 'easy',
    duration: 15,
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400',
    category: '蛋奶类',
  },
  {
    id: 'recipe-8',
    name: '牛肉蔬菜面条',
    description: '补铁佳品，锻炼咀嚼能力',
    ingredients: ['婴儿面条 30g', '牛肉 30g', '番茄 30g', '青菜 20g'],
    steps: ['牛肉洗净剁碎', '番茄去皮切丁，青菜切碎', '锅中加水煮开下面条', '面条快熟时加入牛肉和番茄', '最后加青菜煮2分钟'],
    nutrition: '优质蛋白、铁、锌、维生素C、番茄红素',
    suitableAge: [10, 18],
    difficulty: 'medium',
    duration: 25,
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400',
    category: '面食',
  },
  {
    id: 'recipe-9',
    name: '豆腐蔬菜饼',
    description: '软嫩易嚼，富含钙质',
    ingredients: ['嫩豆腐 50g', '胡萝卜 20g', '西葫芦 20g', '面粉 15g'],
    steps: ['豆腐压碎', '胡萝卜、西葫芦擦丝焯水', '所有材料混合搅拌均匀', '平底锅刷油小火煎', '煎至两面金黄'],
    nutrition: '钙、蛋白质、维生素A、膳食纤维',
    suitableAge: [10, 18],
    difficulty: 'medium',
    duration: 20,
    image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=400',
    category: '手指食物',
  },
  {
    id: 'recipe-10',
    name: '紫薯山药泥',
    description: '香甜软糯，健脾养胃',
    ingredients: ['紫薯 50g', '山药 50g', '配方奶 30ml'],
    steps: ['紫薯、山药去皮洗净切小块', '上锅蒸20分钟至软烂', '放入碗中压成泥', '加入配方奶调至顺滑'],
    nutrition: '膳食纤维、维生素A、钾、黏液蛋白',
    suitableAge: [7, 12],
    difficulty: 'easy',
    duration: 30,
    image: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=400',
    category: '泥糊状',
  },
  {
    id: 'recipe-11',
    name: '鲜虾蔬菜丸',
    description: 'Q弹鲜美，富含钙质',
    ingredients: ['鲜虾 50g', '西兰花 20g', '淀粉 10g', '蛋清 少许'],
    steps: ['虾去壳去虾线洗净', '西兰花焯水', '虾肉和西兰花打成泥', '加入淀粉和蛋清搅拌上劲', '挤成丸子煮熟'],
    nutrition: '优质蛋白、钙、锌、维生素C',
    suitableAge: [12, 24],
    difficulty: 'hard',
    duration: 35,
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400',
    category: '手指食物',
  },
  {
    id: 'recipe-12',
    name: '牛油果香蕉泥',
    description: '口感绵密，健康脂肪来源',
    ingredients: ['牛油果 半个', '香蕉 半根'],
    steps: ['牛油果对半切开去核', '用勺子挖出果肉', '香蕉切小段', '两者混合压成泥即可'],
    nutrition: '健康脂肪、钾、维生素B6、叶酸',
    suitableAge: [6, 12],
    difficulty: 'easy',
    duration: 5,
    image: 'https://images.unsplash.com/photo-1523049673856-6468baca292f?w=400',
    category: '果泥',
  },
];

export class FoodService {
  static getAllRecipes(): FoodRecipe[] {
    return DEFAULT_RECIPES;
  }

  static getRecipeById(id: string): FoodRecipe | null {
    return DEFAULT_RECIPES.find((r) => r.id === id) || null;
  }

  static getRecipesByAge(months: number): FoodRecipe[] {
    return DEFAULT_RECIPES.filter(
      (r) => months >= r.suitableAge[0] && months <= r.suitableAge[1]
    );
  }

  static getRecipesByCategory(category: string): FoodRecipe[] {
    return DEFAULT_RECIPES.filter((r) => r.category === category);
  }

  static getRecipesByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): FoodRecipe[] {
    return DEFAULT_RECIPES.filter((r) => r.difficulty === difficulty);
  }

  static getCategories(): string[] {
    return [...new Set(DEFAULT_RECIPES.map((r) => r.category))];
  }

  static searchRecipes(query: string): FoodRecipe[] {
    const lowerQuery = query.toLowerCase();
    return DEFAULT_RECIPES.filter(
      (r) =>
        r.name.toLowerCase().includes(lowerQuery) ||
        r.description.toLowerCase().includes(lowerQuery) ||
        r.ingredients.some((i) => i.toLowerCase().includes(lowerQuery))
    );
  }
}
