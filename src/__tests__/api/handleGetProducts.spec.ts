/**
 * Created by Pablo Silva
 * Date: 2023/03/27
 * Time: 11:26 PM
 */

import handler from '@/pages/api/products/index';
import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import productsData from '@/localDataBase/data-for-tests.json';

describe('GET /api/products', () => {
  it('returns the products data as JSON', async () => {
    // Create mock request and response objects
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    // Call the handler function with the mock request and response objects
    await handler(req, res);

    // Expect the response status code to be 200
    expect(res.statusCode).toBe(200);

    // Expect the response body to be the products data as JSON
    expect(res._getJSONData()).toEqual(productsData);
  });
});
