import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Card, Fill, IconButton, Text } from '@comba.se/ui';
import { SettingsIcon } from "@comba.se/ui/Icons";

// Hooks //
import usePlugin from 'hooks/usePlugin';

// Utils //
import history from 'utils/history';

// Components //
import PluginDisplay from 'components/PluginDisplay';

const Root = styled(Card)`
    padding: 20px;
    flex: 1;
    & ${Text} {
        user-select: none;
    }
`;

const Footer = styled.div`
    margin-top: 16px;
    flex-direction: row;
    justify-content: flex-end;
`;

const PluginCard = ({ avatar, available, description, slug, title, url }) => {
    const [data, refetch, togglePlugin] = usePlugin(slug); // eslint-disable-line no-unused-vars
    return (
        <Root border flat>
            <PluginDisplay
                showToggle={!!data}
                enabled={data ? data.enabled : false}
                {...{ avatar, available, description, title, url }}
                onToggle={togglePlugin}
            />
            <Fill />
            <Footer>
                <IconButton
                    disabled={!available}
                    onClick={() => history.push(`/plugins/${slug}`)}
                    icon={SettingsIcon}
                    size={16}
                    color="alt_text"
                />
            </Footer>
        </Root>
    );
};

PluginCard.propTypes = {
    avatar: PropTypes.string,
    description: PropTypes.string,
    slug: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string,
};

export default memo(PluginCard);
