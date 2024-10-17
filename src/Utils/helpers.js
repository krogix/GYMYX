export const checkValidPhone = (value) => {
  const cleanedPhoneNumber = value.replace(/\D/g, '');

  return {
    value: cleanedPhoneNumber,
    valid: /^7[3-9]{1}[0-9]{9}$/.test(cleanedPhoneNumber),
  };
};

export const formatPhoneNumber = (phoneNumber) => {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');

  const country = cleaned.slice(0, 1);
  const region = cleaned.slice(1, 4);
  const firstBlock = cleaned.slice(4, 7);
  const secondBlock = cleaned.slice(7, 9);
  const thirdBlock = cleaned.slice(9, 11);

  const formattedNumber = `+${country} (${region}) ${firstBlock}-${secondBlock}-${thirdBlock}`;

  return formattedNumber;
};

export const getFioShort = (fio) => {
  if (fio != '') {
    const fioData = fio.split(' ');
    return `${fioData[0]} ${fioData[1] !== undefined ? fioData[1].charAt(0) : ''}`;
  }
  return fio;
};

export const generateBookingDates = (count = 31) => {
  const currentDate = new Date();
  const dates = [];

  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(currentDate.getDate() + i);

    const dayOfWeek = date.toLocaleDateString('ru-RU', { weekday: 'short' });
    const dayOfMonth = date.getDate();
    const monthNumber = date.getMonth() + 1;
    const monthLabel = date.toLocaleDateString('ru-RU', { month: 'long' });
    const year = date.getFullYear();

    dates.push({
      id: i,
      dayOfMonth,
      dayOfWeek,
      month: {
        number: monthNumber,
        label: monthLabel,
      },
      year,
    });
  }

  return dates;
};

export const formatDate = (inputDate) => {
  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];

  const date = new Date(inputDate);
  const day = date.getDate();
  const month = months[date.getMonth()];
  let year = date.getFullYear();
  if (new Date().getFullYear() === year) {
    year = '';
  }
  return `${day} ${month} ${year}`;
};

export const formatTime = (inputTime) => {
  const timeArray = inputTime.split(':');
  const hours = parseInt(timeArray[0], 10);
  const minutes = parseInt(timeArray[1], 10);

  if (!isNaN(hours) && !isNaN(minutes)) {
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    return formattedTime;
  } else {
    return '';
  }
};
