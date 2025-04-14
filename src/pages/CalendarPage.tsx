import { useState, useEffect } from 'react';
import Header from '../components/Header';

interface IslamicEvent {
  name: string;
  nameAr: string;
  description: string;
  hijriMonth: number;
  hijriDay: number;
  type: 'holiday' | 'event' | 'worship';
  subject?: string;
}

interface HijriDate {
  year: number;
  month: number;
  day: number;
  monthName: string;
  monthNameAr: string;
  weekdayAr: string;
}

interface CalendarDayData {
  date: Date;
  hijri: HijriDate;
  events: IslamicEvent[];
  prayerTimes?: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
}

// Define the Arabic month names
const hijriMonthsArabic = [
  "محرم",
  "صفر",
  "ربيع الأول",
  "ربيع الثاني",
  "جمادى الأولى",
  "جمادى الآخرة",
  "رجب",
  "شعبان",
  "رمضان",
  "شوال",
  "ذو القعدة",
  "ذو الحجة"
];

// English month names for reference
const hijriMonthsEnglish = [
  "Muharram",
  "Safar",
  "Rabi al-Awwal",
  "Rabi al-Thani",
  "Jumada al-Awwal",
  "Jumada al-Thani",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qi'dah",
  "Dhu al-Hijjah"
];

const weekDaysArabic = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const weekDaysEnglish = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [islamicEvents, setIslamicEvents] = useState<IslamicEvent[]>([]);
  const [calendarData, setCalendarData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calendarDays, setCalendarDays] = useState<CalendarDayData[]>([]);

  // Config for API calls
  const apiConfig = {
    method: 1, // MuslimWorldLeague method in aladhan API
    latitude: 21.422510,
    longitude: 39.826168
  };

  // Fetch Islamic events from aladhan.com API
  useEffect(() => {
    const fetchIslamicEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.aladhan.com/v1/specialDays');

        if (!response.ok) {
          throw new Error('Failed to fetch Islamic events');
        }

        const data = await response.json();

        if (!data.data || !Array.isArray(data.data)) {
          throw new Error('Invalid data format from API');
        }

        const transformedEvents: IslamicEvent[] = data.data.map((event: any) => {
          let hijriMonth = 1;
          let hijriDay = 1;

          if (event.hijri && event.hijri.date) {
            const hijriDateParts = event.hijri.date.split('-');
            if (hijriDateParts.length === 3) {
              hijriMonth = parseInt(hijriDateParts[1]);
              hijriDay = parseInt(hijriDateParts[2]);
            }
          }

          let eventType: 'holiday' | 'event' | 'worship' = 'event';
          const name = (event.name || '').toLowerCase();

          if (name.includes('eid') || name.includes('عيد')) {
            eventType = 'holiday';
          } else if (
            name.includes('laylat') ||
            name.includes('night') ||
            name.includes('ramadan') ||
            name.includes('رمضان') ||
            name.includes('arafah') ||
            name.includes('عرفة')
          ) {
            eventType = 'worship';
          }

          return {
            name: event.name || 'Islamic Event',
            nameAr: event.nameAr || event.name || 'حدث إسلامي',
            description: event.description || '',
            hijriMonth,
            hijriDay,
            type: eventType,
            subject: event.subject || undefined
          };
        });

        setIslamicEvents(transformedEvents);
        setError(null);
      } catch (err) {
        console.error('Error fetching Islamic events:', err);
        setError('Failed to load Islamic events. Please try again later.');

        const fallbackEvents: IslamicEvent[] = [
          {
            name: "Eid al-Fitr",
            nameAr: "عيد الفطر",
            description: "Celebration marking the end of Ramadan",
            hijriMonth: 10,
            hijriDay: 1,
            type: 'holiday'
          },
          {
            name: "Eid al-Adha",
            nameAr: "عيد الأضحى",
            description: "Feast of Sacrifice",
            hijriMonth: 12,
            hijriDay: 10,
            type: 'holiday'
          },
          {
            name: "Laylat al-Qadr",
            nameAr: "ليلة القدر",
            description: "Night of Power",
            hijriMonth: 9,
            hijriDay: 27,
            type: 'worship'
          }
        ];
        setIslamicEvents(fallbackEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchIslamicEvents();
  }, []);

  // Fetch calendar data for the selected month using aladhan.com API
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true);

        const calendarDataMap: Record<string, any> = {};

        const monthResponse = await fetch(
          `https://api.aladhan.com/v1/calendar?latitude=${apiConfig.latitude}&longitude=${apiConfig.longitude}&method=${apiConfig.method}&month=${selectedMonth + 1}&year=${selectedYear}`
        );

        if (!monthResponse.ok) {
          throw new Error('Failed to fetch calendar data');
        }

        const monthData = await monthResponse.json();

        if (!monthData.data || !Array.isArray(monthData.data)) {
          throw new Error('Invalid month data format from API');
        }

        monthData.data.forEach((day: any) => {
          if (day.date && day.date.gregorian && day.date.hijri) {
            const gregDate = day.date.gregorian.date;
            const dateParts = gregDate.split('-');
            if (dateParts.length === 3) {
              const dateKey = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
              calendarDataMap[dateKey] = day;
            }
          }
        });

        setCalendarData(calendarDataMap);
        setError(null);
      } catch (err) {
        console.error('Error fetching calendar data:', err);
        setError('Failed to load Islamic calendar data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [selectedMonth, selectedYear]);

  const getHijriDate = (date: Date): HijriDate => {
    const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const apiData = calendarData[dateKey];

    if (apiData && apiData.date && apiData.date.hijri) {
      const hijriData = apiData.date.hijri;
      return {
        year: parseInt(hijriData.year),
        month: parseInt(hijriData.month),
        day: parseInt(hijriData.day),
        monthName: hijriData.month.en,
        monthNameAr: hijriData.month.ar,
        weekdayAr: hijriData.weekday.ar
      };
    }

    const yearOffset = Math.floor((date.getFullYear() - 622) * (33 / 32));
    const approxHijriMonth = ((date.getMonth() + 10) % 12) + 1;

    return {
      year: date.getFullYear() - 622 + Math.floor((date.getMonth() + 1) / 12),
      month: approxHijriMonth,
      day: date.getDate(),
      monthName: hijriMonthsEnglish[approxHijriMonth - 1],
      monthNameAr: hijriMonthsArabic[approxHijriMonth - 1],
      weekdayAr: weekDaysArabic[date.getDay()]
    };
  };

  const getIslamicEventsForDay = (hijriMonth: number, hijriDay: number): IslamicEvent[] => {
    return islamicEvents.filter(
      event => event.hijriMonth === hijriMonth && event.hijriDay === hijriDay
    );
  };

  const getPrayerTimes = (date: Date) => {
    const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const apiData = calendarData[dateKey];

    if (apiData && apiData.timings) {
      return {
        fajr: apiData.timings.Fajr.split(' ')[0],
        dhuhr: apiData.timings.Dhuhr.split(' ')[0],
        asr: apiData.timings.Asr.split(' ')[0],
        maghrib: apiData.timings.Maghrib.split(' ')[0],
        isha: apiData.timings.Isha.split(' ')[0],
      };
    }

    return undefined;
  };

  useEffect(() => {
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
    const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    const firstDayOfWeek = firstDayOfMonth.getDay();

    const calendarArray: CalendarDayData[] = [];

    const prevMonthLastDay = new Date(selectedYear, selectedMonth, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(selectedYear, selectedMonth - 1, prevMonthLastDay - i);
      const hijri = getHijriDate(date);
      calendarArray.push({
        date,
        hijri,
        events: getIslamicEventsForDay(hijri.month, hijri.day)
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth, day);
      const hijri = getHijriDate(date);

      const prayerTimes = getPrayerTimes(date);

      calendarArray.push({
        date,
        hijri,
        events: getIslamicEventsForDay(hijri.month, hijri.day),
        prayerTimes
      });
    }

    const lastDayOfWeek = lastDayOfMonth.getDay();
    for (let i = 1; i < 7 - lastDayOfWeek; i++) {
      const date = new Date(selectedYear, selectedMonth + 1, i);
      const hijri = getHijriDate(date);
      calendarArray.push({
        date,
        hijri,
        events: getIslamicEventsForDay(hijri.month, hijri.day)
      });
    }

    setCalendarDays(calendarArray);
  }, [selectedMonth, selectedYear, islamicEvents, calendarData]);

  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const getCurrentHijriMonth = () => {
    if (calendarDays.length > 15) {
      const middleDay = calendarDays[15];
      return {
        month: middleDay.hijri.month,
        monthName: middleDay.hijri.monthName,
        monthNameAr: middleDay.hijri.monthNameAr,
        year: middleDay.hijri.year
      };
    }
    return {
      month: 1,
      monthName: hijriMonthsEnglish[0],
      monthNameAr: hijriMonthsArabic[0],
      year: 1445
    };
  };

  const currentHijriMonth = getCurrentHijriMonth();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-emerald-600 font-bold text-lg">Loading Islamic Calendar...</div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-3xl font-bold text-center mb-2 text-emerald-700">Islamic Calendar</h1>
              <p className="text-center text-gray-600 mb-6">View important Islamic dates and events</p>

              <div className="flex justify-between items-center mb-8">
                <button
                  onClick={prevMonth}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>

                <div className="text-center">
                  <h2 className="text-2xl font-bold">
                    {new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long' })} {selectedYear}
                  </h2>
                  <div className="text-lg text-emerald-600 font-arabic mt-1">
                    {currentHijriMonth.monthNameAr} {currentHijriMonth.year} هـ
                  </div>
                </div>

                <button
                  onClick={nextMonth}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {weekDaysEnglish.map((day, index) => (
                  <div key={day} className="text-center font-medium p-2">
                    <div className="text-gray-800">{day.substring(0, 3)}</div>
                    <div className="text-xs text-emerald-600 font-arabic">{weekDaysArabic[index]}</div>
                  </div>
                ))}

                {calendarDays.map((day, index) => {
                  const isToday =
                    day.date.getDate() === new Date().getDate() &&
                    day.date.getMonth() === new Date().getMonth() &&
                    day.date.getFullYear() === new Date().getFullYear();

                  const isCurrentMonth = day.date.getMonth() === selectedMonth;

                  const hasEvent = day.events.length > 0;

                  let specialClass = '';
                  if (hasEvent) {
                    const eventType = day.events[0].type;
                    if (eventType === 'holiday') specialClass = 'bg-red-100 border-red-400';
                    else if (eventType === 'event') specialClass = 'bg-blue-100 border-blue-400';
                    else if (eventType === 'worship') specialClass = 'bg-emerald-100 border-emerald-400';
                  }

                  return (
                    <div
                      key={index}
                      className={`min-h-[100px] p-2 border rounded-lg relative transition-all 
                    ${isToday ? 'border-emerald-500 shadow-md ring-2 ring-emerald-300' : 'border-gray-200'} 
                    ${!isCurrentMonth ? 'text-gray-400 bg-gray-50' : ''} 
                    ${specialClass}
                    hover:shadow-md`}
                    >
                      <div className="flex justify-between">
                        <span className="text-lg">{day.date.getDate()}</span>
                        <span className={`text-sm font-arabic ${hasEvent ? 'font-bold' : ''}`}>
                          {day.hijri.day}
                        </span>
                      </div>

                      {isCurrentMonth && day.prayerTimes && (
                        <div className="mt-1 text-xs text-gray-600">
                          <div className="grid grid-cols-2 gap-1">
                            <span>Fajr: {day.prayerTimes.fajr}</span>
                            <span>Dhuhr: {day.prayerTimes.dhuhr}</span>
                            <span>Asr: {day.prayerTimes.asr}</span>
                            <span>Maghrib: {day.prayerTimes.maghrib}</span>
                            <span>Isha: {day.prayerTimes.isha}</span>
                          </div>
                        </div>
                      )}

                      {hasEvent && day.events.map((event, eventIndex) => (
                        <div key={eventIndex} className="mt-1">
                          <div className="text-xs font-bold text-emerald-700">{event.name}</div>
                          <div className="text-xs font-arabic text-right">{event.nameAr}</div>
                          {event.subject && isCurrentMonth && (
                            <div className="text-xs mt-1 text-gray-600 italic">Topic: {event.subject}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4 text-emerald-700">Islamic Events Calendar</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {islamicEvents.map((event, index) => (
                  <div key={index} className={`p-4 rounded-lg border 
                ${event.type === 'holiday' ? 'bg-red-50 border-red-300' : ''} 
                ${event.type === 'event' ? 'bg-blue-50 border-blue-300' : ''}
                ${event.type === 'worship' ? 'bg-emerald-50 border-emerald-300' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold">{event.name}</h4>
                      <span className="text-right font-arabic">{event.nameAr}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">{event.description}</div>
                    <div className="mt-2 text-xs font-medium">
                      <span className="font-arabic">{hijriMonthsArabic[event.hijriMonth - 1]} {event.hijriDay}</span>
                      <span className="mx-1">|</span>
                      <span>{hijriMonthsEnglish[event.hijriMonth - 1]} {event.hijriDay}</span>
                    </div>
                    {event.subject && (
                      <div className="mt-2 text-sm">
                        <span className="font-semibold text-emerald-700">Suggested Topic:</span>
                        <p className="text-gray-700">{event.subject}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
