/**
 * Created by Pablo Silva
 * Date: 2023/03/28
 * Time: 12:22 PM
 */

import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { IProductsDTO } from '@/dtos/Products';
import fsPromises from 'fs/promises';

/**
 * @swagger
 * /api/products/create:
 *     post:
 *       summary: Create a new product
 *       tags:
 *          - Products
 *       description: Creates a new product with the provided data
 *       parameters:
 *         - name: body
 *           in: body
 *           description: The product data to be created
 *           required: true
 *           schema:
 *             $ref: '#/definitions/ProductInput'
 *       responses:
 *         200:
 *           description: OK
 *           schema:
 *             $ref: '#/definitions/ProductOutput'
 *         400:
 *           description: Bad Request
 *         405:
 *           description: Method Not Allowed
 *         500:
 *           description: Internal Server Error
 *
 * definitions:
 *   ProductInput:
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
 *   ProductOutput:
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
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const newProduct: IProductsDTO = req.body;

    const dataFilePath = path.join(process.cwd(), 'src/localDataBase/data.json');

    const jsonData = await fsPromises.readFile(dataFilePath);

    // Read the current data from the file
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const currentData: IProductsDTO[] = JSON.parse(jsonData);

    // Add the new product to the current data
    currentData.push(newProduct);

    // Write the updated data back to the file
    fs.writeFileSync(dataFilePath, JSON.stringify(currentData));

    // Send a response with the updated data
    res.status(200).json(currentData);
  } else {
    res.status(405).send('Method not allowed');
  }
}
