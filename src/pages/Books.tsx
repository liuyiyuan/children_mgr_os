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
  IconButton,
  Snackbar,
  Alert,
  Chip,
  Tabs,
  Tab,
  TextField,
  Rating,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  MenuBook as BookIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Info as InfoIcon,
  AutoStories as StoriesIcon,
  ColorLens as ArtIcon,
  Science as ScienceIcon,
  MusicNote as MusicIcon,
  EmojiEmotions as FunIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useChildrenStore } from '../stores/childrenStore';
import type { Child } from '../types';

// 图书分类
const BOOK_CATEGORIES = [
  { id: 'picture', name: '绘本故事', icon: <StoriesIcon />, desc: '图画书、故事绘本' },
  { id: 'cognitive', name: '认知启蒙', icon: <ScienceIcon />, desc: '数字、颜色、形状等' },
  { id: 'art', name: '艺术创造', icon: <ArtIcon />, desc: '绘画、手工、音乐' },
  { id: 'fun', name: '趣味互动', icon: <FunIcon />, desc: '翻翻书、立体书' },
];

// 推荐图书数据库
const BOOK_DATABASE = [
  // 0-1岁（启蒙期）
  {
    id: 'black-white',
    title: '黑白卡片系列',
    category: 'cognitive',
    ageRange: [0, 6],
    description: '高对比度黑白图案，刺激新生儿视觉发育',
    author: '多位作者',
    publisher: '各出版社',
    rating: 4.8,
    tags: ['视觉刺激', '启蒙', '黑白卡'],
    benefits: ['促进视力发育', '培养专注力', '亲子互动'],
    coverColor: '#212121',
  },
  {
    id: 'goodnight-moon',
    title: '晚安，月亮',
    category: 'picture',
    ageRange: [0, 12],
    description: '经典睡前绘本，温馨的道晚安仪式',
    author: '玛格丽特·怀兹·布朗',
    publisher: '明天出版社',
    rating: 4.9,
    tags: ['睡前', '经典', '韵律'],
    benefits: ['建立睡眠仪式', '语言启蒙', '安全感'],
    coverColor: '#3f51b5',
  },
  {
    id: 'dear-zoo',
    title: '亲爱的动物园',
    category: 'fun',
    ageRange: [6, 24],
    description: '经典翻翻书，每个笼子打开都是惊喜',
    author: '罗德·坎贝尔',
    publisher: '信谊出版社',
    rating: 4.7,
    tags: ['翻翻书', '动物', '互动'],
    benefits: ['精细动作', '动物认知', '惊喜体验'],
    coverColor: '#ff9800',
  },

  // 1-2岁（探索期）
  {
    id: 'very-hungry-caterpillar',
    title: '好饿的毛毛虫',
    category: 'picture',
    ageRange: [12, 36],
    description: '艾瑞·卡尔经典作品，色彩鲜艳的洞洞书',
    author: '艾瑞·卡尔',
    publisher: '明天出版社',
    rating: 4.9,
    tags: ['经典', '洞洞书', '数数'],
    benefits: ['数字认知', '星期认知', '生命教育'],
    coverColor: '#4caf50',
  },
  {
    id: 'brown-bear',
    title: '棕色的熊，棕色的熊，你在看什么？',
    category: 'picture',
    ageRange: [12, 36],
    description: '节奏明快的动物认知绘本',
    author: '比尔·马丁 / 艾瑞·卡尔',
    publisher: '明天出版社',
    rating: 4.8,
    tags: ['动物', '颜色', '韵律'],
    benefits: ['颜色认知', '动物认知', '语言发展'],
    coverColor: '#795548',
  },
  {
    id: 'where-is-belly',
    title: '肚脐眼在哪里？',
    category: 'cognitive',
    ageRange: [12, 30],
    description: '身体部位认知绘本，有趣又实用',
    author: '凯伦·卡茨',
    publisher: '北京联合出版公司',
    rating: 4.6,
    tags: ['身体认知', '翻翻书'],
    benefits: ['自我认识', '身体意识', '词汇积累'],
    coverColor: '#e91e63',
  },
  {
    id: 'spot-books',
    title: '小波系列（Spot）',
    category: 'fun',
    ageRange: [12, 36],
    description: '小狗小波找东西的经典翻翻书系列',
    author: 'Eric Hill',
    publisher: '中信出版社',
    rating: 4.7,
    tags: ['翻翻书', '小狗', '寻找'],
    benefits: ['观察力', '记忆力', '阅读兴趣'],
    coverColor: '#ff5722',
  },

  // 2-3岁（成长期）
  {
    id: 'guess-how-much',
    title: '猜猜我有多爱你',
    category: 'picture',
    ageRange: [24, 60],
    description: '表达爱的永恒经典，温暖的亲子共读首选',
    author: '山姆·麦克布雷尼',
    publisher: '明天出版社',
    rating: 4.9,
    tags: ['亲情', '爱表达', '经典'],
    benefits: ['情感教育', '爱的表达', '亲子关系'],
    coverColor: '#9c27b0',
  },
  {
    id: 'no-david',
    title: '大卫不可以',
    category: 'picture',
    ageRange: [24, 48],
    description: '调皮捣蛋的大卫，让宝宝又笑又懂规矩',
    author: '大卫·香农',
    publisher: '河北教育出版社',
    rating: 4.7,
    tags: ['行为习惯', '幽默', '规则'],
    benefits: ['行为引导', '情绪管理', '规则意识'],
    coverColor: '#f44336',
  },
  {
    id: 'three-pigs',
    title: '三只小猪',
    category: 'picture',
    ageRange: [24, 60],
    description: '经典童话故事，聪明智慧的教育意义',
    author: '传统童话',
    publisher: '多版本',
    rating: 4.5,
    tags: ['童话', '智慧', '勤劳'],
    benefits: ['品格教育', '逻辑思维', '想象力'],
    coverColor: '#00bcd4',
  },

  // 3-6岁（学龄前）
  {
    id: 'elephant-piggie',
    title: '小猪和小象系列',
    category: 'picture',
    ageRange: [36, 72],
    description: '莫·威廉斯的友情故事，简单却深刻',
    author: '莫·威廉斯',
    publisher: '新星出版社',
    rating: 4.8,
    tags: ['友谊', '情商', '幽默'],
    benefits: ['社交能力', '情商培养', '同理心'],
    coverColor: '#8bc34a',
  },
  {
    id: 'harold-purple-crayon',
    title: '阿罗有支彩色笔',
    category: 'art',
    ageRange: [36, 72],
    description: '用画笔创造世界，激发无限想象',
    author: '克罗格特·约翰逊',
    publisher: '接力出版社',
    rating: 4.6,
    tags: ['想象', '艺术', '创造'],
    benefits: ['创造力', '艺术启蒙', '想象力'],
    coverColor: '#673ab7',
  },
  {
    id: 'my-father-dragon',
    title: '我爸爸/我妈妈',
    category: 'picture',
    ageRange: [36, 72],
    description: '安东尼·布朗的超人爸妈形象，温暖人心',
    author: '安东尼·布朗',
    publisher: '河北教育出版社',
    rating: 4.9,
    tags: ['家庭', '亲情', '自信'],
    benefits: ['家庭观念', '自我认同', '情感表达'],
    coverColor: '#2196f3',
  },
];

// 按月龄分组的推荐
const AGE_GROUP_RECOMMENDATIONS = [
  { label: '0-6个月', range: [0, 6], focus: '黑白卡、触摸书、布书', tip: '以视觉和触觉刺激为主' },
  { label: '6-12个月', range: [6, 12], focus: '硬纸板书、翻翻书、发声书', tip: '选择撕不烂的安全材质' },
  { label: '1-2岁', range: [12, 24], focus: '习惯养成、生活场景、简单故事', tip: '重复句式，朗朗上口' },
  { label: '2-3岁', range: [24, 36], focus: '情感教育、社交主题、想象力', tip: '可开始讨论情节' },
  { label: '3-6岁', range: [36, 72], focus: '科普、长篇故事、品格教育', tip: '培养自主阅读习惯' },
];

interface ReadingRecord {
  bookId: string;
  date: string;
  rating?: number;
  notes?: string;
}

const BooksPage: React.FC = () => {
  const { children, selectedChildId, selectChild } = useChildrenStore();
  
  const [tabValue, setTabValue] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<typeof BOOK_DATABASE[0] | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // 阅读记录
  const [readingRecords, setReadingRecords] = useState<Record<string, ReadingRecord[]>>(() => {
    const stored = localStorage.getItem('readingRecords');
    return stored ? JSON.parse(stored) : {};
  });

  // 收藏
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem('favoriteBooks');
    return stored ? JSON.parse(stored) : [];
  });

  const selectedChild = children.find(c => c.id === selectedChildId);

  const calculateAgeInMonths = (birthDate: string): number => {
    const birth = new Date(birthDate);
    const now = new Date();
    return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  };

  const childAgeMonths = selectedChild ? calculateAgeInMonths(selectedChild.birthDate) : 0;

  // 获取当前年龄段
  const currentAgeGroup = useMemo(() => {
    if (!childAgeMonths) return AGE_GROUP_RECOMMENDATIONS[AGE_GROUP_RECOMMENDATIONS.length - 1];
    
    let group = AGE_GROUP_RECOMMENDATIONS[AGE_GROUP_RECOMMENDATIONS.length - 1];
    for (const g of AGE_GROUP_RECOMMENDATIONS) {
      if (childAgeMonths >= g.range[0] && childAgeMonths <= g.range[1]) {
        group = g;
        break;
      }
    }
    return group;
  }, [childAgeMonths]);

  // 筛选图书
  const filteredBooks = useMemo(() => {
    let books = BOOK_DATABASE.filter(book => {
      const inAgeRange = childAgeMonths >= book.ageRange[0] && childAgeMonths <= book.ageRange[1] + 6;
      
      if (selectedCategory) {
        return inAgeRange && book.category === selectedCategory;
      }
      return inAgeRange;
    });

    if (searchQuery) {
      books = books.filter(b =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tags.some(t => t.includes(searchQuery))
      );
    }

    return books.sort((a, b) => b.rating - a.rating);
  }, [selectedCategory, childAgeMonths, searchQuery]);

  // 按分类统计
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    BOOK_DATABASE.forEach(book => {
      if (childAgeMonths >= book.ageRange[0] && childAgeMonths <= book.ageRange[1] + 6) {
        stats[book.category] = (stats[book.category] || 0) + 1;
      }
    });
    return stats;
  }, [childAgeMonths]);

  const handleOpenBookDetail = (book: typeof BOOK_DATABASE[0]) => {
    setSelectedBook(book);
    setOpenDialog(true);
  };

  const toggleFavorite = (bookId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newFavorites = favorites.includes(bookId)
      ? favorites.filter(id => id !== bookId)
      : [...favorites, bookId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteBooks', JSON.stringify(newFavorites));
    
    setSnackbar({
      open: true,
      message: favorites.includes(bookId) ? '已取消收藏' : '已添加到收藏',
      severity: 'success'
    });
  };

  const handleRecordReading = (book: typeof BOOK_DATABASE[0], rating?: number, notes?: string) => {
    if (!selectedChild) return;

    const record: ReadingRecord = {
      bookId: book.id,
      date: new Date().toISOString(),
      rating,
      notes,
    };

    const newRecords = { ...readingRecords };
    if (!newRecords[selectedChild.id]) {
      newRecords[selectedChild.id] = [];
    }
    newRecords[selectedChild.id] = [...newRecords[selectedChild.id], record];

    setReadingRecords(newRecords);
    localStorage.setItem('readingRecords', JSON.stringify(newRecords));

    setSnackbar({ open: true, message: '阅读记录已保存', severity: 'success' });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            读物推荐
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
          <Chip label={`${currentAgeGroup.label}`} color="primary" />
        </Box>
      </Box>

      {selectedChild ? (
        <>
          {/* 年龄段推荐 */}
          <Card sx={{ bgcolor: '#1976d222', borderRadius: 3, mb: 3, border: '1px solid #1976d255' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <InfoIcon color="info" />
                <Typography variant="body1">
                  <strong>当前阶段：</strong>{currentAgeGroup.label}宝宝
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  · 重点：{currentAgeGroup.focus}
                </Typography>
                <Chip label={currentAgeGroup.tip} size="small" variant="outlined" />
              </Box>
            </CardContent>
          </Card>

          {/* 标签页 */}
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 3 }}>
            <Tab icon={<BookIcon />} label="推荐读物" iconPosition="start" />
            <Tab icon={<StarIcon />} label={`我的收藏 (${favorites.length})`} iconPosition="start" />
            <Tab label="阅读记录" />
          </Tabs>

          {tabValue === 0 && (
            <>
              {/* 分类快捷筛选 */}
              <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                {BOOK_CATEGORIES.map((cat) => (
                  <Chip
                    key={cat.id}
                    label={`${cat.name} (${categoryStats[cat.id] || 0})`}
                    icon={cat.icon}
                    variant={selectedCategory === cat.id ? 'filled' : 'outlined'}
                    color={selectedCategory === cat.id ? 'primary' : undefined}
                    onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                  />
                ))}
                <Chip
                  label="全部"
                  variant={!selectedCategory ? 'filled' : 'outlined'}
                  onClick={() => setSelectedCategory(null)}
                />
              </Box>

              {/* 搜索框 */}
              <TextField
                placeholder="搜索书名、作者或标签..."
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

              {/* 图书列表 */}
              <Grid container spacing={3}>
                {filteredBooks.map((book) => (
                  <Grid item xs={12} sm={6} md={4} key={book.id}>
                    <Card
                      sx={{ 
                        cursor: 'pointer', 
                        height: '100%', 
                        '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
                        transition: 'all 0.2s',
                      }}
                      onClick={() => handleOpenBookDetail(book)}
                    >
                      <CardContent>
                        {/* 封面模拟 */}
                        <Box
                          sx={{
                            height: 150,
                            bgcolor: book.coverColor,
                            borderRadius: 2,
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                          }}
                        >
                          <BookIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.8)' }} />
                          <IconButton
                            size="small"
                            onClick={(e) => toggleFavorite(book.id, e)}
                            sx={{ position: 'absolute', top: 8, right: 8, color: favorites.includes(book.id) ? '#f44336' : 'rgba(255,255,255,0.7)' }}
                          >
                            <FavoriteIcon />
                          </IconButton>
                          <Chip
                            label={`${book.ageRange[1] > 12 ? Math.floor(book.ageRange[1]/12) + '岁' : book.ageRange[1] + '月'}以下`}
                            size="small"
                            sx={{ position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(255,255,255,0.9)' }}
                          />
                        </Box>

                        <Typography variant="subtitle1" fontWeight={600} noWrap>
                          {book.title}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {book.author}
                        </Typography>

                        <Rating value={book.rating} readOnly size="small" precision={0.5} />

                        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {book.tags.slice(0, 3).map((tag, idx) => (
                            <Chip key={idx} label={tag} size="small" variant="outlined" sx={{ fontSize: 10 }} />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}

                {filteredBooks.length === 0 && (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                      <BookIcon sx={{ fontSize: 48, opacity: 0.3 }} />
                      <Typography sx={{ mt: 2 }}>暂无符合条件的图书</Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </>
          )}

          {tabValue === 1 && (
            <Grid container spacing={3}>
              {favorites.map(favId => {
                const book = BOOK_DATABASE.find(b => b.id === favId);
                if (!book) return null;
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={book.id}>
                    <Card
                      sx={{ cursor: 'pointer', height: '100%' }}
                      onClick={() => handleOpenBookDetail(book)}
                    >
                      <CardContent>
                        <Box sx={{ height: 120, bgcolor: book.coverColor, borderRadius: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <BookIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.8)' }} />
                        </Box>
                        <Typography variant="subtitle1">{book.title}</Typography>
                        <Typography variant="body2" color="text.secondary">{book.author}</Typography>
                        <Rating value={book.rating} readOnly size="small" />
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}

              {favorites.length === 0 && (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                    <Typography>暂无收藏</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </>
      ) : (
        <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">请先在儿童管理中添加儿童信息</Typography>
        </Card>
      )}

      {/* 图书详情对话框 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        {selectedBook && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: selectedBook.coverColor, width: 56, height: 56 }}>
                  <BookIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedBook.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{selectedBook.author}</Typography>
                </Box>
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ 
                      height: 250, 
                      bgcolor: selectedBook.coverColor, 
                      borderRadius: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 3,
                    }}>
                      <BookIcon sx={{ fontSize: 80, color: 'white' }} />
                      <Typography variant="h6" sx={{ color: 'white', mt: 2 }}>{selectedBook.publisher}</Typography>
                    </Box>
                    
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around' }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" fontWeight="bold" color="primary">{selectedBook.rating}</Typography>
                        <Typography variant="caption">评分</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" fontWeight="bold">
                          {selectedBook.ageRange[1] > 12 
                            ? `${Math.floor(selectedBook.ageRange[1]/12)}岁`
                            : `${selectedBook.ageRange[1]}个月`}
                        </Typography>
                        <Typography variant="caption">适合年龄</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" gutterBottom>内容简介</Typography>
                    <Typography paragraph>{selectedBook.description}</Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="h6" gutterBottom>阅读价值</Typography>
                    <List dense>
                      {selectedBook.benefits.map((benefit, idx) => (
                        <ListItem key={idx}>
                          <ListItemIcon><StarIcon color="primary" fontSize="small" /></ListItemIcon>
                          <ListItemText primary={benefit} />
                        </ListItem>
                      ))}
                    </List>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle2">标签：</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {selectedBook.tags.map((tag, idx) => (
                        <Chip key={idx} label={tag} size="small" />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            
            <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
              <Button
                startIcon={<FavoriteIcon />}
                color={favorites.includes(selectedBook.id) ? 'error' : 'inherit'}
                onClick={() => toggleFavorite(selectedBook.id, {} as React.MouseEvent)}
              >
                {favorites.includes(selectedBook.id) ? '已收藏' : '收藏'}
              </Button>
              
              <Box>
                <Button onClick={() => setOpenDialog(false)}>关闭</Button>
                <Button
                  variant="contained"
                  startIcon={<ShareIcon />}
                  onClick={() => {
                    handleRecordReading(selectedBook);
                    setSnackbar({ open: true, message: '已标记为已读', severity: 'success' });
                  }}
                >
                  标记已读
                </Button>
              </Box>
            </DialogActions>
          </>
        )}
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

export default BooksPage;
