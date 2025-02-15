import { Box, Button, Grid2 as Grid, Typography } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import { API_URL } from "./config";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router";

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
            <GoogleLogin onSuccess={handleSuccess} onError={handleFailure}/>
        </GoogleOAuthProvider>
    );
}

export default function AuthPage() {
    return (
    <Grid container spacing={2} sx={{width: '100%', justifyContent: 'space-evenly'}}>
        <Grid size={2}>
            <Typography variant="h2" sx={{mb: '20px'}}>
                Generate complex schedules automagically
            </Typography>
            <SignInGoogle></SignInGoogle>
        </Grid>
        <Grid size={2}>
        </Grid>
    </Grid>
    );
}