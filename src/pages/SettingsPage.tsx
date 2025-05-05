import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Globe,
  Phone,
} from 'lucide-react';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const settingsGroups = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Profile Information',
          description: 'Update your personal information',
          action: () => {},
        },
        {
          icon: Shield,
          label: 'Privacy & Security',
          description: 'Manage your account security settings',
          action: () => {},
        },
        {
          icon: CreditCard,
          label: 'Payment Methods',
          description: 'Add or remove payment methods',
          action: () => {},
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Choose what notifications you receive',
          action: () => {},
          toggle: true,
        },
        {
          icon: Moon,
          label: 'Dark Mode',
          description: 'Toggle dark mode on or off',
          action: () => setDarkMode(!darkMode),
          toggle: true,
          toggleState: darkMode,
        },
        {
          icon: Globe,
          label: 'Language',
          description: 'Change your preferred language',
          action: () => {},
          value: 'English (US)',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help Center',
          description: 'Get help with using Rebazzar',
          action: () => {},
        },
        {
          icon: Phone,
          label: 'Contact Support',
          description: 'Get in touch with our support team',
          action: () => {},
        },
      ],
    },
  ];
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-8 h-8 text-gray-700" />
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>
      
      {/* User Profile Summary */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>
      
      {/* Settings Groups */}
      <div className="space-y-8">
        {settingsGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{group.title}</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {group.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0 border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-gray-100">
                      <item.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{item.label}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {item.value && (
                      <span className="text-sm text-gray-500">{item.value}</span>
                    )}
                    {item.toggle ? (
                      <div
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          item.toggleState ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            item.toggleState ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </div>
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Logout Button */}
      <div className="mt-8">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
      
      {/* App Version */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Rebazzar v1.0.0</p>
      </div>
    </div>
  );
};

export default SettingsPage;