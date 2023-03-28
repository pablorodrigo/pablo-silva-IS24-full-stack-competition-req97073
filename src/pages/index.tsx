import React from 'react';
import getConfig from 'next/config';

export default function Home() {
  const contextPath = getConfig().publicRuntimeConfig.contextPath;

  return (
    <div>
      <div className='grid'>
        <div className='col-12'>
          <div className='card'>
            <div className='flex align-items-center justify-content-center flex-column gap-2 p-3'>
              <img
                src={`${contextPath}/assets/logo_imb.png`}
                height='300px'
                width='300px'
                alt='logo'
              />
              <span style={{ fontSize: 20 }}>
                BC Government Ministry of Citizens Services Information Management Branch (IMB)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
