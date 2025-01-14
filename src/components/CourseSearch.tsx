import * as React from 'react';
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Button from '@mui/material/Button';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import useTheme from '@mui/material/styles/useTheme';
import { Drawer, MenuItem, Select, SelectChangeEvent, selectClasses, styled, SvgIconProps } from '@mui/material';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import UnfoldMoreSharpIcon from '@mui/icons-material/UnfoldMoreSharp';
import { useState } from 'react';

const drawerWidth = 300;

export default function CourseSearch() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const theme = useTheme(); 

  const [degree, setDegree] = useState(0);
  const handleDegreeChange = (event: SelectChangeEvent) => {
      if(event.target.value === undefined) return;

      setDegree(Number(event.target.value));
  };

  const [term, setTerm] = useState(0);
  const handleTermChange = (event: SelectChangeEvent) => {
      if(event.target.value === undefined) return;

      setTerm(Number(event.target.value));
  };

  const CustomSelect = styled(Select)({
        border: '2px solid',
        textAlign: 'center',
        width: '100%',
        color: theme.palette.text.primary,
        borderColor: theme.palette.divider,
        maxHeight: 45,
        '&.MuiList-root': {
        p: '8px',
        },
        [`& .${selectClasses.select}`]: {
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        p: '16px',
        },
  });

  const DrawerList = (
    <Box role="presentation" sx={{p: '10px', boxSizing: 'border-box', width: drawerWidth, maxWidth: drawerWidth, backgroundColor: `${theme.palette.background.default}`}} >
      <Button disableElevation variant="contained" sx={{fontSize: '16px', border: '2px solid', borderColor: theme.palette.divider, backgroundColor: theme.palette.background.default, height: 45, textTransform: 'none'}} startIcon={<ChevronLeftOutlinedIcon sx={{fontSize: 'small'}}/>} onClick={toggleDrawer(false)}>Back</Button>
      <Divider sx={{mt: '10px', mb: '10px'}}/>
      <CustomSelect sx={{mb: '10px'}} fullWidth value={`${degree}`} onChange={handleDegreeChange}
            IconComponent={React.forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (<UnfoldMoreSharpIcon fontSize="small" sx={{fill: 'white'}} {...props} ref={ref}/>))}
            inputProps={{
                MenuProps: {
                PaperProps: {
                    sx: {
                    backgroundColor: theme.palette.background.default
                    }
                }
                }
            }}>
                <MenuItem key={0} value={0}>Undergraduate</MenuItem>
                <MenuItem key={1} value={1}>Master</MenuItem>
                <MenuItem key={2} value={2}>PhD</MenuItem>
                <MenuItem key={3} value={3}>Doctor Of Medicine</MenuItem>
                <MenuItem key={4} value={4}>Zero Years of Master's Program</MenuItem>
      </CustomSelect>
      <CustomSelect fullWidth value={`${term}`} onChange={handleTermChange}
            IconComponent={React.forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (<UnfoldMoreSharpIcon fontSize="small" sx={{fill: 'white'}} {...props} ref={ref}/>))}
            inputProps={{
                MenuProps: {
                PaperProps: {
                    sx: {
                    backgroundColor: theme.palette.background.default
                    }
                }
                }
            }}>
                <MenuItem key={0} value={0}>Spring 2025</MenuItem>
                <MenuItem key={1} value={1}>Fall 2024</MenuItem>
                <MenuItem key={2} value={2}>Summer 2024</MenuItem>
                <MenuItem key={3} value={3}>Spring 2024</MenuItem>
      </CustomSelect>
      <List>
      </List>
    </Box>
  );

  return (
    <>
      <Button variant="contained" color="success" sx={{maxHeight: 45, textTransform: 'none'}} startIcon={<AddCircleOutline sx={{fontSize: 4}}/>} onClick={toggleDrawer(true)}>Add course</Button>
      <Drawer BackdropProps={{ invisible: true }} open={open} onClose={toggleDrawer(false)} sx={{width: drawerWidth}}>
        {DrawerList}
      </Drawer> 
    </>
  );
}
