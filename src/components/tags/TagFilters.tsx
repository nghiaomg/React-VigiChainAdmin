import { useEffect } from "react";
import { 
  Box, 
  TextField, 
  MenuItem, 
  Button, 
  Stack, 
  Divider,
  InputAdornment,
  IconButton
} from "@mui/material";
import { FilterList, Add, Search, Clear } from "@mui/icons-material";
import { useTags } from "@/contexts/TagsContext";
import { useCategories } from "@/contexts/CategoriesContext";
import { useAuthStore } from "@/stores";

interface TagFiltersProps {
  onAddTag?: () => void;
}

const TagFilters = ({ onAddTag }: TagFiltersProps) => {
  const { filters, setFilters, fetchTags } = useTags();
  const { categories } = useCategories();
  const { wallet } = useAuthStore();
  const isAdmin = wallet?.role === "admin";

  useEffect(() => {
    fetchTags(1, 10);
  }, [filters.category, filters.search, fetchTags]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearSearch = () => {
    handleFilterChange("search", "");
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems="center"
        divider={<Divider orientation="vertical" flexItem />}
        sx={{ width: "100%" }}
      >
        <Stack 
          direction={{ xs: "column", sm: "row" }} 
          spacing={2} 
          sx={{ flexGrow: 1 }}
        >
          <TextField
            select
            size="small"
            label="Category"
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            sx={{ minWidth: 200 }}
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" color="action" />
                </InputAdornment>
              ),
              endAdornment: filters.search && (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={handleClearSearch}
                    size="small"
                  >
                    <Clear fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Stack>

        <Stack 
          direction="row" 
          spacing={2}
          sx={{ 
            flexShrink: 0,
            justifyContent: { xs: "center", sm: "flex-end" }
          }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={() => setFilters({ category: "", search: "" })}
          >
            Clear All
          </Button>
          
          {isAdmin && (
            <>
              <Button 
                variant="outlined" 
                size="small"
                startIcon={<FilterList />}
              >
                Export
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<Add />}
                onClick={onAddTag}
              >
                Add Tag
              </Button>
            </>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default TagFilters;
