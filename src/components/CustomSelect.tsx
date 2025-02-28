import { Select, selectClasses, SelectProps, styled } from "@mui/material";

export const CustomSelect = styled((props: SelectProps) => (
    <Select {...props}/>))(({theme}) => ({
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
}));