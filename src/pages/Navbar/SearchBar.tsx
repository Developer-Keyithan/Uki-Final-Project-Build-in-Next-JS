'use client'

import { useRouter } from "next/router"
import { BiSearch } from "react-icons/bi"

const SearchBar = () => {
    const router = useRouter();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('search') as string;

        if (name) {
            router.push(`/list?search=${name}`)
        }
    }
    return (
        <div>
            <form onSubmit={handleSearch} className='flex flex-row gap-2 items-center bg-gray-200 py-2 px-4 rounded-full w-96'>
                <input type="search" placeholder='Search...'
                    className='w-full h-full outline-none bg-gray-200'
                    name='search'

                />
                <button className="cursor-pointer">
                    <BiSearch className='text-xl bg-green flex justify-center items-center' />
                </button>
            </form>
        </div>
    )
}

export default SearchBar
