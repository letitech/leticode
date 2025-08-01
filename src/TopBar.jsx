import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

const menuItems = [
  {
    label: "File",
    options: [
      { label: "New File (Ctrl+Alt+N)", action: "newFile" },
      { label: "Open File", action: "openFile" },
      { label: "Save", action: "save" },
      { label: "Save As", action: "saveAs" },
    ],
  },
//   { label: "Edit", options: [{ label: "Option 1" }, { label: "Option 2" }, { label: "Option 3" }] },
//   { label: "Selection", options: [{ label: "Option 1" }, { label: "Option 2" }, { label: "Option 3" }] },
//   { label: "View", options: [{ label: "Option 1" }, { label: "Option 2" }, { label: "Option 3" }] },
//   { label: "Go", options: [{ label: "Option 1" }, { label: "Option 2" }, { label: "Option 3" }] },
//   { label: "Run", options: [{ label: "Option 1" }, { label: "Option 2" }, { label: "Option 3" }] },
//   { label: "Terminal", options: [{ label: "Option 1" }, { label: "Option 2" }, { label: "Option 3" }] },
//   { label: "Help", options: [{ label: "Option 1" }, { label: "Option 2" }, { label: "Option 3" }] },
];

export default function TopBar({
  sidebarOpen,
  setSidebarOpen,
  anchorEl,
  setAnchorEl,
  currentMenu,
  setCurrentMenu,
  handleNewFile,
  handleOpenFile,
  handleSave,
  handleSaveAs,
}) {
  const handleMenuClick = (event, menu) => {
    setAnchorEl(event.currentTarget);
    setCurrentMenu(menu);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentMenu("");
  };

  const handleMenuAction = (action) => {
    switch (action) {
      case "newFile":
        handleNewFile();
        break;
      case "openFile":
        handleOpenFile();
        break;
      case "save":
        handleSave();
        break;
      case "saveAs":
        handleSaveAs();
        break;
      default:
        break;
    }
    handleMenuClose();
  };

  return (
    <AppBar position="static" elevation={0} sx={{ height: 35, minHeight: 35 }}>
      <Toolbar variant="dense" sx={{ minHeight: 35, px: 1 }}>
        <IconButton
          size="small"
          edge="start"
          color="inherit"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          sx={{ mr: 1 }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>
        {menuItems.map((menu) => (
          <Box key={menu.label} sx={{ position: "relative" }}>
            <IconButton
              size="small"
              color="inherit"
              onClick={(e) => handleMenuClick(e, menu.label)}
              sx={{
                textTransform: "none",
                fontSize: "0.75rem",
                fontWeight: "normal",
                px: 1,
                py: 0.5,
              }}
            >
              {menu.label}
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl) && currentMenu === menu.label}
              onClose={handleMenuClose}
              PaperProps={{
                sx: { backgroundColor: "#2d2d30", border: "1px solid #454545" },
              }}
            >
              {menu.options.map((option, index) => (
                <div key={option.label}>
                  <MenuItem
                    onClick={() => handleMenuAction(option.action || "default")}
                    sx={{ fontSize: "0.75rem" }}
                  >
                    {option.label}
                  </MenuItem>
                  {index === 1 && menu.label === "File" && <Divider />}
                </div>
              ))}
            </Menu>
          </Box>
        ))}
      </Toolbar>
    </AppBar>
  );
}