import React from "react";
import { Box, Typography } from "@mui/material";
import ExplorerSection from "./ExplorerSection";
import SearchSection from "./SearchSection";
import SourceControlSection from "./SourceControlSection";
import ExtensionsSection from "./ExtensionsSection";

export default function SidebarContent({
  activeTab,
  allFiles,
  onFileSelect,
  activeFile,
  handleNewFile,
  handleDownloadFile,
  handleRenameFile,
  handleDeleteFile,
}) {
  const renderSection = () => {
    switch (activeTab) {
      case 0:
        return (
          <ExplorerSection
            allFiles={allFiles}
            onFileSelect={onFileSelect}
            activeFile={activeFile}
            handleNewFile={handleNewFile}
            handleDownloadFile={handleDownloadFile}
            handleRenameFile={handleRenameFile}
            handleDeleteFile={handleDeleteFile}
          />
        );
      case 1:
        return <SearchSection />;
      case 2:
        return <SourceControlSection />;
      case 5:
        return <ExtensionsSection />;
      default:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              No content available
            </Typography>
          </Box>
        );
    }
  };

  return renderSection();
}