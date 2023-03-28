/**
 * Created by Pablo Silva
 * Date: 2023/03/27
 * Time: 11:23 PM
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import fsPromises from 'fs/promises';
import * as path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  //Find the absolute path of the json directory
  const filePath = path.join(process.cwd(), 'src/localDataBase/data.json');
  //Read the json data file data.json
  const jsonData = await fsPromises.readFile(filePath, 'utf-8');

  const objectData = JSON.parse(jsonData);

  //Return the content of the data file in json format
  res.status(200).json(objectData);
}
