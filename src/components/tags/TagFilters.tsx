import { Box, TextField, MenuItem, Button, Stack } from "@mui/material";
import { useTags } from "@/contexts/TagsContext";
import { useCategories } from "@/contexts/CategoriesContext";

const TagFilters = () => {
  const { filters, setFilters } = useTags();
  const { categories } = useCategories();

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ width: "100%" }}
      >
        <TextField
          select
          fullWidth
          size="small"
          label="Category"
          value={filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          size="small"
          label="Search"
          placeholder="Search by name or description..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />

        <Button
          fullWidth
          variant="outlined"
          onClick={() => setFilters({ category: "", search: "" })}
        >
          Clear Filters
        </Button>
      </Stack>
    </Box>
  );
};

export default TagFilters;
