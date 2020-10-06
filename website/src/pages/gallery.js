import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
const examples = require('../../examples').slice(1);

export const Preview = ({ slug, title }) => {
  const
    exampleUrl = useBaseUrl(`docs/examples/${slug}`),
    imgUrl = useBaseUrl(`docs/examples/assets/${slug}.png`)
  return (
    <a href={exampleUrl}><div className='cover' style={{ backgroundImage: `url(${imgUrl})` }}></div>{title}</a>
  )
};

function Gallery() {
  return (
    <Layout
      title='Gallery'
      description='Examples'>
      <main>
        <div className='container margin-vert--lg padding-vert--lg'>
          <h1>Gallery</h1>
          <p>Welcome to the H2O Q Gallery! Each of these {examples.length} examples are as concise as possible, and demonstrate specific features of Q for your inspiration and learning.</p>
          <div className='gallery'>
            {examples.map(e => <Preview key={e.slug} title={e.title} slug={e.slug} />)}
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default Gallery;

