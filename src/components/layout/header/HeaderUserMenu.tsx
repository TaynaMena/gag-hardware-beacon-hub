
import React from 'react';
import { Link } from 'react-router-dom';
import { User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface AccountMenuItem {
  path?: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

interface HeaderUserMenuProps {
  userName: string | undefined;
  accountMenuItems: AccountMenuItem[];
}

const HeaderUserMenu: React.FC<HeaderUserMenuProps> = ({ userName, accountMenuItems }) => {
  return (
    <div className="relative group">
      <Button 
        variant="ghost" 
        className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-gag-white"
      >
        <User size={18} className="mr-1" />
        <span className="max-w-[100px] truncate">
          {userName || 'Minha Conta'}
        </span>
      </Button>
      <div className="absolute right-0 mt-1 w-48 origin-top-right bg-black/90 backdrop-blur-md border border-gag-cyan/30 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <div className="py-1">
          {accountMenuItems.map((item, index) => (
            item.path ? (
              <Link 
                key={index} 
                to={item.path}
                className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gag-blue/20 hover:text-gag-white"
              >
                <span className="mr-2">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ) : (
              <button 
                key={index}
                onClick={item.onClick}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gag-blue/20 hover:text-gag-white"
              >
                <span className="mr-2">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeaderUserMenu;
