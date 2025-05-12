import React, { useEffect, useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

export const DoctorDashboard = () => {
  const { dToken, dashData, getDashData } = useContext(DoctorContext)
  const { currency } = useContext(AppContext)

  useEffect(() => {
    if (dToken) {
      getDashData()
    }
  }, [dToken])

  return dashData && (
    <div className='m-5'>
      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.earning_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{currency} {dashData.earnings || 0}</p>
            <p className='text-gray-400'>Earnings</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointment_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments || 0}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.patients || 0}</p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>
      </div>

      <div className='bg-white mt-10 rounded'>
        <div className='flex items-center gap-3 px-6 py-3 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>
        <div className='pt-4 border border-t-0'>
          {dashData.latestAppointments?.length > 0 ? (
            dashData.latestAppointments.map((item, index) => (
              <div key={index} className='flex items-center justify-between px-6 py-3 border-t gap-3 hover:bg-gray-100'>
                <div className='flex items-center gap-3'>
                  <img
                    className='w-10 h-10 rounded-full object-cover bg-blue-500'
                    src={item.docData?.image || assets.default_avatar}
                    alt=""
                  />
                  <div>
                    <p className='font-medium text-500'>{item.docData?.name || "Unknown Doctor"}</p>
                    <p className='text-sm text-gray-500'>{item.slotDate}</p>
                  </div>
                </div>
                <p className={item.cancelled ? 'text-red-500 font-semibold' : 'text-green-600 font-semibold'}>
                  {item.cancelled ? 'Cancelled' : 'Active'}
                </p>
              </div>
            ))
          ) : (
            <p className='text-center py-5 text-gray-500'>No recent bookings</p>
          )}
        </div>
      </div>
    </div>
  )
}
