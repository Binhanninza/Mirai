module.exports = {
  config: {
    name: "ketnot",
    version: "1.0",
    hasPermssion: 0,
    credits: "M",
    description: "Gửi tin nhắn ẩn danh đến UID",
    commandCategory: "Tiện ích",
    usages: "",
    cooldowns: 5,
  },

  run: async ({ api, event }) => {
    return api.sendMessage("📩 Nhập UID người nhận:", event.threadID, (err, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: event.senderID,
        type: "askUID"
      });
    });
  },

  handleReply: async ({ api, event, handleReply }) => {
    if (event.senderID != handleReply.author) return;

    switch (handleReply.type) {
      case "askUID": {
        return api.sendMessage("✉️ Nhập nội dung muốn gửi:", event.threadID, (err, info) => {
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "askMessage",
            uid: event.body
          });
        });
      }

      case "askMessage": {
        try {
          await api.sendMessage(
            `📨 Bạn đã nhận được 1 tin nhắn ẩn danh:\n\n"${event.body}"`,
            handleReply.uid
          );
          return api.sendMessage("✅ Tin nhắn đã được gửi ẩn danh!", event.threadID);
        } catch (e) {
          return api.sendMessage("⚠️ Gửi thất bại. UID sai hoặc không nhận được tin nhắn.", event.threadID);
        }
      }
    }
  }
};
