import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useApiHost } from '../hooks';

function SchedulePage() {
  const [courseData, setCourseData] = useState([]);
  const [view, setView] = useState('list');
  const { API_HOST } = useApiHost();
  const navigate = useNavigate();

  // Pastel color palette for classes
  const pastelColors = [
    '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFBA', '#BAE1FF',
    '#FFBAFF', '#FF9E9D', '#C1E1C1', '#FFDAC1', '#D5C6E0'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_HOST}/student/courses`, { withCredentials: true });
        setCourseData(response.data);
      } catch {
        toast.error("Failed to fetch courses. Please log in again.");
        navigate("/login");
      }
    };
    fetchData();
  }, [API_HOST, navigate]);

  const dayOrder = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
  };

  const convertTo12HourFormat = (militaryTime) => {
    const hour = Math.floor(militaryTime / 60);
    const minute = militaryTime % 60;
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const newHour = hour % 12 || 12;
    const newMinute = minute < 10 ? `0${minute}` : minute;
    return `${newHour}:${newMinute} ${suffix}`;
  };

  const parseTime = (timeStr) => {
    const [days, timeRange] = timeStr.split(" ");
    const [startTime, endTime] = timeRange.split("-");
    const [startHour, startMinute] = startTime.replace(/AM|PM/, "").split(":").map(Number);
    const [endHour, endMinute] = endTime.replace(/AM|PM/, "").split(":").map(Number);

    const isStartPM = startTime.includes("PM");
    const isEndPM = endTime.includes("PM");

    // Convert to military time in minutes from 8 AM (480 minutes)
    const startTotalMinutes =
      (startHour % 12) * 60 + startMinute + (isStartPM && startHour !== 12 ? 12 * 60 : 0);
    const endTotalMinutes =
      (endHour % 12) * 60 + endMinute + (isEndPM && endHour !== 12 ? 12 * 60 : 0);

    // Map shorthand days to full day names
    const dayMap = {
      M: "Monday",
      T: "Tuesday",
      W: "Wednesday",
      Th: "Thursday",
      F: "Friday",
    };

    return days.split(/(?=[A-Z])/).map((day) => ({
      day: dayMap[day],
      startTotalMinutes: startTotalMinutes >= 480 ? startTotalMinutes : startTotalMinutes + 12 * 60,
      endTotalMinutes: endTotalMinutes >= 480 ? endTotalMinutes : endTotalMinutes + 12 * 60,
      formattedTime: `${dayMap[day]} ${convertTo12HourFormat(startTotalMinutes)}-${convertTo12HourFormat(endTotalMinutes)}`,
    }));
  };

  // Filter courses to include only those with status "In Progress"
  const parsedCourses = courseData
    .filter(course => course.status === "In Progress")
    .flatMap((course, index) =>
      parseTime(course.location.time).map((parsed) => ({
        ...course,
        day: parsed.day,
        startTotalMinutes: parsed.startTotalMinutes,
        endTotalMinutes: parsed.endTotalMinutes,
        formattedTime: parsed.formattedTime,
        color: pastelColors[index % pastelColors.length],  // Assign a color based on index
      }))
    );

  parsedCourses.sort((a, b) => {
    return dayOrder[a.day] !== dayOrder[b.day]
      ? dayOrder[a.day] - dayOrder[b.day]
      : a.startTotalMinutes - b.startTotalMinutes;
  });

  const initializeWeekSchedule = () => {
    const weekSchedule = {
      Monday: Array(12).fill(null),
      Tuesday: Array(12).fill(null),
      Wednesday: Array(12).fill(null),
      Thursday: Array(12).fill(null),
      Friday: Array(12).fill(null),
    };

    parsedCourses.forEach((course) => {
      const startIndex = Math.floor((course.startTotalMinutes - 480) / 60);
      const endIndex = Math.ceil((course.endTotalMinutes - 480) / 60);

      for (let i = startIndex; i < endIndex; i++) {
        weekSchedule[course.day][i] = course;
      }
    });

    return weekSchedule;
  };

  const weekSchedule = initializeWeekSchedule();

  const renderCalendarView = () => {
    const containerHeight = 600;
    const headerHeight = 40;
    const times = [];

    // Generate times for calendar view
    for (let hour = 8; hour <= 20; hour++) {
      times.push({
        time: `${hour % 12 || 12} ${hour < 12 ? 'AM' : 'PM'}`,
        top: ((hour - 8) / 12) * containerHeight, // Align the time slots correctly with the calendar grid
      });
    }

    return (
      <div
        className="relative w-full h-full mx-auto max-w-7xl my-4 rounded-lg bg-white shadow-md"
        style={{
          width: '80%',
          paddingTop: '2rem', // Increased top padding
          paddingBottom: '2rem', // Increased bottom padding
          paddingLeft: '1rem',
          paddingRight: '2rem',
        }}
      >
        {/* Outer container with white margins */}
        <div className="relative flex">
          {/* Times on the left with white margin */}
          <div className="flex flex-col justify-between p-4" style={{ width: '4rem' }}>
            {times.map(({ time, top }) => (
              <div key={time} className="absolute" style={{ top: `${top + headerHeight}px` }}>
                <div className="border-t border-dashed border-gray-400 w-full" style={{ height: '1px' }}></div>
                <span className="absolute text-gray-700 text-xs" style={{ width: '4rem' }}>
                  {time}
                </span>
              </div>
            ))}
          </div>

          {/* Calendar columns for each day */}
          <div className="grid grid-cols-5 gap-0 relative" style={{ height: `${containerHeight + headerHeight}px`, flex: 1 }}>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
              <div key={day} className="relative border p-2">
                <h2 className="font-bold text-center mb-2">{day}</h2>
                {weekSchedule[day].map((course, index) => {
                  if (!course) return null;
                  const startOffset = course.startTotalMinutes - 480;
                  const endOffset = course.endTotalMinutes - 480;
                  const top = (startOffset / 720) * containerHeight + headerHeight;
                  const height = ((endOffset - startOffset) / 720) * containerHeight;
                  return (
                    <div
                      key={index}
                      className="absolute p-2 rounded"
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        left: 0,
                        right: 0,
                        backgroundColor: course.color, // Set the background color
                        zIndex: 10, // Ensure class boxes appear above dotted lines
                      }}
                    >
                      <p className="font-bold">{course.course_code}</p>
                      <p>{course.course_name}</p>
                    </div>
                  );
                })}

                {/* Add dotted lines for each hour, but not for the last 8 PM slot */}
                {times.map(({ time, top }, index) => {
                  // Skip the last line for 8 PM (index 12, because we have 13 time slots from 8 AM to 8 PM)
                  if (index === times.length - 1) return null;

                  return (
                    <div
                      key={time}
                      className="absolute w-full"
                      style={{
                        top: `${top + headerHeight}px`,
                        left: 0,
                        right: 0,
                        borderBottom: '1px dashed #d3d3d3', // Dotted lines across the columns
                        zIndex: 1, // Ensure dotted lines are behind class boxes
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderListView = () => {
    if (parsedCourses.length === 0) {
      return (
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">You have no courses!</h2>
          <p className="text-gray-600">
            Go to <a href="/courses" className="button-blue-link-small">courses</a> to add to your schedule!
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-4 mx-auto w-full max-w-7xl">
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => {
          const dayCourses = parsedCourses.filter((course) => course.day === day);
          if (dayCourses.length === 0) return null;
          return (
            <div key={day} className="rounded-lg bg-white shadow-md p-4">
              <h3 className="font-bold text-xl text-blue-800 mb-2">{day}</h3>
              <div className="grid grid-cols-1 gap-2">
                {dayCourses.map((course, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 border rounded bg-gray-50"
                    style={{
                      borderLeft: `8px solid ${course.color}`, // Adds the colored band to the left
                    }}
                  >
                    <div className="w-20 text-center font-bold text-gray-700">
                      {convertTo12HourFormat(course.startTotalMinutes)}
                      <br />
                      <span className="text-xs text-gray-500">
                        End: {convertTo12HourFormat(course.endTotalMinutes)}
                      </span>
                    </div>
                    <div className="flex-1 pl-4">
                      <p className="font-semibold text-sm">{course.course_name}</p>
                      <p className="text-xs text-gray-600">
                        {course.location ? `${course.location.building}, Room ${course.location.room}` : "Location: N/A"}
                      </p>
                      <p className="text-xs text-gray-600">{course.instructor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Your Schedule</h1>
      <div className="flex justify-between mb-4">
        <button
          onClick={() => setView("list")}
          className={`button-base ${view === "list" ? "bg-pink-500" : ""}`}
        >
          List View
        </button>
        <button
          onClick={() => setView("calendar")}
          className={`button-base ${view === "calendar" ? "bg-pink-500" : ""}`}
        >
          Calendar View
        </button>
      </div>
      {view === "calendar" ? renderCalendarView() : renderListView()}
    </div>
  );
}

export default SchedulePage;