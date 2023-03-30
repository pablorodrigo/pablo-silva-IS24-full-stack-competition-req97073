/**
 * Created by Pablo Silva
 * Date: 2023/03/27
 * Time: 11:50 PM
 */

import React, { RefObject, useMemo, useState } from 'react';
import { IProductsDTO } from '@/dtos/Products';
import { DataTable, DataTableExpandedRows, DataTableFilterMeta } from 'primereact/datatable';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import DialogForm from '@/components/products/DialogForm';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';

interface IProps {
  products: IProductsDTO[];
  loading: boolean;
  handleCallingAPI: () => void;
  toast: RefObject<Toast>;
}

const defaultProductValues: IProductsDTO = {
  productId: '',
  productName: '',
  productOwnerName: '',
  Developers: [],
  scrumMasterName: '',
  startDate: '',
  methodology: '',
};

export default function ProductsDataTable({ products, loading, handleCallingAPI, toast }: IProps) {
  const [expandedRows, setExpandedRows] = useState<any[] | DataTableExpandedRows>([]);
  const [productSelected, setProductSelected] = useState<IProductsDTO>(defaultProductValues);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [allExpanded, setAllExpanded] = useState(false);
  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  // actions
  const deleteProduct = async () => {
    const response = await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: productSelected.productId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete product: ${response.statusText}`);
    }

    setDeleteProductDialog(false);
    setProductSelected(defaultProductValues);
    handleCallingAPI();
    toast.current?.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Product Deleted',
      life: 3000,
    });
  };

  // DataTable Configs
  const allowExpansion = (rowData: IProductsDTO) => {
    return rowData.Developers.length > 0;
  };

  const renderRowExpansionTemplate = (rowData: IProductsDTO) => {
    return (
      <div>
        {rowData.Developers.map((developer) => (
          <li key={developer} className='flex flex-column md:flex-row md:align-items-center mb-4'>
            <Avatar label={developer.charAt(0)} shape='circle'></Avatar>
            <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }}>{developer}</span>
          </li>
        ))}
      </div>
    );
  };

  const openNew = () => {
    setProductSelected(defaultProductValues);
    setProductDialog(true);
  };

  const handleEditProduct = (product: IProductsDTO) => {
    console.log(product);
    setProductSelected(product);
    setProductDialog(true);
  };

  const confirmDeleteProduct = (product: IProductsDTO) => {
    setProductSelected(product);
    setDeleteProductDialog(true);
  };

  const renderActionBodyTemplate = (rowData: IProductsDTO) => {
    return (
      <>
        <Button
          icon='pi pi-pencil'
          className='p-button-rounded p-button-success mr-2'
          onClick={() => handleEditProduct(rowData)}
        />
        <Button
          icon='pi pi-trash'
          className='p-button-rounded p-button-danger'
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </>
    );
  };

  const onGlobalFilterChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    const _filters = { ...filters };
    (_filters['global'] as any).value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  function listFilter(value: string[], filter: string) {
    console.log(value);
    if (!filter) {
      return true;
    }

    return value.some((item) => item.toLowerCase().includes(filter.toLowerCase()));
  }

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      productName: { value: null, matchMode: FilterMatchMode.CONTAINS },
      productOwnerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
      scrumMasterName: { value: null, matchMode: FilterMatchMode.CONTAINS },
      startAt: { value: null, matchMode: FilterMatchMode.CONTAINS },
      methodology: { value: null, matchMode: FilterMatchMode.CONTAINS },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Developers: (value: string[], filter: string) => listFilter(value, filter),
    });
    setGlobalFilterValue('');
  };

  const renderHeader = (
    <div className='flex justify-content-between'>
      <h4 className='m-0'>Manage Products</h4>
      <span className='p-input-icon-left'>
        <i className='pi pi-search' />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder='Global Search'
        />
      </span>
    </div>
  );

  //Dialog Configs

  const toggleDialog = () => {
    setProductDialog(!productDialog);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const renderDeleteProductDialogFooter = (
    <>
      <Button
        label='No'
        icon='pi pi-times'
        className='p-button-text'
        onClick={hideDeleteProductDialog}
      />
      <Button label='Yes' icon='pi pi-check' className='p-button-text' onClick={deleteProduct} />
    </>
  );

  // Toolbar
  const renderLeftToolbarTemplate = () => {
    return (
      <>
        <div className='my-2'>
          <Button
            label='New'
            icon='pi pi-plus'
            className='p-button-success mr-2'
            onClick={openNew}
          />
        </div>
      </>
    );
  };

  const toggleAll = () => {
    if (allExpanded) collapseAll();
    else expandAll();
  };

  const collapseAll = () => {
    setExpandedRows([]);
    setAllExpanded(false);
  };

  const expandAll = () => {
    const _expandedRows = {} as { [key: string]: boolean };
    products.forEach((p) => (_expandedRows[`${p.productId}`] = true));

    setExpandedRows(_expandedRows);
    setAllExpanded(true);
  };

  const renderRightToolbarTemplate = () => {
    return (
      <>
        <Button
          icon={allExpanded ? 'pi pi-minus' : 'pi pi-plus'}
          label={allExpanded ? 'Collapse All' : 'Expand All'}
          onClick={toggleAll}
          className='w-11rem'
        />
      </>
    );
  };

  useMemo(() => {
    initFilters();
  }, []);

  return (
    <>
      <Toolbar
        className='mb-4'
        left={renderLeftToolbarTemplate}
        right={renderRightToolbarTemplate}
      ></Toolbar>

      <DataTable
        expandedRows={expandedRows}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 20, 30, 40]}
        onRowToggle={(e) => setExpandedRows(e.data)}
        value={products}
        loading={loading}
        tableStyle={{ minWidth: '50rem' }}
        rowExpansionTemplate={renderRowExpansionTemplate}
        header={renderHeader}
        dataKey='productId'
        filterDisplay='row'
        filters={filters}
        emptyMessage='No products found.'
        paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
        currentPageReportTemplate='Showing {first} to {last} of {totalRecords} entries'
      >
        <Column
          header='Developers'
          expander={allowExpansion}
          style={{ width: '5rem' }}
          filterField='Developers'
        />
        <Column
          field='productId'
          header='Id'
          body={(rowData: IProductsDTO) => rowData.productId.substring(0, 8)}
        ></Column>
        <Column
          field='productName'
          filter
          filterPlaceholder='Search...'
          filterMatchMode='contains'
          header='Name'
        ></Column>
        <Column
          field='productOwnerName'
          filter
          filterPlaceholder='Search...'
          filterMatchMode='contains'
          header='Name'
        ></Column>
        <Column
          field='scrumMasterName'
          filter
          filterPlaceholder='Search...'
          filterMatchMode='contains'
          header='Scrum Master'
        ></Column>
        <Column
          field='startDate'
          filter
          filterPlaceholder='Search...'
          filterMatchMode='contains'
          header='Start Date'
        ></Column>
        <Column
          field='methodology'
          filter
          filterPlaceholder='Search...'
          filterMatchMode='contains'
          header='Methodology'
        ></Column>
        <Column
          body={renderActionBodyTemplate}
          exportable={false}
          style={{ minWidth: '12rem' }}
        ></Column>
      </DataTable>

      <DialogForm
        defaultProductValues={productSelected}
        productDialog={productDialog}
        toggleDialog={toggleDialog}
        handleCallingAPI={handleCallingAPI}
        toast={toast}
      />

      <Dialog
        visible={deleteProductDialog}
        style={{ width: '450px' }}
        header='Confirm'
        modal
        footer={renderDeleteProductDialogFooter}
        onHide={hideDeleteProductDialog}
      >
        <div className='flex align-items-center justify-content-center'>
          <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem' }} />
          {productSelected && (
            <span>
              Are you sure you want to delete <b>{productSelected.productName}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </>
  );
}
