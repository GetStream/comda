import React from "react";
import styled from "styled-components";

// CSS //
import pageCard from "styles/css/pageCard";

// Components //
import EmptyState from "shared/EmptyState";

const Root = styled.div`
  flex: 1;
  z-index: 2;
  background-color: ${({ theme }) => theme.color.surface};
  justify-content: center;
  align-items: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    ${pageCard}
  }
`;

export default ({ match }) => {
  return (
    <Root>
      <EmptyState text="Settings" />
    </Root>
  );
};
