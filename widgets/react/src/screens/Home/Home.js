import React from "react";
import styled from "styled-components";

// Components //
import Container from "components/Container";
import Card from "components/Card";
import CardHeader from "components/CardHeader";
import Header from "components/Header";
import ThreadItem from "components/ThreadItem";
import Text from "components/Text";

const Root = styled.div`
  flex: 1;
`;

const Wrapper = styled(Container)`
  margin-top: -72px;
  padding-bottom: ${({ theme }) => theme.gutter}px;
`;

const Home = () => {
  return (
    <Root>
      <Header />
      <Wrapper>
        <Card>
          <CardHeader title="Conversations">
            <Text size={12} color="primary">
              5 total
            </Text>
          </CardHeader>
          <ThreadItem />
          <ThreadItem />
          <ThreadItem />
        </Card>
      </Wrapper>
    </Root>
  );
};

export default Home;
