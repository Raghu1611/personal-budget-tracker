import { MONTH_NAMES } from '../utils/constants';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

const MonthPicker = ({ month, year, onChange }) => {
  const handlePrev = () => {
    if (month === 1) {
      onChange(12, year - 1);
    } else {
      onChange(month - 1, year);
    }
  };

  const handleNext = () => {
    if (month === 12) {
      onChange(1, year + 1);
    } else {
      onChange(month + 1, year);
    }
  };

  return (
    <div className="month-picker">
      <button onClick={handlePrev} id="month-prev-btn" title="Previous month">
        <HiOutlineChevronLeft />
      </button>
      <span>{MONTH_NAMES[month - 1]} {year}</span>
      <button onClick={handleNext} id="month-next-btn" title="Next month">
        <HiOutlineChevronRight />
      </button>
    </div>
  );
};

export default MonthPicker;
