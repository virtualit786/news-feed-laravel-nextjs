
'use client';

import React from 'react';
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { useRouter } from 'next/navigation';
import { useAuth } from '@components/context/AuthContext';

export const NavBar = () => {
const { logout } = useAuth();

  const router = useRouter();
  const items: MenuItem[] = [
    {
      label: 'Articles',
      icon: '',
      command: () => {
        router.push('/articles');
      }
    },
    {
      label: 'Preferences',
      icon: '',
      command: () => {
        router.push('/preferences');
      }
    },
    {
      label: 'Logout',
      icon: '',
      command: () => {
        logout();
        router.push('/auth/login');
      }
    }
  ];

  return (
    <div className="card custom-container" style={{backgroundColor: "#f9fafb"}}>
      <Menubar model={items} className='justify-content-end' />
    </div>
  )
}