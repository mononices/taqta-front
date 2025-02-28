import { styled, TextField, TextFieldProps } from "@mui/material";

export const CustomTextField = styled((props: TextFieldProps) => (
    <TextField {...props}/>))(({theme}) => ({
      maxHeight: 45,
      width: '100%',
      '& .MuiInputBase-root': {
        height: 45,
        border: '2px solid',
        borderColor: theme.palette.divider,
      },
      '& .MuiFilledInput-root': {
        textAlign: 'center',
        width: '100%',
        color: theme.palette.text.primary,
      }
}));