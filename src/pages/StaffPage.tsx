
import React from 'react';
import { mockStaff } from '@/services/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const StaffPage: React.FC = () => {
  const servers = mockStaff.filter(staff => staff.role === 'server');
  const kitchenStaff = mockStaff.filter(staff => staff.role === 'kitchen');
  const hostStaff = mockStaff.filter(staff => staff.role === 'host');
  const managers = mockStaff.filter(staff => staff.role === 'manager');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <Button>Add New Staff</Button>
      </div>
      
      <Tabs defaultValue="servers">
        <TabsList>
          <TabsTrigger value="servers">Servers</TabsTrigger>
          <TabsTrigger value="kitchen">Kitchen Staff</TabsTrigger>
          <TabsTrigger value="hosts">Hosts</TabsTrigger>
          <TabsTrigger value="managers">Managers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="servers" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {servers.map(staff => (
              <Card key={staff.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{staff.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Role:</span>
                      <Badge>Server</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Assigned Tables:</span>
                      <span>{staff.assignedTables.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Active Orders:</span>
                      <span>{staff.activeOrders.length}</span>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="kitchen" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kitchenStaff.map(staff => (
              <Card key={staff.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{staff.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Role:</span>
                      <Badge>Kitchen</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Active Orders:</span>
                      <span>{staff.activeOrders.length}</span>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="hosts" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hostStaff.map(staff => (
              <Card key={staff.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{staff.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Role:</span>
                      <Badge>Host</Badge>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="managers" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {managers.map(staff => (
              <Card key={staff.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{staff.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Role:</span>
                      <Badge>Manager</Badge>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffPage;
