/* eslint-disable @next/next/no-img-element */
import getConfig from 'next/config';
import React from 'react';
import AppConfig from '../../layout/AppConfig';
import Link from 'next/link';
import { Page } from '@/types/layout';
import MyLottieAnimation from '@/components/MyLottieAnimation';

const NotFoundPage: Page = () => {
  const contextPath = getConfig().publicRuntimeConfig.contextPath;

  return (
    <div className='surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden'>
      <div className='flex flex-column align-items-center justify-content-center'>
        <div
          style={{
            borderRadius: '56px',
            padding: '0.3rem',
            background:
              'linear-gradient(180deg, rgba(33, 150, 243, 0.4) 10%, rgba(33, 150, 243, 0) 30%)',
          }}
        >
          <div
            className='w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center'
            style={{ borderRadius: '53px' }}
          >
            <MyLottieAnimation
              src='https://assets10.lottiefiles.com/packages/lf20_RaWlll5IJz.json'
              height='45%'
              width='45%'
            />
            <h1 className='text-900 font-bold text-5xl mb-2'>Not Found</h1>
            <div className='text-600 mb-5'>Requested resource is not available</div>
            <div className='col-12 mt-5 text-center'>
              <i
                className='pi pi-fw pi-arrow-left text-blue-500 mr-2'
                style={{ verticalAlign: 'center' }}
              ></i>
              <Link href={`${contextPath}/`} passHref>
                <span className='text-blue-500'>Go to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

NotFoundPage.getLayout = function getLayout(page) {
  return (
    <React.Fragment>
      {page}
      <AppConfig simple />
    </React.Fragment>
  );
};

export default NotFoundPage;
