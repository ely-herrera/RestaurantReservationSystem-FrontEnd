import React from 'react';
import ReservationButtons from './ReservationButtons';

export default function ListReservations({ cancelHandler, reservations }) {
  if (reservations) {
    const filteredReservations = reservations.filter(
      (reservation) =>
        reservation.status !== 'finished' && reservation.status !== 'cancelled'
    );

    return filteredReservations.map((reservation) => {
      return (
        <div key={reservation.reservation_id}>
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">
                Reservation for: {reservation.first_name}{' '}
                {reservation.last_name}
              </h4>
              <h5
                className="card-subtitle my-2 text-muted font-italic"
                data-reservation-id-status={reservation.reservation_id}
              >
                Status: {reservation.status}
              </h5>
              <ul class="list-group list-group-flush">
                <li className="list-group-item font-weight-lighter">
                  Phone: {reservation.mobile_number}
                </li>
                <li className="list-group-item font-weight-lighter">
                  Date: {reservation.reservation_date}
                </li>
                <li className="list-group-item font-weight-lighter">
                  Time: {reservation.reservation_time}
                </li>
                <li className="list-group-item font-weight-lighter">
                  Party Size: {reservation.people}
                </li>
              </ul>
            </div>
            <div>
              <ReservationButtons
                status={reservation.status}
                reservation_id={reservation.reservation_id}
                cancelHandler={cancelHandler}
              />
            </div>
          </div>
        </div>
      );
    });
  }
}
