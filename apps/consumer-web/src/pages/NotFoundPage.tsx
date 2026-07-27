import React from 'react';
import { Button } from '@platform/ui-components';

interface NotFoundPageProps {
  onGoHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onGoHome }) => {
  return (
    <div className="text-center py-20 space-y-6">
      <h1 className="font-serif text-6xl text-stone-900 font-normal">404</h1>
      <p className="text-stone-600 text-lg">The page or routine protocol you are looking for does not exist.</p>
      <Button variant="primary" size="md" onClick={onGoHome}>Back to Home</Button>
    </div>
  );
};
