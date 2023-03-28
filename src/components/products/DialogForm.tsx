/**
 * Created by Pablo Silva
 * Date: 2023/03/28
 * Time: 12:00 AM
 */

import React, { RefObject, useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { IProductsDTO } from '@/dtos/Products';
import { Button } from 'primereact/button';
import { Controller, useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import uuid from 'react-uuid';
import { TabPanel, TabView } from 'primereact/tabview';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { format } from 'date-fns';
import { Toast } from 'primereact/toast';

interface IProps {
  defaultProductValues: IProductsDTO;
  productDialog: boolean;
  toggleDialog: () => void;
  handleCallingAPI: () => void;
  toast: RefObject<Toast>;
}

interface IMethodologyDropdown {
  name: string;
  code: string;
}
export default function DialogForm({
  defaultProductValues,
  productDialog,
  toggleDialog,
  handleCallingAPI,
  toast,
}: IProps) {
  const [formData, setFormData] = useState({});
  const [showMessage, setShowMessage] = useState(false);
  const [newDeveloperName, setNewDeveloperName] = useState('');

  const methodologyDropdownItems = ['Agile', 'Waterfall'];

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    getValues,
  } = useForm<IProductsDTO>({ defaultValues: defaultProductValues });

  useEffect(() => {
    reset(defaultProductValues);
  }, [defaultProductValues]);

  const onSubmit = async (data: IProductsDTO) => {
    if (data.productId === '') {
      data.productId = uuid();
      setFormData(data);
      setShowMessage(true);
      await createProduct(data);
    } else {
      setFormData(data);
      setShowMessage(true);
      await updateProduct(data);
    }

    handleCallingAPI();
    toggleDialog();

    toast.current?.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Product Created',
      life: 3000,
    });

    reset();
  };

  async function createProduct(product: IProductsDTO) {
    const response = await fetch('/api/products/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error(`Failed to create product: ${response.statusText}`);
    }
  }

  async function updateProduct(product: IProductsDTO) {
    const response = await fetch('/api/products/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error(`Failed to update product: ${response.statusText}`);
    }
  }

  const getFormErrorMessage = (name: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return errors[name] && <small className='p-error'>{errors[name].message}</small>;
  };

  const productDialogFooter = (
    <>
      <Button
        label='Cancel'
        icon='pi pi-times'
        className='p-button-text'
        onClick={() => {
          reset();
          toggleDialog();
        }}
      />
      <Button
        label='Save'
        icon='pi pi-check'
        className='p-button-text'
        onClick={handleSubmit(onSubmit)}
      />
    </>
  );

  const handleAddDeveloper = () => {
    const updatedDevelopers = [...getValues('Developers'), newDeveloperName];
    setValue('Developers', updatedDevelopers);
    setNewDeveloperName('');
  };

  return (
    <Dialog
      visible={productDialog}
      style={{ width: '450px' }}
      header='Product Details'
      modal
      className='p-fluid'
      footer={productDialogFooter}
      onHide={() => {
        reset();
        toggleDialog();
      }}
    >
      <form className='p-fluid'>
        <TabView>
          <TabPanel header='General Data'>
            <div className='field pt-4'>
              <span className='p-float-label'>
                <Controller
                  name='productName'
                  control={control}
                  rules={{ required: 'Name is required.' }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      className={classNames({ 'p-invalid': fieldState.invalid })}
                    />
                  )}
                />
                <label
                  htmlFor='productName'
                  className={classNames({ 'p-error': errors.productName })}
                >
                  Name*
                </label>
              </span>
              {getFormErrorMessage('productName')}
            </div>
            <div className='field pt-3'>
              <span className='p-float-label'>
                <Controller
                  name='productOwnerName'
                  control={control}
                  rules={{ required: 'Product Owner Name is required.' }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      className={classNames({ 'p-invalid': fieldState.invalid })}
                    />
                  )}
                />
                <label
                  htmlFor='productOwnerName'
                  className={classNames({ 'p-error': errors.productOwnerName })}
                >
                  Owner Name*
                </label>
              </span>
              {getFormErrorMessage('productOwnerName')}
            </div>
            <div className='field pt-3'>
              <span className='p-float-label'>
                <Controller
                  name='scrumMasterName'
                  control={control}
                  rules={{ required: 'Scrum Master Name is required.' }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      className={classNames({ 'p-invalid': fieldState.invalid })}
                    />
                  )}
                />
                <label
                  htmlFor='scrumMasterName'
                  className={classNames({ 'p-error': errors.scrumMasterName })}
                >
                  Scrum Master Name*
                </label>
              </span>
              {getFormErrorMessage('scrumMasterName')}
            </div>
            <div className='field pt-3'>
              <span className='p-float-label'>
                <Controller
                  name='methodology'
                  control={control}
                  rules={{ required: 'Methodology is required.' }}
                  render={({ field }) => (
                    <Dropdown
                      id={field.name}
                      value={field.value}
                      onChange={(e) => field.onChange(e)}
                      options={methodologyDropdownItems}
                    />
                  )}
                />
                <label
                  htmlFor='methodology'
                  className={classNames({ 'p-error': errors.methodology })}
                >
                  Methodology
                </label>
              </span>
              {getFormErrorMessage('methodology')}
            </div>
            <div className='field  pt-3'>
              <span className='p-float-label'>
                <Controller
                  name='startDate'
                  control={control}
                  rules={{ required: 'Start Date is required.' }}
                  render={({ field }) => (
                    <Calendar
                      id={field.name}
                      value={field.value ? new Date(field.value) : null}
                      onChange={(e) => {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        const selectedDate = new Date(e.value);
                        const formattedDate = format(selectedDate, 'yyyy/MM/dd'); // format the date as a string in ISO format
                        field.onChange(formattedDate);
                      }}
                      dateFormat='yy/mm/dd'
                      mask='9999/99/99'
                      showIcon
                    />
                  )}
                />
                <label htmlFor='startDate' className={classNames({ 'p-error': errors.startDate })}>
                  Start date
                </label>
              </span>
              {getFormErrorMessage('startDate')}
            </div>
          </TabPanel>
          <TabPanel header='Developers'>
            <div>
              <div className='field pt-3 formgroup-inline'>
                <span className='p-float-label'>
                  <InputText
                    id='developerName'
                    type='text'
                    value={newDeveloperName}
                    onChange={(e) => setNewDeveloperName(e.target.value)}
                  />
                  <label htmlFor='developerName'>Name Developer</label>
                </span>
                <Button
                  icon='pi pi-plus'
                  type='button'
                  disabled={getValues('Developers').length >= 5}
                  onClick={handleAddDeveloper}
                ></Button>
              </div>
              <Controller
                name='Developers'
                control={control}
                render={({ field: { onChange, value }, fieldState }) => (
                  <>
                    {value.map((developer, index) => (
                      <React.Fragment key={index}>
                        <li
                          key={developer}
                          className='flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4'
                        >
                          <div>
                            <Avatar label={developer.charAt(0)} shape='circle'></Avatar>
                            <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }}>
                              {developer}
                            </span>
                          </div>
                          <div className='mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center'>
                            <Button
                              icon='pi pi-trash'
                              className='p-button-rounded p-button-danger'
                              onClick={() => {
                                const newValues = [...value];
                                newValues.splice(index, 1);
                                onChange(newValues);
                              }}
                            />
                          </div>
                        </li>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </>
                )}
              />
            </div>
          </TabPanel>
        </TabView>
      </form>
    </Dialog>
  );
}
