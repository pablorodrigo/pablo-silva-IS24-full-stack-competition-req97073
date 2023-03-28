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
