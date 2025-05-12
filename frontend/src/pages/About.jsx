import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>

    <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>About <span className='text-gray-700 font-medium'>US</span></p>
    </div>
    <div className='my-10 flex flex-col md:flex-row gap-12'>
      <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
      <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
        <p>Welcome to Prescripto, Prescripto is an advanced hospital management system designed to streamline healthcare operations and enhance efficiency. Our platform helps hospitals, clinics, and healthcare professionals manage appointments, doctor schedules, and patient records effortlessly. With an intuitive interface and seamless functionality, Prescripto ensures a smooth experience for both medical staff and patients.</p>
        <p>With Prescripto, patients can conveniently book appointments, view doctor availability, and receive timely reminders, reducing wait times and missed consultations. Doctors and hospital administrators can efficiently manage their schedules, optimize patient flow, and maintain accurate medical records, all in one secure system.</p>
        <b className='text-gray-800'>Our Vision</b>
        <p>At Prescripto, our vision is to revolutionize healthcare management through innovation and technology. Our goal is to empower hospitals and clinics with smart, data-driven solutions that enhance patient experience, improve operational efficiency, and ensure the highest standards of care.</p>
      </div>
    </div>


<div className='text-xl my-4'>
  <p>Why <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
  </div>

  <div className='flex flex-col md:flex-row mb-20'>
    <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
      <b>Efficiency:</b>
      <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
    </div>
    <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
    <b>Convenience:</b>
    <p>Access a network of trusted healthcare professionals in your area.</p>

    </div>
    <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
    <b>Personalization:</b>
    <p>Tailores recommendations and remainders to help you stay on top of your health. </p>

    </div>
  </div>



    </div>
    




  )
}

export default About