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
} from "@mui/material";
import { useState, useEffect } from "react";
import { useTags } from "@/contexts/TagsContext";
import type { Tag } from "@/types/tag";

interface TagFormModalProps {
  open: boolean;
  onClose: () => void;
  editTag: Tag | null;
}

interface FormErrors {
  name?: string;
  description?: string;
  category?: string;
}

const TagFormModal = ({ open, onClose, editTag }: TagFormModalProps) => {
  const { createTag, updateTag } = useTags();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "neutral" as "positive" | "negative" | "neutral",
  });

  useEffect(() => {
    if (editTag) {
      setFormData({
        name: editTag.name,
        description: editTag.description,
        category: editTag.category,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        category: "neutral" as "positive" | "negative" | "neutral",
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.category) {
      newErrors.category = "Category is required";
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
              name="category"
              value={formData.category}
              onChange={handleChange}
              error={!!errors.category}
              disabled={loading}
            >
              <MenuItem value="positive">Positive</MenuItem>
              <MenuItem value="negative">Negative</MenuItem>
              <MenuItem value="neutral">Neutral</MenuItem>
            </TextField>
            {errors.category && (
              <FormHelperText error>{errors.category}</FormHelperText>
            )}
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