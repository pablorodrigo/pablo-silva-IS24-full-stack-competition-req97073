import getConfig from 'next/config';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '../types/types';
import { LayoutContext } from './context/layoutcontext';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
  const { onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const topbarmenubuttonRef = useRef(null);
  const contextPath = getConfig().publicRuntimeConfig.contextPath;

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarmenu: topbarmenuRef.current,
    topbarmenubutton: topbarmenubuttonRef.current,
  }));

  return (
    <div className='layout-topbar'>
      <button
        ref={menubuttonRef}
        type='button'
        className='p-link layout-menu-button layout-topbar-button'
        onClick={onMenuToggle}
      >
        <i className='pi pi-bars' />
      </button>

      <button
        ref={topbarmenubuttonRef}
        type='button'
        className='p-link layout-topbar-menu-button layout-topbar-button'
        onClick={showProfileSidebar}
      >
        <i className='pi pi-ellipsis-v' />
      </button>
    </div>
  );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
