import React from 'react'

const App = () => {
  return (
    <>
    <div className="min-h-screen flex items-center justify-center px-6">
  {/* Your Card Here */}
  <div className="relative w-full max-w-5xl h-[500px] rounded-3xl border border-white/10 bg-white/10 backdrop-blur-2xl shadow-2xl">

  {/* Purple Glow */}
  <div className="absolute -top-32 -right-20 h-72 w-72 rounded-full bg-purple-600/30 blur-[120px]"></div>
  <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-[120px]"></div>

  <div className="relative z-10 flex h-full items-center justify-center">
    <div className="text-center">

      <h1 className="text-5xl font-bold text-white">
        Welcome Back 👋
      </h1>

      <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-300">
        Manage employees, track attendance, monitor performance,
        and streamline your HR operations—all from one beautiful dashboard.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <button className="rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 px-8 py-5 font-semibold text-white transition duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/40">
          Get Started
        </button>

        <button className="rounded-xl border border-white/20 bg-white/10 px-8 py-3 font-semibold text-white backdrop-blur-md transition hover:bg-white/20">
          Learn More
        </button>
      </div>

    </div>
  </div>

</div>
    </div>
    </>
  )
}

export default App
