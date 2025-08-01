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
import Theme from "./Theme"; // Asumido que existe
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
  const [openFiles, setOpenFiles] = useState(() => {
    const savedFiles = localStorage.getItem("allFiles");
    return savedFiles ? JSON.parse(savedFiles) : [{ name: "untitled.py", content: "" }];
  });
  const [allFiles, setAllFiles] = useState(() => {
    const savedFiles = localStorage.getItem("allFiles");
    return savedFiles ? JSON.parse(savedFiles) : [{ name: "untitled.py", content: "" }];
  });
  const [activeFile, setActiveFile] = useState(() => {
    const savedFiles = localStorage.getItem("allFiles");
    return savedFiles ? JSON.parse(savedFiles)[0].name : "untitled.py";
  });
  const [isModified, setIsModified] = useState(false);
  const fileInputRef = useRef(null);

  // Cargar Pyodide al montar el componente
  useEffect(() => {
    async function loadPyodideInstance() {
      const pyodideInstance = await window.loadPyodide();
      await pyodideInstance.loadPackage("micropip");
      setPyodide(pyodideInstance);
    }
    loadPyodideInstance();
  }, []);

  // Guardar en localStorage cuando allFiles cambie
  useEffect(() => {
    localStorage.setItem("allFiles", JSON.stringify(allFiles));
  }, [allFiles]);

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "s":
            event.preventDefault();
            handleSave();
            break;
          case "n":
            event.preventDefault();
            handleNewFile();
            break;
          case "o":
            event.preventDefault();
            handleOpenFile();
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
  }, [openFiles, activeFile, allFiles]);

  const sidebarItems = [
    { icon: <FolderOpen />, label: "Explorer", key: "explorer" },
    { icon: <Search />, label: "Search", key: "search" },
    { icon: <AccountTree />, label: "Source Control", key: "git" },
    { icon: <PlayArrow />, label: "Run and Debug", key: "debug" },
    { icon: <BugReport />, label: "Debug", key: "bug" },
    { icon: <Extension />, label: "Extensions", key: "extensions" },
  ];

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    setOpenFiles((prev) =>
      prev.map((file) =>
        file.name === activeFile ? { ...file, content: newCode } : file
      )
    );
    setAllFiles((prev) =>
      prev.map((file) =>
        file.name === activeFile ? { ...file, content: newCode } : file
      )
    );
    setIsModified(true);
  };

  const handleRunCode = async () => {
    if (!pyodide) {
      setOutput("Pyodide no está cargado aún. Por favor espera.");
      setTerminalOpen(true);
      return;
    }

    setTerminalOpen(true);
    setOutput("Ejecutando...\n");

    try {
      pyodide.runPython(`
        import sys
        from io import StringIO
        sys.stdout = StringIO()
      `);
      await pyodide.runPythonAsync(code);
      const result = pyodide.runPython("sys.stdout.getvalue()");
      setOutput(result || "No hay salida.");
    } catch (error) {
      setOutput(`Error: ${error.message}`);
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
          return prev;
        });
        setOpenFiles((prev) => {
          if (!prev.some((f) => f.name === file.name)) {
            return [...prev, newFile];
          }
          return prev;
        });
        setActiveFile(file.name);
        setCode(event.target.result);
      };
      reader.readAsText(file);
    } else {
      alert("Por favor selecciona un archivo .py");
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
    setIsModified(false); // Reiniciar el indicador al guardar
  };

  const handleSaveAs = () => {
    const newFileName = prompt("Ingresa el nombre del archivo:", activeFile) || activeFile;
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
      setIsModified(false); // Reiniciar el indicador al guardar
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
    setOpenFiles((prev) => prev.filter((file) => file.name !== activeFile));
    const remainingFiles = openFiles.filter((file) => file.name !== activeFile);
    if (remainingFiles.length > 0) {
      const newActiveFile = remainingFiles[remainingFiles.length - 1].name;
      setActiveFile(newActiveFile);
      setCode(allFiles.find((file) => file.name === newActiveFile)?.content || "");
    } else {
      setActiveFile(null);
      setCode("");
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
    setIsModified(false);
  };

  // Generar números de línea basados en el contenido
  const lineNumbers = code.split("\n").map((_, index) => index + 1);

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
                },
              }}
            >
              <SidebarContent
                activeTab={activeTab}
                allFiles={allFiles}
                onFileSelect={handleFileSelect}
                activeFile={activeFile}
              />
            </Drawer>
          </Box>

          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {openFiles.length > 0 ? (
              <>
                <Paper square elevation={0} sx={{ backgroundColor: "#2d2d30", display: "flex", alignItems: "center" }}>
                  <Tabs value={0} variant="scrollable" scrollButtons="auto" sx={{ minHeight: 35, flexGrow: 1 }}>
                    {openFiles.map((file) => (
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
                        onClick={() => handleFileSelect(file.name)}
                      />
                    ))}
                  </Tabs>
                  <IconButton
                    size="small"
                    color="inherit"
                    onClick={handleRunCode}
                    sx={{ mr: 1 }}
                    title="Ejecutar Código"
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
                      display: "flex",
                    }}
                  >
                    <Box
                      sx={{
                        width: 50,
                        backgroundColor: "#252526",
                        color: "#858585",
                        fontFamily: '"Monaco", "Cascadia Code", "Roboto Mono", monospace',
                        fontSize: "14px",
                        lineHeight: "1.5",
                        padding: "16px 0",
                        textAlign: "right",
                        userSelect: "none",
                        overflow: "hidden",
                      }}
                    >
                      {lineNumbers.map((number) => (
                        <Box key={number} sx={{ padding: "0 10px", height: "21px" }}>
                          {number}
                        </Box>
                      ))}
                    </Box>
                    <Box
                      component="textarea"
                      value={code}
                      onChange={handleCodeChange}
                      sx={{
                        flex: 1,
                        backgroundColor: "#1e1e1e",
                        color: "#d4d4d4",
                        fontFamily: '"Monaco", "Cascadia Code", "Roboto Mono", monospace',
                        fontSize: "14px",
                        lineHeight: "1.5",
                        padding: "16px",
                        border: "none",
                        outline: "none",
                        resize: "none",
                        overflow: "auto",
                        "&::-webkit-scrollbar": { width: "8px" },
                        "&::-webkit-scrollbar-thumb": { backgroundColor: "#555" },
                      }}
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
                  No hay archivos abiertos
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
      </Box>
    </ThemeProvider>
  );
}