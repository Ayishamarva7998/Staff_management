import { useState } from 'react';
import { IoSettings } from 'react-icons/io5';
import { Menu } from '@headlessui/react'; // Import Headless UI Menu components

const menuOptions = [
  { name: 'Your Profile', href: '#'  },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#', action: () => { 
    // Clear local storage and redirect
    localStorage.clear(); 
    window.location.href = '/'; 
  }}
];

export default function Header() {
  return (
    <header className="bg-white text-dark-gray shadow-md">
      <nav className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
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
  );
}
