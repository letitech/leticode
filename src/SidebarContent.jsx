import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Add, Code, Search, Extension } from "@mui/icons-material";

export default function SidebarContent({ activeTab, allFiles, onFileSelect, activeFile }) {
  switch (activeTab) {
    case 0: // Explorer
      return (
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase" }}>
              Explorer
            </Typography>
            <IconButton size="small" sx={{ color: "text.secondary" }}>
              <Add fontSize="small" />
            </IconButton>
          </Box>
          <List dense>
            {allFiles.map((file) => (
              <ListItem key={file.name} dense>
                <ListItemButton
                  onClick={() => onFileSelect(file.name)}
                  sx={{
                    backgroundColor: file.name === activeFile ? "#3c3c3c" : "transparent",
                    "&:hover": { backgroundColor: file.name === activeFile ? "#4a4a4a" : "#2d2d2d" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Code sx={{ color: "#3776ab", fontSize: 16 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    primaryTypographyProps={{
                      variant: "body2",
                      sx: { color: file.name === activeFile ? "#ffffff" : "text.secondary" },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      );
    case 1: // Search
      return (
        <Box sx={{ p: 2 }}>
          <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", mb: 2, display: "block" }}>
            Search
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Search"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search sx={{ fontSize: 16 }} />
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 2 }}>
            No results found
          </Typography>
        </Box>
      );
    case 2: // Source Control
      return (
        <Box sx={{ p: 2 }}>
          <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", mb: 2, display: "block" }}>
            Source Control
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            No changes detected
          </Typography>
        </Box>
      );
    case 5: // Extensions
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
              <ListItemText
                primary="Python"
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
          </List>
        </Box>
      );
    default:
      return (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            No content available
          </Typography>
        </Box>
      );
  }
}