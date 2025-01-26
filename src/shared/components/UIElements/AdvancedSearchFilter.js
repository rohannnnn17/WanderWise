import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

const AdvancedSearchFilter = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState(""); // Name of the place
  const [categoryFilter, setCategoryFilter] = useState(""); // Type of place (e.g., Hostels, Hotels, etc.)

  const submitHandler = (event) => {
    event.preventDefault();

    const filterData = {
      searchQuery,
      categoryFilter,
    };

    onSearch(filterData); // Passing data to parent
  };

  return (
    <form onSubmit={submitHandler}>
      <Box
        p={2}
        boxShadow={1}
        borderRadius={2}
        bgcolor="#fff"
        maxWidth={600}
        mx="auto">
        <Grid container spacing={2}>
          {/* Search by Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Place Name"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
            />
          </Grid>

          {/* Category Filter */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Category">
                <MenuItem value="">All</MenuItem>
                <MenuItem value="hostel">Hostels</MenuItem>
                <MenuItem value="nature">Nature Spots</MenuItem>
                <MenuItem value="mall">Malls</MenuItem>
                <MenuItem value="hotel">Hotels</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ fontWeight: 600 }}
              size="large">
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
};

export default AdvancedSearchFilter;
