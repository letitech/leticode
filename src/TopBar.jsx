import { AppBar, Toolbar, IconButton, Menu, MenuItem } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

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
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuSelect = (menu) => {
    setCurrentMenu(menu);
    handleMenuClose();
    switch (menu) {
      case "new":
        handleNewFile();
        break;
      case "open":
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
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#252526" }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <div>
          <IconButton
            aria-controls="file-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            color="inherit"
          >
            File
          </IconButton>
          <Menu
            id="file-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleMenuSelect("new")}>New</MenuItem>
            <MenuItem onClick={() => handleMenuSelect("open")}>Open</MenuItem>
            <MenuItem onClick={() => handleMenuSelect("save")}>Save</MenuItem>
            <MenuItem onClick={() => handleMenuSelect("saveAs")}>Save As</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}