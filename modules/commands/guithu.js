const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "guithu",
    version: "3.0",
    hasPermssion: 0,
    credits: "M",
    description: "Gửi thư ẩn danh đến UID hoặc link FB (có ảnh, emoji, chữ ký)",
    commandCategory: "Tình cảm",
    usages: "!guithu [uid/link] | [nội dung] | [tên người gửi (tùy chọn)]",
    cooldowns: 5,
  },

  run: async ({ api, event, args }) => {
    const emojiList = ["💌", "📮", "💖", "📩", "❤️", "✉️"];
    const emoji = emojiList[Math.floor(Math.random() * emojiList.length)];

    const input = args.join(" ").split("|").map(i => i.trim());
    if (input.length < 2) {
      return api.sendMessage(
        `📬 Dùng: !guithu [UID/link FB] | [nội dung] | [tên người gửi (tuỳ chọn)]\nVD:\n!guithu https://fb.com/abcxyz | Em là mặt trời của anh... ☀️ | Long đẹp trai`,
        event.threadID
      );
    }

    let rawUID = input[0];
    let message = input[1];
    let senderName = input[2] || "Người giấu tên 🌸";

    // Tìm UID nếu là link FB
    let uid = rawUID;
    if (rawUID.includes("facebook.com")) {
      try {
        const res = await axios.get(`https://id.atpsoftware.vn/api/get-id?url=${encodeURIComponent(rawUID)}`);
        if (res?.data?.id) uid = res.data.id;
        else return api.sendMessage("❌ Không tìm được UID từ link Facebook đó.", event.threadID);
      } catch {
        return api.sendMessage("🚫 Lỗi khi tìm UID từ link.", event.threadID);
      }
    }

    // Nếu có đính ảnh
    let attachment = [];
    if (event.messageReply?.attachments?.[0]?.type === "photo") {
      try {
        const imgUrl = event.messageReply.attachments[0].url;
        const imgPath = path.join(__dirname, "cache", `${Date.now()}.jpg`);

        const res = await axios.get(imgUrl, { responseType: "stream" });
        await new Promise((resolve, reject) => {
          const writer = res.data.pipe(fs.createWriteStream(imgPath));
          writer.on("finish", resolve);
          writer.on("error", reject);
        });

        attachment.push(fs.createReadStream(imgPath));
        setTimeout(() => fs.unlinkSync(imgPath), 60 * 1000);
      } catch (e) {
        console.log("Lỗi tải ảnh:", e);
      }
    }

    const fullMsg = `─────────────────────────────\n${emoji} Bạn vừa nhận được 1 bức thư ẩn danh:\n─────────────────────────────\n\n"${message}"\n\n— Gửi từ: ${senderName}`;

    try {
      await api.sendMessage({ body: fullMsg, attachment }, uid);
      api.sendMessage("✅ Thư của bạn đã được gửi đến nơi cần đến! 💌", event.threadID);
    } catch {
      api.sendMessage("❌ Không gửi được thư. UID có thể sai hoặc không thể nhận tin nhắn.", event.threadID);
    }
  },
};
