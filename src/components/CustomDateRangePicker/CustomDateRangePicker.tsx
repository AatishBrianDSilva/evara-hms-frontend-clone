import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import {
  DateRangePicker,
  RangeKeyDict,
  defaultStaticRanges,
} from 'react-date-range';
import {
  addDays,
  endOfDay,
  endOfWeek,
  startOfDay,
  startOfWeek,
} from 'date-fns';
import DateRangeIcon from '@mui/icons-material/DateRange';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { enIN } from 'date-fns/locale';
import { Box } from '@mui/material';
import { Cancel, Check } from '@mui/icons-material';

const predefinedRanges = [
  {
    label: 'Today',
    range: {
      startDate: startOfDay(new Date()),
      endDate: endOfDay(new Date()),
    },
  },
  {
    label: 'Yesterday',
    range: {
      startDate: startOfDay(addDays(new Date(), -1)),
      endDate: endOfDay(addDays(new Date(), -1)),
    },
  },
  {
    label: 'This Week',
    range: {
      startDate: startOfWeek(new Date(), { weekStartsOn: 1 }), // Start from Monday
      endDate: endOfWeek(new Date(), { weekStartsOn: 1 }), // End on Sunday
    },
  },
  {
    label: 'Last Week',
    range: {
      startDate: startOfWeek(addDays(new Date(), -7), { weekStartsOn: 1 }),
      endDate: endOfWeek(addDays(new Date(), -7), { weekStartsOn: 1 }),
    },
  },
];

const modifiedStaticRanges = defaultStaticRanges.map(range => {
  if (range.label === 'This Week') {
    return {
      ...range,
      range: () => ({
        startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
        endDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
      }),
    };
  }

  if (range.label === 'Last Week') {
    return {
      ...range,
      range: () => ({
        startDate: startOfWeek(addDays(new Date(), -7), { weekStartsOn: 1 }),
        endDate: endOfWeek(addDays(new Date(), -7), { weekStartsOn: 1 }),
      }),
    };
  }

  return range;
});

enum RangeLabel {
  Today = 'Today',
  Yesterday = 'Yesterday',
  ThisWeek = 'This Week',
  LastWeek = 'Last Week',
}

interface SelectionRange {
  startDate: Date;
  endDate: Date;
  key: string;
}

interface CustomeDateRangePickerProps {
  defaultRangeLabel?: RangeLabel;
  onChange?: (ranges: RangeKeyDict) => void;
}

const CustomeDateRangePicker: React.FC<CustomeDateRangePickerProps> = ({
  defaultRangeLabel = RangeLabel.ThisWeek,
  onChange,
}) => {
  const defaultRange =
    predefinedRanges.find(range => range.label === defaultRangeLabel) ||
    predefinedRanges[2];

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectionRange, setSelectionRange] = React.useState<SelectionRange>({
    startDate: defaultRange.range.startDate,
    endDate: defaultRange.range.endDate,
    key: 'selection',
  });
  const [rangeLabel, setRangeLabel] = React.useState<string>(
    defaultRange.label,
  );
  const latestRangesRef = React.useRef<SelectionRange>(selectionRange);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSave = () => {
    setAnchorEl(null);
    if (onChange) {
      onChange({ selection: latestRangesRef.current });
    }
  };

  const handleSelect = (ranges: RangeKeyDict) => {
    const selectedRange = ranges.selection as SelectionRange;
    // Set end date's time here as 23:59:59 to cover that entire day
    selectedRange.endDate = endOfDay(selectedRange.endDate);
    setSelectionRange(selectedRange);
    latestRangesRef.current = selectedRange;

    const matchedRange = predefinedRanges.find(
      range =>
        range.range.startDate.toDateString() ===
          selectedRange.startDate.toDateString() &&
        range.range.endDate.toDateString() ===
          selectedRange.endDate.toDateString(),
    );

    setRangeLabel(matchedRange ? matchedRange.label : '');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const buttonText = rangeLabel
    ? rangeLabel
    : `${formatDate(selectionRange.startDate)} - ${formatDate(selectionRange.endDate)}`;

  return (
    <>
      <Button
        id="date-range-button"
        aria-controls={open ? 'date-range-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="outlined"
        color="secondary"
        startIcon={<DateRangeIcon />}
      >
        {buttonText}
      </Button>
      <Menu
        id="date-range-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'date-range-button',
        }}
      >
        <DateRangePicker
          locale={enIN}
          ranges={[selectionRange]}
          onChange={handleSelect}
          staticRanges={modifiedStaticRanges}
          inputRanges={[]}
        />
        <Box display="flex" justifyContent="flex-end" m={2} gap={2}>
          <Button
            startIcon={<Cancel />}
            variant="text"
            color="primary"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            startIcon={<Check />}
            variant="text"
            color="primary"
            onClick={handleSave}
          >
            Apply
          </Button>
        </Box>
      </Menu>
    </>
  );
};

export default CustomeDateRangePicker;
export { RangeLabel };
