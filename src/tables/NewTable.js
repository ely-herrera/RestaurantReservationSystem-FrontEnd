import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ErrorAlert from '../layout/ErrorAlert';
import { createTable } from '../utils/api';
import { today } from '../utils/date-time';

export default function NewTable({ tables, setTables }) {
  const history = useHistory();
  const todaysDate = today();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    // initial (default) data
    table_name: '',
    capacity: 0,
  });

  ////////// VALIDATE FIELDS ///////////

  function validateFields() {
    let foundError = '';

    if (formData.table_name === '' || formData.capacity === '') {
      foundError += 'Please fill out all fields.';
    } else {
      if (formData.table_name.length < 2) {
        foundError += 'Table name must be at least 2 characters.';
      }
      if (formData.capacity < 1 || !formData.capacity) {
        foundError += 'Table capacity must be at least 1.';
      }
    }

    if (foundError.length) {
      setError(new Error(foundError));
      return false;
    }
    return true;
  }

  function handleChange({ target }) {
    setFormData({ ...formData, [target.name]: target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    setError(null);
    if (validateFields()) {
      createTable(formData, abortController.signal)
        .then((returnedTable) =>
          setTables([...tables, { ...returnedTable, status: 'free' }])
        )
        .then(() => history.push(`/dashboard?date=${todaysDate}`))
        .catch(setError);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="card-header mt-3 ml-3">New Table:</h2>

      {error ? <ErrorAlert error={error} /> : ''}

      <label htmlFor="table_name" className="mr-1">
        Table Name:&nbsp;
      </label>
      <input
        name="table_name"
        id="table_name"
        type="text"
        minLength="2"
        onChange={handleChange}
        value={formData.table_name}
        required
      />

      <label htmlFor="capacity" className="my-4 ml-2 mr-1">
        Capacity:&nbsp;
      </label>
      <input
        name="capacity"
        id="capacity"
        type="number"
        min="1"
        onChange={handleChange}
        value={formData.capacity}
        required
      />
      <br />

      <button type="submit" className="btn btn-info m-2 p-2">
        Submit
      </button>
      <button className="btn btn-danger p-2" onClick={history.goBack}>
        Cancel
      </button>
    </form>
  );
}
