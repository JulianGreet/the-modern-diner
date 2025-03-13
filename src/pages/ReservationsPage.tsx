
import React from 'react';
import { mockReservations } from '@/services/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Calendar, MapPin, Users } from 'lucide-react';

const ReservationsPage: React.FC = () => {
  const upcomingReservations = mockReservations.filter(r => r.status === 'confirmed');
  const seatedReservations = mockReservations.filter(r => r.status === 'seated');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reservations</h1>
        <Button>New Reservation</Button>
      </div>
      
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="seated">Seated</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingReservations.map(reservation => (
              <Card key={reservation.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <span>{reservation.customerName}</span>
                    <Badge>Confirmed</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Calendar size={16} className="mr-2 text-muted-foreground" />
                      <span>{format(new Date(reservation.date), 'PPP p')}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Users size={16} className="mr-2 text-muted-foreground" />
                      <span>Party of {reservation.partySize}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <MapPin size={16} className="mr-2 text-muted-foreground" />
                      <span>
                        Table(s): {reservation.tableIds.map(id => `#${id}`).join(', ')}
                      </span>
                    </div>
                    
                    {reservation.specialRequests && (
                      <div className="text-sm bg-muted p-2 rounded mt-2">
                        <span className="font-medium">Special Requests:</span>
                        <p className="text-muted-foreground">{reservation.specialRequests}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-end space-x-2 mt-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="default" size="sm">Check In</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="seated" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {seatedReservations.map(reservation => (
              <Card key={reservation.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <span>{reservation.customerName}</span>
                    <Badge className="bg-green-500">Seated</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Calendar size={16} className="mr-2 text-muted-foreground" />
                      <span>{format(new Date(reservation.date), 'PPP p')}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Users size={16} className="mr-2 text-muted-foreground" />
                      <span>Party of {reservation.partySize}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <MapPin size={16} className="mr-2 text-muted-foreground" />
                      <span>
                        Table(s): {reservation.tableIds.map(id => `#${id}`).join(', ')}
                      </span>
                    </div>
                    
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" size="sm">Complete Visit</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="past" className="mt-4">
          <div className="text-center p-8 text-muted-foreground">
            No past reservations to display
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReservationsPage;
