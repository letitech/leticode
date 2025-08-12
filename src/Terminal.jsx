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
          <IconButton size="small" onClick={() => setTerminalOpen(false)} sx={{ color: "#d4d4d4" }}>
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
                "& .MuiOutlinedInput-root": { backgroundColor: "#1e1e1e", color: "#d4d4d4" },
                "& .MuiOutlinedInput-input": { padding: "4px 8px" },
              }}
            />
          </Box>
        )}
      </Paper>
    )
  );
}