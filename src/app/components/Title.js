import React from 'react';

const Title = ({ text, shouldDisplay }) => {
  if (!shouldDisplay) {
    return null;
  }

  return <h3 className="text-xl mb-4">{text}</h3>;
};

export default Title;
