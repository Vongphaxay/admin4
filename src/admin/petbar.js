import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, CssBaseline, Drawer, AppBar, Toolbar, List, Typography, Divider,
    IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Paper, Grid, Button, Avatar, Dialog, DialogActions, DialogContent,
    DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TextField, MenuItem, Select, InputLabel, FormControl,
    useTheme, styled, Container, Card, CardContent, Chip
} from '@mui/material';
import {
    Edit, Delete, AddCircle, Home, Person, People, CalendarMonth,
    Pets, Bathtub, ContentCut, Vaccines, Menu, ChevronRight, Notifications,
    Close, Logout, Phone, Search, Info, PetsOutlined, Hotel
} from '@mui/icons-material';
import Cookies from 'js-cookie';

// ກຳນົດ container ສຳລັບ logo
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

// ກຳນົດຄວາມກວ້າງຂອງ drawer
const drawerWidth = 240;

// ລາຍການເມນູ
const menuItems = [
    { icon: <Home />, label: 'ພາບລວມຄລິນິກ', path: '/dashboard' },
    { icon: <People />, label: 'ຂໍ້ມູນພະນັກງານ', path: '/dataemployee' },
    { icon: <People />, label: 'ຂໍ້ມູນລູກຄ້າ', path: '/datacustomer' },
    { icon: <CalendarMonth />, label: 'ຂໍ້ມູນການຈອງ', path: '/databooking' },
    { icon: <Pets />, label: 'ຝາກສັດລ້ຽງ', path: '/petboarding' },
    { icon: <Bathtub />, label: 'ອາບນ້ຳສັດລ້ຽງ', path: '/bathpet' },
    { icon: <ContentCut />, label: 'ຕັດຂົນສັດລ້ຽງ', path: '/petbar', active: true },
    { icon: <Vaccines />, label: 'ປິ່ນປົວສັດລ້ຽງ', path: '/treatpet' },
];

const PetBar = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [petBarData, setPetBarData] = useState([
        {
            id: 1,
            petName: 'ນ້ອຍໂຕ້',
            petType: 'ໝາ',
            breed: 'ພັນລາບລາດໍ',
            weight: '15.2',
            ownerName: 'ທ. ສົມຈິດ ພູເງິນ',
            phone: '020 1234 5678',
            checkInDate: '2025-05-05',
            checkOutDate: '2025-05-12',
            status: 'CheckedIn',
            notes: 'ກິນອາຫານ 2 ຄັ້ງຕໍ່ມື້. ຕ້ອງໄດ້ພາອອກຍ່າງຕອນເຊົ້າ.',
            services: 'ຫ້ອງພັກມາດຕະຖານ, ອາຫານ, ຍ່າງຫຼິ້ນ',
            staffAssigned: 'ທ. ວິໄລ',
            price: '450000',
            cageNumber: 'A12'
        },
        {
            id: 2,
            petName: 'ມິກກີ້',
            petType: 'ແມວ',
            breed: 'ພັນເປີຊຽນ',
            weight: '3.5',
            ownerName: 'ນ. ນິດຕະຍາ ແກ້ວມະນີ',
            phone: '020 8765 4321',
            checkInDate: '2025-05-07',
            checkOutDate: '2025-05-10',
            status: 'Reserved',
            notes: 'ແພ້ອາຫານແມວທົ່ວໄປ, ມີອາຫານສະເພາະນຳມາໃຫ້.',
            services: 'ຫ້ອງພັກພິເສດ, ຫຼິ້ນກັບແມວ',
            staffAssigned: 'ນ. ສຸກສະຫວັນ',
            price: '320000',
            cageNumber: 'B05'
        },
        {
            id: 3,
            petName: 'ເຈຄ',
            petType: 'ໝາ',
            breed: 'ພັນຊິບາ',
            weight: '12.0',
            ownerName: 'ທ. ສີສະຫວາດ ຈັນທະລາ',
            phone: '020 5678 9012',
            checkInDate: '2025-05-01',
            checkOutDate: '2025-05-08',
            status: 'CheckedOut',
            notes: 'ຢາກິນປະຈຳວັນຕອນເຊົ້າ.',
            services: 'ຫ້ອງພັກມາດຕະຖານ, ອາບນ້ຳ, ອາຫານ',
            staffAssigned: 'ທ. ວິໄລ',
            price: '400000',
            cageNumber: 'A08'
        },
        {
            id: 4,
            petName: 'ລີລີ່',
            petType: 'ໝາ',
            breed: 'ພັນພູເດີ້ນ',
            weight: '18.3',
            ownerName: 'ນ. ມະນີລາ ສຸວັນນະສອນ',
            phone: '020 3456 7890',
            checkInDate: '2025-05-08',
            checkOutDate: '2025-05-15',
            status: 'CheckedIn',
            notes: 'ຢ້ານສຽງດັງ, ຕ້ອງອາບນ້ຳໜຶ່ງຄັ້ງ.',
            services: 'ຫ້ອງພັກພິເສດ, ອາຫານພິເສດ, ອາບນ້ຳ, ຍ່າງຫຼິ້ນ',
            staffAssigned: 'ນ. ສຸກສະຫວັນ',
            price: '550000',
            cageNumber: 'A15'
        },
    ]);
    const [currentPetBar, setCurrentPetBar] = useState({
        petName: '', petType: '', breed: '', weight: '',
        ownerName: '', phone: '', checkInDate: '', checkOutDate: '',
        status: '', notes: '', services: '', staffAssigned: '',
        price: '', cageNumber: ''
    });
    const [selectedPetBar, setSelectedPetBar] = useState(null);

    // ຟັງຊັ່ນ handleDialog ທີ່ປັບປຸງໃຫ້ກະທັດຮັດ
    const handleDialogOpen = (petBar = null) => {
        if (petBar) {
            setCurrentPetBar(petBar);
            setEditMode(true);
        } else {
            setCurrentPetBar({
                petName: '', petType: '', breed: '', weight: '',
                ownerName: '', phone: '',
                checkInDate: new Date().toISOString().split('T')[0],
                checkOutDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: 'Reserved', notes: '', services: '',
                staffAssigned: '', price: '', cageNumber: ''
            });
            setEditMode(false);
        }
        setOpenDialog(true);
    };

    const handleDetailsOpen = (petBar) => {
        setSelectedPetBar(petBar);
        setOpenDetailsDialog(true);
    };

    const handleDetailsClose = () => setOpenDetailsDialog(false);
    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const handleDialogClose = () => setOpenDialog(false);
    const handleLogout = () => navigate('/');

    // ຟັງຊັ່ນບັນທຶກຂໍ້ມູນ
    const handleSavePetBar = () => {
        if (editMode) {
            setPetBarData(prevData => prevData.map(item =>
                item.id === currentPetBar.id ? currentPetBar : item));
        } else {
            setPetBarData(prevData =>
                [...prevData, { ...currentPetBar, id: prevData.length + 1 }]);
        }
        setOpenDialog(false);
    };

    // ຟັງຊັ່ນລຶບຂໍ້ມູນ
    const handleDeletePetBar = (id) =>
        setPetBarData(prevData => prevData.filter(item => item.id !== id));

    // ກອງຂໍ້ມູນຕາມການຄົ້ນຫາ
    const filteredData = petBarData.filter(petBar =>
        petBar.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        petBar.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        petBar.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ຄຳນວນສະຖິຕິ
    const checkedInCount = petBarData.filter(item => item.status === 'CheckedIn').length;
    const reservedCount = petBarData.filter(item => item.status === 'Reserved').length;
    const totalCages = 30;
    const occupancyRate = Math.round((checkedInCount / totalCages) * 100);

    // ຟັງຊັ່ນສຳລັບສະແດງສະຖານະ
    const getStatusInfo = (status) => {
        switch (status) {
            case 'Reserved': return { color: 'warning', label: 'ຈອງແລ້ວ' };
            case 'CheckedIn': return { color: 'success', label: 'ເຂົ້າພັກແລ້ວ' };
            case 'CheckedOut': return { color: 'info', label: 'ອອກແລ້ວ' };
            case 'Canceled': return { color: 'error', label: 'ຍົກເລີກ' };
            default: return { color: 'default', label: status };
        }
    };

    // ເນື້ອຫາຂອງແຖບເມນູ
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

            {/* ເມນູສຳລັບໂມບາຍ */}
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
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

                {/* ເມນູສຳລັບເດສທອບ */}
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

            {/* ເນື້ອຫາຫຼັກ */}
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
                    {/* ຫົວຂໍ້ໜ້າ */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" fontWeight="bold" color="primary">
                            <Hotel sx={{ mr: 1, verticalAlign: 'middle' }} />
                            ຕັດຂົນສັດລ້ຽງ
                        </Typography>
                    </Box>

                    {/* ຄົ້ນຫາ ແລະ ປຸ່ມເພີ່ມ */}
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
                    {/* ຕາຕະລາງຂໍ້ມູນ */}
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
                                {filteredData.map((petBar) => (
                                    <TableRow key={petBar.id}>
                                        <TableCell>{petBar.petName}</TableCell>
                                        <TableCell>{petBar.petType}</TableCell>
                                        <TableCell>{petBar.ownerName}</TableCell>
                                        <TableCell>{petBar.phone}</TableCell>
                                        <TableCell>{petBar.checkInDate}</TableCell>
                                        <TableCell>{petBar.checkOutDate}</TableCell>
                                        <TableCell>{petBar.cageNumber}</TableCell>
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

export default PetBar;