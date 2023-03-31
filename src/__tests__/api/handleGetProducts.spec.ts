/**
 * Created by Pablo Silva
 * Date: 2023/03/27
 * Time: 11:26 PM
 */

import httpMocks from 'node-mocks-http';
import fs from 'fs';
import path from 'path';
import handler from '@/pages/api/products';

describe('GET /api/products', () => {
  it('should return the list of products as JSON', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
    });

    const res = httpMocks.createResponse();

    await handler(req, res);

    const dataFilePath = path.join(process.cwd(), 'src/localDataBase/data.json');
    const jsonData = await fs.promises.readFile(dataFilePath, 'utf-8');
    const expectedData = JSON.parse(jsonData);
    // Expect the response status code to be 200
    expect(res._getStatusCode()).toBe(200);
    // Expect the response body to be the products data as JSON
    expect(JSON.parse(res._getData())).toEqual(expectedData);
  });
});
