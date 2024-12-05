// import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-700">

        {/* Flower Medical Column */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className=" mb-8 w-28 h-8 px-3"><img src='pictures/med-tech_logo.png'/></div>
            <span className="text-2xl font-bold mt-2">Med-Tech</span>
          </div>
          <p className="text-sm">
            Get an expert medical opinion from one of our world-renowned specialists 
            so you can have the answer and confidence to make informed decisions 
            about your health.
          </p>
        </div>

        {/* Services Column */}
        <div>
          <h3 className="text-xl font-bold mb-4">Services</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-sm hover:text-purple-500">Investment</a></li>
            <li><a href="#" className="text-sm hover:text-purple-500">Blogs</a></li>
            <li><a href="#" className="text-sm hover:text-purple-500">Assets Market</a></li>
            <li><a href="#" className="text-sm hover:text-purple-500">Trading</a></li>
          </ul>
        </div>

        {/* Information Column */}
        <div>
          <h3 className="text-xl font-bold mb-4">Information</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-sm hover:text-purple-500">Sign Up</a></li>
            <li><a href="#" className="text-sm hover:text-purple-500">Join Community</a></li>
            <li><a href="#" className="text-sm hover:text-purple-500">Learning</a></li>
            <li><a href="#" className="text-sm hover:text-purple-500">Newsletter</a></li>
          </ul>
        </div>

        {/* Platform Column */}
        <div>
          <h3 className="text-xl font-bold mb-4">Platform</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-sm hover:text-purple-500">Terms Of Use</a></li>
            <li><a href="#" className="text-sm hover:text-purple-500">About</a></li>
            <li><a href="#" className="text-sm hover:text-purple-500">Contact</a></li>
            <li><a href="#" className="text-sm hover:text-purple-500">Partnership</a></li>
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <h3 className="text-xl font-bold mb-4">Support</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-sm hover:text-purple-500">Help Center</a></li>
            <li><a href="#" className="text-sm hover:text-purple-500">Video Tutorial</a></li>
            <li><a href="#" className="text-sm hover:text-purple-500">Cookie Settings</a></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer
