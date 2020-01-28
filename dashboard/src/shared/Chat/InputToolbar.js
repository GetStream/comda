import React, { useEffect } from 'react';
import styled from 'styled-components';

// Components //
import Container from 'shared/Container';
import Composer from './Composer';

const Root = styled(Container)`
    flex-direction: row;
    align-items: center;
    padding-top: 16px;
    padding-bottom: 16px;
    border-top: 1px solid ${({ theme }) => theme.color.border};
    @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
        padding-right: 88px;
    }
`;

const InputToolbar = ({ onSend, placeholder }) => {
    return (
        <Root maxWidth={840}>
            {/* {renderActions(props)} */}
            <Composer {...{ onSend, placeholder }} />
            {/* {renderComposer(props)} */}
            {/* {renderSend(props)} */}
        </Root>
    );
};

export default InputToolbar;
