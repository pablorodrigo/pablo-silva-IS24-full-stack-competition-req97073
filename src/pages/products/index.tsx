/**
 * Created by Pablo Silva
 * Date: 2023/03/27
 * Time: 10:37 PM
 */

import React, { useEffect, useRef, useState } from 'react';
import { IProductsDTO } from '@/dtos/Products';
import ProductsDataTable from '@/components/products/ProductsDataTable';
import { Toast } from 'primereact/toast';

export default function Products() {
  const [products, setProducts] = useState<IProductsDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  const callAPI = async () => {
    try {
      const res = await fetch(`/api/products`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleCallingAPI = async () => {
    setLoading(true);
    callAPI().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    handleCallingAPI();
  }, []);

  return (
    <div className='grid'>
      <div className='col-12'>
        <div className='card'>
          <Toast ref={toast} />

          <ProductsDataTable
            products={products}
            loading={loading}
            handleCallingAPI={handleCallingAPI}
            toast={toast}
          />
        </div>
      </div>
    </div>
  );
}
