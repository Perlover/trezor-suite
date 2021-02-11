import React from 'react';
import { resolveStaticPath } from '@suite-utils/nextjs';
import { URLS } from '@suite-constants';
import Head from 'next/head';
import { useTranslation } from '@suite-hooks/useTranslation';

type Props = {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
};

const Metadata = ({
    title = 'Trezor Suite',
    description,
    image = `${URLS.SUITE_URL}${resolveStaticPath('images/meta.png')}`,
    url = URLS.SUITE_URL,
}: Props) => {
    const { translationString } = useTranslation();
    description = description || translationString('TR_SUITE_META_DESCRIPTION');
    return (
        <Head>
            <meta name="title" content={title} />
            <meta name="description" content={description} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />
        </Head>
    );
};

export default Metadata;
