import { formatInTimeZone, toDate } from "date-fns-tz";
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek } from "date-fns";

export const AR_TIMEZONE = "America/Argentina/Buenos_Aires";

/**
 * Retorna la fecha y hora actual en la zona horaria de Argentina.
 */
export function getNowInAR(): Date {
       return toDate(new Date(), { timeZone: AR_TIMEZONE });
}

/**
 * Retorna el inicio del día (00:00:00.000) de Argentina aplicado a una fecha,
 * convertido a objeto Date de sistema (UTC) para que Prisma lo use correctamente.
 */
export function getARStartOfDay(date: Date = new Date()): Date {
       // Convertimos la entrada a un string de fecha en la zona de AR
       const dateStr = formatInTimeZone(date, AR_TIMEZONE, "yyyy-MM-dd");
       // Creamos el inicio del día en esa zona horaria
       return toDate(`${dateStr}T00:00:00.000`, { timeZone: AR_TIMEZONE });
}

/**
 * Retorna el fin del día (23:59:59.999) de Argentina aplicado a una fecha, 
 * convertido a objeto Date de sistema (UTC).
 */
export function getAREndOfDay(date: Date = new Date()): Date {
       const dateStr = formatInTimeZone(date, AR_TIMEZONE, "yyyy-MM-dd");
       return toDate(`${dateStr}T23:59:59.999`, { timeZone: AR_TIMEZONE });
}

/**
 * Retorna un rango de fechas de sistema (UTC) que corresponden a los últimos N días en Argentina.
 */
export function getARDateRange(daysBack: number = 0): { start: Date; end: Date } {
       const now = getNowInAR();
       const start = getARStartOfDay(subDays(now, daysBack));
       const end = getAREndOfDay(now);
       return { start, end };
}

/**
 * Formatea una fecha según la zona horaria de Argentina.
 */
export function formatAR(date: Date, formatStr: string = "dd/MM/yyyy HH:mm"): string {
       return formatInTimeZone(date, AR_TIMEZONE, formatStr);
}

/**
 * Helper para obtener el nombre del día o fecha legible para el negocio.
 */
export function getARRelativeDate(date: Date = new Date()): string {
       return formatInTimeZone(date, AR_TIMEZONE, "EEEE d 'de' MMMM", {
              // Nota: para localización al español se puede usar locale de date-fns si es necesario, 
              // pero formatInTimeZone maneja el timezone independientemente.
       });
}
