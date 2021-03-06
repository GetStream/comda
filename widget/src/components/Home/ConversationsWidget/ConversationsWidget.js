import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { Card, EmptyState, FAB } from "@comba.se/ui";
import { InboxIcon } from "@comba.se/ui/Icons";
import { ThreadItem } from '@comba.se/chat';

// Utils //
import request from 'utils/request';

// Hooks //
import useAuth from 'hooks/useAuth';
import useChats from 'hooks/useChats';

// Components //
import CardHeader from 'components/CardHeader';
import CardFooter from 'components/CardFooter';

const Root = styled(Card)`
    width: 100%;  
`;

const List = styled.div`
    margin-top: 8px;
`

const EmptyWrapper = styled.div`
    margin-top: 32px;
    margin-bottom: 32px;
`

const NewConversationBtn = styled(FAB)`
    position: relative;
    bottom: 0;
    right: 0;
`

const renderThreads = (chats) => chats.length ? chats.map(({ channel: { id, data, partner }, ...rest }, index) => {
    console.log('chat', id, partner, data);
    return (
        <ThreadItem {...{ id, data, partner }} />
    )
}) : <EmptyWrapper><EmptyState text="No Conversations!" /></EmptyWrapper>;

const ThreadsWidget = ({ className }) => {
    const history = useHistory();
    const [{ organization, user }] = useAuth();
    const [chats, { error, loading }] = useChats();
    console.log(chats);
    const createNewConversation = useCallback(async () => {
        try {
            await request('v1/chats', 'post', {
                body: JSON.stringify({
                    meta: {
                        subject: "Chat",
                    },
                    refs: {
                        user: user._id,
                        agents: {
                            assignee: {
                                agent: "5e5f50e417fee2bee1092cc5"
                            }
                        },
                        organization: organization._id,
                    },
                })
            });
        } catch (error) {
            console.error(error);
        }
    }, []);
    return (
        <Root {...{ className }}>
            <CardHeader icon={InboxIcon} title="Conversations" />
            <List>
                {!loading ? renderThreads(chats) : (
                    <>
                        <ThreadItem />
                        <ThreadItem />
                        <ThreadItem />
                    </>
                )}
            </List>
            <CardFooter>
                <NewConversationBtn onClick={createNewConversation} disablePortal size={48} />
            </CardFooter>
        </Root>
    );
};

export default ThreadsWidget;