import React from 'react';
import styled from 'styled-components';
import Animated from 'animated/lib/targets/react-dom';
import { Text } from '@comba.se/ui';

// Data //
import plugins from 'data/plugins';

// Hooks //
import usePrevious from 'hooks/usePrevious';
import usePlugin from 'hooks/usePlugin';

// Forms //
import PluginForm from 'screens/Dashboard/forms/PluginForm';

// Components //
import Modal from 'shared/Modal';
import PluginDisplay from 'components/PluginDisplay';
import SectionTitle from 'shared/SectionTitle';

const Root = styled(Animated.div)`
    align-self: center;
    width: 100%;
    max-width: 504px;
    height: 100%;
    background-color: ${({ theme }) => theme.color.surface};
    box-shadow: 0px 4px 40px rgba(0, 0, 0, 0.16)}
    z-index: ${({ theme }) => theme.z.modal};
    overflow-x: hidden;
    overflow-y: scroll;

    @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
        height: auto;
        min-height: 400px;
        border-radius: ${({ theme }) => theme.borderRadius}px;
    }
`;

const Header = styled.div`
    padding: 40px;
`;

const Content = styled.div`
    padding: 0px 24px;

    @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
        padding: 0px 40px;
    }
`;

const Step = styled.div`
    & > ${Text} + ${Text} {
        margin-top: 4px;
    }
`;

const Steps = styled.div`
    padding: 20px 16px;
    & ${Step} + ${Step} {
        margin-top: 24px;
    }
`;

const FormWrapper = styled.div`
    padding: 16px;
`;

const renderSteps = (step, key) => (
    <Step {...{ key }}>
        <Text size={12} color="primary" weight="500">
            Step {key + 1}.
        </Text>
        <Text weight="500" color="alt_text">
            {step.text}
        </Text>
    </Step>
);

const PluginDetail = ({ anim, history, match }) => {
    const previousMatch = usePrevious(match);

    const slug =
        match || previousMatch
            ? match
                ? match.params.plugin
                : previousMatch.params.plugin
            : null;
    const [data, refetchPlugins, togglePlugin] = usePlugin(slug);
    const plugin = slug ? plugins[slug] : null;

    const style = {
        opacity: anim,
        transform: [
            {
                scale: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                }),
            },
            {
                translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [32, 0],
                }),
            },
        ],
    };
    return (
        <Modal
            open={!!match}
            animatedValue={anim}
            animated
            onClose={history.goBack}
        >
            {plugin ? (
                <Root {...{ style }}>
                    <Header>
                        <PluginDisplay
                            avatar={plugin.avatar}
                            available={plugin.available}
                            description={plugin.description}
                            showToggle={!!data}
                            enabled={data ? data.enabled : false}
                            onToggle={togglePlugin}
                            title={plugin.title}
                            titleSize={24}
                            url={plugin.url}
                        />
                    </Header>
                    <Content>
                        <SectionTitle title="Configuration" />
                        {plugin.steps.length ? (
                            <Steps>{plugin.steps.map(renderSteps)}</Steps>
                        ) : null}
                        {plugin.inputs.length ? (
                            <FormWrapper>
                                <PluginForm
                                    {...{ data }}
                                    slug={plugin.slug}
                                    fields={plugin.inputs}
                                    onSubmit={refetchPlugins}
                                />
                            </FormWrapper>
                        ) : null}
                    </Content>
                </Root>
            ) : (
                    <Root />
                )}
        </Modal>
    );
};

PluginDetail.defaultProps = {
    anim: new Animated.Value(0),
};

export default PluginDetail;
