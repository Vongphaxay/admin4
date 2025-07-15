import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, CssBaseline, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton,
    ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Grid, Button, Avatar,
    Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, useTheme, styled, Container,
    Snackbar, Alert, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import { CheckCircle, ExpandMore, Search } from '@mui/icons-material';
import {
    Edit, Delete, AddCircle, Home, Person, People, CalendarMonth, Pets, Bathtub,
    ContentCut, Vaccines, Menu, ChevronRight, Notifications, Close, Logout, Print, Assessment as AssessmentIcon, AddBoxRounded,
    LocalHospital, MedicalServices
} from '@mui/icons-material';
import Cookies from 'js-cookie';
import { GetAllbooking, UpdatePayment_roompet } from '../services/report.service';
import image from '../img/qrcode.png';
import ReceiptPrinter from './ReceiptPrinter'; // Import the ReceiptPrinter component
import { Cancel_booking } from '../services/booking.service'

// Create a custom styled container for the logo
const LogoContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
    height: 64,
    backgroundColor: theme.palette.primary.dark
}));

// Define the drawer width
const drawerWidth = 240;

// Mock data from the original code
const menuItems = [
    { icon: <Home />, label: 'ພາບລວມຄລິນິກ', path: '/owner/dashboard' },
    { icon: <People />, label: 'ຂໍ້ມູນພະນັກງານ', path: '/owner/dataemployee' },
    { icon: <People />, label: 'ຂໍ້ມູນລູກຄ້າ', path: '/owner/datacustomer' },
    { icon: <CalendarMonth />, label: 'ຂໍ້ມູນການຈອງ', path: '/owner/databooking', active: true },
    { icon: <Pets />, label: 'ຝາກສັດລ້ຽງ', path: '/owner/petboarding' },
    { icon: <Bathtub />, label: 'ອາບນ້ຳສັດລ້ຽງ', path: '/owner/bathpet' },
    { icon: <ContentCut />, label: 'ຕັດຂົນສັດລ້ຽງ', path: '/owner/petbar' },
    { icon: <Vaccines />, label: 'ປິ່ນປົວສັດລ້ຽງ', path: '/owner/treatpet' },
    { icon: <AssessmentIcon />, label: 'ລາຍງານ', path: '/owner/report' },
    { icon: <AddBoxRounded />, label: 'ເພີ່ມກົງສັດລ້ຽງ', path: '/owner/insertCages' },
];

const BookingTable = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [bookingData, setBookingData] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState(null);
    const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
    const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // Add search state
    const [currentBooking, setCurrentBooking] = useState({
        id: '',
        roomId: '',
        petName: '',
        customerName: '',
        service: '',
        services: {
            id: '',
            name: ''
        },
        start_date: '',
        stop_date: '',
        total: '',
        tb_service_infos: []
    });

    const admin_name = decodeURIComponent(Cookies.get("name_owner") || "");
    const accessToken = Cookies.get("accessTokeno");

    // Calculate total price including treatment
    const calculateTotalPrice = (booking) => {
        let basePrice = parseFloat(booking.total) || 0;

        if (booking.tb_service_infos && booking.tb_service_infos.length > 0) {
            booking.tb_service_infos.forEach(info => {
                if (info.price) {
                    basePrice += parseFloat(info.price);
                }
            });
        }

        return basePrice;
    };

    const APIUPDATERoompet_book = async (room_id, book_id) => {
        try {
            const response = await UpdatePayment_roompet(room_id, book_id, accessToken);
            console.log("Payment updated successfully", response);
        } catch (error) {
            console.error("Error updating payment:", error);
        }
    };

    useEffect(() => {
        const getAllbokapi = async () => {
            try {
                const response = await GetAllbooking(accessToken);
                const flatBookings = [];

                if (response && response.report) {
                    response.report.forEach((room) => {
                        if (room.tb_bookings) {
                            room.tb_bookings.forEach((b) => {
                                flatBookings.push({
                                    id: b.book_id,
                                    roomName: room.room_name,
                                    roomId: room.room_id,
                                    price: room.price,
                                    status: room.status,
                                    start_date: b.start_date,
                                    stop_date: b.stop_date,
                                    total: b.total,
                                    petName: b.pet?.pet_name || "",
                                    customerName: b.cu?.cus_name || "",
                                    service: room.room_name || "",
                                    pet: {
                                        id: b.pet?.pet_id,
                                        type: b.pet?.pet_type,
                                        gender: b.pet?.gender,
                                        size: b.pet?.size,
                                    },
                                    customer: {
                                        id: b.cu?.cus_id,
                                        phone: b.cu?.tel,
                                        address: b.cu?.address,
                                    },
                                    services: {
                                        id: b.service?.service_id,
                                        name: b.service?.service_name
                                    },
                                    tb_service_infos: (b.tb_service_infos || []).map(info => ({
                                        id: info.info_id,
                                        description: info.description,
                                        price: info.price,
                                        docId: info.doc_id,
                                        bookId: info.book_id
                                    }))
                                });
                            });
                        }
                    });
                }
                console.log("flatBookings", flatBookings);
                setBookingData(flatBookings);
                setReportData(response);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        getAllbokapi();
    }, [accessToken]);

    // Add filtered bookings function
    const filteredBookings = bookingData.filter((booking) => {
        const petName = (booking.petName || '').toLowerCase();
        const customerName = (booking.customerName || '').toLowerCase();
        const serviceName = (booking.services?.name || '').toLowerCase();
        const roomName = (booking.service || '').toLowerCase();
        const startDate = booking.start_date || '';
        const stopDate = booking.stop_date || '';

        const searchTerm = searchQuery.toLowerCase();

        return (
            petName.includes(searchTerm) ||
            customerName.includes(searchTerm) ||
            serviceName.includes(searchTerm) ||
            roomName.includes(searchTerm) ||
            startDate.includes(searchTerm) ||
            stopDate.includes(searchTerm)
        );
    });

    useEffect(() => {
        document.title = "ຂໍ້ມູນການຈອງ";
    }, []);

    const handleDialogOpen = (booking = null) => {
        if (booking) {
            setCurrentBooking(booking);
            setEditMode(true);
        } else {
            setCurrentBooking({
                petName: '',
                customerName: '',
                service: '',
                services: { id: '', name: '' },
                start_date: '',
                stop_date: '',
                total: '',
                tb_service_infos: []
            });
            setEditMode(false);
        }
        setOpenDialog(true);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleOpenCancelDialog = (booking) => {
        setBookingToCancel(booking);
        setOpenCancelDialog(true);
    };

    const handleConfirmCancel = async () => {
        console.log("bookingToCancel", bookingToCancel);
        if (bookingToCancel) {
            console.log("bookingToCancel.id", bookingToCancel.id);
            handleDeleteBooking(bookingToCancel.id);
            const response = await Cancel_booking(bookingToCancel.id, accessToken);
            console.log("response", response);
        }
        setOpenCancelDialog(false);
        setOpenSuccessDialog(true);
        setBookingToCancel(null);
    };

    const handleCloseSuccessDialog = () => {
        setOpenSuccessDialog(false);
    };

    const handleDialogClose = () => setOpenDialog(false);

    const handleSaveBooking = () => {
        if (editMode && currentBooking) {
            console.log("currentBooking", currentBooking);
            console.log("currentBooking.roomId", currentBooking.roomId);
            console.log("currentBooking.id", currentBooking.id);

            const roomId = Number(currentBooking.roomId);
            const bookId = Number(currentBooking.id);
            console.log("roomId", roomId);
            console.log("bookId", bookId);
            if (!isNaN(roomId) && !isNaN(bookId)) {
                APIUPDATERoompet_book(roomId, bookId);
            }
            setBookingData(prevData => prevData.map(item => item.id === currentBooking.id ? currentBooking : item));
        } else {
            setBookingData(prevData => [...prevData, { ...currentBooking, id: prevData.length + 1 }]);
        }
        setOpenSnackbar(true);
        setOpenDialog(false);
    };

    const handleDeleteBooking = (id) => setBookingData(prevData => prevData.filter(item => item.id !== id));

    const handleLogout = () => {
        navigate('/');
    };

    const isTreatmentService = (booking) => {
        return booking.services && booking.services.name === 'ປິ່ນປົວສັດລ້ຽງ';
    };

    const hasTreatmentInfo = (booking) => {
        return isTreatmentService(booking) &&
            booking.tb_service_infos &&
            booking.tb_service_infos.length > 0;
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
                        <Menu />
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

            {/* Mobile Drawer */}
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                {/* Mobile Drawer */}
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
                            color: theme.palette.primary.contrastText
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>

                {/* Desktop Drawer */}
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

            {/* Main Content */}
            <Box component="main" sx={{
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
            }}>
                <Container maxWidth="xl">
                    {/* Page Header */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" fontWeight="bold" color="primary">ຕາຕະລາງການຈອງ</Typography>
                    </Box>

                    {/* Search Bar */}
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            mb: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            flex: 1,
                            maxWidth: { md: '400px' }
                        }}
                    >
                        <TextField
                            placeholder="ຄົ້ນຫາການຈອງ..."
                            fullWidth
                            variant="outlined"
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
                            }}
                            sx={{ flexGrow: 1 }}
                        />
                    </Paper>

                    <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#e3f2fd' }}>
                                <TableRow>
                                    <TableCell align="center">ຊື່ສັດລ້ຽງ</TableCell>
                                    <TableCell align="center">ຊື່ເຈົ້າຂອງ</TableCell>
                                    <TableCell align="center">ບໍລິການ</TableCell>
                                    <TableCell align="center">ກົງທີຈອງ</TableCell>
                                    <TableCell align="center">ວັນທີເລີ່ມ</TableCell>
                                    <TableCell align="center">ວັນທີສິ້ນສຸດ</TableCell>
                                    <TableCell align="center">ລາຄາ</TableCell>
                                    <TableCell align="center">ຈັດການ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredBookings.map((booking) => (
                                    <TableRow key={booking.id}>
                                        <TableCell align="center">{booking.petName}</TableCell>
                                        <TableCell align="center">{booking.customerName}</TableCell>
                                        <TableCell align="center">
                                            {booking.services.name}
                                            {hasTreatmentInfo(booking) && (
                                                <Box
                                                    component="span"
                                                    sx={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        ml: 1,
                                                        bgcolor: '#e8f5e9',
                                                        color: '#2e7d32',
                                                        borderRadius: '4px',
                                                        px: 0.75,
                                                        py: 0.25,
                                                        fontSize: '0.75rem'
                                                    }}
                                                >
                                                    <MedicalServices fontSize="small" sx={{ mr: 0.5, fontSize: '0.875rem' }} />
                                                    ມີຂໍ້ມູນເພີ່ມ
                                                </Box>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">{booking.service === 'Bath' ? 'ອາບນ້ຳ' : booking.service === 'Vaccination' ? 'ວັກຊີນ' : booking.service === 'Grooming' ? 'ຕັດຂົນ' : booking.service}</TableCell>
                                        <TableCell align="center">{booking.start_date}</TableCell>
                                        <TableCell align="center">{booking.stop_date}</TableCell>
                                        <TableCell align="center">
                                            {calculateTotalPrice(booking).toLocaleString()}
                                            {hasTreatmentInfo(booking) && (
                                                <Typography
                                                    variant="caption"
                                                    component="div"
                                                    sx={{
                                                        color: '#2e7d32',
                                                        fontSize: '0.7rem',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    (ລວມຄ່າປິ່ນປົວ)
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                <Button
                                                    onClick={() => handleOpenCancelDialog(booking)}
                                                    sx={{
                                                        bgcolor: 'error.main',
                                                        color: 'white',
                                                        '&:hover': { bgcolor: 'error.dark' },
                                                        px: 2
                                                    }}
                                                >
                                                    ຍົກເລີກ
                                                </Button>
                                                <Button
                                                    onClick={() => handleDialogOpen(booking)}
                                                    sx={{
                                                        bgcolor: '#1976d2',
                                                        color: 'white',
                                                        '&:hover': { bgcolor: '#1565c0' },
                                                        px: 2
                                                    }}
                                                >
                                                    ຊຳລະເງິນ
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredBookings.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">ບໍ່ພົບຂໍ້ມູນ</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Cancel Confirmation Dialog */}
                    <Dialog
                        open={openCancelDialog}
                        onClose={() => setOpenCancelDialog(false)}
                        aria-labelledby="cancel-dialog-title"
                        PaperProps={{
                            sx: {
                                width: { xs: '95%', sm: '400px' },
                                borderRadius: 2
                            }
                        }}
                    >
                        <DialogTitle
                            id="cancel-dialog-title"
                            sx={{
                                fontWeight: 'bold',
                                bgcolor: theme.palette.error.main,
                                color: 'white',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                px: 3,
                                py: 1.75
                            }}
                        >
                            <Box>ຢືນຢັນການຍົກເລີກ</Box>
                            <IconButton onClick={() => setOpenCancelDialog(false)} sx={{ color: 'white' }}>
                                <Close />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent sx={{ pt: 3, px: 3 }}>
                            <Typography variant="subtitle1" align="center">
                                ທ່ານຕ້ອງການຍົກເລີກແທ້ ຫຼື ບໍ່?
                            </Typography>
                            {bookingToCancel && (
                                <Box sx={{ mt: 2, bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        <b>ຊື່ສັດລ້ຽງ:</b> {bookingToCancel.petName}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        <b>ຊື່ເຈົ້າຂອງ:</b> {bookingToCancel.customerName}
                                    </Typography>
                                    <Typography variant="body2">
                                        <b>ບໍລິການ:</b> {bookingToCancel.services?.name || ''}
                                    </Typography>
                                </Box>
                            )}
                        </DialogContent>
                        <DialogActions sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                            <Button
                                onClick={() => setOpenCancelDialog(false)}
                                variant="outlined"
                                sx={{ width: '120px' }}
                            >
                                ຍົກເລີກ
                            </Button>
                            <Button
                                onClick={handleConfirmCancel}
                                variant="contained"
                                color="error"
                                sx={{ width: '120px' }}
                            >
                                ຕົກລົງ
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        open={openSuccessDialog}
                        onClose={handleCloseSuccessDialog}
                        aria-labelledby="success-dialog-title"
                        PaperProps={{
                            sx: {
                                width: { xs: '95%', sm: '360px' },
                                borderRadius: 2,
                                overflow: 'hidden'
                            }
                        }}
                    >
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <Box
                                sx={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: '50%',
                                    bgcolor: '#e8f5e9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 16px'
                                }}
                            >
                                <CheckCircle
                                    sx={{
                                        fontSize: 48,
                                        color: '#4caf50'
                                    }}
                                />
                            </Box>
                            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                                ຍົກເລີກສຳເລັດ
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                ການຍົກເລີກການຈອງໄດ້ດຳເນີນການສຳເລັດແລ້ວ
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCloseSuccessDialog}
                                sx={{
                                    minWidth: 120,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    py: 1
                                }}
                            >
                                ຕົກລົງ
                            </Button>
                        </Box>
                    </Dialog>

                    {/* Payment Dialog with QR Code on the right - compact layout without scrolling */}
                    <Dialog
                        open={openDialog}
                        onClose={handleDialogClose}
                        maxWidth={isTreatmentService(currentBooking) ? "lg" : "md"}
                        fullWidth
                        PaperProps={{
                            sx: {
                                width: {
                                    xs: '98%',
                                    sm: isTreatmentService(currentBooking) ? '95%' : '80%',
                                    md: isTreatmentService(currentBooking) ? '90%' : '75%'
                                },
                                borderRadius: 1,
                                overflow: 'hidden'
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
                            px: 2.5,
                            py: 1.5
                        }}>
                            <Box>
                                {editMode ? 'ຊຳລະເງິນ' : 'ເພີ່ມການຈອງ'}
                            </Box>
                            <IconButton onClick={handleDialogClose} sx={{ color: 'white' }}>
                                <Close />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent sx={{ p: 2 }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                gap: 2
                            }}>
                                {/* Left side - Booking Information Container */}
                                <Box sx={{ flex: '1 1 68%' }}>
                                    <Typography variant="subtitle1" color="primary" fontWeight="bold" gutterBottom sx={{ mb: 1 }}>
                                        ຂໍ້ມູນການຈອງ
                                    </Typography>

                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1.5,
                                        width: '100%',
                                    }}>
                                        {/* First row - Pet and Customer */}
                                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ display: 'block', mb: 0.3 }}>
                                                    ຊື່ສັດລ້ຽງ
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    value={currentBooking.petName}
                                                    onChange={(e) => setCurrentBooking({ ...currentBooking, petName: e.target.value })}
                                                    disabled={editMode}
                                                    size="small"
                                                    variant="outlined"
                                                    placeholder="ຊື່ສັດລ້ຽງ"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <Pets fontSize="small" color="primary" sx={{ mr: 0.75, opacity: 0.7 }} />
                                                        )
                                                    }}
                                                />
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ display: 'block', mb: 0.3 }}>
                                                    ຊື່ເຈົ້າຂອງ
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    value={currentBooking.customerName}
                                                    onChange={(e) => setCurrentBooking({ ...currentBooking, customerName: e.target.value })}
                                                    disabled={editMode}
                                                    size="small"
                                                    variant="outlined"
                                                    placeholder="ຊື່ເຈົ້າຂອງ"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <Person fontSize="small" color="primary" sx={{ mr: 0.75, opacity: 0.7 }} />
                                                        )
                                                    }}
                                                />
                                            </Box>
                                        </Box>

                                        {/* Second row - Services */}
                                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ display: 'block', mb: 0.3 }}>
                                                    ບໍລິການ
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    value={currentBooking.services?.name || ''}
                                                    disabled={true}
                                                    size="small"
                                                    variant="outlined"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <ContentCut fontSize="small" color="primary" sx={{ mr: 0.75, opacity: 0.7 }} />
                                                        )
                                                    }}
                                                />
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ display: 'block', mb: 0.3 }}>
                                                    ກົງທີຈອງ
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    value={currentBooking.service || ''}
                                                    disabled={true}
                                                    size="small"
                                                    variant="outlined"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <Bathtub fontSize="small" color="primary" sx={{ mr: 0.75, opacity: 0.7 }} />
                                                        )
                                                    }}
                                                />
                                            </Box>
                                        </Box>

                                        {/* Third row - Dates */}
                                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ display: 'block', mb: 0.3 }}>
                                                    ວັນທີເລີ່ມ
                                                </Typography>
                                                <TextField
                                                    type="date"
                                                    fullWidth
                                                    value={currentBooking.start_date}
                                                    onChange={(e) => setCurrentBooking({ ...currentBooking, start_date: e.target.value })}
                                                    InputLabelProps={{ shrink: true }}
                                                    disabled={editMode}
                                                    size="small"
                                                    variant="outlined"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <CalendarMonth fontSize="small" color="primary" sx={{ mr: 0.75, opacity: 0.7 }} />
                                                        )
                                                    }}
                                                />
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ display: 'block', mb: 0.3 }}>
                                                    ວັນທີສິ້ນສຸດ
                                                </Typography>
                                                <TextField
                                                    type="date"
                                                    fullWidth
                                                    value={currentBooking.stop_date}
                                                    onChange={(e) => setCurrentBooking({ ...currentBooking, stop_date: e.target.value })}
                                                    InputLabelProps={{ shrink: true }}
                                                    disabled={editMode}
                                                    size="small"
                                                    variant="outlined"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <CalendarMonth fontSize="small" color="primary" sx={{ mr: 0.75, opacity: 0.7 }} />
                                                        )
                                                    }}
                                                />
                                            </Box>
                                        </Box>

                                        {/* Fourth row - Price and Treatment Info */}
                                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}>
                                            {/* Price Information */}
                                            <Box sx={{
                                                flex: isTreatmentService(currentBooking) ? 1 : '0 0 auto',
                                                width: isTreatmentService(currentBooking) ? '100%' : { xs: '100%', sm: '50%', md: '50%' }
                                            }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ display: 'block', mb: 0.3 }}>
                                                    ລາຄາພື້ນຖານ
                                                </Typography>
                                                <TextField
                                                    type="number"
                                                    fullWidth
                                                    value={currentBooking.total}
                                                    onChange={(e) => setCurrentBooking({ ...currentBooking, total: e.target.value })}
                                                    disabled={editMode}
                                                    size="small"
                                                    variant="outlined"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <Box component="span" sx={{ display: 'flex', alignItems: 'center', mr: 0.75, color: 'primary.main', opacity: 0.7 }}>₭</Box>
                                                        ),
                                                        endAdornment: <Typography variant="body2" color="text.secondary">ກີບ</Typography>
                                                    }}
                                                />

                                                {/* Total price calculation */}
                                                {hasTreatmentInfo(currentBooking) && (
                                                    <Box sx={{
                                                        mt: 1,
                                                        p: 1,
                                                        borderRadius: 1,
                                                        bgcolor: '#f5f5f5',
                                                        border: '1px solid #e0e0e0'
                                                    }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography variant="subtitle2" color="primary.dark">
                                                                ລາຄາພື້ນຖານ:
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                {parseInt(currentBooking.total).toLocaleString()} ກີບ
                                                            </Typography>
                                                        </Box>

                                                        {currentBooking.tb_service_infos && currentBooking.tb_service_infos.map((info, index) => (
                                                            <Box
                                                                key={index}
                                                                sx={{
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'center',
                                                                    mt: 0.5
                                                                }}
                                                            >
                                                                <Typography variant="subtitle2" color="primary.dark">
                                                                    ຄ່າປິ່ນປົວ:
                                                                </Typography>
                                                                <Typography variant="body2">
                                                                    {parseInt(info.price).toLocaleString()} ກີບ
                                                                </Typography>
                                                            </Box>
                                                        ))}

                                                        <Divider sx={{ my: 0.75 }} />

                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography variant="subtitle1" fontWeight="bold" color="primary.dark">
                                                                ລວມທັງໝົດ:
                                                            </Typography>
                                                            <Typography variant="subtitle1" fontWeight="bold" color="primary.dark">
                                                                {calculateTotalPrice(currentBooking).toLocaleString()} ກີບ
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                )}
                                            </Box>

                                            {/* Treatment Information */}
                                            {isTreatmentService(currentBooking) && (
                                                <Box sx={{ flex: 1 }}>
                                                    <Box sx={{
                                                        p: 1.5,
                                                        borderRadius: 1,
                                                        bgcolor: hasTreatmentInfo(currentBooking) ? '#f0f7ff' : '#f5f5f5',
                                                        border: hasTreatmentInfo(currentBooking) ? '1px solid #90caf9' : '1px solid #e0e0e0',
                                                        height: '100%',
                                                        display: 'flex',
                                                        flexDirection: 'column'
                                                    }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                            <LocalHospital sx={{ mr: 0.75, color: theme.palette.primary.main }} />
                                                            <Typography variant="subtitle2" color="primary.main" fontWeight="bold">
                                                                ຂໍ້ມູນການປິ່ນປົວສັດລ້ຽງ
                                                                {hasTreatmentInfo(currentBooking) && (
                                                                    <Box component="span" sx={{ ml: 0.75, color: 'success.main', fontSize: '0.8rem' }}>
                                                                        (ມີຂໍ້ມູນ)
                                                                    </Box>
                                                                )}
                                                            </Typography>
                                                        </Box>

                                                        {currentBooking.tb_service_infos && currentBooking.tb_service_infos.length > 0 ? (
                                                            <Box sx={{ flex: 1 }}>
                                                                {currentBooking.tb_service_infos.map((info, index) => (
                                                                    <Box
                                                                        key={index}
                                                                        sx={{
                                                                            mb: 1,
                                                                            p: 1,
                                                                            borderRadius: 1,
                                                                            bgcolor: 'background.paper',
                                                                            border: '1px solid #e0e0e0'
                                                                        }}
                                                                    >
                                                                        <Typography variant="body2" fontWeight="medium" sx={{ mb: 0.5 }}>
                                                                            ລາຍລະອຽດການປິ່ນປົວ:
                                                                        </Typography>
                                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                                            {info.description || "ບໍ່ມີລາຍລະອຽດ"}
                                                                        </Typography>

                                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                            <Typography variant="body2" color="text.secondary">
                                                                                ຄ່າປິ່ນປົວ:
                                                                            </Typography>
                                                                            <Typography variant="body2" fontWeight="bold" color="primary.dark">
                                                                                {parseInt(info.price).toLocaleString()} ກີບ
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                ))}
                                                            </Box>
                                                        ) : (
                                                            <Box sx={{ textAlign: 'center', py: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    ບໍ່ມີຂໍ້ມູນການປິ່ນປົວເພີ່ມເຕີມ
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Right side - QR Code Container */}
                                {editMode && (
                                    <>
                                        {/* Mobile Divider */}
                                        <Box sx={{
                                            display: { xs: 'flex', md: 'none' },
                                            justifyContent: 'center',
                                            width: '100%',
                                            my: 0.5
                                        }}>
                                            <Divider sx={{ width: '100%' }} />
                                        </Box>

                                        {/* QR Code Container */}
                                        <Box sx={{
                                            flex: '1 1 32%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderLeft: { xs: 'none', md: '1px solid #e0e0e0' },
                                            pl: { md: 2 },
                                            pt: { xs: 1, md: 0 }
                                        }}>
                                            <Typography variant="body1" color="primary" fontWeight="bold" gutterBottom align="center">
                                                ສະແກນເພື່ອຊຳລະເງິນ
                                            </Typography>
                                            <Box
                                                component="img"
                                                src={image}
                                                alt="QR Code"
                                                sx={{
                                                    width: { xs: 140, sm: 150, md: 160 },
                                                    height: { xs: 140, sm: 150, md: 160 },
                                                    objectFit: 'contain',
                                                    border: '1px solid #eee',
                                                    borderRadius: 1,
                                                    my: 1,
                                                    bgcolor: 'white'
                                                }}
                                            />
                                            <Box sx={{
                                                width: '100%',
                                                bgcolor: theme.palette.primary.main,
                                                p: 1,
                                                borderRadius: 1,
                                                color: 'white',
                                                textAlign: 'center'
                                            }}>
                                                <Typography variant="caption" align="center" sx={{ display: 'block', mb: 0.25 }}>
                                                    ຈຳນວນເງິນທີ່ຕ້ອງຊຳລະ
                                                </Typography>
                                                <Typography variant="h6" fontWeight="bold" align="center">
                                                    {calculateTotalPrice(currentBooking).toLocaleString()} ກີບ
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </>
                                )}
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ px: 2, py: 1, borderTop: '1px solid #e0e0e0' }}>
                            <Button
                                onClick={handleDialogClose}
                                variant="outlined"
                                color="error"
                                startIcon={<Close />}
                                size="medium"
                            >
                                ຍົກເລີກ
                            </Button>
                            <Button
                                onClick={() => {
                                    handleSaveBooking();
                                    setOpenDialog(false);
                                    setOpenReceiptDialog(true);
                                }}
                                variant="contained"
                                color="primary"
                                startIcon={editMode ? <AddCircle /> : <Edit />}
                                size="medium"
                            >
                                {editMode ? 'ຢືນຢັນການຊຳລະ' : 'ບັນທຶກ'}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Receipt Printer Dialog */}
                    <ReceiptPrinter
                        open={openReceiptDialog}
                        onClose={() => setOpenReceiptDialog(false)}
                        booking={currentBooking}
                    />

                    <Snackbar
                        open={openSnackbar}
                        autoHideDuration={3000}
                        onClose={() => setOpenSnackbar(false)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                            ຊຳລະເງິນສຳເລັດ!
                        </Alert>
                    </Snackbar>
                </Container>
            </Box>
        </Box>
    );
};

export default BookingTable;