addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

async function handleRequest(event) {
  try {
    // First request - login to get access token
    const loginResponse = await fetch("https://api.vr.ctrp.sooka.my/login/pub/auth/v1/login", {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Referer': 'https://sooka.my/',
        'Content-Type': 'application/json',
        'tenant_identifier': 'master',
        'language': 'eng',
        'device_id': '481e843c-b132-4ead-90ee-24a8528721f6',
        'environmentCode': 'MAIN',
        'x-api-key': '67d8bdf60d57',
        'local': 'MYS',
        'platform': 'WEB',
        'requestCount': '1',
        'device_details': '{"platform":"WEB","operating_system":"Windows","locale":"en-US","app_version":"web-prod-v0.0.65","device_name":"Firefox 139.0","browser_version":139,"browser_name":"Firefox","device_id":"481e843c-b132-4ead-90ee-24a8528721f6","device_type":"open","device_platform":"WEB","device_category":"large","manufacturer":"Windows_Firefox_139","model":"PC","sname":"undefined undefined","last_usage":0}',
        'languageCode': 'eng',
        'Origin': 'https://sooka.my',
        'DNT': '1',
        'Sec-GPC': '1',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'Priority': 'u=0',
        'TE': 'trailers'
      },
      body: JSON.stringify({
        email: "rybowa2168@getmule.com",
        password: "Password1"
      })
    })

    const loginData = await loginResponse.json()
    if (!loginData.status || !loginData.data?.accessToken || !loginData.data?.userDetails?.customerId) {
      return new Response('Failed to get access token', { status: 500 })
    }

    const accessToken = loginData.data.accessToken
    const customerId = loginData.data.userDetails.customerId

    // Second request - get the final token
    const tokenResponse = await fetch("https://api.vr.ctrp.sooka.my/token-generator/v2/uwm", {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Referer': 'https://sooka.my/',
        'Content-Type': 'application/json',
        'tenant_identifier': 'master',
        'language': 'eng',
        'device_id': '481e843c-b132-4ead-90ee-24a8528721f6',
        'environmentCode': 'MAIN',
        'x-api-key': '67d8bdf60d57',
        'local': 'MYS',
        'platform': 'WEB',
        'requestCount': '1',
        'languageCode': 'eng',
        'Authorization': `Bearer ${accessToken}`,
        'cp_id': customerId,
        'Origin': 'https://sooka.my',
        'DNT': '1',
        'Sec-GPC': '1',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'TE': 'trailers'
      },
      body: JSON.stringify({
        type: 0,
        cdnList: [],
        isWMAuthEnabled: false,
        isCDNAuthEnabled: true,
        laContentId: "0",
        subscriberId: customerId,
        action: "stream",
        contentType: "linear",
        deviceType: "WEB",
        entitlementList: ["SVOD004"],
        intersection: ["SVOD004"],
        contentId: "0"
      })
    })

    const tokenData = await tokenResponse.json()
    if (tokenData.code !== 0 || !tokenData.data?.token) {
      return new Response('Failed to get final token', { status: 500 })
    }

    // Return just the final token
    return new Response(tokenData.data.token, {
      headers: { 'Content-Type': 'text/plain' }
    })

  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 })
  }
}