import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
  const { docId } = useParams();
  const {
    doctors,
    currencySymbol,
    backendUrl,
    token,
    getDoctorsData,
    userData
  } = useContext(AppContext);

  const navigate = useNavigate();
  const daysofWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  useEffect(() => {
    if (doctors?.length > 0) {
      const doc = doctors.find(doc => doc?._id === docId);
      if (doc) setDocInfo(doc);
    }
  }, [doctors, docId]);

  const getAvailableSlots = async () => {
    setDocSlots([]);
    const today = new Date();
    const slotsPerDay = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const startTime = new Date(currentDate);
      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (i === 0) {
        // If it's today, set starting time to next half-hour at least after current time
        let nextHour = currentDate.getHours() + 1;
        startTime.setHours(Math.max(nextHour, 10));
        startTime.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        startTime.setHours(10, 0, 0, 0); // start at 10:00 AM
      }

      const slots = [];
      const cursor = new Date(startTime);

      while (cursor < endTime) {
        const datetime = new Date(cursor);
        const formattedTime = datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const day = datetime.getDate();
        const month = datetime.getMonth() + 1;
        const year = datetime.getFullYear();
        const slotDate = `${day}_${month}_${year}`;

        const isBooked = docInfo?.slots_booked?.[slotDate]?.includes(formattedTime);
        if (!isBooked) {
          slots.push({ datetime, time: formattedTime });
        }

        cursor.setMinutes(cursor.getMinutes() + 30);
      }

      slotsPerDay.push(slots);
    }

    setDocSlots(slotsPerDay);
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book appointment');
      return navigate('/login');
    }

    if (!slotTime) {
      toast.warn('Please select a time slot');
      return;
    }

    try {
      const date = docSlots[slotIndex][0].datetime;
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const slotDate = `${day}_${month}_${year}`;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        {
          docId,
          slotDate,
          slotTime,
          userId: userData._id,
          userData: {
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
          }
        },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate('/my-appointments');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    if (docInfo) getAvailableSlots();
  }, [docInfo]);

  return docInfo ? (
    <div className="flex flex-col gap-6 p-4">
      {/* Doctor Info Section */}
      <div className="flex flex-col sm:flex-row gap-6 bg-white p-6 rounded-lg shadow-md">
        <div className="bg-primary p-2 rounded-lg">
          <img
            className="w-40 h-40 object-cover rounded-lg"
            src={docInfo.image}
            alt={docInfo.name || 'Doctor'}
          />
        </div>
        <div className="flex-1">
          <p className="text-2xl font-medium text-gray-900 flex items-center gap-2">
            {docInfo.name}
            <img src={assets.verified_icon} alt="Verified" className="w-5 h-5" />
          </p>
          <p className="text-gray-600 text-sm mt-1">
            {docInfo.degree} - {docInfo.speciality}
          </p>
          <button className="py-1 px-3 border text-xs rounded-full mt-1">
            {docInfo.experience} years of experience
          </button>
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
              About <img src={assets.info_icon} alt="Info" />
            </p>
            <p className="text-sm text-gray-500 mt-1">{docInfo.about}</p>
          </div>
          <p className="text-gray-600 font-medium mt-3">
            Appointment Fee:{' '}
            <span className="text-gray-700 font-normal">
              {currencySymbol}
              {docInfo.fees || 'N/A'}
            </span>
          </p>
        </div>
      </div>

      {/* Booking Slots Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="font-medium text-gray-700">Booking Slots</p>

        <div className="flex gap-3 items-center w-full overflow-x-auto mt-4">
          {docSlots.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setSlotIndex(index);
                setSlotTime(''); // reset time when switching day
              }}
              className={`text-center py-6 px-4 min-w-16 rounded-lg cursor-pointer ${
                slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'
              }`}
            >
              <p>{item[0] && daysofWeek[item[0].datetime.getDay()]}</p>
              <p>{item[0] && item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full overflow-x-auto mt-4">
          {docSlots[slotIndex]?.length > 0 ? (
            docSlots[slotIndex].map((item, index) => (
              <p
                key={index}
                onClick={() => setSlotTime(item.time)}
                className={`text-sm px-5 py-2 rounded-full cursor-pointer ${
                  item.time === slotTime
                    ? 'bg-primary text-white'
                    : 'text-gray-400 border border-gray-300'
                }`}
              >
                {item.time.toLowerCase()}
              </p>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No slots available</p>
          )}
        </div>

        <button
          onClick={bookAppointment}
          className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6"
        >
          Book an Appointment
        </button>
      </div>

      {/* Related Doctors */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  ) : null;
};

export default Appointment;
