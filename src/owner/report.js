import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  TextField,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Drawer,
  AppBar,
  Toolbar
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { 
  Download as DownloadIcon, 
  Print as PrintIcon,
  FilterAlt as FilterAltIcon,
  Home,
  People,
  CalendarMonth,
  Pets,
  Bathtub,
  ContentCut,
  Vaccines,
  Close,
  ChevronRight,
  Menu as MenuIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

// Styled components
const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
}));

const drawerWidth = 280;

// Menu items array
const menuItems = [
  { icon: <Home />, label: 'ພາບລວມຄລິນິກ', path: '/owner/dashboard' },
  { icon: <People />, label: 'ຂໍ້ມູນພະນັກງານ', path: '/owner/dataemployee' },
  { icon: <People />, label: 'ຂໍ້ມູນລູກຄ້າ', path: '/owner/datacustomer' },
  { icon: <CalendarMonth />, label: 'ຂໍ້ມູນການຈອງ', path: '/owner/databooking' },
  { icon: <Pets />, label: 'ຝາກສັດລ້ຽງ', path: '/owner/petboarding'},
  { icon: <Bathtub />, label: 'ອາບນ້ຳສັດລ້ຽງ', path: '/owner/bathpet' },
  { icon: <ContentCut />, label: 'ຕັດຂົນສັດລ້ຽງ', path: '/owner/petbar' },
  { icon: <Vaccines />, label: 'ປິ່ນປົວສັດລ້ຽງ', path: '/owner/treatpet' },
  { icon: <AssessmentIcon />, label: 'ລາຍງານ', path: '/owner/report', active: true },
];

// Main component
const ReportPage = () => {
  const theme = useTheme();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportType, setReportType] = useState('service_type');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
  };

  const generateReport = () => {
    // Logic to generate report based on selected parameters
    setIsLoading(true);
    console.log('Generating report', { startDate, endDate, reportType });
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsLoading(false);
      // Mock data - in a real app, this would come from your API
      setReportData({
        type: reportType,
        generatedAt: new Date().toLocaleString(),
        data: []
      });
    }, 1000);
  };
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <>
        <LogoContainer>
            <Avatar sx={{ bgcolor: theme.palette.primary.contrastText, color: theme.palette.primary.main }}>
                <Pets fontSize="small" />
            </Avatar>
            <Box ml={2}>
                <Typography variant="subtitle1" color="white" fontWeight="bold">
                    DR. P
                </Typography>
                <Typography variant="caption" color={theme.palette.primary.contrastText}>
                    VETERINARY
                </Typography>
            </Box>
            <IconButton
                edge="end"
                onClick={handleDrawerToggle}
                sx={{
                    color: theme.palette.primary.contrastText,
                    marginLeft: 'auto',
                    display: { sm: 'none' }
                }}
            >
                <Close />
            </IconButton>
        </LogoContainer>
        <Divider />
        <List>
            {menuItems.map((item, index) => (
                <ListItem key={index} disablePadding>
                    <ListItemButton
                        component="a"
                        href={item.path}
                        selected={item.active}
                        sx={{
                            borderRadius: 1,
                            my: 0.5,
                            mx: 1,
                            '&.Mui-selected': {
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.main,
                                },
                                '& .MuiListItemIcon-root': {
                                    color: theme.palette.primary.contrastText,
                                },
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                color: item.active ? 'inherit' : theme.palette.primary.light,
                                minWidth: 40
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                        {item.active && <ChevronRight fontSize="small" />}
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Drawer for navigation */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` }
        }}
      >
        {/* App bar for mobile view */}
        <AppBar
          position="fixed"
          sx={{
            display: { xs: 'block', sm: 'none' },
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              DR. P VETERINARY
            </Typography>
          </Toolbar>
        </AppBar>
        
        {/* Toolbar placeholder for mobile view */}
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          <Toolbar />
        </Box>

        <Typography variant="h4" component="h1" gutterBottom>
          ລາຍງານ
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          ເບິ່ງລາຍງານປະເພດຕ່າງໆ ແລະ ສະຖິຕິສໍາລັບການຕັດສິນໃຈ
        </Typography>

        <Paper sx={{ width: '100%', mt: 3, p: 3, borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker 
                  label="ວັນທີເລີ່ມຕົ້ນ"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="ວັນທີສິ້ນສຸດ"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>ປະເພດລາຍງານ</InputLabel>
                <Select
                  value={reportType}
                  label="ປະເພດລາຍງານ"
                  onChange={handleReportTypeChange}
                >
                  <MenuItem value="service_type">ລາຍງານປະເພດບໍລິການ</MenuItem>
                  <MenuItem value="services">ລາຍງານບໍລິການ</MenuItem>
                  <MenuItem value="animals">ລາຍງາຍກົງສັດ</MenuItem>
                  <MenuItem value="bookings">ລາຍງານການຈອງໃຊ້ບໍລິການ</MenuItem>
                  <MenuItem value="grooming">ລາຍງານຈຳນວນສັດຕັດຂົນທັງໝົດ</MenuItem>
                  <MenuItem value="treatment">ລາຍງານຈຳນວນສັດປິ່ນປົວທັງໝົດ</MenuItem>
                  <MenuItem value="daily_income">ລາຍງານລາຍຮັບປະຈຳວັນ</MenuItem>
                  <MenuItem value="payments">ລາຍງານການຊຳລະເງິນ</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button 
                  variant="outlined" 
                  startIcon={<FilterAltIcon />}
                  disabled={isLoading}
                  sx={{ 
                    minWidth: '100px',
                    borderRadius: '4px'
                  }}
                >
                  ກຣອງ
                </Button>
                <Button 
                  variant="contained" 
                  onClick={generateReport}
                  disabled={isLoading}
                  sx={{ 
                    minWidth: '140px',
                    boxShadow: 1,
                    '&:hover': { boxShadow: 2 }
                  }}
                >
                  {isLoading ? 'ກຳລັງສ້າງ...' : 'ສ້າງລາຍງານ'}
                </Button>
                <IconButton color="primary" aria-label="download report" disabled={!reportData || isLoading}>
                  <DownloadIcon />
                </IconButton>
                <IconButton color="primary" aria-label="print report" disabled={!reportData || isLoading}>
                  <PrintIcon />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>

          {/* Content area for the report results */}
          <Box sx={{ mt: 4, p: 2, minHeight: '50vh', bgcolor: '#f9f9f9', borderRadius: 1 }}>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
                <Typography variant="body1" color="text.secondary">
                  ກຳລັງສ້າງລາຍງານ...
                </Typography>
              </Box>
            ) : reportData ? (
              <Box>
                <Box sx={{ mb: 3, p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Typography variant="h6" gutterBottom>
                    {reportType === 'service_type' && 'ລາຍງານປະເພດບໍລິການ'}
                    {reportType === 'services' && 'ລາຍງານບໍລິການ'}
                    {reportType === 'animals' && 'ລາຍງາຍກົງສັດ'}
                    {reportType === 'bookings' && 'ລາຍງານການຈອງໃຊ້ບໍລິການ'}
                    {reportType === 'grooming' && 'ລາຍງານຈຳນວນສັດຕັດຂົນທັງໝົດ'}
                    {reportType === 'treatment' && 'ລາຍງານຈຳນວນສັດປິ່ນປົວທັງໝົດ'}
                    {reportType === 'daily_income' && 'ລາຍງານລາຍຮັບປະຈຳວັນ'}
                    {reportType === 'payments' && 'ລາຍງານການຊຳລະເງິນ'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ສ້າງເມື່ອ: {reportData.generatedAt}
                  </Typography>
                </Box>
                <Box sx={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Paper sx={{ p: 3, width: '100%', textAlign: 'center' }}>
                    <Typography>ຕາລາງຂໍ້ມູນລາຍງານຈະສະແດງຢູ່ບ່ອນນີ້</Typography>
                  </Paper>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh', flexDirection: 'column', gap: 2 }}>
                <AssessmentIcon sx={{ fontSize: 60, color: theme.palette.grey[400] }} />
                <Typography variant="body1" color="text.secondary" align="center">
                  ເລືອກຕົວກອງແລ້ວກົດປຸ່ມສ້າງລາຍງານເພື່ອສະແດງຜົນ
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ReportPage;