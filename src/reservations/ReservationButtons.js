import React from 'react';
import { Link } from 'react-router-dom';

////////// RESERVATION BUTTON DESIGN ////////////

export default function ReservationButtons({
  status,
  reservation_id,
  cancelHandler,
}) {
  const handleCancel = (event) => {
    event.preventDefault();
    console.log('handle button clicked');

    const confirmBox = window.confirm(
      'Do you want to cancel this reservation? This cannot be undone.'
    );
    if (confirmBox === true) {
      cancelHandler(reservation_id);
    }
  };

  if (status === 'booked') {
    return (
      <div>
        <Link
          to={`/reservations/${reservation_id}/seat`}
          className="btn btn-info m-2"
        >
          Seat
        </Link>
        <Link
          to={`/reservations/${reservation_id}/edit`}
          className="btn btn-secondary m-2"
        >
          Edit
        </Link>
        <button
          className="btn btn-danger m-2"
          data-reservation-id-cancel={reservation_id}
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    );
  }
  return <div></div>;
}
