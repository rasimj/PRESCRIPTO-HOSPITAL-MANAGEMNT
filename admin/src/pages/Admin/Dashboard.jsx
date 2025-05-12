import React, { useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

export const Dashboard = () => {

  const { aToken, dashData, getDashData, cancelAppointment } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return dashData && (
    <div className='m-5'>

      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.doctor_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.doctors}</p>
            <p className='text-gray-400'>Doctors</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointment_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>
      </div>

      <div className='bg-white'>
        <div className='flex items-center gap-3 px-6  py-3 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>
        <div className='pt-4 border border-t-0'>
          {
            dashData.latestAppointments.map((item, index) => {
              return (
                <div key={index} className='flex items-center justify-between px-6 py-3 border-t gap-3 hover:bg-gray-100'>
                  <div className='flex items-center gap-3'>
                    <img className='w-10 h-10 rounded-full object-cover bg-blue-500' src={item.docData.image} alt="" />
                    <div>
                      <p className='font-medium text-500'>{item.docData.name}</p>
                      <p className='text-sm text-gray-500'>{item.slotDate}</p>
                    </div>
                  </div>
                  <p className={item.cancelled ? 'text-red-500 font-semibold' : 'text-green-600 font-semibold'}>
                    {item.cancelled ? 'Cancelled' : 'Active'}
                  </p>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}
