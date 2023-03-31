/**
 * Created by handlePutProduct
 * Date: 2023/03/30
 * Time: 9:28 PM
 */

import { NextApiRequest, NextApiResponse } from 'next';
import httpMocks from 'node-mocks-http';
import fs from 'fs';
import path from 'path';
import { IProductsDTO } from '@/dtos/Products';
import handler from '@/pages/api/products';

describe('PUT /api/products', () => {
  it('should update the specified product and return the updated product', async () => {
    // Add a test product to update
    const testProduct = {
      productId: 'test-update',
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

    // Update some fields in the test product
    const updatedFields = {
      productName: 'Updated Test Product',
      productOwnerName: 'Updated Test Product Owner',
    };

    const req = httpMocks.createRequest({
      method: 'PUT',
      body: { ...updatedFields, productId: testProduct.productId },
    });

    const res = httpMocks.createResponse();

    await handler(req, res);

    // Read the updated data from the file
    const updatedData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

    // Check if the test product is updated with the new fields and the status code is 200
    const updatedProduct = updatedData.find(
      (product: IProductsDTO) => product.productId === testProduct.productId,
    );
    expect(updatedProduct).toMatchObject(updatedFields);
    expect(res.statusCode).toBe(200);

    // Clean up: Remove the test product from the list
    const dataToRemove = currentData.filter(
      (product: IProductsDTO) => product.productId !== testProduct.productId,
    );
    fs.writeFileSync(dataFilePath, JSON.stringify(dataToRemove));
  });

  it('should return a 404 status code if the product is not found', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      body: { productId: 'non-existing-id', productName: 'Non-existing product' },
    });

    const res = httpMocks.createResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(404);
  });
});
