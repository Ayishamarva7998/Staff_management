import {  useEffect, useState } from 'react';
import { IoSettings } from 'react-icons/io5';
import { Menu } from '@headlessui/react'; // Import Headless UI Menu components
import Profile from './Profile';



function formatRout(rout) {
  return rout
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};



export default function Header({rout}) {
  

  const formattedRout = formatRout(rout);
   
  const [isProfileModalOpen, setIsProfileModalOpen]=useState(false);

  useEffect(()=>{
    document.title = `${rout}` || 'staff management';
  },[rout]);


  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);


  const menuOptions = [
    { 
      name: 'Your Profile', 
      href: '#',
      action: () => { 
        openProfileModal(); // Open the profile modal
      }
    },
    { name: 'Sign out', href: '#', action: () => { 
      // Clear local storage and redirect
      localStorage.clear(); 
      window.location.href = '/'; 
    }}
  ];

  return (<>
    <header className="bg-white text-dark-gray shadow-md">
      <nav className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">       
        <div className="relative flex h-16 items-center justify-between">
        <h1 className="text-2xl font-bold text-dark-gray">{formattedRout}</h1>
          <div className="flex-1" />

          <Menu as="div" className="relative ml-3">
            <div>
              <Menu.Button className="relative flex rounded-full text-sm">
                <span className="sr-only">Open menu</span>
                <IoSettings size={25} className="text-dark-gray" />
              </Menu.Button>
            </div>
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none">
              {menuOptions.map((option) => (
                <Menu.Item key={option.name}>
                  {({ active }) => (
                    <a
                      href={option.href}
                      onClick={(e) => {
                        e.preventDefault(); // Prevent the default link behavior
                        if (option.action) {
                          option.action(); // Call the action if it exists
                        }
                      }}
                      className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100' : 'text-gray-700'}`}
                    >
                      {option.name}
                    </a>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Menu>
        </div>
      </nav>
    </header>

{isProfileModalOpen&&  <Profile isOpen={isProfileModalOpen} closeModal={closeProfileModal}/>}
  
    </>
  );
}
