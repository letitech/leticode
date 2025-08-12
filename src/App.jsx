"use client";

import { useState, useEffect, useRef } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import Theme from "./Theme";
import Layout from "./Layout";
import {
  FolderOpen,
  Search,
  AccountTree,
  PlayArrow,
  BugReport,
  Extension,
} from "@mui/icons-material";

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
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const fileInputRef = useRef(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [inputPrompt, setInputPrompt] = useState("");
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);

  useEffect(() => {
    async function loadPyodideInstance() {
      const pyodideInstance = await window.loadPyodide();
      await pyodideInstance.loadPackage("micropip");
      pyodideInstance.runPython(`
        import js
        def custom_input(prompt):
            js.outputPrompt(prompt)
            return js.getInput()
        __builtins__.input = custom_input
      `);
      window.pyodide = pyodideInstance;
      setPyodide(pyodideInstance);
    }
    loadPyodideInstance();
  }, []);

  useEffect(() => {
    localStorage.setItem("allFiles", JSON.stringify(allFiles));
  }, [allFiles]);

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
      prev.map((file) => (file.name === activeFile ? { ...file, content: value } : file))
    );
    setAllFiles((prev) =>
      prev.map((file) => (file.name === activeFile ? { ...file, content: value } : file))
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
    setIsWaitingForInput(false);
    try {
      pyodide.runPython(`
        import sys
        from io import StringIO
        sys.stdout = StringIO()
      `);
      window.outputPrompt = (prompt) => {
        setInputPrompt(prompt);
        setIsWaitingForInput(true);
      };
      window.getInput = () => {
        return new Promise((resolve) => {
          const resolveInput = (value) => {
            setIsWaitingForInput(false);
            setInputValue("");
            resolve(value);
          };
          window.resolveInput = resolveInput;
        });
      };
      await pyodide.runPythonAsync(code);
      const result = pyodide.runPython("sys.stdout.getvalue()");
      setOutput((prev) => prev + (result || "No output.") + "\n");
    } catch (error) {
      setOutput((prev) => prev + `Error: ${error.message}\n`);
    }
  };

  const handleInputSubmit = (e) => {
    if (e.key === "Enter" && isWaitingForInput) {
      e.preventDefault();
      if (window.resolveInput) {
        window.resolveInput(inputValue);
        setOutput((prev) => prev + `${inputPrompt}${inputValue}\n`);
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
    setActiveTabIndex(openFiles.length);
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
        setAllFiles((prev) => (!prev.some((f) => f.name === file.name) ? [...prev, newFile] : prev));
        setOpenFiles((prev) => (!prev.some((f) => f.name === file.name) ? [...prev, newFile] : prev));
        setActiveFile(file.name);
        setCode(event.target.result);
        setActiveTabIndex(openFiles.findIndex((f) => f.name === file.name));
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
    setIsModified(false);
  };

  const handleSaveAs = () => {
    const newFileName = prompt("Enter the file name:", activeFile) || activeFile;
    if (newFileName) {
      const validFileName = newFileName.endsWith(".py") ? newFileName : `${newFileName}.py`;
      const fileContent = openFiles.find((f) => f.name === activeFile)?.content || "";
      setAllFiles((prev) =>
        !prev.some((f) => f.name === validFileName)
          ? [...prev, { name: validFileName, content: fileContent }]
          : prev.map((f) => (f.name === activeFile ? { ...f, name: validFileName, content: fileContent } : f))
      );
      setOpenFiles((prev) =>
        prev.map((f) => (f.name === activeFile ? { ...f, name: validFileName, content: fileContent } : f))
      );
      setActiveFile(validFileName);
      downloadFile(fileContent, validFileName);
      setIsModified(false);
      setActiveTabIndex(openFiles.findIndex((f) => f.name === validFileName));
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
      if (file) setOpenFiles((prev) => [...prev, file]);
    }
    setActiveFile(fileName);
    setCode(allFiles.find((file) => file.name === fileName)?.content || "");
    setActiveTabIndex(openFiles.findIndex((f) => f.name === fileName));
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
    setDeleteDialogOpen(true);
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
    setDeleteDialogOpen(false);
    setFileToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setFileToDelete(null);
  };

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <Layout
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        currentMenu={currentMenu}
        setCurrentMenu={setCurrentMenu}
        sidebarItems={sidebarItems}
        allFiles={allFiles}
        activeFile={activeFile}
        setActiveFile={setActiveFile} // Added here
        handleFileSelect={handleFileSelect}
        handleNewFile={handleNewFile}
        handleDownloadFile={handleDownloadFile}
        handleRenameFile={handleRenameFile}
        handleDeleteFile={handleDeleteFile}
        openFiles={openFiles}
        activeTabIndex={activeTabIndex}
        setActiveTabIndex={setActiveTabIndex}
        code={code}
        isModified={isModified}
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
        fileInputRef={fileInputRef}
        handleFileInputChange={handleFileInputChange}
        handleSave={handleSave}
        handleSaveAs={handleSaveAs}
        deleteDialogOpen={deleteDialogOpen}
        fileToDelete={fileToDelete}
        handleDeleteConfirm={handleDeleteConfirm}
        handleDeleteCancel={handleDeleteCancel}
      />
    </ThemeProvider>
  );
}