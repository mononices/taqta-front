import { Box, createTheme, CssBaseline, darkScrollbar, ScopedCssBaseline, ThemeProvider } from '@mui/material'
import './App.css'
import Menu from './components/Menu'
import TimeTable from './components/TimeTable'
import { BrowserRouter, Route } from 'react-router';
import { Routes } from 'react-router';
import AuthPage from './pages/AuthPage';
import { AdminPage } from './pages/AdminPage';

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: (themeParam) => ({
        body: darkScrollbar(),
      }),
    },
    MuiButton: {
        styleOverrides: {
          containedPrimary: {
            color: '#ffffff' 
          },
          containedSecondary: {
            color: '#ffffff'
          },
        },
    },
  },
  palette: {
    mode: "dark",
    background: {
      default: '#101010'
    },
    secondary: {
      main: '#151515'
    },
    divider: 'rgba(105, 105, 105, 0.5)',
    text: {
      primary: '#ffffff',
      secondary: '#ffffff'
    },
    success: { main: "#2e7d32" }, 
  },
  shape: {
    borderRadius: 8
  } 
});

const Scheduler = (
  <Box sx={{display: 'flex'}}>
    <Menu />
    <Box>
      <TimeTable />
    </Box>
  </Box>
);

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />}></Route>
          <Route path="scheduler" element={Scheduler}></Route>
          <Route path="admin" element={<AdminPage />}></Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
};
