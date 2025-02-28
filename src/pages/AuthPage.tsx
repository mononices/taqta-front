import { AppBar, Box, Button, Container, Grid2 as Grid, Toolbar, Typography } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import { API_URL } from "./config";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router";
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';

const clientId = "121639455149-rhqkts2qitpk0ug4iqsqalgq67o2q0ea.apps.googleusercontent.com";

const SignInGoogle = () => {
    const navigate = useNavigate();

    const handleSuccess = (response: any) => {
        fetch("http://localhost:8000/api/auth/google/callback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user: jwtDecode(response.credential)}),
            })
            .then((res) => res.json())
            .then((data) => {
                localStorage.setItem('token', data.token);
                navigate("/scheduler");
            });
    };

    const handleFailure = () => {
        console.log("Failed!");
    }

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin theme="outline" shape="square" onSuccess={handleSuccess} onError={handleFailure}/>
        </GoogleOAuthProvider>
    );
}

const pages = [
    {
        'key': 'Scheduler',
        'href': '/scheduler'
    },
    {
        'key': 'Admin',
        'href': '/admin'
    }
]

export default function AuthPage() {
    const navigate = useNavigate();

    return (
    <Box sx={{height: '100%', display: 'flex', flexGrow: 0}}>
    <AppBar position="fixed" color="secondary">
        <Container maxWidth="xl">
            <Toolbar disableGutters>
                <SpaceDashboardIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    href="#"
                    sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none',
                    }}
                >
                   TAQTA 
                </Typography>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    {pages.map((page) => (
                        <Button
                            key={page.key}
                            onClick={() => navigate(page.href)}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            {page.key}
                        </Button>
                    ))}
                </Box>
            </Toolbar>
        </Container>
    </AppBar>
    <Box sx={{width: '80%', flexGrow: 0, alignItems: 'center', margin: "auto", padding: "5%", borderRadius: "10px", justifyContent: "center", flexDirection: "column", display: "flex", backgroundImage: "url('./gradient.jpg')"}}>
            <Typography variant="h1" sx={{mb: '20px', textAlign: "center"}}>
                Generate complex schedules automagically
            </Typography>
            <Box>
            <SignInGoogle></SignInGoogle>
            </Box>
    </Box>
    </Box>
    );
}