import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Avatar, IconButton, Chip, Snackbar, Alert,
  Radio, RadioGroup, FormControlLabel, FormLabel, Divider, FormControl,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import CakeIcon from '@mui/icons-material/Cake';
import HeightIcon from '@mui/icons-material/Height';
import WeightIcon from '@mui/icons-material/MonitorWeight';
import { useChildrenStore } from '../stores/childrenStore';

interface FormData {
  name: string;
  gender: 'male' | 'female';
  birthDate: string;
  birthHeight: string;
  birthWeight: string;
}

const ChildrenManage: React.FC = () => {
  const store = useChildrenStore();
  const children = store.children || [];
  const addChild = store.addChild;
  const updateChild = store.updateChild;
  const deleteChild = store.deleteChild;

  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '', gender: 'male', birthDate: '', birthHeight: '', birthWeight: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const selected = children.find((c: any) => c.id === selectedId) || children[0] || null;

  useEffect(() => {
    if (children.length > 0 && !selectedId) {
      setSelectedId(children[children.length - 1].id);
    }
  }, [children.length]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', gender: 'male', birthDate: '', birthHeight: '', birthWeight: '' });
    setOpenDialog(true);
  };

  const handleOpenEdit = (child: any) => {
    setEditingId(child.id);
    setFormData({
      name: child.name || '',
      gender: child.gender || 'male',
      birthDate: child.birthDate ? child.birthDate.split('T')[0] : '',
      birthHeight: child.birthHeight ? String(child.birthHeight) : '',
      birthWeight: child.birthWeight ? String(child.birthWeight) : '',
    });
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) { setSnackbar({ open: true, message: '请填写儿童姓名', severity: 'error' }); return; }
    if (!formData.birthDate) { setSnackbar({ open: true, message: '请选择出生日期', severity: 'error' }); return; }
    const data: any = {
      name: formData.name.trim(),
      gender: formData.gender,
      birthDate: new Date(formData.birthDate).toISOString(),
    };
    if (formData.birthHeight) data.birthHeight = Number(formData.birthHeight);
    if (formData.birthWeight) data.birthWeight = Number(formData.birthWeight);
    if (editingId) { updateChild(editingId, data); setSnackbar({ open: true, message: '已更新', severity: 'success' }); }
    else { addChild(data); setSnackbar({ open: true, message: '添加成功！', severity: 'success' }); }
    setOpenDialog(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定删除该儿童档案？')) {
      deleteChild(id);
      if (selectedId === id) setSelectedId(null);
      setSnackbar({ open: true, message: '已删除', severity: 'success' });
    }
  };

  const getAge = (dateStr: string): string => {
    try {
      const birth = new Date(dateStr);
      const now = new Date();
      let m = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth();
      const y = Math.floor(m / 12); m %= 12;
      if (y > 0) return `${y}岁${m > 0 ? m + '个月' : ''}`;
      return `${m}个月`;
    } catch { return ''; }
  };

  return (
    <Box>
      {/* 标题栏 + 新增按钮 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" fontWeight="bold" color="#fff">儿童管理</Typography>
          <Chip label={`${children.length} 个档案`} color="primary" variant="outlined" size="small" />
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}
          sx={{ borderRadius: 2, px: 3, py: 1, fontWeight: 'bold', bgcolor: '#00D4FF', color: '#000' }}>
          添加儿童
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* 左侧列表 */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)', bgcolor: 'transparent' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#fff' }}>儿童列表</Typography>
              {children.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6, border: '2px dashed rgba(255,255,255,0.15)', borderRadius: 3 }}>
                  <Typography sx={{ fontSize: 48, mb: 1 }}>📋</Typography>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>暂无儿童档案</Typography>
                  <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpenAdd}>点击添加第一位宝宝</Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {children.map((child: any) => (
                    <Card key={child.id} onClick={() => setSelectedId(child.id)} elevation={0}
                      sx={{
                        cursor: 'pointer',
                        border: selectedId === child.id ? '2px solid #00D4FF' : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 2.5,
                        background: selectedId === child.id ? 'rgba(0,212,255,0.08)' : 'rgba(255,255,255,0.02)',
                        '&:hover': { background: 'rgba(255,255,255,0.06)', transform: 'translateX(4px)' },
                      }}>
                      <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{
                          width: 48, height: 48,
                          background: child.gender === 'male' ? 'linear-gradient(135deg,#1976d2,#42a5f5)' : 'linear-gradient(135deg,#e91e63,#f06292)',
                        }}>
                          {child.gender === 'male' ? <MaleIcon /> : <FemaleIcon />}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="subtitle1" fontWeight={700} noWrap sx={{ color: '#fff' }}>{child.name}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Chip icon={child.gender === 'male' ? <MaleIcon /> : <FemaleIcon />} label={getAge(child.birthDate)}
                              size="small" color={child.gender === 'male' ? 'primary' : 'secondary'} sx={{ height: 22 }} />
                            <Typography variant="caption" color="text.secondary">
                              {child.birthDate ? new Date(child.birthDate).toLocaleDateString() : ''}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton size="small" color="primary" onClick={(e) => { e.stopPropagation(); handleOpenEdit(child); }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDelete(child.id); }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* 右侧详情 */}
        <Grid size={{ xs: 12, md: 7 }}>
          {selected ? (
            <Card sx={{ borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)', bgcolor: 'transparent' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ textAlign: 'center', mb: 3, pb: 3, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <Avatar sx={{
                    width: 80, height: 80, mx: 'auto', mb: 1.5,
                    background: selected.gender === 'male' ? 'linear-gradient(135deg,#1976d2,#42a5f5)' : 'linear-gradient(135deg,#e91e63,#f06292)', fontSize: 36,
                  }}>
                    {selected.gender === 'male' ? <MaleIcon sx={{ fontSize: 36 }} /> : <FemaleIcon sx={{ fontSize: 36 }} />}
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#fff' }}>{selected.name}</Typography>
                  <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Chip icon={selected.gender === 'male' ? <MaleIcon /> : <FemaleIcon />}
                      label={selected.gender === 'male' ? '男孩' : '女孩'}
                      color={selected.gender === 'male' ? 'primary' : 'secondary'} size="small" />
                    <Chip icon={<CakeIcon />} label={getAge(selected.birthDate)} variant="outlined" size="small" />
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Card elevation={0} sx={{ p: 2, borderRadius: 2, background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>姓名</Typography>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff', mt: 0.5 }}>{selected.name}</Typography>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Card elevation={0} sx={{ p: 2, borderRadius: 2, background: 'rgba(25,118,210,0.06)', border: '1px solid rgba(25,118,210,0.12)' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {selected.gender === 'male' ? <MaleIcon color="primary" sx={{ fontSize: 18 }} /> : <FemaleIcon color="secondary" sx={{ fontSize: 18 }} />}
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>性别</Typography>
                      </Box>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff', mt: 0.5 }}>
                        {selected.gender === 'male' ? '男' : '女'}
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Card elevation={0} sx={{ p: 2, borderRadius: 2, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.12)' }}>
                      <CakeIcon sx={{ color: '#F59E0B', fontSize: 18 }} />
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5, fontWeight: 600 }}>出生日期</Typography>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff', mt: 0.5 }}>
                        {selected.birthDate ? new Date(selected.birthDate).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">距今 {getAge(selected.birthDate)}</Typography>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Card elevation={0} sx={{ p: 2, borderRadius: 2, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)' }}>
                      <HeightIcon sx={{ color: '#10B981', fontSize: 18 }} />
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5, fontWeight: 600 }}>出生身高</Typography>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff', mt: 0.5 }}>
                        {selected.birthHeight ? `${selected.birthHeight} cm` : '未记录'}
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Card elevation={0} sx={{ p: 2, borderRadius: 2, background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)' }}>
                      <WeightIcon sx={{ color: '#8B5CF6', fontSize: 18 }} />
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5, fontWeight: 600 }}>出生体重</Typography>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff', mt: 0.5 }}>
                        {selected.birthWeight ? `${selected.birthWeight} kg` : '未记录'}
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Button startIcon={<EditIcon />} variant="outlined" onClick={() => handleOpenEdit(selected)}>编辑</Button>
                  <Button startIcon={<DeleteIcon />} color="error" variant="outlined" onClick={() => handleDelete(selected.id)}>删除</Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Card sx={{ borderRadius: 3, minHeight: 400, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(255,255,255,0.08)', bgcolor: 'transparent' }}>
              <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                <Typography sx={{ fontSize: 48, opacity: 0.3 }}>👈</Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>从左侧选择或新增儿童</Typography>
              </Box>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* 对话框 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3, bgcolor: '#1F2937' } }}>
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.08)', fontWeight: 700, color: '#fff' }}>
          {editingId ? '编辑儿童信息' : '添加新儿童'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="姓名 *" fullWidth value={formData.name}
              onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
              placeholder="请输入姓名" autoFocus={!editingId} InputLabelProps={{ shrink: true }} />
            <FormControl>
              <FormLabel sx={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>性别 *</FormLabel>
              <RadioGroup row value={formData.gender}
                onChange={(e) => setFormData((f) => ({ ...f, gender: e.target.value as 'male' | 'female' }))}>
                <FormControlLabel value="male" control={<Radio color="primary" />} label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><MaleIcon color="primary" sx={{ fontSize: 18 }} />男孩</Box>
                } />
                <FormControlLabel value="female" control={<Radio color="secondary" />} label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><FemaleIcon color="secondary" sx={{ fontSize: 18 }} />女孩</Box>
                } />
              </RadioGroup>
            </FormControl>
            <TextField label="出生日期 *" type="date" fullWidth value={formData.birthDate}
              onChange={(e) => setFormData((f) => ({ ...f, birthDate: e.target.value }))}
              InputLabelProps={{ shrink: true }} />
            <TextField label="出生身高（cm）" type="number" fullWidth value={formData.birthHeight}
              onChange={(e) => setFormData((f) => ({ ...f, birthHeight: e.target.value }))}
              placeholder="例如：50" inputProps={{ min: 30, max: 60 }} />
            <TextField label="出生体重（kg）" type="number" fullWidth value={formData.birthWeight}
              onChange={(e) => setFormData((f) => ({ ...f, birthWeight: e.target.value }))}
              placeholder="例如：3.3" inputProps={{ min: 1, max: 7 }} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Button onClick={() => setOpenDialog(false)}>取消</Button>
          <Button variant="contained" onClick={handleSave} sx={{ borderRadius: 2, bgcolor: '#00D4FF', color: '#000' }}>
            {editingId ? '保存修改' : '确认添加'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2 }}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChildrenManage;
