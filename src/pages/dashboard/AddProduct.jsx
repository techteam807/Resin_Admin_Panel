import { createProduct, updateProduct } from '@/feature/product/productSlice';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Option, Select } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const AddProduct = ({open, setOpen, data, setData}) => {

    const dispatch = useDispatch();
    const { addloading } = useSelector((state) => state.product);
    const productId = data?._id
    const [productData, setProductData] = useState({
        productCode: '',
        connectorType: '',
        distributorType: '',
        size: '',
        resinType: '',
    })

    useEffect(() => {
        if (data) {
            setProductData({
                productCode: data.productCode || '',
                connectorType: data.connectorType || '',
                distributorType: data.distributorType || '',
                size: data.size || '',
                resinType: data.resinType || '',
            });
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setProductData((prev) => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = () => {
        if(productId) {
            const { productCode, ...updatedData } = productData;
            dispatch(updateProduct({ productId, productData: updatedData }))
        } else {
            dispatch(createProduct(productData))
        }
        setData(null)
        setOpen(false)
        setProductData('')
    }

  return (
    <div>
      <Dialog
        open={open}
        handler={() => {setOpen(false); setData(null); setProductData('');}}
        data-dialog-mount="opacity-100"
        data-dialog-unmount="opacity-0"
        data-dialog-transition="transition-opacity"
      >
        <DialogHeader className='justify-center'>{productId ? "Edit Product" : "Add Product" }</DialogHeader>
        <DialogBody>
            <div className='grid grid-cols-1 gap-5 px-0 md:px-5'>
                <Input variant='standard' label='Product Code' 
                    name="productCode"
                    value={productData.productCode}
                    onChange={handleChange}
                    readOnly={productId}
                />
                <Select variant='standard' label="Connector Type"
                    value={productData.connectorType}
                    onChange={(value) => handleSelectChange('connectorType', value)}
                >
                    <Option value="HTML">Material Tailwind HTML</Option>
                    <Option value="React">Material Tailwind React</Option>
                    <Option value="Vue">Material Tailwind Vue</Option>
                    <Option value="Angular">Material Tailwind Angular</Option>
                    <Option value="Svelte">Material Tailwind Svelte</Option>
                </Select>
                <Select variant='standard' label="Distributor Type"
                    value={productData.distributorType}
                    onChange={(value) => handleSelectChange('distributorType', value)}
                >
                   <Option value="HTML">Material Tailwind HTML</Option>
                    <Option value="React">Material Tailwind React</Option>
                    <Option value="Vue">Material Tailwind Vue</Option>
                    <Option value="Angular">Material Tailwind Angular</Option>
                    <Option value="Svelte">Material Tailwind Svelte</Option>
                </Select>
                <Input variant='standard' label='Size' 
                    name="size"
                    value={productData.size}
                    onChange={handleChange}
                />
                <Select variant='standard' label="Resin Type"
                    value={productData.resinType}
                    onChange={(value) => handleSelectChange('resinType', value)}
                >
                   <Option value="new">New</Option>
                    <Option value="exhausted">Exhausted</Option>
                    <Option value="inuse">Inuse</Option>
                </Select>
            </div>
        </DialogBody>
        <DialogFooter className='flex gap-4'>
            <Button variant="outlined" onClick={() => {setOpen(false); setData(null); setProductData('');}}>
                Cancel
            </Button>
            <Button variant="gradient" onClick={handleSubmit} >
                {addloading ? <div className='px-[7px]'><ArrowPathIcon className="h-4 w-4 animate-spin" /> </div> : "Save"}
            </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}

export default AddProduct
