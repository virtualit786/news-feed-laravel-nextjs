'use client';

import React from 'react';
import { NavBar } from './NavBar';

interface IAppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: IAppLayoutProps) => {
  return (
    <React.Fragment>
        <div className='px-3'>
          <NavBar />
          {children}
        </div>
    </React.Fragment>
  );
};

export default AppLayout;
