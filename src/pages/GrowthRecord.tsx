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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Height as HeightIcon,
  MonitorWeight as WeightIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useChildrenStore } from '../stores/childrenStore';
import type { GrowthRecord, Child } from '../types';

const GrowthRecordPage: React.FC = () => {
  const { children, selectedChildId, selectChild, growthRecords, addGrowthRecord, deleteGrowthRecord } = useChildrenStore();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    height: '',
    weight: '',
    headCircumference: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // WHO标准数据（简化版）
  const whoStandardHeight = useMemo(() => [
    { month: 0, boy: 50, girl: 49 },
    { month: 3, boy: 61.4, girl: 59.8 },
    { month: 6, boy: 67.6, girl: 65.7 },
    { month: 9, boy: 72, girl: 70.1 },
    { month: 12, boy: 75.7, girl: 74 },
    { month: 18, boy: 82.3, girl: 80.5 },
    { month: 24, boy: 87.8, girl: 86.2 },
    { month: 36, boy: 95.1, girl: 94 },
    { month: 48, boy: 102, girl: 101 },
    { month: 60, boy: 108, girl: 107 },
  ], []);

  const whoStandardWeight = useMemo(() => [
    { month: 0, boy: 3.3, girl: 3.2 },
    { month: 3, boy: 6.9, girl: 6.4 },
    { month: 6, boy: 8.8, girl: 8.1 },
    { month: 9, boy: 9.9, girl: 9.2 },
    { month: 12, boy: 10.5, girl: 9.8 },
    { month: 18, boy: 11.5, girl: 10.9 },
    { month: 24, boy: 12.7, girl: 12 },
    { month: 36, boy: 14.5, girl: 13.9 },
    { month: 48, boy: 16, girl: 15.5 },
    { month: 60, boy: 17.8, girl: 17.2 },
  ], []);

  const selectedChild = children.find(c => c.id === selectedChildId) || children[0];

  const calculateAgeInMonths = (birthDate: string): number => {
    const birth = new Date(birthDate);
    const now = new Date();
    return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  };

  const childAgeMonths = selectedChild ? calculateAgeInMonths(selectedChild.birthDate) : 0;

  const getStandardValue = (standard: any[], months: number, gender?: string): number => {
    const point = standard.find(p => p.month <= months)?.[gender === 'male' ? 'boy' : 'girl'] || 0;
    return point as number;
  };

  // 获取选中儿童的生长记录
  const childRecords = useMemo(() => {
    if (!selectedChild) return [];
    
    return (growthRecords[selectedChild.id] || [])
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(record => {
        const recordDate = new Date(record.date);
        const birthDate = new Date(selectedChild!.birthDate);
        const months = (recordDate.getFullYear() - birthDate.getFullYear()) * 12 + 
                       (recordDate.getMonth() - birthDate.getMonth());
        
        return {
          ...record,
          ageMonths: months,
          dateLabel: recordDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' }),
        };
      });
  }, [selectedChild, growthRecords]);

  // 准备图表数据
  const heightChartData = useMemo(() => {
    const data = childRecords.map(r => ({
      age: r.ageMonths,
      name: `${Math.floor(r.ageMonths / 12)}岁${r.ageMonths % 12}月`,
      actual: r.height,
      standard: getStandardValue(whoStandardHeight, r.ageMonths, selectedChild?.gender),
    }));
    
    // 添加WHO标准线
    whoStandardHeight.forEach(point => {
      if (!data.find(d => d.age === point.month)) {
        data.push({
          age: point.month,
          name: `${Math.floor(point.month / 12)}岁${point.month % 12}月`,
          actual: null,
          standard: selectedChild?.gender === 'male' ? point.boy : point.girl,
        });
      }
    });
    
    return data.sort((a, b) => a.age - b.age);
  }, [childRecords, whoStandardHeight, selectedChild]);

  const weightChartData = useMemo(() => {
    const data = childRecords.map(r => ({
      age: r.ageMonths,
      name: `${Math.floor(r.ageMonths / 12)}岁${r.ageMonths % 12}月`,
      actual: r.weight,
      standard: getStandardValue(whoStandardWeight, r.ageMonths, selectedChild?.gender),
    }));
    
    whoStandardWeight.forEach(point => {
      if (!data.find(d => d.age === point.month)) {
        data.push({
          age: point.month,
          name: `${Math.floor(point.month / 12)}岁${point.month % 12}月`,
          actual: null,
          standard: selectedChild?.gender === 'male' ? point.boy : point.girl,
        });
      }
    });
    
    return data.sort((a, b) => a.age - b.age);
  }, [childRecords, whoStandardWeight, selectedChild]);

  const handleOpenDialog = () => {
    if (!selectedChild) {
      setSnackbar({ open: true, message: '请先选择一个儿童', severity: 'error' });
      return;
    }
    setFormData({
      date: new Date().toISOString().split('T')[0],
      height: '',
      weight: '',
      headCircumference: '',
    });
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (!formData.height && !formData.weight) {
      setSnackbar({ open: true, message: '请至少填写身高或体重', severity: 'error' });
      return;
    }

    if (selectedChild) {
      addGrowthRecord(selectedChild.id, {
        date: new Date(formData.date).toISOString(),
        height: formData.height ? parseFloat(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        headCircumference: formData.headCircumference ? parseFloat(formData.headCircumference) : undefined,
      });
      
      setSnackbar({ open: true, message: '生长记录添加成功', severity: 'success' });
      setOpenDialog(false);
    }
  };

  const handleDelete = (recordId: string) => {
    if (selectedChild && window.confirm('确定要删除这条记录吗？')) {
      deleteGrowthRecord(selectedChild.id, recordId);
      setSnackbar({ open: true, message: '记录已删除', severity: 'success' });
    }
  };

  // 最新记录
  const latestRecord = childRecords[childRecords.length - 1];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            成长记录
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ borderRadius: 2 }}
        >
          添加记录
        </Button>
      </Box>

      {selectedChild ? (
        <Grid container spacing={3}>
          {/* 统计卡片 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 2 }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Chip label={`当前年龄: ${childAgeMonths}个月`} color="primary" sx={{ mb: 2 }} />
                
                {latestRecord && (
                  <>
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <HeightIcon color="primary" />
                        <Typography variant="body2" color="text.secondary">最新身高</Typography>
                      </Box>
                      <Typography variant="h4" fontWeight="bold">
                        {latestRecord.height} <span style={{ fontSize: 16 }}>cm</span>
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mt: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <WeightIcon color="secondary" />
                        <Typography variant="body2" color="text.secondary">最新体重</Typography>
                      </Box>
                      <Typography variant="h4" fontWeight="bold">
                        {latestRecord.weight} <span style={{ fontSize: 16 }}>kg</span>
                      </Typography>
                    </Box>

                    {latestRecord.headCircumference && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="body2" color="text.secondary">头围</Typography>
                        <Typography variant="h5" fontWeight="bold">
                          {latestRecord.headCircumference} cm
                        </Typography>
                      </Box>
                    )}
                    
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                      记录时间: {new Date(latestRecord.date).toLocaleDateString()}
                    </Typography>
                  </>
                )}

                {!latestRecord && (
                  <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                    <Typography>暂无记录</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* 图表区域 */}
          <Grid item xs={12} md={8}>
            <Card sx={{ bgcolor: 'background.paper', borderRadius: 3 }}>
              <Tabs
                value={tabValue}
                onChange={(_, v) => setTabValue(v)}
                sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
              >
                <Tab icon={<HeightIcon />} iconPosition="start" label="身高曲线" />
                <Tab icon={<WeightIcon />} iconPosition="start" label="体重曲线" />
              </Tabs>
              
              <Box sx={{ p: 3, height: 400 }}>
                {tabValue === 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={heightChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e1e1e',
                          border: '1px solid #333',
                          borderRadius: 8,
                        }}
                      />
                      <Legend />
                      <ReferenceLine
                        y={getStandardValue(whoStandardHeight, childAgeMonths, selectedChild.gender)}
                        stroke="#666"
                        strokeDasharray="5 5"
                        label={{ value: '当前标准值', position: 'right' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="standard"
                        name="WHO标准"
                        stroke="#888"
                        strokeDasharray="5 5"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        name="实测值"
                        stroke="#1976d2"
                        strokeWidth={3}
                        dot={{ fill: '#1976d2', strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e1e1e',
                          border: '1px solid #333',
                          borderRadius: 8,
                        }}
                      />
                      <Legend />
                      <ReferenceLine
                        y={getStandardValue(whoStandardWeight, childAgeMonths, selectedChild.gender)}
                        stroke="#666"
                        strokeDasharray="5 5"
                      />
                      <Line
                        type="monotone"
                        dataKey="standard"
                        name="WHO标准"
                        stroke="#888"
                        strokeDasharray="5 5"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        name="实测值"
                        stroke="#e91e63"
                        strokeWidth={3}
                        dot={{ fill: '#e91e63', strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </Card>
          </Grid>

          {/* 历史记录列表 */}
          <Grid item xs={12}>
            <Card sx={{ bgcolor: 'background.paper', borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>历史记录</Typography>
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {[...childRecords].reverse().map((record) => (
                    <Card key={record.id} variant="outlined" sx={{ mb: 1 }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(record.date).toLocaleDateString()}
                            {' · '}
                            {Math.floor(record.ageMonths / 12)}岁{record.ageMonths % 12}个月
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                            {record.height && (
                              <Typography variant="body2">
                                <HeightIcon sx={{ verticalAlign: 'middle', mr: 0.5, fontSize: 16 }} />
                                {record.height}cm
                              </Typography>
                            )}
                            {record.weight && (
                              <Typography variant="body2">
                                <WeightIcon sx={{ verticalAlign: 'middle', mr: 0.5, fontSize: 16 }} />
                                {record.weight}kg
                              </Typography>
                            )}
                            {record.headCircumference && (
                              <Typography variant="body2">
                                头围: {record.headCircumference}cm
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        <IconButton color="error" onClick={() => handleDelete(record.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {childRecords.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                      <Typography>暂无成长记录</Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">请先在儿童管理中添加儿童信息</Typography>
        </Card>
      )}

      {/* 添加记录对话框 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>添加生长记录</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="测量日期"
              type="date"
              fullWidth
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="身高 (cm)"
              type="number"
              fullWidth
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              inputProps={{ step: 0.1, min: 0 }}
            />
            <TextField
              label="体重 (kg)"
              type="number"
              fullWidth
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              inputProps={{ step: 0.01, min: 0 }}
            />
            <TextField
              label="头围 (cm，选填)"
              type="number"
              fullWidth
              value={formData.headCircumference}
              onChange={(e) => setFormData({ ...formData, headCircumference: e.target.value })}
              inputProps={{ step: 0.1, min: 0 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>取消</Button>
          <Button variant="contained" onClick={handleSave}>保存</Button>
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

export default GrowthRecordPage;
