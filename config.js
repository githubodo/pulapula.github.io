// config.js (put at root)
// >>> BRO: isi token kau di sini. Split/obfuscate if you want.
// Example pattern: pieces combined into self.SOOKA_TOKEN

const p1 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.";
const p2 = "eyJpYXQiOjE3NjMxMzA0NTQsImlzcyI6IlZSIiwiZXhwIjoxNzYzMTU5NDAwLCJ3bXZlciI6Mywid21pZGZtdCI6ImFzY2lpIiwid21pZHR5cCI6MSwid21rZXl2ZXIiOjMsIndtdG1pZHZlciI6NCwid21pZGxlbiI6NTEyLCJ3bW9waWQiOjMyLCJ3bWlkIjoiMjY2NzkxYjEtZDk1Zi00MjI1LWE3YWQtZTM3YjJjNmE0YzdjIiwiZmlsdGVyIjoiKHR5cGU9PVwidmlkZW9cIiYmRGlzcGxheUhlaWdodDw9MjE2MCl8fCh0eXBlPT1cImF1ZGlvXCImJmZvdXJDQyE9XCJhYy0zXCIpfHwodHlwZSE9XCJ2aWRlb1wiJiZ0eXBlIT1cImF1ZGlvXCIpIiwicGF0dGVybiI6IjUwOTkifQ.ZJlMpwDSmxhjTIcHUsgSW6DwzJtW5-4Xp42Dx5ZsJVo";
// ... add more parts if you want
self.SOOKA_TOKEN = (p1 + p2); // <<< BRO: replace with your real token parts

// Note: This file is loaded by the service worker via importScripts('/config.js')
// Keep it at site root (https://www.tvmalaysia.live/config.js)
