/**
 * Created by Pablo Silva
 * Date: 2023/03/27
 * Time: 11:23 PM
 */

import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fsPromises from 'fs/promises';
import { IProductsDTO } from '@/dtos/Products';
import fs from 'fs';

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  //Find the absolute path of the json directory
  const dataFilePath = path.join(process.cwd(), 'src/localDataBase/data.json');
  //Read the json data file data.json
  const jsonData = await fsPromises.readFile(dataFilePath, 'utf-8');

  const objectData = JSON.parse(jsonData);

  //Return the content of the data file in json format
  res.status(200).json(objectData);
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const newProduct: IProductsDTO = req.body;

  const dataFilePath = path.join(process.cwd(), 'src/localDataBase/data.json');

  const jsonData = await fsPromises.readFile(dataFilePath, 'utf-8');

  const currentData: IProductsDTO[] = JSON.parse(jsonData);

  // Add the new product to the current data
  currentData.push(newProduct);

  // Write the updated data back to the file
  fs.writeFileSync(dataFilePath, JSON.stringify(currentData));

  // Send a response with the updated data
  res.status(200).json(currentData);
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
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
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
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
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      await handleGet(req, res);
      break;
    case 'POST':
      await handlePost(req, res);
      break;
    case 'PUT':
      await handlePut(req, res);
      break;
    case 'DELETE':
      await handleDelete(req, res);
      break;
    default:
      res.status(405).json({ error: 'Method not available' });
  }
}
