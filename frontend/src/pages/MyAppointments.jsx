import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyAppointments = () => {
  const { backendUrl, token } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  const getUserAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(backendUrl + '/api/user/appointments', {
        headers: { token },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments); // ✅ log data here
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {

      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);

    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>

      {loading ? (
        <p className='text-zinc-500 mt-6'>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className='text-zinc-500 mt-6'>No appointments found.</p>
      ) : (
        <div className='space-y-4'>
          {appointments.map((item, index) => (
            <div
              key={index}
              className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b'
            >
              {/* Left Column - Image */}
              <div>
                <img
                  className='w-32 h-32 object-cover bg-indigo-50 rounded'
                  src={item.docData.image}
                  alt={item.docData.name}
                />
              </div>

              {/* Right Column - Details & Buttons */}
              <div className='flex flex-col justify-between flex-1 text-sm text-zinc-600'>
                <div>
                  <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
                  <p>{item.docData.speciality}</p>
                  <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                  <p className='text-xs'>{item.docData.address.line1}</p>
                  <p>{item.docData.address.line2}</p>
                  <p className='text-xs mt-1'>
                    <span className='text-sm text-neutral-700 font-medium'>Date & Time:</span>{' '}
                    {slotDateFormat(item.slotDate)} | {item.slotTime}
                  </p>
                </div>
                {/* Buttons */}
                <div className='flex flex-col gap-2 sm:flex-row sm:items-center mt-3'>
                  {!item.cancelled && <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-300'>
                    Pay Online
                  </button>}
                  {!item.cancelled && <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300'>
                    Cancel Appointment
                  </button>}
                  {item.cancelled && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'> Appointment Cancelled</button>}
                  {item.isComplteted && <button className='sm:min-w-48 py border border-green-500 rounded text-green-500'>Completed</button>}
                </ div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
