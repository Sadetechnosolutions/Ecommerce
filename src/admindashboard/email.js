import React,{useState,useEffect} from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from "axios";

const Email = () => {
    const [users, setUsers] = useState([]);
    const [otps, setOtps] = useState([]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/auth/users/descending');
            const usersData = response.data.map(user => ({
                id: user.id,
                UserName: user.name,
                Email: user.email,
                Phonenumber: user.phoneNumber,
                Role:user.role,
                Status:user.enabled === true ? 'Active' : 'Disabled'
            }));
            setUsers(usersData);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const fetchOtps = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/auth/otps/descending');
            const otpsData = response.data.map(otp => ({
                id: otp.id, 
                Otp:otp.otp,
                Email: otp.email,
                Joined: otp.createdAt
            }));
            setOtps(otpsData);
        } catch (error) {
            console.error("Error fetching OTP data:", error);
        }
    };

    const userdata = users.map(user => {
        const otpData = otps.find(otp => otp.id === user.id);
        return {
            ...user,
            Otp: otpData ? otpData.Otp : 'N/A',
            Joined: otpData ? new Date(otpData.Joined).toLocaleString()  : 'N/A'
        };
    });

    useEffect(() => {
        fetchUsers();
        fetchOtps();
    });

    return (
        <div className="p-4">
        <div className="border  border-gray-300 rounded-lg overflow-hidden">

                <DataTable value={otps} paginator rows={19} className="datatable-basic custom-header">
                    <Column field="id" header="ID"  className="border border-gray-300"/>
                    <Column field="Email" header="Email"  className="border border-gray-300"/>
                    <Column field="Otp" header="Otp"  className="border border-gray-300"/>
                    <Column field="Joined" header="Date"  className="border border-gray-300"/>
                </DataTable>
            </div>
        </div>
    );
};

export default Email;
