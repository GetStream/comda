import React, { useCallback, useEffect, useMemo } from "react";
import styled from "styled-components";
import { Route } from "react-router-dom";
import { EmptyState, IconButton, LoadingState } from '@comba.se/ui';
import { ChatIcon, CloseIcon, CloseChatIcon, InfoIcon, TransferIcon } from "@comba.se/ui/Icons";
import Chat from "@comba.se/chat";

// CSS //
import pageCard from "styles/css/pageCard";

// Hooks //
import useAuth from "hooks/useAuth";

// HOCs //
import withChat from "@comba.se/chat/hocs/withChat";

// Views //
import SideDrawer from "../SideDrawer";

// Components //
const Root = styled.div`
  flex: 1;
  z-index: 2;
  background-color: ${({ theme }) => theme.color.surface};
  flex-direction: row;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    ${pageCard}
    margin-left: 375px;
    padding-right: ${({ drawerOpen }) => (drawerOpen ? 376 : 0)}px;
  }
`;

const EmptyRoot = styled(Root)`
  justify-content: center;
  align-items: center;
`;

const ChatWrapper = styled.div`
  width: 100%;
`;

// const dummyMessages = [
//     { system: true, text: 'Start of your conversation with Luke S.' },
// ];

// TODO: Extract all attachments stuff into a hook, useAttachmentsUploader,
// which uses useCurrentChannel internally to upload the images so we can
// include it in the input toolbar instead rather than pass the onAttachment
// and attachments array down through multiple components.

const MessageThread = ({
  channel,
  history,
  isPartnerTyping,
  match,
  loading,
  loadMoreMessages,
  messages,
  partner,
  read
}) => {
  const [{ user }] = useAuth();

  const markRead = useCallback(async () => {
    if (channel) {
      await channel.markRead();
    }
  }, [channel]);

  const headerActions = useMemo(
    () => [
      <IconButton color="alt_text" icon={CloseChatIcon} />,
      <IconButton
        color="alt_text"
        icon={TransferIcon}
        onClick={() => history.push(`${match.url}/transfer`)}
      />,
      <Route path={`/inbox/:channel/info`} children={props => {
        return (
          <IconButton
            color={match.isExact ? "alt_text" : 'red'}
            icon={match.isExact ? InfoIcon : CloseIcon}
            onClick={() => match.isExact ? history.push(`${match.url}/info`) : history.goBack()}
          />
        )
      }} />
    ],
    [history, match]
  );

  useEffect(() => {
    if (match && match.params.channel) {
      markRead();
    }
  }, [channel, match, markRead]);

  const onSend = useCallback(
    messages => {
      channel.sendMessage(messages[0]);
    },
    [channel]
  );

  if (!match) {
    return (
      <EmptyRoot>
        <EmptyState icon={ChatIcon} text="Select a thread." />
      </EmptyRoot>
    );
  }

  return loading ? (
    <LoadingState key="loading" />
  ) : (
      <Route
        path={`${match.url}`}
        children={({ match: { isExact } }) => {
          const drawerOpen = !isExact;
          return (
            <>
              <Root {...{ drawerOpen }}>
                <ChatWrapper>
                  <Chat
                    showTypingIndicator={isPartnerTyping}
                    onLoadMore={loadMoreMessages}
                    channelId={channel.id}
                    {...{
                      headerActions,
                      onSend,
                      messages,
                      partner,
                      read,
                      user
                    }}
                  />
                </ChatWrapper>
              </Root>
              <SideDrawer {...{ match, partner }} open={drawerOpen} />
            </>
          );
        }}
      />
    );
};

export default withChat(MessageThread);
