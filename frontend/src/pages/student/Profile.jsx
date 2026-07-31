import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/Avatar';
import { mockUsers } from '../../mocks';

export default function Profile() {
  const user = mockUsers[0]; // mock current user

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your personal information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold dark:text-white">{user.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
            <div className="flex gap-2 w-full">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Upload</Button>
              <Button variant="outline" className="w-full">Remove</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input defaultValue="Rahul" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input defaultValue="Chavan" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" defaultValue={user.email} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">University / College</label>
              <Input defaultValue="Engineering Institute of Technology" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Graduation Year</label>
              <Input type="number" defaultValue="2027" />
            </div>
            <div className="pt-4 flex justify-end">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}