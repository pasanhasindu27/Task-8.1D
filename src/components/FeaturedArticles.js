import React from 'react';
import { Card, Header } from 'semantic-ui-react';
import CardItem from './CardItem';
import { fakerEN as faker } from '@faker-js/faker';

const articles = Array.from({ length: 3 }).map(() => ({
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  image: `https://picsum.photos/300/200?random=${Math.random()}`,
  rating: '5',
  author: faker.person.fullName()
}));

export default function FeaturedArticles() {
  return (
    <>
      <Header as="h2" style={{ marginTop: '2em' }}>Featured Articles</Header>
      <Card.Group itemsPerRow={3}>
        {articles.map((item, idx) => (
          <CardItem key={idx} {...item} />
        ))}
      </Card.Group>
    </>
  );
}
