import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
      {/*----------Left Section--------------- */}
      <div>
        <img className='mb-5 w-40' src={assets.logo} alt="" />
        <p className='w-full md:w-2/3 text-gray-600 leading-6'>
          Prescripto is designed to streamline operations, enhance patient care, and improve efficiency in healthcare facilities. Ensuring secure data handling, seamless appointment scheduling, and effective resource management for better healthcare services.
        </p>
      </div>
      
      {/*----------Center Section--------------- */}
      <div>
        <p className='text-xl font-medium mb-5'>COMPANY</p>
        <ul className='flex flex-col gap-2 text-gray-600'>
          <li>Home</li>
          <li>About us</li>
          <li>Contact us</li>
          <li>Privacy Policy</li>
        </ul>
      </div>
      
      {/*----------Right Section--------------- */}
      <div>
        <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
        <ul className='flex flex-col gap-2 text-gray-600'>
          <li>+91 9754326531</li>
          <li>prescripto@gmail.com</li>
        </ul>
      </div>
      
      {/*-------Copyright Text------------ */}
      <div className='col-span-3'>
        <hr />
        <p className='py-5 text-sm text-center'>
          Copyright 2024 @ Prescripto - All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
