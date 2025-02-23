'use client';

import { classNames } from 'primereact/utils';
import React from 'react';

interface IFormLayoutProps {
    children: React.ReactNode;
}

const FormLayout = ({ children }: IFormLayoutProps) => {
    return (
        <React.Fragment>
            <div className='flex align-items-center justify-content-center' style={{ height: 'calc(100vh - 30px)' }}>
                <div className="flex flex-column align-items-center justify-content-center">
                    <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }} >
                        <div className="w-full surface-card py-6 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default FormLayout;
