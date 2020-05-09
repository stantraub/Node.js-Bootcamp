const crypto = require('crypto')
const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({ 
    name: { 
        type: String, 
        required: [true, 'You must enter a name']
    },
    email: {
        type: String,
        required: [true, 'An email address is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email address']
    },
    photo: String, 
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'A password is required'],
        minLength: 8,
        select: false //Prevent password info from showing up in output
    },
    passwordConfirm: {
        type: String,
        required: [true, 'You must confirm your password'],
        validator: function(el) {
            // This only works on CREATE and SAVE!!!
            return el === this.password //abc === abc
        },
        message: 'Passwords are not the same'
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
})

userSchema.pre('save',async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next()

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12)

    // Delete the password confirm field
    this.passwordConfirm = undefined
    next()
})
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
   return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.candidatePassword) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000)
        return JWTTimestamp < changedTimestamp
    }

    // False means NOT changed
    return false
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000

    return resetToken
}

const User = mongoose.model('User', userSchema)
module.exports = User

