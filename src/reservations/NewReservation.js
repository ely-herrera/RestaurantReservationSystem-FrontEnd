import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  createReservation,
  editReservation,
  formatPhoneNumber,
  readReservation,
} from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';

export default function NewReservation({ edit, loadDashboard }) {
  const [errors, setErrors] = useState(null);
  const history = useHistory();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile_number: '',
    reservation_date: '',
    reservation_time: '',
    people: 1,
  });

  ////////// EDIT FORM POPULATION ///////////

  const { reservation_id } = useParams();

  useEffect(() => {
    const abortController = new AbortController();
    if (reservation_id) {
      readReservation(reservation_id, abortController.signal)
        .then((foundRes) => {
          setFormData({
            ...foundRes,
            reservation_date: new Date(foundRes.reservation_date)
              .toISOString()
              .substr(0, 10),
          });
        })
        .catch(setErrors);
    }
    return () => abortController.abort();
  }, [reservation_id]);

  //////////// DATE & TIME VALIDATION /////////////

  function valiDate() {
    const reserveDate = new Date(formData.reservation_date);
    const reserveTime = formData.reservation_time;
    const todaysDate = Date.now();
    const dateAndTime = new Date(
      `${formData.reservation_date}T${formData.reservation_time}`
    );
    const foundErrors = [];

    if (reserveDate.getDay() === 1) {
      foundErrors.push(
        'Reservations cannot be made on a Tuesday (Restaurant is closed).'
      );
    }

    if (dateAndTime.getTime() < todaysDate) {
      foundErrors.push('Reservations cannot be made in the past.');
    }

    if (reserveTime.localeCompare('10:30') === -1) {
      foundErrors.push(
        'Reservation cannot be made: Restaurant is not open until 10:30AM.'
      );
    } else if (reserveTime.localeCompare('21:30') === 1) {
      foundErrors.push(
        'Reservation cannot be made: Restaurant is closed after 9:30PM.'
      );
    } else if (reserveTime.localeCompare('20:30') === 1) {
      foundErrors.push(
        'Reservation cannot be made: Reservation must be made before 8:30PM.'
      );
    }

    if (foundErrors.length) {
      setErrors(new Error(foundErrors.toString()));
      return false;
    }
    return true;
  }

  /////////// FORM ENTRY HANDLERS ////////////

  function handleChange({ target }) {
    setFormData({ ...formData, [target.name]: target.value });
  }

  const phoneNumberFormatter = ({ target }) => {
    const formattedInputValue = formatPhoneNumber(target.value);
    setFormData({
      ...formData,
      mobile_number: formattedInputValue,
    });
  };

  function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    setErrors(null);
    const validDate = valiDate();

    if (validDate) {
      if (edit) {
        editReservation(formData, reservation_id, abortController.signal)
          .then(() => {
            return loadDashboard();
          })
          .then(() =>
            history.push(`/dashboard?date=${formData.reservation_date}`)
          )
          .catch(setErrors);
      } else {
        createReservation(formData, abortController.signal)
          .then(loadDashboard)
          .then(() =>
            history.push(`/dashboard?date=${formData.reservation_date}`)
          )
          .catch(setErrors);
      }
    }
    return () => abortController.abort();
  }

  return (
    <>
      <h2 className="card-header mt-3 ml-3">New Reservation:</h2>
      <form onSubmit={handleSubmit}>
        <div class="form-row">
          <div class="col-md-6 mb-3">
            <ErrorAlert error={errors} />
            <label htmlFor="first_name" className="mt-3 mr-1">
              First Name:&nbsp;
            </label>
            <input
              name="first_name"
              id="first_name"
              type="text"
              placeholder="First Name"
              onChange={handleChange}
              value={formData.first_name}
              required
            />
          </div>
          <div class="col-md-6 mb-3">
            <label htmlFor="last_name" className="mt-3 ml-3">
              Last Name:&nbsp;
            </label>
            <input
              name="last_name"
              id="last_name"
              type="text"
              placeholder="Last Name"
              onChange={handleChange}
              value={formData.last_name}
              required
            />
          </div>
          <div class="form-row">
            <div class="col-md-6 mb-3">
              <label htmlFor="mobile_number" className="mt-3 mr-1">
                Mobile Number:&nbsp;
              </label>
              <input
                name="mobile_number"
                id="mobile_number"
                type="tel"
                placeholder="xxx-xxx-xxxx"
                onChange={phoneNumberFormatter}
                value={formData.mobile_number}
                required
              />
            </div>

            <div class="col-md-3 mb-3">
              <label htmlFor="reservation_date">Date:&nbsp;</label>
              <input
                name="reservation_date"
                id="reservation_date"
                type="date"
                className="form-control mb-2"
                placeholder="MM/DD/YYYY"
                pattern="\d{4}-\d{2}-\d{2}"
                onChange={handleChange}
                value={formData.reservation_date}
                required
              />
            </div>
            <div class="col-md-3 mb-3">
              <label htmlFor="reservation_time">Time:&nbsp;</label>
              <input
                name="reservation_time"
                id="reservation_time"
                type="time"
                placeholder="HH:MM"
                pattern="[0-9]{2}:[0-9]{2}"
                className="form-control mb-2"
                onChange={handleChange}
                value={formData.reservation_time}
                required
              />
            </div>
            <div class="col-md-3 mb-3">
              <label htmlFor="people">Guests:&nbsp;</label>
              <input
                name="people"
                id="people"
                type="number"
                min="1"
                max="25"
                className="m-3"
                onChange={handleChange}
                value={formData.people}
                required
              />
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-info mr-2 p-2">
          Submit
        </button>
        <button
          type="button"
          className="btn btn-danger p-2"
          onClick={history.goBack}
        >
          Cancel
        </button>
      </form>
    </>
  );
}
