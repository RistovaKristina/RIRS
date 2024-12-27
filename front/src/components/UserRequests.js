import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Box
} from "@mui/material";
import { fetchUsersRequests, approveRequest, declineRequest } from "../services/api";
import { useEffect, useState } from "react";

const UserRequests = ({ usersRequests }) => {
    const [categories, setCategories] = useState({});
    const [filter, setFilter] = useState("All");

    const categoryOptions = ["Travel", "Meals", "Supplies", "Other"];

    const handleCategoryChange = (id, value) => {
        setCategories((prev) => ({ ...prev, [id]: value }));
    };

    const filteredRequests = filter === "All"
        ? usersRequests
        : usersRequests.filter((row) => categories[row._id] === filter);

    async function approveRequestApi(id) {
        await approveRequest(id);
    }

    async function declineRequestApi(id) {
        await declineRequest(id);
    }

    return (
        <Box>
            {/* Filter Dropdown */}
            <FormControl sx={{ minWidth: 200, marginBottom: 2 }}>
                <InputLabel>Filter by Category</InputLabel>
                <Select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <MenuItem value="All">All</MenuItem>
                    {categoryOptions.map((category) => (
                        <MenuItem key={category} value={category}>
                            {category}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Table */}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Expenses Request</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRequests.map((row) => (
                            <TableRow
                                key={row._id}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.user.name}
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={categories[row._id] || ""}
                                        onChange={(e) => handleCategoryChange(row._id, e.target.value)}
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled>
                                            Select Category
                                        </MenuItem>
                                        {categoryOptions.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                                <TableCell>{new Date(row.date).toLocaleDateString("sl-SL")}</TableCell>
                                <TableCell>{row.amount}€</TableCell>
                                <TableCell>{row.description}</TableCell>
                                <TableCell>
                                    <Button type="submit" onClick={() => approveRequestApi(row._id)}>Approve</Button>
                                    <Button type="submit" onClick={() => declineRequestApi(row._id)}>Decline</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default UserRequests;
