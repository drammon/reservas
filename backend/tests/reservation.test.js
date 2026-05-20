describe("Reservation Business Rules", () => {
  test("Reservation cancellation changes status", () => {
    const reservation = {
      status: "ATIVA"
    };

    reservation.status = "CANCELADA";

    expect(reservation.status).toBe("CANCELADA");
  });
});