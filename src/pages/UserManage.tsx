import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
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
  Chip,
  Avatar,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../stores/authStore';
import { User } from '../types';

const UserManage: React.FC = () => {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem('users');
    return stored ? JSON.parse(stored) : [
      {
        id: '1',
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        phone: '13800138000',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        username: 'parent1',
        password: '123456',
        role: 'parent',
        phone: '13900139000',
        createdAt: new Date().toISOString(),
      },
    ];
  });
  
  const [openDialog, setOpenDialog] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phone: '',
    role: 'parent' as 'admin' | 'parent',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // 只有管理员可以访问此页面
  if (currentUser?.role !== 'admin') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography variant="h5" color="text.secondary">
          您没有权限访问此页面
        </Typography>
      </Box>
    );
  }

  const handleOpenCreate = () => {
    setEditUser(null);
    setFormData({
      username: '',
      password: '',
      phone: '',
      role: 'parent',
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditUser(user);
    setFormData({
      username: user.username,
      password: '',
      phone: user.phone || '',
      role: user.role,
    });
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (!formData.username || !formData.password || !formData.phone) {
      setSnackbar({ open: true, message: '请填写必填字段（账号、密码、手机号）', severity: 'error' });
      return;
    }

    let updatedUsers: User[];
    
    if (editUser) {
      updatedUsers = users.map(u =>
        u.id === editUser.id
          ? {
              ...u,
              ...formData,
              password: formData.password || u.password,
            }
          : u
      );
      setSnackbar({ open: true, message: '用户更新成功', severity: 'success' });
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      updatedUsers = [...users, newUser];
      setSnackbar({ open: true, message: '用户创建成功', severity: 'success' });
    }
    
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setOpenDialog(false);
  };

  const handleDelete = (userId: string) => {
    if (window.confirm('确定要删除该用户吗？')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setSnackbar({ open: true, message: '用户删除成功', severity: 'success' });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          用户管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{ borderRadius: 2 }}
        >
          新增用户
        </Button>
      </Box>

      <Card sx={{ bgcolor: 'background.paper', borderRadius: 3 }}>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>账号</TableCell>
                  <TableCell>手机号</TableCell>
                  <TableCell>角色</TableCell>
                  <TableCell>创建时间</TableCell>
                  <TableCell align="center">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: user.role === 'admin' ? 'primary.main' : 'secondary.main' }}>
                          {user.role === 'admin' ? <AdminIcon /> : <UserIcon />}
                        </Avatar>
                        <Typography variant="body2" fontWeight={600}>
                          {user.username}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.phone || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role === 'admin' ? '管理员' : '家长'}
                        color={user.role === 'admin' ? 'primary' : 'secondary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleOpenEdit(user)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(user.id)}
                        disabled={user.id === currentUser?.id}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* 创建/编辑对话框 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editUser ? '编辑用户' : '新增用户'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="账号"
              fullWidth
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              disabled={!!editUser}
            />
            <TextField
              label="密码"
              type="password"
              fullWidth
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={editUser ? '留空则不修改密码' : ''}
            />
            <TextField
              label="手机号"
              fullWidth
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>角色</InputLabel>
              <Select
                value={formData.role}
                label="角色"
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'parent' })}
              >
                <MenuItem value="admin">管理员</MenuItem>
                <MenuItem value="parent">家长</MenuItem>
              </Select>
            </FormControl>
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

export default UserManage;
