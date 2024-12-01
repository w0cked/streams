const { express, axios } = require("../../utils/modules.js");

const router = express.Router();

const { attachAccessToken } = require("../../utils/middleware.js");

const uriRegex = /^spotify:track:(\w+)$/;

router.use(attachAccessToken);

router.get("/streams", async (req, res) => {
	const uri = req.query.uri;

	if (!uri) {
		return res.status(400).json({ error: "Missing Spotify track URI" });
	}

	const match = uri.match(uriRegex);
	if (!match) {
		return res.status(400).json({ error: "Invalid Spotify track URI format" });
	}

	const trackId = match[1];
	const apiUrl = `https://generic.wg.spotify.com/song-stats-view/v2/artist/6aTrpVYnW8QL0RDgxDt8lN/recording/${trackId}/info`;

	try {
		const response = await axios.get(apiUrl, {
			headers: {
				Authorization: `Bearer ${req.token}`,
			},
		});

		const { total_stream_count } = response.data;
		res.json({ total_stream_count });
	} catch (error) {
		console.error("Error fetching song stats:", error);
		res.status(500).json({ error: "Failed to fetch song stats" });
	}
});

module.exports = router;