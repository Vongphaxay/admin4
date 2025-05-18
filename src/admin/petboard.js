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
    PetsOutlined
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
    { icon: <Pets />, label: 'ຝາກສັດລ້ຽງ', path: '/petboarding', active: true },
    { icon: <Bathtub />, label: 'ອາບນ້ຳສັດລ້ຽງ', path: '/bathpet' },
    { icon: <ContentCut />, label: 'ຕັດຂົນສັດລ້ຽງ', path: '/petbar' },
    { icon: <Vaccines />, label: 'ປິ່ນປົວສັດລ້ຽງ', path: '/treatpet' },
];

const PetBoarding = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [boardingData, setBoardingData] = useState([
        {
            id: 1,
            petName: 'ດາວດາຍ',
            petType: 'ໝາ',
            breed: 'ພັນຈັງເຊຍ',
            ownerName: 'ທ. ວິໄລສັກ ວັນນະລາດ',
            phone: '020 7654 3210',
            startDate: '2025-05-07',
            endDate: '2025-05-10',
            status: 'Active',
            notes: 'ອາຫານ: ອາຫານແຫ້ງພິເສດ 2 ຄັ້ງຕໍ່ມື້. ຢາ: ໃຫ້ຢາຕອນເຊົ້າ ແລະ ແລງ.',
            cage: 'B2',
            specialRequirements: 'ຕ້ອງການພາຍ່າງທຸກມື້ຕອນແລງ. ຕ້ອງການຫຼິ້ນກັບໝາຕົວອື່ນ.'
        },
        {
            id: 2,
            petName: 'ແມວມີ່',
            petType: 'ແມວ',
            breed: 'ພັນແມວໄທ',
            ownerName: 'ນ. ສຸພາພອນ ສີບຸນມີ',
            phone: '020 8765 4321',
            startDate: '2025-05-06',
            endDate: '2025-05-12',
            status: 'Active',
            notes: 'ອາຫານ: ອາຫານກະປ໋ອງ 3 ຄັ້ງຕໍ່ມື້. ຕ້ອງການຊາຍແມວພິເສດ.',
            cage: 'C3',
            specialRequirements: 'ບໍ່ມັກສຽງດັງ. ຕ້ອງການຂອງຫຼິ້ນພິເສດ.'
        },
        {
            id: 3,
            petName: 'ໂຕໂຕ້',
            petType: 'ໝາ',
            breed: 'ພັນຈີນິກເຊີ',
            ownerName: 'ທ. ປະເສີດ ດວງຈັນ',
            phone: '020 9876 5432',
            startDate: '2025-05-05',
            endDate: '2025-05-08',
            status: 'Completed',
            notes: 'ອາຫານ: ອາຫານແຫ້ງ ແລະ ອາຫານປຽກ. ຈຳກັດນ້ຳໜັກອາຫານ.',
            cage: 'A1',
            specialRequirements: 'ຕ້ອງການຜ້າຫົ່ມພິເສດ. ກັງວົນເລື່ອງສຽງ.'
        },
    ]);
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
        boarding.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        boarding.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        boarding.phone.toLowerCase().includes(searchTerm.toLowerCase())
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
                            <Pets sx={{ mr: 1, verticalAlign: 'middle' }} />
                            ຝາກສັດລ້ຽງ
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
                                {filteredData.map((boarding) => (
                                    <TableRow key={boarding.id}>
                                        <TableCell>{boarding.petName}</TableCell>
                                        <TableCell>{boarding.petType}</TableCell>
                                        <TableCell>{boarding.ownerName}</TableCell>
                                        <TableCell>{boarding.phone}</TableCell>
                                        <TableCell>{boarding.startDate}</TableCell>
                                        <TableCell>{boarding.endDate}</TableCell>
                                        <TableCell>{boarding.cage}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* Details Dialog */}
                    <Dialog open={openDetailsDialog} onClose={handleDetailsClose} maxWidth="md" fullWidth>
                        {selectedBoarding && (
                            <>
                                <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Pets sx={{ mr: 1 }} />
                                    ລາຍລະອຽດການຝາກສັດລ້ຽງ
                                </DialogTitle>
                                <DialogContent>
                                    <Grid container spacing={3} sx={{ mt: 1 }}>
                                        {/* Pet Info Section */}
                                        <Grid item xs={12}>
                                            <Paper sx={{ p: 2, bgcolor: '#f9f9f9' }}>
                                                <Typography variant="h6" color="primary" gutterBottom>
                                                    ຂໍ້ມູນສັດລ້ຽງ
                                                </Typography>
                                                <Divider sx={{ mb: 2 }} />
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle2" color="text.secondary">ຊື່ສັດລ້ຽງ:</Typography>
                                                        <Typography variant="body1" gutterBottom>{selectedBoarding.petName}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle2" color="text.secondary">ຊະນິດສັດລ້ຽງ:</Typography>
                                                        <Typography variant="body1" gutterBottom>{selectedBoarding.petType}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle2" color="text.secondary">ສາຍພັນ:</Typography>
                                                        <Typography variant="body1" gutterBottom>{selectedBoarding.breed}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle2" color="text.secondary">ຄອກ:</Typography>
                                                        <Typography variant="body1" gutterBottom>{selectedBoarding.cage}</Typography>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </Grid>

                                        {/* Owner Info Section */}
                                        <Grid item xs={12}>
                                            <Paper sx={{ p: 2, bgcolor: '#f9f9f9' }}>
                                                <Typography variant="h6" color="primary" gutterBottom>
                                                    ຂໍ້ມູນເຈົ້າຂອງ
                                                </Typography>
                                                <Divider sx={{ mb: 2 }} />
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle2" color="text.secondary">ຊື່ເຈົ້າຂອງ:</Typography>
                                                        <Typography variant="body1" gutterBottom>{selectedBoarding.ownerName}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle2" color="text.secondary">ເບີໂທລະສັບ:</Typography>
                                                        <Typography variant="body1" gutterBottom>{selectedBoarding.phone}</Typography>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </Grid>

                                        {/* Boarding Period Section */}
                                        <Grid item xs={12}>
                                            <Paper sx={{ p: 2, bgcolor: '#f9f9f9' }}>
                                                <Typography variant="h6" color="primary" gutterBottom>
                                                    ໄລຍະເວລາການຝາກ
                                                </Typography>
                                                <Divider sx={{ mb: 2 }} />
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle2" color="text.secondary">ວັນທີເລີ່ມຝາກ:</Typography>
                                                        <Typography variant="body1" gutterBottom>{selectedBoarding.startDate}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle2" color="text.secondary">ວັນທີຮັບກັບ:</Typography>
                                                        <Typography variant="body1" gutterBottom>{selectedBoarding.endDate}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography variant="subtitle2" color="text.secondary">ສະຖານະ:</Typography>
                                                        <Chip
                                                            label={selectedBoarding.status === 'Active' ? 'ກຳລັງຝາກ' : selectedBoarding.status === 'Completed' ? 'ຮັບກັບແລ້ວ' : selectedBoarding.status === 'Canceled' ? 'ຍົກເລີກ' : selectedBoarding.status}
                                                            color={selectedBoarding.status === 'Active' ? 'primary' : selectedBoarding.status === 'Completed' ? 'success' : selectedBoarding.status === 'Canceled' ? 'error' : 'default'}
                                                            size="small"
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </Grid>

                                        {/* Special Requirements Section */}
                                        <Grid item xs={12}>
                                            <Paper sx={{ p: 2, bgcolor: '#f9f9f9' }}>
                                                <Typography variant="h6" color="primary" gutterBottom>
                                                    ລາຍລະອຽດການເບິ່ງແຍງ
                                                </Typography>
                                                <Divider sx={{ mb: 2 }} />
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <Typography variant="subtitle2" color="text.secondary">ບັນທຶກລາຍລະອຽດ (ອາຫານ, ຢາ, ການເບິ່ງແຍງ):</Typography>
                                                        <Typography variant="body1" gutterBottom sx={{ whiteSpace: 'pre-line' }}>
                                                            {selectedBoarding.notes || '-'}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography variant="subtitle2" color="text.secondary">ຄວາມຕ້ອງການພິເສດ:</Typography>
                                                        <Typography variant="body1" gutterBottom sx={{ whiteSpace: 'pre-line' }}>
                                                            {selectedBoarding.specialRequirements || '-'}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => handleDialogOpen(selectedBoarding)} color="primary">
                                        ແກ້ໄຂ
                                    </Button>
                                    <Button onClick={handleDetailsClose} color="primary">
                                        ປິດ
                                    </Button>
                                </DialogActions>
                            </>
                        )}
                    </Dialog>
                </Container>
            </Box>
        </Box>
    );
};

export default PetBoarding;