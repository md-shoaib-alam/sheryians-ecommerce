import { useUser, useClerk } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, ShieldCheck, LogOut, Package, Settings, Camera, MapPin } from 'lucide-react'

const UserProfilePage = () => {
  const { isLoaded, user } = useUser()
  const { signOut } = useClerk()
  const navigate = useNavigate()

  if (!isLoaded || !user) return null

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center bg-transparent relative overflow-hidden">
        {/* Cinematic Backdrop Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/10 blur-[200px] -z-10 rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/5 blur-[150px] -z-10 rounded-full"></div>

        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
            {/* Sidebar Navigation - Glassmorphic Pillar */}
            <aside className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[40px] p-8 flex flex-col items-center text-center overflow-hidden relative">
                    {/* Profile Avatar with custom branding */}
                    <div className="relative group mb-6">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl transition-transform duration-700 group-hover:scale-105">
                            <img src={user.imageUrl} alt={user.fullName || 'User'} className="w-full h-full object-cover" />
                        </div>
                        <button className="absolute bottom-0 right-0 bg-white text-black p-3 rounded-full shadow-2xl hover:bg-amber-400 transition-all">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase font-syne mb-1">
                        {user.fullName || user.username || 'Explorer'}
                    </h2>
                    <p className="text-white/40 font-poppins text-[10px] tracking-widest uppercase font-bold mb-8">
                        Gourmet Member
                    </p>

                    <nav className="w-full flex flex-col gap-2">
                        <button className="flex items-center gap-4 px-6 py-4 bg-white text-black rounded-2xl font-syne font-black uppercase text-[10px] tracking-widest transition-all">
                            <User className="w-4 h-4" />
                            Personal Info
                        </button>
                        <button className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 text-white/60 hover:text-white rounded-2xl font-syne font-black uppercase text-[10px] tracking-widest transition-all group">
                            <Package className="w-4 h-4" />
                            Order History
                        </button>
                        <button className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 text-white/60 hover:text-white rounded-2xl font-syne font-black uppercase text-[10px] tracking-widest transition-all group">
                            <MapPin className="w-4 h-4" />
                            Saved Addresses
                        </button>
                        <button className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 text-white/60 hover:text-white rounded-2xl font-syne font-black uppercase text-[10px] tracking-widest transition-all group border-t border-white/5 mt-4 pt-6">
                            <Settings className="w-4 h-4" />
                            Account Settings
                        </button>
                        <button 
                            onClick={handleSignOut}
                            className="flex items-center gap-4 px-6 py-4 hover:bg-red-500/10 text-red-500 rounded-2xl font-syne font-black uppercase text-[10px] tracking-widest transition-all group mt-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Terminate Session
                        </button>
                    </nav>
                </div>
            </aside>

            {/* Main Content Area - Cinematic Information Grid */}
            <main className="lg:col-span-8 flex flex-col gap-8">
                {/* Info Card: Identity */}
                <div className="bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[40px] p-8 md:p-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -rotate-12 translate-x-12 -translate-y-12"></div>
                    
                    <div className="flex items-center gap-4 mb-10">
                        <div className="bg-white/10 p-3 rounded-2xl">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-black italic tracking-tighter text-white uppercase font-syne">
                            Identity Profile
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        <div className="flex flex-col gap-2">
                            <span className="text-white/20 font-black uppercase text-[10px] tracking-widest">Full Name</span>
                            <p className="text-white font-syne font-bold uppercase text-sm tracking-widest border-b border-white/5 pb-2">
                                {user.fullName || 'Not specified'}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-white/20 font-black uppercase text-[10px] tracking-widest">Username</span>
                            <p className="text-white font-syne font-bold uppercase text-sm tracking-widest border-b border-white/5 pb-2">
                                @{user.username || 'n/a'}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <span className="text-white/20 font-black uppercase text-[10px] tracking-widest">Primary Email</span>
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                <p className="text-white font-syne font-bold uppercase text-sm tracking-widest flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-amber-400" />
                                    {user.primaryEmailAddress?.emailAddress}
                                </p>
                                <span className="bg-green-500/10 text-green-500 text-[8px] font-black uppercase px-2 py-1 rounded-full border border-green-500/20">Verified</span>
                            </div>
                        </div>
                    </div>
                    
                    <button className="mt-12 bg-white/5 hover:bg-white text-white hover:text-black border border-white/10 py-4 px-10 rounded-full font-black uppercase text-[10px] tracking-[0.3em] font-syne transition-all">
                        Edit Discovery Identity
                    </button>
                </div>

                {/* Info Card: Stats/Overview */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[32px] p-6 text-center group hover:bg-white/10 transition-all cursor-pointer">
                        <span className="text-3xl md:text-4xl font-black text-white font-syne mb-1 block group-hover:scale-110 transition-transform">0</span>
                        <span className="text-white/30 font-black uppercase text-[8px] md:text-[10px] tracking-widest">Flavor Orders</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[32px] p-6 text-center group hover:bg-white/10 transition-all cursor-pointer">
                        <span className="text-3xl md:text-4xl font-black text-white font-syne mb-1 block group-hover:scale-110 transition-transform">#02</span>
                        <span className="text-white/30 font-black uppercase text-[8px] md:text-[10px] tracking-widest">Discoveries</span>
                    </div>
                    <div className="hidden md:block bg-white text-black rounded-[32px] p-6 text-center group hover:bg-amber-400 transition-all cursor-pointer">
                        <span className="text-3xl md:text-4xl font-black font-syne mb-1 block group-hover:scale-110 transition-transform">PRO</span>
                        <span className="text-black/50 font-black uppercase text-[10px] tracking-widest">Tier Level</span>
                    </div>
                </div>
            </main>
        </div>
    </div>
  )
}

export default UserProfilePage
