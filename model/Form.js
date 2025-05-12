import mongoose from 'mongoose';
const formSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String
});

const FormData = mongoose.model('FormData', formSchema);
export default FormData;