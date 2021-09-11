import React, { useEffect, useState } from 'react';

import NotFound from './NotFound';
import useQuery from '../utils/useQuery';
import NewTable from '../tables/NewTable';
import { today } from '../utils/date-time';
import Search from '../reservations/Search';
import Dashboard from '../dashboard/Dashboard';
import { Redirect, Route, Switch } from 'react-router-dom';
import NewReservation from '../reservations/NewReservation';
import SeatReservation from '../reservations/SeatReservation';
import {
  listReservations,
  listTables,
  updateReservationStatus,
} from '../utils/api';

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */

function Routes() {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = [];

  const query = useQuery();
  const date = query.get('date') ? query.get('date') : today();

  useEffect(loadDashboard, [date]);

  ////////// MAIN DASHBOARD RENDERING FUNCTION //////////

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables()
      .then((existingTables) => {
        const updatedExistingTables = existingTables.map((table) => {
          return { ...table };
        });
        return updatedExistingTables;
      })
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  ////////////// STATUS ////////////////

  function cancelHandler(reservation_id) {
    const abortController = new AbortController();

    updateReservationStatus(reservation_id, 'cancelled', abortController.status)
      .then(() => {
        return loadDashboard();
      })
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={'/dashboard'} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={'/dashboard'} />
      </Route>

      {/* CREATE RESERVATION */}

      <Route exact={true} path="/reservations/new">
        <NewReservation
          setReservations={setReservations}
          loadDashboard={loadDashboard}
        />
      </Route>

      {/* EDIT RESERVATION */}

      <Route exact={true} path="/reservations/:reservation_id/edit">
        <NewReservation
          setReservations={setReservations}
          edit={true}
          loadDashboard={loadDashboard}
          reservations={reservations}
        />
      </Route>

      {/* CREATE TABLE */}

      <Route exact={true} path="/tables/new">
        <NewTable tables={tables} setTables={setTables} />
      </Route>

      {/* HOME PAGE RENDERING ORIGIN */}

      <Route exact={true} path="/dashboard">
        <Dashboard
          cancelHandler={cancelHandler}
          date={date}
          reservations={reservations}
          setReservations={setReservations}
          reservationsError={reservationsError}
          tables={tables}
          setTables={setTables}
          tablesError={tablesError}
          setTablesError={setTablesError}
        />
      </Route>

      {/* STATUS CHANGE */}

      <Route exact={true} path={`/reservations/:reservation_id/seat`}>
        <SeatReservation
          tables={tables}
          setTables={setTables}
          setReservations={setReservations}
        />
      </Route>

      {/* SEARCH */}

      <Route exact={true} path={`/search`}>
        <Search reservations={reservations} setReservations={setReservations} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
