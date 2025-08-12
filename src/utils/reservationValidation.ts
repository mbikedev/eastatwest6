export interface ReservationForm {
  name: string;
  email: string;
  phone: string;
  date: string;
  startTime: string;
  endTime: string;
  guests: string;
  specialRequests: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: string[];
}

export class ReservationValidator {
  // Business constraints matching SQL constraints
  private static readonly MIN_GUESTS = 1;
  private static readonly MAX_GUESTS = 22;
  private static readonly APPROVAL_THRESHOLD = 10;
  
  // Time windows
  private static readonly LUNCH_START = "11:30";
  private static readonly LUNCH_END = "14:00";
  private static readonly DINNER_START = "18:00";
  private static readonly DINNER_END = "22:00";
  
  // Allowed time slots (matching new implementation)
  private static readonly ALLOWED_TIMES = [
    "11:30", "12:00", "12:30", "13:00", "13:30", "14:00",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"
  ];

  static validate(form: ReservationForm, t: (key: string) => string): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    // Required field validation
    this.validateRequiredFields(form, errors, t);
    
    // Date validation
    this.validateDate(form.date, errors);
    
    // Time validation
    this.validateTime(form.startTime, form.endTime, form.date, errors);
    
    // Name validation (alphabetic characters only)
    this.validateName(form.name, errors);
    
    // Guest count validation
    this.validateGuests(form.guests, errors, warnings, t);
    
    // Email format validation
    this.validateEmail(form.email, errors);
    
    // Phone validation
    this.validatePhone(form.phone, errors);

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private static validateRequiredFields(form: ReservationForm, errors: ValidationError[], t: (key: string) => string): void {
    const requiredFields = [
      { field: 'name', value: form.name, label: t('reservations.fullName') },
      { field: 'email', value: form.email, label: t('reservations.email') },
      { field: 'phone', value: form.phone, label: t('reservations.phone') },
      { field: 'date', value: form.date, label: t('reservations.form.date') },
      { field: 'startTime', value: form.startTime, label: t('reservations.time') },
      { field: 'endTime', value: form.endTime, label: t('reservations.until') },
      { field: 'guests', value: form.guests, label: t('reservations.numberOfGuests') }
    ];

    requiredFields.forEach(({ field, value, label }) => {
      if (!value || value.trim() === '') {
        errors.push({
          field,
          message: `${label} is required`
        });
      }
    });
  }

  private static validateDate(date: string, errors: ValidationError[]): void {
    if (!date) return;

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if date is in the past
    if (selectedDate < today) {
      errors.push({
        field: 'date',
        message: 'Cannot make reservations for past dates'
      });
    }

    // Check if it's Sunday (day 0)
    if (selectedDate.getDay() === 0) {
      errors.push({
        field: 'date',
        message: 'Reservations are not available on Sundays. We are closed on Sundays.'
      });
    }
  }

  private static validateTime(startTime: string, endTime: string, date: string, errors: ValidationError[]): void {
    if (!startTime || !endTime) return;

    // Check if times are in allowed slots
    if (!this.ALLOWED_TIMES.includes(startTime)) {
      errors.push({
        field: 'startTime',
        message: 'Please select a valid time slot. Available: Lunch (11:30-14:00), Dinner (18:00-22:00)'
      });
    }

    if (!this.ALLOWED_TIMES.includes(endTime)) {
      errors.push({
        field: 'endTime',
        message: 'Please select a valid end time slot'
      });
    }

    // Check time order
    if (startTime && endTime && startTime >= endTime) {
      errors.push({
        field: 'endTime',
        message: 'End time must be after start time'
      });
    }

    // Check for invalid time combinations
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    
    // Check if trying to cross between lunch and dinner periods
    if ((startHour >= 11 && startHour < 14) && (endHour >= 18)) {
      errors.push({
        field: 'endTime',
        message: 'Cannot select end time from dinner period when start time is in lunch period'
      });
    }
    
    if ((startHour >= 18) && (endHour >= 11 && endHour <= 14)) {
      errors.push({
        field: 'endTime',
        message: 'Cannot select end time from lunch period when start time is in dinner period'
      });
    }

    // Check business hours constraints based on selected date
    this.validateBusinessHours(startTime, endTime, date, errors);
  }

  private static validateBusinessHours(startTime: string, endTime: string, date: string, errors: ValidationError[]): void {
    if (!startTime || !endTime || !date) return;

    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();
    
    // Sunday is not available
    if (dayOfWeek === 0) {
      errors.push({
        field: 'date',
        message: 'Reservations are not available on Sundays. We are closed on Sundays.'
      });
      return;
    }

    // Saturday: only dinner hours (18:00-22:00)
    if (dayOfWeek === 6) {
      const hour = parseInt(startTime.split(':')[0]);
      if (hour < 18 || hour >= 22) {
        errors.push({
          field: 'startTime',
          message: 'On Saturdays, reservations are only available during dinner hours (18:00-22:00)'
        });
      }
      
      const endHour = parseInt(endTime.split(':')[0]);
      if (endHour > 22) {
        errors.push({
          field: 'endTime',
          message: 'Saturday reservations must end by 22:00'
        });
      }
      return;
    }

    // Monday to Friday: lunch (11:30-14:00) and dinner (18:00-22:00)
    const hour = parseInt(startTime.split(':')[0]);
    const isLunchTime = hour >= 11 && hour < 14;
    const isDinnerTime = hour >= 18 && hour < 22;

    if (!isLunchTime && !isDinnerTime) {
      errors.push({
        field: 'startTime',
        message: 'Reservations are only available during lunch (11:30-14:00) or dinner (18:00-22:00) hours'
      });
    }

    // Check end time doesn't exceed business hours
    if (isLunchTime) {
      const endHour = parseInt(endTime.split(':')[0]);
      if (endHour > 14) {
      errors.push({
        field: 'endTime',
        message: 'Lunch reservations must end by 14:00'
      });
      }
    }

    if (isDinnerTime) {
      const endHour = parseInt(endTime.split(':')[0]);
      if (endHour > 22) {
      errors.push({
        field: 'endTime',
        message: 'Dinner reservations must end by 22:00'
      });
      }
    }
  }

  private static validateGuests(guests: string, errors: ValidationError[], warnings: string[], t: (key: string) => string): void {
    if (!guests) return;

    const guestCount = parseInt(guests, 10);

    if (isNaN(guestCount)) {
      errors.push({
        field: 'guests',
        message: 'Please enter a valid number of guests'
      });
      return;
    }

    // Check SQL constraint: number_of_guests > 0 AND number_of_guests <= 22
    if (guestCount < this.MIN_GUESTS) {
      errors.push({
        field: 'guests',
        message: `Minimum ${this.MIN_GUESTS} guest required`
      });
    }

    if (guestCount > this.MAX_GUESTS) {
      errors.push({
        field: 'guests',
        message: `Maximum ${this.MAX_GUESTS} guests allowed. Please contact us directly for larger groups.`
      });
    }

    // Warning for approval requirement (10+ guests)
    if (guestCount >= this.APPROVAL_THRESHOLD && guestCount <= this.MAX_GUESTS) {
      warnings.push(
        t('reservations.approvalRequiredMessage')
      );
    }
  }

  private static validateEmail(email: string, errors: ValidationError[]): void {
    if (!email) return;

    // Enhanced email validation for better format checking
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      errors.push({
        field: 'email',
        message: 'Please enter a valid email address (e.g., user@example.com)'
      });
    }
  }

  private static validatePhone(phone: string, errors: ValidationError[]): void {
    if (!phone) return;

    // Belgian phone number validation
    // Accepts formats like: +32496935745, +32 496 93 57 45, 0496957354, etc.
    const belgianPhoneRegex = /^(\+32|0032)?\s?[0-9]{1,4}\s?[0-9]{1,4}\s?[0-9]{1,4}\s?[0-9]{1,4}$/;
    
    if (!belgianPhoneRegex.test(phone.replace(/\s/g, ''))) {
      errors.push({
        field: 'phone',
        message: 'Please enter a valid Belgian phone number (e.g., +32496935745 or 0496957354)'
      });
    }
  }

  // New method to validate name (alphabetic characters only)
  private static validateName(name: string, errors: ValidationError[]): void {
    if (!name) return;

    // Only allow alphabetic characters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    if (!nameRegex.test(name)) {
      errors.push({
        field: 'name',
        message: 'Name can only contain letters, spaces, hyphens, and apostrophes'
      });
    }
  }

  // Helper method to check if reservation will need approval
  static requiresApproval(guests: string): boolean {
    const guestCount = parseInt(guests, 10);
    return !isNaN(guestCount) && guestCount >= this.APPROVAL_THRESHOLD;
  }

  // Helper method to get allowed time slots
  static getAllowedTimes(): string[] {
    return [...this.ALLOWED_TIMES];
  }
}
