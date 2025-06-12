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
  Logout,
  AddBoxRounded
} from '@mui/icons-material';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { GetAllbooking, ReportAll } from '../services/report.service';

// Create a custom styled container for the logo - ໃຊ້ແບບດຽວກັບໜ້າອື່ນ
const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2), // ປ່ຽນຈາກ theme.spacing(2) ເປັນ theme.spacing(0, 2)
  height: 64, // ເພີ່ມ height ໃຫ້ກົງກັບໜ້າອື່ນ
  backgroundColor: theme.palette.primary.dark,
}));

const drawerWidth = 240;

// Get admin data from cookies
const admin_name = decodeURIComponent(Cookies.get("name_owner") || "");
const accessToken = Cookies.get("accessTokeno");

// Menu items array - ປັບໃຫ້ກົງກັບໜ້າອື່ນ
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
  { icon: <AddBoxRounded />, label: 'ເພີ່ມກົງສັດລ້ຽງ', path: '/owner/InsertCages' },
];

// Main component

const ReportPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportType, setReportType] = useState('bookings');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bookingData, setBookingData] = useState([]);
  const [openPrintDialog, setOpenPrintDialog] = useState(false);

  const [typeofservice, settypeofservice] = useState([]);
  const [report_sercive, setreport_sercive] = useState([]);
  const [reportroom_pet, setreportroom_pet] = useState([]);
  const [reportbook, setreportbook] = useState([]);
  const [reportcut, setreportcut] = useState([]);
  const [reporthelp, setreporthelp] = useState([]);
  const [reportdaily, setreportdaily] = useState([]);
  const [reportpayment, setreportpayment] = useState([]);

  // Reference for the printable content
  const printComponentRef = useRef();

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
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

  const formatDateToYMD = (date) => {
    const local = new Date(date);
    const yyyy = local.getFullYear();
    const mm = String(local.getMonth() + 1).padStart(2, '0');
    const dd = String(local.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  const generateReport = async () => {
    const formattedStartDate = formatDateToYMD(startDate);
    const formattedEndDate = formatDateToYMD(endDate);
    let typeofservice = ''
    let report_sercive = ''
    let reportroom_pet = ''
    let reportbook = ''
    let reportcut = ''
    let reporthelp = ''
    let reportdaily = ''
    let reportpayment = ''

    if (reportType === 'service_type') {
      console.log('Generating report', { formattedStartDate, formattedEndDate, reportType });
      typeofservice = 'All'
      const response = await ReportAll(startDate, endDate, typeofservice, report_sercive, reportroom_pet, reportbook, reportcut, reporthelp, reportdaily, reportpayment);
      // console.log('response service_type', response);
      const flattypedata = []
      response.report.forEach(item => {
        flattypedata.push({
          cat_id: item.cat_id,
          cat_name: item.cat_name,

        })
      })
      settypeofservice(flattypedata)
      console.log('flattypedata', flattypedata);
    } else if (reportType === 'services') {
      report_sercive = 'All'
      const response = await ReportAll(startDate, endDate, typeofservice, report_sercive, reportroom_pet, reportbook, reportcut, reporthelp, reportdaily, reportpayment);
      console.log('response services', response);
      setreport_sercive(response.report)
    } else if (reportType === 'animals') {
      reportroom_pet = 'All';
      const response = await ReportAll(startDate, endDate, typeofservice, report_sercive, reportroom_pet, reportbook, reportcut, reporthelp, reportdaily, reportpayment);
      console.log('response animals', response);
      setreportroom_pet(response.report);
    } else if (reportType === 'bookings') {
      reportbook = 'All'
      const response = await ReportAll(startDate, endDate, typeofservice, report_sercive, reportroom_pet, reportbook, reportcut, reporthelp, reportdaily, reportpayment);
      console.log('response reportbook', response);
      setreportbook(response.report)
    } else if (reportType === 'grooming') {
      reportcut = 'All'
      const response = await ReportAll(startDate, endDate, typeofservice, report_sercive, reportroom_pet, reportbook, reportcut, reporthelp, reportdaily, reportpayment);
      console.log('response reportcut', response);
      setreportcut(response.report)
    } else if (reportType === 'treatment') {
      reporthelp = 'All'
      const response = await ReportAll(startDate, endDate, typeofservice, report_sercive, reportroom_pet, reportbook, reportcut, reporthelp, reportdaily, reportpayment);
      console.log('response reporthelp', response);
      setreporthelp(response.report)
    } else if (reportType === 'daily_income') {
      reportdaily = 'All'
      const response = await ReportAll(startDate, endDate, typeofservice, report_sercive, reportroom_pet, reportbook, reportcut, reporthelp, reportdaily, reportpayment);
      console.log('response reportdaily', response);
      setreportdaily(response.report)
    } else if (reportType === 'payments') {
      reportpayment = 'All'
      const response = await ReportAll(startDate, endDate, typeofservice, report_sercive, reportroom_pet, reportbook, reportcut, reporthelp, reportdaily, reportpayment);
      console.log('response reportpayment', response);
      setreportpayment(response.report)
    } else {
      console.log('Invalid report type');
    }

    setIsLoading(true);
    // console.log('Generating report', { formattedStartDate, formattedEndDate, reportType });

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

    setTimeout(() => {
      setIsLoading(false);
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
    window.location.reload();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('printable-report');
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;

    window.print();

    document.body.innerHTML = originalContents;
    setOpenPrintDialog(false);

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
  };

  // Printable component
  const PrintableReport = () => {
    const currentDate = new Date().toLocaleDateString('lo-LA');

    return (
      <div id="printable-report" style={{ padding: '20px', backgroundColor: 'white', width: '100%' }}>
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

        {reportData && reportData.data && reportData.data.length > 0 ? (
          <>
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

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <p style={{ color: '#666', fontSize: '14px' }}>
            © {new Date().getFullYear()} DR. P VETERINARY - ລາຍງານນີ້ສ້າງຂຶ້ນໂດຍລະບົບບໍລິຫານຄລິນິກສັດລ້ຽງ
          </p>
        </div>
      </div>
    );
  };

  // ປັບ drawer content ໃຫ້ກົງກັບໜ້າອື່ນ
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

      {/* App Bar - ແກ້ໄຂໃຫ້ກົງກັບໜ້າອື່ນ */}
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

        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: theme.palette.primary.dark,
              color: theme.palette.primary.contrastText,
            },
          }}
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
                      {reportType === 'service_type' && (
                        <Box sx={{ mt: 2 }}>
                          {typeofservice.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                              ບໍ່ມີຂໍ້ມູນປະເພດບໍລິການ
                            </Typography>
                          ) : (
                            typeofservice.map((item, index) => (
                              <Box key={item.cat_id} sx={{ mb: 1, p: 1, border: '1px solid #ddd', borderRadius: 1 }}>
                                <Typography variant="subtitle2">#{index + 1} {item.cat_name}</Typography>
                              </Box>
                            ))
                          )}
                        </Box>
                      )}

                      {reportType === 'services' && (
                        <Box sx={{ mt: 2 }}>
                          {report_sercive.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                              ບໍ່ມີຂໍ້ມູນການບໍລິການ
                            </Typography>
                          ) : (
                            report_sercive.map((item, index) => (
                              <Box key={item.book_id} sx={{ mb: 1, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                  #{index + 1} - {item.service?.service_name || 'N/A'}
                                </Typography>
                                <Typography variant="body2">ລະຫັດການຈອງ: {item.book_id}</Typography>
                                <Typography variant="body2">ວັນເລີ່ມ: {item.start_date}</Typography>
                                <Typography variant="body2">ວັນສິ້ນສຸດ: {item.stop_date}</Typography>
                                <Typography variant="body2">ລາຄາລວມ: {parseInt(item.total).toLocaleString()} ກີບ</Typography>
                                <Typography variant="body2">ຫ້ອງເບີ: {item.room_id}</Typography>
                              </Box>
                            ))
                          )}
                        </Box>
                      )}

                      {reportType === 'animals' && (
                        <Box sx={{ mt: 2 }}>
                          {reportroom_pet.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                              ບໍ່ພົບຂໍ້ມູນກົງສັດ
                            </Typography>
                          ) : (
                            reportroom_pet.map((item, index) => (
                              <Box key={item.book_id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                  #{index + 1} - {item.room?.room_name || 'ບໍ່ລະບຸ'}
                                </Typography>
                                <Typography variant="body2">ສະຖານະຫ້ອງ: {item.room?.status}</Typography>
                                <Typography variant="body2">ລາຄາຕໍ່ຄັ້ງ: {parseInt(item.room?.price || 0).toLocaleString()} ກີບ</Typography>
                                <Typography variant="body2">ວັນເລີ່ມ: {item.start_date}</Typography>
                                <Typography variant="body2">ວັນສິ້ນສຸດ: {item.stop_date}</Typography>
                                <Typography variant="body2">ລະຫັດຈອງ: {item.book_id}</Typography>
                              </Box>
                            ))
                          )}
                        </Box>
                      )}

                      {reportType === 'bookings' && (
                        <Box sx={{ mt: 2 }}>
                          {reportbook.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                              ບໍ່ພົບຂໍ້ມູນການຈອງ
                            </Typography>
                          ) : (
                            reportbook.map((item, index) => (
                              <Box key={item.book_id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                  #{index + 1} - ລູກຄ້າ: {item.cu?.cus_name || 'N/A'}
                                </Typography>
                                <Typography variant="body2">ສັດລ້ຽງ: {item.pet?.pet_name} ({item.pet?.pet_type})</Typography>
                                <Typography variant="body2">ວັນເລີ່ມ: {item.start_date}</Typography>
                                <Typography variant="body2">ວັນສິ້ນສຸດ: {item.stop_date}</Typography>
                                <Typography variant="body2">ລາຄາລວມ: {parseInt(item.total).toLocaleString()} ກີບ</Typography>

                                {/* รายละเอียดบริการเพิ่มเติม */}
                                {item.tb_service_infos?.length > 0 && (
                                  <Box sx={{ mt: 1, pl: 2, borderLeft: '3px solid #90caf9' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                       ລາຍລະອຽດບໍລິການເພີ່ມເຕີມ:
                                    </Typography>
                                    {item.tb_service_infos.map((info) => (
                                      <Box key={info.info_id} sx={{ mb: 1 }}>
                                        <Typography variant="body2">• ຄ່າບໍລິການ: {parseInt(info.price).toLocaleString()} ກີບ</Typography>
                                        <Typography variant="body2">• ໝໍ: {info.doc?.doc_name || 'N/A'}</Typography>
                                        <Typography variant="body2">• ອະທິບາຍ: {info.description || ' - '}</Typography>
                                      </Box>
                                    ))}
                                  </Box>
                                )}
                              </Box>
                            ))
                          )}
                        </Box>
                      )}

                      {reportType === 'grooming' && (
                        <Box sx={{ mt: 2 }}>
                          {reportcut.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                              ບໍ່ພົບຂໍ້ມູນການຕັດຂົນສັດ
                            </Typography>
                          ) : (
                            <>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                                ຈຳນວນທັງໝົດ: {reportcut.length} ຄັ້ງ
                              </Typography>
                              {reportcut.map((item, index) => (
                                <Box key={item.book_id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                                  <Typography variant="subtitle2">
                                    #{index + 1} - {item.service?.service_name || 'N/A'}
                                  </Typography>
                                  <Typography variant="body2">ວັນເລີ່ມ: {item.start_date}</Typography>
                                  <Typography variant="body2">ວັນສິ້ນສຸດ: {item.stop_date}</Typography>
                                  <Typography variant="body2">ລາຄາລວມ: {parseInt(item.total).toLocaleString()} ກີບ</Typography>
                                </Box>
                              ))}
                            </>
                          )}
                        </Box>
                      )}

                      {reportType === 'treatment' && (
                        <Box sx={{ mt: 2 }}>
                          {reporthelp.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                              ບໍ່ພົບຂໍ້ມູນການປິ່ນປົວສັດ
                            </Typography>
                          ) : (
                            <>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                                 ຈຳນວນການປິ່ນປົວທັງໝົດ: {reporthelp.length} ຄັ້ງ
                              </Typography>
                              {reporthelp.map((item, index) => (
                                <Box key={item.book_id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                    #{index + 1} - {item.service?.service_name || 'N/A'}
                                  </Typography>
                                  <Typography variant="body2">ວັນເລີ່ມ: {item.start_date}</Typography>
                                  <Typography variant="body2">ວັນສິ້ນສຸດ: {item.stop_date}</Typography>
                                  <Typography variant="body2">ລາຄາລວມ: {parseInt(item.total).toLocaleString()} ກີບ</Typography>

                                  {/* บริการเสริมจากหมอ */}
                                  {item.tb_service_infos?.length > 0 && (
                                    <Box sx={{ mt: 1, pl: 2, borderLeft: '3px solid #81c784' }}>
                                      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                         ລາຍລະອຽດການປິ່ນປົວ:
                                      </Typography>
                                      {item.tb_service_infos.map((info) => (
                                        <Box key={info.info_id} sx={{ mb: 1 }}>
                                          <Typography variant="body2">• ຄ່າບໍລິການ: {parseInt(info.price).toLocaleString()} ກີບ</Typography>
                                          <Typography variant="body2">• ໝໍປະຈຳການ: {info.doc?.doc_name}</Typography>
                                          <Typography variant="body2">• ຄຳອະທິບາຍ: {info.description || '-'}</Typography>
                                        </Box>
                                      ))}
                                    </Box>
                                  )}
                                </Box>
                              ))}
                            </>
                          )}
                        </Box>
                      )}

                      {reportType === 'daily_income' && (
                        <Box sx={{ mt: 2 }}>
                          {/* กรองรายการที่จ่ายเงินแล้ว */}
                          {reportdaily.filter(item => item.pay_id !== null).length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                              ບໍ່ມີລາຍຮັບໃນວັນນີ້
                            </Typography>
                          ) : (
                            <>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                                 ຈຳນວນລາຍການທີ່ຈ່າຍແລ້ວ: {reportdaily.filter(item => item.pay_id !== null).length} ລາຍການ
                              </Typography>

                              {reportdaily
                                .filter(item => item.pay_id !== null)
                                .map((item, index) => (
                                  <Box key={item.book_id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                      #{index + 1} - {item.service?.service_name || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2">ວັນເລີ່ມ: {item.start_date}</Typography>
                                    <Typography variant="body2">ວັນສິ້ນສຸດ: {item.stop_date}</Typography>
                                    <Typography variant="body2">ລາຄາທີ່ຈ່າຍ: {parseInt(item.total).toLocaleString()} ກີບ</Typography>
                                  </Box>
                                ))}

                              {/* รวมยอดรวมทั้งหมด */}
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
                                 ລາຍຮັບລວມ:{" "}
                                {reportdaily
                                  .filter(item => item.pay_id !== null)
                                  .reduce((sum, item) => sum + parseInt(item.total), 0)
                                  .toLocaleString()} ກີບ
                              </Typography>
                            </>
                          )}
                        </Box>
                      )}

                      {reportType === 'payments' && (
                        <Box sx={{ mt: 2 }}>
                          {reportpayment.filter(item => item.pay_id !== null).length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                              ບໍ່ພົບລາຍການການຊຳລະເງິນ
                            </Typography>
                          ) : (
                            <>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                                ຈຳນວນການຊຳລະເງິນແລ້ວ: {reportpayment.filter(item => item.pay_id !== null).length} ລາຍການ
                              </Typography>

                              {reportpayment
                                .filter(item => item.pay_id !== null)
                                .map((item, index) => (
                                  <Box key={item.book_id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                      #{index + 1} - {item.service?.service_name || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2">ວັນຊຳລະ: {item.pay?.pay_date || '-'}</Typography>
                                    <Typography variant="body2">ລາຄາທີ່ຈ່າຍ: {parseInt(item.total).toLocaleString()} ກີບ</Typography>
                                    <Typography variant="body2">ລະຫັດການຈອງ: {item.book_id}</Typography>
                                  </Box>
                                ))}

                              {/* รวมยอดเงินทั้งหมด */}
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
                                ລາຍຮັບທັງໝົດ:{" "}
                                {reportpayment
                                  .filter(item => item.pay_id !== null)
                                  .reduce((sum, item) => sum + parseInt(item.total), 0)
                                  .toLocaleString()} ກີບ
                              </Typography>
                            </>
                          )}
                        </Box>
                      )}

                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ສ້າງເມື່ອ: {reportData.generatedAt}
                    </Typography>
                  </Box>

                  {/* Report Content Based on Type */}
                  {reportType === 'bookings' ? (
                    <>
                      {renderBookingReport()}
                      {/* {renderBookingSummary()} */}
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