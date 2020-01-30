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
  withChannelContext
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import axios from "axios";

import "stream-chat-react/dist/css/index.css";

let chatClient;

async function sendTranscript(messages) {
  if (messages.length === 0) return;
  try {
    await axios.post("http://localhost:7000/transcript", {
      messages
    });
    alert("Transcript sent successfully");
  } catch (err) {
    alert("Sending failed");
    console.log(err);
  }
}

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
    const CustomChannelHeader = withChannelContext(
      class CustomChannelHeader extends React.PureComponent {
        render() {
          return (
            <div className="str-chat__header-livestream">
              <div className="str-chat__header-livestream-left">
                <p className="str-chat__header-livestream-left--title">
                  Customer Support Chat
                </p>
              </div>
              <div className="str-chat__header-livestream-right">
                <div className="str-chat__header-livestream-right-button-wrapper">
                  <button
                    className="logout"
                    onClick={() =>
                      sendTranscript(this.props.channel.state.messages)
                    }
                  >
                    Transcript
                  </button>
                </div>
              </div>
            </div>
          );
        }
      }
    );

    return (
      <Chat client={chatClient} theme="commerce light">
        <Channel channel={channel}>
          <Window>
            <CustomChannelHeader />
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
