import {
  CircularProgress,
  Grid,
  InputLabel,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { fetchProfiles } from "./api";
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

export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProfileList />
    </QueryClientProvider>
  );
}

function ProfileList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [username, setUsername] = useState("");
  const [filteredProfile, setFilteredProfile] = useState([]);
  const [selectedOption, setSelectedOption] = useState("All");

  const { isPending, isError, error } = useQuery({
    queryKey: ["profiles"],
    queryFn: () => fetchProfiles,
  });

  if (isPending) {
    return <CircularProgress />;
  }

  if (isError) {
    return (
      <Typography
        variant="h5"
        color="error"
      >
        Error: {error.message}
      </Typography>
    );
  }

  const handlePagination = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const usersPerPage = 3;

  const uniqueUserNames = new Set();
  userData.user.forEach((user) => {
    uniqueUserNames.add(`${user.first_name} ${user.last_name}`);
  });

  const uniqueUserNamesArray = Array.from(uniqueUserNames);

  const filteredUsers = userData.user.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`;
    return fullName.toLowerCase().includes(username.toLowerCase());
  });

  const handleChange = (e) => {
    setSelectedOption(e.target.value);

    if (e.target.value === "All") {
      setUsername(e.target.value);
      setFilteredProfile([]);
    } else {
      setUsername(e.target.value);
      setFilteredProfile(filteredUsers);
    }
  };

  const displayUsers = selectedOption === "All" ? userData.user : filteredUsers;
  // console.log("user", displayUsers);

  const totalUsers = displayUsers.length;
  const totalPages = Math.ceil(totalUsers / usersPerPage);

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
          {uniqueUserNamesArray.map((userName) => {
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
        {displayUsers
          .slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)
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

      {totalPages > 1 && displayUsers.length >= usersPerPage && (
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
