/**
 * Created by Pablo Silva
 * Date: 2023/03/27
 * Time: 11:23 PM
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import fsPromises from 'fs/promises';
import * as path from 'path';

/**
 * @swagger
 *  /api/products:
 *     get:
 *       summary: Get all products
 *       tags:
 *         - Products
 *       description: Returns a list of all products in the database
 *       responses:
 *         200:
 *           description: OK
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/definitions/Product'
 *         500:
 *           description: Internal Server Error
 *
 * definitions:
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
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  //Find the absolute path of the json directory
  const filePath = path.join(process.cwd(), 'src/localDataBase/data.json');
  //Read the json data file data.json
  const jsonData = await fsPromises.readFile(filePath, 'utf-8');

  const objectData = JSON.parse(jsonData);

  //Return the content of the data file in json format
  res.status(200).json(objectData);
}
