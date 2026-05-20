describe("Table Business Rules", () => {
  test("Table with active reservation cannot be deleted", () => {
    const reservations = [
      { status: "ATIVA" }
    ];

    const canDelete = reservations.every(
      reservation => reservation.status === "CANCELADA"
    );

    expect(canDelete).toBe(false);
  });
});