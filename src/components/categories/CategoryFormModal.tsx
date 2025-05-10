import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Box,
  FormHelperText,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useCategories } from "@/contexts/CategoriesContext";
import type { Category } from "@/types/category";

interface CategoryFormModalProps {
  open: boolean;
  onClose: () => void;
  editCategory: Category | null;
}

interface FormErrors {
  name?: string;
  description?: string;
  type?: string;
}

const CategoryFormModal = ({ open, onClose, editCategory }: CategoryFormModalProps) => {
  const { createCategory, updateCategory } = useCategories();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "neutral" as "positive" | "negative" | "neutral",
    isActive: true
  });

  useEffect(() => {
    if (editCategory) {
      setFormData({
        name: editCategory.name,
        description: editCategory.description,
        type: editCategory.type,
        isActive: editCategory.isActive
      });
    } else {
      setFormData({
        name: "",
        description: "",
        type: "neutral" as "positive" | "negative" | "neutral",
        isActive: true
      });
    }
    setErrors({});
  }, [editCategory, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is edited
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      isActive: e.target.checked
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.type) {
      newErrors.type = "Type is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (editCategory) {
        await updateCategory(editCategory.id, formData);
      } else {
        await createCategory(formData);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editCategory ? "Edit Category" : "Add New Category"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              disabled={loading}
              placeholder="e.g. Exchange, Scam, Third-party"
            />
            
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              disabled={loading}
              multiline
              rows={3}
              placeholder="Describe what this category represents"
            />
            
            <TextField
              select
              fullWidth
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              error={!!errors.type}
              disabled={loading}
            >
              <MenuItem value="positive">Positive</MenuItem>
              <MenuItem value="negative">Negative</MenuItem>
              <MenuItem value="neutral">Neutral</MenuItem>
            </TextField>
            {errors.type && (
              <FormHelperText error>{errors.type}</FormHelperText>
            )}

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={handleSwitchChange}
                  name="isActive"
                  color="success"
                  disabled={loading}
                />
              }
              label="Active"
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryFormModal; 