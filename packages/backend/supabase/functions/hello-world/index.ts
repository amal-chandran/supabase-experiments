// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { add } from "@supabase-start/math";

console.log("Hello from Functions!");

Deno.serve(async (req) => {
  const data = {
    message: `Hello World!`,
    result: add(1, 2),
  };

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  );
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:65321/functions/v1/hello-world' \
    --header 'Authorization: Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6IjU2NGUzNDBiLTk4ODYtNGUzMC1iZTYxLTJhNGZhYjNjYTg3YSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjIwNzgwMzk4Mjh9.Yhx9oEm4N8elfKNtUgnj_4b-NCqX1H8nErhqbNPS-xMf4DtpQGADlFZgt97bByjM7UDAE5fbWhI3YCowud6HvQ' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
