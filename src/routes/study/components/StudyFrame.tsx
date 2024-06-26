import React, { useState } from "react";

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Routes, Route, Link } from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';

import AssignmentIcon from '@mui/icons-material/Assignment';
import { Outlet } from "react-router-dom";

import { callThemeGetApi } from '../../../apis/theme/ThemeApi';

import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

export interface StudyFrameProps {
    props: {
        handleChapterSelected: any
    }
}

interface Archivement {
    achievementId: string;
    chapterId: string;
    order: number;
    status: string;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const StudyFrame: React.FC<StudyFrameProps> = ({ props }) => {

    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [archivements, setArchivements] = useState(new Array<Archivement>())

    if (!archivements.length) {
        callThemeGetApi().then(function (response: any) {
            const res = response.data.theme
            setTitle(res.theme)
            setDescription(res.description)
            setArchivements(response.data.archivements.map((e: any) => {
                return {
                    achievementId: e.achievement_id,
                    chapterId: e.chapter_id,
                    order: e.order,
                    status: e.status,
                }
            }))

        }).catch((err: any) => {
            console.error(err)
        });
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {title}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <ListItem key="summary" disablePadding>
                        <Link to={`/study/summary`}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <AssignmentIcon fontSize='large' />
                                </ListItemIcon>
                                <ListItemText primary="Summary" />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    {archivements.map((e, index) => (
                        <Link key={index} to={`/study/chapter?chaptrId=${e.chapterId}`}>
                            <ListItem disablePadding>
                                <ListItemButton onClick={
                                    () => props.handleChapterSelected({ chapterId: e.chapterId, archiveId: e.achievementId })
                                }>
                                    <ListItemIcon>
                                        {e.status === "1" ? <PendingActionsIcon fontSize="large" color="primary" /> :
                                            e.status === "2" ? <DoneOutlineIcon fontSize="large" color="success" /> :
                                                <ContentPasteIcon fontSize="large" color="action" />
                                        }
                                    </ListItemIcon>
                                    <ListItemText primary={`CHAPTER-${index + 1}`} />
                                </ListItemButton>
                            </ListItem>
                        </Link>
                    ))}
                </List>
            </Drawer>
            <Main open={open}>
                <DrawerHeader />
                <Outlet />
            </Main>
        </Box>
    );
};

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3, width: "1200px" }} >
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const drawerWidth = 250;


const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));


export default StudyFrame;
