import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  LinearProgress,
  Divider,
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
  { name: '已完成', value: 12, color: '#10B981' },
  { name: '待接种', value: 4, color: '#F59E0B' },
  { name: '逾期', value: 0, color: '#EF4444' },
  { name: '未来计划', value: 8, color: '#6B7280' },
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
  { name: '谷薯类', count: 3, color: '#FBBF24' },
  { name: '蔬菜类', count: 3, color: '#34D399' },
  { name: '水果类', count: 3, color: '#F87171' },
  { name: '肉蛋类', count: 3, color: '#FB923C' },
  { name: '水产类', count: 2, color: '#60A5FA' },
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
  {
    category: '早餐',
    name: '蛋黄南瓜粥',
    time: '07:30',
    nutrition: '碳水+蛋白质+维生素A',
    icon: <MealIcon fontSize="small" />,
  },
  {
    category: '午餐',
    name: '三文鱼蔬菜泥',
    time: '11:30',
    nutrition: 'DHA+优质蛋白+纤维',
    icon: <MealIcon fontSize="small" />,
  },
  {
    category: '加餐',
    name: '苹果香蕉泥',
    time: '15:00',
    nutrition: '果胶+维生素+钾',
    icon: <MealIcon fontSize="small" />,
  },
  {
    category: '晚餐',
    name: '胡萝卜鸡肉泥',
    time: '18:00',
    nutrition: 'β胡萝卜素+蛋白质+铁',
    icon: <MealIcon fontSize="small" />,
  },
];

// ==================== 组件 ====================

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

function StatCard({ title, value, subtitle, icon, color, onClick }: StatCardProps) {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        '&:hover': onClick
          ? { transform: 'translateY(-4px)', boxShadow: `0 12px 40px ${color}25` }
          : {},
        background: `linear-gradient(135deg, ${color}10 0%, transparent 60%)`,
        borderLeft: `4px solid ${color}`,
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800, lineHeight: 1.2, mt: 0.5 }}>
              {value}
            </Typography>
            <Typography variant="body2" sx={{ color: color, fontWeight: 500, mt: 0.5 }}>
              {subtitle}
            </Typography>
          </Box>
          <Avatar
            sx={{
              bgcolor: `${color}20`,
              color: color,
              width: 52,
              height: 52,
              boxShadow: `0 4px 20px ${color}30`,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { children, selectedChildId, selectChild } = useChildrenStore();

  const selectedChild = children.find((c) => c.id === selectedChildId) || children[0];
  const hasChildren = children.length > 0;

  // 计算年龄
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
    <Box sx={{ pb: 4 }}>
      {/* ====== 顶部欢迎区 ====== */}
      <Box
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(0,212,255,0.12) 0%, rgba(139,92,246,0.08) 50%, rgba(16,185,129,0.06) 100%)',
          border: '1px solid rgba(0,212,255,0.15)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, letterSpacing: -0.5 }}>
              👋 欢迎回来，{user?.displayName || user?.username}
            </Typography>
            <Typography variant="body1" sx={{ color: '#9CA3AF', mt: 0.5 }}>
              {today}
            </Typography>
          </Box>
          <Chip
            label={hasChildren ? `${selectedChild?.name} · ${childAge ? (childAge > 12 ? Math.floor(childAge / 12) + '岁' : childAge + '个月') : ''}` : '暂无儿童档案'}
            avatar={<ChildIcon />}
            color="primary"
            sx={{ px: 1, py: 2.5, fontSize: 14, fontWeight: 600 }}
          />
        </Box>
      </Box>

      {/* ====== 核心统计卡片 ====== */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={6} md={2.4}>
          <StatCard
            title="儿童档案"
            value={children.length}
            subtitle={`${hasChildren ? '已激活' : '请添加'}`}
            icon={<ChildIcon />}
            color="#00D4FF"
            onClick={() => navigate('/children')}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={2.4}>
          <StatCard
            title="成长记录"
            value="12"
            subtitle="本月新增 3 条"
            icon={<GrowthIcon />}
            color="#10B981"
            onClick={() => navigate('/growth')}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={2.4}>
          <StatCard
            title="疫苗接种"
            value="75%"
            subtitle="完成 12/24 针"
            icon={<VaccineIcon />}
            color="#F59E0B"
            onClick={() => navigate('/vaccine')}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={2.4}>
          <StatCard
            title="辅食食谱"
            value="18"
            subtitle="适合当前月龄"
            icon={<FoodIcon />}
            color="#8B5CF6"
            onClick={() => navigate('/food')}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={2.4}>
          <StatCard
            title="读物推荐"
            value="24"
            subtitle="已收藏 5 本"
            icon={<BookIcon />}
            color="#EC4899"
            onClick={() => navigate('/books')}
          />
        </Grid>
      </Grid>

      {/* ====== 主要内容区域 ====== */}
      <Grid container spacing={2.5}>
        {/* ---- 成长曲线图 ---- */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 3, border: '1px solid rgba(0,212,255,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <HeightIcon sx={{ color: '#00D4FF' }} />
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>身高体重成长曲线</Typography>
                  <Chip label="vs WHO标准" size="small" variant="outlined" color="primary" />
                </Box>
                <Button size="small" endIcon={<ArrowIcon />} onClick={() => navigate('/growth')} sx={{ color: '#00D4FF' }}>
                  详细记录
                </Button>
              </Box>

              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={MOCK_GROWTH_DATA}>
                  <defs>
                    <linearGradient id="gradHeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#00D4FF" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gradWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="month" stroke="#555" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" stroke="#00D4FF" tick={{ fontSize: 11 }} domain={[45, 80]} label={{ value: 'cm', position: 'insideTopLeft', fill: '#00D4FF', fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#10B981" tick={{ fontSize: 11 }} domain={[0, 12]} label={{ value: 'kg', position: 'insideTopRight', fill: '#10B981', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a2e',
                      border: '1px solid #333',
                      borderRadius: 10,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    }}
                    labelStyle={{ color: '#fff', fontWeight: 600 }}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="height" stroke="#00D4FF" strokeWidth={2.5} fill="url(#gradHeight)" name="身高(cm)" dot={{ r: 4, fill: '#00D4FF', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  <Area yAxisId="right" type="monotone" dataKey="weight" stroke="#10B981" strokeWidth={2.5} fill="url(#gradWeight)" name="体重(kg)" dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="standardH" stroke="#555" strokeDasharray="6 4" dot={false} yAxisId="left" name="WHO身高标准" />
                  <Line type="monotone" dataKey="standardW" stroke="#666" strokeDasharray="6 4" dot={false} yAxisId="right" name="WHO体重标准" />
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
            <Card sx={{ borderRadius: 3, border: '1px solid rgba(245,158,11,0.15)' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <VaccineIcon sx={{ color: '#F59E0B' }} />
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>疫苗接种进度</Typography>
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
                      <text x="50%" y="50%" dy={8} textAnchor="middle" fill="#fff" style={{ fontSize: 24, fontWeight: 800 }}>
                        75%
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ flex: 1 }}>
                    {MOCK_VACCINE_PROGRESS.map((item) => (
                      <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
                        <Typography variant="body2" sx={{ flex: 1, color: '#ccc', fontSize: 13 }}>{item.name}</Typography>
                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>{item.value}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* 即将接种提醒 */}
            <Card sx={{ borderRadius: 3, border: '1px solid rgba(239,68,68,0.1)' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <AlertIcon sx={{ color: '#EF4444' }} />
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>近期接种</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {MOCK_UPCOMING_VACCINES.map((v, i) => (
                    <Box key={i} sx={{ 
                      display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, 
                      bgcolor: v.status === 'urgent' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.08)' ,
                      border: `1px solid ${v.status === 'urgent' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.15)'}`,
                    }}>
                      <CalendarIcon fontSize="small" sx={{ color: v.status === 'urgent' ? '#EF4444' : '#F59E0B' }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>{v.name}</Typography>
                        <Typography variant="caption" sx={{ color: '#888', fontSize: 11 }}>{v.dueDate}</Typography>
                      </Box>
                      {v.status === 'urgent' && (
                        <Chip label="即将到期" size="small" color="error" sx={{ height: 22, fontSize: 10 }} />
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
          <Card sx={{ borderRadius: 3, border: '1px solid rgba(139,92,246,0.15)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <FoodIcon sx={{ color: '#8B5CF6' }} />
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>今日辅食推荐</Typography>
                <Chip label={`${childAge || 8}个月龄方案`} size="small" color="secondary" variant="outlined" />
              </Box>
              
              <Grid container spacing={1.5}>
                {MOCK_TODAY_RECOMMENDATIONS.map((meal, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Box sx={{
                      p: 2, borderRadius: 2.5, bgcolor: 'rgba(139,92,246,0.06)',
                      border: '1px solid rgba(139,92,246,0.12)', transition: 'all 0.2s',
                      '&:hover': { bgcolor: 'rgba(139,92,246,0.12)', transform: 'translateX(4px)' },
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: '#8B5CF620', color: '#8B5CF6' }}>
                          {meal.icon}
                        </Avatar>
                        <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{meal.name}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip label={meal.category} size="small" sx={{ height: 22, fontSize: 10 }} color="secondary" />
                        <Typography variant="caption" sx={{ color: '#8B5CF6', fontWeight: 500 }}>{meal.time}</Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: '#777', mt: 0.5, display: 'block' }}>
                        🥗 {meal.nutrition}
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
              <Card sx={{ borderRadius: 3, border: '1px solid rgba(16,185,129,0.15)' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <SpeedIcon sx={{ color: '#10B981' }} />
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>营养摄入分析</Typography>
                  </Box>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={MOCK_NUTRITION_RADAR}>
                      <PolarGrid stroke="#333" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#999', fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#666', fontSize: 10 }} />
                      <Radar name="营养达标率" dataKey="A" stroke="#10B981" fill="#10B981" fillOpacity={0.25} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* 辅食类别柱状图 */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3, border: '1px solid rgba(96,165,250,0.15)' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <FoodIcon sx={{ color: '#60A5FA' }} />
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>辅食食谱分布</Typography>
                  </Box>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={MOCK_FOOD_CATEGORIES} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="#777" tick={{ fontSize: 12 }} width={64} />
                      <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333', borderRadius: 8, color: '#fff' }} />
                      <Bar dataKey="count" radius={[0, 6, 6, 0]}>
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
          <Card sx={{ borderRadius: 3, border: '1px solid rgba(236,72,153,0.15)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <StoryIcon sx={{ color: '#EC4899' }} />
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>本周亲子活动</Typography>
              </Box>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={MOCK_WEEKLY_ACTIVITY} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="day" stroke="#777" tick={{ fontSize: 12 }} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333', borderRadius: 8, color: '#fff' }} />
                  <Legend iconType="circle" wrapperStyle={{ paddingBottom: 8 }} />
                  <Bar dataKey="meals" name="辅食次数" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="reading" name="阅读时长(分)" fill="#EC4899" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* ---- 儿童信息卡 + 快速操作 ---- */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 3, border: '1px solid rgba(0,212,255,0.15)', minHeight: 280 }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <HeartIcon sx={{ color: '#EC4899' }} />
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>宝宝信息卡</Typography>
              </Box>

              {hasChildren && selectedChild ? (
                <>
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Avatar
                      src={selectedChild.avatar}
                      sx={{
                        width: 80, height: 80, mx: 'auto', mb: 1.5,
                        bgcolor: selectedChild.gender === 'male' ? '#1976d2' : '#e91e63',
                        border: '3px solid #00D4FF40',
                        fontSize: 36,
                      }}
                    >
                      {selectedChild.gender === 'male' ? '👦' : '👧'}
                    </Avatar>
                    <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>{selectedChild.name}</Typography>
                    <Chip
                      label={childAge ? (childAge > 12 ? `${Math.floor(childAge / 12)}岁${childAge % 12 > 0 ? childAge % 12 + '个月' : ''}` : `${childAge}个月`) : ''}
                      color="primary"
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>

                  <Divider sx={{ borderColor: '#333', my: 1 }} />

                  <Grid container spacing={1.5} sx={{ flex: 1 }}>
                    {[
                      { label: '最近身高', value: '72 cm', icon: <HeightIcon />, color: '#00D4FF' },
                      { label: '最近体重', value: '9.2 kg', icon: <WeightIcon />, color: '#10B981' },
                      { label: '疫苗完成', value: '75%', icon: <VaccineIcon />, color: '#F59E0B' },
                      { label: '阅读天数', value: '18 天', icon: <BookIcon />, color: '#EC4899' },
                    ].map((item) => (
                      <Grid item xs={6} key={item.label}>
                        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${item.color}08`, border: `1px solid ${item.color}20`, textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.3 }}>
                            {React.cloneElement(item.icon, { sx: { fontSize: 16, color: item.color } })}
                            <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                          </Box>
                          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>{item.value}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <ChildIcon sx={{ fontSize: 56, color: '#374151' }} />
                  <Typography color="text.secondary">暂无儿童档案，点击下方添加</Typography>
                  <Button variant="contained" startIcon={<ChildIcon />} onClick={() => navigate('/children')} sx={{ borderRadius: 2 }}>
                    添加宝宝档案
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
