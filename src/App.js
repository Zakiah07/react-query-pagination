//create a state that store all users
//filter and setUser
//render setUser

import { Grid, InputLabel, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import {
  Container,
  FormControlStyled,
  StyledGrid,
  StyledPagination,
  StyledPaper,
  StyledSelect,
  StyledTypography,
} from "./styles";
import { userData } from "./data";

function App() {
  const [users, setUsers] = useState(userData.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [username, setUsername] = useState("All");
  const [filteredUsers, setFilteredUsers] = useState(users);

  const usersPerPage = 3;
  const uniqueUserNames = [
    ...new Set(users.map((user) => user.first_name + " " + user.last_name)),
  ];

  const handlePagination = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChange = (e) => {
    const selectedUsername = e.target.value;
    setUsername(selectedUsername);
    if (selectedUsername === "All") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) => {
        const fullName = user.first_name + " " + user.last_name;
        return fullName.toLowerCase().includes(selectedUsername.toLowerCase());
      });
      setFilteredUsers(filtered);
    }
    setCurrentPage(1);
  };

  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  const visibleUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <Container>
      <Typography variant="h4">User Profile List</Typography>
      <FormControlStyled>
        <InputLabel id="username-selection">Find User</InputLabel>
        <StyledSelect
          className="input-selection"
          labelId="username-selection"
          id="username-selection"
          label="Username"
          value={username}
          onChange={handleChange}
        >
          <MenuItem value="All">All</MenuItem>
          {uniqueUserNames.map((userName) => {
            return (
              <MenuItem
                key={userName}
                value={userName}
              >
                {userName}
              </MenuItem>
            );
          })}
        </StyledSelect>
      </FormControlStyled>
      <Grid
        className="container"
        container
        spacing={2}
      >
        {visibleUsers
          // .slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)
          .map((item) => {
            return (
              <StyledGrid
                item
                xs={12}
                sm={6}
                md={4}
                key={item.id}
              >
                <StyledPaper
                  variant="outlined"
                  key={item.id}
                  className="profile-card"
                >
                  <div className="profile-content">
                    <Typography>ID: {item.id}</Typography>
                    <Typography variant="h6">
                      {item.first_name} {item.last_name}
                    </Typography>
                    <StyledTypography>{item.email}</StyledTypography>
                  </div>
                  <img
                    src={item.avatar}
                    alt={item.first_name}
                  />
                </StyledPaper>
              </StyledGrid>
            );
          })}
      </Grid>

      {totalPages > 1 && totalUsers >= usersPerPage && (
        <StyledPagination
          count={totalPages}
          page={currentPage}
          onChange={handlePagination}
          variant="outlined"
          shape="rounded"
          className="pagination"
        />
      )}
    </Container>
  );
}

export default App;
