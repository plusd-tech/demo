const { promisify } = require("util");

module.exports.attemptUnsuccessfulTransaction = async fn => {
	try {
		await fn();
	} catch (err) {
		return err;
	}
};

module.exports.getEventsForTransaction = async (fn, event) => {
	const stream = event();
	const getEvents = promisify(stream.get.bind(stream));

	const eventsBefore = await getEvents();
	await fn();
	const eventsAfter = await getEvents();

	return [eventsBefore, eventsAfter];
};

module.exports.normaliseBytes32 = str =>
	web3.toHex(`${str}${Buffer.alloc(32 - str.length)}`);
