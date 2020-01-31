import React from 'react';
import styled from 'styled-components';

// Components //
import Text from 'shared/Text';

const Root = styled.div`
    flex-direction: row;
    padding-bottom: 8px;
    border-bottom: 1px solid ${({ theme }) => theme.color.border};
`;

const SectionTitle = ({ title }) => (
    <Root>
        <Text color="alt_text" faded weight="500">
            {title}
        </Text>
    </Root>
);

export default SectionTitle;