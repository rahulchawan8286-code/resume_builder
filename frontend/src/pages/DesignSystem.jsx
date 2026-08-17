import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { CircularProgress } from '../components/ui/CircularProgress';
import { Skeleton } from '../components/ui/Skeleton';
import { Spinner } from '../components/ui/Spinner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { SearchBar } from '../components/ui/SearchBar';
import { EmptyState } from '../components/ui/EmptyState';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/Alert';
import { AIChatBubble } from '../components/ui/AIChatBubble';
import { Timeline } from '../components/ui/Timeline';
import { Stepper } from '../components/ui/Stepper';
import { DataTable } from '../components/ui/DataTable';
import { Switch } from '../components/ui/Switch';
import { Checkbox } from '../components/ui/Checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar';
import { Separator } from '../components/ui/Separator';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/Dialog';

export default function DesignSystem() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={`min-h-screen p-8 transition-colors duration-300 ${isDark ? 'dark bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto space-y-16 pb-20">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-6 dark:border-gray-800">
          <div>
            <h1 className="text-3xl font-bold">Design System</h1>
            <p className="text-gray-500 mt-2">A complete overview of all UI components and their states.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Dark Mode Toggle</span>
            <Switch checked={isDark} onCheckedChange={setIsDark} />
          </div>
        </div>

        {/* Buttons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold border-l-4 border-indigo-500 pl-3">Buttons</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">Default (Primary)</h3>
              <Button>Primary Button</Button>
              <Button isLoading>Loading State</Button>
              <Button disabled>Disabled State</Button>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">Secondary</h3>
              <Button variant="secondary">Secondary Button</Button>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">Outline & Ghost</h3>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">Destructive</h3>
              <Button variant="destructive">Delete Item</Button>
            </div>
          </div>
        </section>

        <Separator />

        {/* Inputs */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold border-l-4 border-indigo-500 pl-3">Form Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">Input (Default & Error)</h3>
              <Input placeholder="Enter your email" />
              <Input placeholder="Error state" error />
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">Text Area</h3>
              <TextArea placeholder="Type your message here..." />
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">Search Bar</h3>
              <SearchBar placeholder="Search students..." />
            </div>
          </div>
        </section>

        <Separator />

        {/* Badges & Indicators */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold border-l-4 border-indigo-500 pl-3">Indicators & Badges</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Failed</Badge>
            <Badge variant="outline">Outline</Badge>
            <div className="w-4" />
            <Spinner />
            <Spinner size={32} className="text-indigo-500" />
          </div>
          <div className="flex gap-12 mt-8 items-center">
            <div className="w-64 space-y-2">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Linear Progress</h3>
              <Progress value={65} />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Circular Progress</h3>
              <CircularProgress value={82} />
            </div>
          </div>
        </section>

        <Separator />

        {/* Radix Complex */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold border-l-4 border-indigo-500 pl-3">Radix Interactive (Modals & More)</h2>
          <div className="flex gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Open Standard Modal</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
                </DialogHeader>
                <div className="py-4"><Input placeholder="Name" /></div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className="flex items-center gap-2 border rounded-md px-4 dark:border-gray-800">
               <Checkbox id="terms" />
               <label htmlFor="terms" className="text-sm font-medium">Accept terms</label>
            </div>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>RC</AvatarFallback>
            </Avatar>
          </div>
        </section>

        <Separator />

        {/* Cards & Content */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold border-l-4 border-indigo-500 pl-3">Cards & Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Standard Card</CardTitle>
                <CardDescription>Deploy your new project in one-click.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Input placeholder="Project Name" />
                <Skeleton className="h-4 w-full mt-4" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Button className="w-full">Deploy</Button>
              </CardFooter>
            </Card>

            <div className="space-y-6">
              <EmptyState title="No projects found" description="You haven't created any projects yet." action={<Button>Create Project</Button>} />
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
              </Alert>
            </div>
          </div>
        </section>

        <Separator />

        {/* Advanced Widgets */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold border-l-4 border-indigo-500 pl-3">Advanced Widgets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Stepper</h3>
              <Stepper steps={[{title:'Details'},{title:'Payment'},{title:'Done'}]} currentStep={1} />
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Timeline</h3>
              <Timeline items={[
                { title: 'Test Completed', time: '10:00 AM', description: 'Scored 85%' },
                { title: 'Resume Updated', time: '2:30 PM', description: 'Added 2 projects' }
              ]} />
            </Card>
            <Card className="p-6 md:col-span-2">
              <h3 className="font-semibold mb-4">AI Chat Bubbles</h3>
              <div className="space-y-4">
                <AIChatBubble isUser={true} message="Can you analyze my resume?" />
                <AIChatBubble isUser={false} message="I found 3 areas of improvement. First, you should add more keywords related to React..." />
              </div>
            </Card>
            <Card className="p-6 md:col-span-2">
              <h3 className="font-semibold mb-4">Data Table</h3>
              <DataTable 
                columns={[{header:'Name', accessorKey:'name'}, {header:'Score', accessorKey:'score'}, {header:'Status', accessorKey:'status'}]} 
                data={[
                  {name:'Digital Electronics', score:'92%', status:'Excellent'},
                  {name:'VLSI', score:'85%', status:'Good'},
                ]} 
              />
            </Card>
          </div>
        </section>

      </div>
    </div>
  );
}