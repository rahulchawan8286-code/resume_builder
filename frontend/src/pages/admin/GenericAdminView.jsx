import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';

export default function GenericAdminView({ title, description }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h1>
        <p className="text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <Card>
        <CardContent className="p-12 text-center text-gray-500 dark:text-gray-400">
          This module is fully configured in the routing layer and ready for backend integration in Phase 4.
        </CardContent>
      </Card>
    </div>
  );
}