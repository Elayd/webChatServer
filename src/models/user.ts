import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    typeAuth: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        select: true,
        required: function () {
            return this.typeAuth !== 'google'
        }
    },
    firstName: { type: String, required: false },
    secondName: { type: String, required: false },
    fullName: { type: String, required: false },
    picture: { type: String, required: false }
})

const User = mongoose.model('User', userSchema)
export default User
