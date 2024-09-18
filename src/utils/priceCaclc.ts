// utils/priceUtils.ts

export const calculatePrice = (startDate: Date, endDate: Date): number => {
    const parkingDurationMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60); 
    const pricePer30Minutes = 0.5; 
  
    return Math.ceil(parkingDurationMinutes / 15) * pricePer30Minutes;
  };
  
  export const calculateParkingDuration = (startDate: Date, endDate: Date): { hours: number, minutes: number } => {
    const parkingDurationMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
    const hours = Math.floor(parkingDurationMinutes / 60);
    const minutes = parkingDurationMinutes % 60;
    return { hours, minutes };
  };
  