import React, { useCallback, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Route, Switch } from 'react-router-dom';
import { FAB, Portal } from '@comba.se/ui';
import { InboxIcon } from '@comba.se/ui/Icons';
import Animated from 'animated/lib/targets/react-dom';
import { animated, useSpring } from 'react-spring';
import { useStore } from 'contexts/Store';
import { useAuth } from 'contexts/Auth';
import { ScrollAnimationProvider } from 'contexts/ScrollAnimation';

// Screens //
import Home from 'screens/Home';
import Thread from 'screens/Thread';

// Components //
import Credit from 'components/Credit';
import Header from 'components/Header';
import Transitioner from 'components/Transitioner'

const Undersheet = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
`;

const WidgetRoot = styled(animated.div)`
    position: fixed;
    bottom: 120px;
    right: 32px;
    width: 400px;
    height: 600px;
    border-radius: ${({ theme }) => theme.borderRadius}px;
    background-color: ${({ theme }) => theme.color.surface};
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.16);
    overflow: hidden;
    z-index: 9;
`

const Wrapper = styled.div`
    flex: 1;
`;

const ScrollWrapper = styled.div`
   flex: 1;
    overflow: hidden;
    overflow-y: scroll;
    
    &::-webkit-scrollbar {
        width: 0px;  /* Remove scrollbar space */
        background: transparent;  /* Optional: just make scrollbar invisible */
    }
`

const Launcher = styled(FAB)`
    position: fixed;
`

const renderHeader = ({ match }) => (
    <Header shrunk={!!match} match={match} />
)

const Root = ({ location, match }) => {
    const [scrollRef, setScrollRef] = useState(null);

    const [mounted, setMounted] = useState(false);
    const transitionAnim = useMemo(() => new Animated.Value(0), []);

    const [{ isOpen }, { toggleWidget }] = useStore();
    const { value: anim } = useSpring({
        value: isOpen ? 1 : 0, config: { mass: 1, friction: 20, tension: 300 }, onRest: ({ value }) => {
            if (value === 0) {
                setMounted(false);
            }
        }
    })

    const toggleOpen = useCallback(() => {
        if (!mounted) {
            setMounted(true);
            toggleWidget();
        } else {
            toggleWidget();
        }
    }, []);

    const handleScrollRef = useCallback((el) => {
        if (!scrollRef && el) {
            setScrollRef(el);
        }
    }, []);

    const renderThread = useCallback((props) => (
        <Thread {...props} transitionAnim={transitionAnim} />
    ), [transitionAnim]);

    const renderHome = useCallback((props) => (
        <ScrollWrapper ref={handleScrollRef}>
            <Home {...props} transitionAnim={transitionAnim} />
        </ScrollWrapper>
    ), [handleScrollRef, transitionAnim]);

    const renderCredit = useCallback(({ match }) => {
        return <Credit hasShadow={match} />
    }, [])


    const style = useMemo(() => ({
        transform: anim.interpolate({
            range: [0, 1],
            output: [24, 0],
        }).interpolate(v => `translate3d(0, ${v}px, 0)`),
        opacity: anim
    }), [anim]);

    return (
        <>
            {isOpen ? <Undersheet onClick={toggleWidget} /> : null}
            <Portal unmount={!mounted}>
                <ScrollAnimationProvider target={scrollRef}>
                    <WidgetRoot style={style}>
                        <Wrapper>
                            <Transitioner anim={transitionAnim} atParent={match.isExact}>
                                <Switch location={location}>
                                    <Route path="/:channelId" render={renderThread} />
                                    <Route path="/" render={renderHome} />
                                </Switch>
                            </Transitioner>
                            <Route path="/:channelId" children={renderHeader} />
                        </Wrapper>
                        <Route path="/:channelId" children={renderCredit} />
                    </WidgetRoot>
                </ScrollAnimationProvider>
            </Portal>
            <Launcher icon={InboxIcon} onClick={toggleOpen} />
        </>
    )
}

export default Root;