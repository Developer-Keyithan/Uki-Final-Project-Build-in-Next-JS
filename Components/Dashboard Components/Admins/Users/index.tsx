import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { BiSearch, BiUser } from "react-icons/bi";
import { CgUnblock } from "react-icons/cg";
import { LuFilter } from "react-icons/lu";
import { MdBlock, MdClose, MdEdit, MdSave, MdShortText } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Users() {
    const [editId, setEditId] = useState<string | null>(null);
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
    const [isFilterDropDownOpen, setIsFilterDropDownOpen] = useState<boolean>(false);
    const [selectedShort, setSelectedShort] = useState<string | null>(null);
    const [isShortDropDownOpen, setIsShortDropDownOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [roleDropdownOpenId, setRoleDropdownOpenId] = useState<string | null>(null);
    const usersPerPage = 20;

    interface User {
        _id: string;
        userType: string;
        firstName: string;
        lastName: string;
        email: string;
        mobileNumber: string[];
        createdAt: Date;
        blocked: boolean;
    }

    const [users, setUsers] = useState<User[]>([]);
    const [editedUserType, setEditedUserType] = useState<Partial<User>>({});

    useEffect(() => {
        const abortController = new AbortController();
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/user', {
                    signal: abortController.signal,
                });
                const usersData = response.data.map((user: any) => ({
                    ...user,
                    createdAt: new Date(user.createdAt),
                }));
                setUsers(usersData);
                setError(null);
            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.error("Error fetching users:", error);
                    setError("Failed to fetch users. Please try again later.");
                    toast.error("Failed to load users");
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
        return () => abortController.abort();
    }, []);

    const formatNumber = (num: string): string => {
        const str = num.toString();
        return `${str.slice(0, 2)} ${str.slice(2, 5)} ${str.slice(5)}`;
    };

    const toggleBlockStatus = async (id: string) => {
        try {
            const user = users.find((u) => u._id === id);
            const response = await axios.put('/api/user', {
                userId: id,
                isBlocked: !user?.blocked
            });

            if (response.status === 200) {
                toast.success(`User ${!user?.blocked ? 'blocked' : 'unblocked'} successfully`);
                setUsers(users.map((user) =>
                    user._id === id ? { ...user, blocked: !user.blocked } : user
                ));
            }
        } catch (error) {
            toast.error("Failed to update user status");
            console.error("Error updating block status:", error);
        }
    };

    const handleFilterDropDown = () => setIsFilterDropDownOpen((prev) => !prev);
    const handleFilterSelection = (userType: string) => {
        setSelectedFilter(userType);
        setIsFilterDropDownOpen(false);
    };
    const clearFilter = () => setSelectedFilter(null);

    const handleShortDropDown = () => setIsShortDropDownOpen((prev) => !prev);
    const handleShortSelection = (short: string) => {
        setSelectedShort(short);
        setIsShortDropDownOpen(false);
    };
    const clearShort = () => setSelectedShort(null);

    const debounce = useCallback((func: Function, delay: number) => {
        let timeoutId: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    }, []);

    const handleSearch = useCallback(
        debounce((query: string) => setSearchQuery(query), 300),
        [debounce]
    );

    const sortedUsers = () => {
        let usersToDisplay = [...users];

        if (selectedFilter) {
            usersToDisplay = usersToDisplay.filter((user) => user.userType === selectedFilter);
        }

        if (searchQuery) {
            usersToDisplay = usersToDisplay.filter((user) => {
                const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
                const email = user.email ? user.email.toLowerCase() : "";
                const mobileNumbers = user.mobileNumber.join(", ").toLowerCase();

                return (
                    fullName.includes(searchQuery.toLowerCase()) ||
                    email.includes(searchQuery.toLowerCase()) ||
                    mobileNumbers.includes(searchQuery.toLowerCase())
                );
            });
        }

        if (selectedShort === "Newest") {
            usersToDisplay.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        } else if (selectedShort === "Oldest") {
            usersToDisplay.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        }

        return usersToDisplay;
    };

    const sortedUserList = sortedUsers();
    const totalPages = Math.ceil(sortedUserList.length / usersPerPage);
    const currentUsers = sortedUserList.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    );

    const handlePageClick = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleSave = async (id: string) => {
        try {
            const response = await axios.put('/api/user', {
                userId: id,
                newUserType: editedUserType.userType
            });

            if (response.status === 200) {
                toast.success("User updated successfully");
                setUsers(users.map((user) =>
                    user._id === id ? { ...user, ...editedUserType } : user
                ));
                setEditId(null);
            }
        } catch (error) {
            toast.error("Failed to update user");
            console.error("Error updating user:", error);
        }
    };

    const handleEdit = (user: User) => {
        setEditId(user._id);
        setEditedUserType({ userType: user.userType });
    };

    if (isLoading) {
        return <p>Loading users...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    const usersCount = (currentPage: number, totalUsers: number) => {
        const endCount = usersPerPage * currentPage;
        return endCount > totalUsers ? totalUsers : endCount;
    };

    return (
        <div className="my-4 py-4">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <div>
                <div className="flex w-full justify-between">
                    {/* Filter Section */}
                    <div className="relative flex gap-2">
                        <button
                            className="flex gap-2 items-center ring-1 ring-gray-500 px-4 rounded-xl hover:bg-primaryColor hover:text-white hover:ring-primaryColor transition ease-in-out duration-500"
                            onClick={handleFilterDropDown}
                        >
                            <LuFilter />
                            Filter
                            <RiArrowDropDownLine className="text-2xl" />
                        </button>
                        {isFilterDropDownOpen && (
                            <div className="flex flex-col items-start w-max absolute top-12 left-0 bg-white py-2 px-2 gap-1 rounded-md drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] z-50">
                                {["consumer", "seller", "delivery partner", "delivery person", "admin"].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => handleFilterSelection(type)}
                                        className="hover:bg-primaryColor hover:text-white px-2 py-[2px] w-full text-start rounded-md transition ease-in-out duration-500 capitalize"
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Search Bar */}
                    <div className="flex items-center ring-1 ring-gray-500 px-4 rounded-xl overflow-hidden">
                        <input
                            type="search"
                            placeholder="Search by name, email, or mobile number..."
                            className="outline-none py-2 w-96"
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <button className="flex items-center justify-center cursor-pointer h-full">
                            <BiSearch />
                        </button>
                    </div>

                    {/* Sort Section */}
                    <div className="relative flex gap-2">
                        <button
                            className="flex gap-2 items-center ring-1 ring-gray-500 px-4 rounded-xl hover:bg-primaryColor hover:text-white hover:ring-primaryColor transition ease-in-out duration-500"
                            onClick={handleShortDropDown}
                        >
                            <MdShortText className="text-xl" />
                            Sort By
                            <RiArrowDropDownLine className="text-2xl" />
                        </button>
                        {isShortDropDownOpen && (
                            <div className="flex flex-col w-36 absolute top-12 right-0 bg-white items-start py-2 px-2 gap-1 rounded-md drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] z-50">
                                {["Newest", "Oldest"].map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleShortSelection(option)}
                                        className="hover:bg-primaryColor hover:text-white px-2 py-[2px] w-full text-start rounded-md transition ease-in-out duration-500 capitalize"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Active Filter and Short */}
                <div className="flex gap-4 py-4">
                    {selectedFilter && (
                        <div className="flex items-center gap-2 px-2 py-1 h-full rounded-full bg-gray-100 text-gray-800">
                            <p className="capitalize">{selectedFilter}</p>
                            <MdClose
                                className="text-xl cursor-pointer hover:text-red-500"
                                onClick={clearFilter}
                            />
                        </div>
                    )}
                    {selectedShort && (
                        <div className="flex items-center gap-2 px-2 py-1 h-full rounded-full bg-gray-100 text-gray-800">
                            <p>{selectedShort}</p>
                            <MdClose
                                className="text-xl cursor-pointer hover:text-red-500"
                                onClick={clearShort}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="relative flex items-center justify-center gap-2 mt-8">
                <button
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => handlePageClick(i + 1)}
                        className={`px-4 py-2 rounded-lg ${currentPage === i + 1 ? 'bg-primaryColor text-white' : 'border hover:bg-gray-100'}`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
                <span className="absolute top-0 left-0 py-2 text-gray-500">
                    Page {currentPage} of {totalPages || '1'} || Users: {usersPerPage * (currentPage - 1)} - {usersCount(currentPage, sortedUserList.length)} of {sortedUserList.length}
                </span>
            </div>

            {/* Users Table */}
            <div className="my-10">
                <table className="w-full border-collapse rounded-lg overflow-hidden">
                    <thead className="bg-primaryColor text-white">
                        <tr>
                            <th className="p-4 font-semibold border-r-[1px]">No</th>
                            <th className="p-4 font-semibold border-r-[1px]">User</th>
                            <th className="p-4 font-semibold border-r-[1px]">User ID</th>
                            <th className="p-4 font-semibold border-r-[1px]">Mobile</th>
                            <th className="p-4 font-semibold border-r-[1px]">Role</th>
                            <th className="p-4 font-semibold border-r-[1px]">Joined</th>
                            <th className="p-4 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.length > 0 ? (
                            currentUsers.map((user, index) => (
                                <tr key={user._id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 text-center  border-r-[1px]">{index + 1}</td>
                                    <td className="flex gap-8 items-center p-4">
                                        <div className="flex items-center justify-center text-2xl font-semibold w-12 h-12 bg-primaryColor text-white p-2 rounded-full">
                                            {/* <BiUser /> */}
                                            {user.firstName[0].toUpperCase()}{user.lastName[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold uppercase">{`${user.firstName} ${user.lastName}`}</p>
                                            <p>{user.email || "<E-mail not provided>"}</p>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center uppercase text-primaryColor">{user._id}</td>
                                    <td className="p-4 text-center ">+94 {user.mobileNumber.map(formatNumber).join(", ")}</td>
                                    <td className="p-4 text-center  w-max">
                                        {editId === user._id ? (
                                            <div className="relative">
                                                <button
                                                    onClick={() => setRoleDropdownOpenId(user._id)}
                                                    className="flex items-center justify-between w-[10.5rem] gap-1 capitalize ring-1 ring-gray-300 rounded px-2 py-1 hover:ring-primaryColor transition ease-in-out duration-500"
                                                >
                                                    {editedUserType.userType || user.userType}
                                                    <RiArrowDropDownLine className="text-xl" />
                                                </button>
                                                {roleDropdownOpenId === user._id && (
                                                    <div className="absolute left-0 top-full mt-1 z-50 bg-white py-2 px-2 gap-1 rounded-md drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] w-[10.5rem]">
                                                        {["consumer", "seller", "delivery partner", "delivery person", "admin"].map((role) => (
                                                            <div
                                                                key={role}
                                                                onClick={() => {
                                                                    setEditedUserType(prev => ({ ...prev, userType: role }));
                                                                    setRoleDropdownOpenId(null);
                                                                }}
                                                                className="hover:bg-primaryColor hover:text-white px-2 py-[2px] w-full text-start rounded-md mt-1 cursor-pointer transition ease-in-out duration-500 capitalize"
                                                            >
                                                                {role}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="capitalize">{user.userType}</p>
                                        )}
                                    </td>
                                    <td className="p-4 text-center ">
                                        {new Date(user.createdAt).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2 items-center justify-center">
                                            <div className="relative">
                                                <button
                                                    onClick={() => editId === user._id ? handleSave(user._id) : handleEdit(user)}
                                                    onMouseEnter={() => setHoveredButton(`${user._id}-edit`)}
                                                    onMouseLeave={() => setHoveredButton(null)}
                                                    className="flex items-center hover:bg-primaryColor hover:text-white p-1 rounded-md transition ease-in-out duration-500"
                                                >
                                                    {editId === user._id ? <MdSave className="w-5 h-5" /> : <MdEdit className="w-5 h-5" />}
                                                </button>
                                                {hoveredButton === `${user._id}-edit` && (
                                                    <span className="absolute -left-1/2 top-full mt-1 w-max bg-gray-800 text-white text-xs p-1 rounded">
                                                        {editId === user._id ? "Save Changes" : "Edit User"}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <button
                                                    onClick={() => toggleBlockStatus(user._id)}
                                                    onMouseEnter={() => setHoveredButton(`${user._id}-block`)}
                                                    onMouseLeave={() => setHoveredButton(null)}
                                                    className={`flex items-center ${user.blocked ? 'hover:bg-primaryColor' : 'hover:bg-red-600'} p-1 rounded-md transition ease-in-out duration-500`}
                                                >
                                                    {user.blocked ? <CgUnblock className="w-5 h-5 text-primaryColor hover:text-white" /> : <MdBlock className="w-5 h-5 text-red-600 hover:text-white" />}
                                                </button>
                                                {hoveredButton === `${user._id}-block` && (
                                                    <span className="absolute -left-5 top-full mt-1 w-max bg-gray-800 text-white text-xs p-1 rounded">
                                                        {user.blocked ? "Unblock User" : "Block User"}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="p-4 text-center">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Bottom Pagination */}
            <div className="relative flex items-center justify-center gap-2 mt-8">
                <button
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => handlePageClick(i + 1)}
                        className={`px-4 py-2 rounded-lg ${currentPage === i + 1 ? 'bg-primaryColor text-white' : 'border hover:bg-gray-100'}`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
                <span className="absolute top-0 left-0 py-2 text-gray-500">
                    Page {currentPage} of {totalPages || '1'} || Users: {usersPerPage * (currentPage - 1)} - {usersCount(currentPage, sortedUserList.length)} of {sortedUserList.length}
                </span>
            </div>
        </div>
    );
}

export default Users;
