import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";

export default function SearchSection() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", mb: 2, display: "block" }}>
        Search
      </Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="Search"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search sx={{ fontSize: 16 }} />
            </InputAdornment>
          ),
        }}
      />
      <Typography variant="body2" sx={{ color: "text.secondary", mt: 2 }}>
        No results found
      </Typography>
    </Box>
  );
}