// =========================================
// CONFIG.JS — TOKEN SPLIT TEMPLATE (GENERIC)
// =========================================

// (Optional) Token split (kau isi sendiri kemudian)
const t1 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjMxNjg4ODUsImlzcyI6IlZSIiwiZXhwIjoxNzYzMjQ1ODAwLCJ3bXZlciI6Mywid21pZGZtdCI6ImFzY2lpIiwid21pZHR5cCI6MSwid21rZXl2ZXIiOjMsIndtdG1pZHZlciI6NCwid21pZGxlbiI6NTEyLCJ3";
const t2 = "bW9waWQiOjMyLCJ3bWlkIjoiMjY2NzkxYjEtZDk1Zi00MjI1LWE3YWQtZTM3YjJjNmE0YzdjIiwiZmlsdGVyIjoiKHR5cGU9PVwidmlkZW9cIiYmRGlzcGxheUhlaWdodDw9MjE2MCl8fCh0eXBlPT1cImF1ZGlvXCImJmZ";
const t3 = "vdXJDQyE9XCJhYy0zXCIpfHwodHlwZSE9XCJ2aWRlb1wiJiZ0eXBlIT1cImF1ZGlvXCIpIiwicGF0dGVybiI6IjEwMDQifQ.4NiEFpUrEc6MmEzpAWlmWGvdmcf41QrEIXGSdThdDc0";

// Combine token
self.SOOKA_TOKEN = t1 + t2 + t3;

// Note:
// - Token ini bukan ClearKey.
// - ClearKey masuk dalam index.html sahaja.
