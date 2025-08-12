"use client";

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';
import { Reservation } from '@/types/supabase';

interface ReservationWithConflicts extends Reservation {
  hasConflicts?: boolean;
  conflictingReservations?: Reservation[];
}

export default function AdminReservationsPage() {
  const { theme } = useTheme();
  const [reservations, setReservations] = useState<ReservationWithConflicts[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStaff, setIsStaff] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  // Check if user is staff
  useEffect(() => {
    const checkStaffAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsStaff(false);
          setAuthLoading(false);
          return;
        }

        // Check if user has admin role in JWT or if using service role
        const userRole = user.user_metadata?.role || user.app_metadata?.role;
        const isAdmin = userRole === 'admin';
        
        setIsStaff(isAdmin);
      } catch (error) {
        console.error('Error checking staff access:', error);
        setIsStaff(false);
      } finally {
        setAuthLoading(false);
      }
    };

    checkStaffAccess();
  }, []);

  // Fallback function to detect overlapping reservations (client-side)
  const detectConflicts = (reservation: Reservation, allReservations: Reservation[]): Reservation[] => {
    return allReservations.filter(other => {
      if (other.id === reservation.id) return false;
      if (other.reservation_date !== reservation.reservation_date) return false;
      if (other.status === 'cancelled') return false;

      // Check for time overlap
      const startTime1 = new Date(`2000-01-01 ${reservation.start_time}`);
      const endTime1 = new Date(`2000-01-01 ${reservation.end_time}`);
      const startTime2 = new Date(`2000-01-01 ${other.start_time}`);
      const endTime2 = new Date(`2000-01-01 ${other.end_time}`);

      // Two time ranges overlap if start1 < end2 AND start2 < end1
      return startTime1 < endTime2 && startTime2 < endTime1;
    });
  };

  // Fetch pending reservations
  const fetchPendingReservations = useCallback(async () => {
    if (!isStaff) return;

    try {
      setLoading(true);
      
      // First, get all reservations to check for conflicts
      const { data: allReservations, error: allError } = await supabase
        .from('reservations')
        .select('*')
        .order('reservation_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (allError) {
        console.error('Error fetching all reservations:', allError);
        toast.error('Failed to fetch reservations');
        return;
      }

      // Get pending reservations
      const { data: pendingReservations, error: pendingError } = await supabase
        .from('reservations')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (pendingError) {
        console.error('Error fetching pending reservations:', pendingError);
        toast.error('Failed to fetch pending reservations');
        return;
      }

      // Add conflict detection to pending reservations
      const reservationsWithConflicts: ReservationWithConflicts[] = (pendingReservations || []).map(reservation => {
        const conflicts = detectConflicts(reservation, allReservations || []);
        return {
          ...reservation,
          hasConflicts: conflicts.length > 0,
          conflictingReservations: conflicts
        };
      });

      setReservations(reservationsWithConflicts);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [isStaff]);

  useEffect(() => {
    if (isStaff) {
      fetchPendingReservations();
    }
  }, [isStaff, fetchPendingReservations]);

  // Handle approve reservation
  const handleApprove = async (reservationId: string) => {
    setProcessingIds(prev => new Set(prev).add(reservationId));
    
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'confirmed' })
        .eq('id', reservationId);

      if (error) {
        console.error('Error approving reservation:', error);
        toast.error('Failed to approve reservation');
      } else {
        toast.success('Reservation approved successfully');
        // Refresh the list
        fetchPendingReservations();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(reservationId);
        return newSet;
      });
    }
  };

  // Handle reject reservation
  const handleReject = async (reservationId: string) => {
    setProcessingIds(prev => new Set(prev).add(reservationId));
    
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'cancelled' })
        .eq('id', reservationId);

      if (error) {
        console.error('Error rejecting reservation:', error);
        toast.error('Failed to reject reservation');
      } else {
        toast.success('Reservation rejected successfully');
        // Refresh the list
        fetchPendingReservations();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(reservationId);
        return newSet;
      });
    }
  };

  // Loading states
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Checking access...</div>
      </div>
    );
  }

  if (!isStaff) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p>You don&apos;t have permission to access this page.</p>
          <p className="text-sm text-gray-500 mt-2">Staff access required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-8 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Staff Dashboard - Pending Reservations</h1>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="text-xl">Loading reservations...</div>
          </div>
        ) : (
          <>
            {reservations.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-xl text-gray-500">No pending reservations</div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="mb-4 text-sm text-gray-600">
                  Total pending reservations: {reservations.length}
                </div>
                
                {reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className={`p-6 rounded-lg border-2 ${
                      reservation.hasConflicts
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : "border-gray-200 bg-white dark:bg-gray-800"
                    } shadow-md`}
                  >
                    {/* Conflict warning */}
                    {reservation.hasConflicts && (
                      <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/40 border border-red-300 rounded text-red-800 dark:text-red-200">
                        <h4 className="font-bold flex items-center">
                          ⚠️ TIME CONFLICT DETECTED
                        </h4>
                        <p className="text-sm mt-1">
                          This reservation overlaps with {reservation.conflictingReservations?.length} other reservation(s) on the same date.
                        </p>
                        {reservation.conflictingReservations && reservation.conflictingReservations.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-semibold">Conflicting reservations:</p>
                            {reservation.conflictingReservations.map(conflict => (
                              <div key={conflict.id} className="text-xs ml-2 mt-1">
                                • {conflict.name} ({conflict.start_time} - {conflict.end_time}) - {conflict.number_of_guests} guests - Status: {conflict.status}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">{reservation.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Email: {reservation.email}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Phone: {reservation.phone}
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-medium">
                          Date: {new Date(reservation.reservation_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm">
                          Time: {reservation.start_time} - {reservation.end_time}
                        </p>
                        <p className="text-sm">
                          Guests: {reservation.number_of_guests}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Created: {new Date(reservation.created_at).toLocaleString()}
                        </p>
                        {reservation.special_requests && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Special Requests:</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {reservation.special_requests}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={() => handleApprove(reservation.id)}
                        disabled={processingIds.has(reservation.id)}
                        className={`px-6 py-2 rounded font-medium transition-colors ${
                          processingIds.has(reservation.id)
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                      >
                        {processingIds.has(reservation.id) ? "Processing..." : "Approve"}
                      </button>
                      
                      <button
                        onClick={() => handleReject(reservation.id)}
                        disabled={processingIds.has(reservation.id)}
                        className={`px-6 py-2 rounded font-medium transition-colors ${
                          processingIds.has(reservation.id)
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                      >
                        {processingIds.has(reservation.id) ? "Processing..." : "Reject"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={fetchPendingReservations}
            disabled={loading}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium transition-colors"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>
    </div>
  );
}
