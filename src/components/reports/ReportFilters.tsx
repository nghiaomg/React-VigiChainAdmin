import { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem, Box, TextField } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useReports } from "@/contexts/ReportsContext";

const ReportFilters = () => {
  const { fetchReports, filters, setFilters } = useReports();
  const [localStatus, setLocalStatus] = useState<"pending" | "approved" | "rejected" | "">(
    filters.status
  );
  const [localTagId, setLocalTagId] = useState<string>(
    filters.tagId || ""
  );

  useEffect(() => {
    setLocalStatus(filters.status);
    setLocalTagId(filters.tagId || "");
  }, [filters.status, filters.tagId]);

  const handleStatusChange = (event: SelectChangeEvent) => {
    const value = event.target.value as "pending" | "approved" | "rejected" | "";
    setLocalStatus(value);
    setFilters({ ...filters, status: value });
    fetchReports(1, 10);
  };

  const handleTagIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLocalTagId(value);
    setFilters({ ...filters, tagId: value || undefined });
    fetchReports(1, 10);
  };

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="status-filter-label">Status</InputLabel>
        <Select
          labelId="status-filter-label"
          id="status-filter"
          value={localStatus}
          onChange={handleStatusChange}
          label="Status"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="approved">Approved</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
        </Select>
      </FormControl>

      <TextField
        variant="outlined"
        size="small"
        label="Tag ID"
        value={localTagId}
        onChange={handleTagIdChange}
        placeholder="Filter by tag"
        sx={{ minWidth: 200 }}
      />
    </Box>
  );
};

export default ReportFilters; 