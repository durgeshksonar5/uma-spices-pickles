import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center text-xs sm:text-sm text-[#3B2618]/70 py-3 overflow-x-auto whitespace-nowrap">
      <Link
        to="/"
        className="flex items-center gap-1.5 hover:text-[#7A1F1F] font-medium transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-[#3B2618]/40 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-[#7A1F1F] truncate max-w-[200px] sm:max-w-xs">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.link}
                className="hover:text-[#7A1F1F] font-medium transition-colors"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
