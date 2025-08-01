import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#1e1e1e',
      paper: '#252526'
    },
    primary: {
      main: '#0078d4'
    },
    secondary: {
      main: '#37373d'
    },
    text: {
      primary: '#cccccc',
      secondary: '#969696'
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#323233',
          borderBottom: '1px solid #2d2d30'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#252526',
          borderRight: '1px solid #2d2d30'
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#37373d'
          },
          '&.Mui-selected': {
            backgroundColor: '#37373d'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#3c3c3c',
            '& fieldset': {
              borderColor: '#6c6c6c'
            },
            '&:hover fieldset': {
              borderColor: '#0078d4'
            }
          }
        }
      }
    }
  }
});

export default theme;