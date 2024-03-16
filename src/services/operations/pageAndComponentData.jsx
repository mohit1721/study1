//jo getCategoryPageDetails wali API ko call krne ka kaam yehaan pr ho rha h



// import React from 'react'
import { toast } from 'react-hot-toast';
import { catalogData } from '../apis';
import { apiConnector } from '../apiconnector';



export const getCatalogaPageData = async(categoryId) => {
    const toastId=toast.loading("Loading...")


 let result=[];
 try {
// call using api connector
const response=await apiConnector("POST",catalogData.CATALOGPAGEDATA_API,
{categoryId:categoryId});
    
if(!response?.data?.success)
    throw new Error("Could not Fetch category page data");

 result=response?.data;

 } catch (error) {
    
console.log("CATALOG PAGE DATA API ERROR: " , error)
toast.error(error.message);
result=error.response?.data;
 }
    toast.dismiss(toastId);
    return result;
}

