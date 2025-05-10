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
import { useTags } from "@/contexts/TagsContext";
import type { Tag } from "@/types/tag";
import { useCategories } from "@/contexts/CategoriesContext"; 

interface TagFormModalProps {
  open: boolean;
  onClose: () => void;
  editTag: Tag | null;
}

interface FormErrors {
  name?: string;
  description?: string;
  categoryId?: string;
  value?: string;
  type?: string;
}

const TagFormModal = ({ open, onClose, editTag }: TagFormModalProps) => {
  const { createTag, updateTag } = useTags();
  const { categories } = useCategories();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    value: "",
    type: "standard",
    isActive: true
  });

  useEffect(() => {
    if (editTag) {
      setFormData({
        name: editTag.name,
        description: editTag.description,
        categoryId: editTag.categoryId || "",
        value: editTag.value || "",
        type: editTag.type || "standard",
        isActive: editTag.isActive
      });
    } else {
      setFormData({
        name: "",
        description: "",
        categoryId: "",
        value: "",
        type: "standard",
        isActive: true
      });
    }
    setErrors({});
  }, [editTag, open]);

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
    
    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }

    if (!formData.value.trim()) {
      newErrors.value = "Value is required";
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
      if (editTag) {
        await updateTag(editTag.id, formData);
      } else {
        await createTag(formData);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save tag:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editTag ? "Edit Tag" : "Add New Tag"}
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
              placeholder="e.g. scammer, trusted, exchange"
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
              placeholder="Describe what this tag represents"
            />
            
            <TextField
              select
              fullWidth
              label="Category"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              error={!!errors.categoryId}
              disabled={loading}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
            {errors.categoryId && (
              <FormHelperText error>{errors.categoryId}</FormHelperText>
            )}

            <TextField
              fullWidth
              label="Value"
              name="value"
              value={formData.value}
              onChange={handleChange}
              error={!!errors.value}
              helperText={errors.value || "The value associated with this tag"}
              disabled={loading}
            />

            <TextField
              select
              fullWidth
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              error={!!errors.type}
              helperText={errors.type}
              disabled={loading}
            >
              <MenuItem value="standard">Standard</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
              <MenuItem value="system">System</MenuItem>
            </TextField>

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

export default TagFormModal; 