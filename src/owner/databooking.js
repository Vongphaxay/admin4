import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, CssBaseline, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton,
    ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Grid, Button, Avatar,
    Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, useTheme, styled, Container,
    Snackbar, Alert
} from '@mui/material';
import {
    Edit, Delete, AddCircle, Home, Person, People, CalendarMonth, Pets, Bathtub, Menu as MenuIcon,
    Assessment as AssessmentIcon,
    ContentCut, Vaccines, Menu, ChevronRight, Notifications, Close, Logout, Print
} from '@mui/icons-material';
import Cookies from 'js-cookie';
import { GetAllbooking, UpdatePayment_roompet } from '../services/report.service';
import image from '../img/qrcode.png';
import ReceiptPrinter from './ReceiptPrinter'; // Import the ReceiptPrinter component

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
    const [openReceiptDialog, setOpenReceiptDialog] = useState(false); // State for receipt dialog
    const [currentBooking, setCurrentBooking] = useState({
        id: '', // add this
        roomId: '', // add this
        petName: '',
        customerName: '',
        service: '',
        start_date: '',
        stop_date: '',
        total: ''
    });


    const admin_name = decodeURIComponent(Cookies.get("name_admin") || "");
    const accessToken = Cookies.get("accessTokena");

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
                                    }
                                });
                            });
                        }
                    });
                }

                setBookingData(flatBookings);
                setReportData(response); // raw backup
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        getAllbokapi();
    }, [accessToken]);

    const handleDialogOpen = (booking = null) => {
        if (booking) {
            setCurrentBooking(booking);
            setEditMode(true);
        } else {
            setCurrentBooking({
                petName: '',
                customerName: '',
                service: '',
                start_date: '',
                stop_date: '',
                total: ''
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
        setOpenSnackbar(true); // Show success message
        setOpenDialog(false);
    };

    const handleDeleteBooking = (id) => setBookingData(prevData => prevData.filter(item => item.id !== id));

    const handleLogout = () => {
        navigate('/');
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
                        keepMounted: true, // Better open performance on mobile.
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
                    <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
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
                                    <TableCell>ຈັດການ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {bookingData.map((booking) => (
                                    <TableRow key={booking.id}>
                                        <TableCell>{booking.petName}</TableCell>
                                        <TableCell>{booking.customerName}</TableCell>
                                        <TableCell>{booking.services.name}</TableCell>
                                        <TableCell>{booking.service === 'Bath' ? 'ອາບນ້ຳ' : booking.service === 'Vaccination' ? 'ວັກຊີນ' : booking.service === 'Grooming' ? 'ຕັດຂົນ' : booking.service}</TableCell>
                                        <TableCell>{booking.start_date}</TableCell>
                                        <TableCell>{booking.stop_date}</TableCell>
                                        <TableCell>{booking.total}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleDialogOpen(booking)} sx={{ bgcolor: '#1976d2', color: 'white', '&:hover': { bgcolor: '#1565c0' } }}>ຊຳລະເງິນ</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Payment Dialog with QR Code on the right - adjusted padding/margin and larger buttons */}
                    <Dialog
                        open={openDialog}
                        onClose={handleDialogClose}
                        maxWidth="md"
                        fullWidth
                        PaperProps={{
                            sx: {
                                minHeight: { xs: 'auto', sm: '440px', md: '460px' },
                                maxHeight: { xs: '90vh', sm: '85vh', md: '80vh' },
                                width: { xs: '95%', sm: '90%', md: '88%' }
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
                            <Box>
                                {editMode ? 'ຊຳລະເງິນ' : 'ເພີ່ມການຈອງ'}
                            </Box>
                            <IconButton onClick={handleDialogClose} sx={{ color: 'white' }}>
                                <Close />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                height: { xs: 'auto', sm: '400px', md: '420px' },
                            }}>
                                {/* Left side - Booking Information Container - REDUCED PADDING */}
                                <Box sx={{
                                    flex: '1 1 68%',
                                    p: { xs: 2, sm: 2 },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    overflow: 'auto'
                                }}>
                                    <Typography variant="subtitle1" color="primary" fontWeight="bold" gutterBottom sx={{ mb: 1.5 }}>
                                        ຂໍ້ມູນການຈອງ
                                    </Typography>

                                    {/* Reorganized booking information with REDUCED SPACING */}
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
                                        {/* First row - Pet and Customer */}
                                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
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
                                                            <Pets fontSize="small" color="primary" sx={{ mr: 1, opacity: 0.7 }} />
                                                        )
                                                    }}
                                                />
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
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
                                                            <Person fontSize="small" color="primary" sx={{ mr: 1, opacity: 0.7 }} />
                                                        )
                                                    }}
                                                />
                                            </Box>
                                        </Box>

                                        {/* Second row - Services */}
                                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
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
                                                            <ContentCut fontSize="small" color="primary" sx={{ mr: 1, opacity: 0.7 }} />
                                                        )
                                                    }}
                                                />
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
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
                                                            <Bathtub fontSize="small" color="primary" sx={{ mr: 1, opacity: 0.7 }} />
                                                        )
                                                    }}
                                                />
                                            </Box>
                                        </Box>

                                        {/* Third row - Dates */}
                                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
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
                                                            <CalendarMonth fontSize="small" color="primary" sx={{ mr: 1, opacity: 0.7 }} />
                                                        )
                                                    }}
                                                />
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
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
                                                            <CalendarMonth fontSize="small" color="primary" sx={{ mr: 1, opacity: 0.7 }} />
                                                        )
                                                    }}
                                                />
                                            </Box>
                                        </Box>

                                        {/* Fourth row - Price */}
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                ລາຄາ
                                            </Typography>
                                            <TextField
                                                type="number"
                                                fullWidth
                                                value={currentBooking.total}
                                                onChange={(e) => setCurrentBooking({ ...currentBooking, total: e.target.value })}
                                                disabled={editMode}
                                                size="small"
                                                variant="outlined"
                                                sx={{ maxWidth: { sm: '50%' } }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', mr: 1, color: 'primary.main', opacity: 0.7 }}>₭</Box>
                                                    ),
                                                    endAdornment: <Typography variant="body2" color="text.secondary">ກີບ</Typography>
                                                }}
                                            />
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
                                            my: 1.5
                                        }}>
                                            <Divider sx={{ width: '90%' }}>
                                                <Typography variant="subtitle2" color="primary">
                                                    ຊຳລະເງິນ
                                                </Typography>
                                            </Divider>
                                        </Box>

                                        {/* Separate QR Code Container */}
                                        <Box sx={{
                                            flex: '1 1 32%',
                                            bgcolor: '#f8faff',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            position: 'relative',
                                            borderLeft: { xs: 'none', md: `1px solid ${theme.palette.primary.light}` },
                                            py: { xs: 2, md: 0 }
                                        }}>
                                            <Paper elevation={1} sx={{
                                                py: 2.5,
                                                px: 2.5,
                                                width: { xs: '85%', md: '85%' },
                                                maxWidth: '260px',
                                                borderRadius: 1.5,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                bgcolor: 'white',
                                                border: `1px solid ${theme.palette.primary.light}`
                                            }}>
                                                <Typography variant="body1" color="primary" fontWeight="bold" gutterBottom>
                                                    ສະແກນເພື່ອຊຳລະເງິນ
                                                </Typography>
                                                <Box
                                                    component="img"
                                                    src={image}
                                                    alt="QR Code"
                                                    sx={{
                                                        width: { xs: 140, md: 140, lg: 150 },
                                                        height: { xs: 140, md: 140, lg: 150 },
                                                        objectFit: 'contain',
                                                        border: '1px solid #eee',
                                                        borderRadius: 1,
                                                        p: 0.5,
                                                        my: 2,
                                                        bgcolor: 'white'
                                                    }}
                                                />
                                                <Box sx={{
                                                    width: '100%',
                                                    bgcolor: theme.palette.primary.main,
                                                    p: 1.25,
                                                    borderRadius: 1,
                                                    color: 'white'
                                                }}>
                                                    <Typography variant="caption" align="center" sx={{ display: 'block', mb: 0.5 }}>
                                                        ຈຳນວນເງິນທີ່ຕ້ອງຊຳລະ
                                                    </Typography>
                                                    <Typography variant="subtitle1" fontWeight="bold" align="center">
                                                        {currentBooking.total} ກີບ
                                                    </Typography>
                                                </Box>
                                            </Paper>
                                        </Box>
                                    </>
                                )}
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ px: 3, py: 2 }}>
                            {/* BIGGER BUTTONS */}
                            <Button
                                onClick={handleDialogClose}
                                variant="outlined"
                                color="error"
                                startIcon={<Close />}
                                size="medium" // Changed from small to medium
                                sx={{ px: 2, py: 0.75 }} // Added more padding
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
                                size="medium" // Changed from small to medium
                                sx={{ px: 2, py: 0.75 }} // Added more padding
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