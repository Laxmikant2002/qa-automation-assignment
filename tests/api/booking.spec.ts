import { APIRequestContext, expect, test } from '@playwright/test';

const baseUrl = 'https://restful-booker.herokuapp.com';

interface BookingPayload {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: {
    checkin: string;
    checkout: string;
  };
  additionalneeds: string;
}

function uniqueSuffix(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function bookingPayload(): BookingPayload {
  const suffix = uniqueSuffix();
  return {
    firstname: `User${suffix}`,
    lastname: `Tester${suffix}`,
    totalprice: 250,
    depositpaid: true,
    bookingdates: {
      checkin: '2027-01-10',
      checkout: '2027-01-15',
    },
    additionalneeds: 'Breakfast',
  };
}

async function getToken(request: APIRequestContext): Promise<string> {
  const response = await request.post(`${baseUrl}/auth`, {
    data: {
      username: 'admin',
      password: 'password123',
    },
  });
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.token).toBeTruthy();
  return body.token;
}

async function createBooking(
  request: APIRequestContext,
  payload: BookingPayload = bookingPayload(),
): Promise<{ bookingId: number; payload: BookingPayload }> {
  const response = await request.post(`${baseUrl}/booking`, { data: payload });
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.bookingid).toEqual(expect.any(Number));
  expect(body.booking).toEqual(payload);
  return { bookingId: body.bookingid, payload };
}

test.describe('Restful-Booker API', () => {
  test('health check returns 201 Created', async ({ request }) => {
    const response = await request.get(`${baseUrl}/ping`);
    expect(response.status()).toBe(201);
  });

  test('auth with valid credentials returns a token', async ({ request }) => {
    await getToken(request);
  });

  test('auth with wrong password returns Bad credentials', async ({ request }) => {
    const response = await request.post(`${baseUrl}/auth`, {
      data: {
        username: 'admin',
        password: 'incorrect-password',
      },
    });

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ reason: 'Bad credentials' });
  });

  test('create booking succeeds with a valid payload', async ({ request }) => {
    const payload = bookingPayload();
    await createBooking(request, payload);
  });

  test('create booking rejects a missing firstname', async ({ request }) => {
    const payload = bookingPayload();
    const response = await request.post(`${baseUrl}/booking`, {
      data: {
        lastname: payload.lastname,
        totalprice: payload.totalprice,
        depositpaid: payload.depositpaid,
        bookingdates: payload.bookingdates,
        additionalneeds: payload.additionalneeds,
      },
    });

    expect(response.status()).not.toBe(200);
  });

  test('read booking returns the created booking', async ({ request }) => {
    const created = await createBooking(request);
    const response = await request.get(`${baseUrl}/booking/${created.bookingId}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstname).toBe(created.payload.firstname);
    expect(body.lastname).toBe(created.payload.lastname);
    expect(body.totalprice).toBe(created.payload.totalprice);
    expect(body.bookingdates).toEqual(created.payload.bookingdates);
  });

  test('read booking for an unknown id returns 404', async ({ request }) => {
    const response = await request.get(`${baseUrl}/booking/99999999`);
    expect(response.status()).toBe(404);
  });

  test('update booking fully succeeds with a valid token', async ({ request }) => {
    const created = await createBooking(request);
    const token = await getToken(request);
    const updated = bookingPayload();

    const response = await request.put(`${baseUrl}/booking/${created.bookingId}`, {
      headers: { Cookie: `token=${token}` },
      data: updated,
    });

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(updated);
  });

  test('partial update succeeds with a valid token', async ({ request }) => {
    const created = await createBooking(request);
    const token = await getToken(request);
    const patch = {
      firstname: `Patched${uniqueSuffix()}`,
      totalprice: 999,
    };

    const response = await request.patch(`${baseUrl}/booking/${created.bookingId}`, {
      headers: { Cookie: `token=${token}` },
      data: patch,
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstname).toBe(patch.firstname);
    expect(body.totalprice).toBe(patch.totalprice);
  });

  test('update booking without auth returns 403', async ({ request }) => {
    const created = await createBooking(request);
    const response = await request.put(`${baseUrl}/booking/${created.bookingId}`, {
      data: bookingPayload(),
    });

    expect(response.status()).toBe(403);
  });

  test('delete booking succeeds and a second delete is rejected', async ({ request }) => {
    const created = await createBooking(request);
    const token = await getToken(request);

    const deleteResponse = await request.delete(`${baseUrl}/booking/${created.bookingId}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect(deleteResponse.status()).toBe(201);

    const getResponse = await request.get(`${baseUrl}/booking/${created.bookingId}`);
    expect(getResponse.status()).toBe(404);

    const secondDelete = await request.delete(`${baseUrl}/booking/${created.bookingId}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect([403, 405]).toContain(secondDelete.status());
  });
});
