import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  Chip,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Restaurant as FoodIcon,
  LocalDining as RecipeIcon,
  Favorite as LikeIcon,
  AccessTime as TimeIcon,
  FireHot as SpicyIcon,
  Info as InfoIcon,
  Search as SearchIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useChildrenStore } from '../stores/childrenStore';

// 食谱类型
interface Recipe {
  id: string;
  name: string;
  minMonth: number;
  maxMonth: number;
  ingredients: string[];
  steps: string[];
  nutrition: string;
  prepTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tips?: string;
}

// 辅食分类
const FOOD_CATEGORIES = [
  { id: 'grains', name: '谷薯类', icon: '🌾', description: '米粥、面条、馒头、红薯等' },
  { id: 'vegetables', name: '蔬菜类', icon: '🥬', description: '菠菜、胡萝卜、南瓜、西兰花等' },
  { id: 'fruits', name: '水果类', icon: '🍎', description: '苹果、香蕉、梨、橙子等' },
  { id: 'meat', name: '肉蛋类', icon: '🥩', description: '鸡肉、猪肉、牛肉、鸡蛋等' },
  { id: 'seafood', name: '水产类', icon: '🐟', description: '三文鱼、鳕鱼、虾等' },
  { id: 'dairy', name: '乳制品', icon: '🥛', description: '酸奶、奶酪等（1岁后）' },
];

// 辅食食谱库
const RECIPE_DATABASE: Record<string, Recipe[]> = {
  grains: [
    {
      id: 'rice-porridge',
      name: '基础米粥',
      minMonth: 4,
      maxMonth: 6,
      ingredients: ['大米 30g', '清水 200ml'],
      steps: ['大米洗净，浸泡30分钟', '加入清水，大火煮开后转小火', '持续搅拌约20分钟至粘稠'],
      nutrition: '碳水化合物，易消化',
      prepTime: '30分钟',
      difficulty: 'easy',
      tips: '初次添加从稀粥开始，逐渐增稠',
    },
    {
      id: 'egg-noodle',
      name: '蛋黄面条',
      minMonth: 7,
      maxMonth: 12,
      ingredients: ['婴儿面条 50g', '鸡蛋黄 1个', '青菜碎 10g'],
      steps: ['面条煮至软烂', '蛋黄打散炒熟', '混合面条、蛋黄和青菜碎'],
      nutrition: '蛋白质、维生素',
      prepTime: '15分钟',
      difficulty: 'easy',
    },
    {
      id: 'sweet-potato-mash',
      name: '红薯泥',
      minMonth: 5,
      maxMonth: 8,
      ingredients: ['红薯 100g', '母乳或配方奶 适量'],
      steps: ['红薯去皮切块蒸熟', '压成泥状', '加入少量奶调匀'],
      nutrition: '膳食纤维、β-胡萝卜素',
      prepTime: '25分钟',
      difficulty: 'easy',
    },
  ],
  vegetables: [
    {
      id: 'spinach-puree',
      name: '菠菜泥',
      minMonth: 5,
      maxMonth: 8,
      ingredients: ['新鲜菠菜 50g', '清水 少许'],
      steps: ['菠菜焯水去草酸', '加水打成泥', '过筛去除粗纤维'],
      nutrition: '铁、叶酸、维生素K',
      prepTime: '15分钟',
      difficulty: 'easy',
      tips: '菠菜需焯水，否则影响钙吸收',
    },
    {
      id: 'carrot-puree',
      name: '胡萝卜泥',
      minMonth: 5,
      maxMonth: 8,
      ingredients: ['胡萝卜 80g', '植物油 几滴'],
      steps: ['胡萝卜去皮切块蒸熟', '压成泥后滴入几滴油'],
      nutrition: 'β-胡萝卜素（转化为维生素A）',
      prepTime: '20分钟',
      difficulty: 'easy',
      tips: '加油可促进脂溶性维生素吸收',
    },
    {
      id: 'pumpkin-soup',
      name: '南瓜汤',
      minMonth: 6,
      maxMonth: 12,
      ingredients: ['南瓜 100g', '配方奶 100ml'],
      steps: ['南瓜去皮切块蒸熟', '加奶打成细腻糊状'],
      nutrition: '维生素A、膳食纤维',
      prepTime: '20分钟',
      difficulty: 'easy',
    },
  ],
  fruits: [
    {
      id: 'apple-puree',
      name: '苹果泥',
      minMonth: 5,
      maxMonth: 8,
      ingredients: ['苹果 1个'],
      steps: ['苹果去皮去核切块', '蒸软或直接用研磨碗压成泥'],
      nutrition: '果胶、维生素C',
      prepTime: '10分钟',
      difficulty: 'easy',
    },
    {
      id: 'banana-mash',
      name: '香蕉泥',
      minMonth: 5,
      maxMonth: 8,
      ingredients: ['熟香蕉 1根'],
      steps: ['香蕉去皮切段', '用叉子压成泥即可'],
      nutrition: '钾、维生素B6、能量',
      prepTime: '5分钟',
      difficulty: 'easy',
      tips: '选择带斑点的熟香蕉更甜更易消化',
    },
    {
      id: 'pear-compote',
      name: '雪梨泥',
      minMonth: 6,
      maxMonth: 9,
      ingredients: ['雪梨 1个'],
      steps: ['雪梨去皮去核', '蒸熟后压成泥或打碎'],
      nutrition: '水分、润肺止咳',
      prepTime: '15分钟',
      difficulty: 'easy',
    },
  ],
  meat: [
    {
      id: 'chicken-puree',
      name: '鸡肉泥',
      minMonth: 7,
      maxMonth: 12,
      ingredients: ['鸡胸肉 50g', '清水 少许'],
      steps: ['鸡肉切小块煮熟', '加少许水打成泥', '过筛使质地更细腻'],
      nutrition: '优质蛋白、铁、锌',
      prepTime: '25分钟',
      difficulty: 'medium',
    },
    {
      id: 'beef-paste',
      name: '牛肉松',
      minMonth: 8,
      maxMonth: 24,
      ingredients: ['瘦牛肉 100g'],
      steps: ['牛肉去筋膜切片', '煮熟后撕成细丝', '小火炒至酥脆，用手捏成粉状'],
      nutrition: '血红素铁、蛋白质、B族维生素',
      prepTime: '60分钟',
      difficulty: 'hard',
      tips: '补铁佳品，可拌入米粥食用',
    },
    {
      id: 'egg-custard',
      name: '蒸蛋羹',
      minMonth: 7,
      maxMonth: 36,
      ingredients: ['鸡蛋 1个', '温水 60ml', '盐 极少量'],
      steps: ['蛋液打散加温水搅匀', '过滤掉气泡', '上锅蒸8-10分钟'],
      nutrition: '优质蛋白、卵磷脂',
      prepTime: '15分钟',
      difficulty: 'easy',
      tips: '水蛋比例约1.5:1，口感最佳',
    },
  ],
  seafood: [
    {
      id: 'salmon-mash',
      name: '三文鱼泥',
      minMonth: 7,
      maxMonth: 18,
      ingredients: ['三文鱼 30g'],
      steps: ['三文鱼蒸熟', '压碎检查有无鱼刺', '加少量温水调成泥'],
      nutrition: 'DHA、Omega-3脂肪酸、蛋白质',
      prepTime: '15分钟',
      difficulty: 'easy',
      tips: '富含DHA，有助于大脑发育',
    },
    {
      id: 'cod-puree',
      name: '鳕鱼泥',
      minMonth: 8,
      maxMonth: 18,
      ingredients: ['真鳕鱼 40g'],
      steps: ['鳕鱼去皮去刺', '蒸熟后压成泥', '确认无刺后给宝宝食用'],
      nutrition: '低脂肪高蛋白、维生素D',
      prepTime: '15分钟',
      difficulty: 'medium',
      tips: '务必仔细检查是否有鱼刺',
    },
  ],
  dairy: [
    {
      id: 'yogurt-snack',
      name: '酸奶水果杯',
      minMonth: 12,
      maxMonth: 36,
      ingredients: ['无糖酸奶 100g', '香蕉 半根', '蓝莓 5颗'],
      steps: ['香蕉切片', '将水果放入酸奶中拌匀即可'],
      nutrition: '益生菌、钙、蛋白质',
      prepTime: '5分钟',
      difficulty: 'easy',
      tips: '选择无糖原味酸奶，适合1岁以上宝宝',
    },
  ],
};

// 按月龄推荐辅食
const MONTHLY_RECOMMENDATIONS = [
  { months: [4, 5], title: '初期辅食（4-6个月）', desc: '单一食材泥糊状', foods: ['米粉', '蔬菜泥', '水果泥'] },
  { months: [6, 7], title: '中期辅食（6-8个月）', desc: '多种食材混合，略稠', foods: ['烂粥', '蛋黄', '肉泥', '鱼泥'] },
  { months: [8, 9, 10, 11], title: '后期辅食（8-12个月）', desc: '颗粒状食物', foods: ['软饭', '小馄饨', '豆腐', '碎菜'] },
  { months: [12, 13, 14, 15, 16, 17], title: '幼儿餐（1-1.5岁）', desc: '接近成人饮食', foods: ['米饭', '炒菜', '面食', '水果块'] },
];

const FoodSystemPage: React.FC = () => {
  const { children, selectedChildId, selectChild } = useChildrenStore();
  
  const [tabValue, setTabValue] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // 自定义食谱存储
  const [customRecipes, setCustomRecipes] = useState<Array<{
    id: string;
    name: string;
    month: number;
    ingredients: string;
    steps: string;
    notes: string;
  }>>(() => {
    const stored = localStorage.getItem('customRecipes');
    return stored ? JSON.parse(stored) : [];
  });

  const selectedChild = children.find(c => c.id === selectedChildId);

  const calculateAgeInMonths = (birthDate: string): number => {
    const birth = new Date(birthDate);
    const now = new Date();
    return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  };

  const childAgeMonths = selectedChild ? calculateAgeInMonths(selectedChild.birthDate) : 0;

  // 获取当前月龄推荐的食物
  const currentRecommendation = useMemo(() => {
    if (!childAgeMonths) return null;
    
    let rec = MONTHLY_RECOMMENDATIONS[MONTHLY_RECOMMENDATIONS.length - 1];
    for (const r of MONTHLY_RECOMMENDATIONS) {
      if (r.months.includes(childAgeMonths)) {
        rec = r;
        break;
      }
    }
    return rec;
  }, [childAgeMonths]);

  // 筛选适合当前月龄的食谱
  const filteredRecipes = useMemo(() => {
    if (!selectedCategory) return [];
    
    const recipes = (RECIPE_DATABASE[selectedCategory] || []).filter(recipe => 
      recipe.minMonth <= childAgeMonths && recipe.maxMonth >= childAgeMonths - 3
    );

    if (searchQuery) {
      return recipes.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return recipes;
  }, [selectedCategory, childAgeMonths, searchQuery]);

  const handleOpenRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe as any);
    setOpenDialog(true);
  };

  const handleAddCustomRecipe = () => {
    setSelectedRecipe(null);
    setOpenDialog(true);
  };

  const handleSaveCustomRecipe = () => {
    setSnackbar({ open: true, message: '自定义食谱功能开发中', severity: 'info' });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            辅食系统
          </Typography>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>选择儿童</InputLabel>
            <Select
              value={selectedChild?.id || ''}
              label="选择儿童"
              onChange={(e) => selectChild(e.target.value)}
            >
              {children.map(child => (
                <MenuItem key={child.id} value={child.id}>
                  {child.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {selectedChild ? (
        <>
          {/* 当前推荐 */}
          {currentRecommendation && (
            <Card sx={{ bgcolor: '#1976d222', borderRadius: 3, mb: 3, border: '1px solid #1976d255' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <InfoIcon color="info" />
                  <Typography variant="h6">
                    {currentRecommendation.title} - 推荐：{currentRecommendation.desc}
                  </Typography>
                  <Chip label={`${childAgeMonths}个月`} color="primary" />
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {currentRecommendation.foods.map((food, idx) => (
                    <Chip key={idx} label={food} variant="outlined" />
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* 标签页 */}
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 3 }}>
            <Tab icon={<FoodIcon />} label="辅食分类" iconPosition="start" />
            <Tab icon={<RecipeIcon />} label="食谱大全" iconPosition="start" />
            <Tab label="我的收藏" />
          </Tabs>

          {tabValue === 0 && (
            <Grid container spacing={2}>
              {FOOD_CATEGORIES.map((category) => (
                <Grid item xs={12} sm={6} md={4} key={category.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
                      height: '100%',
                    }}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setTabValue(1);
                    }}
                  >
                    <CardContent>
                      <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Typography variant="h3">{category.icon}</Typography>
                      </Box>
                      <Typography variant="h6" textAlign="center">
                        {category.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                        sx={{ mt: 1 }}
                      >
                        {category.description}
                      </Typography>
                      
                      {(RECIPE_DATABASE[category.id]?.length || 0) > 0 && (
                        <Chip
                          label={` ${(RECIPE_DATABASE[category.id] || []).length} 个食谱`}
                          size="small"
                          color="primary"
                          sx={{ mt: 2, display: 'block', mx: 'auto', width: 'fit-content' }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {tabValue === 1 && (
            <Box>
              <TextField
                placeholder="搜索食谱名称或食材..."
                fullWidth
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  },
                }}
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                {FOOD_CATEGORIES.map((cat) => (
                  <Chip
                    key={cat.id}
                    label={cat.name}
                    icon={<span>{cat.icon}</span>}
                    variant={selectedCategory === cat.id ? 'filled' : 'outlined'}
                    color={selectedCategory === cat.id ? 'primary' : undefined}
                    onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                  />
                ))}
              </Box>

              <Grid container spacing={2}>
                {filteredRecipes.map((recipe) => (
                  <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                    <Card
                      sx={{ cursor: 'pointer', height: '100%', '&:hover': { boxShadow: 4 } }}
                      onClick={() => handleOpenRecipe(recipe)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {recipe.name}
                          </Typography>
                          <Rating value={
                            recipe.difficulty === 'easy' ? 1 :
                            recipe.difficulty === 'medium' ? 2 : 3
                          } readOnly size="small" max={3} />
                        </Box>
                        
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                          适用：{recipe.minMonth}-{recipe.maxMonth > 12 ? `${Math.floor(recipe.maxMonth / 12)}岁` : `${recipe.maxMonth}个月`}
                          {' · '}
                          <TimeIcon sx={{ verticalAlign: 'middle', fontSize: 14 }} /> {recipe.prepTime}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          食材：{recipe.ingredients.join('、')}
                        </Typography>
                        
                        {recipe.tips && (
                          <Chip
                            label="有技巧提示"
                            size="small"
                            color="warning"
                            variant="outlined"
                            sx={{ mt: 1, fontSize: 11 }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}

                {filteredRecipes.length === 0 && (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                      <FoodIcon sx={{ fontSize: 48, opacity: 0.3 }} />
                      <Typography sx={{ mt: 2 }}>
                        {selectedCategory ? `暂无适合${childAgeMonths}个月宝宝的${FOOD_CATEGORIES.find(c => c.id === selectedCategory)?.name}食谱` :
                           '请选择一个分类查看食谱'}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </>
      ) : (
        <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">请先在儿童管理中添加儿童信息</Typography>
        </Card>
      )}

      {/* 食谱详情对话框 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FoodIcon color="primary" />
          {selectedRecipe ? selectedRecipe.name : '新增食谱'}
        </DialogTitle>
        <DialogContent>
          {selectedRecipe ? (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <Chip label={`准备时间：${selectedRecipe.prepTime}`} icon={<TimeIcon />} />
                <Chip label={`难度：${{
                  easy: '简单',
                  medium: '中等',
                  hard: '较难'
                }[selectedRecipe.difficulty]}`} />
                <Chip label={`营养：${selectedRecipe.nutrition}`} color="success" variant="outlined" />
              </Box>

              <Typography variant="h6" gutterBottom>所需食材：</Typography>
              <List dense>
                {selectedRecipe.ingredients.map((ing, idx) => (
                  <ListItem key={idx}><ListItemIcon><span>{idx + 1}</span></ListItemIcon><ListItemText primary={ing} /></ListItem>
                ))}
              </List>

              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>制作步骤：</Typography>
              {selectedRecipe.steps.map((step, idx) => (
                <Accordion key={idx} defaultExpanded={idx === 0}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>第 {idx + 1} 步</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{step}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}

              {selectedRecipe.tips && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">温馨提示</Typography>
                  {selectedRecipe.tips}
                </Alert>
              )}
            </Box>
          ) : (
            <Box sx={{ pt: 2 }}>
              <TextField label="食谱名称" fullWidth sx={{ mb: 2 }} />
              <TextField label="适用月龄" type="number" fullWidth sx={{ mb: 2 }} />
              <TextField label="食材清单" multiline rows={3} fullWidth sx={{ mb: 2 }} />
              <TextField label="制作步骤" multiline rows={4} fullWidth sx={{ mb: 2 }} />
              <TextField label="备注" multiline rows={2} fullWidth />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(!selectedRecipe)}>
            {selectedRecipe ? '关闭' : '取消'}
          </Button>
          {!selectedRecipe && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleSaveCustomRecipe}>
              保存
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FoodSystemPage;
