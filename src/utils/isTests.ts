export default function isTests() {
  return process.env.NODE_ENV === "test";
}
