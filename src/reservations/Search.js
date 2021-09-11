import React, { useState } from 'react';
import { listReservationsForPhoneNumber } from '../utils/api';
import ListReservations from './ListReservations'; // USED TO POPULATE RESULTS FROM SEARCH

export default function Search() {
  const [list, setList] = useState([]);
  const [mobileNumber, setMobileNumber] = useState('');
  const [errors, setErrors] = useState(null);
  const [found, setFound] = useState(false);

  function handleChange({ target }) {
    setMobileNumber(target.value);
  }

  function handleSearch(event) {
    event.preventDefault();
    setFound(false);
    setErrors(null);
    listReservationsForPhoneNumber(mobileNumber)
      .then(setList)
      .then(() => setFound(true))
      .catch(setErrors);
  }

  return (
    <div>
      <h2 className="card-header mt-3 ml-3">Search</h2>
      <form name="reservation" onSubmit={handleSearch}>
        <input
          className="m-3 w-50 "
          type="text"
          name="mobile_number"
          placeholder="Enter customer's phone number"
          onChange={handleChange}
          value={mobileNumber}
        ></input>
      </form>
      <button type="submit" className="btn btn-info ml-3 mt-1 p-2 w-25">
        Find
      </button>
      {list.length ? (
        <div>
          <ListReservations reservations={list} />
        </div>
      ) : (
        found && <div>No reservations found</div>
      )}
    </div>
  );
}
