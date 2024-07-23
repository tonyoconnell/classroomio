import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  head: (
    <>
      <link
        rel="shortcut icon"
        type="image/x-icon"
        href={`${process.env.imagePath}/img/favicon.ico`}
      />
      <link
        rel="icon"
        type="image/x-icon"
        sizes="16x16"
        href={`${process.env.imagePath}/img/logo-16.png`}
      />
      <link
        rel="icon"
        type="image/x-icon"
        sizes="32x32"
        href={`${process.env.imagePath}/img/logo-32.png`}
      />

      <title>ONE – Launch Your Online Bootcamp In Minutes</title>
      <meta
        name="description"
        content="Launch your bootcamp quickly and affordably with ONE, the customizable online teaching platform."
      />

      <meta property="og:url" content="https://one.ie/docs" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="ONE – Launch Your Online Bootcamp In Minutes" />
      <meta
        property="og:description"
        content="Launch your bootcamp quickly and affordably with ONE, the customizable online teaching platform."
      />
      <meta property="og:image" content="https://one.ie/classroomio-opengraph-image.png" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="one.ie" />
      <meta property="twitter:url" content="https://one.ie/docs" />
      <meta name="twitter:title" content="ONE – Launch Your Online Bootcamp In Minutes" />
      <meta
        name="twitter:description"
        content="Launch your bootcamp quickly and affordably with ONE, the customizable online teaching platform."
      />
      <meta name="twitter:creator" content="@classroomio" />
      <meta
        name="twitter:image"
        content="https://one.ie/classroomio-opengraph-image.png"
      />
    </>
  ),
  logo: (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src={`${process.env.imagePath}/img/logo-512.png`}
        alt={'ONE logo'}
        width={32}
        height={32}
      />
      <span style={{ marginLeft: '5px', lineHeight: '15px' }}>ONE Docs</span>
    </div>
  ),
  navbar: {
    extraContent: (
      <a
        style={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid gray',
          borderRadius: 5,
          padding: '2px 7px'
        }}
        href="https://app.one.ie"
      >
        Dashboard ↗
      </a>
    )
  },
  project: {
    link: 'https://github.com/rotimi-best/classroomio'
  },
  useNextSeoProps() {
    return {
      titleTemplate: 'ONE Documentation',
      openGraph: {
        siteName: 'ONE Docs',
        title: 'ONE Documentation',
        description:
          'Launch your bootcamp quickly and affordably with ONE, the customizable online teaching platform.',
        images: [
          {
            url: `${process.env.imagePath}/img/logo-16.png`,
            width: 16,
            height: 16,
            alt: 'ONE Docs Og Image Alt',
            type: 'image/png'
          },
          {
            url: `${process.env.imagePath}/img/logo-32.png`,
            width: 32,
            height: 32,
            alt: 'ONE Docs Og Image Alt',
            type: 'image/png'
          },
          {
            url: `${process.env.imagePath}/img/logo-192.png`,
            width: 192,
            height: 192,
            alt: 'ONE Docs Og Image Alt',
            type: 'image/png'
          },
          {
            url: `${process.env.imagePath}/img/logo-512.png`,
            width: 512,
            height: 512,
            alt: 'ONE Docs Og Image Alt',
            type: 'image/png'
          },
          { url: `${process.env.imagePath}/img/og-image.png'` }
        ],
        twitter: {
          handle: '@classroomio',
          site: '@one.ie',
          cardType: 'summary_large_image'
        }
      }
    };
  },
  chat: {
    link: 'https://dub.sh/ciodiscord'
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    autoCollapse: false
  },
  docsRepositoryBase: 'https://github.com/rotimi-best/classroomio/tree/main/apps/docs',
  footer: {
    text: 'ONE Docs'
  }
};

export default config;
