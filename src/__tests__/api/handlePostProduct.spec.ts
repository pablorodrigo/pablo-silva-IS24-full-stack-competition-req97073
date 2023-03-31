/**
 * Created by handleDeleteProduct
 * Date: 2023/03/30
 * Time: 8:35 PM
 */

import { NextApiRequest, NextApiResponse } from 'next';
import httpMocks from 'node-mocks-http';
import fs from 'fs';
import path from 'path';
import handler from '@/pages/api/products';
import uuid from 'react-uuid';
import { IProductsDTO } from '@/dtos/Products';

describe('POST /api/products', () => {
  it('should add a new product to the list and return the updated list', async () => {
    const newProduct: IProductsDTO = {
      productId: uuid(),
      productName: 'Test Product',
      productOwnerName: 'Test Product Owner',
      Developers: ['Developer 1', 'Developer 2'],
      scrumMasterName: 'Test Scrum Master',
      startDate: '2023-04-01',
      methodology: 'Scrum',
    };

    const req = httpMocks.createRequest({
      method: 'POST',
      body: newProduct,
    });

    const res = httpMocks.createResponse();

    await handler(req, res);

    // Read the data from the file
    const dataFilePath = path.join(process.cwd(), 'src/localDataBase/data.json');
    const jsonData = fs.readFileSync(dataFilePath, 'utf8');
    const currentData = JSON.parse(jsonData);

    // Check if the new product is in the list and the status code is 200
    expect(currentData).toContainEqual(newProduct);
    expect(res.statusCode).toBe(200);

    // Clean up: Remove the test product from the list
    const updatedData = currentData.filter(
      (product: IProductsDTO) => product.productId !== newProduct.productId,
    );
    fs.writeFileSync(dataFilePath, JSON.stringify(updatedData));
  });
});
