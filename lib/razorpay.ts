import Razorpay from 'razorpay'

// Allow NEXT_PUBLIC_ key as fallback
const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
const key_secret = process.env.RAZORPAY_KEY_SECRET

if (!key_id || !key_secret) {
    console.warn("WARNING: Razorpay keys are missing. Payments will fail.")
}

export const razorpay = new Razorpay({
    key_id: key_id || 'dummy_key_id',
    key_secret: key_secret || 'dummy_key_secret',
})
