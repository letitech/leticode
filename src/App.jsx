import { AppBar, Toolbar, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { Menu as MenuIcon, MoreVert } from "@mui/icons-material";

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
  const handleMenuOpen = (event, menu) => {
    setAnchorEl(event.currentTarget);
    setCurrentMenu(menu);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentMenu("");
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
        <Typography variant="h6" sx={{ flexGrow: 1, color: "#d4d4d4" }}>
          LetiCode
        </Typography>
        <div>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={(e) => handleMenuOpen(e, "file")}
            color="inherit"
          >
            <MoreVert />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={currentMenu === "file"}
            onClose={handleMenuClose}
            PaperProps={{ style: { maxHeight: 48 * 4.5, width: "20ch" } }}
          >
            <MenuItem onClick={handleNewFile}>New File</MenuItem>
            <MenuItem onClick={handleOpenFile}>Open File</MenuItem>
            <MenuItem onClick={handleSave}>Save</MenuItem>
            <MenuItem onClick={handleSaveAs}>Save As</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}
