import axios from "axios";
import { useEffect, useState } from "react";
import { CgUnblock } from "react-icons/cg";
import { LuFilter } from "react-icons/lu";
import { MdBlock, MdClose, MdEdit, MdSave, MdShortText } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";

function Users() {
    const [editId, setEditId] = useState<string | null>(null);
    const [visibleId, setVisibleId] = useState<string | null>(null);
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
    const [isFilterDropDownOpen, setIsFilterDropDownOpen] = useState<boolean>(false);
    const [selectedShort, setSelectedShort] = useState<string | null>(null);
    const [isShortDropDownOpen, setIsShortDropDownOpen] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState(1);  // Start at page 1
    const usersPerPage = 5;

    interface User {
        index: number;
        mobileNumber: [];
        userType: string;
        lastName: any;
        firstName: any;
        _id: string;
        email: string;
        createdAt: Date;
        blocked: boolean;
        numbers: string[];
    }

    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/user');
                const usersData = response.data.map((user: any) => ({
                    ...user,
                    createdAt: new Date(user.createdAt),
                }));
                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);
    

    // Function to toggle block/unblock status
    const toggleBlockStatus = (id: string) => {
        setUsers(users.map(user =>
            user._id === id ? { ...user, blocked: !user.blocked } : user
        ));
    };

    const handleFilterDropDown = () => setIsFilterDropDownOpen(prev => !prev);

    const handleFilterSelection = (userType: string) => {
        setSelectedFilter(userType);
        setIsFilterDropDownOpen(false);
    };

    const clearFilter = () => setSelectedFilter(null);

    const filteredUsers = selectedFilter ? users.filter(user => user.userType === selectedFilter) : users;

    const handleShortDropDown = () => setIsShortDropDownOpen((prev) => !prev);

    const handleShortSelection = (short: string) => {
        setSelectedShort(short);
        setIsShortDropDownOpen(false);
    };

    const clearShort = () => setSelectedShort(null);

    // Sorting users based on selectedShort value
    const sortedUsers = () => {
        let usersToDisplay = selectedFilter ? 
            filteredUsers : users; // Only filter if a filter is selected
    
        if (selectedShort === 'new to old') {
            usersToDisplay = usersToDisplay.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        } else if (selectedShort === 'old to new') {
            usersToDisplay = usersToDisplay.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        }
    
        return usersToDisplay;
    };
    

    const totalPages = Math.ceil(sortedUsers().length / usersPerPage);

    // Get users for the current page
    const currentUsers = sortedUsers().slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

    // Handle page click
    const handlePageClick = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="mt-10">
            <div className="flex w-full justify-between">
                <div className="relative flex gap-2">
                    <button
                        className="flex gap-2 items-center ring-1 ring-gray-500 px-4 rounded-xl hover:bg-primaryColor hover:text-white hover:ring-primaryColor transition ease-in-out duration-500"
                        onClick={() => handleFilterDropDown()}
                    >
                        <LuFilter />
                        Filter
                        <RiArrowDropDownLine className="text-2xl" />
                    </button>
                    {isFilterDropDownOpen && (
                        <div className={`flex flex-col items-start w-max absolute top-8 left-0 bg-white py-2 px-2 gap-1 rounded-md drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] z-50 ${isFilterDropDownOpen ? 'opacity-100' : 'opacity-0'} transition ease-in-out duration-500`}>
                            <button onClick={() => handleFilterSelection('consumer')} className="hover:bg-primaryColor hover:text-white px-2 py-[2px] w-full text-start rounded-md transition ease-in-out duration-500">Consumers</button>
                            <button onClick={() => handleFilterSelection('seller')} className="hover:bg-primaryColor hover:text-white px-2 py-[2px] w-full text-start rounded-md transition ease-in-out duration-500">Sellers</button>
                            <button onClick={() => handleFilterSelection('delivery partner')} className="hover:bg-primaryColor hover:text-white px-2 py-[2px] w-full text-start rounded-md transition ease-in-out duration-500">Delivery Partners</button>
                            <button onClick={() => handleFilterSelection('delivery person')} className="hover:bg-primaryColor hover:text-white px-2 py-[2px] w-full text-start rounded-md transition ease-in-out duration-500">Delivery Persons</button>
                            <button onClick={() => handleFilterSelection('admin')} className="hover:bg-primaryColor hover:text-white px-2 py-[2px] w-full text-start rounded-md transition ease-in-out duration-500">Admins</button>
                        </div>
                    )}
                    {selectedFilter && (
                        <div className="flex items-center gap-2 px-4 h-full rounded-xl bg-gray-200 ring-1 ring-gray-200 text-gray-700">
                            <p className="font-semibold">{selectedFilter}</p>
                            <MdClose
                                className="text-xl cursor-pointer hover:text-red-500"
                                onClick={clearFilter}
                            />
                        </div>
                    )}
                </div>

                <div className="relative flex gap-2">
                    {selectedShort && (
                        <div className="flex items-center gap-2 px-4 h-full rounded-xl bg-gray-200 ring-1 ring-gray-200 text-gray-700">
                            <p className="font-semibold">{selectedShort}</p>
                            <MdClose
                                className="text-xl cursor-pointer hover:text-red-500"
                                onClick={clearShort}
                            />
                        </div>
                    )}
                    <button
                        className="flex gap-2 items-center ring-1 ring-gray-500 px-4 rounded-xl hover:bg-primaryColor hover:text-white hover:ring-primaryColor transition ease-in-out duration-500"
                        onClick={() => handleShortDropDown()}
                    >
                        <RiArrowDropDownLine className="text-2xl" />
                        Short
                        <MdShortText className="text-xl" />
                    </button>
                    {isShortDropDownOpen && (
                        <div className={`flex flex-col w-max absolute top-8 right-0 bg-white items-start py-2 px-2 gap-1 rounded-md drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] z-50 ${isShortDropDownOpen ? 'opacity-100' : 'opacity-0'} transition ease-in-out duration-500`}>
                            <button onClick={() => handleShortSelection('new to old')} className="hover:bg-primaryColor hover:text-white px-2 py-[2px] w-full text-start rounded-md transition ease-in-out duration-500">New to old</button>
                            <button onClick={() => handleShortSelection('old to new')} className="hover:bg-primaryColor hover:text-white px-2 py-[2px] w-full text-start rounded-md transition ease-in-out duration-500">Old to new</button>
                        </div>
                    )}

                </div>
            </div>

            <div className="flex flex-wrap gap-4 ring-1 ring-gray-300 p-4 my-10 rounded-md">
                {sortedUsers().length > 0 ? (
                    sortedUsers().map((user, index) => (
                        <div
                            key={user._id}
                            onMouseEnter={() => setVisibleId(user._id)}
                            onMouseLeave={() => setVisibleId(null)}
                            className="ring-1 ring-gray-300 rounded-sm p-4 relative w-full"
                        >
                            <p><strong className="font-semibold">Id: </strong>{user._id}</p>
                            <p><strong className="font-semibold">Name: </strong>{`${user.firstName} ${user.lastName}`}</p>
                            <p><strong className="font-semibold">E-mail: </strong>{user.email || '<E-mail does not added>'}</p>
                            <p><strong className="font-semibold">Mobile Numbers: </strong>{user.mobileNumber.join(',')}</p>
                            <p><strong className="font-semibold">Role: </strong>{user.userType}</p>
                            <p><strong className="font-semibold">Created At: </strong>{user.createdAt.toLocaleDateString()}</p>

                            {/* Button Container */}
                            <div className={`absolute top-0 right-0 p-2 ${visibleId === user._id ? 'opacity-100' : 'opacity-0'} transition ease-in-out duration-500`}>
                                {visibleId === user._id && (
                                    <div className="flex gap-1 items-end">
                                        {/* Edit/Save Button */}
                                        <div className="relative">
                                            <button
                                                onClick={() => setEditId(editId === user._id ? null : user._id)}
                                                onMouseEnter={() => setHoveredButton(user._id + "-edit")}
                                                onMouseLeave={() => setHoveredButton(null)}
                                                className="flex items-center hover:bg-primaryColor hover:text-white p-1 rounded-md transition ease-in-out duration-500"
                                            >
                                                {editId === user._id ? <MdSave className="w-5 h-5" /> : <MdEdit className="w-5 h-5" />}
                                            </button>
                                            {hoveredButton === user._id + "-edit" && (
                                                <span className="absolute w-max right-0 top-1/2 transform translate-y-4 bg-gray-800 text-white text-xs p-1 rounded">
                                                    {editId === user._id ? "Save Changes" : "Edit User"}
                                                </span>
                                            )}
                                        </div>

                                        {/* Block/Unblock Button */}
                                        <div className="relative">
                                            <button
                                                onClick={() => toggleBlockStatus(user._id)}
                                                onMouseEnter={() => setHoveredButton(user._id + "-block")}
                                                onMouseLeave={() => setHoveredButton(null)}
                                                className="flex items-center hover:bg-red-500 hover:text-white p-1 rounded-md transition ease-in-out duration-500"
                                            >
                                                {user.blocked ? <CgUnblock className="w-5 h-5" /> : <MdBlock className="w-5 h-5" />}
                                            </button>
                                            {hoveredButton === user._id + "-block" && (
                                                <span className="absolute w-max right-0 top-1/2 transform translate-y-4 bg-gray-800 text-white text-xs p-1 rounded">
                                                    {user.blocked ? "Unblock User" : "Block User"}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <p className="absolute font-bold right-4 bottom-2">{index + 1}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center w-full">No users found.</p>
                )}
            </div>

            <div className="flex justify-center gap-4">
                <button
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
                >
                    Prev
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageClick(index + 1)}
                        className={`px-4 py-2 rounded-md ${currentPage === index + 1 ? 'bg-primaryColor text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Users;
