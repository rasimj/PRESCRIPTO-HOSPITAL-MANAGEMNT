import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'

//API Register user
const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body

        if (!name || !password || !email) {
            return res.json({ success: false, message: "Missing Details" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter a valid Email" })
        }
        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a Strong Password" })
        }

        // hasing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)


        const userData = {
            name,
            email,
            password: hashedPassword

        }


        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }

}

// API for user login
const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: 'User does not exist' })
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }

}

//API to create user profile data
const getProfile = async (req, res) => {

    try {

        const userId = req.userId
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update user profile
const updateProfile = async (req, res) => {
    try {
        const { name, phone, address, dob, gender } = req.body
        const userId = req.userId || req.body.userId // Prefer req.userId
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        // Safely parse address
        let parsedAddress = {}
        try {
            parsedAddress = address ? JSON.parse(address) : {}
        } catch (err) {
            return res.json({ success: false, message: "Invalid address format" })
        }

        // Update user data
        await userModel.findByIdAndUpdate(userId, {
            name,
            phone,
            address: parsedAddress,
            dob,
            gender
        }, { new: true })

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL }, { new: true })
        }

        res.json({ success: true, message: "Profile Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//API to book appointment
const bookAppointment = async (req,res) => {

    try {
        
        const { userId, docId , slotDate, slotTime } = req.body
        const docData = await doctorModel.findById(docId).select('-passord')

        if (!docData.available) {
            return res.json({success:false,message:'Doctor Not Available'})
        }

        let slots_booked = docData.slots_booked

        //checking for slot availability
        if (slots_booked[slotDate]) {

            if (slots_booked[slotDate.includes(slotTime)]) {
                return res.json({success:false,message:'Slot Not Available'})
            }else{
                slots_booked[slotDate].push(slotTime)
            }
            
        }else{
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData ={
            userId,
            docId,
            userData,
            docData,
            amount:docData.fees,
            slotTime,
            slotDate,
            date:Date.now()

        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true,message:'Appointment booked'})

    } catch (error) {
       
        console.log(error)
        res.json({ success: false, message: error.message })
        
    }

}

//API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {
        const userId = req.userId;
        const appointments = await appointmentModel.find({ userId });
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const cancelAppointment = async (req, res) => {
    try {
      const { appointmentId } = req.body;
      const userId = req.userId; // ✅ Use ID from token
  
      const appointmentData = await appointmentModel.findById(appointmentId);
  
      if (!appointmentData) {
        return res.json({ success: false, message: 'Appointment not found' });
      }
  
      if (appointmentData.userId.toString() !== userId.toString()) {
        return res.json({ success: false, message: 'Unauthorized action' });
      }
  
      await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
  
      const { docId, slotDate, slotTime } = appointmentData;
      const doctorData = await doctorModel.findById(docId);
  
      if (doctorData.slots_booked[slotDate]) {
        doctorData.slots_booked[slotDate] = doctorData.slots_booked[slotDate].filter(
          (time) => time !== slotTime
        );
      }
  
      await doctorModel.findByIdAndUpdate(docId, { slots_booked: doctorData.slots_booked });
  
      res.json({ success: true, message: 'Appointment Cancelled' });
  
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  

export { registerUser, loginUser, getProfile ,updateProfile ,bookAppointment,listAppointment,cancelAppointment} 
