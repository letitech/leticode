import { Box, Paper, Tabs, Tab, IconButton } from "@mui/material";
import { PlayArrow, Close, Code } from "@mui/icons-material";
import { python } from "@codemirror/lang-python";
import CodeMirror from "@uiw/react-codemirror";
import Terminal from "./Terminal";
import logoImage from "./assets/1.png";

export default function EditorArea({
  openFiles,
  activeFile,
  setActiveFile,
  code,
  isModified,
  activeTabIndex,
  setActiveTabIndex,
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
  sidebarOpen,
  handleClearTerminal,
  noFilesOpen,
}) {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        width: sidebarOpen ? "calc(100% - 328px)" : "calc(100% - 48px)",
        transition: "width 0.3s ease",
      }}
    >
      {openFiles.length > 0 ? (
        <>
          <Paper square elevation={0} sx={{ backgroundColor: "#2d2d30", display: "flex", alignItems: "center" }}>
            <Tabs value={activeTabIndex} variant="scrollable" scrollButtons="auto" sx={{ minHeight: 35, flexGrow: 1 }}>
              {openFiles.map((file, index) => (
                <Tab
                  key={file.name}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Code sx={{ fontSize: 14, color: "#3776ab" }} />
                      <span style={{ fontSize: "0.75rem" }}>{file.name}</span>
                      {isModified && file.name === activeFile && (
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: "white",
                            display: "inline-block",
                          }}
                        />
                      )}
                      <IconButton
                        size="small"
                        sx={{ ml: 0.5, p: 0.25, display: isModified && file.name === activeFile ? "none" : "flex" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveFile(file.name);
                          handleCloseFile();
                        }}
                      >
                        <Close sx={{ fontSize: 12 }} />
                      </IconButton>
                    </Box>
                  }
                  sx={{ minHeight: 35, textTransform: "none" }}
                  onClick={() => {
                    setActiveFile(file.name);
                    setActiveTabIndex(index);
                  }}
                />
              ))}
            </Tabs>
            <IconButton size="small" color="inherit" onClick={handleRunCode} sx={{ mr: 1 }} title="Run Code">
              <PlayArrow sx={{ fontSize: 18 }} />
            </IconButton>
          </Paper>

          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <Box
              sx={{
                flex: terminalOpen ? "0 0 60%" : 1,
                backgroundColor: "#1e1e1e",
                overflow: "auto",
                position: "relative",
              }}
            >
              <CodeMirror
                value={code}
                height="100%"
                width="100%"
                extensions={[python()]}
                onChange={handleCodeChange}
                theme="dark"
                style={{ fontFamily: '"Monaco", "Cascadia Code", "Roboto Mono", monospace', fontSize: "14px" }}
                className="custom-codemirror"
                basicSetup={{ lineNumbers: true, highlightActiveLine: true }}
              />
            </Box>

            <Terminal
              terminalOpen={terminalOpen}
              setTerminalOpen={setTerminalOpen}
              output={output}
              inputValue={inputValue}
              inputPrompt={inputPrompt}
              isWaitingForInput={isWaitingForInput}
              setInputValue={setInputValue}
              handleInputSubmit={handleInputSubmit}
              handleClearTerminal={handleClearTerminal}
            />
          </Box>
        </>
      ) : (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#1e1e1e",
          }}
        >
          {noFilesOpen && <img src={logoImage} alt="LetiCode" style={{ width: "500px", height: "500px" }} />}
        </Box>
      )}
    </Box>
  );
}