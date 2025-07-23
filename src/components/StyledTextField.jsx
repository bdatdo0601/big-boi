import { styled, TextField } from '@mui/material';

export const StyledTextField = styled(TextField)({
  '& label': {
    color: 'var(--input)',
  },
  '& label.Mui-focused': {
    color: 'var(--primary)',
  },
  '& .MuiInputBase-input': {
    color: 'var(--input)',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'var(--primary)',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'var(--input)',
    },
    '&:hover fieldset': {
      borderColor: 'var(--foreground)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--foreground)',
    },
  },
});
