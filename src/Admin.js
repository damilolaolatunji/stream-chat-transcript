import React, { useState, useEffect } from "react";
import {
  Chat,
  Channel,
  ChannelHeader,
  Window,
  MessageList,
  ChannelList,
  MessageInput,
  ChannelListMessenger,
  MessageTeam
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import axios from "axios";

import "stream-chat-react/dist/css/index.css";

let chatClient;
function Admin() {
  document.title = "Admin";
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const username = "admin";
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
            name: "Admin"
          },
          token
        );

        const channel = chatClient.channel("messaging", "livechat");

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
      <Chat client={chatClient} theme="messaging light">
        <ChannelList
          options={{
            subscribe: true,
            state: true
          }}
          filters={{
            type: "messaging"
          }}
          List={ChannelListMessenger}
        />
        <Channel channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList Message={MessageTeam} />
            <MessageInput focus />
          </Window>
        </Channel>
      </Chat>
    );
  }

  return <div></div>;
}

export default Admin;
