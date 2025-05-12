import { Box, TextField, MenuItem, Button, Stack, Switch, FormControlLabel, IconButton } from "@mui/material";
import { ClearAll, Sort } from "@mui/icons-material";
import { useState } from "react";
import { useCategories } from "@/contexts/CategoriesContext";

const CategoryFilters = () => {
  const { filters, setFilters, resetFilters } = useCategories();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (field: string, value: any) => {
    setFilters({ [field]: value });
  };

  const handleSortChange = (field: string) => {
    if (filters.sortBy === field) {
      setFilters({
        sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
      });
    } else {
      // Set new sort field with default desc order
      setFilters({
        sortBy: field,
        sortOrder: 'desc',
      });
    }
  };

  const getSortIcon = (field: string) => {
    if (filters.sortBy !== field) return null;
    return filters.sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stack 
        direction={{ xs: "column", sm: "row" }} 
        spacing={2} 
        sx={{ width: "100%", mb: 2 }}
      >
        <TextField
          fullWidth
          size="small"
          label="Search"
          placeholder="Search by name..."
          value={filters.name || ''}
          onChange={(e) => handleFilterChange("name", e.target.value)}
        />

        <TextField
          select
          fullWidth
          size="small"
          label="Type"
          value={filters.type || ''}
          onChange={(e) => handleFilterChange("type", e.target.value)}
        >
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="positive">Positive</MenuItem>
          <MenuItem value="negative">Negative</MenuItem>
          <MenuItem value="neutral">Neutral</MenuItem>
        </TextField>

        <Button
          variant="outlined"
          onClick={() => resetFilters()}
          startIcon={<ClearAll />}
        >
          Clear
        </Button>
      </Stack>

      <Stack 
        direction="row" 
        alignItems="center" 
        spacing={1}
        sx={{ mb: 1 }}
      >
        <Button 
          size="small" 
          variant="text" 
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? "Hide Advanced" : "Show Advanced"}
        </Button>
      </Stack>

      {showAdvanced && (
        <Stack spacing={2}>
          <Stack 
            direction={{ xs: "column", sm: "row" }} 
            spacing={2} 
            alignItems="center"
          >
            <FormControlLabel
              control={
                <Switch
                  checked={filters.isActive === true}
                  onChange={(e) => handleFilterChange("isActive", e.target.checked ? true : null)}
                />
              }
              label="Active Only"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={filters.isActive === false}
                  onChange={(e) => handleFilterChange("isActive", e.target.checked ? false : null)}
                />
              }
              label="Inactive Only"
            />
          </Stack>

          <Stack 
            direction={{ xs: "column", sm: "row" }} 
            spacing={2} 
            alignItems="center"
          >
            <Box>Sort by:</Box>
            <Button 
              size="small" 
              variant={filters.sortBy === 'name' ? "contained" : "outlined"}
              onClick={() => handleSortChange('name')}
              endIcon={getSortIcon('name')}
            >
              Name
            </Button>
            <Button 
              size="small" 
              variant={filters.sortBy === 'type' ? "contained" : "outlined"}
              onClick={() => handleSortChange('type')}
              endIcon={getSortIcon('type')}
            >
              Type
            </Button>
            <Button 
              size="small" 
              variant={filters.sortBy === 'createdAt' ? "contained" : "outlined"}
              onClick={() => handleSortChange('createdAt')}
              endIcon={getSortIcon('createdAt')}
            >
              Created
            </Button>
            <Button 
              size="small" 
              variant={filters.sortBy === 'updatedAt' ? "contained" : "outlined"}
              onClick={() => handleSortChange('updatedAt')}
              endIcon={getSortIcon('updatedAt')}
            >
              Updated
            </Button>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export default CategoryFilters; 