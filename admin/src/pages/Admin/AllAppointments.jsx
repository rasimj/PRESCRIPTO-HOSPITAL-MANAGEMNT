import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets.js';

export const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext);
  const { calculateAge } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr] py-3 px-6 border-b font-medium text-gray-600'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Status</p>
        </div>

        {appointments.map((item, index) => (
          <div
            key={index}
            className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr] items-center gap-4 text-gray-700 py-3 px-6 border-b hover:bg-gray-50'
          >
            <p>{index + 1}</p>

            <div className='flex items-center gap-2'>
              <img
                src={item.userData.image}
                alt={item.userData.name}
                className='w-8 h-8 rounded-full object-cover'
              />
              <p>{item.userData.name}</p>
            </div>

            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
            <p>{item.slotDate} | {item.slotTime}</p>

            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full bg-blue-600' src={item.docData.image} alt="" />
              <p>{item.docData.name}</p>
            </div>

            <p>${item.docData.fees}</p>

            <p className={
              item.cancelled
                ? 'text-red-500 font-semibold'
                : item.isCompleted
                  ? 'text-green-600 font-semibold'
                  : 'text-yellow-600 font-semibold flex items-center gap-2'
            }>
              {item.cancelled
                ? 'Cancelled'
                : item.isCompleted
                  ? 'Completed'
                  : (
                    <>
                      Active
                      <img
                        onClick={() => cancelAppointment(item._id)}
                        src={assets.cancel_icon}
                        alt="Cancel"
                        className="w-4 h-4 cursor-pointer"
                      />
                    </>
                  )
              }
            </p>

          </div>
        ))}
      </div>
    </div>
  );
};
