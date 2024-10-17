const getAvailableTimes = async (token, gym, day, month, year) => {
  const result = await fetch('/api/booking/get-avaliable-times', {
    cache: 'no-store',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({token, gym, day, month, year }),
  });

    const response = await result.json();
    if (!response.error) {
      return response;
    }
};

const getAvailableTimesForLine = async (token, line, day, month, year) => {
  const result = await fetch('/api/booking/get-avalible-times-for-line', {
    cache: 'no-store',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({token, line, day, month, year }),
  });

    const response = await result.json();
    if (!response.error) {
      return response;
    }
};

export const takeAvaliableTimesDay = async (token, gym_id, date) => {
  const currentDate = new Date(date);
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const fetchCurrentDayTimes = getAvailableTimes(token, gym_id, currentDay, currentMonth, currentYear);

  return fetchCurrentDayTimes.then(({ data }) => {
    return data ? data : [];
  });
};

export const takeAvaliableTimesToLine = async (token, line, date) => {
  const currentDate = new Date(date);
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const fetchCurrentDayTimes = getAvailableTimesForLine(token, line, currentDay, currentMonth, currentYear);

  return fetchCurrentDayTimes.then(({ data }) => {
    let times = []
    data.forEach(data => times.push(data.time))
    return times
  });
};
