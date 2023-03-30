/**
 * Created by Pablo Silva
 * Date: 2023/03/30
 * Time: 12:03 AM
 */

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';
import React, { ReactElement } from 'react';

// @ts-ignore
const SwaggerUI = dynamic<{ url: string }>(import('swagger-ui-react'), {
  ssr: false,
});

export default function ApiDocs() {
  return (
    <div>
      <SwaggerUI url='/swagger.json' />
    </div>
  );
}

ApiDocs.getLayout = function getLayout(page: ReactElement) {
  return <React.Fragment>{page}</React.Fragment>;
};
