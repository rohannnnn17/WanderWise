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
    <form marginTop={2} onSubmit={submitHandler}>
      <Box
        p={2}
        boxShadow={1}
        borderRadius={2}
        bgcolor="#fff"
        maxWidth={600}
        marginTop={2}
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
                <MenuItem value="">-- Select a Place Type --</MenuItem>
                <MenuItem value="Nature Spot">Nature Spot</MenuItem>
                <MenuItem value="Hotel">Hotel</MenuItem>
                <MenuItem value="Hostel">Hostel</MenuItem>
                <MenuItem value="PG">PG</MenuItem>
                <MenuItem value="Mall">Mall</MenuItem>
                <MenuItem value="Historic Place">Historic Place</MenuItem>
                <MenuItem value="Monument">Monument</MenuItem>
                <MenuItem value="Trekking Spot">Trekking Spot</MenuItem>
                <MenuItem value="Beach">Beach</MenuItem>
                <MenuItem value="Resort">Resort</MenuItem>
                <MenuItem value="Waterfall">Waterfall</MenuItem>
                <MenuItem value="Temple">Temple</MenuItem>
                <MenuItem value="Mosque">Mosque</MenuItem>
                <MenuItem value="Church">Church</MenuItem>
                <MenuItem value="Gurudwara">Gurudwara</MenuItem>
                <MenuItem value="Wildlife Sanctuary">
                  Wildlife Sanctuary
                </MenuItem>
                <MenuItem value="Zoo">Zoo</MenuItem>
                <MenuItem value="Museum">Museum</MenuItem>
                <MenuItem value="Amusement Park">Amusement Park</MenuItem>
                <MenuItem value="Aquarium">Aquarium</MenuItem>
                <MenuItem value="Restaurant">Restaurant</MenuItem>
                <MenuItem value="Cafe">Cafe</MenuItem>
                <MenuItem value="Bar">Bar</MenuItem>
                <MenuItem value="Library">Library</MenuItem>
                <MenuItem value="Park">Park</MenuItem>
                <MenuItem value="Garden">Garden</MenuItem>
                <MenuItem value="Shopping Complex">Shopping Complex</MenuItem>
                <MenuItem value="Cultural Center">Cultural Center</MenuItem>
                <MenuItem value="Art Gallery">Art Gallery</MenuItem>
                <MenuItem value="Cinema Hall">Cinema Hall</MenuItem>
                <MenuItem value="Sports Complex">Sports Complex</MenuItem>
                <MenuItem value="Stadium">Stadium</MenuItem>
                <MenuItem value="Convention Center">Convention Center</MenuItem>
                <MenuItem value="Food Court">Food Court</MenuItem>
                <MenuItem value="Street Market">Street Market</MenuItem>
                <MenuItem value="Railway Station">Railway Station</MenuItem>
                <MenuItem value="Airport">Airport</MenuItem>
                <MenuItem value="Bus Stand">Bus Stand</MenuItem>
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
