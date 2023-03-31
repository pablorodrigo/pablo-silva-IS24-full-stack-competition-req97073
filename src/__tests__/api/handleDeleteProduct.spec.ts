/**
 * Created by handleDeleteProduct
 * Date: 2023/03/30
 * Time: 9:26 PM
 */

import httpMocks from 'node-mocks-http';
import fs from 'fs';
import path from 'path';
import handler from '@/pages/api/products';

describe('DELETE /api/products', () => {
  it('should delete the specified product and return the updated list', async () => {
    // Add a test product to delete
    const testProduct = {
      productId: 'test-delete',
      productName: 'Test Product',
      productOwnerName: 'Test Product Owner',
      Developers: ['Developer 1', 'Developer 2'],
      scrumMasterName: 'Test Scrum Master',
      startDate: '2023-04-01',
      methodology: 'Scrum',
    };

    const dataFilePath = path.join(process.cwd(), 'src/localDataBase/data.json');
    const currentData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

    // Add the test product to the list
    currentData.push(testProduct);
    fs.writeFileSync(dataFilePath, JSON.stringify(currentData, null, 2));

    const req = httpMocks.createRequest({
      method: 'DELETE',
      body: { productId: testProduct.productId },
    });

    const res = httpMocks.createResponse();

    await handler(req, res);

    // Read the updated data from the file
    const updatedData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

    // Check if the test product is removed from the list and the status code is 200
    expect(updatedData).not.toContainEqual(testProduct);
    expect(res.statusCode).toBe(200);
  });

  it('should return a 404 status code if the product is not found', async () => {
    const req = httpMocks.createRequest({
      method: 'DELETE',
      body: { productId: 'non-existing-id' },
    });

    const res = httpMocks.createResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(404);
  });
});
