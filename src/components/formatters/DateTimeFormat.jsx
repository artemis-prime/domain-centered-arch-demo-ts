import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as moment from 'moment';

  // :aa unchanged from our app repo
  /*
    IMV, the 'formatters' notion should not be tied to display
    and should not be components.  Only a tiny bit of the effort here
    has anything to do with markup.

    It's better to have them as 
      util/formatters

    Where each one is just a simple function that returns a formatted string, 
    or at the very most an array of meaningful fragments.  That way, the display code can 
    use any markup it wishes, or they can be used appart from markeup.
  */

class DateTimeFormat extends Component {

  results() {
    const { date, excludesYear } = this.props;

    const options = {
      year: '2-digit', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric',
      timeZone: 'America/Chicago'
    };
    const euroDateFormat = /^\d{4}-\d{2}-\d{2}$/;

    try {
      if (date) {
        if (date.match(euroDateFormat)) {
          const newDateArray = [];
          const dateArray = date.split('-');
          dateArray.push(dateArray.shift());

          // Remove leading zeros from date month
          if (dateArray[0].charAt(0) === '0') {
            newDateArray.push(dateArray[0].charAt(1));
          }
          else {
            newDateArray.push(dateArray[0]);
          }

          // Remove leading zeros from date day
          if (dateArray[1].charAt(0) === '0') {
            newDateArray.push(dateArray[1].charAt(1));
          }
          else {
            newDateArray.push(dateArray[1]);
          }

          if (!excludesYear) {
            if (options['year'] === '2-digit') {
              newDateArray.push(dateArray[2].substring(2));
            } else {
              newDateArray.push(dateArray[2]);
            }
          }

          return newDateArray.join('/');
        }
        else {
          const dateParsed = this.parseDate(date);
          return new Intl.DateTimeFormat('en-US', this.props.options || options).format(dateParsed);
        }
      }
      else {
        return this.props.default;
      }
    }
    catch(error) {
      return this.props.default;
    }
  }

  parseDate(dateStr) {
    let dateStrWithTimeZone;
    if (dateStr.includes('GMT') || dateStr.includes('UTC')) {
      dateStrWithTimeZone = dateStr;
    } else {
      dateStrWithTimeZone = dateStr + 'Z';
    }

    try {
      const date = new Date(dateStrWithTimeZone);
      if (date.toDateString() === 'Invalid Date') {
        throw new Error('Invalid Date');
      }
      return date;
    } catch (e) {
      const modifiedDateStr = moment(dateStr, 'YYYY-MM-DD hh:mm:ss').toISOString();
      return new Date(modifiedDateStr);
    }
  }

  render() {
    const { date } = this.props;

    return (
      <span className="date-time" data-date={date}>
        {this.results()}
      </span>
    );
  }
}

DateTimeFormat.propTypes = {
  default: PropTypes.string,
  date: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.any
  ]),
  excludesYear: PropTypes.bool
};

DateTimeFormat.defaultProps = {
  default: 'N/A'
};

export default DateTimeFormat;
