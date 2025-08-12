import { useEffect, useRef } from "react";
import { Paper, Box, Typography, IconButton, TextField } from "@mui/material";
import { Close } from "@mui/icons-material";

export default function Terminal({
  terminalOpen,
  setTerminalOpen,
  output,
  inputValue,
  inputPrompt,
  isWaitingForInput,
  setInputValue,
  handleInputSubmit,
}) {
  const terminalInputRef = useRef(null);
  const terminalEndRef = useRef(null);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [output]);

  // Focus input when waiting for input
  useEffect(() => {
    if (isWaitingForInput && terminalInputRef.current) {
      terminalInputRef.current.focus();
    }
  }, [isWaitingForInput]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleInputSubmit(e);
    }
  };

  return (
    terminalOpen && (
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
            position: "relative",
          }}
        >
          {output}
          {isWaitingForInput && (
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              {">>"} <TextField
                ref={terminalInputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                variant="standard"
                // placeholder="Ingresa tu respuesta..."
                size="small"
                fullWidth
                InputProps={{
                  disableUnderline: true,
                  style: {
                    color: "#d4d4d4",
                    fontFamily: '"Monaco", "Cascadia Code", "Roboto Mono", monospace',
                    fontSize: "13px",
                    backgroundColor: "transparent",
                  },
                }}
                sx={{
                  "& .MuiInput-root": {
                    color: "#d4d4d4",
                    backgroundColor: "transparent",
                  },
                  "& .MuiInput-root:before": {
                    borderBottom: "1px solid #d4d4d4",
                  },
                  "& .MuiInput-root:hover:before": {
                    borderBottom: "1px solid #d4d4d4",
                  },
                  "& .MuiInput-root:after": {
                    borderBottom: "2px solid #007ACC",
                  },
                }}
                autoFocus
              />
            </Box>
          )}
          <div ref={terminalEndRef} />
        </Box>
      </Paper>
    )
  );
}