/**
 * Created by Pablo Silva
 * Date: 2023/03/28
 * Time: 12:23 PM
 */

import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { IProductsDTO } from '@/dtos/Products';

/**
 * @swagger
 * /api/products/update:
 *     put:
 *       summary: Update a product by ID
 *       tags:
 *          - Products
 *       description: Updates a product with the specified ID in the database
 *       parameters:
 *         - name: body
 *           in: body
 *           description: The updated product fields and the product ID to be updated
 *           required: true
 *           schema:
 *             $ref: '#/definitions/UpdateProductInput'
 *       responses:
 *         200:
 *           description: OK
 *           schema:
 *             $ref: '#/definitions/Product'
 *         404:
 *           description: Product not found
 *         500:
 *           description: Internal Server Error
 *
 * definitions:
 *   UpdateProductInput:
 *     type: object
 *     properties:
 *       productId:
 *         type: string
 *       productName:
 *         type: string
 *       productOwnerName:
 *         type: string
 *       Developers:
 *         type: array
 *         items:
 *           type: string
 *       scrumMasterName:
 *         type: string
 *       startDate:
 *         type: string
 *       methodology:
 *         type: string
 *     required:
 *       - productId
 *   Product:
 *     type: object
 *     properties:
 *       productId:
 *         type: string
 *       productName:
 *         type: string
 *       productOwnerName:
 *         type: string
 *       Developers:
 *         type: array
 *         items:
 *           type: string
 *       scrumMasterName:
 *         type: string
 *       startDate:
 *         type: string
 *       methodology:
 *         type: string
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { productId, ...updatedFields }: IProductsDTO = req.body;

    const dataFilePath = path.join(process.cwd(), 'src/localDataBase/data.json');

    // Read the current data from the file
    const currentData: IProductsDTO[] = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

    // Find the index of the product to update
    const index = currentData.findIndex((product) => product.productId === productId);

    if (index === -1) {
      res.status(404).json({ message: `Product with ID ${productId} not found` });
      return;
    }

    // Update the product at the specified index
    const updatedProduct: IProductsDTO = { ...currentData[index], ...updatedFields };
    currentData[index] = updatedProduct;

    // Write the updated data back to the file
    fs.writeFileSync(dataFilePath, JSON.stringify(currentData, null, 2));

    // Send a response with the updated data
    res.status(200).json(updatedProduct);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
