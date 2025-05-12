import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const DoctorAppointment = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment
  } = useContext(DoctorContext);

  const { calculateAge } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  const sortedAppointments = [...appointments].reverse();

  // ✅ Handler functions added
  const handleCancel = async (id) => {
    await cancelAppointment(id);
    getAppointments();
  };

  const handleComplete = async (id) => {
    await completeAppointment(id);
    getAppointments(); // ✅ Refresh after marking as complete
  };

  return (
    <div className='w-full max-w-6xl mx-auto p-5'>
      <p className='mb-4 text-xl font-semibold text-gray-800'>All Appointments</p>

      <div className='bg-white border rounded-lg shadow-sm text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] py-3 px-6 border-b font-medium text-gray-600 bg-gray-100 sticky top-0 z-10'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {sortedAppointments.map((item, index) => (
          <div
            key={item._id}
            className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] items-center gap-4 text-gray-700 py-4 px-6 border-b hover:bg-gray-50 transition'
          >
            <p className='font-medium max-sm:hidden'>{index + 1}</p>

            <div className='flex items-center gap-3'>
              <img
                src={item.userData.image}
                alt={item.userData.name}
                className='w-9 h-9 rounded-full object-cover border'
              />
              <p className='font-medium'>{item.userData.name}</p>
            </div>

            <div>
              <p className='text-xs text-center border border-blue-500 text-blue-600 px-2 py-1 rounded-full font-medium'>
                {item.payment ? 'Online' : 'CASH'}
              </p>
            </div>

            <div className='text-center'>
              <p>{calculateAge(item.userData.dob)}</p>
            </div>

            <div className='text-center'>
              <p>
                {item.slotDate}{' '}
                <span className='text-gray-400'>|</span> {item.slotTime}
              </p>
            </div>

            <p className='text-center font-semibold text-green-700'>
              ${item.docData.fees}
            </p>

            {
              item.cancelled
                ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                : item.isCompleted
                  ? <p className='text-green-400 text-xs font-medium'>Completed</p>
                  : <div className='flex'>
                    <img onClick={() => cancelAppointment(item._id)} className='w1-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                    <img onClick={() => completeAppointment(item._id)} className='w1-10 cursor-pointer' src={assets.tick_icon} alt="" />


                  </div>
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointment;
