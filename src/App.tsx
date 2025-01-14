import { Box, createTheme, ThemeProvider } from '@mui/material'
import './App.css'
import Menu from './components/Menu'
import TimeTable from './components/TimeTable'

const theme = createTheme({
  palette: {
    background: {
      default: '#101010'
    },
    secondary: {
      main: '#151515'
    },
    divider: 'rgba(105, 105, 105, 0.5)',
    text: {
      primary: '#ffffff'
    }
  },
  shape: {
    borderRadius: 8
  } 
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{display: 'flex'}}>
        <Menu />
        <Box>
          <TimeTable />
        </Box>
      </Box>
    </ThemeProvider>
  )
};
