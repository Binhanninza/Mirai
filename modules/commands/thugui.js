module.exports = {
  config: {
    name: "thugui",
    version: "1.0",
    hasPermssion: 0,
    credits: "M",
    description: "Gửi thư ẩn danh đến người khác bằng UID",
    commandCategory: "Tình cảm",
    usages: "!thugui [uid] | [nội dung]",
    cooldowns: 5,
  },

  run: async ({ api, event, args }) => {
    const input = args.join(" ").split("|");

    if (input.length < 2) {
      return api.sendMessage(
        "📮 Dùng như sau:\n!thugui [UID] | [nội dung thư]",
        event.threadID
      );
    }

    const uid = input[0].trim();
    const message = input.slice(1).join("|").trim();

    if (!uid || !message)
      return api.sendMessage("⚠️ Vui lòng nhập đủ UID và nội dung.", event.threadID);

    try {
      await api.sendMessage(
        `💌 Bạn vừa nhận được 1 bức thư ẩn danh:\n\n"${message}"\n\n— Người gửi giấu tên 🌸`,
        uid
      );
      api.sendMessage("✅ Thư của bạn đã được gửi đến nơi an toàn!", event.threadID);
    } catch (e) {
      api.sendMessage(
        "❌ Không thể gửi thư. UID có thể không tồn tại hoặc đã chặn bot.",
        event.threadID
      );
    }
  },
};
