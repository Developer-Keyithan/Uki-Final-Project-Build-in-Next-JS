import './style.css'
import Navbar from '../../../Components/Navbar/Navbar'

function index() {
    return (
        <div>
            <div className='sticky top-0'>
                <Navbar />
                <hr />
            </div>
            {/* Cart */}
            <div className='flex mx-60'>
                {/* Right section */}
                <div className='flex flex-wrap gap-5 w-3/5 ring-1 ring-gray-300 p-4 mt-5 rounded-md'>
                    <div className='flex gap-5 w-full'>
                        <input type="checkbox" className='accent-primaryColor h-5 w-5' />
                        <div className="flex w-full ring-1 ring-gray-300 rounded-sm px-4 py-3">
                            <div className='w-1/5'>

                            </div>

                            <div className='4/5'>
                                <h1 className='font-semibold text-xl'>Product Name</h1>
                            </div>
                        </div>
                    </div>

                    
                </div>
                {/* Left secion */}
                <div className="w-2/5"></div>
            </div>
        </div>
    )
}

export default index