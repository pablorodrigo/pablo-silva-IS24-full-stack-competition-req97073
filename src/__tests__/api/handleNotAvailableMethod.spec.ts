/**
 * Created by handleNorAvailableMethod
 * Date: 2023/03/30
 * Time: 9:37 PM
 */

import httpMocks from 'node-mocks-http';
import handler from '@/pages/api/products';

describe('API handler', () => {
  it('should return a 405 status code and an error message for unsupported methods', async () => {
    const req = httpMocks.createRequest({
      method: 'PATCH',
    });

    const res = httpMocks.createResponse();

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({ error: 'Method not available' });
  });
});
