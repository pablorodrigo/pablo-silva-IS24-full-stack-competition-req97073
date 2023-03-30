/**
 * Created by Pablo Silva
 * Date: 2023/03/27
 * Time: 11:23 PM
 */

import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect, { NextHandler } from 'next-connect';
import path from 'path';
import fsPromises from 'fs/promises';
import { IProductsDTO } from '@/dtos/Products';
import fs from 'fs';

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  //Find the absolute path of the json directory
  const filePath = path.join(process.cwd(), 'src/localDataBase/data.json');
  //Read the json data file data.json
  const jsonData = await fsPromises.readFile(filePath, 'utf-8');

  const objectData = JSON.parse(jsonData);

  //Return the content of the data file in json format
  res.status(200).json(objectData);
});

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
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
});

handler.put(async (req: NextApiRequest, res: NextApiResponse) => {
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
});

handler.delete(async (req: NextApiRequest, res: NextApiResponse) => {
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
});

export default handler;
