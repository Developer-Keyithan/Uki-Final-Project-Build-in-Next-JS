import { useState } from "react";
import { MdDelete, MdEdit, MdSave, MdUpdate } from "react-icons/md";

function Users() {
    const [editId, setEditId] = useState<string | null>(null);
    const [visibleId, setVisibleId] = useState<string | null>(null);

    const users = [{
        id: 'U0001',
        name: 'Thanathipan',
        email: 'thana@gmail.com',
        numbers: [771234567, 767418529],
        role: 'admin'
    }, {
        id: 'U0002',
        name: 'Thulakshikan',
        email: 'thulakshi@gmail.com',
        numbers: [771234567, 767418529],
        role: 'seller'
    }];

    return (
        <div className="flex flex-wrap gap-4 ring-1 ring-gray-300 p-4 my-10 rounded-md">
            {users.map((user) => (
                <div
                    key={user.id}
                    onMouseEnter={() => setVisibleId(user.id)}
                    onMouseLeave={() => setVisibleId(null)}
                    className="ring-1 ring-gray-300 rounded-sm p-4 w-full relative"
                >
                    <p><strong className="font-semibold">Id: </strong>{user.id}</p>
                    <p><strong className="font-semibold">Name: </strong>{user.name}</p>
                    <p><strong className="font-semibold">E-mail: </strong>{user.email}</p>
                    <p><strong className="font-semibold">Mobile Numbers: </strong>{user.numbers.join(', ')}</p>
                    <p><strong className="font-semibold">Role: </strong>{user.role}</p>
                    <div className={`absolute top-0 right-0 p-2 ${visibleId === user.id ? 'opacity-100' : 'opacity-0'} transition ease-in-out duration-500`}>
                        {visibleId === user.id && (
                            <div className="flex gap-2">
                                {editId === user.id ? <MdSave onClick={() => setEditId(null)} /> : <MdEdit onClick={() => setEditId(user.id)} />}
                                <MdDelete className="bg-black h-6 w-6" />
                                <MdUpdate />
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Users;
