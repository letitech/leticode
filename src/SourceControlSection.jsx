import { Box, Typography } from "@mui/material";

export default function SourceControlSection() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", mb: 2, display: "block" }}>
        Source Control
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        No changes detected
      </Typography>
    </Box>
  );
}