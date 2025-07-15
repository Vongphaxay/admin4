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
    Phone,
    Email,
    Search,
    DateRange,
    AccessTime,
    Info,
    EventNote,
    PetsOutlined,
    CheckCircleOutline
} from '@mui/icons-material';
import Cookies from 'js-cookie';
import { GetAllcategory_service, UpdateBooking_groomer_shower, UpdateStatus_groomer } from '../services/report.service';

// Create a custom styled container for the logo
const LogoContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
    height: 64,
    backgroundColor: theme.palette.primary.dark
}));

const admin_name = decodeURIComponent(Cookies.get("name_groomer") || "");
const cus_id = Cookies.get("cus_idg");
const accessToken = Cookies.get("accessTokeng");

// Define the drawer width
const drawerWidth = 240;

// Menu items
const menuItems = [
    { icon: <Bathtub />, label: 'ອາບນ້ຳສັດລ້ຽງ', path: '/groomer/bathpet' },
    { icon: <ContentCut />, label: 'ຕັດຂົນສັດລ້ຽງ', path: '/groomer/petbar', active: true },
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
    const [boardingData, setBoardingData] = useState([]);

    // Success dialog state
    const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
    const [openSuccessDialog1, setOpenSuccessDialog1] = useState(false);

    const [selectedBooking, setSelectedBooking] = useState(null);

    // Track which pets have been received
    const [receivedPets, setReceivedPets] = useState({}); // <-- Remove this

    const [successAction, setSuccessAction] = useState(''); // 'receive' or 'save'

    useEffect(() => {
        const getAllCategoryServices = async () => {
            const response = await GetAllcategory_service(2, accessToken);

            if (response && response.report) {
                const flatBoardingData = [];

                response.report.forEach(service => {
                    service.tb_bookings.forEach(booking => {
                        // Extract service info with groomer details, similar to doctor in treatpet.js
                        const serviceInfos = (booking.tb_service_infos || []).map(info => ({
                            id: info.info_id,
                            description: info.description,
                            price: info.price,
                            groomerId: info.doc_id,
                            groomer: {
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
                            groomerId: booking.groomer_id,

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

                            // Add the service info array
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



    // Handle marking a pet as received
    const APIUpdate_groomer_shower = async (book_id) => {
        try {
            const getgroomer_id = Number(Cookies.get('cus_idg'));
            const response = await UpdateBooking_groomer_shower(book_id, getgroomer_id, accessToken);
            console.log("response", response);
        } catch (error) {
            console.error("Error in APIUpdate_groomer_shower:", error);
        }
    }

    const APIUpdateStatus_groomer = async () => {
        try {
            const getgroomer_od = Number(Cookies.get('cus_idg'));
            const response = await UpdateStatus_groomer(getgroomer_od, accessToken);
            console.log("response", response);
        } catch (error) {
            console.error("Error in APIUpdateStatus_groomer:", error);
        }
    }

    const handleReceivePet = (id) => {
        // Optional: update local state


        // Call API to create service info with current booking
        APIUpdate_groomer_shower(id);

        // Set dialog and success UI
        setSelectedBooking(id);
        setSuccessAction('receive');
        setOpenSuccessDialog(true);

        setTimeout(() => {
            setOpenSuccessDialog(false);
            window.location.reload();
        }, 1500);
    };

    const handleReceivePet1 = () => {

        // Call API to create service info with current booking
        APIUpdateStatus_groomer();

        // Set dialog and success UI
        setSuccessAction('receive');
        setOpenSuccessDialog1(true);

        setTimeout(() => {
            setOpenSuccessDialog1(false);
            window.location.reload();
        }, 1500);
    };

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

    const [selectedBoarding, setSelectedBoarding] = useState(null);

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
                        Groomer: {admin_name}
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
                            <ContentCut sx={{ mr: 1, verticalAlign: 'middle' }} />
                            ຕັດຂົນສັດລ້ຽງ
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
                                                {boarding.groomerId ? (
                                                    <Button
                                                        disabled
                                                        sx={{
                                                            bgcolor: '#9e9e9e',
                                                            color: 'white',
                                                            px: 2
                                                        }}
                                                    >
                                                        ຮັບແລ້ວ
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        onClick={() => handleReceivePet(boarding.id)}
                                                        sx={{
                                                            bgcolor: '#1976d2',
                                                            color: 'white',
                                                            '&:hover': { bgcolor: '#1565c0' },
                                                            px: 2
                                                        }}
                                                    >
                                                        ຮັບ
                                                    </Button>
                                                )}

                                                <Button
                                                    onClick={() => handleReceivePet1()}
                                                    disabled={!boarding.groomerId}
                                                    sx={{
                                                        bgcolor:
                                                            boarding.groomerId && boarding.groomerId.length > 0
                                                                ? '#2e7d32'
                                                                : '#818181ff',
                                                        color: 'white',
                                                        '&:hover':
                                                            boarding.groomerId && boarding.groomerId.length > 0
                                                                ? { bgcolor: '#1b5e20' }
                                                                : {},
                                                        px: 2
                                                    }}
                                                >
                                                    ສຳເລັດແລ້ວ
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

            <Dialog
                open={openSuccessDialog}
                aria-labelledby="success-dialog-title"
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: 2,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        padding: 2,
                        maxWidth: 400,
                        margin: 'auto'
                    }
                }}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 3
                }}>
                    <CheckCircleOutline sx={{
                        fontSize: 80,
                        color: '#4caf50',
                        mb: 2
                    }} />
                    <Typography
                        variant="h6"
                        align="center"
                        id="success-dialog-title"
                        sx={{ fontWeight: 'bold' }}
                    >
                        {successAction === 'receive' ?
                            'ຮັບສັດລ້ຽງສຳເລັດແລ້ວ' :
                            'ບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ'
                        }
                    </Typography>
                </Box>
            </Dialog>
            <Dialog
                open={openSuccessDialog1}
                aria-labelledby="success-dialog-title"
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: 2,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        padding: 2,
                        maxWidth: 400,
                        margin: 'auto'
                    }
                }}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 3
                }}>
                    <CheckCircleOutline sx={{
                        fontSize: 80,
                        color: '#4caf50',
                        mb: 2
                    }} />
                    <Typography
                        variant="h6"
                        align="center"
                        id="success-dialog-title"
                        sx={{ fontWeight: 'bold' }}
                    >
                        {successAction === 'receive' ?
                            'ສຳເລັດແລ້ວ' :
                            'ບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ'
                        }
                    </Typography>
                </Box>
            </Dialog>
        </Box>
    );
};

export default PetBar;