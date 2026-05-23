import React from 'react';
import { Users, GraduationCap, Map, TrendingUp, MoreVertical } from 'lucide-react';

export const AdminDashboardPage = () => {
  const stats = [
    { title: 'Total Students', value: '2,845', change: '+12.5%', isPositive: true, icon: <GraduationCap size={24} className="text-[#1E50FF]" /> },
    { title: 'Active Mentors', value: '142', change: '+4.2%', isPositive: true, icon: <Users size={24} className="text-orange-500" /> },
    { title: 'Roadmaps Generated', value: '15,034', change: '+24.8%', isPositive: true, icon: <Map size={24} className="text-purple-500" /> },
    { title: 'Success Rate', value: '94.2%', change: '-0.4%', isPositive: false, icon: <TrendingUp size={24} className="text-green-500" /> },
  ];

  const recentUsers = [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'Student', date: '2 mins ago', status: 'Active' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', role: 'Mentor', date: '1 hour ago', status: 'Pending' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Student', date: '3 hours ago', status: 'Active' },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'Student', date: '5 hours ago', status: 'Active' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${stat.icon.props.className.includes('1E50FF') ? 'bg-blue-50' : stat.icon.props.className.includes('orange') ? 'bg-orange-50' : stat.icon.props.className.includes('purple') ? 'bg-purple-50' : 'bg-green-50'}`}>
                {stat.icon}
              </div>
              <span className={`text-sm font-semibold flex items-center gap-1 ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mock Chart Area */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-gray-900">Platform Activity</h3>
             <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1.5 outline-none">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>This Year</option>
             </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
             {/* Mock Bars */}
             {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
               <div key={i} className="w-full flex flex-col items-center gap-2 group cursor-pointer">
                 <div className="w-full bg-blue-100 rounded-t-md relative flex items-end justify-center group-hover:bg-blue-200 transition-colors" style={{ height: '100%' }}>
                    <div className="w-full bg-[#1E50FF] rounded-t-md transition-all duration-500" style={{ height: `${height}%` }}></div>
                 </div>
                 <span className="text-xs text-gray-400">Day {i+1}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-gray-900">Recent Signups</h3>
             <button className="text-[#1E50FF] text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
             {recentUsers.map(user => (
               <div key={user.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                        {user.name.charAt(0)}
                     </div>
                     <div>
                        <div className="text-sm font-bold text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.role} • {user.date}</div>
                     </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={16}/></button>
               </div>
             ))}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default AdminDashboardPage;
