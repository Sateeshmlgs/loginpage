import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingButton = ({ loading, children, ...props }) => {
  return (
    <button className="btn-primary" disabled={loading} {...props}>
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          Please wait...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;
