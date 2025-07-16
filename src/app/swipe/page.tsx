'use client';

import { Suspense } from 'react';
import SwipePageContent from './SwipePageContent';

export default function SwipePage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading movies...</div>}>
      <SwipePageContent />
    </Suspense>
  );
}
