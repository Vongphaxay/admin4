import LockIcon from '@mui/icons-material/Lock';
import { DialogContent, InputAdornment } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import WcIcon from '@mui/icons-material/Wc';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, CssBaseline, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Grid, Button, Avatar, Dialog, DialogActions, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, MenuItem, Select, InputLabel, FormControl, useTheme, styled, Container
} from '@mui/material';
import {
    Edit, Delete, AddCircle, Home, Person, People, CalendarMonth, Pets, Bathtub, ContentCut, Vaccines, Assessment as AssessmentIcon, AddBoxRounded, Menu, ChevronRight, Notifications, Close, Logout, Phone, Email, Work
} from '@mui/icons-material';
import Cookies from 'js-cookie';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { GetAllEmp } from '../services/report.service';
import { createDoctor, createGroomer, deletedoc, deletegrm, updatedoc, updategroomer } from '../services/createemp.service';

// Create a custom styled container for the logo
const LogoContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
    height: 64,
    backgroundColor: theme.palette.primary.dark
}));

const admin_name = decodeURIComponent(Cookies.get("name_owner") || "");
const cus_id = Cookies.get("cus_ido");
const accessToken = Cookies.get("accessTokeno");

// Define the drawer width
const drawerWidth = 240;

// Menu items
const menuItems = [
    { icon: <Home />, label: 'ພາບລວມຄລິນິກ', path: '/owner/dashboard' },
    { icon: <People />, label: 'ຂໍ້ມູນພະນັກງານ', path: '/owner/dataemployee', active: true },
    { icon: <People />, label: 'ຂໍ້ມູນລູກຄ້າ', path: '/owner/datacustomer' },
    { icon: <CalendarMonth />, label: 'ຂໍ້ມູນການຈອງ', path: '/owner/databooking' },
    { icon: <Pets />, label: 'ຝາກສັດລ້ຽງ', path: '/owner/petboarding' },
    { icon: <Bathtub />, label: 'ອາບນ້ຳສັດລ້ຽງ', path: '/owner/bathpet' },
    { icon: <ContentCut />, label: 'ຕັດຂົນສັດລ້ຽງ', path: '/owner/petbar' },
    { icon: <Vaccines />, label: 'ປິ່ນປົວສັດລ້ຽງ', path: '/owner/treatpet' },
    { icon: <AssessmentIcon />, label: 'ລາຍງານ', path: '/owner/report' },
    { icon: <AddBoxRounded />, label: 'ເພີ່ມກົງສັດລ້ຽງ', path: '/owner/insertCages' },
];

const EmployeeManagement = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [employeeData, setEmployeeData] = useState([]);
    const [currentEmployee, setCurrentEmployee] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("ບັນທຶກສຳເລັດ");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [showPassword, setShowPassword] = useState(false);
    const [createData, setcreateData] = useState([]);//name,gender,address,phone,username,password

    // Add state for delete confirmation dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);

    const APICREATEDoc = async () => {
        try {
            const docData = {
                doc_name: createData.name,
                gender: createData.gender,
                address: createData.address,
                tel: createData.tel,
                username: createData.username,
                password: createData.password,
                status: 'ວ່າງ'
            }
            const response = await createDoctor(docData);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    const APICREATEgrm = async () => {
        try {
            const grmData = {
                groomer_name: createData.name,
                gender: createData.gender,
                address: createData.address,
                tel: createData.tel,
                username: createData.username,
                password: createData.password,
                status: 'ວ່າງ'
            }
            const response = await createGroomer(grmData);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        const getReportAllempapi = async () => {
            const res = await GetAllEmp(accessToken);

            const mappedData = res.report.map((item, index) => ({
                id:
                    item.role === 'doctor'
                        ? item.doc_id
                        : item.role === 'groomer'
                            ? item.groomer_id
                            : item.role === 'emp'
                                ? item.emp_id
                                : `unknown-${index}`, // fallback กรณีไม่มีข้อมูล
                docname: item.doc_name,
                empname: item.emp_name,
                groomer: item.groomer_name,
                role: item.role,
                phone: item.phone,
                gender: item.gender,
                address: item.address,
                tel: item.tel,
                username: item.username,
                status: item.status
            }))
            setEmployeeData(mappedData);
            console.log(res);
        }
        getReportAllempapi();
    }, [accessToken]);
    const fieldKey = currentEmployee.docname !== undefined ? 'docname' : 'empname';

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpenSnackbar(false);
    };

    const handleDialogOpen = (employee = null) => {
        if (employee) {
            console.log("🔍 ຂໍ້ມູນພະນັກງານທີ່ເລືອກແກ້ໄຂ:", employee);

            // ດຶງຊື່ຈາກ field ທີ່ມີຂໍ້ມູນ
            const employeeName = employee.docname || employee.empname || employee.groomer || '';

            // ກຳນົດ position ຕາມ role
            let position = '';
            if (employee.role === 'doctor') {
                position = 'ທ່ານໝໍ';
            } else if (employee.role === 'groomer') {
                position = 'ຊ່າງຕັດຂົນ';
            } else if (employee.role === 'emp') {
                position = 'ພະນັກງານ';
            }

            // ເຊັດຂໍ້ມູນເຂົ້າໃນ createData state
            const employeeData = {
                id: employee.id,
                name: employeeName,
                gender: employee.gender || '',
                address: employee.address || '',
                tel: employee.tel || employee.phone || '',
                username: employee.username || '',
                password: '', // ບໍ່ໃຫ້ສະແດງລະຫັດຜ່ານເກົ່າ
                position: position,
                role: employee.role,
                status: employee.status || ''
            };

            console.log("📝 ຂໍ້ມູນທີ່ຈະນໍາໄປແກ້ໄຂ:", employeeData);

            setcreateData(employeeData);
            setCurrentEmployee(employee);
            setEditMode(true);
        } else {
            console.log("➕ ເປີດໜ້າຕ່າງເພີ່ມພະນັກງານໃໝ່");

            // ເຄລຍ form ສໍາລັບການເພີ່ມພະນັກງານໃໝ່
            const newEmployeeData = {
                name: '',
                gender: '',
                address: '',
                tel: '',
                username: '',
                password: '',
                position: '',
                status: 'ວ່າງ'
            };

            setcreateData(newEmployeeData);
            setCurrentEmployee({});
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

    const handleSaveEmployee = async () => {
        console.log("📥 ຂໍ້ມູນທີ່ຜູ້ໃຊ້ກວດກ່ອນບັນທຶກ:");
        console.table(createData);

        try {
            // ✅ กวดสอบຂໍ້ມູນຊ້ຳກ່ອນບັນທຶກ
            const isDuplicate = checkForDuplicateData();
            if (isDuplicate.hasDuplicate) {
                setSnackbarMessage(`❌ ຂໍ້ມູນຊ້ຳກັນ: ${isDuplicate.message}`);
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
                return; // หยุดการทำงานถ้าพบข้อมูลซ้ำ
            }

            let response = null;

            if (!createData.position) {
                setSnackbarMessage("❌ ກະລຸນາເລືອກຕຳແໜ່ງກ່ອນບັນທຶກ");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
                return;
            }

            if (editMode) {
                console.log("📝 btບັນທຶກການແກ້ໄຂ");

                if (createData.position === 'ທ່ານໝໍ') {
                    const docData = {
                        doc_name: createData.name,
                        gender: createData.gender,
                        address: createData.address,
                        tel: createData.tel,
                        password: createData.password,
                    };
                    console.log(createData.position);
                    response = await updatedoc(currentEmployee.id, docData, accessToken);
                } else if (createData.position === 'ຊ່າງຕັດຂົນ') {
                    const groomerData = {
                        groomer_name: createData.name,
                        gender: createData.gender,
                        address: createData.address,
                        tel: createData.tel,
                        password: createData.password,
                    };
                    response = await updategroomer(currentEmployee.id, groomerData, accessToken);
                } else {
                    throw new Error("Unknown position");
                }
            } else {
                console.log("📌 btບັນທຶກ");

                if (createData.position === 'ທ່ານໝໍ') {
                    const docData = {
                        doc_name: createData.name,
                        gender: createData.gender,
                        address: createData.address,
                        tel: createData.tel,
                        username: createData.username,
                        password: createData.password,
                        status: 'ວ່າງ'
                    };
                    response = await createDoctor(docData);
                } else if (createData.position === 'ຊ່າງຕັດຂົນ') {
                    const grmData = {
                        groomer_name: createData.name,
                        gender: createData.gender,
                        address: createData.address,
                        tel: createData.tel,
                        username: createData.username,
                        password: createData.password,
                        status: 'ວ່າງ'
                    };
                    response = await createGroomer(grmData);
                } else {
                    throw new Error("Unknown position");
                }
            }
            // ✅ ตรวจสอบ error และแสดงผล
            if (response?.error) {
                throw new Error(response.error);
            }

            // ✅ ถ้าไม่มี error ทำการบันทึก
            if (editMode) {
                setEmployeeData(prevData =>
                    prevData.map(item =>
                        item.id === createData.id ? createData : item
                    )
                );
            } else {
                setEmployeeData(prevData => [
                    ...prevData,
                    { ...createData, id: prevData.length + 1 }
                ]);
            }

            setSnackbarMessage("ບັນທຶກສຳເລັດ");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
            setOpenDialog(false);
            
            setTimeout(() => {
                window.location.reload();
            }, 100);

        } catch (error) {
            console.error("❌ API Error:", error.message);
            setSnackbarMessage(`❌ ຂໍ້ຜິດພາດ: ${error.message}`);
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    // ✅ ฟังก์ชันกวดสอບຂໍ້ມູນຊ້ຳ
    const checkForDuplicateData = () => {
        // กรองข้อมูลที่ไม่ใช่ตัวที่กำลังแก้ไข (ในกรณี editMode)
        const otherEmployees = editMode
            ? employeeData.filter(emp => emp.id !== currentEmployee.id)
            : employeeData;

        // ตรวจสอบชื่อซ้ำ
        const nameExists = otherEmployees.some(emp => {
            const existingName = emp.docname || emp.empname || emp.groomer || '';
            return existingName.toLowerCase().trim() === createData.name.toLowerCase().trim();
        });

        if (nameExists) {
            return {
                hasDuplicate: true,
                message: `ຊື່ "${createData.name}" ມີຢູ່ໃນລະບົບແລ້ວ`
            };
        }

        // ตรวจสอบเบอร์โทรซ้ำ
        const phoneExists = otherEmployees.some(emp => {
            const existingPhone = emp.tel || emp.phone || '';
            return existingPhone && existingPhone === createData.tel;
        });

        if (phoneExists && createData.tel) {
            return {
                hasDuplicate: true,
                message: `ເບີໂທລະສັບ "${createData.tel}" ມີຢູ່ໃນລະບົບແລ້ວ`
            };
        }

        // ตรวจสอบ username ซ้ำ
        const usernameExists = otherEmployees.some(emp => {
            const existingUsername = emp.username || '';
            return existingUsername && existingUsername === createData.username;
        });

        if (usernameExists && createData.username) {
            return {
                hasDuplicate: true,
                message: `ຊື່ຜູ້ໃຊ້ມີໃນລະບົບແລ້ວ`
            };
        }

        return {
            hasDuplicate: false,
            message: ''
        };
    };

    // Updated delete handling functions
    const handleDeleteConfirmation = (employee) => {
        console.log("handleDeleteConfirmation", employee);
        setEmployeeToDelete(employee);
        setDeleteDialogOpen(true);
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);
    };

    const handleConfirmDelete = async () => {
        try {
            if (!employeeToDelete) {
                console.warn("employeeToDelete is null");
                setSnackbarMessage("❌ ບໍ່ພົບຂໍ້ມູນທີ່ຈະລຶບ");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
                return;
            }

            // 1. Call API ตาม role
            if (employeeToDelete.role === 'doctor') {
                console.log("Deleting doctor:", employeeToDelete.id);
                await deletedoc(employeeToDelete.id, accessToken);
            } else if (employeeToDelete.role === 'groomer') {
                console.log("Deleting groomer:", employeeToDelete.id);
                await deletegrm(employeeToDelete.id, accessToken);
            } else {
                console.warn("Unknown role:", employeeToDelete.role);
                setSnackbarMessage("❌ ບໍ່ຮູ້ປະເພດພະນັກງານ");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
                return;
            }

            // 2. ลบข้อมูลจาก frontend
            const nameToDelete = employeeToDelete.docname || employeeToDelete.empname || employeeToDelete.groomer;
            console.log("Deleting person with name:", nameToDelete);

            setEmployeeData(prevData =>
                prevData.filter(item =>
                    (item.docname || item.empname || item.groomer) !== nameToDelete
                )
            );

            setSnackbarMessage("✅ ລຶບຂໍ້ມູນສຳເລັດ");
            setSnackbarSeverity("success");
            window.location.reload();
            setOpenSnackbar(true);
        } catch (error) {
            console.error("❌ API Error:", error.message || error);
            setSnackbarMessage(`❌ ຂໍ້ຜິດພາດ: ${error.message || 'ບໍ່ສາມາດລຶບໄດ້'}`);
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        } finally {
            // 3. ปิด dialog และ reset state
            setDeleteDialogOpen(false);
            setEmployeeToDelete(null);
        }
    };


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
                        <Typography variant="h4" fontWeight="bold" color="primary">ຂໍ້ມູນພະນັກງານ</Typography>
                    </Box>

                    <Button
                        variant="contained"
                        sx={{ mb: 3, bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}
                        startIcon={<AddCircle />}
                        onClick={() => handleDialogOpen()}
                    >ເພີ່ມພະນັກງານ</Button>

                    <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#e3f2fd' }}>
                                <TableRow>
                                    <TableCell>ຊື່ ແລະ ນາມສະກຸນ</TableCell>
                                    <TableCell>ເພດ</TableCell>
                                    <TableCell>ທີ່ຢູ່</TableCell>
                                    <TableCell>ເບີໂທລະສັບ</TableCell>
                                    <TableCell>ຊື່ຜູ້ໃຊ້</TableCell>
                                    <TableCell>ຕຳແໜ່ງ</TableCell>
                                    <TableCell>ຈັດການ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {employeeData.map((employee, index) => {
                                    const uniqueKey = `${employee.role}-${employee.id || employee.username || index}`;

                                    return (
                                        <TableRow key={uniqueKey}>
                                            <TableCell>{employee.docname || employee.empname || employee.groomer || '—'}</TableCell>
                                            <TableCell>{employee.gender || '—'}</TableCell>
                                            <TableCell>{employee.address || '—'}</TableCell>
                                            <TableCell>{employee.tel || employee.phone || '—'}</TableCell>
                                            <TableCell>{employee.username || '—'}</TableCell>
                                            <TableCell>
                                                {employee.role === 'doctor'
                                                    ? 'ທ່ານໝໍ'
                                                    : employee.role === 'emp'
                                                        ? 'ພະນັກງານ'
                                                        : employee.role === 'groomer'
                                                            ? 'ຊ່າງຕັດຂົນສັດ'
                                                            : '—'}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => handleDialogOpen(employee)} sx={{ color: '#1976d2' }}>
                                                    <Edit />
                                                </IconButton>
                                                <IconButton onClick={() => handleDeleteConfirmation(employee)} color="error">
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Employee Add/Edit Dialog - ປັບປຸງໃໝ່ */}
                    <Dialog
                        open={openDialog}
                        onClose={handleDialogClose}
                        maxWidth="md"
                        PaperProps={{
                            sx: {
                                borderRadius: 2,
                                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                overflow: 'hidden'
                            }
                        }}
                    >
                        <DialogTitle
                            sx={{
                                bgcolor: theme.palette.primary.main,
                                color: 'white',
                                px: 3,
                                py: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                fontWeight: 'bold'
                            }}
                        >
                            {editMode ? <Edit fontSize="small" /> : <AddCircle fontSize="small" />}
                            {editMode ? 'ແກ້ໄຂຂໍ້ມູນພະນັກງານ' : 'ເພີ່ມພະນັກງານ'}
                        </DialogTitle>

                        <DialogContent sx={{ p: 3, mt: 1 }}>
                            <Grid container spacing={3}>
                                {/* ຂໍ້ມູນສ່ວນຕົວ */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Person fontSize="small" /> ຂໍ້ມູນສ່ວນຕົວ
                                    </Typography>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    label="ຊື່ ແລະ ນາມສະກຸນ"
                                                    fullWidth
                                                    value={createData.name || ''}
                                                    onChange={(e) => setcreateData({ ...createData, name: e.target.value })}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <PersonIcon sx={{ color: 'action.active' }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    label="ເພດ"
                                                    fullWidth
                                                    value={createData.gender || ''}
                                                    onChange={(e) => setcreateData({ ...createData, gender: e.target.value })}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <WcIcon sx={{ color: 'action.active' }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    select
                                                    variant="outlined"
                                                >
                                                    <MenuItem value="ຊາຍ">ຊາຍ</MenuItem>
                                                    <MenuItem value="ຍິງ">ຍິງ</MenuItem>
                                                </TextField>
                                            </Grid>
                                            {!editMode && (
                                                <Grid item xs={12} md={6}>
                                                    <FormControl fullWidth variant="outlined">
                                                        <InputLabel id="position-select-label">ຕຳແໜ່ງ</InputLabel>
                                                        <Select
                                                            labelId="position-select-label"
                                                            id="position-select"
                                                            value={createData.position || ''}
                                                            label="ຕຳແໜ່ງ"
                                                            onChange={(e) => setcreateData({ ...createData, position: e.target.value })}
                                                            startAdornment={
                                                                <InputAdornment position="start">
                                                                    <Work sx={{ color: 'action.active' }} />
                                                                </InputAdornment>
                                                            }
                                                        >
                                                            <MenuItem value="ຊ່າງຕັດຂົນ">ຊ່າງຕັດຂົນ</MenuItem>
                                                            <MenuItem value="ທ່ານໝໍ">ທ່ານໝໍ</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            )}
                                            <Grid item xs={12} md={editMode ? 6 : 12}>
                                                <TextField
                                                    label="ທີ່ຢູ່"
                                                    fullWidth
                                                    value={createData.address || ''}
                                                    onChange={(e) => setcreateData({ ...createData, address: e.target.value })}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <HomeIcon sx={{ color: 'action.active' }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    label="ເບີໂທລະສັບ"
                                                    type="tel"
                                                    fullWidth
                                                    value={createData.tel || ''}
                                                    onChange={(e) => setcreateData({ ...createData, tel: e.target.value })}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <PhoneIcon sx={{ color: 'action.active' }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>

                                {/* ຂໍ້ມູນບັນຊີ */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AccountCircleIcon fontSize="small" /> ຂໍ້ມູນບັນຊີຜູ້ໃຊ້
                                    </Typography>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    label="ຊື່ຜູ້ໃຊ້"
                                                    fullWidth
                                                    value={createData.username || ''}
                                                    onChange={(e) => setcreateData({ ...createData, username: e.target.value })}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <AccountCircleIcon sx={{ color: 'action.active' }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    label="ລະຫັດຜ່ານ"
                                                    type={showPassword ? "text" : "password"}
                                                    fullWidth
                                                    value={createData.password || ''}
                                                    onChange={(e) => setcreateData({ ...createData, password: e.target.value })}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <LockIcon sx={{ color: 'action.active' }} />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                    edge="end"
                                                                >
                                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </DialogContent>

                        <DialogActions sx={{ px: 3, py: 2, bgcolor: '#f5f5f5', borderTop: '1px solid #e0e0e0' }}>
                            <Button
                                onClick={handleDialogClose}
                                variant="outlined"
                                color="inherit"
                                startIcon={<Close />}
                                sx={{ borderRadius: 2, px: 2 }}
                            >
                                ຍົກເລີກ
                            </Button>
                            <Button
                                onClick={handleSaveEmployee}
                                variant="contained"
                                color="primary"
                                startIcon={editMode ? <Edit /> : <AddCircle />}
                                sx={{ borderRadius: 2, px: 2 }}
                            >
                                {editMode ? 'ບັນທຶກການແກ້ໄຂ' : 'ບັນທຶກ'}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Delete Confirmation Dialog */}
                    <Dialog
                        open={deleteDialogOpen}
                        onClose={handleCancelDelete}
                        PaperProps={{
                            sx: {
                                borderRadius: 2,
                                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                minWidth: '400px'
                            }
                        }}
                    >
                        <DialogTitle sx={{
                            bgcolor: '#d32f2f',
                            color: 'white',
                            px: 3,
                            py: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <Delete fontSize="medium" />
                            ຢືນຢັນການລົບຂໍ້ມູນພະນັກງານ
                        </DialogTitle>
                        <DialogContent sx={{ p: 3, mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ bgcolor: '#ffebee', color: '#d32f2f', mr: 2 }}>
                                    <Person fontSize="medium" />
                                </Avatar>
                                <Typography variant="h6">
                                    {employeeToDelete ? (employeeToDelete.docname || employeeToDelete.empname) || employeeToDelete.groomer : ''}
                                </Typography>
                            </Box>
                            <Typography sx={{ color: 'text.secondary', mb: 1 }}>
                                ທ່ານກຳລັງຈະລົບຂໍ້ມູນພະນັກງານນີ້ອອກຈາກລະບົບ
                            </Typography>
                            <Typography sx={{
                                bgcolor: '#fffde7',
                                p: 2,
                                borderRadius: 1,
                                color: '#ff6d00',
                                borderLeft: '4px solid #ff6d00',
                                fontSize: '0.9rem'
                            }}>
                                <b>ໝາຍເຫດ:</b> ການດຳເນີນການນີ້ບໍ່ສາມາດຍົກເລີກໄດ້ ແລະ ຂໍ້ມູນທັງໝົດຂອງພະນັກງານຄົນນີ້ຈະຖືກລົບອອກຈາກລະບົບຖາວອນ
                            </Typography>
                        </DialogContent>
                        <DialogActions sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                            <Button
                                onClick={handleCancelDelete}
                                sx={{
                                    bgcolor: '#e0e0e0',
                                    color: 'text.primary',
                                    px: 3,
                                    '&:hover': { bgcolor: '#bdbdbd' }
                                }}
                            >
                                ຍົກເລີກ
                            </Button>
                            <Button
                                onClick={handleConfirmDelete}
                                variant="contained"
                                color="error"
                                startIcon={<Delete />}
                                sx={{
                                    px: 3,
                                    bgcolor: '#d32f2f',
                                    '&:hover': { bgcolor: '#b71c1c' }
                                }}
                            >
                                ຢືນຢັນການລົບ
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Snackbar for notifications */}
                    <Snackbar
                        open={openSnackbar}
                        autoHideDuration={3000}
                        onClose={handleSnackbarClose}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <MuiAlert
                            onClose={handleSnackbarClose}
                            severity={snackbarSeverity}
                            sx={{ width: '100%' }}
                            elevation={6}
                            variant="filled"
                        >
                            {snackbarMessage}
                        </MuiAlert>
                    </Snackbar>
                </Container>
            </Box>
        </Box>
    );
};

export default EmployeeManagement;