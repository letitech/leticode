import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import EditorArea from "./EditorArea";
import StatusBar from "./StatusBar";
import DeleteDialog from "./DeleteDialog";
import TopBar from "./TopBar";

export default function Layout({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  anchorEl,
  setAnchorEl,
  currentMenu,
  setCurrentMenu,
  sidebarItems,
  allFiles,
  activeFile,
  setActiveFile,
  handleFileSelect,
  handleNewFile,
  handleDownloadFile,
  handleRenameFile,
  handleDeleteFile,
  openFiles,
  activeTabIndex,
  setActiveTabIndex,
  code,
  isModified,
  handleCodeChange,
  handleCloseFile,
  handleRunCode,
  terminalOpen,
  setTerminalOpen,
  output,
  inputValue,
  inputPrompt,
  isWaitingForInput,
  setInputValue,
  handleInputSubmit,
  fileInputRef,
  handleFileInputChange,
  handleSave,
  handleSaveAs,
  deleteDialogOpen,
  fileToDelete,
  handleDeleteConfirm,
  handleDeleteCancel,
  handleClearTerminal,
  noFilesOpen,
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <TopBar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        currentMenu={currentMenu}
        setCurrentMenu={setCurrentMenu}
        handleNewFile={handleNewFile}
        handleOpenFile={() => fileInputRef.current.click()}
        handleSave={handleSave}
        handleSaveAs={handleSaveAs}
      />

      <input
        type="file"
        accept=".py"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileInputChange}
      />

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar
          sidebarOpen={sidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarItems={sidebarItems}
          allFiles={allFiles}
          activeFile={activeFile}
          handleFileSelect={handleFileSelect}
          handleNewFile={handleNewFile}
          handleDownloadFile={handleDownloadFile}
          handleRenameFile={handleRenameFile}
          handleDeleteFile={handleDeleteFile}
        />
        <EditorArea
          openFiles={openFiles}
          activeFile={activeFile}
          setActiveFile={setActiveFile}
          code={code}
          isModified={isModified}
          activeTabIndex={activeTabIndex}
          setActiveTabIndex={setActiveTabIndex}
          handleCodeChange={handleCodeChange}
          handleCloseFile={handleCloseFile}
          handleRunCode={handleRunCode}
          terminalOpen={terminalOpen}
          setTerminalOpen={setTerminalOpen}
          output={output}
          inputValue={inputValue}
          inputPrompt={inputPrompt}
          isWaitingForInput={isWaitingForInput}
          setInputValue={setInputValue}
          handleInputSubmit={handleInputSubmit}
          sidebarOpen={sidebarOpen}
          handleClearTerminal={handleClearTerminal}
          noFilesOpen={noFilesOpen}
        />
      </Box>
      <StatusBar />
      <DeleteDialog
        deleteDialogOpen={deleteDialogOpen}
        fileToDelete={fileToDelete}
        handleDeleteConfirm={handleDeleteConfirm}
        handleDeleteCancel={handleDeleteCancel}
      />
    </Box>
  );
}