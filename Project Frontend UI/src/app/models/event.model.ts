export interface Event {
  eventId: number;
  eventTitle: string;
  eventTypeId: number;
  description: string;
  createdAt: Date;
  startDate: Date;
  endDate: Date;
  organizerId: number;
  locationId: number;
  organizer: any; // You might want to define a more specific interface for User
  location: any; // You might want to define a more specific interface for Location
  eventType: any; // You might want to define a more specific interface for EventType
}