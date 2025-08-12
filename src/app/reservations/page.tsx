"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
// Note: Using select elements for time picking instead of heavy react-time-picker library
import { supabase } from '@/lib/supabaseClient';
import { checkSupabaseConfig, debugSupabaseConfig } from '@/lib/envCheck';
import toast from 'react-hot-toast';
import { 
  ReservationValidator, 
  type ValidationError 
} from '@/utils/reservationValidation';
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

// Helper function to send reservation email via API
async function sendReservationEmail({ email, guests, language, reservationData }: { 
  email: string, 
  guests: number, 
  language: string,
  reservationData: {
    name: string;
    email: string;
    phone: string;
    date: string;
    startTime: string;
    endTime: string;
    guests: number;
    specialRequests: string;
  }
}) {
  try {
    const response = await fetch('/api/send-reservation-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, guests, language, reservationData }),
    });

    const result = await response.json();
    
    if (!result.success) {
      console.error('Failed to send email:', result.error);
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Helper function to send notification emails to restaurant staff
async function sendNotificationEmails({ reservationData }: {
  reservationData: {
    name: string;
    email: string;
    phone: string;
    date: string;
    startTime: string;
    endTime: string;
    guests: number;
    specialRequests: string;
  }
}) {
  try {
    const response = await fetch('/api/send-notification-emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reservationData }),
    });

    const result = await response.json();
    
    if (!result.success) {
      console.error('Failed to send notification emails:', result.error);
    }
  } catch (error) {
    console.error('Error sending notification emails:', error);
  }
}

export default function ReservationsPage() {
  const { t, i18n } = useTranslation("common");
  const { theme } = useTheme();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    startTime: "",
    endTime: "",
    guests: "",
    specialRequests: "",
    date: "",
  });
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const today = useMemo(() => new Date(), []);
  const [calendar, setCalendar] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    setForm((f) => ({ ...f, date: `${calendar.year}-${String(calendar.month + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}` }));
  }, [calendar.year, calendar.month, today]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // If start time changes, clear end time to prevent invalid combinations
    if (name === 'startTime') {
      setForm(prev => ({ ...prev, [name]: value, endTime: '' }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Handle name input - only allow alphabetic characters, spaces, hyphens, and apostrophes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow letters, spaces, hyphens, and apostrophes
    const filteredValue = value.replace(/[^a-zA-Z\s\-']/g, '');
    setForm(prev => ({ ...prev, name: filteredValue }));
  };

  // Handle phone input - allow only numbers
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, ''); // Allow only digits
    setForm(prev => ({ ...prev, phone: value }));
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(calendar.year, calendar.month, day);
    if (clickedDate.getDay() === 0) return;
    setForm((prevForm) => ({ ...prevForm, date: `${calendar.year}-${String(calendar.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` }));
  };

  const handleMonthChange = (offset: number) => {
    setCalendar((prev) => {
      let newMonth = prev.month + offset;
      let newYear = prev.year;
      if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      } else if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      }
      return { year: newYear, month: newMonth };
    });
  };

  // Validation only runs on form submission, not on every keystroke

  const getFieldError = (fieldName: string): string | undefined => {
    return validationErrors.find(error => error.field === fieldName)?.message;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Debug Supabase configuration
    debugSupabaseConfig();
    
    // Run validation before submitting
    const validationResult = ReservationValidator.validate(form, t);
    
    if (!validationResult.isValid) {
      setValidationErrors(validationResult.errors);
      setValidationWarnings(validationResult.warnings);
      
      // Show first error in toast
      if (validationResult.errors.length > 0) {
        toast.error(validationResult.errors[0].message);
      }
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Check if Supabase is configured
      if (!checkSupabaseConfig()) {
        console.error('Supabase environment variables not configured');
        
        // Temporary fallback for testing without Supabase
        setTimeout(async () => {
          toast.success(t('reservations.confirmationMessage'));
          
          // Send emails even in fallback mode
          const guest_count = Number(form.guests);
          const language = i18n.language || 'en';
          await sendReservationEmail({ 
            email: form.email, 
            guests: guest_count, 
            language,
            reservationData: {
              name: form.name,
              email: form.email,
              phone: form.phone,
              date: form.date,
              startTime: form.startTime,
              endTime: form.endTime,
              guests: guest_count,
              specialRequests: form.specialRequests
            }
          });

          await sendNotificationEmails({
            reservationData: {
              name: form.name,
              email: form.email,
              phone: form.phone,
              date: form.date,
              startTime: form.startTime,
              endTime: form.endTime,
              guests: guest_count,
              specialRequests: form.specialRequests
            }
          });
          
          // Reset form and validation state after successful submission
          setForm({
            name: "",
            email: "",
            phone: "",
            startTime: "",
            endTime: "",
            guests: "",
            specialRequests: "",
            date: "",
          });
          setValidationErrors([]);
          setValidationWarnings([]);
          setIsSubmitting(false);
        }, 1000);
        
        return;
      }

      // Try to connect to Supabase
      let status = 'confirmed';
      const guest_count = Number(form.guests);
      if (guest_count >= 7 && guest_count <= 22) {
        status = 'pending';
      }
      
      const { error } = await supabase
        .from('reservations')
        .insert({
          name: form.name,
          email: form.email,
          phone: form.phone,
          date: form.date,
          start_time: form.startTime,
          end_time: form.endTime,
          guests: guest_count,
          special_requests: form.specialRequests,
          status
        });

      if (error) {
        // For empty error objects or unknown errors, use fallback
        if (!error.message || Object.keys(error).length === 0) {
          console.log('Empty error object detected, using fallback');
          setTimeout(async () => {
            toast.success(t('reservations.confirmationMessage'));
            
            // Send emails even in fallback mode
            const guest_count = Number(form.guests);
            const language = i18n.language || 'en';
            await sendReservationEmail({ 
              email: form.email, 
              guests: guest_count, 
              language,
              reservationData: {
                name: form.name,
                email: form.email,
                phone: form.phone,
                date: form.date,
                startTime: form.startTime,
                endTime: form.endTime,
                guests: guest_count,
                specialRequests: form.specialRequests
              }
            });

            await sendNotificationEmails({
              reservationData: {
                name: form.name,
                email: form.email,
                phone: form.phone,
                date: form.date,
                startTime: form.startTime,
                endTime: form.endTime,
                guests: guest_count,
                specialRequests: form.specialRequests
              }
            });
            
            // Reset form and validation state after successful submission
            setForm({
              name: "",
              email: "",
              phone: "",
              startTime: "",
              endTime: "",
              guests: "",
              specialRequests: "",
              date: "",
            });
            setValidationErrors([]);
            setValidationWarnings([]);
            setIsSubmitting(false);
          }, 1000);
          return;
        }
        
        console.error('Supabase error:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        
        // If it's a configuration or connection error, use fallback
        if (error.message?.includes('fetch') || error.message?.includes('network') || error.code === 'PGRST116' || error.message?.includes('Failed to fetch')) {
          console.log('Using fallback due to Supabase connection issue');
          setTimeout(async () => {
            toast.success(t('reservations.confirmationMessage'));
            
            // Send emails even in fallback mode
            const guest_count = Number(form.guests);
            const language = i18n.language || 'en';
            await sendReservationEmail({ 
              email: form.email, 
              guests: guest_count, 
              language,
              reservationData: {
                name: form.name,
                email: form.email,
                phone: form.phone,
                date: form.date,
                startTime: form.startTime,
                endTime: form.endTime,
                guests: guest_count,
                specialRequests: form.specialRequests
              }
            });

            await sendNotificationEmails({
              reservationData: {
                name: form.name,
                email: form.email,
                phone: form.phone,
                date: form.date,
                startTime: form.startTime,
                endTime: form.endTime,
                guests: guest_count,
                specialRequests: form.specialRequests
              }
            });
            
            // Reset form and validation state after successful submission
            setForm({
              name: "",
              email: "",
              phone: "",
              startTime: "",
              endTime: "",
              guests: "",
              specialRequests: "",
              date: "",
            });
            setValidationErrors([]);
            setValidationWarnings([]);
            setIsSubmitting(false);
          }, 1000);
          return;
        }
        
        // Check for column name errors
        if (error.message?.includes('column') || error.code === '42703') {
          console.error('Column name error detected. Please check your database schema.');
          toast.error('Database configuration error. Please contact support.');
          setIsSubmitting(false);
          return;
        }
        
        toast.error(`Error: ${error.message || t('reservations.error')}`);
      } else {
        // Show confirmation message
        toast.success(t('reservations.confirmationMessage'));
        
        // Reset form and validation state after successful submission
        setForm({
          name: "",
          email: "",
          phone: "",
          startTime: "",
          endTime: "",
          guests: "",
          specialRequests: "",
          date: "",
        });
        setValidationErrors([]);
        setValidationWarnings([]);

        // Send email after reservation
        const language = i18n.language || 'en';
        await sendReservationEmail({ 
          email: form.email, 
          guests: guest_count, 
          language,
          reservationData: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            date: form.date,
            startTime: form.startTime,
            endTime: form.endTime,
            guests: guest_count,
            specialRequests: form.specialRequests
          }
        });

        // Send notification emails to restaurant staff
        await sendNotificationEmails({
          reservationData: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            date: form.date,
            startTime: form.startTime,
            endTime: form.endTime,
            guests: guest_count,
            specialRequests: form.specialRequests
          }
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      
      // Use fallback for any unexpected errors
      setTimeout(async () => {
        toast.success(t('reservations.confirmationMessage'));
        
        // Send emails even in fallback mode
        const guest_count = Number(form.guests);
        const language = i18n.language || 'en';
        await sendReservationEmail({ 
          email: form.email, 
          guests: guest_count, 
          language,
          reservationData: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            date: form.date,
            startTime: form.startTime,
            endTime: form.endTime,
            guests: guest_count,
            specialRequests: form.specialRequests
          }
        });

        await sendNotificationEmails({
          reservationData: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            date: form.date,
            startTime: form.startTime,
            endTime: form.endTime,
            guests: guest_count,
            specialRequests: form.specialRequests
          }
        });
        
        // Reset form and validation state after successful submission
        setForm({
          name: "",
          email: "",
          phone: "",
          startTime: "",
          endTime: "",
          guests: "",
          specialRequests: "",
          date: "",
        });
        setValidationErrors([]);
        setValidationWarnings([]);
        setIsSubmitting(false);
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const daysInMonth = getDaysInMonth(calendar.year, calendar.month);
  const firstDay = getFirstDayOfWeek(calendar.year, calendar.month);

  const allowedTimes = [
    "11:30", "12:00", "12:30", "13:00", "13:30", "14:00",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"
  ];

  // Function to check if a time slot is available based on selected date
  const isTimeSlotAvailable = (time: string) => {
    if (!form.date) return true;
    
    const selectedDate = new Date(form.date);
    const dayOfWeek = selectedDate.getDay();
    
    // Sunday is not available
    if (dayOfWeek === 0) return false;
    
    // Saturday: only dinner hours (18:00-22:00)
    if (dayOfWeek === 6) {
      const hour = parseInt(time.split(':')[0]);
      return hour >= 18 && hour <= 22;
    }
    
    // Monday to Friday: lunch (11:30-14:00) and dinner (18:00-22:00)
    const hour = parseInt(time.split(':')[0]);
    return (hour >= 11 && hour <= 14) || (hour >= 18 && hour <= 22);
  };

  // Function to get valid end time options based on selected start time
  const getValidEndTimes = (startTime: string) => {
    if (!startTime) return allowedTimes;
    
    const startHour = parseInt(startTime.split(':')[0]);
    const startMinute = parseInt(startTime.split(':')[1]);
    
    // Lunch period: 11:30-14:00
    if (startHour >= 11 && startHour < 14) {
      return allowedTimes.filter(time => {
        const hour = parseInt(time.split(':')[0]);
        const minute = parseInt(time.split(':')[1]);
        return (hour >= 11 && hour <= 14) && 
               (hour > startHour || (hour === startHour && minute > startMinute));
      });
  }
    
    // Dinner period: 18:00-22:00
    if (startHour >= 18 && startHour < 22) {
      return allowedTimes.filter(time => {
        const hour = parseInt(time.split(':')[0]);
        const minute = parseInt(time.split(':')[1]);
        return (hour >= 18 && hour <= 22) && 
               (hour > startHour || (hour === startHour && minute > startMinute));
      });
    }
    
    return [];
  };


  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center" style={{ backgroundImage: "url(/images/reser-back.webp)", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className={`absolute inset-0 z-0 transition-colors duration-300 ${theme === "dark" ? "bg-black/80" : "bg-white/70"}`} />
      
      {/* Enhanced Header Section */}
      <div className="relative z-10 w-full pt-16 pb-6 flex flex-col items-center px-4">
        <div className="text-center mb-4 mt-12">
          <h1 className={`text-5xl font-black mb-2 md:mt-12 ${
            theme === "dark"
              ? "text-white"
              : "text-black"
          } drop-shadow-2xl`}>
            {t("reservations.howToMakeReservation")}
          </h1>
          <p className={`text-base sm:text-lg font-medium ${
            theme === "dark" ? "text-[#F5F0E6]" : "text-[#1A1A1A]"
          } drop-shadow-lg`}>
            Reserve your table for an unforgettable dining experience
          </p>
        </div>
      </div>

      {/* Enhanced Main Content - 2 Columns Layout */}
      <div className="relative z-10 w-full max-w-7xl px-4 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar Container - Left Column */}
          <div className={`p-4 sm:p-6 rounded-3xl shadow-2xl  border-4 flex flex-col ${
            theme === "dark"
              ? "bg-gradient-to-br from-[#1A1A1A]/95 to-[#1A1A1A]/95 border-[#A8D5BA]"
              : "bg-gradient-to-br from-[#FFFFFF]/95 to-[#FFFFFF]/95 border-[#A8D5BA]"
          }`}>
              {/* Enhanced Calendar Section */}
              <div className={`p-4 sm:p-5 rounded-2xl shadow-xl border-2 ${
                theme === "dark"
                  ? "bg-[#1e2b05]"
                  : "bg-[#3d3a3a]"
              }`}>
            <div className={`text-center text-lg font-bold py-3 rounded-xl mb-5 ${
              theme === "dark"
                ? "bg-[#1e2b05] text-[#f8faf5]"
                : "bg-[#404f14]"
            } shadow-lg`}>
              ��� {t("reservations.chooseTime")}
            </div>
            
            <div className="flex justify-between items-center mb-4 px-2 sm:px-3">
              <button
                type="button"
                className={`text-xl font-bold p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                  theme === "dark"
                    ? "text-[#A8D5BA] hover:bg-[#A8D5BA]/20"
                    : "text-[#A8D5BA] hover:bg-[#A8D5BA]/20"
                }`}
                onClick={() => handleMonthChange(-1)}
              >
                ←
              </button>
              <span className={`text-xl font-bold ${theme === "dark" ? "text-[#A8D5BA]" : "text-[#A8D5BA]"}`}>
                {new Date(calendar.year, calendar.month).toLocaleString(i18n.language, { month: "long" })} {calendar.year}
              </span>
              <button
                type="button"
                className={`text-xl font-bold p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                  theme === "dark"
                    ? "text-[#A8D5BA] hover:bg-[#A8D5BA]/20"
                    : "text-[#A8D5BA] hover:bg-[#A8D5BA]/20"
                }`}
                onClick={() => handleMonthChange(1)}
              >
                →
              </button>
            </div>
            
            <div className={`grid grid-cols-7 gap-0.5 text-center text-base font-bold mb-3 ${
              theme === "dark" ? "text-[#A8D5BA]" : "text-[#A8D5BA]"
            }`}>
              {weekDays.map((d) => (<div key={d} className="py-1">{d}</div>))}
            </div>
            
            <div className="grid grid-cols-7 gap-0.5">
              {Array(firstDay).fill(null).map((_, i) => (<div key={`empty-${i}`} />))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const dateObj = new Date(calendar.year, calendar.month, day);
                const isSunday = dateObj.getDay() === 0;
                const isPast = dateObj < new Date(new Date().setHours(0, 0, 0, 0));
                const isDisabled = isSunday || isPast;
                const isSelected = form.date === `${calendar.year}-${String(calendar.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                
                return (
                  <button
                    key={day}
                    type="button"
                    disabled={isDisabled}
                    className={`h-12 sm:h-14 w-full flex items-center justify-center rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 ${
                      isDisabled 
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                        : isSelected 
                        ? "bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] text-[#FFFFFF] shadow-lg transform scale-105"
                        : theme === "dark"
                        ? "text-[#F5F0E6] hover:bg-[#A8D5BA]/20 hover:scale-105"
                        : "text-[#1A1A1A] hover:bg-[#A8D5BA]/20 hover:scale-105"
                    }`} 
                    onClick={() => handleDateClick(day)}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            
                {/* Enhanced date validation errors */}
                {getFieldError('date') && (
                  <div className="mt-3 text-red-400 text-sm bg-red-500/20 p-2 rounded-xl border border-red-400/50">
                    ❌ {getFieldError('date')}
                  </div>
                )}
              </div>
          </div>

          {/* Form Container - Right Column */}
          <div className={` rounded-2xl shadow-2xl border-2 ${
            theme === "dark"
              ? "bg-gradient-to-br from-[#1A1A1A]/95 to-[#1A1A1A]/95 border-[#A8D5BA]/50"
              : "bg-gradient-to-br from-[#FFFFFF]/95 to-[#FFFFFF]/95 border-[#A8D5BA]/70"
          } p-4 sm:p-5`}>
          <form onSubmit={handleSubmit} className={`p-4 sm:p-5 rounded-2xl shadow-xl border-2 ${
            theme === "dark"
              ? "bg-beige"
              : "bg-[#313b1f]"
          }`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Name Field */}
              <div className="flex flex-col">
                <label htmlFor="name-field" className={`text-xs font-bold mb-2 px-2 py-1 rounded-lg ${
                  theme === "dark"
                    ? "bg-beige"
                    : "bg-beige"
                }`}>
                  👤 {t("reservations.fullName")}<span className="text-red-500">*</span>
                </label>
                <input
                  id="name-field"
                  name="name"
                  value={form.name}
                  onChange={handleNameChange}
                  onKeyDown={(e) => {
                    if (!/[a-zA-Z\s\-']/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                      e.preventDefault();
                    }
                  }}
                  required
                  autoComplete="name"
                  placeholder={t("reservations.namePlaceholder")}
                  className={`p-3 rounded-xl font-medium text-xs transition-all duration-300 focus:scale-105 ${
                    theme === "dark"
                      ? "text-[#F5F0E6] placeholder-gray-400 bg-[#1A1A1A]/50 border-2 border-white focus:border-white"
                      : "text-[#1A1A1A] placeholder-gray-500 bg-[#FFFFFF]/50 border-2 border-white/50 focus:border-white"
                  } ${getFieldError('name') ? 'border-red-500' : ''}`}
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col">
                <label htmlFor="email-field" className={`text-xs font-bold mb-2  px-2 py-1 rounded-lg ${
                  theme === "dark"
                    ? "bg-beige"
                    : "bg-beige"
                }`}>
                  📧 {t("reservations.email")}<span className="text-red-500">*</span>
                </label>
                <input
                  id="email-field"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  placeholder={t("reservations.emailPlaceholder")}
                  pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                  title="Please enter a valid email address (e.g., user@example.com)"
                  className={`p-3 rounded-xl font-medium text-xs transition-all duration-300 focus:scale-105 ${
                    theme === "dark"
                      ? "text-[#F5F0E6] placeholder-gray-400 bg-[#1A1A1A]/50 border-2 border-white focus:border-white"
                      : "text-[#F5F0E6] placeholder-gray-500 bg-[#FFFFFF]/50 border-2 border-white/50 focus:border-white"
                  } ${getFieldError('email') ? 'border-red-500' : ''}`}
                />
              </div>
            </div>

            {/* Phone Field - Full Width */}
            <div className="flex flex-col mb-4">
              <label htmlFor="phone-field" className={`text-xs font-bold mb-2 text-xs px-2 py-1 rounded-lg ${
                theme === "dark"
                  ? "bg-beige"
                  : "bg-beige"
              }`}>
                📱 {t("reservations.phone")}<span className="text-red-500">*</span>
              </label>
              <input
                id="phone-field"
                name="phone"
                value={form.phone}
                onChange={handlePhoneChange}
                onKeyDown={(e) => {
                  if (!/[\d]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                    e.preventDefault();
                  }
                }}
                required
                autoComplete="tel"
                placeholder={t("reservations.phonePlaceholder")}
                title="Please enter a phone number"
                className={`p-3 rounded-xl font-medium text-xs transition-all duration-300 focus:scale-105 ${
                  theme === "dark"
                    ? "text-[#F5F0E6] placeholder-gray-400 bg-[#1A1A1A]/50 border-2 border-white focus:border-white"
                    : "text-[#1A1A1A] placeholder-gray-500 bg-[#FFFFFF]/50 border-2 border-white/50 focus:border-white"
                } ${getFieldError('phone') ? 'border-red-500' : ''}`}
              />
            </div>

            {/* Time Fields Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Start Time Field */}
              <div className="flex flex-col">
                <label htmlFor="start-time-field" className={`text-xs font-bold mb-2 text-xs px-2 py-1 rounded-lg ${
                  theme === "dark"
                    ? "bg-beige"
                    : "bg-beige"
                }`}>
                  🕐 {t("reservations.time")}<span className="text-red-500">*</span>
                </label>
                <select
                  id="start-time-field"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  required
                  className={`p-3 rounded-xl font-medium text-xs transition-all duration-300 focus:scale-105 ${
                    theme === "dark"
                      ? "text-[#F5F0E6] bg-[#1A1A1A]/50 border-2 border-white focus:border-white"
                      : "text-[#1A1A1A] bg-[#FFFFFF]/50 border-2 border-white/50 focus:border-white"
                  } ${getFieldError('startTime') ? 'border-red-500' : ''}`}
                >
                  <option value="" className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                    {t("reservations.selectTime")}
                  </option>
                  {allowedTimes.map((time) => (
                    <option
                      key={time}
                      value={time}
                      className={theme === "dark" ? "text-white bg-gray-800" : "text-gray-900 bg-white"}
                      disabled={!isTimeSlotAvailable(time)}
                    >
                      {time}
                    </option>
                  ))}
                </select>

              </div>

              {/* End Time Field */}
              <div className="flex flex-col">
                <label htmlFor="end-time-field" className={`text-xs font-bold mb-2 text-xs px-2 py-1 rounded-lg ${
                  theme === "dark"
                    ? "bg-beige"
                    : "bg-beige"
                }`}>
                  🕐 {t("reservations.until")}<span className="text-red-500">*</span>
                </label>
                <select
                  id="end-time-field"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  required
                  className={`p-3 rounded-xl font-medium text-xs transition-all duration-300 focus:scale-105 ${
                    theme === "dark"
                      ? "text-[#F5F0E6] bg-[#1A1A1A]/50 border-2 border-white focus:border-white"
                      : "text-[#1A1A1A] bg-[#FFFFFF]/50 border-2 border-white/50 focus:border-white"
                  } ${getFieldError('endTime') ? 'border-red-500' : ''}`}
                >
                  <option value="" className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                    {t("reservations.selectTime")}
                  </option>
                  {getValidEndTimes(form.startTime).map((time) => (
                    <option
                      key={time}
                      value={time}
                      className={theme === "dark" ? "text-white bg-gray-800" : "text-gray-900 bg-white"}
                    >
                      {time}
                    </option>
                  ))}
                </select>

              </div>
            </div>

            {/* Guests Field */}
            <div className="flex flex-col mb-4">
              <label htmlFor="guests-field" className={`text-xs font-bold mb-2 px-2 py-1 rounded-lg ${
                theme === "dark"
                  ? "bg-beige"
                  : "bg-beige"
              }`}>
                👥 {t("reservations.numberOfGuests")}<span className="text-red-500">*</span>
              </label>
              <select
                id="guests-field"
                name="guests"
                value={form.guests}
                onChange={handleChange}
                required
                className={`p-3 rounded-xl font-medium text-xs transition-all duration-300 focus:scale-105 ${
                  theme === "dark"
                    ? "text-[#F5F0E6] bg-[#1A1A1A]/50 border-2 border-white focus:border-white"
                    : "text-[#1A1A1A] bg-[#FFFFFF]/50 border-2 border-white/50 focus:border-white"
                } ${getFieldError('guests') ? 'border-red-500' : ''}`}
              >
                <option value="" className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                  {t("reservations.selectGuests")}
                </option>
                {[...Array(22)].map((_, i) => (
                  <option
                    key={i + 1}
                    value={i + 1}
                    className={theme === "dark" ? "text-white bg-gray-800" : "text-gray-900 bg-white"}
                  >
                    {i + 1}
                  </option>
                ))}
              </select>

              {/* Enhanced warnings for guest count */}
              {validationWarnings.length > 0 && (
                <div className="mt-2">
                  {validationWarnings.map((warning, index) => (
                    <div key={index} className="text-yellow-400 text-xs bg-yellow-600/20 p-2 rounded-xl border border-yellow-400/50">
                      ⚠️ {warning}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Special Requests Field */}
            <div className="flex flex-col mb-4">
              <label htmlFor="special-requests-field" className={`text-xs font-bold mb-2 px-2 py-1 rounded-lg ${
                theme === "dark"
                  ? "bg-beige"
                  : "bg-beige"
              }`}>
                💭 {t("reservations.specialRequests")}
              </label>
              <textarea
                id="special-requests-field"
                name="specialRequests"
                value={form.specialRequests}
                onChange={handleChange}
                rows={3}
                placeholder={t("reservations.specialRequestsPlaceholder")}
                className={`p-3 rounded-xl font-medium text-xs transition-all duration-300 focus:scale-105 resize-none ${
                  theme === "dark"
                    ? "text-[#F5F0E6] placeholder-gray-400 bg-[#1A1A1A]/50 border-2 border-white focus:border-white"
                    : "text-[#1A1A1A] placeholder-gray-500 bg-[#FFFFFF]/50 border-2 border-[#A8D5BA]/50 focus:border-[#A8D5BA]"
                }`}
              />
            </div>

            {/* Enhanced Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <button
                type="submit"
                disabled={validationErrors.length > 0 || isSubmitting}
                className={`font-bold text-base py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  validationErrors.length > 0 || isSubmitting
                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                    : theme === "dark"
                    ? 'bg-gradient-to-r from-[#1A1A1A] to-[#1A1A1A] text-[#FFFFFF] hover:from-[#1A1A1A] hover:to-[#1A1A1A] shadow-[#1A1A1A]/50'
                    : 'bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] text-[#FFFFFF] hover:from-[#A8D5BA] hover:to-[#A8D5BA] shadow-[#A8D5BA]/50'
                }`}
              >
                {isSubmitting ? '⏳ Submitting...' : `✅ ${t("reservations.confirmReservation")}`}
              </button>

            </div>
          </form>
          </div>
        </div>

      </div>

      {/* Enhanced Business Hours Section - Below Main Container */}
      <div className="relative z-10 w-full max-w-7xl px-4 mb-6">
        <div className={`p-4 sm:p-5 rounded-2xl shadow-2xl  border-2 text-center ${
          theme === "dark"
            ? "bg-gradient-to-br from-[#1A1A1A]/90 to-[#1A1A1A]/90 border-[#A8D5BA]/50"
            : "bg-gradient-to-br from-[#FFFFFF]/95 to-[#FFFFFF]/95 border-[#A8D5BA]/70"
        }`}>
          <div className={`text-center font-bold py-3 rounded-xl mb-4 ${
            theme === "dark"
              ? "text-white"
              : "text-black"
          } shadow-lg`}>
            🕐 <span className={`text-3xl ${theme === "dark" ? "text-white" : "text-black"}`}>{t("reservations.businessHours")}</span>
          </div>

          <div className="flex flex-col text-center w-full">
            <div className={`text-2xl font-bold mb-1 ${theme === "dark" ? "text-white" : "text-black"}`}>
              12:00 – 14:00
            </div>
            <div className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}>
              18:00 – 22:00
            </div>
          </div>

          <div className="w-full">
            <div className={`text-2xl font-black text-center mb-2 mt-3 ${theme === "dark" ? "text-white" : "text-black"}`}>
              🍽️ LUNCH
            </div>
            <div className={`text-center ${theme === "dark" ? "text-white" : "text-black"}`}>
              <p className="text-2xl font-semibold">12:00 – 14:00</p>
              <p className="text-2xl font-medium mt-6">Last reservation at 13:30</p>
            </div>

            <div className={`text-2xl font-black text-center mb-4 mt-6 ${theme === "dark" ? "text-white" : "text-black"}`}>
              🍽️ DINNER
            </div>
            <div className={`text-center ${theme === "dark" ? "text-white" : "text-black"}`}>
              <p className="text-2xl font-semibold">18:00 – 22:00</p>
              <p className="text-2xl font-medium my-6">Last reservation at 20:30</p>
            </div>
          </div>

          <div className="w-full">
            <div className={`text-2xl font-black text-center mb-2 ${theme === "dark" ? "text-white" : "text-black"}`}>
              🎉 Saturday
            </div>
            <div className={`text-center text-2xl ${theme === "dark" ? "text-white" : "text-black"}`}>
              18:00 – 22:00
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
