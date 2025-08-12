import React from "react";
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { Add, Code } from "@mui/icons-material";

export default function ExplorerSection({
  allFiles,
  onFileSelect,
  activeFile,
  handleNewFile,
  handleDownloadFile,
  handleRenameFile,
  handleDeleteFile,
}) {
  const [contextMenu, setContextMenu] = React.useState(null);
  const [selectedFile, setSelectedFile] = React.useState(null);

  const handleContextMenu = (event, fileName) => {
    event.preventDefault();
    setSelectedFile(fileName);
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
        : null
    );
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
    setSelectedFile(null);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase" }}>
          Explorer
        </Typography>
        <IconButton size="small" sx={{ color: "text.secondary" }} onClick={handleNewFile}>
          <Add fontSize="small" />
        </IconButton>
      </Box>
      <List dense>
        {allFiles.map((file) => (
          <ListItem key={file.name} dense onContextMenu={(e) => handleContextMenu(e, file.name)}>
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
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        PaperProps={{
          sx: { backgroundColor: "#2d2d30", border: "1px solid #454545" },
        }}
      >
        <MenuItem
          onClick={() => {
            if (selectedFile) onFileSelect(selectedFile);
            handleCloseContextMenu();
          }}
          sx={{ fontSize: "0.75rem", color: "#d4d4d4" }}
        >
          Open
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedFile) handleDownloadFile(selectedFile);
            handleCloseContextMenu();
          }}
          sx={{ fontSize: "0.75rem", color: "#d4d4d4" }}
        >
          Download
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedFile) handleRenameFile(selectedFile);
            handleCloseContextMenu();
          }}
          sx={{ fontSize: "0.75rem", color: "#d4d4d4" }}
        >
          Rename
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedFile) handleDeleteFile(selectedFile);
            handleCloseContextMenu();
          }}
          sx={{ fontSize: "0.75rem", color: "#d4d4d4" }}
        >
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
}