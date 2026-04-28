import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  LinearProgress,
  Divider,
  useTheme,
} from '@mui/material';
import {
  ChildCare as ChildIcon,
  TrendingUp as GrowthIcon,
  Vaccines as VaccineIcon,
  Restaurant as FoodIcon,
  MenuBook as BookIcon,
  ArrowForward as ArrowIcon,
  Height as HeightIcon,
  MonitorWeight as WeightIcon,
  CalendarMonth as CalendarIcon,
  CheckCircle as DoneIcon,
  Warning as AlertIcon,
  Speed as SpeedIcon,
  Favorite as HeartIcon,
  AutoStories as StoryIcon,
  LocalDining as MealIcon,
  FavoriteBorder as HeartBorderIcon,
  EmojiEvents as TrophyIcon,
  Cake as CakeIcon,
  WbSunny as SunnyIcon,
  Star as StarIcon,
  Pets as PetsIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../stores/authStore';
import { useChildrenStore } from '../stores/childrenStore';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';

// ==================== 模拟数据 ====================

const MOCK_GROWTH_DATA = [
  { month: '出生', height: 50, weight: 3.3, standardH: 50, standardW: 3.3 },
  { month: '1月', height: 54.7, weight: 4.6, standardH: 54.7, standardW: 4.5 },
  { month: '2月', height: 58.4, weight: 5.7, standardH: 58.4, standardW: 5.6 },
  { month: '3月', height: 61.4, weight: 6.4, standardH: 61.4, standardW: 6.3 },
  { month: '4月', height: 63.9, weight: 7.0, standardH: 63.9, standardW: 6.9 },
  { month: '5月', height: 65.9, weight: 7.4, standardH: 65.9, standardW: 7.3 },
  { month: '6月', height: 67.6, weight: 7.8, standardH: 67.6, standardW: 7.8 },
  { month: '8月', height: 70.6, weight: 8.5, standardH: 70.6, standardW: 8.4 },
  { month: '10月', height: 73.3, weight: 9.2, standardH: 73.3, standardW: 9.1 },
  { month: '12月', height: 75.7, weight: 9.8, standardH: 75.7, standardW: 9.6 },
];

const MOCK_VACCINE_PROGRESS = [
  { name: '已完成', value: 12, color: '#34D399' },
  { name: '待接种', value: 4, color: '#FCD34D' },
  { name: '逾期', value: 0, color: '#F87171' },
  { name: '未来计划', value: 8, color: '#A5B4FC' },
];

const MOCK_NUTRITION_RADAR = [
  { subject: '蛋白质', A: 85, fullMark: 100 },
  { subject: '钙质', A: 72, fullMark: 100 },
  { subject: '铁', A: 68, fullMark: 100 },
  { subject: '维生素A', A: 90, fullMark: 100 },
  { subject: '维生素C', A: 78, fullMark: 100 },
  { subject: '膳食纤维', A: 60, fullMark: 100 },
];

const MOCK_FOOD_CATEGORIES = [
  { name: '谷薯类', count: 3, color: '#FDE68A' },
  { name: '蔬菜类', count: 3, color: '#6EE7B7' },
  { name: '水果类', count: 3, color: '#FCA5A5' },
  { name: '肉蛋类', count: 3, color: '#FDBA74' },
  { name: '水产类', count: 2, color: '#93C5FD' },
];

const MOCK_WEEKLY_ACTIVITY = [
  { day: '周一', meals: 3, reading: 15 },
  { day: '周二', meals: 4, reading: 20 },
  { day: '周三', meals: 3, reading: 10 },
  { day: '周四', meals: 5, reading: 25 },
  { day: '周五', meals: 4, reading: 18 },
  { day: '周六', meals: 4, reading: 30 },
  { day: '周日', meals: 3, reading: 22 },
];

const MOCK_UPCOMING_VACCINES = [
  { name: '麻腮风疫苗(第1针)', dueDate: '2026-05-10', status: 'urgent' as const },
  { name: '乙脑减毒活疫苗(第1针)', dueDate: '2026-05-25', status: 'upcoming' as const },
  { name: 'A群流脑疫苗(第2针)', dueDate: '2026-06-08', status: 'upcoming' as const },
];

const MOCK_TODAY_RECOMMENDATIONS = [
  { category: '早餐', name: '蛋黄南瓜粥', time: '07:30', nutrition: '碳水+蛋白质+维生素A', emoji: '🥣' },
  { category: '午餐', name: '三文鱼蔬菜泥', time: '11:30', nutrition: 'DHA+优质蛋白+纤维', emoji: '🐟' },
  { category: '加餐', name: '苹果香蕉泥', time: '15:00', nutrition: '果胶+维生素+钾', emoji: '🍎' },
  { category: '晚餐', name: '胡萝卜鸡肉泥', time: '18:00', nutrition: 'β胡萝卜素+蛋白质+铁', emoji: '🥕' },
];

// ==================== 卡通笑脸 SVG ====================

function CartoonDecoration({ top, left, right, bottom, size, emoji, opacity = 0.15 }: { top?: number; left?: number; right?: number; bottom?: number; size: number; emoji: string; opacity?: number }) {
  return (
    <Typography
      sx={{
        position: 'absolute',
        top, left, right, bottom,
        fontSize: size,
        opacity,
        pointerEvents: 'none',
        userSelect: 'none',
        animation: 'floaty 4s ease-in-out infinite',
      }}
    >
      {emoji}
    </Typography>
  );
}

// ==================== 统计卡片 ====================

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  emoji: string;
  bgColor: string;
  borderColor: string;
  onClick?: () => void;
}

function StatCard({ title, value, subtitle, emoji, bgColor, borderColor, onClick }: StatCardProps) {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: '24px',
        border: `3px solid ${borderColor}`,
        background: bgColor,
        transition: 'all 0.35s cubic-bezier(.4,2,.6,1)',
        '&:hover': onClick
          ? { transform: 'translateY(-8px) scale(1.03)', boxShadow: `0 20px 50px ${borderColor}40` }
          : {},
        position: 'relative',
        overflow: 'hidden',
        minHeight: 130,
      }}
    >
      {/* 装饰圆圈 */}
      <Box sx={{
        position: 'absolute', top: -18, right: -18,
        width: 70, height: 70, borderRadius: '50%',
        bgcolor: 'rgba(255,255,255,0.25)',
      }} />
      <CardContent sx={{ p: 2.5, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography sx={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', fontWeight: 700, letterSpacing: 0.5 }}>
              {title}
            </Typography>
            <Typography sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 900, color: '#1a1a2e', lineHeight: 1.1, mt: 0.5 }}>
              {value}
            </Typography>
            <Typography sx={{ fontSize: 12, color: borderColor, fontWeight: 700, mt: 0.5 }}>
              {subtitle}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 52, height: 52, borderRadius: '50%',
              background: `rgba(255,255,255,0.7)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28,
              boxShadow: `0 4px 16px ${borderColor}30`,
            }}
          >
            {emoji}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

// ==================== 主组件 ====================

export default function Dashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { children, selectedChildId, selectChild } = useChildrenStore();

  const selectedChild = children.find((c) => c.id === selectedChildId) || children[0];
  const hasChildren = children.length > 0;

  const childAge = useMemo(() => {
    if (!selectedChild) return null;
    const birth = new Date(selectedChild.birthDate);
    const now = new Date();
    const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    return months;
  }, [selectedChild]);

  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  });

  return (
    <Box sx={{ pb: 4, position: 'relative', overflow: 'hidden' }}>

      {/* 🎈 浮动卡通装饰 */}
      <CartoonDecoration top={20} left={10} size={40} emoji="🌈" opacity={0.08} />
      <CartoonDecoration top={80} right={30} size={32} emoji="⭐" opacity={0.10} />
      <CartoonDecoration top={300} left={5} size={28} emoji="🦋" opacity={0.09} />
      <CartoonDecoration top={500} right={10} size={36} emoji="🌸" opacity={0.08} />
      <CartoonDecoration bottom={100} left={40} size={24} emoji="💫" opacity={0.11} />

      {/* ====== 顶部欢迎区 ====== */}
      <Box
        sx={{
          mb: 4,
          p: { xs: 2.5, md: 3.5 },
          borderRadius: '28px',
          background: 'linear-gradient(135deg, #FDE68A22 0%, #A7F3D022 30%, #BFDBFE22 60%, #DDD6FE22 100%)',
          border: '2.5px solid #FDE68A55',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 装饰 */}
        <Typography sx={{ position: 'absolute', top: -5, right: 20, fontSize: 48, opacity: 0.12 }}>🎠</Typography>
        <Typography sx={{ position: 'absolute', bottom: -8, left: 30, fontSize: 32, opacity: 0.10 }}>🪁</Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, position: 'relative', zIndex: 1 }}>
          <Box>
            <Typography sx={{ fontSize: { xs: 22, md: 28 }, fontWeight: 900, color: '#1a1a2e', letterSpacing: -0.5 }}>
              👋 你好呀，{user?.displayName || user?.username}！
            </Typography>
            <Typography sx={{ color: '#6B7280', mt: 0.5, fontSize: 14, fontWeight: 500 }}>
              📅 {today} &nbsp;|&nbsp; 🌤️ 今天也是元气满满的一天！
            </Typography>
          </Box>
          <Chip
            label={hasChildren ? `👶 ${selectedChild?.name} · ${childAge ? (childAge > 12 ? `${Math.floor(childAge / 12)}岁${childAge % 12 > 0 ? childAge % 12 + '个月' : ''}` : childAge + '个月') : ''}` : '🍼 暂无宝宝档案'}
            sx={{
              px: 1.5, py: 2.5, fontSize: 14, fontWeight: 700,
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #FDE68A, #FCD34D)',
              color: '#92400E',
              boxShadow: '0 4px 16px rgba(253,230,138,0.4)',
              '& .MuiChip-label': { px: 1.5 },
            }}
          />
        </Box>
      </Box>

      {/* ====== 核心统计卡片 ====== */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={6} md={2.4}>
          <StatCard title="👶 宝宝档案" value={children.length} subtitle="✨ 已激活" emoji="🧸" bgColor="linear-gradient(135deg, #FDE68A33, #FCD34D22)" borderColor="#F59E0B" onClick={() => navigate('/children')} />
        </Grid>
        <Grid item xs={6} sm={6} md={2.4}>
          <StatCard title="📈 成长记录" value="12" subtitle="📝 本月新增 3 条" emoji="📊" bgColor="linear-gradient(135deg, #6EE7B733, #34D39922)" borderColor="#10B981" onClick={() => navigate('/growth')} />
        </Grid>
        <Grid item xs={6} sm={6} md={2.4}>
          <StatCard title="💉 疫苗接种" value="75%" subtitle="✅ 完成 12/24 针" emoji="💉" bgColor="linear-gradient(135deg, #FCD34D33, #FBBF2433)" borderColor="#F59E0B" onClick={() => navigate('/vaccine')} />
        </Grid>
        <Grid item xs={6} sm={6} md={2.4}>
          <StatCard title="🍎 辅食食谱" value="18" subtitle="🌟 适合当前月龄" emoji="🥑" bgColor="linear-gradient(135deg, #C4B5FD33, #A78BFA22)" borderColor="#8B5CF6" onClick={() => navigate('/food')} />
        </Grid>
        <Grid item xs={12} sm={12} md={2.4}>
          <StatCard title="📚 读物推荐" value="24" subtitle="❤️ 已收藏 5 本" emoji="📖" bgColor="linear-gradient(135deg, #F9A8D433, #F472B622)" borderColor="#EC4899" onClick={() => navigate('/books')} />
        </Grid>
      </Grid>

      {/* ====== 主要内容区域 ====== */}
      <Grid container spacing={2.5}>
        {/* ---- 成长曲线图 ---- */}
        <Grid item xs={12} lg={8}>
          <Card sx={{
            borderRadius: '28px',
            border: '2.5px solid #BFDBFE55',
            background: 'linear-gradient(180deg, #EFF6FF 0%, #F0FDFA 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* 装饰 */}
            <Typography sx={{ position: 'absolute', top: 10, right: 20, fontSize: 36, opacity: 0.07 }}>📈</Typography>
            <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ fontSize: 26 }}>📏</Box>
                  <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#1e40af' }}>身高体重成长曲线</Typography>
                  <Chip label="📐 vs WHO标准" size="small" sx={{ borderRadius: '999px', bgcolor: '#dbeafe', color: '#1e40af', fontWeight: 600, fontSize: 11 }} />
                </Box>
                <Button size="small" endIcon={<ArrowIcon />} onClick={() => navigate('/growth')} sx={{ color: '#3b82f6', fontWeight: 700, borderRadius: '999px' }}>
                  查看详情
                </Button>
              </Box>

              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={MOCK_GROWTH_DATA}>
                  <defs>
                    <linearGradient id="gradHeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gradWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34D399" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#34D399" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#BFDBFE" vertical={false} />
                  <XAxis dataKey="month" stroke="#60A5FA" tick={{ fontSize: 12, fontWeight: 600 }} />
                  <YAxis yAxisId="left" stroke="#60A5FA" tick={{ fontSize: 11 }} domain={[45, 80]} label={{ value: 'cm ↑', position: 'insideTopLeft', fill: '#3b82f6', fontSize: 12, fontWeight: 700 }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#34D399" tick={{ fontSize: 11 }} domain={[0, 12]} label={{ value: 'kg →', position: 'insideTopRight', fill: '#059669', fontSize: 12, fontWeight: 700 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '2px solid #BFDBFE',
                      borderRadius: 16,
                      boxShadow: '0 8px 32px rgba(96,165,250,0.15)',
                    }}
                    labelStyle={{ color: '#1e40af', fontWeight: 700 }}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="height" stroke="#3b82f6" strokeWidth={3} fill="url(#gradHeight)" name="身高(cm)" dot={{ r: 5, fill: '#3b82f6', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} />
                  <Area yAxisId="right" type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} fill="url(#gradWeight)" name="体重(kg)" dot={{ r: 5, fill: '#10b981', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="standardH" stroke="#94a3b8" strokeDasharray="8 4" dot={false} yAxisId="left" name="WHO身高标准" strokeWidth={2} />
                  <Line type="monotone" dataKey="standardW" stroke="#a5b4fc" strokeDasharray="8 4" dot={false} yAxisId="right" name="WHO体重标准" strokeWidth={2} />
                  <Legend wrapperStyle={{ paddingTop: 16 }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* ---- 右侧栏：疫苗+营养+辅食分类 ---- */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* 疫苗进度环形图 */}
            <Card sx={{ borderRadius: '28px', border: '2.5px solid #FDE68A55', background: 'linear-gradient(180deg, #FFFBEB 0%, #FEF3C7 100%)' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Box sx={{ fontSize: 22 }}>💉</Box>
                  <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#92400E' }}>疫苗接种进度</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <ResponsiveContainer width={120} height={120}>
                    <PieChart>
                      <Pie
                        data={MOCK_VACCINE_PROGRESS}
                        cx="50%"
                        cy="50%"
                        innerRadius={36}
                        outerRadius={54}
                        paddingAngle={4}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {MOCK_VACCINE_PROGRESS.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <text x="50%" y="50%" dy={8} textAnchor="middle" fill="#92400E" style={{ fontSize: 24, fontWeight: 900 }}>
                        75%
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ flex: 1 }}>
                    {MOCK_VACCINE_PROGRESS.map((item) => (
                      <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color, boxShadow: `0 2px 8px ${item.color}40` }} />
                        <Typography sx={{ flex: 1, color: '#78716c', fontSize: 13, fontWeight: 600 }}>{item.name}</Typography>
                        <Typography sx={{ color: '#1c1917', fontWeight: 800, fontSize: 13 }}>{item.value}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* 即将接种提醒 */}
            <Card sx={{ borderRadius: '28px', border: '2.5px solid #FECACA55', background: 'linear-gradient(180deg, #FFF1F2 0%, #FFE4E6 100%)' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Box sx={{ fontSize: 22 }}>⏰</Box>
                  <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#be123c' }}>近期接种提醒</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {MOCK_UPCOMING_VACCINES.map((v, i) => (
                    <Box key={i} sx={{
                      display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: '16px',
                      bgcolor: v.status === 'urgent' ? 'rgba(239,68,68,0.08)' : 'rgba(251,191,36,0.1)',
                      border: `2px solid ${v.status === 'urgent' ? '#FCA5A5' : '#FDE68A'}`,
                      transition: 'all 0.2s',
                      '&:hover': { transform: 'scale(1.02)' },
                    }}>
                      <CalendarIcon fontSize="small" sx={{ color: v.status === 'urgent' ? '#EF4444' : '#F59E0B' }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ color: '#1c1917', fontWeight: 600, fontSize: 13 }}>{v.name}</Typography>
                        <Typography sx={{ color: '#a8a29e', fontSize: 11, fontWeight: 500 }}>📅 {v.dueDate}</Typography>
                      </Box>
                      {v.status === 'urgent' && (
                        <Chip label="⚠️ 即将到期" size="small" sx={{ borderRadius: '999px', bgcolor: '#FEE2E2', color: '#DC2626', fontWeight: 700, fontSize: 10, height: 22 }} />
                      )}
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* ---- 今日辅食推荐 ---- */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: '28px', border: '2.5px solid #C4B5FD55', background: 'linear-gradient(180deg, #F5F3FF 0%, #EDE9FE 100%)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box sx={{ fontSize: 22 }}>🍽️</Box>
                <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#5b21b6' }}>今日辅食推荐</Typography>
                <Chip label={`🍼 ${childAge || 8}个月龄方案`} size="small" sx={{ borderRadius: '999px', bgcolor: '#c4b5fd', color: '#5b21b6', fontWeight: 700, fontSize: 11, height: 24 }} />
              </Box>

              <Grid container spacing={1.5}>
                {MOCK_TODAY_RECOMMENDATIONS.map((meal, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Box sx={{
                      p: 2, borderRadius: '20px',
                      background: 'linear-gradient(135deg, rgba(167,139,250,0.08), rgba(236,72,153,0.06))',
                      border: '2px solid rgba(167,139,250,0.18)',
                      transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
                      '&:hover': { transform: 'translateY(-4px) scale(1.02)', boxShadow: '0 12px 32px rgba(167,139,250,0.15)' },
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Box sx={{ fontSize: 22 }}>{meal.emoji}</Box>
                        <Typography sx={{ color: '#1e1b4b', fontWeight: 700, fontSize: 14 }}>{meal.name}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip label={meal.category} size="small" sx={{ borderRadius: '999px', bgcolor: '#a78bfa22', color: '#7c3aed', fontWeight: 600, fontSize: 10, height: 22 }} />
                        <Typography sx={{ color: '#8b5cf6', fontWeight: 600, fontSize: 12 }}>🕐 {meal.time}</Typography>
                      </Box>
                      <Typography sx={{ color: '#a78bfa', mt: 0.5, display: 'block', fontSize: 12, fontWeight: 500 }}>
                        {meal.nutrition}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* ---- 营养摄入雷达图 + 辅食分布 ---- */}
        <Grid item xs={12} lg={6}>
          <Grid container spacing={2.5}>
            {/* 营养摄入雷达图 */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: '28px', border: '2.5px solid #6EE7B755', background: 'linear-gradient(180deg, #ECFDF5 0%, #D1FAE5 100%)' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box sx={{ fontSize: 22 }}>🔬</Box>
                    <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#065f46' }}>营养摄入分析</Typography>
                  </Box>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={MOCK_NUTRITION_RADAR}>
                      <PolarGrid stroke="#A7F3D0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#059669', fontSize: 12, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#6ee7b7', fontSize: 10 }} />
                      <Radar name="营养达标率" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.25} strokeWidth={2.5} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* 辅食类别柱状图 */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: '28px', border: '2.5px solid #93C5FD55', background: 'linear-gradient(180deg, #EFF6FF 0%, #DBEAFE 100%)' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box sx={{ fontSize: 22 }}>🗂️</Box>
                    <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#1e40af' }}>辅食食谱分布</Typography>
                  </Box>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={MOCK_FOOD_CATEGORIES} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#BFDBFE" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="#60a5fa" tick={{ fontSize: 12, fontWeight: 600 }} width={64} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #BFDBFE', borderRadius: 14, color: '#1e40af' }} />
                      <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={22}>
                        {MOCK_FOOD_CATEGORIES.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* ---- 本周活动统计 + 快捷入口 ---- */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: '28px', border: '2.5px solid #F9A8D455', background: 'linear-gradient(180deg, #FFF1F2 0%, #FFE4E6 100%)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box sx={{ fontSize: 22 }}>📅</Box>
                <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#9D174D' }}>本周亲子活动</Typography>
              </Box>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={MOCK_WEEKLY_ACTIVITY} barGap={10}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#FBCFE8" vertical={false} />
                  <XAxis dataKey="day" stroke="#f472b6" tick={{ fontSize: 12, fontWeight: 600 }} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #FBCFE8', borderRadius: 14, color: '#9D174D' }} />
                  <Legend iconType="circle" wrapperStyle={{ paddingBottom: 8 }} />
                  <Bar dataKey="meals" name="🍽️ 辅食次数" fill="#FCD34D" radius={[8, 8, 0, 0]} barSize={20} />
                  <Bar dataKey="reading" name="📚 阅读时长(分)" fill="#F472B6" radius={[8, 8, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* ---- 宝宝信息卡 + 快速操作 ---- */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: '28px', border: '2.5px solid #FDE68A55', minHeight: 280, background: 'linear-gradient(180deg, #FFFBEB 0%, #FEF3C7 100%)' }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box sx={{ fontSize: 22 }}>💝</Box>
                <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#92400E' }}>宝宝信息卡</Typography>
              </Box>

              {hasChildren && selectedChild ? (
                <>
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Box
                      sx={{
                        width: 90, height: 90, mx: 'auto', mb: 1.5,
                        borderRadius: '50%',
                        background: selectedChild.gender === 'male'
                          ? 'linear-gradient(135deg, #93C5FD, #3B82F6)'
                          : 'linear-gradient(135deg, #FCA5A5, #EC4899)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 44,
                        border: '4px solid #FDE68A',
                        boxShadow: '0 8px 32px rgba(253,230,138,0.4), inset 0 0 0 3px rgba(255,255,255,0.3)',
                        animation: 'bounce 2s ease-in-out infinite',
                      }}
                    >
                      {selectedChild.gender === 'male' ? '👦' : '👧'}
                    </Box>
                    <Typography sx={{ fontSize: 22, fontWeight: 900, color: '#1c1917' }}>{selectedChild.name}</Typography>
                    <Chip
                      label={childAge ? (childAge > 12 ? `🎂 ${Math.floor(childAge / 12)}岁${childAge % 12 > 0 ? childAge % 12 + '个月' : ''}` : `🍼 ${childAge}个月`) : ''}
                      sx={{
                        mt: 0.5, borderRadius: '999px',
                        background: 'linear-gradient(135deg, #FDE68A, #FCD34D)',
                        color: '#92400E', fontWeight: 700, fontSize: 12, height: 26,
                      }}
                    />
                  </Box>

                  <Divider sx={{ borderColor: '#FDE68A88', my: 1 }} />

                  <Grid container spacing={1.5} sx={{ flex: 1 }}>
                    {[
                      { label: '📏 最近身高', value: '72 cm', color: '#3b82f6' },
                      { label: '⚖️ 最近体重', value: '9.2 kg', color: '#10b981' },
                      { label: '💉 疫苗完成', value: '75%', color: '#f59e0b' },
                      { label: '📚 阅读天数', value: '18 天', color: '#ec4899' },
                    ].map((item) => (
                      <Grid item xs={6} key={item.label}>
                        <Box sx={{
                          p: 1.5, borderRadius: '16px',
                          background: `${item.color}10`,
                          border: `2px solid ${item.color}30`,
                          textAlign: 'center',
                          transition: 'all 0.2s',
                          '&:hover': { transform: 'scale(1.05)' },
                        }}>
                          <Typography sx={{ fontSize: 11, color: '#78716c', fontWeight: 600 }}>{item.label}</Typography>
                          <Typography sx={{ fontSize: 18, fontWeight: 900, color: item.color, mt: 0.3 }}>{item.value}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ fontSize: 56, opacity: 0.3 }}>🧸</Box>
                  <Typography sx={{ color: '#a8a29e', fontWeight: 600 }}>还没有宝宝档案哦</Typography>
                  <Button
                    variant="contained"
                    startIcon={<ChildIcon />}
                    onClick={() => navigate('/children')}
                    sx={{
                      borderRadius: '999px',
                      background: 'linear-gradient(135deg, #FDE68A, #FCD34D)',
                      color: '#92400E',
                      fontWeight: 700,
                      boxShadow: '0 4px 16px rgba(253,230,138,0.4)',
                      '&:hover': { background: 'linear-gradient(135deg, #FCD34D, #FBBF24)' },
                    }}
                  >
                    添加宝宝档案
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 全局动画 keyframes */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes floaty {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-8px) rotate(3deg); }
          66% { transform: translateY(4px) rotate(-2deg); }
        }
      `}</style>
    </Box>
  );
}
