import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: 'Know Python?',
    imageUrl: 'img/undraw_proud_coder.svg',
    description: (
      <>
        No HTML, CSS, Javascript skills required. Build rich, interactive web apps using pure Python.
      </>
    ),
  },
  {
    title: 'Realtime Sync',
    imageUrl: 'img/undraw_file_sync.svg',
    description: (
      <>
        Broadcast live information, visualizations and graphics using Q's low-latency realtime server.
      </>
    ),
  },
  {
    title: 'Collaborative Content',
    imageUrl: 'img/undraw_online_connection.svg',
    description: (
      <>
        Instant control over every connected web browser using a simple and intuitive programming model.
      </>
    ),
  },
  {
    title: 'Develop Quickly',
    imageUrl: 'img/undraw_dev_productivity.svg',
    description: (
      <>
        Preview your app live as you code. Dramatically reduce the time and effort to build web apps.
      </>
    ),
  },
  {
    title: 'Deploy Instantly',
    imageUrl: 'img/undraw_sharing_articles.svg',
    description: (
      <>
        Easily share your apps with end-users, get feedback, improve and iterate.
      </>
    ),
  },
  {
    title: 'Run Anywhere',
    imageUrl: 'img/undraw_going_up.svg',
    description: (
      <>
        ~10MB static executables for Linux, Windows, OSX, BSD, Solaris on AMD64, 386, ARM, PPC. Run it on a RPi Zero for great good!
      </>
    ),
  }
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">H<sub>2</sub>O Q</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/')}>
              Get Started ->
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
