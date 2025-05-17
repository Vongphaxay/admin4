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
    Edit, Delete, AddCircle, Home, Person, People, CalendarMonth, Pets, Bathtub,
    ContentCut, Vaccines, Menu, ChevronRight, Notifications, Close, Logout, Print
} from '@mui/icons-material';
import Cookies from 'js-cookie';
import { GetAllbooking } from '../services/report.service';
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
    { icon: <Home />, label: 'ພາບລວມຄລິນິກ', path: '/dashboard' },
    { icon: <People />, label: 'ຂໍ້ມູນພະນັກງານ', path: '/dataemployee' },
    { icon: <People />, label: 'ຂໍ້ມູນລູກຄ້າ', path: '/datacustomer' },
    { icon: <CalendarMonth />, label: 'ຂໍ້ມູນການຈອງ', path: '/databooking', active: true },
    { icon: <Pets />, label: 'ຝາກສັດລ້ຽງ', path: '/petboarding' },
    { icon: <Bathtub />, label: 'ອາບນ້ຳສັດລ້ຽງ', path: '/bathpet' },
    { icon: <ContentCut />, label: 'ຕັດຂົນສັດລ້ຽງ', path: '/petbar' },
    { icon: <Vaccines />, label: 'ປິ່ນປົວສັດລ້ຽງ', path: '/treatpet' },
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
        petName: '', 
        customerName: '', 
        service: '', 
        start_date: '', 
        stop_date: '',
        total: ''
    });
    
    const admin_name = decodeURIComponent(Cookies.get("name_admin") || "");
    const accessToken = Cookies.get("accessTokena");

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
        if (editMode) {
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
                        Admin: {admin_name}
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
                                        <TableCell>{booking.start_date}</TableCell>
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

                    {/* Payment Dialog with QR Code on the right */}
                    <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="md" fullWidth>
                        <DialogTitle sx={{ fontWeight: 'bold', bgcolor: theme.palette.primary.main, color: 'white' }}>
                            {editMode ? 'ຊຳລະເງິນ' : 'ເພີ່ມການຈອງ'}
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={3} sx={{ mt: 1 }}>
                                {/* Left side - Booking Information */}
                                <Grid item xs={12} md={7}>
                                    <Typography variant="subtitle1" color="primary" fontWeight="bold" gutterBottom>
                                        ຂໍ້ມູນການຈອງ
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="ຊື່ສັດລ້ຽງ"
                                                fullWidth
                                                value={currentBooking.petName}
                                                onChange={(e) => setCurrentBooking({ ...currentBooking, petName: e.target.value })}
                                                disabled={editMode}
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="ຊື່ເຈົ້າຂອງ"
                                                fullWidth
                                                value={currentBooking.customerName}
                                                onChange={(e) => setCurrentBooking({ ...currentBooking, customerName: e.target.value })}
                                                disabled={editMode}
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="ວັນທີເລີ່ມ"
                                                type="date"
                                                fullWidth
                                                value={currentBooking.start_date}
                                                onChange={(e) => setCurrentBooking({ ...currentBooking, start_date: e.target.value })}
                                                InputLabelProps={{ shrink: true }}
                                                disabled={editMode}
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="ວັນທີສິ້ນສຸດ"
                                                type="date"
                                                fullWidth
                                                value={currentBooking.stop_date}
                                                onChange={(e) => setCurrentBooking({ ...currentBooking, stop_date: e.target.value })}
                                                InputLabelProps={{ shrink: true }}
                                                disabled={editMode}
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="ລາຄາ"
                                                type="number"
                                                fullWidth
                                                value={currentBooking.total}
                                                onChange={(e) => setCurrentBooking({ ...currentBooking, total: e.target.value })}
                                                disabled={editMode}
                                                InputProps={{
                                                    endAdornment: <Typography variant="body2" color="text.secondary">ກີບ</Typography>
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                
                                {/* Vertical Divider for desktop view */}
                                {editMode && (
                                    <Grid item xs={0} md={1} sx={{ 
                                        display: { xs: 'none', md: 'flex' }, 
                                        justifyContent: 'center',
                                        position: 'relative'
                                    }}>
                                        <Divider orientation="vertical" sx={{ 
                                            position: 'absolute',
                                            height: '100%'
                                        }} />
                                    </Grid>
                                )}
                                
                                {/* Horizontal Divider for mobile view */}
                                {editMode && (
                                    <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' }, my: 1 }}>
                                        <Divider>
                                            <Typography variant="subtitle2" color="primary">
                                                ຊຳລະເງິນ
                                            </Typography>
                                        </Divider>
                                    </Grid>
                                )}
                                
                                {/* Right side - QR Code */}
                                {editMode && (
                                    <Grid item xs={12} md={4} sx={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        justifyContent: 'center', 
                                        alignItems: 'center'
                                    }}>
                                        <Typography variant="subtitle1" color="primary" fontWeight="bold" gutterBottom>
                                            ສະແກນເພື່ອຊຳລະເງິນ
                                        </Typography>
                                        <Box 
                                            component="img" 
                                            src={image} 
                                            alt="QR Code" 
                                            sx={{ 
                                                width: 180, 
                                                height: 180, 
                                                objectFit: 'contain',
                                                border: '1px solid #eee',
                                                borderRadius: 1,
                                                p: 1,
                                                mb: 2
                                            }} 
                                        />
                                        <Typography variant="body2" color="text.secondary" align="center" sx={{ fontWeight: 'medium' }}>
                                            ຈຳນວນເງິນທີ່ຕ້ອງຊຳລະ
                                        </Typography>
                                        <Typography variant="h6" color="primary" fontWeight="bold" align="center">
                                            {currentBooking.total} ກີບ
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 3 }}>
                            <Button 
                                onClick={handleDialogClose} 
                                variant="outlined" 
                                color="error"
                                startIcon={<Close />}
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