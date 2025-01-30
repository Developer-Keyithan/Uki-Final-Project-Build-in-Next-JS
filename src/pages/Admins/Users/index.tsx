import { useState } from "react";
import { CgUnblock } from "react-icons/cg";
import { MdBlock, MdEdit, MdSave, MdUpdate } from "react-icons/md";

function Users() {
    const [editId, setEditId] = useState<string | null>(null);
    const [visibleId, setVisibleId] = useState<string | null>(null);
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);

    const [users, setUsers] = useState([
        {
            id: 'U0001',
            name: 'Thanathipan',
            email: 'thana@gmail.com',
            numbers: [771234567, 767418529],
            role: 'admin',
            blocked: false,
        }, {
            id: 'U0002',
            name: 'Thulakshikan',
            email: 'thulakshi@gmail.com',
            numbers: [771234567, 767418529],
            role: 'seller',
            blocked: false,
        }, {
            id: 'U0003',
            name: 'Thanathipan',
            email: 'thana@gmail.com',
            numbers: [771234567, 767418529],
            role: 'admin',
            blocked: false,
        }, {
            id: 'U0004',
            name: 'Thulakshikan',
            email: 'thulakshi@gmail.com',
            numbers: [771234567, 767418529],
            role: 'seller',
            blocked: false,
        }, {
            id: 'U0005',
            name: 'Thanathipan',
            email: 'thana@gmail.com',
            numbers: [771234567, 767418529],
            role: 'admin',
            blocked: false,
        }, {
            id: 'U0006',
            name: 'Thulakshikan',
            email: 'thulakshi@gmail.com',
            numbers: [771234567, 767418529],
            role: 'seller',
            blocked: false,
        }
    ]);

    // Function to toggle block/unblock status
    const toggleBlockStatus = (id: string) => {
        setUsers(users.map(user => 
            user.id === id ? { ...user, blocked: !user.blocked } : user
        ));
    };

    return (
        <div className="flex flex-wrap gap-4 ring-1 ring-gray-300 p-4 my-10 rounded-md">
            {users.map((user) => (
                <div
                    key={user.id}
                    onMouseEnter={() => setVisibleId(user.id)}
                    onMouseLeave={() => setVisibleId(null)}
                    className="ring-1 ring-gray-300 rounded-sm p-4 relative w-full"
                >
                    <p><strong className="font-semibold">Id: </strong>{user.id}</p>
                    <p><strong className="font-semibold">Name: </strong>{user.name}</p>
                    <p><strong className="font-semibold">E-mail: </strong>{user.email}</p>
                    <p><strong className="font-semibold">Mobile Numbers: </strong>{user.numbers.join(', ')}</p>
                    <p><strong className="font-semibold">Role: </strong>{user.role}</p>

                    {/* Button Container */}
                    <div className={`absolute top-0 right-0 p-2 ${visibleId === user.id ? 'opacity-100' : 'opacity-0'} transition ease-in-out duration-500`}>
                        {visibleId === user.id && (
                            <div className="flex gap-1 items-end">
                                {/* Edit/Save Button */}
                                <div className="relative">
                                    <button
                                        onClick={() => setEditId(editId === user.id ? null : user.id)}
                                        onMouseEnter={() => setHoveredButton(user.id + "-edit")}
                                        onMouseLeave={() => setHoveredButton(null)}
                                        className="flex items-center hover:bg-primaryColor hover:text-white p-1 rounded-md transition ease-in-out duration-500"
                                    >
                                        {editId === user.id ? <MdSave className="w-5 h-5" /> : <MdEdit className="w-5 h-5" />}
                                    </button>
                                    {hoveredButton === user.id + "-edit" && (
                                        <span className="absolute w-max right-0 top-1/2 transform translate-y-4 bg-gray-800 text-white text-xs p-1 rounded">
                                            {editId === user.id ? "Save Changes" : "Edit User"}
                                        </span>
                                    )}
                                </div>

                                {/* Block/Unblock Button */}
                                <div className="relative">
                                    <button
                                        onClick={() => toggleBlockStatus(user.id)}
                                        onMouseEnter={() => setHoveredButton(user.id + "-block")}
                                        onMouseLeave={() => setHoveredButton(null)}
                                        className="flex items-center hover:bg-red-700 hover:text-white p-1 rounded-md transition ease-in-out duration-500"
                                    >
                                        {user.blocked ? <CgUnblock className="w-5 h-5" /> : <MdBlock className="w-5 h-5" />}
                                    </button>
                                    {hoveredButton === user.id + "-block" && (
                                        <span className="absolute w-max right-0 top-1/2 transform translate-y-4 bg-gray-800 text-white text-xs p-1 rounded">
                                            {user.blocked ? "Unblock this account" : "Block this account"}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Users;
