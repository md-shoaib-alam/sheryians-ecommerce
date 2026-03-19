import { useSignIn } from "@clerk/react/legacy"
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react'

const ForgotPasswordPage = () => {
  const { isLoaded, signIn, setActive } = useSignIn()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [successfulCreation, setSuccessfulCreation] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  if (!isLoaded) return null

  // Step 1: Create a reset password attempt and send the code to user's email
  const createResetAttempt = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      })
      setSuccessfulCreation(true)
    } catch (err: any) {
      setError(err.errors[0].message)
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Set the new password using the code sent to user's email
  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        navigate('/')
      } else {
        console.log(result)
      }
    } catch (err: any) {
      setError(err.errors[0].message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center bg-transparent relative overflow-hidden">
        {/* Cinematic Backdrop Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 blur-[200px] -z-10 rounded-full"></div>
        
        <div className="w-full max-w-md relative">
            <div className="bg-white/5 border border-white/10 backdrop-blur-3xl shadow-3xl rounded-[40px] md:rounded-[60px] p-8 md:p-12 overflow-hidden flex flex-col transition-all duration-700">
                {/* Brand Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter text-white uppercase font-syne mb-2">
                        {successfulCreation ? "Reset Password" : "Forgot Password"}
                    </h1>
                    <p className="text-white/40 font-poppins text-[10px] md:text-xs tracking-widest uppercase font-bold px-4">
                        {successfulCreation ? "Choose a new password" : "Enter your email to reset your password"}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest px-4 py-3 rounded-2xl text-center flex items-center gap-3 justify-center">
                        <ShieldAlert className="w-3 h-3" />
                        {error}
                    </div>
                )}

                {!successfulCreation ? (
                    <form onSubmit={createResetAttempt} className="flex flex-col gap-8">
                        {/* Email Input */}
                        <div className="relative group">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
                            <input 
                                type="email" 
                                placeholder="Registered email address"
                                className="w-full bg-white/5 border border-white/10 focus:border-white/40 text-white placeholder:text-white/20 px-14 py-4 rounded-full transition-all outline-none font-syne font-black text-sm lowercase tracking-widest [&:-webkit-autofill]:[filter:none] [&:-webkit-autofill]:[transition:background-color_5000000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading || !email}
                            className="w-full bg-white text-black hover:bg-amber-400 py-5 rounded-full font-black uppercase tracking-[0.3em] font-syne text-xs shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? "Preparing reset..." : "Send Reset Code"}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={resetPassword} className="flex flex-col gap-6">
                        {/* Verification Code */}
                        <div className="relative group">
                            <CheckCircle2 className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
                            <input 
                                type="text" 
                                placeholder="6-digit magic code"
                                className="w-full bg-white/5 border border-white/10 focus:border-white/40 text-white placeholder:text-white/20 px-14 py-4 rounded-full transition-all outline-none font-syne font-black text-sm uppercase tracking-widest text-center [&:-webkit-autofill]:[filter:none] [&:-webkit-autofill]:[transition:background-color_5000000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                maxLength={6}
                                required
                            />
                        </div>

                        {/* New Password */}
                        <div className="relative group">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
                            <input 
                                type="password" 
                                placeholder="New legacy password"
                                className="w-full bg-white/5 border border-white/10 focus:border-white/40 text-white placeholder:text-white/20 px-14 py-4 rounded-full transition-all outline-none font-syne font-black text-sm uppercase tracking-widest [&:-webkit-autofill]:[filter:none] [&:-webkit-autofill]:[transition:background-color_5000000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-amber-400 text-black hover:bg-white py-5 rounded-full font-black uppercase tracking-[0.3em] font-syne text-xs shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? "Resetting password..." : "Reset Password"}
                            {!loading && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                        
                        <button 
                            type="button"
                            onClick={() => setSuccessfulCreation(false)}
                            className="text-white/20 hover:text-white transition-colors font-syne font-black uppercase text-[10px] tracking-widest text-center"
                        >
                            Resend code to another address
                        </button>
                    </form>
                )}

                <div className="mt-10 text-center">
                    <p className="text-white/40 font-poppins text-[10px] tracking-[0.2em] font-bold uppercase">
                        Remembered your taste? <Link to="/sign-in" className="text-white hover:text-amber-400 underline underline-offset-4 transition-colors font-black">Back to login</Link>
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ForgotPasswordPage
