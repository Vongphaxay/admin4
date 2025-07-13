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
import * as XLSX from 'xlsx';

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

  // Helper function to check if there's data to print
  const hasDataToPrint = () => {
    // ถ้าไม่มี reportData เลยให้ return false
    if (!reportData) return false;

    // ตรวจสอบแต่ละประเภทรายงาน
    switch (reportType) {
      case 'service_type':
        return typeofservice && typeofservice.length > 0;

      case 'services':
        return report_sercive && report_sercive.length > 0;

      case 'animals':
        return reportroom_pet && reportroom_pet.length > 0;

      case 'bookings':
        // สำหรับ bookings ให้ตรวจสอบทั้ง reportbook และ bookingData
        return (reportbook && reportbook.length > 0) ||
          (bookingData && bookingData.length > 0) ||
          (reportData.data && reportData.data.length > 0);

      case 'grooming':
        return reportcut && reportcut.length > 0;

      case 'treatment':
        return reporthelp && reporthelp.length > 0;

      case 'daily_income':
        return reportdaily && reportdaily.filter(item => item.pay_id !== null).length > 0;

      case 'payments':
        return reportpayment && reportpayment.filter(item => item.pay_id !== null).length > 0;

      default:
        return false;
    }
  };

  const handleDownload = () => {
    if (!reportData || !reportData.data || reportData.data.length === 0) {
      alert(`ບໍ່ມີຂໍ້ມູນເພື່ອດາວໂຫຼດສຳລັບລາຍງານ: ${getReportTypeName(reportType)}`);
      return;
    }

    let dataToExport = [];
    let worksheetName = 'Report';
    let fileName = `Report_${reportType}_${new Date().toISOString().slice(0, 10)}.xlsx`;

    switch (reportType) {
      case 'service_type':
        worksheetName = 'Service_Types';
        dataToExport = typeofservice.map(item => ({ 'ID': item.cat_id, 'Name': item.cat_name }));
        break;
      case 'services':
        worksheetName = 'Services';
        dataToExport = report_sercive.map(item => ({ 'Service Name': item.service?.service_name || 'N/A', 'Start Date': item.start_date, 'Stop Date': item.stop_date, 'Total': item.total }));
        break;
      case 'animals':
        worksheetName = 'Animals';
        dataToExport = reportroom_pet.map(item => ({ 'Room Name': item.room?.room_name || 'ບໍ່ລະບຸ', 'Status': item.room?.status, 'Price': item.room?.price || 0, 'Start Date': item.start_date, 'Stop Date': item.stop_date }));
        break;
      case 'bookings':
        worksheetName = 'Bookings';
        dataToExport = reportbook.map(item => {
          const serviceName = item.service?.service_name;
          const treatmentDescriptions = item.tb_service_infos?.map(info => info.description).filter(Boolean).join(', ');
          
          let fullService;
          if (serviceName && serviceName !== 'N/A') {
            fullService = serviceName;
            if (treatmentDescriptions) {
              fullService += ` (${treatmentDescriptions})`;
            }
          } else {
            if (treatmentDescriptions) {
              fullService = `(${treatmentDescriptions})`;
            } else {
              fullService = 'N/A';
            }
          }

          return {
            'Customer': item.cu?.cus_name || 'N/A',
            'Pet': `${item.pet?.pet_name} (${item.pet?.pet_type})`,
            'Service': fullService,
            'Start Date': item.start_date,
            'Stop Date': item.stop_date,
            'Base Cost': parseInt(item.total),
            'Treatment Cost': item.tb_service_infos?.reduce((sum, info) => sum + parseInt(info.price || 0), 0) || 0,
            'Total Cost': parseInt(item.total) + (item.tb_service_infos?.reduce((sum, info) => sum + parseInt(info.price || 0), 0) || 0)
          };
        });
        break;
      case 'grooming':
        worksheetName = 'Grooming';
        dataToExport = reportcut.map(item => ({ 'Service Name': item.service?.service_name || 'N/A', 'Start Date': item.start_date, 'Stop Date': item.stop_date, 'Total': item.total }));
        break;
      case 'treatment':
        worksheetName = 'Treatment';
        dataToExport = reporthelp.map(item => ({
          'Service Name': item.service?.service_name || 'N/A',
          'Start Date': item.start_date,
          'Stop Date': item.stop_date,
          'Base Cost': parseInt(item.total),
          'Additional Cost': item.tb_service_infos?.reduce((sum, info) => sum + parseInt(info.price || 0), 0) || 0,
          'Total Cost': parseInt(item.total) + (item.tb_service_infos?.reduce((sum, info) => sum + parseInt(info.price || 0), 0) || 0)
        }));
        break;
      case 'daily_income':
        worksheetName = 'Daily_Income';
        dataToExport = reportdaily.filter(item => item.pay_id !== null).map(item => ({ 'Service Name': item.service?.service_name || 'N/A', 'Start Date': item.start_date, 'Stop Date': item.stop_date, 'Income': item.total }));
        break;
      case 'payments':
        worksheetName = 'Payments';
        dataToExport = reportpayment.filter(item => item.pay_id !== null).map(item => ({ 'Service Name': item.service?.service_name || 'N/A', 'Payment Date': item.pay?.pay_date || '-', 'Amount': item.total, 'Booking ID': item.book_id }));
        break;
      default:
        return;
    }

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, worksheetName);
    XLSX.writeFile(wb, fileName);
  };

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
    setIsLoading(true);

    const formattedStartDate = startDate ? formatDateToYMD(startDate) : null;
    const formattedEndDate = endDate ? formatDateToYMD(endDate) : null;

    let typeofservice_param = ''
    let report_sercive_param = ''
    let reportroom_pet_param = ''
    let reportbook_param = ''
    let reportcut_param = ''
    let reporthelp_param = ''
    let reportdaily_param = ''
    let reportpayment_param = ''

    try {
      if (reportType === 'service_type') {
        console.log('Generating service_type report');
        typeofservice_param = 'All'
        const response = await ReportAll(startDate, endDate, typeofservice_param, report_sercive_param, reportroom_pet_param, reportbook_param, reportcut_param, reporthelp_param, reportdaily_param, reportpayment_param);
        console.log('service_type response:', response);

        const flattypedata = []
        if (response && response.report) {
          response.report.forEach(item => {
            flattypedata.push({
              cat_id: item.cat_id,
              cat_name: item.cat_name,
            })
          })
        }
        settypeofservice(flattypedata)
        console.log('flattypedata:', flattypedata);

        // ตั้งค่า reportData
        setReportData({
          type: reportType,
          generatedAt: new Date().toLocaleString(),
          data: flattypedata
        });

      } else if (reportType === 'services') {
        console.log('Generating services report');
        report_sercive_param = 'All'
        const response = await ReportAll(startDate, endDate, typeofservice_param, report_sercive_param, reportroom_pet_param, reportbook_param, reportcut_param, reporthelp_param, reportdaily_param, reportpayment_param);
        console.log('services response:', response);

        setreport_sercive(response.report || [])

        setReportData({
          type: reportType,
          generatedAt: new Date().toLocaleString(),
          data: response.report || []
        });

      } else if (reportType === 'animals') {
        console.log('Generating animals report');
        reportroom_pet_param = 'All';
        const response = await ReportAll(startDate, endDate, typeofservice_param, report_sercive_param, reportroom_pet_param, reportbook_param, reportcut_param, reporthelp_param, reportdaily_param, reportpayment_param);
        console.log('animals response:', response);

        setreportroom_pet(response.report || []);

        setReportData({
          type: reportType,
          generatedAt: new Date().toLocaleString(),
          data: response.report || []
        });

      } else if (reportType === 'bookings') {
        console.log('Generating bookings report');
        reportbook_param = 'All'
        const response = await ReportAll(startDate, endDate, typeofservice_param, report_sercive_param, reportroom_pet_param, reportbook_param, reportcut_param, reporthelp_param, reportdaily_param, reportpayment_param);
        console.log('bookings response:', response);

        setreportbook(response.report || [])

        // สำหรับ bookings ให้ใช้ logic เดิมด้วย
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
          data: filteredBookings.length > 0 ? filteredBookings : (response.report || [])
        });

      } else if (reportType === 'grooming') {
        console.log('Generating grooming report');
        reportcut_param = 'All'
        const response = await ReportAll(startDate, endDate, typeofservice_param, report_sercive_param, reportroom_pet_param, reportbook_param, reportcut_param, reporthelp_param, reportdaily_param, reportpayment_param);
        console.log('grooming response:', response);

        setreportcut(response.report || [])

        setReportData({
          type: reportType,
          generatedAt: new Date().toLocaleString(),
          data: response.report || []
        });

      } else if (reportType === 'treatment') {
        console.log('Generating treatment report');
        reporthelp_param = 'All'
        const response = await ReportAll(startDate, endDate, typeofservice_param, report_sercive_param, reportroom_pet_param, reportbook_param, reportcut_param, reporthelp_param, reportdaily_param, reportpayment_param);
        console.log('treatment response:', response);

        setreporthelp(response.report || [])

        setReportData({
          type: reportType,
          generatedAt: new Date().toLocaleString(),
          data: response.report || []
        });

      } else if (reportType === 'daily_income') {
        console.log('Generating daily_income report');
        reportdaily_param = 'All'
        const response = await ReportAll(startDate, endDate, typeofservice_param, report_sercive_param, reportroom_pet_param, reportbook_param, reportcut_param, reporthelp_param, reportdaily_param, reportpayment_param);
        console.log('daily_income response:', response);

        setreportdaily(response.report || [])

        setReportData({
          type: reportType,
          generatedAt: new Date().toLocaleString(),
          data: response.report || []
        });

      } else if (reportType === 'payments') {
        console.log('Generating payments report');
        reportpayment_param = 'All'
        const response = await ReportAll(startDate, endDate, typeofservice_param, report_sercive_param, reportroom_pet_param, reportbook_param, reportcut_param, reporthelp_param, reportdaily_param, reportpayment_param);
        console.log('payments response:', response);

        setreportpayment(response.report || [])

        setReportData({
          type: reportType,
          generatedAt: new Date().toLocaleString(),
          data: response.report || []
        });

      } else {
        console.log('Invalid report type');
        setReportData({
          type: reportType,
          generatedAt: new Date().toLocaleString(),
          data: []
        });
      }
    } catch (error) {
      console.error('Error generating report:', error);
      setReportData({
        type: reportType,
        generatedAt: new Date().toLocaleString(),
        data: []
      });
    } finally {
      setIsLoading(false);
    }
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
    // Debug: แสดงสถานะของข้อมูลแต่ละประเภท
    console.log('=== Debug Print Data ===');
    console.log('Report Type:', reportType);
    console.log('reportData:', reportData);
    console.log('typeofservice:', typeofservice);
    console.log('report_sercive:', report_sercive);
    console.log('reportroom_pet:', reportroom_pet);
    console.log('reportbook:', reportbook);
    console.log('reportcut:', reportcut);
    console.log('reporthelp:', reporthelp);
    console.log('reportdaily:', reportdaily);
    console.log('reportpayment:', reportpayment);
    console.log('hasDataToPrint():', hasDataToPrint());
    console.log('========================');

    // Check if there's data to print
    const hasData = hasDataToPrint();

    if (!hasData) {
      // แสดง alert ที่ระบุประเภทรายงานที่ไม่มีข้อมูล
      alert(`ບໍ່ມີຂໍ້ມູນເພື່ອພິມສຳລັບລາຍງານ: ${getReportTypeName(reportType)}`);
      return;
    }

    const printContent = document.getElementById('printable-report');
    if (!printContent) {
      alert('ບໍ່ສາມາດຊອກຫາເນື້ອຫາທີ່ຈະພິມໄດ້');
      return;
    }

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
      <html>
        <head>
          <title>ລາຍງານ - DR. P VETERINARY</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            h2, h3, h4 { color: #1976d2; }
            @media print {
              body { margin: 0; padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    } else {
      // Fallback to original method if popup is blocked
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
    }

    setOpenPrintDialog(false);
  };

  const getReportTypeName = (type) => {
    const names = {
      'service_type': 'ລາຍງານປະເພດບໍລິການ',
      'services': 'ລາຍງານບໍລິການ',
      'animals': 'ລາຍງານກົງສັດ',
      'bookings': 'ລາຍງານການຈອງໃຊ້ບໍລິການ',
      'grooming': 'ລາຍງານຈຳນວນສັດຕັດຂົນທັງໝົດ',
      'treatment': 'ລາຍງານຈຳນວນສັດປິ່ນປົວທັງໝົດ',
      'daily_income': 'ລາຍງານລາຍຮັບປະຈຳວັນ',
      'payments': 'ລາຍງານການຊຳລະເງິນ'
    };
    return names[type] || type;
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
  // ແທນທີ່ຟັງຊັນ PrintableReport ທີ່ມີຢູ່ດ້ວຍໂຄດນີ້

  const PrintableReport = () => {
    const currentDate = new Date().toLocaleDateString('lo-LA');

    return (
      <div id="printable-report" style={{ padding: '20px', backgroundColor: 'white', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontWeight: 'bold', color: '#1976d2', marginBottom: '8px' }}>
            DR. P VETERINARY
          </h2>
          <h3 style={{ color: '#1976d2', marginBottom: '8px' }}>
            {reportType === 'service_type' && 'ລາຍງານປະເພດບໍລິການ'}
            {reportType === 'services' && 'ລາຍງານບໍລິການ'}
            {reportType === 'animals' && 'ລາຍງານກົງສັດ'}
            {reportType === 'bookings' && 'ລາຍງານການຈອງໃຊ້ບໍລິການ'}
            {reportType === 'grooming' && 'ລາຍງານຈຳນວນສັດຕັດຂົນທັງໝົດ'}
            {reportType === 'treatment' && 'ລາຍງານຈຳນວນສັດປິ່ນປົວທັງໝົດ'}
            {reportType === 'daily_income' && 'ລາຍງານລາຍຮັບປະຈຳວັນ'}
            {reportType === 'payments' && 'ລາຍງານການຊຳລະເງິນ'}
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

        {/* Service Type Report */}
        {reportType === 'service_type' && typeofservice.length > 0 && (
          <div>
            <h4 style={{ color: '#1976d2', marginBottom: '15px' }}>ລາຍການປະເພດບໍລິການ</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ລຳດັບ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ຊື່ປະເພດບໍລິການ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
                </tr>
              </thead>
              <tbody>
                {typeofservice.map((item, index) => (
                  <tr key={item.cat_id}>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{index + 1}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.cat_name}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.cat_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ marginTop: '15px', textAlign: 'center', fontWeight: 'bold' }}>
              ຈຳນວນປະເພດບໍລິການທັງໝົດ: {typeofservice.length} ປະເພດ
            </p>
          </div>
        )}

        {/* Services Report */}
        {reportType === 'services' && report_sercive.length > 0 && (
          <div>
            <h4 style={{ color: '#1976d2', marginBottom: '15px' }}>ລາຍການບໍລິການ</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ລຳດັບ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ຊື່ບໍລິການ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ວັນເລີ່ມ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ວັນສິ້ນສຸດ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ລາຄາລວມ (ກີບ)</th>
                </tr>
              </thead>
              <tbody>
                {report_sercive.map((item, index) => (
                  <tr key={item.book_id}>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{index + 1}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.service?.service_name || 'N/A'}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.start_date}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.stop_date}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{parseInt(item.total).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ marginTop: '15px', textAlign: 'center', fontWeight: 'bold' }}>
              ລາຍຮັບລວມ: {report_sercive.reduce((sum, item) => sum + parseInt(item.total), 0).toLocaleString()} ກີບ
            </p>
          </div>
        )}

        {/* Animals Report */}
        {reportType === 'animals' && reportroom_pet.length > 0 && (
          <div>
            <h4 style={{ color: '#1976d2', marginBottom: '15px' }}>ລາຍງານກົງສັດ</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ລຳດັບ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ຊື່ຫ້ອງ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ສະຖານະ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ລາຄາ (ກີບ)</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ວັນເລີ່ມ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ວັນສິ້ນສຸດ</th>
                </tr>
              </thead>
              <tbody>
                {reportroom_pet.map((item, index) => (
                  <tr key={item.book_id}>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{index + 1}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.room?.room_name || 'ບໍ່ລະບຸ'}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.room?.status}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{parseInt(item.room?.price || 0).toLocaleString()}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.start_date}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.stop_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Bookings Report */}
        {reportType === 'bookings' && reportbook.length > 0 && (
          <div>
            <h4 style={{ color: '#1976d2', marginBottom: '15px' }}>ລາຍງານການຈອງ</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ລຳດັບ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ລູກຄ້າ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ສັດລ້ຽງ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ບໍລິການ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ວັນເລີ່ມ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ວັນສິ້ນສຸດ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ລາຄາພື້ນຖານ (ກີບ)</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ຄ່າປິ່ນປົວ (ກີບ)</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ລວມ (ກີບ)</th>
                </tr>
              </thead>
              <tbody>
                {reportbook.map((item, index) => {
                  // ຄິດໄລ່ຄ່າປິ່ນປົວເພີ່ມເຕີມ
                  const treatmentCost = item.tb_service_infos?.reduce((sum, info) => sum + parseInt(info.price || 0), 0) || 0;
                  const baseCost = parseInt(item.total);
                  const totalCost = baseCost + treatmentCost;
                  const hasTreatment = item.tb_service_infos && item.tb_service_infos.length > 0;

                  return (
                    <React.Fragment key={item.book_id}>
                      <tr>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{index + 1}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.cu?.cus_name || 'N/A'}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                          {item.pet?.pet_name} ({item.pet?.pet_type})
                          <br />
                          <small style={{ color: '#666' }}>
                            ເພດ: {item.pet?.gender}, ຂະໜາດ: {item.pet?.size}
                          </small>
                        </td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                          {item.service?.service_name || 'N/A'}
                          {hasTreatment && (
                            <>
                              <br />
                              <small style={{ color: '#2e7d32', fontWeight: 'bold' }}>
                                📋 ມີລາຍລະອຽດການປິ່ນປົວ
                              </small>
                            </>
                          )}
                        </td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.start_date}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.stop_date}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{baseCost.toLocaleString()}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                          {treatmentCost > 0 ? treatmentCost.toLocaleString() : '-'}
                        </td>
                        <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>
                          {totalCost.toLocaleString()}
                        </td>
                      </tr>

                      {/* ສະແດງລາຍລະອຽດການປິ່ນປົວຖ້າມີ */}
                      {hasTreatment && (
                        <tr>
                          <td colSpan="9" style={{ padding: '12px', border: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>
                            <div style={{ marginLeft: '20px' }}>
                              <h5 style={{ color: '#1976d2', margin: '0 0 8px 0', fontSize: '14px' }}>
                                🏥 ລາຍລະອຽດການປິ່ນປົວ:
                              </h5>
                              {item.tb_service_infos.map((info, infoIndex) => (
                                <div key={info.info_id} style={{
                                  marginBottom: '8px',
                                  padding: '8px',
                                  backgroundColor: '#fff',
                                  border: '1px solid #e0e0e0',
                                  borderRadius: '4px'
                                }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                      <strong style={{ color: '#1976d2' }}>
                                        ການປິ່ນປົວຄັ້ງທີ່ {infoIndex + 1}:
                                      </strong>
                                      <br />
                                      <span style={{ color: '#333' }}>
                                        {info.description || 'ບໍ່ມີລາຍລະອຽດ'}
                                      </span>
                                      {info.doc?.doc_name && (
                                        <>
                                          <br />
                                          <small style={{ color: '#666' }}>
                                            👨‍⚕️ ທ່ານໝໍ: {info.doc.doc_name}
                                          </small>
                                        </>
                                      )}
                                    </div>
                                    <div style={{
                                      backgroundColor: '#e8f5e9',
                                      padding: '4px 8px',
                                      borderRadius: '4px',
                                      minWidth: '80px',
                                      textAlign: 'right'
                                    }}>
                                      <strong style={{ color: '#2e7d32' }}>
                                        {parseInt(info.price).toLocaleString()} ກີບ
                                      </strong>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>

            {/* ສະຫຼຸບລາຍງານ */}
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              <h5 style={{ color: '#1976d2', margin: '0 0 10px 0' }}>📊 ສະຫຼຸບລາຍງານການຈອງ:</h5>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                  <strong>ຈຳນວນການຈອງທັງໝົດ:</strong> {reportbook.length} ລາຍການ
                </div>
                <div>
                  <strong>ການຈອງທີ່ມີການປິ່ນປົວ:</strong> {reportbook.filter(item => item.tb_service_infos && item.tb_service_infos.length > 0).length} ລາຍການ
                </div>
              </div>
              <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                  <strong>ລາຍຮັບຈາກບໍລິການພື້ນຖານ:</strong> {reportbook.reduce((sum, item) => sum + parseInt(item.total), 0).toLocaleString()} ກີບ
                </div>
                <div>
                  <strong>ລາຍຮັບຈາກການປິ່ນປົວ:</strong> {reportbook.reduce((sum, item) => {
                    const treatmentCost = item.tb_service_infos?.reduce((sum, info) => sum + parseInt(info.price || 0), 0) || 0;
                    return sum + treatmentCost;
                  }, 0).toLocaleString()} ກີບ
                </div>
              </div>
              <div style={{ marginTop: '10px', fontSize: '16px', fontWeight: 'bold' }}>
                <strong style={{ color: '#1976d2' }}>ລາຍຮັບລວມທັງໝົດ:</strong> {reportbook.reduce((sum, item) => {
                  const treatmentCost = item.tb_service_infos?.reduce((sum, info) => sum + parseInt(info.price || 0), 0) || 0;
                  return sum + parseInt(item.total) + treatmentCost;
                }, 0).toLocaleString()} ກີບ
              </div>
            </div>
          </div>
        )}

        {/* ຫຼື ຖ້າໃຊ້ bookingData ແທນ reportbook (ສຳລັບກໍລະນີທີ່ reportbook ວ່າງ) */}
        {reportType === 'bookings' && reportbook.length === 0 && bookingData && bookingData.length > 0 && (
          <div>
            <h4 style={{ color: '#1976d2', marginBottom: '15px' }}>ລາຍງານການຈອງ</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ລຳດັບ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ລູກຄ້າ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ສັດລ້ຽງ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ບໍລິການ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ວັນເລີ່ມ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ວັນສິ້ນສຸດ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ລາຄາ (ກີບ)</th>
                </tr>
              </thead>
              <tbody>
                {bookingData.map((item, index) => (
                  <tr key={item.id}>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{index + 1}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.customerName}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      {item.petName}
                      {item.pet?.type && ` (${item.pet.type})`}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.services?.name || item.service}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.start_date}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.stop_date}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{parseInt(item.total).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ marginTop: '15px', textAlign: 'center', fontWeight: 'bold' }}>
              ຈຳນວນການຈອງທັງໝົດ: {bookingData.length} ລາຍການ | ລາຍຮັບລວມ: {bookingData.reduce((sum, item) => sum + parseInt(item.total), 0).toLocaleString()} ກີບ
            </p>
          </div>
        )}

        {/* Grooming Report */}
        {reportType === 'grooming' && reportcut.length > 0 && (
          <div>
            <h4 style={{ color: '#1976d2', marginBottom: '15px' }}>ລາຍງານການຕັດຂົນສັດ</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ລຳດັບ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ຊື່ບໍລິການ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ວັນເລີ່ມ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ວັນສິ້ນສຸດ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ລາຄາ (ກີບ)</th>
                </tr>
              </thead>
              <tbody>
                {reportcut.map((item, index) => (
                  <tr key={item.book_id}>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{index + 1}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.service?.service_name || 'N/A'}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.start_date}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.stop_date}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{parseInt(item.total).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ marginTop: '15px', textAlign: 'center', fontWeight: 'bold' }}>
              ຈຳນວນທັງໝົດ: {reportcut.length} ຄັ້ງ | ລາຍຮັບລວມ: {reportcut.reduce((sum, item) => sum + parseInt(item.total), 0).toLocaleString()} ກີບ
            </p>
          </div>
        )}

        {/* Treatment Report */}
        {reportType === 'treatment' && reporthelp.length > 0 && (
          <div>
            <h4 style={{ color: '#1976d2', marginBottom: '15px' }}>ລາຍງານການປິ່ນປົວສັດ</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ລຳດັບ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ຊື່ບໍລິການ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ວັນເລີ່ມ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ວັນສິ້ນສຸດ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ຄ່າບໍລິການພື້ນຖານ (ກີບ)</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ຄ່າປິ່ນປົວເພີ່ມ (ກີບ)</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ລວມ (ກີບ)</th>
                </tr>
              </thead>
              <tbody>
                {reporthelp.map((item, index) => {
                  const additionalCost = item.tb_service_infos?.reduce((sum, info) => sum + parseInt(info.price || 0), 0) || 0;
                  const totalCost = parseInt(item.total) + additionalCost;
                  return (
                    <tr key={item.book_id}>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{index + 1}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.service?.service_name || 'N/A'}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.start_date}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.stop_date}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{parseInt(item.total).toLocaleString()}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{additionalCost.toLocaleString()}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{totalCost.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p style={{ marginTop: '15px', textAlign: 'center', fontWeight: 'bold' }}>
              ຈຳນວນທັງໝົດ: {reporthelp.length} ຄັ້ງ | ລາຍຮັບລວມທັງໝົດ: {reporthelp.reduce((sum, item) => {
                const additionalCost = item.tb_service_infos?.reduce((sum, info) => sum + parseInt(info.price || 0), 0) || 0;
                return sum + parseInt(item.total) + additionalCost;
              }, 0).toLocaleString()} ກີບ
            </p>
          </div>
        )}

        {/* Daily Income Report */}
        {reportType === 'daily_income' && reportdaily.filter(item => item.pay_id !== null).length > 0 && (
          <div>
            <h4 style={{ color: '#1976d2', marginBottom: '15px' }}>ລາຍງານລາຍຮັບປະຈຳວັນ</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ລຳດັບ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ຊື່ບໍລິການ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ວັນເລີ່ມ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ວັນສິ້ນສຸດ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ລາຍຮັບ (ກີບ)</th>
                </tr>
              </thead>
              <tbody>
                {reportdaily.filter(item => item.pay_id !== null).map((item, index) => (
                  <tr key={item.book_id}>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{index + 1}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.service?.service_name || 'N/A'}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.start_date}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.stop_date}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{parseInt(item.total).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ marginTop: '15px', textAlign: 'center', fontWeight: 'bold' }}>
              ລາຍຮັບລວມ: {reportdaily
                .filter(item => item.pay_id !== null)
                .reduce((sum, item) => sum + parseInt(item.total), 0)
                .toLocaleString()} ກີບ
            </p>
          </div>
        )}

        {/* Payments Report */}
        {reportType === 'payments' && reportpayment.filter(item => item.pay_id !== null).length > 0 && (
          <div>
            <h4 style={{ color: '#1976d2', marginBottom: '15px' }}>ລາຍງານການຊຳລະເງິນ</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ລຳດັບ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ຊື່ບໍລິການ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ວັນຊຳລະ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ຈຳນວນເງິນ (ກີບ)</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ລະຫັດການຈອງ</th>
                </tr>
              </thead>
              <tbody>
                {reportpayment.filter(item => item.pay_id !== null).map((item, index) => (
                  <tr key={item.book_id}>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{index + 1}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.service?.service_name || 'N/A'}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.pay?.pay_date || '-'}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{parseInt(item.total).toLocaleString()}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.book_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ marginTop: '15px', textAlign: 'center', fontWeight: 'bold' }}>
              ລາຍຮັບທັງໝົດ: {reportpayment
                .filter(item => item.pay_id !== null)
                .reduce((sum, item) => sum + parseInt(item.total), 0)
                .toLocaleString()} ກີບ
            </p>
          </div>
        )}

        {/* No Data Message */}
        {((reportType === 'service_type' && typeofservice.length === 0) ||
          (reportType === 'services' && report_sercive.length === 0) ||
          (reportType === 'animals' && reportroom_pet.length === 0) ||
          (reportType === 'bookings' && reportbook.length === 0) ||
          (reportType === 'grooming' && reportcut.length === 0) ||
          (reportType === 'treatment' && reporthelp.length === 0) ||
          (reportType === 'daily_income' && reportdaily.filter(item => item.pay_id !== null).length === 0) ||
          (reportType === 'payments' && reportpayment.filter(item => item.pay_id !== null).length === 0)) && (
            <p style={{ margin: '30px 0', textAlign: 'center', fontSize: '16px', color: '#666' }}>
              ບໍ່ພົບຂໍ້ມູນໃນຊ່ວງເວລາທີ່ກຳນົດ
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
                    onClick={handleDownload}
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