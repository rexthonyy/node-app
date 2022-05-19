const DB = {
    branch: "branch",
    branch_translation: "branch_translation",
    service_category: "service_category",
    service_category_translation: "service_category_translation",
    service_category_group: "service_category_group",
    service_category_group_translation: "service_category_group_translation",
    service: "service",
    service_translation: "service_translation",
    service_provider: "service_provider",
    suggested_service: "suggested_service",
    page_translations: "page_translations"
};

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
    DB,
    STATUS_COLOR,
	STATUS_COLOR_TEXT
}