import { useSignIn } from "@clerk/react/legacy"
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'

const SignInPage = () => {
  const { isLoaded, signIn, setActive } = useSignIn()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  if (!isLoaded) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn.create({
        identifier: email,
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

  const handleSocialLogin = async (strategy: 'oauth_google' | 'oauth_apple') => {
      try {
          await signIn.authenticateWithRedirect({
              strategy,
              redirectUrl: "/sso-callback",
              redirectUrlComplete: "/"
          })
      } catch (err: any) {
          setError(err.errors[0].message)
      }
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center bg-transparent relative overflow-hidden">
        {/* Cinematic Backdrop Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 blur-[200px] -z-10 rounded-full"></div>
        
        <div className="w-full max-w-md relative">
            <div className="bg-white/5 border border-white/10 backdrop-blur-3xl shadow-3xl rounded-[40px] md:rounded-[60px] p-8 md:p-12 overflow-hidden flex flex-col">
                {/* Brand Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter text-white uppercase font-syne mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-white/40 font-poppins text-[10px] md:text-xs tracking-widest uppercase font-bold">
                        Sign in to your account
                    </p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest px-4 py-3 rounded-2xl text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Email Input */}
                    <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
                        <input 
                            type="email" 
                            placeholder="Email address"
                            className="w-full bg-white/5 border border-white/10 focus:border-white/40 text-white placeholder:text-white/20 px-14 py-4 rounded-full transition-all outline-none font-syne font-black text-sm lowercase tracking-widest [&:-webkit-autofill]:[filter:none] [&:-webkit-autofill]:[transition:background-color_5000000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative group">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
                        <input 
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="w-full bg-white/5 border border-white/10 focus:border-white/40 text-white placeholder:text-white/20 px-14 py-4 rounded-full transition-all outline-none font-syne font-black text-sm uppercase tracking-widest [&:-webkit-autofill]:[filter:none] [&:-webkit-autofill]:[transition:background-color_5000000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-white text-black hover:bg-amber-400 py-5 rounded-full font-black uppercase tracking-[0.3em] font-syne text-xs shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                        {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>
                </form>

                <div className="my-8 flex items-center gap-4">
                    <div className="flex-1 h-[1px] bg-white/10"></div>
                    <span className="text-white/20 font-black uppercase text-[10px] tracking-widest">or continue with</span>
                    <div className="flex-1 h-[1px] bg-white/10"></div>
                </div>

                {/* Social Logins - Styled as premium colorful capsules */}
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => handleSocialLogin('oauth_google')}
                        className="flex items-center justify-center gap-3 py-3 px-6 bg-white/5 border border-white/10 hover:bg-white hover:border-white rounded-full transition-all group"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className="text-white group-hover:text-black font-syne font-black uppercase text-[10px] tracking-widest">Google</span>
                    </button>
                    <button 
                        onClick={() => handleSocialLogin('oauth_apple')}
                        className="flex items-center justify-center gap-3 py-3 px-6 bg-white/5 border border-white/10 hover:bg-white hover:border-white rounded-full transition-all group"
                    >
                        <svg className="w-4 h-4 fill-white group-hover:fill-black transition-colors" viewBox="0 0 384 512">
                            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-31.4-79-115.3-17.7-153.1V268.7zM249.3 90.5c16.3-20.1 27.2-48 24.2-75.9-24 1-52.9 15.6-70.1 35.7-15.4 18.1-28.9 46.2-25.2 73.5 26.6 2.1 55.4-12.8 71.1-33.3V90.5z"/>
                        </svg>
                        <span className="text-white group-hover:text-black font-syne font-black uppercase text-[10px] tracking-widest">Apple</span>
                    </button>
                </div>

                <div className="mt-10 text-center flex flex-col gap-4">
                    <Link to="/forgot-password" className="text-white/20 hover:text-white transition-colors font-syne font-black uppercase text-[10px] tracking-widest block underline-offset-4 hover:underline">
                        Forgot Password?
                    </Link>
                    <p className="text-white/40 font-poppins text-[10px] tracking-[0.2em] font-bold uppercase">
                        New taste explorer? <Link to="/sign-up" className="text-white hover:text-amber-400 underline underline-offset-4 transition-colors font-black">Register Now</Link>
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SignInPage
