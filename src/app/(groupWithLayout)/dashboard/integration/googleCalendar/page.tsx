'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Unplug } from 'lucide-react'

const page = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [connected, setConnected] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const checkConnection = async () => {
        try {
            const response = await fetch('/api/integration/googleCalendar/events');
            if (response.ok) {
                setConnected(true);
            } else {
                setConnected(false);
            }
        } catch (error) {
            console.error('Error checking connection:', error);
            setConnected(false);
        }
    };

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/integration/googleCalendar/events');
            const data = await response.json();
            
            if (response.ok) {
                setEvents(data.events || []);
                setConnected(true);
            } else {
                console.error('Failed to fetch events:', data.error);
                setConnected(false);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            setConnected(false);
        }
        setLoading(false);
    };

    const disconnectCalendar = async () => {
        setDisconnecting(true);
        try {
            const response = await fetch('/api/integration/googleCalendar/disconnect', {
                method: 'DELETE',
            });
            
            if (response.ok) {
                setConnected(false);
                setEvents([]);
                setShowConfirmDialog(false);
                console.log('Google Calendar disconnected successfully');
            } else {
                const data = await response.json();
                console.error('Failed to disconnect:', data.error);
                alert('Failed to disconnect Google Calendar. Please try again.');
            }
        } catch (error) {
            console.error('Error disconnecting Google Calendar:', error);
            alert('Failed to disconnect Google Calendar. Please try again.');
        }
        setDisconnecting(false);
    };

    useEffect(() => {
        checkConnection();
    }, []);

    return (
        <div className="p-6 space-y-6">
            <div className="text-2xl font-bold">Google Calendar Integration</div>
            
            {!connected ? (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Google Calendar Not Connected</h3>
                    <p className="text-gray-600 mb-4">Connect your Google Calendar to view and manage events.</p>
                    <Button onClick={() => window.location.href = '/dashboard/integration'}>
                        Go to Integrations
                    </Button>
                </div>
            ) : (
                <>
                    {/* Connection Status */}
                    <div className="bg-green-50 rounded-lg border border-green-200 shadow-sm p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-green-800 font-medium">Google Calendar Connected</span>
                            </div>
                            <Button
                                onClick={() => setShowConfirmDialog(true)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                                disabled={disconnecting}
                            >
                                <Unplug className="w-4 h-4 mr-2" />
                                {disconnecting ? 'Disconnecting...' : 'Disconnect Account'}
                            </Button>
                        </div>
                    </div>

                    {/* Events Section */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
                                    <p className="text-sm text-gray-600 mt-1">Your upcoming calendar events</p>
                                </div>
                                <Button onClick={fetchEvents} disabled={loading}>
                                    {loading ? 'Loading...' : 'Refresh Events'}
                                </Button>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            {events.length === 0 ? (
                                <div className="text-center py-8">
                                    <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-600">No upcoming events found</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {events.map((event, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <h4 className="font-medium text-gray-900">
                                                {event.summary || 'Untitled Event'}
                                            </h4>
                                            {event.description && (
                                                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                            )}
                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                {event.start?.dateTime && (
                                                    <span>
                                                        Start: {new Date(event.start.dateTime).toLocaleString()}
                                                    </span>
                                                )}
                                                {event.end?.dateTime && (
                                                    <span>
                                                        End: {new Date(event.end.dateTime).toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-8 max-w-md w-full mx-4">
                        <div className="text-center mb-6">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <Unplug className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Disconnect Google Calendar</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Are you sure you want to disconnect your Google Calendar? This will remove access to your calendar events and you'll need to reconnect to use this integration again.
                            </p>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <Button
                                onClick={() => setShowConfirmDialog(false)}
                                variant="outline"
                                className="px-4 py-2"
                                disabled={disconnecting}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={disconnectCalendar}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white"
                                disabled={disconnecting}
                            >
                                {disconnecting ? 'Disconnecting...' : 'Disconnect'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default page 