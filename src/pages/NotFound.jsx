import React from 'react';
import { EmptyState } from '../components/common/EmptyState';
import { SearchX } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="bg-[#FFFBF5] min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="bg-[#FFFBF5] rounded-2xl border border-[#E8DDCF] p-8 sm:p-12 shadow-xs text-center max-w-lg w-full">
        <EmptyState
          icon={SearchX}
          title="Page Not Found (404)"
          description="Oops! The spice page or product link you were looking for doesn't exist or may have moved."
          actionText="Return to Homepage"
          actionLink="/"
        />
      </div>
    </div>
  );
};

export default NotFound;
