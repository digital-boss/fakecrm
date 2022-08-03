import { faker } from '@faker-js/faker';
import fs from "node:fs";

const write = (json) => {
  const str = JSON.stringify(json, undefined, 2);
  fs.writeFileSync('data/data.json', str, 'utf-8');
}

const tags = ['tech', 'social', 'travel', 'fun'];

const seq = (count) => [...Array(count).keys()]

const pickTags = () => {
  const t = [...tags];
  const num = faker.datatype.number({min: 0, max: 2});
  return seq(num).map(() => {
    const i = faker.datatype.number({min: 0, max: t.length-1});
    return t.splice(i, 1);
  })
}

const getCommentDates = (postDate) => {
  const toDate = new Date(postDate.setMonth(postDate.getMonth()+5));
  const count = faker.datatype.number({min: 0, max: 10});
  return faker.date.betweens(postDate, toDate, count)
}

const newComment = (post, dates, index) => {

  return {
    id: index + 1,
    postId: post.id,
    author: faker.name.findName(),
    createTime: dates[index],
    content: faker.random.words(faker.datatype.number({min: 10, max: 80})),
  }
}

const newPost = (dates) => (index) => {
  const commentsCount = faker.datatype.number({min: 0, max: 8});
  const post = {
    id: index + 1,
    title: faker.company.catchPhrase(),
    createTime: dates[index],
    tags: pickTags(),
    author: faker.name.findName(),
    content: faker.random.words(faker.datatype.number({min: 20, max: 200})),
  }
  const commentDates = getCommentDates(post.createTime)
  post.comments = seq(commentsCount).map(i => newComment(post, commentDates, i))
  return post;
}

const postsCount = 10;
const postDates = faker.date.betweens('2022-01-01', '2022-08-01', postsCount)

const data = seq(10).map(newPost(postDates));
write(data);