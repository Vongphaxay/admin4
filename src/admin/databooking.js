import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    CssBaseline,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Grid,
    Button,
    Avatar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    useTheme,
    styled,
    Container
} from '@mui/material';
import {
    Edit,
    Delete,
    AddCircle,
    Home,
    Person,
    People,
    CalendarMonth,
    Pets,
    Bathtub,
    ContentCut,
    Vaccines,
    Menu,
    ChevronRight,
    Notifications,
    Close,
    Logout
} from '@mui/icons-material';
import Cookies from 'js-cookie';
import { GetAllbooking } from '../services/report.service';

// Create a custom styled container for the logo
const LogoContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
    height: 64,
    backgroundColor: theme.palette.primary.dark
}));

const admin_name = decodeURIComponent(Cookies.get("name_admin") || "");
const cus_id = Cookies.get("cus_ida");
const accessToken = Cookies.get("accessTokena");

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

    useEffect(() => {
        const getAllbokapi = async () => {
            try {
                const response = await GetAllbooking(accessToken);
                const flatBookings = [];

                response.report.forEach((room) => {
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
                });

                setBookingData(flatBookings);
                setReportData(response); // raw backup
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        getAllbokapi();
    }, [accessToken]);

    const [currentBooking, setCurrentBooking] = useState({ petName: '', ownerName: '', service: '', date: '', status: '' });

    const handleDialogOpen = (booking = null) => {
        if (booking) {
            setCurrentBooking(booking);
            setEditMode(true);
        } else {
            setCurrentBooking({ petName: '', ownerName: '', service: '', date: '', status: '' });
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
                                        <TableCell>{booking.service === 'Bath' ? 'ອາບນ້ຳ' : booking.service === 'Vaccination' ? 'ວັກຊີນ' : booking.service === 'Grooming' ? 'ຕັດຂົນ' : booking.service}</TableCell>
                                        <TableCell>{booking.start_date}</TableCell>
                                        <TableCell>{booking.stop_date}</TableCell>
                                        <TableCell>{booking.total}</TableCell>
                                        {/* <TableCell>{booking.status === 'Confirmed' ? 'ຢືນຢັນແລ້ວ' : booking.status === 'Pending' ? 'ລໍຖ້າ' : booking.status === 'Cancelled' ? 'ຍົກເລີກ' : booking.status}</TableCell> */}
                                        <TableCell>
                                            <IconButton onClick={() => handleDialogOpen(booking)} sx={{ color: '#1976d2' }}><Edit /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Dialog open={openDialog} onClose={handleDialogClose}>
                        <DialogTitle>{editMode ? 'ແກ້ໄຂການຈອງ' : 'ເພີ່ມການຈອງ'}</DialogTitle>
                        <DialogContent>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="ຊື່ສັດລ້ຽງ"
                                        fullWidth
                                        value={currentBooking.petName}
                                        onChange={(e) => setCurrentBooking({ ...currentBooking, petName: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="ຊື່ເຈົ້າຂອງ"
                                        fullWidth
                                        value={currentBooking.customerName}
                                        onChange={(e) => setCurrentBooking({ ...currentBooking, customerName: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>ບໍລິການ</InputLabel>
                                        <Select
                                            value={currentBooking.service}
                                            onChange={(e) => setCurrentBooking({ ...currentBooking, service: e.target.value })}
                                            label="ບໍລິການ"
                                        >
                                            <MenuItem value="Bath">ອາບນ້ຳ</MenuItem>
                                            <MenuItem value="Vaccination">ວັກຊີນ</MenuItem>
                                            <MenuItem value="Grooming">ຕັດຂົນ</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="ວັນທີເລີ່ມ"
                                        type="date"
                                        fullWidth
                                        value={currentBooking.start_date}
                                        onChange={(e) => setCurrentBooking({ ...currentBooking, start_date: e.target.value })}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="ວັນທີສິ້ນສຸດ"
                                        type="date"
                                        fullWidth
                                        value={currentBooking.stop_date}
                                        onChange={(e) => setCurrentBooking({ ...currentBooking, stop_date: e.target.value })}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="ລາຄາ"
                                        type="price"
                                        fullWidth
                                        value={currentBooking.total}
                                        onChange={(e) => setCurrentBooking({ ...currentBooking, total: e.target.value })}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDialogClose} color="error">ຍົກເລີກ</Button>
                            <Button onClick={handleSaveBooking} sx={{ bgcolor: '#1976d2', color: 'white', '&:hover': { bgcolor: '#1565c0' } }}>ບັນທຶກ</Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
        </Box>
    );
};

export default BookingTable;