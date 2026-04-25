import React, { useState, useMemo, useEffect } from 'react';
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as DoneIcon,
  RadioButtonUnchecked as PendingIcon,
  Vaccines as VaccineIcon,
  CalendarToday as CalendarIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useChildrenStore } from '../stores/childrenStore';
import type { VaccinationRecord, Child } from '../types';

// 中国疫苗接种计划（基于0-6岁儿童）
const VACCINE_SCHEDULE = [
  // 出生时
  { id: 'hepb1', name: '乙肝疫苗（第1针）', month: 0, description: '出生后24小时内接种' },
  { id: 'bcg', name: '卡介苗', month: 0, description: '出生后尽快接种' },
  
  // 1个月
  { id: 'hepb2', name: '乙肝疫苗（第2针）', month: 1, description: '' },
  
  // 2个月
  { id: 'ipv1', name: '脊灰灭活疫苗（第1针）', month: 2, description: '' },
  
  // 3个月
  { id: 'dtap1', name: '百白破疫苗（第1针）', month: 3, description: '' },
  { id: 'ipv2', name: '脊灰疫苗（第2针）', month: 3, description: '' },
  
  // 4个月
  { id: 'dtap2', name: '百白破疫苗（第2针）', month: 4, description: '' },
  { id: 'ipv3', name: '脊灰疫苗（第3针）', month: 4, description: '' },
  
  // 5个月
  { id: 'dtap3', name: '百白破疫苗（第3针）', month: 5, description: '' },
  
  // 6个月
  { id: 'hepb3', name: '乙肝疫苗（第3针）', month: 6, description: '' },
  { id: 'a1', name: 'A群流脑疫苗（第1针）', month: 6, description: '' },
  
  // 8个月
  { id: 'mr1', name: '麻腮风疫苗（第1针）', month: 8, description: '' },
  { id: 'je1', name: '乙脑减毒活疫苗（第1针）', month: 8, description: '' },
  
  // 9个月
  { id: 'a2', name: 'A群流脑疫苗（第2针）', month: 9, description: '' },
  
  // 12个月
  { id: 'varicella', name: '水痘疫苗（推荐）', month: 12, description: '自费疫苗' },
  { id: 'pcv13_1', name: '13价肺炎疫苗（第3/4针）', month: 12, description: '自费疫苗' },
  
  // 18个月
  { id: 'dtap4', name: '百白破疫苗（第4针）', month: 18, description: '' },
  { id: 'mr2', name: '麻腮风疫苗（第2针）', month: 18, description: '' },
  { id: 'je2', name: '乙脑减毒活疫苗（第2针）', month: 18, description: '' },
  { id: 'hepa', name: '甲肝减毒活疫苗', month: 18, description: '' },
  
  // 24个月 (2岁)
  { id: 'varicella2', name: '水痘疫苗（第2针，推荐）', month: 24, description: '自费疫苗' },
  { id: 'dtap_boost1', name: '百白破加强针', month: 24, description: '' },
  
  // 36个月 (3岁)
  { id: 'a_c1', name: 'AC群流脑疫苗（第1针）', month: 36, description: '' },
  
  // 48个月 (4岁)
  { id: 'ipv4', name: '脊灰疫苗（第4针）', month: 48, description: '' },
  
  // 72个月 (6岁)
  { id: 'dtap_boost2', name: '白破疫苗', month: 72, description: '' },
  { id: 'a_c2', name: 'AC群流脑疫苗（第2针）', month: 72, description: '' },
];

const VaccineRecordPage: React.FC = () => {
  const { children, selectedChildId, selectChild, vaccineRecords, updateVaccineRecord } = useChildrenStore();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState<typeof VACCINE_SCHEDULE[0] | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    batchNumber: '',
    location: '',
    notes: '',
    nextDate: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const selectedChild = children.find(c => c.id === selectedChildId) || children[0];

  const calculateAgeInMonths = (birthDate: string): number => {
    const birth = new Date(birthDate);
    const now = new Date();
    return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  };

  const childAgeMonths = selectedChild ? calculateAgeInMonths(selectedChild.birthDate) : 0;

  // 获取选中儿童的疫苗记录
  const childVaccineRecords = useMemo(() => {
    if (!selectedChild) return {};
    return vaccineRecords[selectedChild.id] || {};
  }, [selectedChild, vaccineRecords]);

  // 按状态分类疫苗
  const categorizedVaccines = useMemo(() => {
    const overdue: typeof VACCINE_SCHEDULE = [];
    const upcoming: typeof VACCINE_SCHEDULE = [];
    const completed: typeof VACCINE_SCHEDULE = [];
    const future: typeof VACCINE_SCHEDULE = [];

    VACCINE_SCHEDULE.forEach(vaccine => {
      const record = childVaccineRecords[vaccine.id];
      
      if (record?.completed) {
        completed.push(vaccine);
      } else if (vaccine.month <= childAgeMonths - 2) {
        overdue.push(vaccine);
      } else if (vaccine.month <= childAgeMonths + 1 && vaccine.month > childAgeMonths - 2) {
        upcoming.push(vaccine);
      } else {
        future.push(vaccine);
      }
    });

    return { overdue, upcoming, completed, future };
  }, [childVaccineRecords, childAgeMonths]);

  // 统计数据
  const stats = useMemo(() => {
    const total = VACCINE_SCHEDULE.length;
    const completed = categorizedVaccines.completed.length;
    const overdue = categorizedVaccines.overdue.length;
    
    return { total, completed, overdue, rate: Math.round((completed / total) * 100) };
  }, [categorizedVaccines]);

  const handleOpenDialog = (vaccine?: typeof VACCINE_SCHEDULE[0]) => {
    if (!selectedChild) {
      setSnackbar({ open: true, message: '请先选择一个儿童', severity: 'error' });
      return;
    }

    setSelectedVaccine(vaccine || null);
    
    if (vaccine && childVaccineRecords[vaccine.id]) {
      const record = childVaccineRecords[vaccine.id];
      setFormData({
        date: record.date.split('T')[0],
        batchNumber: record.batchNumber || '',
        location: record.location || '',
        notes: record.notes || '',
        nextDate: record.nextDate || '',
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        batchNumber: '',
        location: '',
        notes: '',
        nextDate: '',
      });
    }
    
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (!selectedVaccine || !selectedChild) return;

    updateVaccineRecord(selectedChild.id, selectedVaccine.id, {
      date: formData.date,
      batchNumber: formData.batchNumber,
      location: formData.location,
      notes: formData.notes,
      nextDate: formData.nextDate || undefined,
      completed: true,
    });

    setSnackbar({ open: true, message: '接种记录已保存', severity: 'success' });
    setOpenDialog(false);
  };

  const getVaccineListByTab = (): { vaccines: typeof VACCINE_SCHEDULE; title: string; color: string }[] => {
    switch (tabValue) {
      case 0:
        return [{ vaccines: categorizedVaccines.upcoming, title: `待接种 (${categorizedVaccines.upcoming.length})`, color: 'warning' }];
      case 1:
        return [{ vaccines: categorizedVaccines.completed, title: `已完成 (${categorizedVaccines.completed.length})`, color: 'success' }];
      case 2:
        return [
          { vaccines: categorizedVaccines.overdue, title: `逾期未种 (${categorizedVaccines.overdue.length})`, color: 'error' },
          { vaccines: categorizedVaccines.future, title: `未来计划 (${categorizedVaccines.future.length})`, color: 'info' },
        ];
      default:
        return [];
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            疫苗记录
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
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2 }}
        >
          记录接种
        </Button>
      </Box>

      {selectedChild ? (
        <>
          {/* 统计卡片 */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} md={3}>
              <Card sx={{ bgcolor: '#1a237e22', borderRadius: 3 }}>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight="bold" color="primary">
                    {stats.completed}
                  </Typography>
                  <Typography variant="body2">已接种</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ bgcolor: '#f57c0022', borderRadius: 3 }}>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight="bold" color="warning.main">
                    {stats.overdue}
                  </Typography>
                  <Typography variant="body2">逾期</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ bgcolor: '#388e3c22', borderRadius: 3 }}>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight="bold" color="success.main">
                    {stats.rate}%
                  </Typography>
                  <Typography variant="body2">完成率</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ bgcolor: 'background.paper', borderRadius: 3 }}>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight="bold">
                    {childAgeMonths}
                  </Typography>
                  <Typography variant="body2">当前月龄</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* 标签页 */}
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 2 }}>
            <Tab label={`待接种 (${categorizedVaccines.upcoming.length})`} />
            <Tab label={`已完成 (${categorizedVaccines.completed.length})`} />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  其他
                  {categorizedVaccines.overdue.length > 0 && (
                    <Chip size="small" label={categorizedVaccines.overdue.length} color="error" />
                  )}
                </Box>
              }
            />
          </Tabs>

          {/* 疫苗列表 */}
          <Grid container spacing={2}>
            {getVaccineListByTab().map((group) => (
              <Grid item xs={12} key={group.title}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>{group.title}</Typography>
                {group.vaccines.map((vaccine) => {
                  const record = childVaccineRecords[vaccine.id];
                  return (
                    <Card
                      key={vaccine.id}
                      variant="outlined"
                      sx={{
                        mb: 1.5,
                        borderLeft: `4px solid ${
                          group.color === 'error' ? '#f44336' :
                          group.color === 'warning' ? '#ff9800' :
                          group.color === 'success' ? '#4caf50' : '#90caf9'
                        }`,
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'action.hover' },
                      }}
                    >
                      <CardContent
                        sx={{ p: 2, '&:last-child': { pb: 2 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        onClick={() => handleOpenDialog(vaccine)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                          {record?.completed ? (
                            <DoneIcon color="success" />
                          ) : (
                            <PendingIcon color="disabled" />
                          )}
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle1">{vaccine.name}</Typography>
                              {vaccine.description && (
                                <Chip label={vaccine.description} size="small" variant="outlined" />
                              )}
                              {group.color === 'error' && (
                                <WarningIcon color="error" fontSize="small" />
                              )}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                推荐月龄：{vaccine.month > 12 ? `${Math.floor(vaccine.month / 12)}岁` : `${vaccine.month}个月`}
                              </Typography>
                              {record?.date && (
                                <Typography variant="caption" color="success.main">
                                  已于 {new Date(record.date).toLocaleDateString()} 接种
                                </Typography>
                              )}
                              {record?.location && (
                                <Typography variant="caption" color="text.secondary">
                                  地点：{record.location}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Box>
                        
                        {!record?.completed && (
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDialog(vaccine);
                            }}
                          >
                            记录接种
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
                
                {group.vaccines.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, fontStyle: 'italic' }}>
                    暂无疫苗
                  </Typography>
                )}
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">请先在儿童管理中添加儿童信息</Typography>
        </Card>
      )}

      {/* 接种记录对话框 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {childVaccineRecords[selectedVaccine?.id]?.completed ? '编辑接种记录' : 
           selectedVaccine ? `记录接种：${selectedVaccine.name}` : '选择要记录的疫苗'}
        </DialogTitle>
        <DialogContent>
          {!selectedVaccine ? (
            <List>
              {VACCINE_SCHEDULE.filter(v => !childVaccineRecords[v.id]?.completed)
                .slice(0, 10)
                .map((vaccine) => (
                <ListItem button key={vaccine.id} onClick={() => setSelectedVaccine(vaccine)}>
                  <ListItemText primary={vaccine.name} secondary={`${vaccine.month > 12 ? `${Math.floor(vaccine.month / 12)}岁` : `${vaccine.month}个月`}龄`} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="接种日期"
                type="date"
                fullWidth
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="接种地点"
                fullWidth
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="例如：XX社区卫生服务中心"
              />
              <TextField
                label="疫苗批号"
                fullWidth
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
              />
              <TextField
                label="下次接种日期"
                type="date"
                fullWidth
                value={formData.nextDate}
                onChange={(e) => setFormData({ ...formData, nextDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="备注"
                fullWidth
                multiline
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>取消</Button>
          {selectedVaccine && (
            <Button variant="contained" onClick={handleSave}>保存</Button>
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

export default VaccineRecordPage;
