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
    icon: 'fab fa-python',
    description: (
      <>
        No HTML, CSS, Javascript skills required. Build rich, interactive web apps using pure Python.
      </>
    ),
  },
  {
    title: 'Realtime Sync',
    icon: 'fas fa-stopwatch',
    description: (
      <>
        Broadcast live information, visualizations and graphics using Wave's low-latency realtime server.
      </>
    ),
  },
  {
    title: 'Collaborative Content',
    icon: 'fas fa-users',
    description: (
      <>
        Instant control over every connected web browser using a simple and intuitive programming model.
      </>
    ),
  },
  {
    title: 'Develop Quickly',
    icon: 'fas fa-laptop-code',
    description: (
      <>
        Preview your app live as you code. Dramatically reduce the time and effort to build web apps.
      </>
    ),
  },
  {
    title: 'Deploy Instantly',
    icon: 'fas fa-upload',
    description: (
      <>
        Easily share your apps with end-users, get feedback, improve and iterate.
      </>
    ),
  },
  {
    title: 'Run Anywhere',
    icon: 'fas fa-terminal',
    description: (
      <>
        ~10MB static executables for Linux, Windows, OSX, BSD, Solaris on AMD64, 386, ARM, PPC. Run it on a RPi Zero for great good!
      </>
    ),
  }
]

function Feature({ icon, title, description }) {
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <div><i class={icon}></i></div>
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
      description="Realtime Web Apps and Dashboards for Python">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">Make AI Apps</h1>
          <div style={{ margin: '1em 0' }}>
            <Link to={useBaseUrl('docs/getting-started')}>
              <img
                src='img/hero.png'
                alt='Screenshot'
                style={{
                  width: '100%',
                  maxWidth: 800,
                  boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
                }} />
            </Link>
          </div>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/getting-started')}>
              Get Started
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
