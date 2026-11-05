import { getStore } from "@netlify/blobs";

const PRIZES = {
  "be36cb56adc90ebde623dd3a": "₹500 BUMPER PRIZE",
  "5fde3469ba76e930a4405ed4": "₹75",
  "1b0cd084cebb2d6df9633a41": "₹75",
  "88229ab99de81787031fa794": "₹75",
  "eb22d769685667990bb88b84": "₹75",
  "d9167e86bf87c97736e30407": "₹50",
  "1d3aef410fb4ae825ea9af41": "₹50",
  "a853cb8f8c922854e45c494a": "₹50",
  "49facf7af27ca1bdfcc58abc": "₹50",
  "ee0e097c17f6410c0d2d74be": "₹50",
  "0cfb2a65edcfd6238a98b63f": "₹30",
  "95955b0c0e09ae0d05689707": "₹30",
  "0d12442c285578fc5f862adb": "₹30",
  "bc039b433943722288d38bfe": "₹30",
  "9ffc5391597373bf0c7d2b18": "₹30",
  "f2f013c892f0da1ee3d529b6": "₹20",
  "238bbccfb2e95d2989f5d5f4": "₹20",
  "1e1bb555441a266b242fc39d": "₹20",
  "4c62ca350bc62fc2f779f51a": "₹20",
  "c46725a39372fe32da231aa8": "₹20",
  "bad45fc0d0e4f809561328b5": "₹20",
  "84fe7d5541484b751adf142e": "₹10",
  "67a3a755375fc043a0c25687": "₹10",
  "926b4e7ce61ea7a988709c79": "₹10",
  "99d0cd46a72be34332c1bbc0": "₹10",
  "0d2195c78201cb22c941c34c": "₹10",
  "13db75b98a78a060d8b75e63": "₹10",
  "d138f8a8864862dfbce20c96": "BETTER LUCK NEXT TIME",
  "a01d931dbce5fe4702da6ab6": "BETTER LUCK NEXT TIME",
  "36b79081df597c7231db17a8": "BETTER LUCK NEXT TIME"
};

export default async (request) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { "Content-Type": "application/json" }
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400, headers: { "Content-Type": "application/json" }
    });
  }

  const token = String(body.token || "");
  const prize = PRIZES[token];
  if (!prize) {
    return new Response(JSON.stringify({ error: "Invalid QR code" }), {
      status: 404, headers: { "Content-Type": "application/json" }
    });
  }

  // A conditional write ensures only the first successful claim wins.
  const store = getStore("gurukul-scratch-claims");
  const { modified } = await store.set(`claimed-${token}`, new Date().toISOString(), {
    onlyIfNew: true
  });

  if (!modified) {
    return new Response(JSON.stringify({ error: "This QR code has already been used." }), {
      status: 409, headers: { "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify({ prize }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
  });
};
