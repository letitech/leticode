import { Paper, Box, Typography } from "@mui/material";
import { AccountTree, Code } from "@mui/icons-material";

export default function StatusBar() {
  return (
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
  );
}