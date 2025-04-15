import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { apiRoutes, IMAGE_URL } from '../routes/apiRoutes';
import axios from 'axios';

interface IslamicEvent {
  name: string;
  nameAr: string;
  description: string;
  hijriMonth: number;
  hijriDay: number;
  type: 'holiday' | 'event' | 'worship';
  subject?: string;
}

interface Sheikh {
  id: number;
  name: string;
  image: string;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calendarDays, setCalendarDays] = useState<CalendarDayData[]>([]);
  const [selectedDay, setSelectedDay] = useState<CalendarDayData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [sheikhs, setSheikhs] = useState<Sheikh[]>([]);
  const fetchChikhis = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiRoutes.chikhis);
      setSheikhs(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching chikhis:', err);
      setError('Failed to load scholars. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch calendar data for the selected month using aladhan.com API
  useEffect(() => {
    fetchChikhis();
    setCalendarData({
      '2025-04-01': { title: 'فضل عيد الفطر' },
      '2025-04-02': { title: 'زكاة الفطر' },
      '2025-04-03': { title: 'آداب العيد' },
      '2025-04-04': { title: 'صلة الرحم بعد رمضان' },
      '2025-04-05': { title: 'الاستمرار في الطاعة بعد رمضان' },
      '2025-04-06': { title: 'الفرح المشروع في الإسلام' },
      '2025-04-07': { title: 'أثر العيد على المجتمع' },
      '2025-04-08': { title: 'صيام الست من شوال' },
      '2025-04-09': { title: 'نية الصيام' },
      '2025-04-10': { title: 'الاستغفار بعد رمضان' },
      '2025-04-11': { title: 'الاستمرار في قراءة القرآن' },
      '2025-04-12': { title: 'قيام الليل في غير رمضان' },
      '2025-04-13': { title: 'الصدقة بعد رمضان' },
      '2025-04-14': { title: 'التوبة والاستغفار' },
      '2025-04-15': { title: 'أهمية الدعاء في كل الأوقات' },
      '2025-04-16': { title: 'النية في الأعمال' },
      '2025-04-17': { title: 'التحلي بالأخلاق الحسنة' },
      '2025-04-18': { title: 'أهمية الوقت في حياة المسلم' },
      '2025-04-19': { title: 'الاستمرار في الذكر' },
      '2025-04-20': { title: 'التخطيط للعام الهجري' },
      '2025-04-21': { title: 'التفكر في خلق الله' },
      '2025-04-22': { title: 'الاستعداد للأشهر القادمة' },
      '2025-04-23': { title: 'مراجعة النفس' },
      '2025-04-24': { title: 'أهمية الصحبة الصالحة' },
      '2025-04-25': { title: 'تعلم علم جديد في الدين' },
      '2025-04-26': { title: 'الاستمرار في الدعوة إلى الله' },
      '2025-04-27': { title: 'الاستعداد لذي القعدة وذي الحجة' },
      '2025-04-28': { title: 'خاتمة الشهر' },
    });
  }, []);

  const getHijriDate = (date: Date): HijriDate => {
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
    return [
      {
        name: "Islamic Lecture",
        nameAr: "محاضرة إسلامية",
        description: "A lecture about Islamic teachings",
        hijriMonth: hijriMonth,
        hijriDay: hijriDay,
        type: 'event'
      }
    ];
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

      calendarArray.push({
        date,
        hijri,
        events: getIslamicEventsForDay(hijri.month, hijri.day)
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

  const handleDayClick = (day: CalendarDayData) => {
    setSelectedDay(day);
    setShowModal(true);
  };

  const handleSheikhClick = (sheikh: Sheikh) => {
    if (!selectedDay) return;

    const dateKey = `${selectedDay.date.getFullYear()}-${(selectedDay.date.getMonth() + 1).toString().padStart(2, '0')}-${selectedDay.date.getDate().toString().padStart(2, '0')}`;
    const eventTitle = calendarData[dateKey]?.title || "Islamic lecture";

    const searchQuery = `${eventTitle} ${sheikh.name}`;
    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;

    window.open(youtubeSearchUrl, '_blank');
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
                  
                  const dateKey = `${day.date.getFullYear()}-${(day.date.getMonth() + 1).toString().padStart(2, '0')}-${day.date.getDate().toString().padStart(2, '0')}`;
                  const hasTopic = calendarData[dateKey] && calendarData[dateKey].title;

                  return (
                    <div
                      key={index}
                      className={`min-h-[100px] p-2 border rounded-lg relative transition-all 
                    ${isToday ? 'border-emerald-500 shadow-md ring-2 ring-emerald-300' : 'border-gray-200'} 
                    ${!isCurrentMonth ? 'text-gray-400 bg-gray-50' : ''} 
                    ${hasTopic ? 'bg-emerald-50 border-emerald-300' : ''}
                    hover:shadow-md cursor-pointer`}
                      onClick={() => handleDayClick(day)}
                    >
                      <div className="flex justify-between">
                        <span className="text-lg">{day.date.getDate()}</span>
                        <span className={`text-sm font-arabic`}>
                          {day.hijri.day}
                        </span>
                      </div>

                      {isCurrentMonth && hasTopic && (
                        <div className="mt-2 text-xs font-medium text-emerald-700 font-arabic text-right">
                          {calendarData[dateKey].title}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sheikh Modal */}
            {showModal && selectedDay && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg p-6 w-11/12 max-w-2xl max-h-[80vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-emerald-700">
                      {selectedDay.date.toLocaleDateString()} | {selectedDay.hijri.day} {selectedDay.hijri.monthNameAr} {selectedDay.hijri.year}
                    </h2>
                    <button 
                      onClick={() => setShowModal(false)}
                      className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  {/* Calendar event title */}
                  {(() => {
                    const dateKey = `${selectedDay.date.getFullYear()}-${(selectedDay.date.getMonth() + 1).toString().padStart(2, '0')}-${selectedDay.date.getDate().toString().padStart(2, '0')}`;
                    const eventTitle = calendarData[dateKey]?.title;
                    
                    return eventTitle ? (
                      <div className="mb-4 p-3 bg-emerald-50 rounded-lg">
                        <h3 className="text-lg font-arabic text-right text-emerald-800">{eventTitle}</h3>
                      </div>
                    ) : null;
                  })()}
                  
                  <h3 className="text-lg font-medium mb-4">Select a Sheikh to find lectures:</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {sheikhs.map(sheikh => (
                      <div 
                        key={sheikh.id}
                        className="flex flex-col items-center p-3 border rounded-lg hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer transition-colors"
                        onClick={() => handleSheikhClick(sheikh)}
                      >
                        <img 
                          src={IMAGE_URL + sheikh.image} 
                          alt={sheikh.name}
                          className="w-20 h-20 object-cover rounded-full mb-2" 
                        />
                        <span className="text-center font-medium text-sm">{sheikh.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
