import { Box, Drawer, Paper, List, ListItem, ListItemButton, ListItemIcon } from "@mui/material";
import { Settings } from "@mui/icons-material";
import SidebarContent from "./SidebarContent";

export default function Sidebar({
  sidebarOpen,
  activeTab,
  setActiveTab,
  sidebarItems,
  allFiles,
  activeFile,
  handleFileSelect,
  handleNewFile,
  handleDownloadFile,
  handleRenameFile,
  handleDeleteFile,
}) {
  return (
    <Box sx={{ display: "flex" }}>
      <Paper
        square
        elevation={0}
        sx={{
          width: 48,
          backgroundColor: "#323233",
          borderRight: "1px solid #2d2d30",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <List sx={{ py: 1, flex: 1 }}>
          {sidebarItems.map((item, index) => (
            <ListItem key={item.key} disablePadding>
              <ListItemButton
                selected={activeTab === index}
                onClick={() => setActiveTab(index)}
                sx={{ justifyContent: "center", py: 1.5, minHeight: 0 }}
              >
                <ListItemIcon sx={{ minWidth: 0, color: "inherit" }}>{item.icon}</ListItemIcon>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <List sx={{ py: 1 }}>
          <ListItem disablePadding>
            <ListItemButton sx={{ justifyContent: "center", py: 1.5 }}>
              <ListItemIcon sx={{ minWidth: 0, color: "inherit" }}>
                <Settings />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </List>
      </Paper>
      <Drawer
        variant="persistent"
        open={sidebarOpen}
        PaperProps={{
          sx: {
            position: "relative",
            width: 280,
            backgroundColor: "#252526",
            borderRight: "1px solid #2d2d30",
            transition: "width 0.3s ease",
            ...(sidebarOpen ? {} : { width: 0, overflow: "hidden" }),
          },
        }}
      >
        <SidebarContent
          activeTab={activeTab}
          allFiles={allFiles}
          onFileSelect={handleFileSelect}
          activeFile={activeFile}
          handleNewFile={handleNewFile}
          handleDownloadFile={handleDownloadFile}
          handleRenameFile={handleRenameFile}
          handleDeleteFile={handleDeleteFile}
        />
      </Drawer>
    </Box>
  );
}