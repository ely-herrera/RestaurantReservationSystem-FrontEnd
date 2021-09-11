import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ErrorAlert from '../layout/ErrorAlert';
import { updateTable, listTables, listReservations } from '../utils/api';
import { today } from '../utils/date-time';

export default function SeatReservation({
  tables,
  setTables,
  setReservations,
}) {
  const history = useHistory();
  const { reservation_id } = useParams();

  const [errors, setErrors] = useState(null);
  const [tableId, setTableId] = useState(null);

  const foundErrors = [];

  const handleChange = (event) => {
    const { value } = event.target;
    return value ? setTableId(value) : setTableId(null);
  };

  function validateSeat() {
    if (!tableId) {
      foundErrors.push('Table does not exist.');
    }
    if (!reservation_id) {
      foundErrors.push('Reservation does not exist.');
    }

    if (tableId.reservation_id) {
      foundErrors.push('Table selected is occupied.');
    }

    if (tableId.capacity < reservation_id.people) {
      foundErrors.push('Table selected cannot seat number of people.');
    }

    if (foundErrors) {
      setErrors(new Error(foundErrors.toString()));
      return false;
    }
    return true;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors(null);

    if (validateSeat) {
      updateTable(tableId, reservation_id)
        .then(() => listTables())
        .then(setTables)
        .then(() => listReservations({ date: today() }))
        .then(setReservations)
        .then(() => history.push('/dashboard'))
        .catch(setErrors);
    }
  }

  if (tables) {
    return (
      <div>
        <ErrorAlert error={errors} />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="select_table"></label>
            <select
              onChange={handleChange}
              className="form-control"
              id="select_table"
              name="table_id"
            >
              <option key={0} value={0}>
                --- Please select an option ---
              </option>
              {tables.map((table, index) => {
                return (
                  <option key={index} value={table.table_id}>
                    {table.table_name} - {table.capacity}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <button className="btn btn-secondary m-2" type="submit">
              Submit
            </button>
            <button onClick={() => history.goBack()} className="btn btn-danger">
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }
}
