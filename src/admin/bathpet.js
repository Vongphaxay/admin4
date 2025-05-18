import React, { useState } from 'react';
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
    Container,
    Card,
    CardContent,
    Chip
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
    Logout,
    Phone,
    Email,
    Search,
    DateRange,
    AccessTime,
    Info,
    EventNote,
    PetsOutlined,
    Soap,
    Shower,
    CheckCircle
} from '@mui/icons-material';
import Cookies from 'js-cookie';

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

// Menu items
const menuItems = [
    { icon: <Home />, label: 'ພາບລວມຄລິນິກ', path: '/dashboard' },
    { icon: <People />, label: 'ຂໍ້ມູນພະນັກງານ', path: '/dataemployee' },
    { icon: <People />, label: 'ຂໍ້ມູນລູກຄ້າ', path: '/datacustomer' },
    { icon: <CalendarMonth />, label: 'ຂໍ້ມູນການຈອງ', path: '/databooking' },
    { icon: <Pets />, label: 'ຝາກສັດລ້ຽງ', path: '/petboarding' },
    { icon: <Bathtub />, label: 'ອາບນ້ຳສັດລ້ຽງ', path: '/bathpet', active: true },
    { icon: <ContentCut />, label: 'ຕັດຂົນສັດລ້ຽງ', path: '/petbar' },
    { icon: <Vaccines />, label: 'ປິ່ນປົວສັດລ້ຽງ', path: '/treatpet' },

];

const BathPet = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [bathData, setBathData] = useState([
        {
            id: 1,
            petName: 'ດາວດາຍ',
            petType: 'ໝາ',
            breed: 'ພັນຈັງເຊຍ',
            weight: '12.5',
            ownerName: 'ທ. ວິໄລສັກ ວັນນະລາດ',
            phone: '020 7654 3210',
            bathDate: '2025-05-08',
            timeSlot: '9:00 - 10:30',
            status: 'Pending',
            notes: 'ໃຊ້ແຊມພູພິເສດສຳລັບຜິວແພ້ງ່າຍ.',
            services: 'ອາບນ້ຳມາດຕະຖານ, ເປົ່າຂົນ, ຕັດເລັບ',
            staffAssigned: 'ນ. ສະໝອນໃຈ',
            price: '150000'
        },
        {
            id: 2,
            petName: 'ແມວມີ່',
            petType: 'ແມວ',
            breed: 'ພັນແມວໄທ',
            weight: '4.2',
            ownerName: 'ນ. ສຸພາພອນ ສີບຸນມີ',
            phone: '020 8765 4321',
            bathDate: '2025-05-08',
            timeSlot: '10:30 - 12:00',
            status: 'InProgress',
            notes: 'ຫຼີກລ້ຽງບໍລິເວນຫູ ເນື່ອງຈາກມີການຕິດເຊື້ອ.',
            services: 'ອາບນ້ຳມາດຕະຖານ, ແປງຂົນ',
            staffAssigned: 'ທ. ສຸລິຍາ',
            price: '120000'
        },
        {
            id: 3,
            petName: 'ໂຕໂຕ້',
            petType: 'ໝາ',
            breed: 'ພັນຈີນິກເຊີ',
            weight: '3.8',
            ownerName: 'ທ. ປະເສີດ ດວງຈັນ',
            phone: '020 9876 5432',
            bathDate: '2025-05-07',
            timeSlot: '14:00 - 15:30',
            status: 'Completed',
            notes: 'ແມງຕະນູໜ້ອຍ, ໃຊ້ຜະລິດຕະພັນກຳຈັດແມງຕະນູ.',
            services: 'ອາບນ້ຳພິເສດ, ເປົ່າຂົນ, ຕັດເລັບ, ລ້າງຫູ',
            staffAssigned: 'ນ. ສະໝອນໃຈ',
            price: '180000'
        },
        {
            id: 4,
            petName: 'ໝີເຊີ',
            petType: 'ໝາ',
            breed: 'ພັນພູເດີ້ນ',
            weight: '22.0',
            ownerName: 'ນ. ມະນີຈັນ ແສງສະຫວ່າງ',
            phone: '020 5566 7788',
            bathDate: '2025-05-08',
            timeSlot: '13:00 - 14:30',
            status: 'Canceled',
            notes: 'ລູກຄ້າຍົກເລີກເນື່ອງຈາກເຈັບປ່ວຍ.',
            services: 'ອາບນ້ຳມາດຕະຖານ, ເປົ່າຂົນ',
            staffAssigned: '-',
            price: '150000'
        },
    ]);
    const [currentBath, setCurrentBath] = useState({
        petName: '',
        petType: '',
        breed: '',
        weight: '',
        ownerName: '',
        phone: '',
        bathDate: '',
        timeSlot: '',
        status: '',
        notes: '',
        services: '',
        staffAssigned: '',
        price: ''
    });
    const [selectedBath, setSelectedBath] = useState(null);

    const handleDialogOpen = (bath = null) => {
        if (bath) {
            setCurrentBath(bath);
            setEditMode(true);
        } else {
            setCurrentBath({
                petName: '',
                petType: '',
                breed: '',
                weight: '',
                ownerName: '',
                phone: '',
                bathDate: new Date().toISOString().split('T')[0],
                timeSlot: '',
                status: 'Pending',
                notes: '',
                services: '',
                staffAssigned: '',
                price: ''
            });
            setEditMode(false);
        }
        setOpenDialog(true);
    };

    const handleDetailsOpen = (bath) => {
        setSelectedBath(bath);
        setOpenDetailsDialog(true);
    };

    const handleDetailsClose = () => {
        setOpenDetailsDialog(false);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleDialogClose = () => setOpenDialog(false);

    const handleSaveBath = () => {
        if (editMode) {
            setBathData(prevData => prevData.map(item => item.id === currentBath.id ? currentBath : item));
        } else {
            setBathData(prevData => [...prevData, { ...currentBath, id: prevData.length + 1 }]);
        }
        setOpenDialog(false);
    };

    const handleDeleteBath = (id) => setBathData(prevData => prevData.filter(item => item.id !== id));

    const handleLogout = () => {
        Cookies.remove("name_admin");
        Cookies.remove("cus_ida");
        Cookies.remove("accessTokena");
        Cookies.remove("rolea");
        navigate('/');
        window.location.reload(); // Force reload
    };

    const filteredData = bathData.filter(bath =>
        bath.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bath.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bath.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get status counts for dashboard stats
    const pendingCount = bathData.filter(item => item.status === 'Pending').length;
    const inProgressCount = bathData.filter(item => item.status === 'InProgress').length;
    const completedCount = bathData.filter(item => item.status === 'Completed' && item.bathDate === new Date().toISOString().split('T')[0]).length;

    // Get status color and label
    const getStatusInfo = (status) => {
        switch (status) {
            case 'Pending':
                return { color: 'warning', label: 'ລໍຖ້າ' };
            case 'InProgress':
                return { color: 'info', label: 'ກຳລັງດຳເນີນການ' };
            case 'Completed':
                return { color: 'success', label: 'ສຳເລັດແລ້ວ' };
            case 'Canceled':
                return { color: 'error', label: 'ຍົກເລີກ' };
            default:
                return { color: 'default', label: status };
        }
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
                        <Typography variant="h4" fontWeight="bold" color="primary">
                            <Bathtub sx={{ mr: 1, verticalAlign: 'middle' }} />
                            ອາບນ້ຳສັດລ້ຽງ
                        </Typography>
                    </Box>

                    {/* Search and Add Button Row */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', md: '50%' } }}>
                            <TextField
                                placeholder="ຄົ້ນຫາ..."
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
                                }}
                            />
                        </Box>
                    </Box>
                    <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#e3f2fd' }}>
                                <TableRow>
                                    <TableCell>ຊື່ສັດລ້ຽງ</TableCell>
                                    <TableCell>ຊື່ເຈົ້າຂອງ</TableCell>
                                    <TableCell>ກົງທີຈອງ</TableCell>
                                    <TableCell>ວັນທີເລີ່ມຝາກ</TableCell>
                                    <TableCell>ວັນທີຮັບກັບ</TableCell>
                                    <TableCell>ປະເພດສັດລ້ຽງ</TableCell>
                                    <TableCell>ເພດສັດລ້ຽງ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.map((bath) => (
                                    <TableRow key={bath.id}>
                                        <TableCell>{bath.petName}</TableCell>
                                        <TableCell>{bath.petType}</TableCell>
                                        <TableCell>{bath.ownerName}</TableCell>
                                        <TableCell>{bath.phone}</TableCell>
                                        <TableCell>{bath.bathDate}</TableCell>
                                        <TableCell>{bath.timeSlot}</TableCell>
                                        <TableCell>{bath.staffAssigned}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </Box>
        </Box>
    );
}

export default BathPet;