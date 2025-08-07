"use client";

import { useState, useEffect, useRef } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
  Box,
  Tab,
  Tabs,
  Paper,
  ThemeProvider,
  CssBaseline,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import {
  FolderOpen,
  Search,
  AccountTree,
  PlayArrow,
  BugReport,
  Extension,
  Settings,
  Close,
  Code,
} from "@mui/icons-material";
import { python } from "@codemirror/lang-python";
import CodeMirror from "@uiw/react-codemirror";
import Theme from "./Theme"; // Assumed to exist
import SidebarContent from "./SidebarContent";
import TopBar from "./TopBar";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentMenu, setCurrentMenu] = useState("");
  const [code, setCode] = useState("");
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [output, setOutput] = useState("");
  const [pyodide, setPyodide] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [isModified, setIsModified] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0); // Active tab index
  const fileInputRef = useRef(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // New state for dialog
  const [fileToDelete, setFileToDelete] = useState(null); // Track file to delete
  const [inputValue, setInputValue] = useState(""); // New state for terminal input
  const [inputPrompt, setInputPrompt] = useState(""); // Store the input prompt from Python
  const [isWaitingForInput, setIsWaitingForInput] = useState(false); // Track if waiting for input

  // Load from localStorage on mount
  useEffect(() => {
    const savedFiles = localStorage.getItem("allFiles");
    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles);
        if (Array.isArray(parsedFiles) && parsedFiles.length > 0) {
          setAllFiles(parsedFiles);
          setOpenFiles(parsedFiles.filter((f) => f.name === parsedFiles[0].name)); // Initialize with first file open
          setActiveFile(parsedFiles[0].name);
          setCode(parsedFiles[0].content || "");
          setActiveTabIndex(0);
          return;
        }
      } catch (e) {
        console.error("Failed to parse localStorage data:", e);
      }
    }
    // Fallback to default state if no valid data
    const defaultFile = { name: "untitled.py", content: "" };
    setAllFiles([defaultFile]);
    setOpenFiles([defaultFile]);
    setActiveFile("untitled.py");
    setCode("");
  }, []);

  // Save to localStorage whenever allFiles changes
  useEffect(() => {
    localStorage.setItem("allFiles", JSON.stringify(allFiles));
  }, [allFiles]);

  // Load Pyodide on component mount
  useEffect(() => {
    async function loadPyodideInstance() {
      const pyodideInstance = await window.loadPyodide();
      await pyodideInstance.loadPackage("micropip");

      // Override Python's input function with sequential handling
      pyodideInstance.runPython(`
        import js
        def custom_input(prompt):
            js.outputPrompt(prompt)
            return js.getInput()
        __builtins__.input = custom_input
      `);
      window.pyodide = pyodideInstance; // Expose to global scope for JS interaction
      setPyodide(pyodideInstance);
    }
    loadPyodideInstance();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "n":
            event.preventDefault();
            handleNewFile();
            break;
          case "o":
            event.preventDefault();
            handleOpenFile();
            break;
          case "s":
            event.preventDefault();
            if (event.shiftKey) handleSaveAs();
            else handleSave();
            break;
          case "w":
            event.preventDefault();
            if (openFiles.length > 0) handleCloseFile();
            break;
          default:
            break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line
  }, [openFiles, activeFile, allFiles]);

  const sidebarItems = [
    { icon: <FolderOpen />, label: "Explorer", key: "explorer" },
    { icon: <Search />, label: "Search", key: "search" },
    { icon: <AccountTree />, label: "Source Control", key: "git" },
    { icon: <PlayArrow />, label: "Run and Debug", key: "debug" },
    { icon: <BugReport />, label: "Debug", key: "bug" },
    { icon: <Extension />, label: "Extensions", key: "extensions" },
  ];

  const handleCodeChange = (value) => {
    setCode(value);
    setOpenFiles((prev) =>
      prev.map((file) =>
        file.name === activeFile ? { ...file, content: value } : file
      )
    );
    setAllFiles((prev) =>
      prev.map((file) =>
        file.name === activeFile ? { ...file, content: value } : file
      )
    );
    setIsModified(true);
  };

  const handleRunCode = async () => {
    if (!pyodide) {
      setOutput("Pyodide is not loaded yet. Please wait.");
      setTerminalOpen(true);
      return;
    }

    setTerminalOpen(true);
    setOutput("Running...\n");
    setIsWaitingForInput(false); // Reset input state

    try {
      pyodide.runPython(`
        import sys
        from io import StringIO
        sys.stdout = StringIO()
      `);

      // Expose functions to Pyodide with sequential input handling
      const inputPromises = [];
      window.outputPrompt = (prompt) => {
        setInputPrompt(prompt);
        setIsWaitingForInput(true);
        return new Promise((resolve) => {
          inputPromises.push(resolve);
        });
      };
      window.getInput = () => {
        return new Promise((resolve) => {
          const resolveInput = (value) => {
            setIsWaitingForInput(false);
            setInputValue("");
            const nextResolve = inputPromises.shift();
            if (nextResolve) nextResolve(value);
            resolve(value);
          };
          window.resolveInput = resolveInput;
        });
      };

      await pyodide.runPythonAsync(code);
      const result = pyodide.runPython("sys.stdout.getvalue()");
      // Preserve string formatting for print with text and variables
      setOutput((prev) => prev + result.replace(/\n/g, "\n") + "\n");
    } catch (error) {
      setOutput((prev) => prev + `Error: ${error.message}\n`);
    }
  };

  const handleInputSubmit = (e) => {
    if (e.key === "Enter" && isWaitingForInput) {
      e.preventDefault();
      if (window.resolveInput) {
        window.resolveInput(inputValue);
        setOutput((prev) => prev + `${inputPrompt}\n${inputValue}\n`); // Show prompt and input on separate lines
      }
    }
  };

  const handleNewFile = () => {
    const newFileName = `untitled-${allFiles.length + 1}.py`;
    const newFile = { name: newFileName, content: "" };
    setAllFiles((prev) => [...prev, newFile]);
    setOpenFiles((prev) => [...prev, newFile]);
    setActiveFile(newFileName);
    setCode("");
    setTerminalOpen(false);
    setIsModified(false);
    setActiveTabIndex(openFiles.length); // Update to new index
  };

  const handleOpenFile = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith(".py")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newFile = { name: file.name, content: event.target.result };
        setAllFiles((prev) => {
          if (!prev.some((f) => f.name === file.name)) {
            return [...prev, newFile];
          }
          return prev.map((f) =>
            f.name === file.name ? { ...f, content: event.target.result } : f
          );
        });
        setOpenFiles((prev) => {
          if (!prev.some((f) => f.name === file.name)) {
            return [...prev, newFile];
          }
          return prev.map((f) =>
            f.name === file.name ? { ...f, content: event.target.result } : f
          );
        });
        setActiveFile(file.name);
        setCode(event.target.result);
        setActiveTabIndex(openFiles.findIndex((f) => f.name === file.name)); // Update to the opened file index
      };
      reader.readAsText(file);
    } else {
      alert("Please select a .py file");
    }
    e.target.value = null;
  };

  const handleSave = () => {
    if (activeFile === "untitled.py") {
      handleSaveAs();
    } else {
      const file = openFiles.find((f) => f.name === activeFile);
      if (file) downloadFile(file.content, file.name);
    }
    setIsModified(false); // Reset modified indicator on save
  };

  const handleSaveAs = () => {
    const newFileName = prompt("Enter the file name:", activeFile) || activeFile;
    if (newFileName) {
      const validFileName = newFileName.endsWith(".py") ? newFileName : `${newFileName}.py`;
      const fileContent = openFiles.find((f) => f.name === activeFile)?.content || "";
      setAllFiles((prev) => {
        if (!prev.some((f) => f.name === validFileName)) {
          return [...prev, { name: validFileName, content: fileContent }];
        }
        return prev.map((f) =>
          f.name === activeFile ? { ...f, name: validFileName, content: fileContent } : f
        );
      });
      setOpenFiles((prev) =>
        prev.map((f) =>
          f.name === activeFile ? { ...f, name: validFileName, content: fileContent } : f
        )
      );
      setActiveFile(validFileName);
      downloadFile(fileContent, validFileName);
      setIsModified(false); // Reset modified indicator on save
      setActiveTabIndex(openFiles.findIndex((f) => f.name === validFileName)); // Update to the new name index
    }
  };

  const downloadFile = (content, name) => {
    const blob = new Blob([content], { type: "text/x-python" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCloseFile = () => {
    const currentIndex = openFiles.findIndex((file) => file.name === activeFile);
    setOpenFiles((prev) => prev.filter((file) => file.name !== activeFile));
    const remainingFiles = openFiles.filter((file) => file.name !== activeFile);
    if (remainingFiles.length > 0) {
      const newActiveIndex = currentIndex > 0 ? currentIndex - 1 : 0;
      const newActiveFile = remainingFiles[newActiveIndex].name;
      setActiveFile(newActiveFile);
      setCode(allFiles.find((file) => file.name === newActiveFile)?.content || "");
      setActiveTabIndex(newActiveIndex);
    } else {
      setActiveFile(null);
      setCode("");
      setActiveTabIndex(-1);
    }
    setIsModified(false);
  };

  const handleFileSelect = (fileName) => {
    if (!openFiles.some((file) => file.name === fileName)) {
      const file = allFiles.find((f) => f.name === fileName);
      if (file) {
        setOpenFiles((prev) => [...prev, file]);
      }
    }
    setActiveFile(fileName);
    setCode(allFiles.find((file) => file.name === fileName)?.content || "");
    setActiveTabIndex(openFiles.findIndex((f) => f.name === fileName)); // Update to the selected file index
    setIsModified(false);
  };

  const handleDownloadFile = (fileName) => {
    const file = allFiles.find((f) => f.name === fileName);
    if (file) downloadFile(file.content, file.name);
  };

  const handleRenameFile = (fileName) => {
    const newName = prompt("Enter the new file name:", fileName) || fileName;
    if (newName && newName !== fileName) {
      const validNewName = newName.endsWith(".py") ? newName : `${newName}.py`;
      const file = allFiles.find((f) => f.name === fileName);
      if (file && !allFiles.some((f) => f.name === validNewName)) {
        setAllFiles((prev) =>
          prev.map((f) => (f.name === fileName ? { ...f, name: validNewName } : f))
        );
        setOpenFiles((prev) =>
          prev.map((f) => (f.name === fileName ? { ...f, name: validNewName } : f))
        );
        if (activeFile === fileName) {
          setActiveFile(validNewName);
          setActiveTabIndex(openFiles.findIndex((f) => f.name === validNewName));
        }
      } else {
        alert("The name already exists or is invalid.");
      }
    }
  };

  const handleDeleteFile = (fileName) => {
    setFileToDelete(fileName);
    setDeleteDialogOpen(true); // Open the dialog
  };

  const handleDeleteConfirm = () => {
    if (fileToDelete) {
      setAllFiles((prev) => prev.filter((f) => f.name !== fileToDelete));
      setOpenFiles((prev) => prev.filter((f) => f.name !== fileToDelete));
      if (activeFile === fileToDelete) {
        const remainingFiles = openFiles.filter((f) => f.name !== fileToDelete);
        if (remainingFiles.length > 0) {
          const newActiveFile = remainingFiles[0].name;
          setActiveFile(newActiveFile);
          setCode(allFiles.find((f) => f.name === newActiveFile)?.content || "");
          setActiveTabIndex(0);
        } else {
          setActiveFile(null);
          setCode("");
          setActiveTabIndex(-1);
        }
      }
    }
    setDeleteDialogOpen(false); // Close the dialog
    setFileToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setFileToDelete(null);
  };

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <TopBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          currentMenu={currentMenu}
          setCurrentMenu={setCurrentMenu}
          handleNewFile={handleNewFile}
          handleOpenFile={handleOpenFile}
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
                      <ListItemIcon sx={{ minWidth: 0, color: "inherit" }}>
                        {item.icon}
                      </ListItemIcon>
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
                          setCode(file.content);
                          setActiveTabIndex(index);
                          setIsModified(false);
                        }}
                      />
                    ))}
                  </Tabs>
                  <IconButton
                    size="small"
                    color="inherit"
                    onClick={handleRunCode}
                    sx={{ mr: 1 }}
                    title="Run Code"
                  >
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

                  {terminalOpen && (
                    <Paper
                      square
                      elevation={0}
                      sx={{
                        flex: "0 0 40%",
                        backgroundColor: "#252526",
                        borderTop: "1px solid #2d2d30",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: "#2d2d30",
                          p: 1,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="caption" sx={{ color: "#d4d4d4" }}>
                          Terminal
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => setTerminalOpen(false)}
                          sx={{ color: "#d4d4d4" }}
                        >
                          <Close sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Box>
                      <Box
                        sx={{
                          flex: 1,
                          p: 2,
                          overflowY: "auto",
                          color: "#d4d4d4",
                          fontFamily: '"Monaco", "Cascadia Code", "Roboto Mono", monospace',
                          fontSize: "13px",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {output}
                      </Box>
                      {isWaitingForInput && (
                        <Box sx={{ p: 2, borderTop: "1px solid #2d2d30" }}>
                          <Typography variant="caption" sx={{ color: "#d4d4d4", mb: 1 }}>
                            {inputPrompt}
                          </Typography>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleInputSubmit}
                            autoFocus
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "#1e1e1e",
                                color: "#d4d4d4",
                              },
                              "& .MuiOutlinedInput-input": {
                                padding: "4px 8px",
                              },
                            }}
                          />
                        </Box>
                      )}
                    </Paper>
                  )}
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
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  No files open
                </Typography>
              </Box>
            )}

            <Paper
              square
              elevation={0}
              sx={{
                height: 24,
                backgroundColor: "#0078d4",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <AccountTree sx={{ fontSize: 14 }} />
                  <Typography variant="caption">main</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Code sx={{ fontSize: 14 }} />
                  <Typography variant="caption">Python</Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="caption">Ln 1, Col 1</Typography>
                <Typography variant="caption">Spaces: 4</Typography>
                <Typography variant="caption">UTF-8</Typography>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete {fileToDelete}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
