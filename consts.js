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
	STATUS_COLOR,
	STATUS_COLOR_TEXT
};