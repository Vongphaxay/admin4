import React, { useState, useEffect, useRef } from 'react';
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
  Toolbar,
  CssBaseline,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
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
  Assessment as AssessmentIcon,
  Notifications,
  Logout
} from '@mui/icons-material';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { GetAllbooking } from '../services/report.service';

// Styled components
const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.dark,
}));

const drawerWidth = 240;

// Get admin data from cookies
const admin_name = decodeURIComponent(Cookies.get("name_owner") || "");
const accessToken = Cookies.get("accessTokena");

// Menu items array
const menuItems = [
  { icon: <Home />, label: 'ພາບລວມຄລິນິກ', path: '/owner/dashboard' },
  { icon: <People />, label: 'ຂໍ້ມູນພະນັກງານ', path: '/owner/dataemployee' },
  { icon: <People />, label: 'ຂໍ້ມູນລູກຄ້າ', path: '/owner/datacustomer' },
  { icon: <CalendarMonth />, label: 'ຂໍ້ມູນການຈອງ', path: '/owner/databooking' },
  { icon: <Pets />, label: 'ຝາກສັດລ້ຽງ', path: '/owner/petboarding' },
  { icon: <Bathtub />, label: 'ອາບນ້ຳສັດລ້ຽງ', path: '/owner/bathpet' },
  { icon: <ContentCut />, label: 'ຕັດຂົນສັດລ້ຽງ', path: '/owner/petbar' },
  { icon: <Vaccines />, label: 'ປິ່ນປົວສັດລ້ຽງ', path: '/owner/treatpet' },
  { icon: <AssessmentIcon />, label: 'ລາຍງານ', path: '/owner/report', active: true },
  { icon: <AssessmentIcon />, label: 'ເພີ່ມກົງສັດລ້ຽງ', path: '/owner/InsertCages' },
];

// Main component
const ReportPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportType, setReportType] = useState('bookings'); // Changed default to bookings
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bookingData, setBookingData] = useState([]);
  const [openPrintDialog, setOpenPrintDialog] = useState(false);
  
  // Reference for the printable content
  const printComponentRef = useRef();

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
    
    // Reset report data when changing report type
    setReportData(null);
  };

  // Fetch booking data
  useEffect(() => {
    if (reportType === 'bookings') {
      const fetchBookingData = async () => {
        try {
          const response = await GetAllbooking(accessToken);
          if (response && response.report) {
            const flatBookings = [];
            response.report.forEach((room) => {
              if (room.tb_bookings) {
                room.tb_bookings.forEach((booking) => {
                  flatBookings.push({
                    id: booking.book_id,
                    roomName: room.room_name,
                    roomId: room.room_id,
                    price: room.price,
                    status: room.status,
                    start_date: booking.start_date,
                    stop_date: booking.stop_date,
                    total: booking.total,
                    petName: booking.pet?.pet_name || "",
                    customerName: booking.cu?.cus_name || "",
                    service: room.room_name || "",
                    pet: {
                      id: booking.pet?.pet_id,
                      type: booking.pet?.pet_type,
                      gender: booking.pet?.gender,
                      size: booking.pet?.size,
                    },
                    customer: {
                      id: booking.cu?.cus_id,
                      phone: booking.cu?.tel,
                      address: booking.cu?.address,
                    },
                    services: {
                      id: booking.service?.service_id,
                      name: booking.service?.service_name
                    }
                  });
                });
              }
            });
            setBookingData(flatBookings);
          }
        } catch (error) {
          console.error('Error fetching bookings:', error);
        }
      };

      fetchBookingData();
    }
  }, [reportType, accessToken]);

  const generateReport = () => {
    // Logic to generate report based on selected parameters
    setIsLoading(true);
    console.log('Generating report', { startDate, endDate, reportType });

    // For booking report, filter by date if dates are selected
    if (reportType === 'bookings') {
      let filteredBookings = [...bookingData];
      
      if (startDate && endDate) {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        
        filteredBookings = bookingData.filter(booking => {
          const bookingStartDate = new Date(booking.start_date).getTime();
          return bookingStartDate >= start && bookingStartDate <= end;
        });
      }
      
      setReportData({
        type: reportType,
        generatedAt: new Date().toLocaleString(),
        data: filteredBookings
      });
      
      setIsLoading(false);
      return;
    }

    // For other report types
    setTimeout(() => {
      setIsLoading(false);
      // Mock data for other report types
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

  const handleLogout = () => {
    Cookies.remove("name_admin");
    Cookies.remove("cus_ida");
    Cookies.remove("accessTokena");
    Cookies.remove("rolea");

    Cookies.remove("accessToken");
    Cookies.remove("cus_id");
    Cookies.remove("name");
    navigate('/');
    window.location.reload(); // Force reload
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Handle printing functionality
  const handlePrint = () => {
    const printContent = document.getElementById('printable-report');
    const originalContents = document.body.innerHTML;
    
    document.body.innerHTML = printContent.innerHTML;
    
    window.print();
    
    document.body.innerHTML = originalContents;
    setOpenPrintDialog(false);
    
    // Reload the page to restore React app state
    window.location.reload();
  };

  // Render Booking Report Table
  const renderBookingReport = () => {
    if (!reportData || !reportData.data || reportData.data.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body1" color="text.secondary">
            ບໍ່ພົບຂໍ້ມູນການຈອງໃນຊ່ວງເວລາທີ່ກຳນົດ
          </Typography>
        </Box>
      );
    }

    return (
      <TableContainer component={Paper} sx={{ boxShadow: 2, mt: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#e3f2fd' }}>
            <TableRow>
              <TableCell>ຊື່ສັດລ້ຽງ</TableCell>
              <TableCell>ຊື່ເຈົ້າຂອງ</TableCell>
              <TableCell>ບໍລິການ</TableCell>
              <TableCell>ກົງທີຈອງ</TableCell>
              <TableCell>ວັນທີເລີ່ມ</TableCell>
              <TableCell>ວັນທີສິ້ນສຸດ</TableCell>
              <TableCell>ລາຄາ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.data.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.petName}</TableCell>
                <TableCell>{booking.customerName}</TableCell>
                <TableCell>{booking.services?.name || ''}</TableCell>
                <TableCell>{booking.service}</TableCell>
                <TableCell>{booking.start_date}</TableCell>
                <TableCell>{booking.stop_date}</TableCell>
                <TableCell>{booking.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Render summary statistics for booking report
  const renderBookingSummary = () => {
    if (!reportData || !reportData.data || reportData.data.length === 0) {
      return null;
    }

    // Calculate total amount
    const totalAmount = reportData.data.reduce((sum, booking) => sum + Number(booking.total), 0);
    
    // Calculate count by service type
    const serviceCount = {};
    reportData.data.forEach(booking => {
      const service = booking.services?.name || 'ບໍ່ລະບຸ';
      serviceCount[service] = (serviceCount[service] || 0) + 1;
    });

    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">ສະຫຼຸບລາຍງານການຈອງ</Typography>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, bgcolor: '#e3f2fd', height: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary">ຈຳນວນການຈອງທັງໝົດ</Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">{reportData.data.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, bgcolor: '#e8f5e9', height: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary">ຍອດເງິນລວມ</Typography>
              <Typography variant="h5" color="success.main" fontWeight="bold">{totalAmount.toLocaleString()} ກີບ</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, bgcolor: '#fff8e1', height: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary">ບໍລິການທີ່ນິຍົມ</Typography>
              <Typography variant="h5" color="warning.main" fontWeight="bold">
                {Object.entries(serviceCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'ບໍ່ມີຂໍ້ມູນ'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>ການຈອງແບ່ງຕາມບໍລິການ</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ບໍລິການ</TableCell>
                  <TableCell align="right">ຈຳນວນ</TableCell>
                  <TableCell align="right">ເປີເຊັນ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(serviceCount).map(([service, count]) => (
                  <TableRow key={service}>
                    <TableCell>{service}</TableCell>
                    <TableCell align="right">{count}</TableCell>
                    <TableCell align="right">
                      {((count / reportData.data.length) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    );
  };

  // Printable component
  const PrintableReport = () => {
    const currentDate = new Date().toLocaleDateString('lo-LA');
    
    return (
      <div id="printable-report" style={{ padding: '20px', backgroundColor: 'white', width: '100%' }}>
        {/* Report Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontWeight: 'bold', color: '#1976d2', marginBottom: '8px' }}>
            DR. P VETERINARY
          </h2>
          <h3 style={{ color: '#1976d2', marginBottom: '8px' }}>
            ລາຍງານການຈອງໃຊ້ບໍລິການ
          </h3>
          {startDate && endDate && (
            <p style={{ marginBottom: '8px' }}>
              ຊ່ວງເວລາ: {new Date(startDate).toLocaleDateString('lo-LA')} - {new Date(endDate).toLocaleDateString('lo-LA')}
            </p>
          )}
          <p style={{ color: '#666' }}>
            ວັນທີພິມ: {currentDate}
          </p>
        </div>
        
        {/* Report Content */}
        {reportData && reportData.data && reportData.data.length > 0 ? (
          <>
            {/* Booking summary */}
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ color: '#1976d2', marginBottom: '15px' }}>ສະຫຼຸບລາຍງານການຈອງ</h4>
              
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div style={{ flex: 1, padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>ຈຳນວນການຈອງທັງໝົດ</p>
                  <h3 style={{ color: '#1976d2', fontWeight: 'bold', margin: 0 }}>{reportData.data.length}</h3>
                </div>
                <div style={{ flex: 1, padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>ຍອດເງິນລວມ</p>
                  <h3 style={{ color: '#4caf50', fontWeight: 'bold', margin: 0 }}>
                    {reportData.data.reduce((sum, booking) => sum + Number(booking.total), 0).toLocaleString()} ກີບ
                  </h3>
                </div>
                <div style={{ flex: 1, padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>ບໍລິການທີ່ນິຍົມ</p>
                  {(() => {
                    const serviceCount = {};
                    reportData.data.forEach(booking => {
                      const service = booking.services?.name || 'ບໍ່ລະບຸ';
                      serviceCount[service] = (serviceCount[service] || 0) + 1;
                    });
                    const popularService = Object.entries(serviceCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'ບໍ່ມີຂໍ້ມູນ';
                    return (
                      <h3 style={{ color: '#ff9800', fontWeight: 'bold', margin: 0 }}>
                        {popularService}
                      </h3>
                    );
                  })()}
                </div>
              </div>
              
              <h5 style={{ marginBottom: '10px' }}>ການຈອງແບ່ງຕາມບໍລິການ</h5>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ບໍລິການ</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>ຈຳນວນ</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>ເປີເຊັນ</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const serviceCount = {};
                    reportData.data.forEach(booking => {
                      const service = booking.services?.name || 'ບໍ່ລະບຸ';
                      serviceCount[service] = (serviceCount[service] || 0) + 1;
                    });
                    return Object.entries(serviceCount).map(([service, count]) => (
                      <tr key={service}>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{service}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>{count}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>
                          {((count / reportData.data.length) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
            
            {/* Booking detail table */}
            <h4 style={{ color: '#1976d2', marginBottom: '15px' }}>ລາຍລະອຽດການຈອງ</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ຊື່ສັດລ້ຽງ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ຊື່ເຈົ້າຂອງ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ບໍລິການ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ກົງທີຈອງ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ວັນທີເລີ່ມ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ວັນທີສິ້ນສຸດ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ລາຄາ</th>
                </tr>
              </thead>
              <tbody>
                {reportData.data.map((booking) => (
                  <tr key={booking.id}>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{booking.petName}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{booking.customerName}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{booking.services?.name || ''}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{booking.service}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{booking.start_date}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{booking.stop_date}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{booking.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p style={{ margin: '30px 0', textAlign: 'center' }}>
            ບໍ່ພົບຂໍ້ມູນການຈອງໃນຊ່ວງເວລາທີ່ກຳນົດ
          </p>
        )}
        
        {/* Footer */}
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <p style={{ color: '#666', fontSize: '14px' }}>
            © {new Date().getFullYear()} DR. P VETERINARY - ລາຍງານນີ້ສ້າງຂຶ້ນໂດຍລະບົບບໍລິຫານຄລິນິກສັດລ້ຽງ
          </p>
        </div>
      </div>
    );
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
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar
        position="fixed"
        color="default"
        elevation={1}
        sx={{
          width: { sm: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)` },
          ml: { sm: `${sidebarOpen ? drawerWidth : 0}px` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
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
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'bold', color: theme.palette.primary.main }}
          >
            Owner: {admin_name}
          </Typography>

          <IconButton color="inherit">
            <Notifications />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{ ml: 1 }}
          >
            ອອກຈາກລະບົບ
          </Button>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
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
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: theme.palette.primary.dark,
              color: theme.palette.primary.contrastText,
              borderRight: 'none',
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: theme.palette.primary.dark,
              color: theme.palette.primary.contrastText,
              borderRight: 'none',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              ...(sidebarOpen ? {
                width: drawerWidth,
                overflowX: 'hidden',
              } : {
                width: 0,
                overflow: 'hidden',
              }),
            },
          }}
          open={sidebarOpen}
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
          width: { sm: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          mt: 8,
          backgroundColor: '#f5f5f5',
          minHeight: '100vh'
        }}
      >
        {/* Main Content */}
        <Container maxWidth="xl">
          {/* Page Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" color="primary">ລາຍງານ</Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              ເບິ່ງລາຍງານປະເພດຕ່າງໆ ແລະ ສະຖິຕິສໍາລັບການຕັດສິນໃຈ
            </Typography>
          </Box>

          <Paper sx={{ width: '100%', p: 3, borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
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
                  <IconButton 
                    color="primary" 
                    aria-label="download report" 
                    disabled={!reportData || isLoading}
                  >
                    <DownloadIcon />
                  </IconButton>
                  <IconButton 
                    color="primary" 
                    aria-label="print report" 
                    disabled={!reportData || isLoading}
                    onClick={() => setOpenPrintDialog(true)}
                  >
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
                  
                  {/* Report Content Based on Type */}
                  {reportType === 'bookings' ? (
                    <>
                      {renderBookingReport()}
                      {renderBookingSummary()}
                    </>
                  ) : (
                    <Box sx={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Paper sx={{ p: 3, width: '100%', textAlign: 'center' }}>
                        <Typography>ຕາລາງຂໍ້ມູນລາຍງານຈະສະແດງຢູ່ບ່ອນນີ້</Typography>
                      </Paper>
                    </Box>
                  )}
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
        </Container>
      </Box>
      
      {/* Print Dialog */}
      <Dialog
        open={openPrintDialog}
        onClose={() => setOpenPrintDialog(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            minHeight: { xs: 'auto', sm: '90vh', md: '90vh' },
            maxHeight: { xs: '95vh', sm: '90vh', md: '90vh' },
            width: { xs: '95%', sm: '90%', md: '90%' }
          }
        }}
      >
        <DialogTitle sx={{
          fontWeight: 'bold',
          bgcolor: theme.palette.primary.main,
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
          py: 1.75
        }}>
          <Box>ພິມລາຍງານ</Box>
          <IconButton onClick={() => setOpenPrintDialog(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, overflow: 'auto' }}>
          <PrintableReport ref={printComponentRef} />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setOpenPrintDialog(false)}
            variant="outlined"
            color="error"
            startIcon={<Close />}
            size="medium"
            sx={{ px: 2, py: 0.75 }}
          >
            ຍົກເລີກ
          </Button>
          <Button
            onClick={handlePrint}
            variant="contained"
            color="primary"
            startIcon={<PrintIcon />}
            size="medium"
            sx={{ px: 2, py: 0.75 }}
          >
            ພິມລາຍງານ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportPage;