import React from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '../types/types';

const AppMenu = () => {
  const model: AppMenuItem[] = [
    {
      label: 'Home',
      items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }],
    },
    {
      label: 'Operations',
      items: [{ label: 'Products', icon: 'pi pi-fw pi-id-card', to: '/products' }],
    },
  ];

  return (
    <MenuProvider>
      <ul className='layout-menu'>
        {model.map((item, i) => {
          return !item?.seperator ? (
            <AppMenuitem item={item} root={true} index={i} key={item.label} />
          ) : (
            <li className='menu-separator'></li>
          );
        })}
      </ul>
    </MenuProvider>
  );
};

export default AppMenu;
