module.exports = {
  config: {
    name: "ketnot",
    version: "2.0",
    hasPermssion: 0,
    credits: "M",
    description: "Gửi tin nhắn ẩn danh đến UID bằng 1 dòng",
    commandCategory: "Tiện ích",
    usages: "!ketnot [uid] | [nội dung]",
    cooldowns: 5,
  },

  run: async ({ api, event, args }) => {
    const input = args.join(" ").split("|");

    if (input.length < 2) {
      return api.sendMessage(
        "❌ Sai cú pháp!\nDùng: !ketnot [UID] | [nội dung muốn gửi]",
        event.threadID
      );
    }

    const uid = input[0].trim();
    const message = input.slice(1).join("|").trim();

    if (!uid || !message)
      return api.sendMessage(
        "⚠️ Vui lòng nhập đầy đủ UID và nội dung.",
        event.threadID
      );

    try {
      await api.sendMessage(
        `📨 Bạn đã nhận được 1 tin nhắn ẩn danh:\n\n${message}`,
        uid
      );
      api.sendMessage("✅ Tin nhắn đã được gửi thành công!", event.threadID);
    } catch (e) {
      api.sendMessage(
        "❌ Không gửi được. UID có thể sai hoặc người nhận đã chặn bot.",
        event.threadID
      );
    }
  },
};
