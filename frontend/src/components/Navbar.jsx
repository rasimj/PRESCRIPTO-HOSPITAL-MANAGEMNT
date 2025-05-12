import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
    const navigate = useNavigate();

    const {token,setToken,userData} = useContext(AppContext)

    const [showMenu, setShowMenu] = useState(false);
    

    const logout = () =>{
        setToken('false')
        localStorage.removeItem('token')
    }

    return (
        <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
            <img className='w-44 cursor-pointer' src={assets.logo} alt="Company Logo" />
            <ul className='hidden md:flex items-start gap-5 font-medium'>
                <NavLink to='/' className={({ isActive }) => isActive ? 'text-primary font-semibold' : ''}>
                    <li className='py-1 relative'>
                        HOME
                        {window.location.pathname === '/' && <hr className='absolute left-0 right-0 bottom-[-4px] h-0.5 bg-primary w-3/5 m-auto' />}
                    </li>
                </NavLink>
                <NavLink to='/doctors' className={({ isActive }) => isActive ? 'text-primary font-semibold' : ''}>
                    <li className='py-1 relative'>
                        ALL DOCTORS
                        {window.location.pathname === '/doctors' && <hr className='absolute left-0 right-0 bottom-[-4px] h-0.5 bg-primary w-3/5 m-auto' />}
                    </li>
                </NavLink>
                <NavLink to='/about' className={({ isActive }) => isActive ? 'text-primary font-semibold' : ''}>
                    <li className='py-1 relative'>
                        ABOUT
                        {window.location.pathname === '/about' && <hr className='absolute left-0 right-0 bottom-[-4px] h-0.5 bg-primary w-3/5 m-auto' />}
                    </li>
                </NavLink>
                <NavLink to='/contact' className={({ isActive }) => isActive ? 'text-primary font-semibold' : ''}>
                    <li className='py-1 relative'>
                        CONTACT
                        {window.location.pathname === '/contact' && <hr className='absolute left-0 right-0 bottom-[-4px] h-0.5 bg-primary w-3/5 m-auto' />}
                    </li>
                </NavLink>
            </ul>
            <div className='flex items-center gap-4'>
                {token && userData
                ? (
                    <div className='flex items-center gap-2 cursor-pointer group relative'>
                        <img className='w-8 rounded-full' src={userData.image} alt="Profile" />
                        <img className='w-2.5' src={assets.dropdown_icon} alt="Dropdown" />
                        <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                            <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                                <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                                <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                                <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Create account</button>
                )}

                <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="Menu" />

                {/* Mobile View */}
                {showMenu && (
                    <div className='fixed w-full h-full md:hidden right-0 top-0 bottom-0 z-50 bg-white transition-all'>
                        <div className='flex justify-between items-center p-5'>
                            <img src={assets.logo} alt="Company Logo" />
                            <img className='w-7 cursor-pointer' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="Close Menu" />
                        </div>
                        <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                            <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded inline-block'>HOME</p></NavLink>
                            <NavLink onClick={() => setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block'>ALL DOCTORS</p></NavLink>
                            <NavLink onClick={() => setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>ABOUT</p></NavLink>
                            <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>CONTACT</p></NavLink>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;