import React, { useState, useEffect } from "react";
import {
  Chat,
  Channel,
  Window,
  TypingIndicator,
  MessageList,
  MessageCommerce,
  MessageInput,
  MessageInputFlat,
  ChannelHeader
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import axios from "axios";

import "stream-chat-react/dist/css/index.css";

let chatClient;
function Customer() {
  document.title = "Customer service";
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const username = "customer";
    async function getToken() {
      try {
        const response = await axios.post("http://localhost:7000/join", {
          username
        });
        const token = response.data.token;
        chatClient = new StreamChat(response.data.api_key);

        chatClient.setUser(
          {
            id: username,
            name: "Customer"
          },
          token
        );

        const channel = chatClient.channel("messaging", "livechat", {
          name: "Customer support"
        });

        await channel.watch();
        setChannel(channel);
      } catch (err) {
        console.log(err);
        return;
      }
    }

    getToken();
  }, []);

  if (channel) {
    return (
      <Chat client={chatClient} theme="commerce light">
        <Channel channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList
              typingIndicator={TypingIndicator}
              Message={MessageCommerce}
            />
            <MessageInput Input={MessageInputFlat} focus />
          </Window>
        </Channel>
      </Chat>
    );
  }

  return <div></div>;
}

export default Customer;
