import React from 'react';
import { today } from '../utils/date-time';
import useQuery from '../utils/useQuery';
import {
  deletePartyFromTable,
  listTables,
  listReservations,
} from '../utils/api';

export default function ListTables({ tables, setTables, setReservations }) {
  const query = useQuery();
  const date = query.get('date') || today();

  ///////////// FINISH TABLE ////////////

  function handleFinish({ table_id }) {
    const result = window.confirm(
      'Is this table ready to seat new guests? This cannot be undone.'
    );

    if (result) {
      deletePartyFromTable(table_id)
        .then(() => listTables())
        .then(setTables)
        .then(() => listReservations({ date }))
        .then(setReservations)
        .catch(console.log);
    }
  }

  if (tables) {
    return tables.map((table) => (
      <div className="d-flex justify-content-center row row-cols-1 row-cols-md-2 p-2">
        <div className="card border-dark mb-3" key={table.table_id}>
          <div className="card-header text-center">
            Table Name: {table.table_name}
          </div>
          <div className="card-body text-dark text-center">
            Capacity: {table.capacity}
          </div>
          <h5
            data-table-id-status={table.table_id}
            className={`card-text ${
              table.reservation_id
                ? 'card-body text-warning font-weight-bolder text-center p-1'
                : 'card-body text-success font-weight-bolder text-center p-1'
            }`}
          >
            {table.reservation_id ? 'Occupied' : 'Free'}
          </h5>
          {table.reservation_id ? (
            <button
              data-table-id-finish={table.table_id}
              className="btn btn-danger"
              name="confirm"
              onClick={(event) => {
                event.preventDefault();
                handleFinish(table);
              }}
            >
              Finish
            </button>
          ) : null}
        </div>
      </div>
    ));
  }
}
