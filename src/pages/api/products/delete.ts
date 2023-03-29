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
 * /api/products/delete:
 *     delete:
 *       summary: Delete a product by ID
 *       tags:
 *          - Products
 *       description: Deletes a product with the specified ID from the database
 *       parameters:
 *         - name: body
 *           in: body
 *           description: The product ID to be deleted
 *           required: true
 *           schema:
 *             $ref: '#/definitions/DeleteProductInput'
 *       responses:
 *         200:
 *           description: OK
 *           schema:
 *             $ref: '#/definitions/DeleteProductOutput'
 *         404:
 *           description: Product not found
 *         500:
 *           description: Internal Server Error
 *
 * definitions:
 *   DeleteProductInput:
 *     type: object
 *     properties:
 *       productId:
 *         type: string
 *   DeleteProductOutput:
 *     type: array
 *     items:
 *       $ref: '#/definitions/Product'
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
  if (req.method === 'DELETE') {
    const { productId } = req.body;

    const dataFilePath = path.join(process.cwd(), 'src/localDataBase/data.json');

    // Read the current data from the file
    const currentData: IProductsDTO[] = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

    // Find the index of the product to delete
    const index = currentData.findIndex((product) => product.productId === productId);

    if (index === -1) {
      res.status(404).json({ message: `Product with ID ${productId} not found` });
      return;
    }

    // Remove the product from the current data
    currentData.splice(index, 1);

    // Write the updated data back to the file
    fs.writeFileSync(dataFilePath, JSON.stringify(currentData, null, 2));

    // Send a response with the updated data
    res.status(200).json(currentData);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
