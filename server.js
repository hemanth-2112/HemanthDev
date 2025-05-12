import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Form from './model/Form.js';
import dotenv from 'dotenv';
import cors from 'cors';
import twilio from 'twilio';



dotenv.config();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const phonenumber = process.env.PHONE_NUMBER;

const client = twilio(accountSid, authToken);

app.post('/api/form', async (req, res) => {
  const { name, email, phone, message } = req.body;


  const formData = new Form({
    name,
    email,
    phone,
    message
  });
  try {
    await formData.save();
    console.log("Form data saved. Now sending SMS...");
    sendSMS(name, phone, email, message);
    res.status(200).json({ message: 'Form submitted successfully!' });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


function sendSMS(name, phone, email, message) {
  console.log("sendSMS() function called");

  const smsBodyToAdmin = `New form submission from ${name}.\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`;
  const smsBodyToUser = `Hi ${name}, thanks for contacting us! We've received your message and will get back to you shortly.`;

  // Send SMS to Admin
  client.messages.create({
    body: smsBodyToAdmin,
    from: twilioPhoneNumber,
    to: phonenumber  // admin number from .env
  })
    .then(msg => {
      console.log('SMS sent to Admin. SID:', msg.sid);
    })
    .catch(err => {
      console.error('Error sending SMS to Admin:', err.message);
    });

  // Send SMS to User
  client.messages.create({
    body: smsBodyToUser,
    from: twilioPhoneNumber,
    to: phone.startsWith('+91') ? phone : `+91${phone}`  // user number from form submission
  })
    .then(msg => {
      console.log('SMS sent to User. SID:', msg.sid);
    })
    .catch(err => {
      console.error('Error sending SMS to User:', err.message);
    });
}


app.listen(PORT, () => { console.log(`Server running on  http://localhost:${PORT}`) });
