// utils/priceUtils.ts

// Function to calculate parking price based on duration
export const calculatePrice = (startDate: Date, endDate: Date): number => {
    const parkingDurationMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60); // czas w minutach
    const pricePer30Minutes = 1; // Załóżmy, że cena za 30 minut to 1 zł
  
    // Obliczanie liczby przedziałów 30-minutowych i zaokrąglanie w górę
    return Math.ceil(parkingDurationMinutes / 30) * pricePer30Minutes;
  };
  
  // Function to calculate parking duration in hours and minutes
  export const calculateParkingDuration = (startDate: Date, endDate: Date): { hours: number, minutes: number } => {
    const parkingDurationMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
    const hours = Math.floor(parkingDurationMinutes / 60);
    const minutes = parkingDurationMinutes % 60;
    return { hours, minutes };
  };
  