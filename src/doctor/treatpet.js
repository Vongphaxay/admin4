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
    Container,
    Card,
    CardContent,
    Chip
} from '@mui/material';
import {
    Edit,
    Delete,
    Hotel,
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
    LocalHospital,
    Phone,
    Email,
    Search,
    DateRange,
    AccessTime,
    Info,
    EventNote,
    PetsOutlined
} from '@mui/icons-material';
import Cookies from 'js-cookie';
import { GetAllcategory_service } from '../services/report.service';

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
    { icon: <Vaccines />, label: 'ປິ່ນປົວສັດລ້ຽງ', active: true },
];

const TreatPet = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [boardingData, setBoardingData] = useState([]);

    useEffect(() => {
        const getAllCategoryServices = async () => {
            const response = await GetAllcategory_service(4, accessToken);

            if (response && response.report) {
                const flatBoardingData = [];

                response.report.forEach(service => {
                    service.tb_bookings.forEach(booking => {
                        const serviceInfos = (booking.tb_service_infos || []).map(info => ({
                            id: info.info_id,
                            description: info.description,
                            price: info.price,
                            docId: info.doc_id,
                            doctor: {
                                id: info.doc?.doc_id,
                                name: info.doc?.doc_name,
                                phone: info.doc?.tel,
                                address: info.doc?.address,
                            }
                        }));

                        flatBoardingData.push({
                            id: booking.book_id,
                            serviceId: booking.service_id,
                            serviceName: service.service_name,
                            startDate: booking.start_date,
                            endDate: booking.stop_date,
                            total: booking.total,
                            cage: booking.room_id,
                            payid: booking.pay_id,

                            customer: {
                                id: booking.cu?.cus_id,
                                name: booking.cu?.cus_name,
                                phone: booking.cu?.tel,
                                address: booking.cu?.address,
                            },

                            pet: {
                                id: booking.pet?.pet_id,
                                name: booking.pet?.pet_name,
                                type: booking.pet?.pet_type,
                                gender: booking.pet?.gender,
                                size: booking.pet?.size,
                                color: booking.pet?.color,
                                age: booking.pet?.age
                            },

                            tb_service_infos: serviceInfos
                        });
                    });
                });

                setBoardingData(flatBoardingData);
                console.log("flatBoardingData", flatBoardingData);
            }
        };
        getAllCategoryServices();
    }, [accessToken]);

    const today = new Date();
    const completedCount = boardingData.filter(item => {
        const endDate = new Date(item.endDate);
        endDate.setHours(0, 0, 0, 0);

        const isCompleted = endDate < today && item.payid != null;
        console.log('Checking:', {
            pet: item.pet.name,
            endDate: endDate.toISOString().split('T')[0],
            payid: item.payid,
            isCompleted
        });

        return isCompleted;
    }).length;

    const inProgressCount = boardingData.filter(item => item.status === 'InProgress').length;

    const [currentBoarding, setCurrentBoarding] = useState({
        petName: '',
        petType: '',
        breed: '',
        ownerName: '',
        phone: '',
        startDate: '',
        endDate: '',
        status: '',
        notes: '',
        cage: '',
        specialRequirements: ''
    });
    const [selectedBoarding, setSelectedBoarding] = useState(null);

    const handleDialogOpen = (boarding = null) => {
        if (boarding) {
            setCurrentBoarding(boarding);
            setEditMode(true);
        } else {
            setCurrentBoarding({
                petName: '',
                petType: '',
                breed: '',
                ownerName: '',
                phone: '',
                startDate: '',
                endDate: '',
                status: 'Active',
                notes: '',
                cage: '',
                specialRequirements: ''
            });
            setEditMode(false);
        }
        setOpenDialog(true);
    };

    const handleDetailsOpen = (boarding) => {
        setSelectedBoarding(boarding);
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

    const handleSaveBoarding = () => {
        if (editMode) {
            setBoardingData(prevData => prevData.map(item => item.id === currentBoarding.id ? currentBoarding : item));
        } else {
            setBoardingData(prevData => [...prevData, { ...currentBoarding, id: prevData.length + 1 }]);
        }
        setOpenDialog(false);
    };

    const handleDeleteBoarding = (id) => setBoardingData(prevData => prevData.filter(item => item.id !== id));

    const handleLogout = () => {
        navigate('/');
    };

    const filteredData = boardingData.filter(boarding =>
        boarding.pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        boarding.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        boarding.customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );



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
                        Doctor: {admin_name}
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
                            <LocalHospital sx={{ mr: 1, verticalAlign: 'middle' }} />
                            ປິ່ນປົວສັດລ້ຽງ
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
                    {/* <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ bgcolor: '#e8f5e9', boxShadow: 2 }}>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6" color="primary" gutterBottom>ສຳເລັດແລ້ວ</Typography>
                                    <Typography variant="h4" fontWeight="bold" color="primary">
                                        {completedCount}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ bgcolor: '#fff3e0', boxShadow: 2 }}>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6" color="primary" gutterBottom>ກຳລັງປິ່ນປົວ</Typography>
                                    <Typography variant="h4" fontWeight="bold" color="primary">
                                        {inProgressCount}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid> */}
                    <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#e3f2fd' }}>
                                <TableRow>
                                    <TableCell align="center">ຊື່ສັດລ້ຽງ</TableCell>
                                    <TableCell align="center">ຊື່ເຈົ້າຂອງ</TableCell>
                                    <TableCell align="center">ກົງທີຈອງ</TableCell>
                                    <TableCell align="center">ວັນທີເລີ່ມຝາກ</TableCell>
                                    <TableCell align="center">ວັນທີຮັບກັບ</TableCell>
                                    <TableCell align="center">ປະເພດສັດລ້ຽງ</TableCell>
                                    <TableCell align="center">ເພດສັດລ້ຽງ</TableCell>
                                    <TableCell align="center">ຈັດການ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.map((boarding) => (
                                    <TableRow key={boarding.id}>
                                        <TableCell align="center">{boarding.pet.name}</TableCell>
                                        <TableCell align="center">{boarding.customer.name}</TableCell>
                                        <TableCell align="center">{boarding.cage}</TableCell>
                                        <TableCell align="center">{boarding.startDate}</TableCell>
                                        <TableCell align="center">{boarding.endDate}</TableCell>
                                        <TableCell align="center">{boarding.pet.type}</TableCell>
                                        <TableCell align="center">{boarding.pet.gender}</TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                <Button
                                                    // onClick={() => handleOpenCancelDialog(booking)}
                                                    sx={{
                                                        bgcolor: '#1976d2',
                                                        color: 'white',
                                                        '&:hover': { bgcolor: '#1565c0' },
                                                        px: 2
                                                    }}
                                                >
                                                    ຮັບ
                                                </Button>
                                                <Button
                                                    // onClick={() => handleDialogOpen(booking)}
                                                    sx={{
                                                        bgcolor: '#2e7d32',  // Material UI green[800] color
                                                        color: 'white',
                                                        '&:hover': { bgcolor: '#1b5e20' },  // Material UI green[900] for darker hover
                                                        px: 2
                                                    }}
                                                >
                                                    ເພີ່ມເຕີມ
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </Box>
        </Box>
    );
};

export default TreatPet;