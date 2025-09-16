import { Box, Typography, TextField, InputAdornment, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Search, Extension } from "@mui/icons-material";

export default function ExtensionsSection() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", mb: 2, display: "block" }}>
        Extensions
      </Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="Search Extensions"
        sx={{ mb: 2 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search sx={{ fontSize: 16 }} />
            </InputAdornment>
          ),
        }}
      />
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
        Popular Extensions
      </Typography>
      <List dense>
        <ListItem>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <Extension sx={{ color: "#9c27b0", fontSize: 16 }} />
          </ListItemIcon>
          <ListItemText primary="Python" primaryTypographyProps={{ variant: "body2" }} />
        </ListItem>
        <ListItem>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <Extension sx={{ color: "#9c27b0", fontSize: 16 }} />
          </ListItemIcon>
          <ListItemText primary="Pylint" primaryTypographyProps={{ variant: "body2" }} />
        </ListItem>
      </List>
    </Box>
  );
}