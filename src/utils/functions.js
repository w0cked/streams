const { express, axios, JSDOM } = require("../utils/modules.js");

class CustomError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
		Error.captureStackTrace(this, this.constructor);
	}
}

async function getAccessToken() {
	try {
		const url =
			"https://accounts.spotify.com/oauth2/v2/auth?response_type=code&client_id=6cf79a93be894c2086b8cbf737e0796b&scope=user-read-email+user-read-private+ugc-image-upload&redirect_uri=https%3A%2F%2Fartists.spotify.com&code_challenge=TGLwA-16HUBjMtcD9DSsv-sAgtYeGPC3Fehg77Sv_JE&code_challenge_method=S256&state=tQZ3OgDtvOzZcF0vIoFyADlT%7EKkRCLud&response_mode=web_message&prompt=none&acr_values=urn%3Aspotify%3Asso%3Aacr%3Aartist%3A2fa";
		const headers = {
			Host: "accounts.spotify.com",
			Connection: "keep-alive",
			Cookie:
				"sp_t=02767eb5ca1a70a5e8d444fadb389980; __Host-device_id=AQBtIHzn-jC5roWdcZDvMBvgnTXGBbjsPwOSqI6v1f6xzbt7ZKHsRs3k5uUBaRcFBQfEYzrBQBCL3gkw8406rV-nQCP-aqyDiZ0; sp_m=us; sp_dc=AQCr68tbtZnJuwe0MwykOlWdQ_H-s-rvIKrsfJUEvt9ur8b4z7MFo8YwhpPWlQAE4zsjbTdY5qqV_oETDsZAd8ZJla3Ll3f6CHYPg9obyHxJIkfdZwsPgB9zHvWOmbT0DbcNQPU8yHneSLQSL_nptgl2wvnb5rOX; sp_key=57572b6f-fb2d-4ec9-8760-1e2b9cede744; sp_gaid=0088fcebb663ac6bf93ae159d5a6f254217c5f215e8dabd56f341d; OptanonAlertBoxClosed=2024-06-23T05:27:38.920Z; sp_last_utm=%7B%22utm_campaign%22%3A%22your_account%22%2C%22utm_medium%22%3A%22menu%22%2C%22utm_source%22%3A%22spotify%22%7D; _ga=GA1.2.129430648.1719344397; OptanonConsent=isGpcEnabled=0&datestamp=Thu+Jun+27+2024+14%3A22%3A08+GMT-0700+(Pacific+Daylight+Time)&version=202405.2.0&browserGpcFlag=1&isIABGlobal=false&hosts=&landingPath=NotLandingPage&groups=t00%3A0%2Ci00%3A0%2Cs00%3A1%2Cf00%3A1%2Cm00%3A1%2Cf11%3A1%2Cm03%3A1&AwaitingReconsent=false&geolocation=MX%3BJAL; sp_tr=true; csrf_token=AQCVFa-qAlVixegJhmR6iS3opyiUu4hZwjUm2HZ2ZqFL4ICelU9phkU1hieKropJdlw6GJaXmC8mPp0W",
		};

		const response = await axios.get(url, { headers });
		const dom = new JSDOM(response.data);
		const scriptContent =
			dom.window.document.querySelector("script").textContent;

		const codeRegex = /"code":\s*"([^"]+)"/;
		const match = scriptContent.match(codeRegex);

		if (match && match[1]) {
			const authorizationCode = match[1];
			const postData = {
				grant_type: "authorization_code",
				client_id: "6cf79a93be894c2086b8cbf737e0796b",
				code: authorizationCode,
				redirect_uri: "https://artists.spotify.com",
				code_verifier:
					"HIRei8NQJAOY0EZ94WT44LkW58cR-CVye_ZuFpmuFbLoiToxvDrsnmO3meG~e3fdLbphYMZZdf4qxe6~P0keO_cN7RmFi2-Bp7Ev~qOLgq-liQV9E3SUEljWDSIMuQpx",
			};

			const tokenResponse = await axios.post(
				"https://accounts.spotify.com/api/token",
				new URLSearchParams(postData),
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
					},
				}
			);

			return tokenResponse.data.access_token;
		} else {
			throw new Error("Authorization code not found in HTML.");
		}
	} catch (error) {
		throw new Error("Error fetching or processing the response:", error);
	}
}

module.exports = {
	CustomError,
	getAccessToken,
};
