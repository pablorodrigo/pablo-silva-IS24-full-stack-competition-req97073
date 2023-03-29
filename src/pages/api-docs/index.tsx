/**
 * Created by Pablo Silva
 * Date: 2023/03/28
 * Time: 5:27 PM
 */

import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { createSwaggerSpec } from 'next-swagger-doc';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';
import React, { ReactElement } from 'react';

const SwaggerUI = dynamic<{
  spec: any;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
}>(import('swagger-ui-react'), { ssr: false });

// Component that renders the API documentation page
function ApiDoc({ spec }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <SwaggerUI spec={spec} />;
}

// Function to generate the Swagger specification from a definition
export const getStaticProps: GetStaticProps = async () => {
  const spec: Record<string, any> = createSwaggerSpec({
    apiFolder: 'src/pages/api/products',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'IMP API',
        version: '1.0',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
      ],
    },
  });

  return {
    props: {
      spec,
    },
  };
};

ApiDoc.getLayout = function getLayout(page: ReactElement) {
  return <React.Fragment>{page}</React.Fragment>;
};

export default ApiDoc;
