import React from 'react';
import Reference from './reference';

const ReferencesBlock = ({ references }) => {
  if (!references.length) {
    return null;
  }

  return (
    <div className="references-block bg-skin-secondary mt-16 rounded-xl p-6 ">
      <h3 className="!mt-0 text-skin-secondary">
        Referred in
      </h3>
      <ul className="!mt-6">
        {references.map((ref) => (
          <Reference node={ref} key={ref.id} />
        ))}
      </ul>
    </div>
  );
};

export default ReferencesBlock;
