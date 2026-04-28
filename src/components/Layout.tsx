import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography,
  IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Avatar, Menu, MenuItem, Divider, Badge,
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard, ChildCare, TrendingUp,
  Vaccines, Restaurant, MenuBook, People, Notifications,
  Logout, Settings, ChevronLeft,
} from '@mui/icons-material';
import { useAuthStore } from '../stores/authStore';
import { useAppStore } from '../stores/appStore';

const DRAWER_WIDTH = 260;

const menuItems = [
  { path: '/', label: '数据大屏', icon: <Dashboard /> },
  { path: '/children', label: '儿童管理', icon: <ChildCare /> },
  { path: '/growth', label: '成长记录', icon: <TrendingUp /> },
  { path: '/vaccine', label: '疫苗管理', icon: <Vaccines /> },
  { path: '/food', label: '辅食食谱', icon: <Restaurant /> },
  { path: '/books', label: '读物推荐', icon: <MenuBook /> },
];

const adminMenuItems = [{ path: '/users', label: '用户管理', icon: <People /> }];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';
  const currentPath = location.pathname;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0A0E1A' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${sidebarCollapsed ? 64 : DRAWER_WIDTH}px)` },
          ml: { md: `${sidebarCollapsed ? 64 : DRAWER_WIDTH}px` },
          bgcolor: 'rgba(17, 24, 39, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 212, 255, 0.1)',
          transition: 'width 0.3s, margin 0.3s',
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={toggleSidebar} sx={{ mr: 2, color: '#00D4FF' }}>
            {sidebarCollapsed ? <MenuIcon /> : <ChevronLeft />}
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#00D4FF', fontWeight: 600 }}>
            育儿管理平台 OS
          </Typography>
          <IconButton sx={{ color: '#00D4FF', mr: 1 }}>
            <Badge badgeContent={3} color="error"><Notifications /></Badge>
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', ml: 2 }}
            onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ width: 36, height: 36, border: '2px solid #00D4FF' }}>
              {user?.username?.[0]?.toUpperCase() || 'A'}
            </Avatar>
            <Box sx={{ ml: 1.5, display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>{user?.username}</Typography>
              <Typography variant="caption" sx={{ color: '#00D4FF' }}>{isAdmin ? '管理员' : '普通用户'}</Typography>
            </Box>
          </Box>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
            PaperProps={{ sx: { bgcolor: '#1F2937', border: '1px solid rgba(0, 212, 255, 0.2)', color: '#fff' } }}>
            <MenuItem onClick={() => setAnchorEl(null)} sx={{ color: '#fff' }}>
              <Settings sx={{ mr: 1, color: '#00D4FF' }} /> 设置
            </MenuItem>
            <Divider sx={{ bgcolor: 'rgba(0, 212, 255, 0.1)' }} />
            <MenuItem onClick={handleLogout} sx={{ color: '#EF4444' }}>
              <Logout sx={{ mr: 1 }} /> 退出登录
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarCollapsed ? 64 : DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebarCollapsed ? 64 : DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: '#111827',
            borderRight: '1px solid rgba(0, 212, 255, 0.1)',
            transition: 'width 0.3s',
            overflowX: 'hidden',
          },
        }}
      >
        <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', px: 1, borderBottom: '1px solid rgba(0, 212, 255, 0.1)' }}>
          {!sidebarCollapsed && (
            <Typography variant="h6" sx={{ color: '#00D4FF', fontWeight: 700, letterSpacing: 2, ml: 2 }}>
              CHILD OS
            </Typography>
          )}
        </Toolbar>
        <List sx={{ pt: 2 }}>
          {menuItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    minHeight: 48, px: sidebarCollapsed ? 2.5 : 3, mx: 1, borderRadius: 2,
                    bgcolor: isActive ? 'rgba(0, 212, 255, 0.15)' : 'transparent',
                    color: isActive ? '#00D4FF' : '#9CA3AF',
                    '&:hover': { bgcolor: 'rgba(0, 212, 255, 0.1)', color: '#00D4FF' },
                    border: isActive ? '1px solid rgba(0, 212, 255, 0.3)' : '1px solid transparent',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: sidebarCollapsed ? 0 : 2, justifyContent: 'center', color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  {!sidebarCollapsed && <ListItemText primary={item.label} sx={{ '& .MuiTypography-root': { fontSize: 14, fontWeight: isActive ? 600 : 400 } }} />}
                </ListItemButton>
              </ListItem>
            );
          })}
          {isAdmin && (
            <>
              <Divider sx={{ my: 2, mx: 2, bgcolor: 'rgba(0, 212, 255, 0.1)' }} />
              {!sidebarCollapsed && <Typography variant="caption" sx={{ px: 3, color: '#6B7280', display: 'block', mb: 1 }}>系统管理</Typography>}
              {adminMenuItems.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      onClick={() => navigate(item.path)}
                      sx={{
                        minHeight: 48, px: sidebarCollapsed ? 2.5 : 3, mx: 1, borderRadius: 2,
                        bgcolor: isActive ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                        color: isActive ? '#8B5CF6' : '#9CA3AF',
                        '&:hover': { bgcolor: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' },
                        border: isActive ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 0, mr: sidebarCollapsed ? 0 : 2, justifyContent: 'center', color: 'inherit' }}>
                        {item.icon}
                      </ListItemIcon>
                      {!sidebarCollapsed && <ListItemText primary={item.label} sx={{ '& .MuiTypography-root': { fontSize: 14, fontWeight: isActive ? 600 : 400 } }} />}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </>
          )}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, p: 3,
          width: { md: `calc(100% - ${sidebarCollapsed ? 64 : DRAWER_WIDTH}px)` },
          mt: '64px', minHeight: 'calc(100vh - 64px)', transition: 'width 0.3s',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
