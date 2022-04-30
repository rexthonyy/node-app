// local machine
//const LOCAL_URL = "http://localhost";
const LOCAL_URL = "http://77.68.102.60";

// helpy credentials
const ROOT = "http://77.68.102.60";
const TOKEN = "4ff0a08a8df91d876cdfc5842d1aa058";

const KRATOS_ROOT = "http://88.208.199.170";

// reaction commerce api end point
const GRAPHQL_REACTION_COMMERCE_API_ENDPOINT = "http://77.68.102.61:3000/graphql";
const reactionCommerceAuthorization = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InRva2VuIjoiNzIzMzVhYzU4YWI2ZjQyNTA0Y2ZmMGI3MzBlYjA1NmNhMzhkOTI0ODExMzIzNTA2Y2NhYzNlNmRmZDQ0OWI4NDY2MGRkMzA5NGNiOTJmY2QyNmI0MDQiLCJpc0ltcGVyc29uYXRlZCI6ZmFsc2UsInVzZXJJZCI6IjYxZjkyNWRjNjM3YmRhMDkyZWVkY2QyNyJ9LCJpYXQiOjE2NDM3MjEyMjYsImV4cCI6MTY0MzcyNjYyNn0.zH3eq_QLbUY9jiAM6pzmDkwpitAlr_9yafnhiC-q0GE';

// cookie id
const COOKIE_ID = "nodeAppCookie";

// roles
const roles = {
	role1: [
		"carpentar"
	],
	role2: [

	]
};

const POSTGRES_USER = "knowledgebase";
const POSTGRES_PASSWORD = "abc%8d_a10";
const POSTGRES_PORT = 5432;
const POSTGRES_HOST = "localhost";

const KETO_WRITE_PORT = 4467;
const KETO_READ_PORT = 4466;

const KETO_NAMESPACE = "zammad";

const STATUS_COLOR = {
	pending_action: "red",
	draft: "orange",
	publish_scheduled: "#0095e0",
	published: "green",
	update_scheduled: "white",
	archive_scheduled: "yellow",
	archived: "gray"
};

const STATUS_COLOR_TEXT = {
	red: "Pending Action",
	orange: "Draft",
	"#0095e0": "Publish Scheduled",
	green: "Published",
	white: "Update Scheduled",
	yellow: "Archive Scheduled",
	gray: "Archived"
};

module.exports = {
	LOCAL_URL,
	ROOT,
	TOKEN,
	KRATOS_ROOT,
	GRAPHQL_REACTION_COMMERCE_API_ENDPOINT,
	reactionCommerceAuthorization,
	COOKIE_ID,
	roles,
	POSTGRES_USER,
	POSTGRES_PASSWORD,
	POSTGRES_PORT,
	POSTGRES_HOST,
	KETO_WRITE_PORT,
	KETO_READ_PORT,
	KETO_NAMESPACE,
	STATUS_COLOR,
	STATUS_COLOR_TEXT
};