/**
 * Created by Pablo Silva
 * Date: 2023/03/28
 * Time: 12:23 PM
 */

import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { IProductsDTO } from '@/dtos/Products';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { productId }: { productId: string } = req.body;

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
