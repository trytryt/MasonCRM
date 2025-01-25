import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import customersService from "../../../Services/CustomersService"; 
import { toast } from "react-toastify";
import "./AddCustomer.css";

export function AddCustomer(): JSX.Element {
    const { userId, customerId } = useParams<{ userId: string; customerId?: string }>();
    const isEditMode = !!customerId;
    const [name, setName] = useState("");
    const [adress, setAdress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [customerStatus, setCustomerStatus] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        if(customerId !== undefined){
            getCustomerData();
        }
    }, [customerId]);

    const getCustomerData = async () => {
        try {
            const customerData = await customersService.getCustomerById(+customerId!);
            setName(customerData.customer.name);
            setAdress(customerData.customer.adress);
            setPhoneNumber(customerData.customer.phoneNumber);
            setCustomerStatus(customerData.customer.status);
            console.log('customer status:' + customerStatus);
            console.log('customer status:' + JSON.stringify(customerData));
        } catch (err: any) {
            toast(err.message);
        }
    };

    const changeCustomerStatus = async () => {
        let c_status = 1;
        if (customerStatus == 1) {
            c_status = 2;
        }

        setCustomerStatus(c_status);
        return c_status;
    }

   const addCustomer = async () => {
    if (!userId) {
        toast.error("אין לך הרשאות לפעולה זו");
        return;
    }

    const customerData = {
        customerId,
        name,
        adress,
        phoneNumber,
        customerStatus
    };

    try {
        if(isEditMode) {
            console.log('edit user');
            await customersService.updateCustomer(customerData);
        } else {
            console.log('insert user');
            await customersService.addCustomer(customerData, parseInt(userId));
        }
        toast.success("פרטי הלקוח נקלטו בהצלחה!");
        navigate("/list");
    } catch (error: any) {
        toast.error("שגיאה: " + error.message);
    }
};

return (
    <div className="AddCustomer">
        <h2>{isEditMode ? 'הוספת לקוח חדש' : 'עריכת לקוח'}</h2>
        <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
                <label>שם:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>כתובת:</label>
                <input
                    type="text"
                    value={adress}
                    onChange={(e) => setAdress(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>נייד:</label>
                <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>פעיל</label>
                <input type={"checkbox"} checked={customerStatus == 1 } onChange={changeCustomerStatus}/>
            </div>
            <input type={"hidden"} name={'id'} value={ +customerId ?? undefined }/>
            <div className="form-group">
                <button type="button" onClick={addCustomer} >שמירה</button>
            </div>
        </form>
    </div>
);
}