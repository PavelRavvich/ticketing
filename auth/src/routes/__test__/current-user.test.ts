import request from "supertest";
import { app } from "../../app";
import { signIn } from "../../test/setup";

it("responds with details about the current user", async () => {
  const cookie: string[] = await signIn();
  const response = await request(app)
    .get("/api/users/currentUser")
    .set("Cookie", cookie)
    .send({})
    .expect(200);

    expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentUser")
    .send({})
    .expect(200);

    expect(response.body.currentUser).toEqual(null);
});
