describe("Customer Business Rules", () => {
  test("Customer with active reservation cannot be deleted", () => {
    const reservations = [
      { status: "ATIVA" }
    ];

    const canDelete = reservations.every(
      reservation => reservation.status === "CANCELADA"
    );

    expect(canDelete).toBe(false);
  });

  test("Customer with cancelled reservations can be deleted", () => {
    const reservations = [
      { status: "CANCELADA" }
    ];

    const canDelete = reservations.every(
      reservation => reservation.status === "CANCELADA"
    );

    expect(canDelete).toBe(true);
  });
});