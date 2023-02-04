const dayjs = require("dayjs")
const relativeTime = require("dayjs/plugin/relativeTime")
dayjs.extend(relativeTime)

module.exports = {
	currentYear: () => dayjs().year(),
	relativeTimeFromNow: a => dayjs(a).fromNow(),
	ifCond: function (a, b, options) {
		return a === b ? options.fn(this) : options.inverse(this)
	},
	normalTimeForm: a => dayjs(a).format("A h:m YYYY年MM月DD日")
}
