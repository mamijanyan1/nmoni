import { assertEquals, assertExists } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { getRandomJoke, getJokeByCategory } from "../services/jokeService.ts";

Deno.test("Get random joke", async () => {
  const joke = await getRandomJoke();
  assertExists(joke);
  assertExists(joke.category);
  assertEquals(joke.type, "single" || "twopart");
});

Deno.test("Get programming joke", async () => {
  const joke = await getJokeByCategory("programming");
  assertExists(joke);
  assertEquals(joke.category, "programming");
});

Deno.test("Get knock-knock joke", async () => {
  const joke = await getJokeByCategory("knock-knock");
  assertExists(joke);
  assertEquals(joke.category, "knock-knock");
});
