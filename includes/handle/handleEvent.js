module.exports = function ({ api, models, Users, Threads, Currencies }) {
    const logger = require("../../utils/log.js");
    const moment = require("moment");

    return function ({ event }) {
        const timeStart = Date.now();
        const time = moment.tz("Asia/Ho_Chi_minh").format("HH:mm:ss L");
        const { userBanned, threadBanned } = global.data;
        const { events } = global.client;
        const { allowInbox, DeveloperMode } = global.config;
        let { senderID, threadID } = event;
        senderID = String(senderID);
        threadID = String(threadID);

        // Chặn nếu người dùng hoặc nhóm bị ban
        if (userBanned.has(senderID) || threadBanned.has(threadID)) return;

        // ✔ Cho phép inbox riêng nếu allowInbox = true
        if (!allowInbox && senderID == threadID) return;

        for (const [key, value] of events.entries()) {
            if (value.config.eventType.indexOf(event.logMessageType) !== -1) {
                const eventRun = events.get(key);
                try {
                    const Obj = {
                        api,
                        event,
                        models,
                        Users,
                        Threads,
                        Currencies
                    };
                    eventRun.run(Obj);

                    if (DeveloperMode) {
                        logger(
                            global.getText(
                                'handleEvent',
                                'executeEvent',
                                time,
                                eventRun.config.name,
                                threadID,
                                Date.now() - timeStart
                            ),
                            '[ Event ]'
                        );
                    }
                } catch (error) {
                    logger(
                        global.getText('handleEvent', 'eventError', eventRun.config.name, JSON.stringify(error)),
                        "error"
                    );
                }
            }
        }

        return;
    };
};
