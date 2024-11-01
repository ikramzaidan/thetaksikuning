import { FaTaxi, FaTimes } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";

const Sidebar = ({ isSidebarActive, setIsSidebarActive }) => {
    return(
        <div className={`${isSidebarActive ? ("") : ("hidden")} fixed lg:relative lg:flex w-80 h-full lg:h-auto bg-white border-r z-10`}>
            <div className="flex flex-col gap-5 p-5">
                <div className="flex lg:hidden justify-end w-full">
                    <button onClick={() => setIsSidebarActive(false)}><FaTimes /></button>
                </div>
                <div id="navbar-brand" className="cursor-pointer">
                    <img src="../nyc-tlc-logo.svg" alt="logo" />
                </div>
                <ul className="flex flex-col gap-2 font-semibold">
                    <li className="flex items-center gap-3 bg-gray-200 rounded px-5 py-2"><FaTaxi className="text-sm" />Trips</li>
                    <li className="flex items-center gap-3 hover:bg-gray-200 rounded px-5 py-2"><FaUser className="text-sm" />Users</li>
                </ul>
            </div>
        </div>
    )
}

export default Sidebar;